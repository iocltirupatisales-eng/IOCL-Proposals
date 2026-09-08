import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ProposalData } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

// Cache the access token in memory
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User is logged in to Firebase, but access token might need re-prompt if expired
        // We notify caller that a user exists
        if (onAuthSuccess) onAuthSuccess(user, '');
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveProposalItem {
  id: string;
  name: string;
  templateId?: string;
  location?: string;
  dateCreated?: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  proposalData?: ProposalData;
}

export const DRIVE_FOLDER_NAME = 'IOCL Retail Outlet Proposals';

/**
 * Finds or creates the dedicated proposals folder in user's Google Drive
 */
export async function getOrCreateProposalsFolder(token: string): Promise<string> {
  // Check if folder exists
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${DRIVE_FOLDER_NAME}' and trashed=false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    throw new Error('Could not search Google Drive. Please re-authenticate.');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Directory for auto-generated IOCL / OMC Retail Outlet Proposal Notes and Archives.',
    }),
  });

  if (!createRes.ok) {
    throw new Error('Failed to create proposal directory on Google Drive.');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

/**
 * Saves a proposal note to Google Drive
 */
export async function saveProposalToDrive(
  token: string,
  proposal: ProposalData,
  templateId: string,
  siteName: string
): Promise<{ fileId: string; fileName: string; webViewLink?: string }> {
  const folderId = await getOrCreateProposalsFolder(token);

  const safeSite = (siteName || proposal.location || 'RO_Proposal').replace(/[/\\?%*:|"<>]/g, '-');
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `Proposal_${templateId}_${safeSite}_${dateStr}.json`;

  const payload = {
    metadata: {
      templateId,
      siteName,
      location: proposal.location,
      district: proposal.district,
      state: proposal.state,
      advtLocationSNo: proposal.advtLocationSNo,
      createdAt: new Date().toISOString(),
      appVersion: '1.0.0',
      totalBeLacs: proposal.totalBeLacs,
      mirrPercent: proposal.calculatedMirrPercent,
      rentMonthly: proposal.agreedRentMonthly,
    },
    proposalData: proposal,
  };

  const fileContent = JSON.stringify(payload, null, 2);

  // Check if file with same name already exists in this folder to update or create
  const checkQuery = encodeURIComponent(`'${folderId}' in parents and name='${fileName}' and trashed=false`);
  const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${checkQuery}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let existingFileId: string | null = null;
  if (checkRes.ok) {
    const checkJson = await checkRes.json();
    if (checkJson.files && checkJson.files.length > 0) {
      existingFileId = checkJson.files[0].id;
    }
  }

  let fileId = '';
  let webViewLink = '';

  if (existingFileId) {
    // Update existing file content
    const updateRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: fileContent,
    });

    if (!updateRes.ok) {
      throw new Error('Failed to update existing proposal file on Google Drive.');
    }
    const updateData = await updateRes.json();
    fileId = updateData.id;
  } else {
    // Multipart create file in folder
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataPart = {
      name: fileName,
      mimeType: 'application/json',
      parents: [folderId],
      description: `Executive Proposal Note for ${proposal.location} under template ${templateId}`,
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadataPart) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!createRes.ok) {
      throw new Error('Failed to upload proposal note to Google Drive.');
    }

    const createdData = await createRes.json();
    fileId = createdData.id;
    webViewLink = createdData.webViewLink;
  }

  return { fileId, fileName, webViewLink };
}

/**
 * Lists all proposal notes saved in the Google Drive folder
 */
export async function listProposalsFromDrive(token: string): Promise<DriveProposalItem[]> {
  try {
    const folderId = await getOrCreateProposalsFolder(token);

    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false and (mimeType='application/json' or name contains 'Proposal_')`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&fields=files(id,name,mimeType,modifiedTime,size,webViewLink,description)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error('Could not retrieve proposals from Google Drive.');
    }

    const data = await res.json();
    const files: any[] = data.files || [];

    return files.map((f) => {
      // Parse file name pattern Proposal_[templateId]_[location]_[date].json
      const parts = f.name.replace(/\.json$/i, '').split('_');
      let templateId = 'RS-01/A';
      let location = 'Retail Outlet';
      if (parts.length >= 3) {
        templateId = parts[1];
        location = parts.slice(2, -1).join(' ') || parts[2];
      }

      return {
        id: f.id,
        name: f.name,
        templateId,
        location,
        modifiedTime: f.modifiedTime,
        size: f.size ? `${(parseInt(f.size) / 1024).toFixed(1)} KB` : 'N/A',
        webViewLink: f.webViewLink,
      };
    });
  } catch (err: any) {
    console.error('Error listing proposals from Drive:', err);
    throw err;
  }
}

/**
 * Retrieves and parses a specific proposal note JSON from Google Drive
 */
export async function retrieveProposalFromDrive(token: string, fileId: string): Promise<{ proposalData: ProposalData; templateId: string; siteName: string }> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to download proposal content from Google Drive.');
  }

  const json = await res.json();

  if (json.proposalData) {
    return {
      proposalData: json.proposalData,
      templateId: json.metadata?.templateId || 'RS-01/A',
      siteName: json.metadata?.siteName || json.proposalData.location || 'Retrieved RO Site',
    };
  } else {
    // If raw ProposalData directly
    return {
      proposalData: json as ProposalData,
      templateId: 'RS-01/A',
      siteName: (json as ProposalData).location || 'Retrieved RO Site',
    };
  }
}

/**
 * Deletes a proposal note file from Google Drive (Requires explicit confirmation from UI)
 */
export async function deleteProposalFromDrive(token: string, fileId: string): Promise<boolean> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to delete file from Google Drive.');
  }

  return true;
}
