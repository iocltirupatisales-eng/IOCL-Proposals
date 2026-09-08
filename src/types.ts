export interface ProposalData {
  // Document Reference
  templateRefNo: string;
  documentDate: string;
  proposalTitle: string;

  // SUBJECT
  tenureType: 'Long Term Lease' | 'Outright Purchase' | 'Tripartite Lease' | string;
  location: string;
  district: string;
  state: string;
  category: string;

  // A) BASIC INFORMATION
  // 1 Advertisement
  advtLocationSNo: string;
  advtLocationName: string;
  annexAdvt: string;
  retailSalesArea: string;
  divisionalOffice: string;
  stateOffice: string;
  srmpYear: string;
  dateOfAdvertisement: string;
  corrigendumDetails: string;
  annexCorrigendum: string;
  marketType: 'Regular' | 'Rural' | string;
  classOfMarket: 'A' | 'B' | 'C' | 'D1' | 'D2' | 'E' | string;
  roadType: string;
  corpusFundScheme: 'Yes' | 'No' | string;

  // 2 Selection / LOI
  selectionMode: string;
  bidAmount: string;
  applicantName: string;
  annexApplication: string;
  constitution: 'Proprietorship' | 'Partnership' | 'Firm' | 'Others' | string;
  ascApprovalDate: string;
  annexAsc: string;
  lecDate: string;
  lecStatus: string;
  lecObservations: string;
  annexLec: string;
  fvcDate: string;
  fvcStatus: string;
  fvcObservations: string;
  annexFvc: string;
  loiApprovalDate: string;
  loiComments: string;
  annexLoiApproval: string;
  loiDate: string;
  annexLoi: string;
  addendumLoiDate: string;
  addendumReason: string;
  annexAddendum: string;

  // B) SALES / BUSINESS DATA
  // Feasibility Before Advertisement
  salesFeasibilityBefore: {
    year: string;
    ms: string;
    hsd: string;
    lubes: string;
    cng: string;
    nfr: string;
  }[];
  annexFeasibilityBefore: string;

  // Trading Area Before Advertisement
  tradingAreaBefore: {
    omc: string;
    rosCount: string;
    msVol: string;
    hsdVol: string;
  }[];
  annexTradingAreaBefore: string;
  annexTradingAreaMapBefore: string;

  // Feasibility Current
  salesFeasibilityCurrent: {
    year: string;
    ms: string;
    hsd: string;
    lubes: string;
    cng: string;
    nfr: string;
  }[];
  annexFeasibilityCurrent: string;

  // Trading Area Current
  tradingAreaCurrent: {
    omc: string;
    rosCount: string;
    msVol: string;
    hsdVol: string;
  }[];
  annexTradingAreaCurrent: string;
  annexTradingAreaMapCurrent: string;

  // Reason for variation
  reasonSubsequentDev: string;
  reasonNewProject: string;
  reasonHaltingPoint: string;
  reasonClosureRO: string;
  reasonRoadDev: string;
  reasonOther: string;

  // C) LAND DETAILS, NEGOTIATION & TSR
  // 1 Land Particulars
  landGroup: 'Group 1' | 'Group 2' | string;
  landDocType: string;
  leaseBalancePeriod: string;
  annexLandDoc: string;
  landownerName: string;
  relationshipWithApplicant: string;
  isLoiHolder: 'Yes' | 'No' | string;
  surveyNo: string;
  surveyRemarks: string;
  plotFrontage: string;
  plotDepth: string;
  plotAreaSqm: string;

  // 2 Rent Negotiation
  negotiationDate: string;
  committeeApprovalDate: string;
  committeeMembers: string;
  annexCommittee: string;
  quotedArea: string;
  quotedAmount: string;
  initialOfferDate: string;
  initialOfferArea: string;
  initialOfferAmount: string;
  initialOfferEscalation: string;
  annexInitialOffer: string;

  // 3 Valuation Details
  valuer1Name: string;
  valuer1Date: string;
  valuer1Area: string;
  valuer1CircleRate: string;
  valuer1MarketRate: string;
  valuer1PropertyVal: string;
  valuer1RentRate: string;
  valuer1MonthlyRent: string;

  valuer2Name: string;
  valuer2Date: string;
  valuer2Area: string;
  valuer2CircleRate: string;
  valuer2MarketRate: string;
  valuer2PropertyVal: string;
  valuer2RentRate: string;
  valuer2MonthlyRent: string;
  annexValuationReport: string;

  // 4 Negotiation Agreed Framework
  agreedAreaSqm: string;
  agreedRentMonthly: string;
  agreedRentPerSqm: string;
  gstStatus: 'Exclusive' | 'Inclusive' | string;
  escalationPercent: string;
  escalationFrequency: string;
  leasePeriodYears: string;
  advancePayment: string;
  bffAmount: string;
  annexBff: string;
  outrightRatePerSqm: string;
  outrightAmount: string;
  finalOfferDate: string;
  annexFinalOffer: string;
  committeeNegotiationTerms: string;
  annexCommitteeReport: string;

  // 5 Legal Opinion
  titleSearchDate: string;
  annexTitleSearch: string;
  landOwnershipConfirmed: string;
  titleAdvocateConfirmation: string;
  complaintDetails: string;
  annexComplaint: string;
  undertakingDetails: string;
  annexUndertaking: string;

  // PROPOSAL
  // D) BUSINESS OBJECTIVE
  businessObjectiveText: string;

  // E) SCOPE / KEY FEATURES
  archetype: string;
  annexLayout: string;
  layoutDeviation: string;
  annexLayoutDeviation: string;
  additionalAreaDetails: string;
  annexAdditionalArea: string;
  conceptNoteDate: string;
  conceptDeviations: string;
  annexConcept: string;

  facilitiesTanksDUs: string;
  facilitiesInfrastructure: string;
  facilitiesDriveway: string;
  facilitiesElectrical: string;
  facilitiesRvi: string;
  facilitiesMisc: string;

  // F) OTHER RELEVANT INFORMATION
  dmDcNocStatus: string;
  nhaiNocStatus: string;
  landNaCluStatus: string;
  buildingUsePermissionStatus: string;
  siteSpecificPermissionStatus: string;
  siteDevMomDate: string;
  siteDevCurrentStatus: string;
  annexSiteDev: string;
  pesoApprovalRef: string;
  pesoApprovalDate: string;
  annexPeso: string;

  // G) JUSTIFICATION
  rationaleSalesPotential: string;
  rationaleClearTitle: string;
  rationaleMirr: string;
  rationaleSiteSpecific: string;
  rationaleOthers: string;

  exceptionFacilities: string;
  exceptionCanopyRvi: string;
  exceptionLayout: string;
  exceptionOther: string;

  // H) FINANCIAL BREAK-UP
  // Lease Rental Schedule (typically 6 periods of 5 years = 30 years)
  leaseSchedules: {
    periodLabel: string;
    rentPerMonth: number;
    gstRate: number; // usually 18
    gstAmount: number;
    rentInclGst: number;
    months: number;
    totalPeriodRent: number;
  }[];

  // Legal Expenses
  stampDuty: string;
  registrationCharges: string;
  legalMiscExpenses: string;

  // Development Cost
  materialCostLacs: string;
  constructionCostLacs: string;
  contingencyCostLacs: string;
  statutoryCostLacs: string;
  totalBeLacs: string;
  annexTotalBe: string;

  // MIRR Working
  mirrRefNo: string;
  annexMirrRef: string;
  calculatedMirrPercent: string;
  sensitivityMirrPercent: string;
  mirrBenchmarkMet: 'Yes' | 'No' | string;
  bffApplicability: 'Yes' | 'No' | string;

  // CONCLUSION & DOA SPECIFICS
  advocateFeesExpenses: string; // Rs. for DOA 2.05(a)
  registrationStampExp: string; // Rs. for DOA 8.03(b)
  grossRentalOutgo: string; // Calculated 30-year sum with GST

  // RS-02/A GOVT. ORGANIZATIONS SPECIFIC FIELDS
  govtOrgName?: string;
  govtOrgType?: string;
  basisOfOffer?: string;
  offerLetterRef?: string;
  offerLetterDate?: string;
  villageTalukaCity?: string;
  plotDimensions?: string;
  typeOfRo?: string;
  retailSalesAreaOffice?: string;
  lecCommitteeNominationApproval?: string;
  lecCommitteeMembers?: string;
  lecReportDateAndObservations?: string;
  drshNominationApproval?: string;
  drshCommitteeMembers?: string;
  drshCommitteeRecommendations?: string;
  srhNominationApproval?: string;
  srhCommitteeMembers?: string;
  authorizedRepNominated?: string;
  authorizedRepInterviewed?: string;
  siteDevTypeA?: string;
  siteDevTypeBWith2PL?: string;
  siteDevTypeBWithout2PL?: string;
  landOwnershipStatusControl?: string;
  siteDevTypeBWithSSLF?: string;
  financialCapabilityWorkingCapital?: string;
  capabilityToOperateDealership?: string;
  interviewOfAuthorizedRep?: string;
  profitMakingStatusReport?: string;
  anyOtherRelevantFactor?: string;
  willingnessToContinue20Years?: string;
  selectionCommitteeFinalRecommendation?: string;
  doaExemptionFinancialCriteria?: string;
  doaDevelopBSiteSSLF?: string;
}
