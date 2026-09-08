import { ProposalData } from '../types';

export interface MissingFieldItem {
  key: keyof ProposalData;
  label: string;
  placeholderText: string;
  category: 'Basic Information' | 'Selection & LOI' | 'Land Details & Survey' | 'Sales & Trading' | 'Financials & Capex' | 'Statutory Approvals' | 'Selection Committees' | 'DOA & Conclusion';
  inputType: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
  suggestedDefault: string;
  helpText?: string;
}

// Field definitions with their exact official template bracketed placeholder strings
export const TEMPLATE_FIELD_DEFINITIONS: Record<string, MissingFieldItem[]> = {
  // RS-01/A: Development of new A-site RO under SRMP
  'RS-01/A': [
    // Basic Info
    {
      key: 'advtLocationSNo',
      label: 'Advt Location Serial No.',
      placeholderText: '[S.No. of Location as per Advertisement]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: '214/AP/2023',
    },
    {
      key: 'location',
      label: 'Advertised Location Name',
      placeholderText: '[Name of Location]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Yerpedu Bypass on NH-71',
    },
    {
      key: 'district',
      label: 'District',
      placeholderText: '[District]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati',
    },
    {
      key: 'state',
      label: 'State',
      placeholderText: '[State]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Andhra Pradesh',
    },
    {
      key: 'retailSalesArea',
      label: 'Retail Sales Area (RSA)',
      placeholderText: '[RSA]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati RSA',
    },
    {
      key: 'divisionalOffice',
      label: 'Divisional Office',
      placeholderText: '[DO]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati DO',
    },
    {
      key: 'stateOffice',
      label: 'State Office',
      placeholderText: '[SO]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'TAPSO (Telangana & Andhra Pradesh State Office)',
    },
    {
      key: 'srmpYear',
      label: 'SRMP Plan Year',
      placeholderText: '[YYYY-YY]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: '2023-24',
    },
    {
      key: 'dateOfAdvertisement',
      label: 'Date of Advertisement',
      placeholderText: '[DD.MM.YYYY]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: '28.06.2023',
    },
    {
      key: 'marketType',
      label: 'Regular / Rural',
      placeholderText: '[Regular/Rural]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['Regular', 'Rural'],
      suggestedDefault: 'Regular',
    },
    {
      key: 'classOfMarket',
      label: 'Class of Market',
      placeholderText: '[A/B/C/D1/D2/E]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['A', 'B', 'C', 'D1', 'D2', 'E'],
      suggestedDefault: 'B',
    },
    {
      key: 'roadType',
      label: 'Abutting Road Type / No.',
      placeholderText: '[NH/ SH/ MDR/ ODR/City Road/PMGSY etc]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'NH-71 (National Highway)',
    },
    {
      key: 'category',
      label: 'Reservation Category',
      placeholderText: '[Open/OBC/SC/ST/Others along with sub-category]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Open (Regular)',
    },
    {
      key: 'corpusFundScheme',
      label: 'Corpus Fund Scheme (CFS)',
      placeholderText: '[Yes/No]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['Yes', 'No'],
      suggestedDefault: 'No',
    },

    // Selection / LOI
    {
      key: 'selectionMode',
      label: 'Single Applicant / Draw of Lots / Bidding',
      placeholderText: '[Date of DOL/Bid Opening] [Bid Amount in case of Bidding]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: 'Draw of Lots held on 15.11.2023',
    },
    {
      key: 'applicantName',
      label: 'Selected Applicant Name',
      placeholderText: '[Applicant(s) name]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: 'Shri B. Rajesh Naidu',
    },
    {
      key: 'constitution',
      label: 'Constitution',
      placeholderText: '[Proprietorship/Partnership/Others]',
      category: 'Selection & LOI',
      inputType: 'select',
      options: ['Proprietorship', 'Partnership', 'Individual', 'Others'],
      suggestedDefault: 'Proprietorship',
    },
    {
      key: 'ascApprovalDate',
      label: 'ASC Approval Date',
      placeholderText: '[DD.MM.YYYY]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: '22.12.2023',
    },
    {
      key: 'lecDate',
      label: 'LEC Inspection Date',
      placeholderText: '[DD.MM.YYYY]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: '12.01.2024',
    },
    {
      key: 'fvcDate',
      label: 'FVC Verification Date',
      placeholderText: '[DD.MM.YYYY]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: '05.02.2024',
    },
    {
      key: 'loiDate',
      label: 'LOI Issuance Date',
      placeholderText: '[DD.MM.YYYY]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: '15.03.2024',
    },

    // Land Details & Negotiation
    {
      key: 'landownerName',
      label: 'Name of Landowner',
      placeholderText: '[Name of Landowner]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: 'Smt. K. Sarojamma & Shri K. Prasad',
    },
    {
      key: 'surveyNo',
      label: 'Land Survey / Khata No.',
      placeholderText: '[Khata No./Khatauni No./Khasra No./Gata No./Plot No./Others]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: 'Sy. No. 412/2B & 412/3',
    },
    {
      key: 'plotFrontage',
      label: 'Frontage (meters)',
      placeholderText: '[Frontage (m)]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '45.00',
    },
    {
      key: 'plotDepth',
      label: 'Depth (meters)',
      placeholderText: '[Depth (m)]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '45.00',
    },
    {
      key: 'plotAreaSqm',
      label: 'Plot Area (sqm)',
      placeholderText: '[Area in sqm Mtr]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '2025',
    },
    {
      key: 'negotiationDate',
      label: 'Rent Negotiation Meeting Date',
      placeholderText: '[DD.MM.YYYY]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '24.05.2024',
    },
    {
      key: 'agreedRentMonthly',
      label: 'Agreed Base Monthly Rent (Rs)',
      placeholderText: '[Amount in Rs. Per month]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '55000',
    },
    {
      key: 'escalationPercent',
      label: 'Rent Escalation (%)',
      placeholderText: '[%]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '10',
    },
    {
      key: 'escalationFrequency',
      label: 'Escalation Frequency',
      placeholderText: '[Frequency]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: 'Every 5 Years',
    },
    {
      key: 'leasePeriodYears',
      label: 'Lease Tenure (Years)',
      placeholderText: '[Period in Years & Months]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '30 Years',
    },

    // Capex & Financials
    {
      key: 'materialCostLacs',
      label: 'Equipment / Material Cost (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '88.50',
    },
    {
      key: 'constructionCostLacs',
      label: 'Civil Construction Cost (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '72.00',
    },
    {
      key: 'contingencyCostLacs',
      label: 'Contingency / Consultancy (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '10.50',
    },
    {
      key: 'statutoryCostLacs',
      label: 'Statutory Payments (Rs. Lacs)',
      placeholderText: '[PESO/NHAI/PWD/Forest/Environment etc.]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '8.28',
    },
    {
      key: 'totalBeLacs',
      label: 'Total Capital Outlay BE (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '179.28',
    },
    {
      key: 'calculatedMirrPercent',
      label: 'Calculated MIRR (%)',
      placeholderText: '[%]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '16.42',
    },

    // Statutory Approvals
    {
      key: 'dmDcNocStatus',
      label: 'DM / DC NOC Status',
      placeholderText: '[Status]',
      category: 'Statutory Approvals',
      inputType: 'text',
      suggestedDefault: 'Applied; under joint inspection by Revenue & Police Depts',
    },
    {
      key: 'nhaiNocStatus',
      label: 'NHAI NOC Status',
      placeholderText: '[Status]',
      category: 'Statutory Approvals',
      inputType: 'text',
      suggestedDefault: 'In-Principle Approval accorded by RO NHAI Vijayawada',
    },
    {
      key: 'pesoApprovalRef',
      label: 'PESO Construction Approval',
      placeholderText: '[Ref No. & Date]',
      category: 'Statutory Approvals',
      inputType: 'text',
      suggestedDefault: 'A/P/HQ/AP/15/2844 (P51280) dtd. 18.06.2024',
    },
  ],

  // RS-01/D: Development of new B-site RO under SRMP
  'RS-01/D': [
    {
      key: 'advtLocationSNo',
      label: 'Advt Location Serial No.',
      placeholderText: '[S.No. of Location as per Advertisement]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: '118/AP/2023',
    },
    {
      key: 'location',
      label: 'Advertised Location Name',
      placeholderText: '[Name of Location]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Palamaner Rural on NH-42',
    },
    {
      key: 'district',
      label: 'District',
      placeholderText: '[District]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Chittoor',
    },
    {
      key: 'state',
      label: 'State',
      placeholderText: '[State]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Andhra Pradesh',
    },
    {
      key: 'retailSalesArea',
      label: 'Retail Sales Area (RSA)',
      placeholderText: '[RSA]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Chittoor RSA',
    },
    {
      key: 'divisionalOffice',
      label: 'Divisional Office',
      placeholderText: '[DO]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati DO',
    },
    {
      key: 'marketType',
      label: 'Regular / Rural',
      placeholderText: '[Regular/Rural]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['Regular', 'Rural'],
      suggestedDefault: 'Rural',
    },
    {
      key: 'classOfMarket',
      label: 'Class of Market',
      placeholderText: '[A/B/C/D1/D2/E]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['A', 'B', 'C', 'D1', 'D2', 'E'],
      suggestedDefault: 'D1',
    },
    {
      key: 'category',
      label: 'Reservation Category',
      placeholderText: '[Open/OBC/Others along with sub-category]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Open',
    },
    {
      key: 'applicantName',
      label: 'Selected Applicant Name',
      placeholderText: '[Applicant(s) name]',
      category: 'Selection & LOI',
      inputType: 'text',
      suggestedDefault: 'Shri K. Murali Mohan',
    },
    {
      key: 'surveyNo',
      label: 'Land Survey / Khata No.',
      placeholderText: '[Khata No./Khatauni No./Khasra No./Gata No./Plot No./Others]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: 'Sy. No. 254/1A & 254/1B',
    },
    {
      key: 'plotFrontage',
      label: 'Frontage (meters)',
      placeholderText: '[Frontage (m)]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '35.00',
    },
    {
      key: 'plotDepth',
      label: 'Depth (meters)',
      placeholderText: '[Depth (m)]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '35.00',
    },
    {
      key: 'plotAreaSqm',
      label: 'Plot Area (sqm)',
      placeholderText: '[Area in sqm Mtr]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '1225',
    },
    {
      key: 'materialCostLacs',
      label: 'Equipment / Material Cost by IOC (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '62.50',
    },
    {
      key: 'constructionCostLacs',
      label: 'Civil Works by IOC (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '18.00',
    },
    {
      key: 'contingencyCostLacs',
      label: 'Contingency / Consultancy (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '3.50',
    },
    {
      key: 'statutoryCostLacs',
      label: 'Statutory payments (Rs. Lacs)',
      placeholderText: '[PESO/NHAI/PWD/Forest/Environment etc.]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '2.50',
    },
    {
      key: 'totalBeLacs',
      label: 'Total BE Capital Outlay (Rs. Lacs)',
      placeholderText: '[Amount in Rs. Lacs]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '86.50',
    },
    {
      key: 'calculatedMirrPercent',
      label: 'Calculated MIRR (%)',
      placeholderText: '[%]',
      category: 'Financials & Capex',
      inputType: 'text',
      suggestedDefault: '15.80',
    },
  ],

  // RS-02/A: Issuance of LOI for award of RO Dealership to Govt. Organizations
  'RS-02/A': [
    {
      key: 'govtOrgName',
      label: 'Name of Govt. Organization',
      placeholderText: '[Name]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Andhra Pradesh State Road Transport Corporation (APSRTC)',
    },
    {
      key: 'govtOrgType',
      label: 'Type of the Govt. Organization',
      placeholderText: '[Central Govt./ State Govt./Govt Organization/Central PSU/State PSU/Semi-Govt Bodies/Municipal Corporations/Urban Development Authorities/Govt Improvement Trusts/ any others]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'State PSU / Statutory Corporation',
    },
    {
      key: 'basisOfOffer',
      label: 'Basis of Offer',
      placeholderText: '[Direct Offer received on Nomination basis / Bidding]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['Direct Offer received on Nomination basis', 'Bidding / Tender'],
      suggestedDefault: 'Direct Offer received on Nomination basis',
    },
    {
      key: 'offerLetterRef',
      label: 'Offer Letter Reference & Date',
      placeholderText: '[Ref No. dtd. DD.MM.YYYY]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'APSRTC/COMM/RO/2026/04 dtd. 14.07.2026',
    },
    {
      key: 'location',
      label: 'Location of Offered Plot',
      placeholderText: '[Location]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'APSRTC Bus Station Complex, Tirupati Central',
    },
    {
      key: 'villageTalukaCity',
      label: 'Village / Taluka / City',
      placeholderText: '[Village/Taluka/City]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati Urban',
    },
    {
      key: 'district',
      label: 'District',
      placeholderText: '[District]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati',
    },
    {
      key: 'state',
      label: 'State',
      placeholderText: '[State]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Andhra Pradesh',
    },
    {
      key: 'surveyNo',
      label: 'Survey No. / Plot Reference',
      placeholderText: '[Khata No./Khatauni No./Khasra No./Gata No./Plot No./Others]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: 'R.S. No. 58/2A (Bus Station Commercial Zone)',
    },
    {
      key: 'plotFrontage',
      label: 'Plot Frontage (meters)',
      placeholderText: '[Frontage (m)]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '40.00',
    },
    {
      key: 'plotDepth',
      label: 'Plot Depth (meters)',
      placeholderText: '[Depth (m)]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '40.00',
    },
    {
      key: 'plotAreaSqm',
      label: 'Plot Area (sqm)',
      placeholderText: '[Area in sqm Mtr]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: '1600',
    },
    {
      key: 'typeOfRo',
      label: 'Type of RO',
      placeholderText: '[Regular/Rural]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['Regular', 'Rural'],
      suggestedDefault: 'Regular',
    },
    {
      key: 'classOfMarket',
      label: 'Class of Market',
      placeholderText: '[A/B/C/D1/D2/E]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['A', 'B', 'C', 'D1', 'D2', 'E'],
      suggestedDefault: 'A',
    },
    {
      key: 'roadType',
      label: 'Abutting Road Type',
      placeholderText: '[NH/ SH/ MDR/ ODR/City road/PMGSY etc]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: '4-Lane City Arterial Road abutting Bus Station',
    },
    {
      key: 'retailSalesAreaOffice',
      label: 'Retail Sales Area / DO / SO',
      placeholderText: '[RSA/DO/SO]',
      category: 'Basic Information',
      inputType: 'text',
      suggestedDefault: 'Tirupati RSA / Tirupati DO / TAPSO',
    },

    // Committees
    {
      key: 'lecCommitteeNominationApproval',
      label: 'LEC Committee Nomination Approval',
      placeholderText: '[Ref No.] & [DD.MM.YYYY] Members: 1. [Name & Designation] 2. [Name & Designation]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: 'TIR/RO/LEC/2026-08 dtd. 20.07.2026; Members: 1. Shri V. Suresh (SDRSM) 2. Shri K. Anand (Manager RE)',
    },
    {
      key: 'lecReportDateAndObservations',
      label: 'LEC Report & Observations',
      placeholderText: '[DD.MM.YYYY] [Land found suitable as per LEC parameters] [Any other observations]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: '28.07.2026: Land found fully suitable as per IRC:12 and OMC LEC parameters. Clear 40m frontage with no overhead HT lines.',
    },
    {
      key: 'drshNominationApproval',
      label: 'DRSH Nominated Committee Approval',
      placeholderText: '[Ref No.] dated [DD.MM.YYYY] Members: 1. [Name, Concerned FO] 2. [Name, Functional DO Manager (RS)] 3. [Name, Retail Engg. Officer from DO]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: 'TDO/COMM/2026/51 dtd. 02.08.2026; Members: 1. Shri R. Karthik (AM-RS) 2. Shri P. N. Rao (DM-RS) 3. Shri T. Ramesh (RE Officer)',
    },
    {
      key: 'drshCommitteeRecommendations',
      label: 'DRSH Committee Recommendations',
      placeholderText: '[Recommended for further process for setting up of Retail Outlet as per policy]',
      category: 'Selection Committees',
      inputType: 'text',
      suggestedDefault: 'Recommended for further process for setting up of Retail Outlet under Govt Category as per Policy 255-09/2017.',
    },
    {
      key: 'srhNominationApproval',
      label: 'SRH Nominated Selection Committee',
      placeholderText: '[Ref No.] dated [DD.MM.YYYY] 1. [Name, DRSH, Location] 2. [Name, Officer Grade-D & Above]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: 'TAPSO/RS/GOVT/2026/12 dtd. 10.08.2026; 1. Shri A. K. Sharma (DRSH Tirupati) 2. Shri B. V. Raman (DGM-Retail, TAPSO) 3. Shri M. S. Rao (Chief Manager Finance, TAPSO)',
    },
    {
      key: 'authorizedRepNominated',
      label: 'Authorized Rep Nominated by Govt Org',
      placeholderText: '[Name & Designation] [Ref No.] dated [DD.MM.YYYY]',
      category: 'Selection Committees',
      inputType: 'text',
      suggestedDefault: 'Shri P. Venkateswara Rao, Regional Manager (APSRTC Tirupati Region) vide letter dtd. 12.08.2026',
    },
    {
      key: 'authorizedRepInterviewed',
      label: 'Authorized Rep Interviewed by SRH Committee',
      placeholderText: '[Name & Designation]',
      category: 'Selection Committees',
      inputType: 'text',
      suggestedDefault: 'Shri P. Venkateswara Rao, Regional Manager (APSRTC)',
    },

    // Site Development Type
    {
      key: 'siteDevTypeA',
      label: 'Develop as A-Site',
      placeholderText: '[Outright purchase/Long Lease/Not applicable]',
      category: 'Basic Information',
      inputType: 'select',
      options: ['Long Lease (30 Years)', 'Outright purchase', 'Not applicable'],
      suggestedDefault: 'Long Lease (30 Years)',
    },
    {
      key: 'landOwnershipStatusControl',
      label: 'Status of Land Offered',
      placeholderText: '[Land ownership status & control]',
      category: 'Land Details & Survey',
      inputType: 'text',
      suggestedDefault: 'Land in exclusive physical possession and legal ownership of APSRTC under Govt Grant with clear unencumbered title.',
    },

    // Selection Committee Report
    {
      key: 'financialCapabilityWorkingCapital',
      label: 'Financial Capability for Working Capital',
      placeholderText: '[Detail- Banker letter specifying working capital arrangement & other sources of finance /Balance Sheet/Letter from competent authority of organization for exemption]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: 'State PSU with annual budgetary turnover exceeding Rs. 4,500 Crores; dedicated commercial account maintained with State Bank of India with sanctioned overdraft limit of Rs. 15 Crores.',
    },
    {
      key: 'capabilityToOperateDealership',
      label: 'Capability to Operate Dealership',
      placeholderText: '[Detail- Letter from competent authority of organization]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: 'Resolution passed by Vice Chairman & Managing Director, APSRTC designating commercial division officers and operating team to run the Retail Outlet with dedicated 24x7 staff.',
    },
    {
      key: 'profitMakingStatusReport',
      label: 'Profit Making Status (Annual Report)',
      placeholderText: '[Detail- Balance Sheet/Letter from competent authority of organization for exemption]',
      category: 'Selection Committees',
      inputType: 'text',
      suggestedDefault: 'Statutory Audited Balance Sheet 2025-26 submitted; Exemption sought as per Clause 4.4 of Circular 255-09/2017.',
    },
    {
      key: 'willingnessToContinue20Years',
      label: 'Willingness to Continue for 20 Years',
      placeholderText: '[Brief]',
      category: 'Selection Committees',
      inputType: 'text',
      suggestedDefault: 'Confirmed willingness and undertaking submitted to operate the retail outlet dealership for a minimum tenure of 20 years.',
    },
    {
      key: 'selectionCommitteeFinalRecommendation',
      label: 'Committee Recommendation',
      placeholderText: 'Committee recommended for issuance of LOI for award of retail outlet dealership to [Agency name] for setting-up Retail Outlet at [Location], [District], [State] and development of site as [Type of Site]',
      category: 'Selection Committees',
      inputType: 'textarea',
      suggestedDefault: 'Committee recommended for issuance of LOI for award of retail outlet dealership to APSRTC for setting-up Retail Outlet at APSRTC Bus Station Complex, Tirupati, Andhra Pradesh and development of site as A-Site.',
    },
  ],
};

// Evaluates a proposal against required template fields to find which are missing
export function detectMissingTemplateFields(
  data: ProposalData,
  templateId: string
): {
  missingFields: MissingFieldItem[];
  availableFields: MissingFieldItem[];
  totalCount: number;
  missingCount: number;
  completionPercent: number;
} {
  const definitions = TEMPLATE_FIELD_DEFINITIONS[templateId] || TEMPLATE_FIELD_DEFINITIONS['RS-01/A'] || [];
  const missingFields: MissingFieldItem[] = [];
  const availableFields: MissingFieldItem[] = [];

  for (const def of definitions) {
    const val = (data as any)[def.key];
    const isMissing = isValueUnfilledOrPlaceholder(val, def.placeholderText);

    if (isMissing) {
      missingFields.push(def);
    } else {
      availableFields.push(def);
    }
  }

  const totalCount = definitions.length;
  const missingCount = missingFields.length;
  const completionPercent = totalCount > 0 ? Math.round(((totalCount - missingCount) / totalCount) * 100) : 100;

  return {
    missingFields,
    availableFields,
    totalCount,
    missingCount,
    completionPercent,
  };
}

// Checks if a string value is considered unfilled, empty, or placeholder text
export function isValueUnfilledOrPlaceholder(val: any, placeholderText?: string): boolean {
  if (val === undefined || val === null) return true;
  const str = String(val).trim();
  if (str === '' || str === 'N/A' || str === '[N/A]') return true;

  // If it starts with [ and ends with ] and contains slashes or uppercase placeholders like [DD.MM.YYYY], [Name]
  if (str.startsWith('[') && str.endsWith(']')) {
    const inner = str.slice(1, -1).trim();
    if (
      inner.includes('/') ||
      inner.includes('DD.MM') ||
      inner.includes('YYYY') ||
      inner === 'Name' ||
      inner === 'District' ||
      inner === 'State' ||
      inner === 'Status' ||
      inner === 'Amount' ||
      inner.toLowerCase().includes('others') ||
      inner.toLowerCase().includes('khata') ||
      inner.toLowerCase().includes('applicant')
    ) {
      return true;
    }
  }

  // Exact match to placeholder text
  if (placeholderText && str.toLowerCase() === placeholderText.toLowerCase().trim()) {
    return true;
  }

  return false;
}
