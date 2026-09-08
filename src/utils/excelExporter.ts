import * as XLSX from 'xlsx';
import { ProposalData } from '../types';
import { ProposalTemplate, TEMPLATES_REGISTRY } from './templatesRegistry';

/**
 * Downloads a customized, ready-to-use Excel template specifically tailored
 * to the selected proposal template note.
 */
export function downloadSuggestedExcelForTemplate(template: ProposalTemplate) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Master Sites Input Table (Horizontal)
  const headers = template.suggestedExcelColumns.map((c) => c.key);
  const sampleValues = template.suggestedExcelColumns.map((c) => c.sampleValue);

  // Add 2 realistic sample rows
  const rows = [headers, sampleValues];

  const wsMaster = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths for readability
  wsMaster['!cols'] = template.suggestedExcelColumns.map((c) => ({
    wch: Math.max(c.key.length, c.sampleValue.length, 14),
  }));

  XLSX.utils.book_append_sheet(wb, wsMaster, 'Site_Input_Table');

  // Sheet 2: Data Dictionary & Instructions
  const dictHeaders = ['Column Key (Header)', 'Field Label', 'Category', 'Mandatory / Optional', 'Sample Value', 'Guidance & Purpose'];
  const dictRows = template.suggestedExcelColumns.map((col) => [
    col.key,
    col.label,
    col.category,
    col.required ? 'MANDATORY' : 'OPTIONAL',
    col.sampleValue,
    col.description,
  ]);

  const wsDict = XLSX.utils.aoa_to_sheet([
    ['IOCL RETAIL OUTLET PROPOSAL - EXCEL DATA DICTIONARY', '', '', '', '', ''],
    [`Template Note: ${template.code} - ${template.title}`, '', '', '', '', ''],
    ['Instructions: Fill the "Site_Input_Table" sheet. Each row represents an individual site proposal.', '', '', '', '', ''],
    [],
    dictHeaders,
    ...dictRows,
  ]);

  wsDict['!cols'] = [
    { wch: 24 },
    { wch: 28 },
    { wch: 18 },
    { wch: 22 },
    { wch: 28 },
    { wch: 50 },
  ];

  XLSX.utils.book_append_sheet(wb, wsDict, 'Data_Dictionary');

  // Sheet 3: Vertical Key-Value Sheet (for single site manual entry)
  const initialData = template.getInitialData();
  const kvRows = [
    ['IOCL PROPOSAL SINGLE SITE VERTICAL FORM', ''],
    ['Template Code', template.code],
    ['Template Title', template.title],
    ['Document Date', initialData.documentDate || ''],
    [],
    ['--- KEY DATA FIELDS ---', ''],
  ];

  template.suggestedExcelColumns.forEach((c) => {
    kvRows.push([c.key, c.sampleValue]);
  });

  const wsKV = XLSX.utils.aoa_to_sheet(kvRows);
  wsKV['!cols'] = [{ wch: 30 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsKV, 'Single_Site_Form');

  const safeCode = template.code.replace(/[/\\?%*:|"<>]/g, '_');
  const filename = `IOCL_Suggested_Excel_${safeCode}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Downloads active proposal data back to an Excel file
 */
export function downloadProposalExcel(data: ProposalData, filename?: string) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Key-Value Format
  const kvData = [
    ['OMC / IOCL RETAIL OUTLET PROPOSAL INPUT SHEET', ''],
    ['Template Ref No', data.templateRefNo],
    ['Document Date', data.documentDate],
    ['Tenure Type', data.tenureType],
    ['Location', data.location],
    ['District', data.district],
    ['State', data.state],
    ['Category', data.category],

    ['-- SECTION A: BASIC INFORMATION --', ''],
    ['Advt Location S.No.', data.advtLocationSNo],
    ['Advt Location Name', data.advtLocationName],
    ['Retail Sales Area', data.retailSalesArea],
    ['Divisional Office', data.divisionalOffice],
    ['State Office', data.stateOffice],
    ['SRMP Year', data.srmpYear],
    ['Date of Advertisement', data.dateOfAdvertisement],
    ['Corrigendum Details', data.corrigendumDetails],
    ['Market Type', data.marketType],
    ['Class of Market', data.classOfMarket],
    ['Road Type', data.roadType],
    ['Corpus Fund Scheme', data.corpusFundScheme],

    ['-- SELECTION & LOI --', ''],
    ['Selection Mode', data.selectionMode],
    ['Bid Amount', data.bidAmount],
    ['Applicant Name', data.applicantName],
    ['Constitution', data.constitution],
    ['ASC Approval Date', data.ascApprovalDate],
    ['LEC Date', data.lecDate],
    ['LEC Status', data.lecStatus],
    ['LEC Observations', data.lecObservations],
    ['FVC Date', data.fvcDate],
    ['FVC Status', data.fvcStatus],
    ['FVC Observations', data.fvcObservations],
    ['LOI Approval Date', data.loiApprovalDate],
    ['LOI Comments', data.loiComments],
    ['LOI Date', data.loiDate],

    ['-- SECTION C: LAND DETAILS & NEGOTIATION --', ''],
    ['Land Group', data.landGroup],
    ['Ownership Document', data.landDocType],
    ['Balance Period', data.leaseBalancePeriod],
    ['Landowner Name', data.landownerName],
    ['Relationship with Applicant', data.relationshipWithApplicant],
    ['Is LOI Holder', data.isLoiHolder],
    ['Survey No', data.surveyNo],
    ['Survey Remarks', data.surveyRemarks],
    ['Plot Frontage (m)', data.plotFrontage],
    ['Plot Depth (m)', data.plotDepth],
    ['Plot Area (sqm)', data.plotAreaSqm],

    ['-- RENT & VALUATION --', ''],
    ['Negotiation Date', data.negotiationDate],
    ['Committee Members', data.committeeMembers],
    ['Quoted Area', data.quotedArea],
    ['Quoted Amount', data.quotedAmount],
    ['Agreed Area (sqm)', data.agreedAreaSqm],
    ['Agreed Monthly Rent', data.agreedRentMonthly],
    ['Rent Rate (per sqm)', data.agreedRentPerSqm],
    ['GST Status', data.gstStatus],
    ['Escalation (%)', data.escalationPercent],
    ['Escalation Frequency', data.escalationFrequency],
    ['Lease Period', data.leasePeriodYears],
    ['Advance Payment', data.advancePayment],
    ['Valuer 1 Name', data.valuer1Name],
    ['Valuer 1 Monthly Rent', data.valuer1MonthlyRent],
    ['Valuer 2 Name', data.valuer2Name],
    ['Valuer 2 Monthly Rent', data.valuer2MonthlyRent],

    ['-- SECTION H: FINANCIALS & MIRR --', ''],
    ['Material Cost (Rs. Lacs)', data.materialCostLacs],
    ['Construction Cost (Rs. Lacs)', data.constructionCostLacs],
    ['Contingency Cost (Rs. Lacs)', data.contingencyCostLacs],
    ['Statutory Cost (Rs. Lacs)', data.statutoryCostLacs],
    ['Total Capital Outlay (BE) Lacs', data.totalBeLacs],
    ['MIRR Reference No', data.mirrRefNo],
    ['Calculated MIRR (%)', data.calculatedMirrPercent],
    ['Sensitivity MIRR (%)', data.sensitivityMirrPercent],
    ['MIRR Benchmark Met', data.mirrBenchmarkMet],
    ['Stamp Duty', data.stampDuty],
    ['Registration Charges', data.registrationCharges],
    ['Legal & Misc Expenses', data.legalMiscExpenses],
    ['Advocate Fees Incidental (Rs)', data.advocateFeesExpenses],
    ['Registration Stamp Exp (Rs)', data.registrationStampExp],
    ['Gross Rental Outgo 30-Yr (Rs)', data.grossRentalOutgo],
  ];

  const wsKV = XLSX.utils.aoa_to_sheet(kvData);
  XLSX.utils.book_append_sheet(wb, wsKV, 'Proposal_Key_Value');

  // Sheet 2: Multi-Site Row format
  const headers = [
    'Location',
    'District',
    'State',
    'Category',
    'Applicant Name',
    'Constitution',
    'Survey No',
    'Plot Area Sqm',
    'Frontage',
    'Depth',
    'Agreed Monthly Rent',
    'Escalation (%)',
    'Lease Period',
    'Material Cost (Lacs)',
    'Construction Cost (Lacs)',
    'Total BE (Lacs)',
    'Calculated MIRR (%)',
    'Sensitivity MIRR (%)',
    'Retail Sales Area',
    'Divisional Office',
    'Advt SNo',
    'Selection Mode',
    'Valuer 1 Monthly Rent',
    'Valuer 2 Monthly Rent',
  ];

  const rowValues = [
    data.location,
    data.district,
    data.state,
    data.category,
    data.applicantName,
    data.constitution,
    data.surveyNo,
    data.plotAreaSqm,
    data.plotFrontage,
    data.plotDepth,
    data.agreedRentMonthly,
    data.escalationPercent,
    data.leasePeriodYears,
    data.materialCostLacs,
    data.constructionCostLacs,
    data.totalBeLacs,
    data.calculatedMirrPercent,
    data.sensitivityMirrPercent,
    data.retailSalesArea,
    data.divisionalOffice,
    data.advtLocationSNo,
    data.selectionMode,
    data.valuer1MonthlyRent,
    data.valuer2MonthlyRent,
  ];

  const wsRows = XLSX.utils.aoa_to_sheet([headers, rowValues]);
  XLSX.utils.book_append_sheet(wb, wsRows, 'Sites_Master_Table');

  const safeName = (data.location || 'RO_Proposal').replace(/[^a-zA-Z0-9_-]/g, '_');
  const finalFilename = filename || `RO_Proposal_${safeName}.xlsx`;
  XLSX.writeFile(wb, finalFilename);
}
