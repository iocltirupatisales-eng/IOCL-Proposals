import { ProposalData } from '../types';
import { sampleProposals, calculateLeaseSchedule } from '../sampleData';

export interface ExcelColumnDef {
  key: string;
  label: string;
  category: 'Subject & Info' | 'Selection & Dealer' | 'Land & Lease' | 'Sales & Trading' | 'Financials & Capex' | 'Statutory';
  required: boolean;
  sampleValue: string;
  description: string;
}

export interface ProposalTemplate {
  id: string;
  code: string;
  title: string;
  shortName: string;
  category: string;
  description: string;
  tenureDefault: string;
  doaApprover: string;
  badgeColor: string;
  iconName: string;
  sampleKey: string;
  suggestedExcelColumns: ExcelColumnDef[];
  getInitialData: () => ProposalData;
}

// Columns for RS-01/A
const RS01A_COLUMNS: ExcelColumnDef[] = [
  { key: 'Location', label: 'Advertised Location', category: 'Subject & Info', required: true, sampleValue: 'Yerpedu Bypass on NH-71', description: 'Exact advertised location name and stretch' },
  { key: 'District', label: 'District', category: 'Subject & Info', required: true, sampleValue: 'Tirupati', description: 'Administrative district of the site' },
  { key: 'State', label: 'State', category: 'Subject & Info', required: true, sampleValue: 'Andhra Pradesh', description: 'State of operation' },
  { key: 'Category', label: 'Category', category: 'Subject & Info', required: true, sampleValue: 'Open (Regular)', description: 'Reservation category e.g., Open, SC/ST, OBC, Rural KSK' },
  { key: 'Retail Sales Area', label: 'Retail Sales Area (RSA)', category: 'Subject & Info', required: true, sampleValue: 'Tirupati RSA', description: 'Sales area jurisdiction' },
  { key: 'Divisional Office', label: 'Divisional Office', category: 'Subject & Info', required: true, sampleValue: 'Tirupati DO', description: 'Parent Divisional Office' },
  { key: 'Road Type', label: 'Road Classification', category: 'Subject & Info', required: true, sampleValue: 'NH-71 (National Highway)', description: 'National Highway, State Highway, MDR, etc.' },
  { key: 'Advt SNo', label: 'Advt S.No.', category: 'Subject & Info', required: false, sampleValue: '214/AP/2023', description: 'Serial number in newspaper advertisement' },
  { key: 'Applicant Name', label: 'Selected Applicant', category: 'Selection & Dealer', required: true, sampleValue: 'Shri B. Rajesh Naidu', description: 'Name of the selected candidate / firm' },
  { key: 'Constitution', label: 'Constitution', category: 'Selection & Dealer', required: false, sampleValue: 'Individual / Proprietorship', description: 'Proprietorship, Partnership, etc.' },
  { key: 'Selection Mode', label: 'Mode of Selection', category: 'Selection & Dealer', required: false, sampleValue: 'Draw of Lots / Bidding', description: 'Selection methodology' },
  { key: 'Survey No', label: 'Survey / Khasra No.', category: 'Land & Lease', required: true, sampleValue: 'Sy. No. 412/2B & 412/3', description: 'Revenue survey or khata number' },
  { key: 'Plot Area Sqm', label: 'Plot Area (sq.m)', category: 'Land & Lease', required: true, sampleValue: '2025', description: 'Total agreed plot area in sq. meters' },
  { key: 'Plot Frontage', label: 'Frontage (m)', category: 'Land & Lease', required: true, sampleValue: '45.00', description: 'Highway frontage width in meters' },
  { key: 'Plot Depth', label: 'Depth (m)', category: 'Land & Lease', required: true, sampleValue: '45.00', description: 'Plot depth in meters' },
  { key: 'Landowner Name', label: 'Landowner Name', category: 'Land & Lease', required: true, sampleValue: 'Smt. K. Sarojamma & Others', description: 'Registered titleholder of the land' },
  { key: 'Agreed Monthly Rent', label: 'Agreed Base Rent (Rs/mo)', category: 'Land & Lease', required: true, sampleValue: '55000', description: 'Monthly lease rent before GST' },
  { key: 'Escalation (%)', label: 'Escalation Rate (%)', category: 'Land & Lease', required: true, sampleValue: '10', description: 'Percentage escalation (e.g. 10% every 5 yrs)' },
  { key: 'Lease Period', label: 'Tenure (Years)', category: 'Land & Lease', required: true, sampleValue: '30 Years', description: 'Long term lease period' },
  { key: 'Valuer 1 Monthly Rent', label: 'Valuer 1 Rent Rec.', category: 'Land & Lease', required: false, sampleValue: '58000', description: 'Independent Govt Approved Valuer 1 rate' },
  { key: 'Valuer 2 Monthly Rent', label: 'Valuer 2 Rent Rec.', category: 'Land & Lease', required: false, sampleValue: '60000', description: 'Independent Govt Approved Valuer 2 rate' },
  { key: 'Material Cost (Lacs)', label: 'Material Cost (Rs. Lacs)', category: 'Financials & Capex', required: true, sampleValue: '88.50', description: 'Tanks, pumps, signage, automation equipment' },
  { key: 'Construction Cost (Lacs)', label: 'Construction Cost (Rs. Lacs)', category: 'Financials & Capex', required: true, sampleValue: '72.00', description: 'Paving, sales bldg, driveway, electrical, drainage' },
  { key: 'Total BE (Lacs)', label: 'Total BE Capital Outlay', category: 'Financials & Capex', required: true, sampleValue: '179.28', description: 'Total capital budget estimate in Rs. Lacs' },
  { key: 'Calculated MIRR (%)', label: 'Calculated MIRR (%)', category: 'Financials & Capex', required: true, sampleValue: '16.42', description: 'Modified Internal Rate of Return' },
  { key: 'Sensitivity MIRR (%)', label: 'MIRR @ -10% Vol', category: 'Financials & Capex', required: false, sampleValue: '14.15', description: 'MIRR under negative volume sensitivity' },
  { key: 'DM DC NOC Status', label: 'DM / DC NOC Status', category: 'Statutory', required: false, sampleValue: 'Applied; under verification by Rev. Dept', description: 'District Collector NOC status' },
  { key: 'NHAI NOC Status', label: 'NHAI NOC Status', category: 'Statutory', required: false, sampleValue: 'In-Principle approved by PD Tirupati', description: 'Ministry of Road Transport / NHAI status' },
  { key: 'PESO Approval Ref', label: 'PESO Approval / Plan', category: 'Statutory', required: false, sampleValue: 'Plan drawing submitted to Jt CCE Chennai', description: 'Petroleum & Explosives Safety Org ref' },
];

// Columns for RS-01/D (Development of new B-site RO under SRMP - 7 pages)
const RS01D_COLUMNS: ExcelColumnDef[] = [
  { key: 'Location', label: 'Advertised Location', category: 'Subject & Info', required: true, sampleValue: 'Palamaner Rural on NH-42', description: 'Advertised location for B-site RO' },
  { key: 'District', label: 'District', category: 'Subject & Info', required: true, sampleValue: 'Chittoor', description: 'District of site' },
  { key: 'State', label: 'State', category: 'Subject & Info', required: true, sampleValue: 'Andhra Pradesh', description: 'State' },
  { key: 'Category', label: 'Category', category: 'Subject & Info', required: true, sampleValue: 'Open', description: 'Reservation category' },
  { key: 'Retail Sales Area', label: 'Retail Sales Area (RSA)', category: 'Subject & Info', required: true, sampleValue: 'Chittoor RSA', description: 'Sales area jurisdiction' },
  { key: 'Divisional Office', label: 'Divisional Office', category: 'Subject & Info', required: true, sampleValue: 'Tirupati DO', description: 'Divisional Office' },
  { key: 'Road Type', label: 'Abutting Road Type', category: 'Subject & Info', required: true, sampleValue: 'NH-42 (National Highway)', description: 'NH/SH/MDR/ODR' },
  { key: 'Applicant Name', label: 'Selected Applicant', category: 'Selection & Dealer', required: true, sampleValue: 'Shri K. Murali Mohan', description: 'Selected dealer applicant' },
  { key: 'Survey No', label: 'Land Survey No.', category: 'Land & Lease', required: true, sampleValue: 'Sy. No. 254/1A & 254/1B', description: 'Survey or Khata number' },
  { key: 'Plot Area Sqm', label: 'Plot Area (sqm)', category: 'Land & Lease', required: true, sampleValue: '1225', description: 'Offered plot area in sqm' },
  { key: 'Plot Frontage', label: 'Frontage (m)', category: 'Land & Lease', required: true, sampleValue: '35.00', description: 'Frontage width in meters' },
  { key: 'Plot Depth', label: 'Depth (m)', category: 'Land & Lease', required: true, sampleValue: '35.00', description: 'Depth in meters' },
  { key: 'Material Cost (Lacs)', label: 'Material Cost by IOC', category: 'Financials & Capex', required: true, sampleValue: '62.50', description: 'OMC equipment capex (Tanks, DUs, Signage)' },
  { key: 'Construction Cost (Lacs)', label: 'Construction Cost', category: 'Financials & Capex', required: true, sampleValue: '18.00', description: 'Driveway/pump island works by IOC' },
  { key: 'Total BE (Lacs)', label: 'Total BE Capital Outlay', category: 'Financials & Capex', required: true, sampleValue: '86.50', description: 'Total capital budget estimate' },
  { key: 'Calculated MIRR (%)', label: 'Calculated MIRR (%)', category: 'Financials & Capex', required: true, sampleValue: '15.80', description: 'Modified Internal Rate of Return' },
];

// Columns for RS-02/A (Issuance of LOI to Govt Organizations - 5 pages)
const RS02A_COLUMNS: ExcelColumnDef[] = [
  { key: 'Govt Org Name', label: 'Govt Organization Name', category: 'Subject & Info', required: true, sampleValue: 'APSRTC (Andhra Pradesh State Road Transport Corporation)', description: 'Name of the applying Govt Organization' },
  { key: 'Govt Org Type', label: 'Type of Govt Organization', category: 'Subject & Info', required: true, sampleValue: 'State PSU / Statutory Corporation', description: 'Central Govt / State Govt / PSU / Municipal Corp / etc.' },
  { key: 'Basis of Offer', label: 'Basis of Offer', category: 'Subject & Info', required: true, sampleValue: 'Direct Offer received on Nomination basis', description: 'Nomination basis or Bidding' },
  { key: 'Offer Letter Ref', label: 'Offer Letter Ref & Date', category: 'Subject & Info', required: true, sampleValue: 'APSRTC/COMM/RO/2026/04 dtd. 14.07.2026', description: 'Official reference of request' },
  { key: 'Location', label: 'Offered Location', category: 'Subject & Info', required: true, sampleValue: 'APSRTC Bus Station Complex, Tirupati Central', description: 'Offered location' },
  { key: 'District', label: 'District', category: 'Subject & Info', required: true, sampleValue: 'Tirupati', description: 'District' },
  { key: 'State', label: 'State', category: 'Subject & Info', required: true, sampleValue: 'Andhra Pradesh', description: 'State' },
  { key: 'Survey No', label: 'Survey No. / Plot Reference', category: 'Land & Lease', required: true, sampleValue: 'R.S. No. 58/2A', description: 'Survey reference' },
  { key: 'Plot Area Sqm', label: 'Plot Area (sqm)', category: 'Land & Lease', required: true, sampleValue: '1600', description: 'Area in square meters' },
  { key: 'Type of RO', label: 'Type of RO', category: 'Subject & Info', required: true, sampleValue: 'Regular', description: 'Regular or Rural' },
  { key: 'Class of Market', label: 'Class of Market', category: 'Subject & Info', required: true, sampleValue: 'A', description: 'A/B/C/D1/D2/E' },
  { key: 'Authorized Representative', label: 'Nominated Authorized Rep', category: 'Selection & Dealer', required: true, sampleValue: 'Shri P. Venkateswara Rao, Regional Manager', description: 'Name & Designation' },
  { key: 'Site Dev Type', label: 'Site Development Option', category: 'Subject & Info', required: true, sampleValue: 'Develop as A-Site (Long Lease)', description: 'A-Site / B-Site with 2PL / SSLF' },
  { key: 'Financial Capability', label: 'Financial Capability Detail', category: 'Financials & Capex', required: true, sampleValue: 'Banker letter specifying working capital arrangement / Balance Sheet', description: 'Financial verification' },
];

// Columns for RS-01/B (Corpus Fund / Dealer Land)
const RS01B_COLUMNS: ExcelColumnDef[] = [
  { key: 'Location', label: 'Advertised Location', category: 'Subject & Info', required: true, sampleValue: 'Kuppam Rural on SH-116', description: 'Location of Corpus Fund / "B" Site' },
  { key: 'District', label: 'District', category: 'Subject & Info', required: true, sampleValue: 'Chittoor', description: 'Administrative district' },
  { key: 'State', label: 'State', category: 'Subject & Info', required: true, sampleValue: 'Andhra Pradesh', description: 'State' },
  { key: 'Category', label: 'Category', category: 'Subject & Info', required: true, sampleValue: 'SC / Corpus Fund Scheme (Rural KSK)', description: 'CFS reservation category' },
  { key: 'Applicant Name', label: 'Selected Dealer Name', category: 'Selection & Dealer', required: true, sampleValue: 'Shri M. Venkataswamy', description: 'Dealer / LOI holder name' },
  { key: 'Corpus Fund Scheme', label: 'CFS Applicable', category: 'Selection & Dealer', required: true, sampleValue: 'Yes', description: 'Whether Corpus Fund financial assistance provided' },
  { key: 'Survey No', label: 'Land Survey No.', category: 'Land & Lease', required: true, sampleValue: 'Sy. No. 182/4A', description: 'Dealer owned / leased land survey number' },
  { key: 'Plot Area Sqm', label: 'Plot Area (sq.m)', category: 'Land & Lease', required: true, sampleValue: '1250', description: 'Land area for "B" site' },
  { key: 'Dealer Lease Rent', label: 'Monthly Lease Rental (Rs)', category: 'Land & Lease', required: true, sampleValue: '15000', description: 'Fixed lease rent paid to dealer/landowner' },
  { key: 'Equipment Cost (Lacs)', label: 'OMC Equipment Capex', category: 'Financials & Capex', required: true, sampleValue: '65.20', description: 'Tanks, DUs, automation provided by OMC' },
  { key: 'Working Capital Loan', label: 'CFS Loan Amount (Lacs)', category: 'Financials & Capex', required: true, sampleValue: '25.00', description: 'Working capital loan provided under CFS' },
  { key: 'Total BE (Lacs)', label: 'Total Capital Outlay', category: 'Financials & Capex', required: true, sampleValue: '98.50', description: 'Total OMC investment' },
  { key: 'Calculated MIRR (%)', label: 'Calculated MIRR (%)', category: 'Financials & Capex', required: true, sampleValue: '15.80', description: 'Project MIRR' },
  { key: 'Projected Sales MS', label: 'Monthly MS Volume (KL)', category: 'Sales & Trading', required: true, sampleValue: '45', description: 'Monthly petrol throughput' },
  { key: 'Projected Sales HSD', label: 'Monthly HSD Volume (KL)', category: 'Sales & Trading', required: true, sampleValue: '120', description: 'Monthly diesel throughput' },
];

// Columns for RS-02/CC (Resitement & Reconstitution)
const RS02CC_COLUMNS: ExcelColumnDef[] = [
  { key: 'Old RO Name', label: 'Existing RO Name & Code', category: 'Subject & Info', required: true, sampleValue: 'M/s Sri Venkateswara Fuels (RO Code: 142089)', description: 'Existing operating outlet' },
  { key: 'Location', label: 'Proposed Resited Location', category: 'Subject & Info', required: true, sampleValue: 'Renigunta Bypass on NH-716', description: 'New proposed location' },
  { key: 'District', label: 'District', category: 'Subject & Info', required: true, sampleValue: 'Tirupati', description: 'District' },
  { key: 'Reason For Resitement', label: 'Justification for Shifting', category: 'Subject & Info', required: true, sampleValue: 'Construction of Elevated Corridor / NHAI Bypass causing complete loss of traffic frontage', description: 'Highway acquisition, flyover, unviable' },
  { key: 'Past 3Yr MS Avg', label: 'Past 3-Year Avg MS (KLPM)', category: 'Sales & Trading', required: true, sampleValue: '35', description: 'Historical petrol sales' },
  { key: 'Past 3Yr HSD Avg', label: 'Past 3-Year Avg HSD (KLPM)', category: 'Sales & Trading', required: true, sampleValue: '85', description: 'Historical diesel sales' },
  { key: 'New Plot Area Sqm', label: 'New Site Area (sq.m)', category: 'Land & Lease', required: true, sampleValue: '2500', description: 'Area of newly offered land' },
  { key: 'New Survey No', label: 'New Land Survey No.', category: 'Land & Lease', required: true, sampleValue: 'Sy. No. 89/1B & 89/2', description: 'New plot survey reference' },
  { key: 'New Agreed Rent', label: 'New Agreed Rent (Rs/mo)', category: 'Land & Lease', required: true, sampleValue: '62000', description: 'Negotiated monthly rent' },
  { key: 'Resitement Capex', label: 'Resitement Capex (Rs. Lacs)', category: 'Financials & Capex', required: true, sampleValue: '125.00', description: 'Civil shifting + equipment dismantling/re-erection' },
  { key: 'Calculated MIRR (%)', label: 'New Site MIRR (%)', category: 'Financials & Capex', required: true, sampleValue: '17.20', description: 'Return on new capital investment' },
];

// Columns for RS-03/AUG (Augmentation & Additional Facilities)
const RS03AUG_COLUMNS: ExcelColumnDef[] = [
  { key: 'RO Name', label: 'Existing RO Name', category: 'Subject & Info', required: true, sampleValue: 'M/s Balaji Highway Service (RO Code: 154210)', description: 'Operating retail outlet name' },
  { key: 'Location', label: 'Location & Highway', category: 'Subject & Info', required: true, sampleValue: 'Srikalahasti Bypass on NH-71', description: 'Geographic location' },
  { key: 'Current Throughput', label: 'Current Total Volume (KLPM)', category: 'Sales & Trading', required: true, sampleValue: '380 KLPM (MS: 110, HSD: 270)', description: 'Existing sales volume' },
  { key: 'Facilities Proposed', label: 'Facilities to be Augmented', category: 'Subject & Info', required: true, sampleValue: '1x20KL HSD Tank + 1x4 MPD + 2-Bay Canopy Extension + 60kW DC EV Fast Charger', description: 'Specific augmentation scope' },
  { key: 'Incremental Sales', label: 'Expected Incremental Vol (KL)', category: 'Sales & Trading', required: true, sampleValue: '65 KLPM (MS: 20, HSD: 45)', description: 'Anticipated volume boost' },
  { key: 'Augmentation Capex', label: 'Total Capex (Rs. Lacs)', category: 'Financials & Capex', required: true, sampleValue: '54.50', description: 'Augmentation capital outlay' },
  { key: 'Payback Period', label: 'Simple Payback (Years)', category: 'Financials & Capex', required: true, sampleValue: '2.8 Years', description: 'Investment recovery period' },
  { key: 'MIRR (%)', label: 'Project IRR / MIRR (%)', category: 'Financials & Capex', required: true, sampleValue: '21.50', description: 'Financial return rate' },
];

export const TEMPLATES_REGISTRY: ProposalTemplate[] = [
  {
    id: 'RS-01/A',
    code: 'RS-01/A',
    title: 'Development of new A-site RO under SRMP',
    shortName: 'A-Site RO Lease (9 Pages)',
    category: 'Company Leased Land ("A" Site)',
    description: 'Official 9-page executive proposal note for taking land on Long Term Lease / Outright Purchase under SRMP. Features 30-year lease schedule, 2-valuer rent negotiation, complete civil/material BE capex, MIRR feasibility, and full DOA delegation.',
    tenureDefault: 'Long Term Lease (30 Years)',
    doaApprover: 'Executive Director (RS) / CH(RB)',
    badgeColor: 'red',
    iconName: 'Building2',
    sampleKey: 'yerpedu-tirupati',
    suggestedExcelColumns: RS01A_COLUMNS,
    getInitialData: () => JSON.parse(JSON.stringify(sampleProposals['yerpedu-tirupati'])),
  },
  {
    id: 'RS-01/D',
    code: 'RS-01/D',
    title: 'Development of new B-site RO under SRMP',
    shortName: 'B-Site RO (7 Pages)',
    category: 'Dealer Owned Land ("B" Site)',
    description: 'Official 7-page executive approval note for development of new B-site RO on dealer-owned land under SRMP. Features dealer land particulars, legal opinion, equipment capex by IOC, and project MIRR.',
    tenureDefault: 'Dealer Owned ("B" Site)',
    doaApprover: 'State Head (SRH) / ED (State Office)',
    badgeColor: 'amber',
    iconName: 'ShieldCheck',
    sampleKey: 'chandragiri-chittoor',
    suggestedExcelColumns: RS01D_COLUMNS,
    getInitialData: () => {
      const base: ProposalData = JSON.parse(JSON.stringify(sampleProposals['chandragiri-chittoor']));
      base.templateRefNo = 'RS-01/D dtd. 01.09.2026';
      base.proposalTitle = 'Development of new B-site RO under SRMP';
      base.location = 'Palamaner Rural on NH-42';
      base.district = 'Chittoor';
      base.state = 'Andhra Pradesh';
      base.category = 'Open';
      base.marketType = 'Rural';
      base.classOfMarket = 'D1';
      base.roadType = 'NH-42 (National Highway)';
      base.tenureType = 'Dealer Owned ("B" Site)';
      base.applicantName = 'Shri K. Murali Mohan';
      base.surveyNo = 'Sy. No. 254/1A & 254/1B';
      base.plotFrontage = '35.00';
      base.plotDepth = '35.00';
      base.plotAreaSqm = '1225';
      base.materialCostLacs = '62.50';
      base.constructionCostLacs = '18.00';
      base.contingencyCostLacs = '3.50';
      base.statutoryCostLacs = '2.50';
      base.totalBeLacs = '86.50';
      base.calculatedMirrPercent = '15.80';
      base.sensitivityMirrPercent = '13.40';
      base.mirrBenchmarkMet = 'Yes';
      return base;
    },
  },
  {
    id: 'RS-02/A',
    code: 'RS-02/A',
    title: 'Issuance of LOI for award of RO Dealership to Govt. Organizations',
    shortName: 'Govt Org Dealership (5 Pages)',
    category: 'Govt. Category Dealership',
    description: 'Official 5-page executive approval note for award of retail outlet dealership under Govt-Category to State PSUs, Municipal Corporations, or Urban Authorities under Policy 255-09/2017.',
    tenureDefault: 'Govt Nomination / Long Lease',
    doaApprover: 'Country Head (Retail Business) - CH(RB)',
    badgeColor: 'emerald',
    iconName: 'Building2',
    sampleKey: 'yerpedu-tirupati',
    suggestedExcelColumns: RS02A_COLUMNS,
    getInitialData: () => {
      const base: ProposalData = JSON.parse(JSON.stringify(sampleProposals['yerpedu-tirupati']));
      base.templateRefNo = 'RS-02/A dtd. 01.09.2026';
      base.proposalTitle = 'Issuance of LOI for award of RO Dealership to Govt. Organizations';
      base.location = 'APSRTC Bus Station Complex, Tirupati Central';
      base.district = 'Tirupati';
      base.state = 'Andhra Pradesh';
      base.govtOrgName = 'Andhra Pradesh State Road Transport Corporation (APSRTC)';
      base.govtOrgType = 'State PSU / Statutory Corporation';
      base.basisOfOffer = 'Direct Offer received on Nomination basis';
      base.offerLetterRef = 'APSRTC/COMM/RO/2026/04 dtd. 14.07.2026';
      base.surveyNo = 'R.S. No. 58/2A (Bus Station Commercial Zone)';
      base.villageTalukaCity = 'Tirupati Urban';
      base.plotFrontage = '40.00';
      base.plotDepth = '40.00';
      base.plotAreaSqm = '1600';
      base.typeOfRo = 'Regular';
      base.classOfMarket = 'A';
      base.roadType = '4-Lane City Arterial Road abutting Bus Station';
      base.retailSalesAreaOffice = 'Tirupati RSA / Tirupati DO / TAPSO';
      base.lecCommitteeNominationApproval = 'TIR/RO/LEC/2026-08 dtd. 20.07.2026; Members: 1. Shri V. Suresh (SDRSM) 2. Shri K. Anand (Manager RE)';
      base.lecReportDateAndObservations = '28.07.2026: Land found fully suitable as per IRC:12 and OMC LEC parameters. Clear 40m frontage with no overhead HT lines.';
      base.drshNominationApproval = 'TDO/COMM/2026/51 dtd. 02.08.2026; Members: 1. Shri R. Karthik (AM-RS) 2. Shri P. N. Rao (DM-RS) 3. Shri T. Ramesh (RE Officer)';
      base.drshCommitteeRecommendations = 'Recommended for further process for setting up of Retail Outlet under Govt Category as per Policy 255-09/2017.';
      base.srhNominationApproval = 'TAPSO/RS/GOVT/2026/12 dtd. 10.08.2026; 1. Shri A. K. Sharma (DRSH Tirupati) 2. Shri B. V. Raman (DGM-Retail, TAPSO) 3. Shri M. S. Rao (Chief Manager Finance, TAPSO)';
      base.authorizedRepNominated = 'Shri P. Venkateswara Rao, Regional Manager (APSRTC Tirupati Region) vide letter dtd. 12.08.2026';
      base.authorizedRepInterviewed = 'Shri P. Venkateswara Rao, Regional Manager (APSRTC)';
      base.siteDevTypeA = 'Long Lease (30 Years)';
      base.landOwnershipStatusControl = 'Land in exclusive physical possession and legal ownership of APSRTC under Govt Grant with clear unencumbered title.';
      base.financialCapabilityWorkingCapital = 'State PSU with annual budgetary turnover exceeding Rs. 4,500 Crores; dedicated commercial account maintained with State Bank of India with sanctioned overdraft limit of Rs. 15 Crores.';
      base.capabilityToOperateDealership = 'Resolution passed by Vice Chairman & Managing Director, APSRTC designating commercial division officers and operating team to run the Retail Outlet with dedicated 24x7 staff.';
      base.profitMakingStatusReport = 'Statutory Audited Balance Sheet 2025-26 submitted; Exemption sought as per Clause 4.4 of Circular 255-09/2017.';
      base.willingnessToContinue20Years = 'Confirmed willingness and undertaking submitted to operate the retail outlet dealership for a minimum tenure of 20 years.';
      base.selectionCommitteeFinalRecommendation = 'Committee recommended for issuance of LOI for award of retail outlet dealership to APSRTC for setting-up Retail Outlet at APSRTC Bus Station Complex, Tirupati, Andhra Pradesh and development of site as A-Site.';
      base.totalBeLacs = '165.50';
      base.materialCostLacs = '85.00';
      base.constructionCostLacs = '68.50';
      base.contingencyCostLacs = '8.00';
      base.statutoryCostLacs = '4.00';
      base.calculatedMirrPercent = '17.80';
      return base;
    },
  },
  {
    id: 'RS-01/B',
    code: 'RS-01/B',
    title: 'Development of "B" / "CFS" Site Retail Outlet (Dealer Land)',
    shortName: '"B" Site / Corpus Fund RO',
    category: 'Corpus Fund / Dealer Land',
    description: 'Executive proposal note for Corpus Fund Scheme (CFS) or Dealer-owned land. Focuses on dealer lease agreement, equipment-only capital outlay, working capital loan assistance, and rural/SC/ST reservations.',
    tenureDefault: 'Dealer Lease / Corpus Fund',
    doaApprover: 'State Head / ED (State Office)',
    badgeColor: 'amber',
    iconName: 'ShieldCheck',
    sampleKey: 'chandragiri-chittoor',
    suggestedExcelColumns: RS01B_COLUMNS,
    getInitialData: () => {
      const base: ProposalData = JSON.parse(JSON.stringify(sampleProposals['chandragiri-chittoor']));
      base.templateRefNo = 'RS-01/B dtd. 01.09.2026';
      base.proposalTitle = 'PROPOSAL NOTE FOR SETTING UP OF "B" SITE / CORPUS FUND SCHEME RETAIL OUTLET';
      base.tenureType = 'Dealer Owned / Corpus Fund Scheme';
      base.corpusFundScheme = 'Yes';
      base.category = 'SC / Corpus Fund Scheme (Rural KSK)';
      base.materialCostLacs = '62.50';
      base.constructionCostLacs = '28.00';
      base.contingencyCostLacs = '4.00';
      base.statutoryCostLacs = '4.00';
      base.totalBeLacs = '98.50';
      base.agreedRentMonthly = '18000';
      base.leaseSchedules = calculateLeaseSchedule(18000, 10, 5, 30, 18);
      base.grossRentalOutgo = base.leaseSchedules.reduce((a, b) => a + b.totalPeriodRent, 0).toLocaleString('en-IN');
      return base;
    },
  },
  {
    id: 'RS-02/CC',
    code: 'RS-02/CC',
    title: 'Resitement & Reconstitution of Retail Outlet',
    shortName: 'RO Resitement Note',
    category: 'Resitement / Shifting',
    description: 'Executive proposal for shifting existing operating retail outlets affected by national highway bypasses, flyovers, or urban development. Includes historical throughput, decommissioning, and new site terms.',
    tenureDefault: 'Long Term Lease (30 Years)',
    doaApprover: 'Director (Marketing) / ED (RS)',
    badgeColor: 'blue',
    iconName: 'RefreshCw',
    sampleKey: 'yerpedu-tirupati',
    suggestedExcelColumns: RS02CC_COLUMNS,
    getInitialData: () => {
      const base: ProposalData = JSON.parse(JSON.stringify(sampleProposals['yerpedu-tirupati']));
      base.templateRefNo = 'RS-02/CC dtd. 15.09.2026';
      base.proposalTitle = 'PROPOSAL NOTE FOR RESITEMENT OF EXISTING RETAIL OUTLET DUE TO NHAI FOUR-LANING';
      base.location = 'Renigunta Bypass on NH-716';
      base.district = 'Tirupati';
      base.state = 'Andhra Pradesh';
      base.businessObjectiveText = 'The existing retail outlet M/s Sri Venkateswara Fuels (RO Code 142089) on Old Madras Road is facing severe traffic disruption due to the newly commissioned Renigunta Elevated Bypass. Resitement to the proposed survey site on NH-716 will re-capture strategic transit freight traffic and protect company market share.';
      base.reasonSubsequentDev = 'Commissioning of 4-Lane NH-716 Bypass diverting 85% of commercial vehicle traffic away from old outlet location.';
      base.totalBeLacs = '145.20';
      base.materialCostLacs = '72.00';
      base.constructionCostLacs = '62.00';
      base.contingencyCostLacs = '6.20';
      base.statutoryCostLacs = '5.00';
      return base;
    },
  },
  {
    id: 'RS-03/AUG',
    code: 'RS-03/AUG',
    title: 'Additional Facilities & Augmentation at Operating RO',
    shortName: 'RO Augmentation Note',
    category: 'Capacity Expansion',
    description: 'Proposal note for augmenting existing high-volume outlets with additional underground storage tanks, 4/6-lane canopy extension, high-speed DUs, EV fast charging, or CNG cascade integration.',
    tenureDefault: 'Existing Operating RO Site',
    doaApprover: 'Divisional Head / SRH',
    badgeColor: 'emerald',
    iconName: 'TrendingUp',
    sampleKey: 'yerpedu-tirupati',
    suggestedExcelColumns: RS03AUG_COLUMNS,
    getInitialData: () => {
      const base: ProposalData = JSON.parse(JSON.stringify(sampleProposals['yerpedu-tirupati']));
      base.templateRefNo = 'RS-03/AUG dtd. 20.09.2026';
      base.proposalTitle = 'PROPOSAL NOTE FOR AUGMENTATION OF STORAGE CAPACITY & CANOPY EXPANSION';
      base.location = 'Srikalahasti Bypass on NH-71';
      base.businessObjectiveText = 'Operating retail outlet M/s Balaji Highway Service is currently clocking 380 KLPM and frequently encountering tank dry-outs during peak transit hours. Provision of additional 1x20KL HSD underground tank and 2-Bay canopy expansion with 1x4 MPD will augment throughput to over 445 KLPM.';
      base.facilitiesTanksDUs = 'Addition of 1x20KL Underground Class B HSD Storage Tank (PESO compliant) + 1x4 MPD Dispensing Unit with integrated vapor recovery.';
      base.facilitiesInfrastructure = '2-Bay Canopy Extension matching existing corporate RVI standards with LED under-canopy luminaires.';
      base.materialCostLacs = '32.50';
      base.constructionCostLacs = '18.00';
      base.contingencyCostLacs = '2.50';
      base.statutoryCostLacs = '1.50';
      base.totalBeLacs = '54.50';
      base.calculatedMirrPercent = '22.40';
      base.sensitivityMirrPercent = '19.80';
      return base;
    },
  },
];

export function getTemplateById(id: string): ProposalTemplate {
  const found = TEMPLATES_REGISTRY.find((t) => t.id === id);
  return found || TEMPLATES_REGISTRY[0];
}
