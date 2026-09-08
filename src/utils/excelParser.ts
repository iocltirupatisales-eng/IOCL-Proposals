import * as XLSX from 'xlsx';
import { ProposalData } from '../types';
import { calculateLeaseSchedule, sampleProposals } from '../sampleData';

// Mapping dictionary between typical Excel header names / keys and ProposalData fields
const KEY_MAP: Record<string, keyof ProposalData> = {
  // Document
  templaterefno: 'templateRefNo',
  template_ref: 'templateRefNo',
  templatecode: 'templateRefNo',
  documentdate: 'documentDate',
  doc_date: 'documentDate',
  date: 'documentDate',
  proposaltitle: 'proposalTitle',

  // Subject
  tenuretype: 'tenureType',
  tenure: 'tenureType',
  location: 'location',
  sitename: 'location',
  advertisedlocation: 'location',
  proposedresitedlocation: 'location',
  district: 'district',
  state: 'state',
  category: 'category',

  // Basic Info - 1. Advt
  advtlocationsno: 'advtLocationSNo',
  locationsno: 'advtLocationSNo',
  advtsno: 'advtLocationSNo',
  advtlocationname: 'advtLocationName',
  retailsalesarea: 'retailSalesArea',
  rsa: 'retailSalesArea',
  divisionaloffice: 'divisionalOffice',
  do: 'divisionalOffice',
  stateoffice: 'stateOffice',
  so: 'stateOffice',
  srmpyear: 'srmpYear',
  srmp: 'srmpYear',
  dateofadvertisement: 'dateOfAdvertisement',
  advtdate: 'dateOfAdvertisement',
  corrigendumdetails: 'corrigendumDetails',
  corrigendum: 'corrigendumDetails',
  markettype: 'marketType',
  regularrural: 'marketType',
  classofmarket: 'classOfMarket',
  marketclass: 'classOfMarket',
  roadtype: 'roadType',
  roadclassification: 'roadType',
  typeofroad: 'roadType',
  corpusfundscheme: 'corpusFundScheme',
  corpusfund: 'corpusFundScheme',

  // Selection / LOI / Dealer
  selectionmode: 'selectionMode',
  modeofselection: 'selectionMode',
  selection: 'selectionMode',
  bidamount: 'bidAmount',
  applicantname: 'applicantName',
  selectedapplicant: 'applicantName',
  selecteddealername: 'applicantName',
  applicant: 'applicantName',
  dealername: 'applicantName',
  constitution: 'constitution',
  ascapprovaldate: 'ascApprovalDate',
  ascdate: 'ascApprovalDate',
  lecdate: 'lecDate',
  lecstatus: 'lecStatus',
  lecobservations: 'lecObservations',
  fvcdate: 'fvcDate',
  fvcstatus: 'fvcStatus',
  fvcobservations: 'fvcObservations',
  loiapprovaldate: 'loiApprovalDate',
  loicomments: 'loiComments',
  loidate: 'loiDate',

  // Land Details
  landgroup: 'landGroup',
  group: 'landGroup',
  landdoctype: 'landDocType',
  ownershipdoc: 'landDocType',
  leasebalanceperiod: 'leaseBalancePeriod',
  landownername: 'landownerName',
  landowner: 'landownerName',
  relationshipwithapplicant: 'relationshipWithApplicant',
  relationship: 'relationshipWithApplicant',
  isloiholder: 'isLoiHolder',
  surveyno: 'surveyNo',
  newsurveyno: 'surveyNo',
  landsurveyno: 'surveyNo',
  surveykhasrano: 'surveyNo',
  khata: 'surveyNo',
  khasra: 'surveyNo',
  surveyremarks: 'surveyRemarks',
  plotfrontage: 'plotFrontage',
  frontage: 'plotFrontage',
  frontagem: 'plotFrontage',
  plotdepth: 'plotDepth',
  depth: 'plotDepth',
  depthm: 'plotDepth',
  plotareasqm: 'plotAreaSqm',
  newplotsize: 'plotAreaSqm',
  newsiteareasqm: 'plotAreaSqm',
  plotsize: 'plotAreaSqm',
  area: 'plotAreaSqm',

  // Rent Negotiation & Valuation
  negotiationdate: 'negotiationDate',
  committeemembers: 'committeeMembers',
  quotedarea: 'quotedArea',
  quotedamount: 'quotedAmount',
  agreedareasqm: 'agreedAreaSqm',
  agreedmonthlyrent: 'agreedRentMonthly',
  agreedbaserentrsmo: 'agreedRentMonthly',
  monthlyrent: 'agreedRentMonthly',
  dealerleaserent: 'agreedRentMonthly',
  monthlyleaserentalrs: 'agreedRentMonthly',
  newagreedrentrsmo: 'agreedRentMonthly',
  rentamount: 'agreedRentMonthly',
  agreedrentpersqm: 'agreedRentPerSqm',
  rentrate: 'agreedRentPerSqm',
  gststatus: 'gstStatus',
  gst: 'gstStatus',
  escalationpercent: 'escalationPercent',
  escalationrate: 'escalationPercent',
  escalation: 'escalationPercent',
  escalationfrequency: 'escalationFrequency',
  leaseperiodyears: 'leasePeriodYears',
  tenureyears: 'leasePeriodYears',
  leaseperiod: 'leasePeriodYears',
  advancepayment: 'advancePayment',
  bffamount: 'bffAmount',

  valuer1name: 'valuer1Name',
  valuer1monthlyrent: 'valuer1MonthlyRent',
  valuer1rentrec: 'valuer1MonthlyRent',
  valuer2name: 'valuer2Name',
  valuer2monthlyrent: 'valuer2MonthlyRent',
  valuer2rentrec: 'valuer2MonthlyRent',

  // Financials & MIRR
  materialcostlacs: 'materialCostLacs',
  omcequipmentcapex: 'materialCostLacs',
  equipmentcostlacs: 'materialCostLacs',
  materialcost: 'materialCostLacs',
  constructioncostlacs: 'constructionCostLacs',
  constructioncost: 'constructionCostLacs',
  contingencycostlacs: 'contingencyCostLacs',
  statutorycostlacs: 'statutoryCostLacs',
  totalbelacs: 'totalBeLacs',
  totalbecapitaloutlay: 'totalBeLacs',
  totalcapitaloutlay: 'totalBeLacs',
  resitementcapex: 'totalBeLacs',
  resitementcapexrslacs: 'totalBeLacs',
  augmentationcapex: 'totalBeLacs',
  totalcapexrslacs: 'totalBeLacs',
  totalbe: 'totalBeLacs',
  capitaloutlay: 'totalBeLacs',
  mirrrefno: 'mirrRefNo',
  calculatedmirrpercent: 'calculatedMirrPercent',
  calculatedmirr: 'calculatedMirrPercent',
  projectirrmirr: 'calculatedMirrPercent',
  newsitemirr: 'calculatedMirrPercent',
  mirr: 'calculatedMirrPercent',
  sensitivitymirrpercent: 'sensitivityMirrPercent',
  mirr10vol: 'sensitivityMirrPercent',
  mirrsensitivity: 'sensitivityMirrPercent',
  mirrbenchmarkmet: 'mirrBenchmarkMet',
  benchmarkmet: 'mirrBenchmarkMet',

  // Legal
  stampduty: 'stampDuty',
  registrationcharges: 'registrationCharges',
  legalmiscexpenses: 'legalMiscExpenses',
  advocatefeesexpenses: 'advocateFeesExpenses',
  registrationstampexp: 'registrationStampExp',
  grossrentaloutgo: 'grossRentalOutgo',

  // Proposals & Scope
  businessobjectivetext: 'businessObjectiveText',
  justificationforshifting: 'businessObjectiveText',
  reasonforresitement: 'businessObjectiveText',
  archetype: 'archetype',
  facilitiestanksdus: 'facilitiesTanksDUs',
  facilitiestobeaugmented: 'facilitiesTanksDUs',
  facilitiesinfrastructure: 'facilitiesInfrastructure',
  facilitiesdriveway: 'facilitiesDriveway',
  facilitieselectrical: 'facilitiesElectrical',
  facilitiesrvi: 'facilitiesRvi',
  facilitiesmisc: 'facilitiesMisc',

  // Statutory
  dmdcnocstatus: 'dmDcNocStatus',
  nhainocstatus: 'nhaiNocStatus',
  landnaclustatus: 'landNaCluStatus',
  pesoapprovalref: 'pesoApprovalRef',
  pesoapprovalplan: 'pesoApprovalRef',
  pesoapprovaldate: 'pesoApprovalDate',

  // RS-02/A Govt Organization specific keys
  govtorgname: 'govtOrgName',
  agencyname: 'govtOrgName',
  organizationname: 'govtOrgName',
  nameofgovtorganization: 'govtOrgName',
  govtorganization: 'govtOrgName',
  govtorganizationname: 'govtOrgName',
  govtorgtype: 'govtOrgType',
  typeofgovtorganization: 'govtOrgType',
  typeofthegovtorganization: 'govtOrgType',
  organizationtype: 'govtOrgType',
  basisofoffer: 'basisOfOffer',
  offerletterref: 'offerLetterRef',
  offerletter: 'offerLetterRef',
  villagetalukacity: 'villageTalukaCity',
  village: 'villageTalukaCity',
  taluka: 'villageTalukaCity',
  city: 'villageTalukaCity',
  typeofro: 'typeOfRo',
  retailsalesareaoffice: 'retailSalesAreaOffice',
  leccommitteenominationapproval: 'lecCommitteeNominationApproval',
  lecreportdetails: 'lecReportDateAndObservations',
  lecreportdateandobservations: 'lecReportDateAndObservations',
  drshnominationapproval: 'drshNominationApproval',
  drshcommitteerecommendations: 'drshCommitteeRecommendations',
  srhnominationapproval: 'srhNominationApproval',
  authorizedrepnominated: 'authorizedRepNominated',
  authorizedrepresentative: 'authorizedRepNominated',
  authorizedrepinterviewed: 'authorizedRepInterviewed',
  sitedevtype: 'siteDevTypeA',
  sitedevtypea: 'siteDevTypeA',
  landownershipstatuscontrol: 'landOwnershipStatusControl',
  landownershipstatus: 'landOwnershipStatusControl',
  financialcapability: 'financialCapabilityWorkingCapital',
  financialcapabilityworkingcapital: 'financialCapabilityWorkingCapital',
  capabilitytooperate: 'capabilityToOperateDealership',
  capabilitytooperatedealership: 'capabilityToOperateDealership',
  profitmakingstatus: 'profitMakingStatusReport',
  profitmakingstatusreport: 'profitMakingStatusReport',
  willingnesstocontinue20years: 'willingnessToContinue20Years',
  selectioncommitteefinalrecommendation: 'selectionCommitteeFinalRecommendation',
  committeerecommendation: 'selectionCommitteeFinalRecommendation',
};

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export interface ParsedWorkbookResult {
  sheetNames: string[];
  detectedTemplateId?: string;
  sites: {
    siteName: string;
    data: ProposalData;
  }[];
}

export function parseExcelWorkbook(
  fileBuffer: ArrayBuffer,
  defaultBaseData?: ProposalData,
  currentTemplateId?: string
): ParsedWorkbookResult {
  const workbook = XLSX.read(fileBuffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const sites: { siteName: string; data: ProposalData }[] = [];

  const baseTemplate: ProposalData = defaultBaseData
    ? JSON.parse(JSON.stringify(defaultBaseData))
    : JSON.parse(JSON.stringify(sampleProposals['yerpedu-tirupati']));

  // Prefer data sheets like 'Site_Input_Table', 'Sites_Master_Table', or first sheet
  let targetSheetName = sheetNames[0];
  const preferredSheets = ['Site_Input_Table', 'Sites_Master_Table', 'Sheet1', 'Proposals'];
  for (const p of preferredSheets) {
    if (sheetNames.includes(p)) {
      targetSheetName = p;
      break;
    }
  }

  const sheet = workbook.Sheets[targetSheetName];
  if (!sheet) {
    return { sheetNames, sites: [{ siteName: 'Default Site', data: baseTemplate }] };
  }

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rawRows.length === 0) {
    return { sheetNames, sites: [{ siteName: 'Default Site', data: baseTemplate }] };
  }

  // Detect Template code in file content if present
  let detectedTemplateId: string | undefined = currentTemplateId;
  rawRows.forEach((r) => {
    r.forEach((cell) => {
      const s = String(cell || '').toUpperCase();
      if (s.includes('RS-01/A')) detectedTemplateId = 'RS-01/A';
      else if (s.includes('RS-01/D')) detectedTemplateId = 'RS-01/D';
      else if (s.includes('RS-02/A') || s.includes('GOVT. ORGANIZATIONS') || s.includes('GOVERNMENT ORG')) detectedTemplateId = 'RS-02/A';
      else if (s.includes('RS-01/B')) detectedTemplateId = 'RS-01/B';
      else if (s.includes('RS-02/CC')) detectedTemplateId = 'RS-02/CC';
      else if (s.includes('RS-03/AUG')) detectedTemplateId = 'RS-03/AUG';
    });
  });

  // Is it Key-Value? (Usually 2 columns, where col 0 has strings like 'Location', 'District', etc.)
  const isKeyValue =
    rawRows.length > 5 &&
    rawRows.every((r) => r.length <= 4) &&
    rawRows.some((r) => {
      const k = normalizeKey(String(r[0] || ''));
      return k.includes('location') || k.includes('district') || k.includes('applicant');
    });

  if (isKeyValue) {
    const data: ProposalData = JSON.parse(JSON.stringify(baseTemplate));

    rawRows.forEach((row) => {
      if (!row || row.length < 2) return;
      const keyStr = normalizeKey(String(row[0] || ''));
      const valStr = String(row[1] !== undefined && row[1] !== null ? row[1] : '').trim();
      if (!keyStr || !valStr) return;

      const field = KEY_MAP[keyStr];
      if (field && typeof data[field] === 'string') {
        (data as any)[field] = valStr;
      }
    });

    const rentNum = parseFloat(String(data.agreedRentMonthly).replace(/[^0-9.]/g, '')) || 50000;
    const escNum = parseFloat(String(data.escalationPercent).replace(/[^0-9.]/g, '')) || 10;
    data.leaseSchedules = calculateLeaseSchedule(rentNum, escNum, 5, 30, 18);
    const grossRent = data.leaseSchedules.reduce((a, b) => a + b.totalPeriodRent, 0);
    data.grossRentalOutgo = grossRent.toLocaleString('en-IN');

    sites.push({
      siteName: data.location || 'Key-Value Proposal',
      data,
    });
  } else {
    // Row-based multi-site sheet where Row 0 is header
    const headers = (rawRows[0] || []).map((h) => normalizeKey(String(h || '')));
    const dataRows = rawRows
      .slice(1)
      .filter((r) => r.some((cell) => cell !== '' && cell !== null && cell !== undefined));

    if (dataRows.length === 0) {
      sites.push({ siteName: 'Site 1', data: baseTemplate });
    } else {
      dataRows.forEach((row, idx) => {
        const data: ProposalData = JSON.parse(JSON.stringify(baseTemplate));

        headers.forEach((headerKey, colIdx) => {
          const val = row[colIdx];
          if (val === undefined || val === null || val === '') return;
          const valStr = String(val).trim();

          const field = KEY_MAP[headerKey];
          if (field && typeof data[field] === 'string') {
            (data as any)[field] = valStr;
          }
        });

        // Auto calculate lease schedule
        const rentNum = parseFloat(String(data.agreedRentMonthly).replace(/[^0-9.]/g, '')) || 50000;
        const escNum = parseFloat(String(data.escalationPercent).replace(/[^0-9.]/g, '')) || 10;
        data.leaseSchedules = calculateLeaseSchedule(rentNum, escNum, 5, 30, 18);
        const grossRent = data.leaseSchedules.reduce((a, b) => a + b.totalPeriodRent, 0);
        data.grossRentalOutgo = grossRent.toLocaleString('en-IN');

        const siteLabel = data.location
          ? `${data.location} (${data.district || 'RO'})`
          : `Site ${idx + 1}`;

        sites.push({
          siteName: siteLabel,
          data,
        });
      });
    }
  }

  return { sheetNames, detectedTemplateId, sites };
}
