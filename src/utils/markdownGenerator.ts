import { ProposalData } from '../types';

export function cleanValue(val: string | number | undefined | null, fallback = 'N/A'): string {
  if (val === undefined || val === null || val === '') return fallback;
  const s = String(val).trim();
  if (s === '' || s.toLowerCase() === 'nan' || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null') {
    return fallback;
  }
  return s;
}

export function generateProposalMarkdown(data: ProposalData, highlightDynamic = false): string {
  const d = (val: string | number | undefined | null, fallback = 'N/A') => {
    const cleaned = cleanValue(val, fallback);
    if (!highlightDynamic) return cleaned;
    // Highlight dynamic variables in red font style for preview or doc
    return `<span class="text-red-600 font-semibold dark:text-red-400">${cleaned}</span>`;
  };

  // Helper for Annex labels
  const annex = (val: string | undefined | null) => {
    const cleaned = cleanValue(val, '');
    if (!cleaned || cleaned === 'N/A') return '';
    return ` [${cleaned}]`;
  };

  // Calculate totals for Lease Rental table
  const leaseRows = data.leaseSchedules || [];
  const grandTotalRent = leaseRows.reduce((acc, row) => acc + (row.totalPeriodRent || 0), 0);

  return `# Template Ref No: ${d(data.templateRefNo, 'RS-01/A dtd. 01.09.2026')}
## Development of new A-site RO under SRMP

---

### SUBJECT:
Approval for taking land on **${d(data.tenureType, 'Long Term Lease')}** and development of new A-site RO at advertised **${d(data.location)}, ${d(data.district)}, ${d(data.state)}** under **${d(data.category)}**.

---

### BACKGROUND:

### A) BASIC INFORMATION

| S.No. | Particulars | Detail |
| :--- | :--- | :--- |
| **1** | **Advertisement** | |
| 1.1 | Location as per Advertisement${annex(data.annexAdvt)} | ${d(data.advtLocationSNo)}, ${d(data.advtLocationName)} |
| 1.2 | District, State | ${d(data.district)}, ${d(data.state)} |
| 1.3 | Retail Sales Area | ${d(data.retailSalesArea)} |
| 1.4 | Divisional Office, State Office | ${d(data.divisionalOffice)}, ${d(data.stateOffice)} |
| 1.5 | SRMP (Year) | ${d(data.srmpYear)} |
| 1.6 | Date of Advertisement | ${d(data.dateOfAdvertisement)} |
| 1.7 | Corrigendum if any${annex(data.annexCorrigendum)} | ${d(data.corrigendumDetails)} |
| 1.8 | Regular/Rural | ${d(data.marketType)} |
| 1.9 | Class of Market | ${d(data.classOfMarket)} |
| 1.10 | Type of Road abutting to offered plot/Road No. | ${d(data.roadType)} |
| 1.11 | Category | ${d(data.category)} |
| 1.12 | Corpus Fund Scheme | ${d(data.corpusFundScheme)} |
| **2** | **Selection / LOI** | |
| 2.1 | Single Applicant / Draw of Lots / Bidding | Selection: ${d(data.selectionMode)}<br>Bid Amount: ${d(data.bidAmount)} |
| 2.2 | Name as per Application form${annex(data.annexApplication)} | ${d(data.applicantName)} |
| 2.3 | Constitution | ${d(data.constitution)} |
| 2.4 | ASC${annex(data.annexAsc)} | ${d(data.ascApprovalDate)} |
| 2.5 | LEC${annex(data.annexLec)} | Date: ${d(data.lecDate)}<br>Status: ${d(data.lecStatus)}<br>Observations: ${d(data.lecObservations)} |
| 2.6 | FVC${annex(data.annexFvc)} | Date: ${d(data.fvcDate)}<br>Status: ${d(data.fvcStatus)}<br>Observations: ${d(data.fvcObservations)} |
| 2.7 | LOI Approval${annex(data.annexLoiApproval)} | Date: ${d(data.loiApprovalDate)}<br>Comments: ${d(data.loiComments)} |
| 2.8 | LOI${annex(data.annexLoi)} | Date: ${d(data.loiDate)} |
| 2.9 | Addendum to LOI if any${annex(data.annexAddendum)} | Date: ${d(data.addendumLoiDate)}<br>Reason: ${d(data.addendumReason)} |

---

### B) SALES / BUSINESS DATA

#### 1. Sales Projection as per Feasibility (Before Advertisement)${annex(data.annexFeasibilityBefore)}

| Year | MS (KLPM) | HSD (KLPM) | Lubes (KLPM) | CNG (MTPM) | NFR (Rs. Lacs/month) |
| :--- | :--- | :--- | :--- | :--- | :--- |
${(data.salesFeasibilityBefore || []).map(r => `| **${cleanValue(r.year)}** | ${d(r.ms)} | ${d(r.hsd)} | ${d(r.lubes)} | ${d(r.cng)} | ${d(r.nfr)} |`).join('\n')}

#### 2. Trading Area Summary (Before Advertisement)${annex(data.annexTradingAreaBefore)}${annex(data.annexTradingAreaMapBefore)}

| OMCs | No. of ROs | MS Vol in KLPM | HSD Vol in KLPM |
| :--- | :--- | :--- | :--- |
${(data.tradingAreaBefore || []).map(r => `| **${cleanValue(r.omc)}** | ${d(r.rosCount)} | ${d(r.msVol)} | ${d(r.hsdVol)} |`).join('\n')}

#### 3. Sales Projection as per Feasibility (Current)${annex(data.annexFeasibilityCurrent)}

| Year | MS (KLPM) | HSD (KLPM) | Lubes (KLPM) | CNG (MTPM) | NFR (Rs. Lacs/month) |
| :--- | :--- | :--- | :--- | :--- | :--- |
${(data.salesFeasibilityCurrent || []).map(r => `| **${cleanValue(r.year)}** | ${d(r.ms)} | ${d(r.hsd)} | ${d(r.lubes)} | ${d(r.cng)} | ${d(r.nfr)} |`).join('\n')}

#### 4. Trading Area Summary (Current)${annex(data.annexTradingAreaCurrent)}${annex(data.annexTradingAreaMapCurrent)}

| OMCs | No. of ROs | MS Vol in KLPM | HSD Vol in KLPM |
| :--- | :--- | :--- | :--- |
${(data.tradingAreaCurrent || []).map(r => `| **${cleanValue(r.omc)}** | ${d(r.rosCount)} | ${d(r.msVol)} | ${d(r.hsdVol)} |`).join('\n')}

#### 5. Reason for Variation
- **5.1 Subsequent development in trading area:** ${d(data.reasonSubsequentDev)}
- **5.2 New Project:** ${d(data.reasonNewProject)}
- **5.3 Natural halting point:** ${d(data.reasonHaltingPoint)}
- **5.4 Closure of existing RO:** ${d(data.reasonClosureRO)}
- **5.5 Road related development:** ${d(data.reasonRoadDev)}
- **5.6 Any other, if applicable:** ${d(data.reasonOther)}

---

### C) LAND DETAILS, NEGOTIATION & TSR

| S.No. | Particulars | Detail |
| :--- | :--- | :--- |
| **1** | **Land Particulars** | |
| 1.1 | Group as per land offered | ${d(data.landGroup)} |
| 1.2 | Reference land document to ascertain ownership${annex(data.annexLandDoc)} | Document: ${d(data.landDocType)}<br>Balance period of Lease deed: ${d(data.leaseBalancePeriod)} |
| 1.3 | Landowner | ${d(data.landownerName)} |
| 1.4 | Relationship with Applicant | LOI Holder: ${d(data.isLoiHolder)} (${d(data.relationshipWithApplicant)}) |
| 1.5 | Land Survey No. | Survey / Khata No: ${d(data.surveyNo)}<br>Remarks: ${d(data.surveyRemarks)} |
| 1.6 | Land dimensions as per LOI | Frontage: ${d(data.plotFrontage)} m x Depth: ${d(data.plotDepth)} m<br>Area: ${d(data.plotAreaSqm)} Sqm |
| **2** | **Rent Negotiation** | |
| 2.1 | Negotiation Date | ${d(data.negotiationDate)} |
| 2.2 | Committee nomination Approval${annex(data.annexCommittee)} | Date of Approval: ${d(data.committeeApprovalDate)}<br>Members: ${d(data.committeeMembers)} |
| 2.3 | Amount & other details quoted in Application | Area: ${d(data.quotedArea)}<br>Amount: ${d(data.quotedAmount)} |
| 2.4 | Initial offer letter, other than application form${annex(data.annexInitialOffer)} | Date: ${d(data.initialOfferDate)}<br>Area: ${d(data.initialOfferArea)}<br>Amount: ${d(data.initialOfferAmount)}<br>Escalation: ${d(data.initialOfferEscalation)} |

#### 3. Valuation Details${annex(data.annexValuationReport)}

| S.No. | Particulars | Valuer 1: ${d(data.valuer1Name)} | Valuer 2: ${d(data.valuer2Name)} |
| :--- | :--- | :--- | :--- |
| 3.1 | Date of Valuation | ${d(data.valuer1Date)} | ${d(data.valuer2Date)} |
| 3.2 | Area considered (sqm) | ${d(data.valuer1Area)} | ${d(data.valuer2Area)} |
| 3.3 | Guideline value / Circle Rate (Rs/sqm) | Rs. ${d(data.valuer1CircleRate)} | Rs. ${d(data.valuer2CircleRate)} |
| 3.4 | Market Rate (Rs/sqm) | Rs. ${d(data.valuer1MarketRate)} | Rs. ${d(data.valuer2MarketRate)} |
| 3.5 | Value of Property for Area considered (Rs.) | Rs. ${d(data.valuer1PropertyVal)} | Rs. ${d(data.valuer2PropertyVal)} |
| 3.6 | Rent Rate Recommended by Valuer (Rs/sqm/mo) | Rs. ${d(data.valuer1RentRate)} | Rs. ${d(data.valuer2RentRate)} |
| 3.7 | Monthly Rent Recommended for area (Rs/month) | Rs. ${d(data.valuer1MonthlyRent)} | Rs. ${d(data.valuer2MonthlyRent)} |

#### 4. Negotiation T&C: Agreed Framework

| S.No. | Parameter | Agreed Terms |
| :--- | :--- | :--- |
| 4.1 | Area of plot | ${d(data.agreedAreaSqm)} Sqm |
| 4.2 | Rent for the area | Rs. ${d(data.agreedRentMonthly)} per month |
| 4.3 | Rent Rate | Rs. ${d(data.agreedRentPerSqm)} per sqm/month |
| 4.4 | GST | ${d(data.gstStatus)} |
| 4.5 | Escalation, if any | ${d(data.escalationPercent)}% |
| 4.6 | Escalation Period, if any | ${d(data.escalationFrequency)} |
| 4.7 | Lease Period | ${d(data.leasePeriodYears)} |
| 4.8 | Advance Payment | ${d(data.advancePayment)} |
| 4.9 | BFF Recommendation & LOI acceptance${annex(data.annexBff)} | ${d(data.bffAmount)} |
| 4.10 | Outright purchase rate, if applicable | Rate/sqm: ${d(data.outrightRatePerSqm)} \| Total: ${d(data.outrightAmount)} |
| 4.11 | Final Offer${annex(data.annexFinalOffer)} | Signed Date: ${d(data.finalOfferDate)} |
| 4.12 | Committee Negotiation report${annex(data.annexCommitteeReport)} | Terms: ${d(data.committeeNegotiationTerms)} |

#### 5. Legal Opinion
- **5.1 Title Clearance-cum-Search Report${annex(data.annexTitleSearch)}:** Date: ${d(data.titleSearchDate)}
- **5.2 Land Ownership:** ${d(data.landOwnershipConfirmed)}
- **5.3 Title clearance / marketability:** ${d(data.titleAdvocateConfirmation)}
- **5.4 Complaint / Court Case / Legal impediment${annex(data.annexComplaint)}:** ${d(data.complaintDetails)}
- **5.5 Undertaking from Landowner / LOI Holder${annex(data.annexUndertaking)}:** ${d(data.undertakingDetails)}

---

### PROPOSAL:

### D) BUSINESS OBJECTIVE
${d(data.businessObjectiveText, 'It is proposed to set up a Retail Outlet at advertised location to expand the retail dealer network and mop up additional sales potential in the trading area.')}

---

### E) SCOPE / KEY FEATURES

| S.No. | Component | Specification / Status |
| :--- | :--- | :--- |
| **1** | **Layout Drawing** | |
| 1.1 | Archetype | ${d(data.archetype)} |
| 1.2 | Layout Drawing${annex(data.annexLayout)} | Signed by DRSH & DO Retail Engg. |
| 1.3 | Deviation from standard layout${annex(data.annexLayoutDeviation)} | ${d(data.layoutDeviation)} |
| 1.4 | Additional Area considered${annex(data.annexAdditionalArea)} | ${d(data.additionalAreaDetails)} |
| **2** | **Concept Note** | |
| 2.1 | Concept of facilities proposed${annex(data.annexConcept)} | Date: ${d(data.conceptNoteDate)}<br>Deviation & Approval: ${d(data.conceptDeviations)} |
| **3** | **Facilities** | |
| 3.1 | Tanks, DUs & STP | ${d(data.facilitiesTanksDUs)} |
| 3.2 | Infrastructure | ${d(data.facilitiesInfrastructure)} |
| 3.3 | Driveway | ${d(data.facilitiesDriveway)} |
| 3.4 | Electrical | ${d(data.facilitiesElectrical)} |
| 3.5 | RVI | ${d(data.facilitiesRvi)} |
| 3.6 | Miscellaneous | ${d(data.facilitiesMisc)} |

---

### F) OTHER RELEVANT INFORMATION (Statutory Approvals)

| S.No. | Statutory Clearance | Current Status |
| :--- | :--- | :--- |
| 1.1 | DM / DC NOC | ${d(data.dmDcNocStatus)} |
| 1.2 | NHAI NOC (if applicable) | ${d(data.nhaiNocStatus)} |
| 1.3 | Land NA / CLU Status | ${d(data.landNaCluStatus)} |
| 1.4 | Building Use Permission (if applicable) | ${d(data.buildingUsePermissionStatus)} |
| 1.5 | Site specific permission (if applicable) | ${d(data.siteSpecificPermissionStatus)} |
| 1.6 | Site development${annex(data.annexSiteDev)} | MOM Date: ${d(data.siteDevMomDate)}<br>Status: ${d(data.siteDevCurrentStatus)} |
| 1.7 | PESO Construction Approval${annex(data.annexPeso)} | Ref: ${d(data.pesoApprovalRef)}<br>Date: ${d(data.pesoApprovalDate)} |

---

### G) JUSTIFICATION

#### 1. Rationale
- **1.1 Sales Potential:** ${d(data.rationaleSalesPotential)}
- **1.2 Clear Title:** ${d(data.rationaleClearTitle)}
- **1.3 MIRR vs Benchmark:** ${d(data.rationaleMirr)}
- **1.4 Site-specific:** ${d(data.rationaleSiteSpecific)}
- **1.5 Others:** ${d(data.rationaleOthers)}

#### 2. Approvals for Exceptions covered under Policy, if any
- **2.1 Facilities Provision Exception:** ${d(data.exceptionFacilities)}
- **2.2 Canopy / RVI Exception (Policy 174-08/2010):** ${d(data.exceptionCanopyRvi)}
- **2.3 Layout deviation (Clause F-6 of IWPM & RET-ENG/in/26/1):** ${d(data.exceptionLayout)}
- **2.4 Any other Exception:** ${d(data.exceptionOther)}

---

### FINANCIAL IMPLICATION:

### H) FINANCIAL BREAK-UP

#### 1. Lease Rental Escalation Schedule

| Period / Escalation | Rent Per Month (Rs) | GST @ 18% (Rs) | Rent/Month (Incl. GST) | No. of Months | Total for the Period (Rs) |
| :--- | :--- | :--- | :--- | :--- | :--- |
${leaseRows.map(r => `| **${cleanValue(r.periodLabel)}** | Rs. ${cleanValue(r.rentPerMonth?.toLocaleString('en-IN'))} | Rs. ${cleanValue(r.gstAmount?.toLocaleString('en-IN'))} | Rs. ${cleanValue(r.rentInclGst?.toLocaleString('en-IN'))} | ${cleanValue(r.months)} | Rs. ${cleanValue(r.totalPeriodRent?.toLocaleString('en-IN'))} |`).join('\n')}
| **Total Gross Rental Outgo** | | | | | **Rs. ${grandTotalRent.toLocaleString('en-IN')}** |

#### 2. Legal Expenses

| S.No. | Head | Amount |
| :--- | :--- | :--- |
| 2.1 | Stamp Duty | ${d(data.stampDuty)} |
| 2.2 | Registration Charges | ${d(data.registrationCharges)} |
| 2.3 | Legal & Miscellaneous Expenses | ${d(data.legalMiscExpenses)} |

#### 3. Development Cost

| S.No. | Cost Head | Amount (Rs. Lacs) |
| :--- | :--- | :--- |
| 3.1 | Material Cost | Rs. ${d(data.materialCostLacs)} Lacs |
| 3.2 | Construction Cost | Rs. ${d(data.constructionCostLacs)} Lacs |
| 3.3 | Contingency charges including Consultancy charges | Rs. ${d(data.contingencyCostLacs)} Lacs |
| 3.4 | Statutory payments (PESO/NHAI/PWD/Forest etc.) | Rs. ${d(data.statutoryCostLacs)} Lacs |
| **Total** | **Total Capital Outlay (BE)${annex(data.annexTotalBe)}** | **Rs. ${d(data.totalBeLacs)} Lacs** |

#### 4. MIRR Working

| S.No. | Indicator | Value |
| :--- | :--- | :--- |
| 4.1 | MIRR Reference${annex(data.annexMirrRef)} | ${d(data.mirrRefNo)} |
| 4.2 | Calculated MIRR | **${d(data.calculatedMirrPercent)}%** |
| 4.3 | MIRR at (-) 10% Sensitivity | **${d(data.sensitivityMirrPercent)}%** |
| 4.4 | MIRR > Benchmark | **${d(data.mirrBenchmarkMet)}** |
| 4.5 | Applicability of BFF | ${d(data.bffApplicability)} |
| 4.6 | BFF Recommendation & Acceptance | ${d(data.bffAmount)} |

---

### DOA & EFFECTIVE AUTHORITY:

| DOA / Policy | Authority | Approval Requested |
| :--- | :--- | :--- |
| **2.05** | As per DOA | For administrative and expenditure approval for Advocate Professional Fees, Incidental expenses |
| **3.01 (a) (i)** | As per DOA | For development of the RO |
| **3.02 & 10.04** | As per DOA | For taking the land on Outright Purchase / Lease as per rentals negotiated |
| **3.07 (d)** | As per DOA | Extension of LOI |
| **8.03 (b)** | As per DOA | Stamp Duty & Registration fees |
| **143-01/2009 dtd. 21.01.2009 & 143-01/2009/A dtd. 01.07.2026** | SRH / As per Policy | Land Procurement as per Clause 11 of Policy |
| **144-02/2009 dtd. 16.02.2009 & 144-02/2009/A dtd. 30.06.2026** | SRH / As per Policy | Setting-up new ROs under Clause 2.2.4 & exception under 3.2.2.i |
| **152-06/2009 dtd. 30.06.2009** | SRH / As per Policy | Tank proposed as per Policy |
| **174-08/2010 dtd. 30.08.2010 & 174-08/2010/A dtd. 01.07.2026** | SRH / As per Policy | Mandatory Facilities, exception for not providing Canopy in D1 class market |
| **211-02/2013 dtd. 12.02.2013 & 211-02/2013/A dtd. 30.06.2026** | SRH / As per Policy | DU proposed as per Clause 2.1 (c) for provision of more than 2 MPDs in A,B,D class market |
| **226-12/2015 dtd. 01.12.2015** | SRH / As per Policy | Setting up of new KSK |
| **237-03/2016 dtd. 08.03.2016 & 237-03/2016/A dtd. 30.06.2026** | As per Policy | Improving Site Security - Outright purchase |
| **291-03/2021 dtd. 18.03.2021** | SRH / As per Policy | RVI proposed as per Policy |
| **346/03-2026 dtd. 27.03.2026 & 346/03-2026/A dtd. 01.07.2026** | SRH / As per Policy | BFF |
| **RS/Land Procurement/07-2015** | As per DOA | Additional area |
| **Clause F-6 of IWPM & RET-ENG/in/26/1** | SRH & SREH | Layout deviation |
| **ENG/20/377 dtd. 26.03.2006** | SRH | Tank capacity - 10/50 KL |

---

### CONCLUSION:

In view of the above, kind approval is requested for the development of the subject new A-site RO on land admeasuring **${d(data.plotAreaSqm)} sqm**, bearing **Survey No. ${d(data.surveyNo)}** at **${d(data.location)}, ${d(data.district)}, ${d(data.state)}**.

| S.No. | Authority | Approval Requested | DOA Reference |
| :--- | :--- | :--- | :--- |
| **1** | **DRSH** | Administrative and expenditure approval for Advocate Professional Fees, incidental expenses of **Rs. ${d(data.advocateFeesExpenses)}** | **2.05 (a)** |
| **2** | **As applicable** | Exceptions covered under Policy | **Relevant DOA / Policy** |
| **3** | **SRH** | Extension of LOI | **3.07 (d)** |
| **4** | **DRSH / SRH** | Approval for Registration charges & Stamp duty for Sale/Lease agreement of the subject new A-site RO with an estimated expenditure of **Rs. ${d(data.registrationStampExp)}** | **8.03 (b)** |
| **5** | **SRH / CH(RB)** | Approval for development of the subject new A-site RO with an estimated investment of **Rs. ${d(data.totalBeLacs)} Lacs** (including GST & contingency) yielding MIRR of **${d(data.calculatedMirrPercent)}%** | **03.01 (a) (i)** |
| **6** | **SRH / CH(RB)** | Approval for taking the above land, as recommended by rental negotiation committee and execution of Lease for **${d(data.leasePeriodYears)}** with Landlord **${d(data.landownerName)}** with an initial rental of **Rs. ${d(data.agreedRentMonthly)}** per month, excluding GST with escalation once in **${d(data.escalationFrequency)}** @ **${d(data.escalationPercent)}%** with gross rental outgo of **Rs. ${grandTotalRent > 0 ? grandTotalRent.toLocaleString('en-IN') : d(data.grossRentalOutgo)}**, including GST 18%. | **3.02 (a) & 10.04 (b)** |

********************************
`;
}
