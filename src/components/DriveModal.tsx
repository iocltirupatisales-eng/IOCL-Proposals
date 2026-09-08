import React, { useState, useEffect } from 'react';
import { 
  googleSignIn, 
  googleLogout, 
  initAuth, 
  getAccessToken,
  saveProposalToDrive, 
  listProposalsFromDrive, 
  retrieveProposalFromDrive, 
  deleteProposalFromDrive,
  DriveProposalItem,
  DRIVE_FOLDER_NAME 
} from '../utils/googleDrive';
import { ProposalData } from '../types';
import { 
  Cloud, 
  CloudUpload, 
  FolderSync, 
  Download, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Search, 
  FileText,
  UserCheck,
  LogOut
} from 'lucide-react';
import { User } from 'firebase/auth';

interface DriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProposal: ProposalData;
  currentTemplateId: string;
  currentSiteName: string;
  onProposalRetrieved: (proposal: ProposalData, templateId: string, siteName: string) => void;
}

export const DriveModal: React.FC<DriveModalProps> = ({
  isOpen,
  onClose,
  currentProposal,
  currentTemplateId,
  currentSiteName,
  onProposalRetrieved,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [proposals, setProposals] = useState<DriveProposalItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken || null);
        if (accessToken) {
          fetchDriveFiles(accessToken);
        }
      },
      () => {
        setUser(null);
        setToken(null);
        setProposals([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchDriveFiles = async (accessToken: string) => {
    try {
      setLoading(true);
      const list = await listProposalsFromDrive(accessToken);
      setProposals(list);
    } catch (err: any) {
      console.error('Failed to list files:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Could not load files from Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await fetchDriveFiles(res.accessToken);
        setStatusMessage({ type: 'success', text: `Connected as ${res.user.email}` });
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Google Drive authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await googleLogout();
    setUser(null);
    setToken(null);
    setProposals([]);
    setStatusMessage(null);
  };

  const handleSaveToDrive = async () => {
    if (!token) {
      handleSignIn();
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await saveProposalToDrive(
        token,
        currentProposal,
        currentTemplateId,
        currentSiteName || currentProposal.location
      );

      setStatusMessage({
        type: 'success',
        text: `Proposal for "${currentSiteName || currentProposal.location}" successfully saved to Google Drive!`,
      });

      // Refresh list
      await fetchDriveFiles(token);
    } catch (err: any) {
      console.error('Save to Drive error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to save to Google Drive.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRetrieve = async (item: DriveProposalItem) => {
    if (!token) return;

    try {
      setLoading(true);
      setStatusMessage(null);
      const retrieved = await retrieveProposalFromDrive(token, item.id);
      onProposalRetrieved(retrieved.proposalData, retrieved.templateId, retrieved.siteName);
      setStatusMessage({
        type: 'success',
        text: `Retrieved and loaded proposal for "${retrieved.siteName}" into your workspace!`,
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Retrieval error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to retrieve proposal from Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!token) return;

    try {
      setLoading(true);
      await deleteProposalFromDrive(token, fileId);
      setProposals((prev) => prev.filter((p) => p.id !== fileId));
      setDeleteConfirmId(null);
      setStatusMessage({
        type: 'success',
        text: `File "${fileName}" deleted from Google Drive.`,
      });
    } catch (err: any) {
      console.error('Delete error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to delete file from Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredProposals = proposals.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.templateId && p.templateId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Google Drive Proposal Storage & Archive
              </h2>
              <p className="text-xs text-zinc-500">
                Auto-saves and retrieves executive proposal notes directly from your Google Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth / Account Bar */}
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-2">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center text-xs font-bold">
                {user.email ? user.email.charAt(0).toUpperCase() : 'G'}
              </div>
              <div className="text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">{user.displayName || 'Google Account'}</span>
                <span className="text-zinc-500 text-[11px]">{user.email}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Sign in with Google to enable automatic Drive backups and note retrieval
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleSaveToDrive}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>Save Current Note</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSignOut}
                  title="Disconnect Google Drive"
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-600 transition-colors text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5" />
                )}
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`mx-5 my-2.5 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!user ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
                <FolderSync className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Access Your Cloud Proposal Archive
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Connect your Google account to automatically store generated proposal notes in a dedicated "IOCL Retail Outlet Proposals" folder and retrieve past site files anytime.
                </p>
              </div>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <Cloud className="w-4 h-4" />
                <span>Connect Google Drive</span>
              </button>
            </div>
          ) : (
            <>
              {/* Search & Actions Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search stored proposals by site, location, or template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() => token && fetchDriveFiles(token)}
                  disabled={loading}
                  title="Refresh Drive files"
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FolderSync className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Proposals List */}
              {loading && proposals.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Scanning Google Drive folder...</span>
                </div>
              ) : filteredProposals.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                  <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {searchTerm ? 'No matching proposal notes found' : 'No proposal notes saved in Google Drive yet'}
                  </div>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                    Click "Save Current Note" above to archive the active site proposal directly into your Google Drive folder.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 font-medium">
                    <span>Stored Notes in "IOCL Retail Outlet Proposals" ({filteredProposals.length})</span>
                    <span>Action</span>
                  </div>

                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                    {filteredProposals.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {item.location || item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                              {item.templateId || 'Template Note'}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                            <span>Saved: {new Date(item.modifiedTime).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Size: {item.size}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1.5 p-1 bg-red-50 dark:bg-red-950/60 rounded-lg border border-red-200 dark:border-red-900">
                              <span className="text-[10px] font-semibold text-red-700 dark:text-red-300">Confirm Delete?</span>
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRetrieve(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                                title="Retrieve and load this proposal into the workspace"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Retrieve & Open</span>
                              </button>

                              {item.webViewLink && (
                                <a
                                  href={item.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                  title="Open in Google Drive in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <button
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Delete from Google Drive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500">
            Storage Target: Google Drive / <strong>{DRIVE_FOLDER_NAME}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
