import React from 'react';
import { ProposalData } from '../types';
import { cleanValue } from '../utils/markdownGenerator';
import { Building2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { isValueUnfilledOrPlaceholder } from '../utils/missingDataDetector';

interface GovtOrgProposalNoteProps {
  data: ProposalData;
  highlightDynamic: boolean;
  onFieldClick?: (fieldKey: string) => void;
}

export const GovtOrgProposalNote: React.FC<GovtOrgProposalNoteProps> = ({
  data,
  highlightDynamic,
  onFieldClick,
}) => {
  // Dyn renderer with interactive click for missing/bracketed field
  const dyn = (
    val: string | number | undefined | null,
    placeholder: string,
    fieldKey?: string
  ) => {
    const isUnfilled = isValueUnfilledOrPlaceholder(val, placeholder);
    const displayValue = isUnfilled ? placeholder : cleanValue(val, placeholder);

    const handleClick = () => {
      if (onFieldClick && fieldKey) {
        onFieldClick(fieldKey);
      }
    };

    return (
      <span
        onClick={handleClick}
        title={fieldKey ? `Click to edit ${fieldKey} (${placeholder})` : undefined}
        className={`cursor-pointer transition-all rounded px-1 py-0.5 inline-block ${
          isUnfilled
            ? 'text-red-700 dark:text-red-400 font-bold bg-red-100/70 dark:bg-red-950/60 border border-red-300 dark:border-red-800 hover:bg-red-200 animate-pulse'
            : highlightDynamic
            ? 'text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/40'
            : 'text-zinc-900 dark:text-zinc-100 font-medium'
        }`}
      >
        {displayValue}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Official Header */}
      <div className="text-center pb-4 mb-6 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Indian Oil Corporation Limited • Retail Sales Group • Head Office
        </div>
        <h1 className="text-lg sm:text-xl font-extrabold text-red-700 dark:text-red-500 mt-1.5">
          TEMPLATE REF NO: {dyn(data.templateRefNo, 'RS-02/A dtd. 01.09.2026', 'templateRefNo')}
        </h1>
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 uppercase">
          PROPOSAL NOTE FOR ISSUANCE OF LOI FOR AWARD OF RO DEALERSHIP TO GOVT. ORGANIZATIONS
        </h2>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          State Office: {dyn(data.stateOffice, '[State Office]', 'stateOffice')} • Divisional Office: {dyn(data.divisionalOffice, '[Divisional Office]', 'divisionalOffice')} • Date: {dyn(data.documentDate, '[Date]', 'documentDate')}
        </div>
      </div>

      {/* SUBJECT */}
      <div className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
        <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
          SUBJECT:
        </div>
        <div className="font-medium text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
          Approval for issuance of Letter of Intent (LOI) for award of Retail Outlet dealership under "Govt-Category" to{' '}
          <strong>{dyn(data.govtOrgName, '[Name of Govt. Organization]', 'govtOrgName')}</strong> for setting up of Retail Outlet at{' '}
          <strong>{dyn(data.location, '[Location]', 'location')}</strong>, District <strong>{dyn(data.district, '[District]', 'district')}</strong>, State{' '}
          <strong>{dyn(data.state, '[State]', 'state')}</strong> and development of site as{' '}
          <strong>{dyn(data.siteDevTypeA, '[A-Site / B-Site]', 'siteDevTypeA')}</strong>.
        </div>
      </div>

      {/* BACKGROUND */}
      <div className="space-y-2 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
        <div className="font-bold uppercase tracking-wider text-zinc-500">
          BACKGROUND:
        </div>
        <p>
          1. As per Corporation Policy guidelines on award of Retail Outlet Dealerships to Government Organizations / PSUs vide Policy Circular No. <strong>255-09/2017 dated 19.09.2017</strong>, dealerships can be awarded on nomination basis to State/Central Government Departments, Public Sector Undertakings (PSUs), Municipal Bodies, and Statutory Corporations.
        </p>
        <p>
          2. Direct offer has been received from <strong>{dyn(data.govtOrgName, '[Name of Govt. Organization]', 'govtOrgName')}</strong> vide letter reference <strong>{dyn(data.offerLetterRef, '[Offer Letter Ref & Date]', 'offerLetterRef')}</strong> offering land at <strong>{dyn(data.location, '[Location]', 'location')}</strong> for setting up of a retail outlet.
        </p>
      </div>

      {/* 1. BASIC INFORMATION */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          1. PARTICULARS OF GOVT. ORGANIZATION & OFFERED SITE
        </h3>
        <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 mb-4">
          <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
            <tr>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">S.No.</th>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">Particulars</th>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.1</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Name of the Govt Organization</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">
                {dyn(data.govtOrgName, '[Name of the Govt. Organization]', 'govtOrgName')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.2</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Type of the Govt Organization</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.govtOrgType, '[State PSU / Central Govt / Statutory Body]', 'govtOrgType')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.3</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Basis of Offer</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.basisOfOffer, '[Direct Offer received on Nomination basis]', 'basisOfOffer')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.4</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Offer Letter Ref & Date</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.offerLetterRef, '[Offer Letter Ref & Date]', 'offerLetterRef')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.5</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Location of Offered Site</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                {dyn(data.location, '[Offered Location]', 'location')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.6</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Revenue Survey No. / Khasra No. / Plot Ref</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.surveyNo, '[Khata No./Khatauni No./Khasra No./Gata No./Plot No./Others]', 'surveyNo')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.7</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Village / Taluka / City</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.villageTalukaCity, '[Village/Taluka/City]', 'villageTalukaCity')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.8</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">District, State</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.district, '[District]', 'district')}, {dyn(data.state, '[State]', 'state')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.9</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Plot Dimensions & Total Area</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Frontage: <strong>{dyn(data.plotFrontage, '[Frontage in m]', 'plotFrontage')} m</strong> × Depth: <strong>{dyn(data.plotDepth, '[Depth in m]', 'plotDepth')} m</strong> (Total Area: <strong>{dyn(data.plotAreaSqm, '[Area in sq.m]', 'plotAreaSqm')} sq.m</strong>)
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.10</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Type of RO & Class of Market</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Type: <strong>{dyn(data.typeOfRo, '[Regular/Rural]', 'typeOfRo')}</strong> | Market Class: <strong>{dyn(data.classOfMarket, '[A/B/C/D/E]', 'classOfMarket')}</strong>
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.11</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Abutting Road Type / Road Classification</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.roadType, '[Type of Road abutting to plot / Road No.]', 'roadType')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.12</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Retail Sales Area / Divisional Office</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.retailSalesAreaOffice, '[Retail Sales Area / Divisional Office]', 'retailSalesAreaOffice')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. LEC EVALUATION */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-2 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          2. LAND EVALUATION COMMITTEE (LEC) INSPECTION & REPORT
        </h3>
        <div className="space-y-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              2.1 Nomination approval of Land Evaluation Committee (LEC) members:
            </span>
            <div>
              {dyn(
                data.lecCommitteeNominationApproval,
                '[Approval reference and date of nomination of LEC members along with Name and Designation]',
                'lecCommitteeNominationApproval'
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              2.2 Report of the Land Evaluation Committee (LEC) & Date of Inspection:
            </span>
            <div>
              {dyn(
                data.lecReportDateAndObservations,
                '[Date of LEC inspection and observations regarding suitability of plot as per IRC-12/OMC norms]',
                'lecReportDateAndObservations'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DIVISIONAL RECOMMENDATION */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-2 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          3. RECOMMENDATION OF DIVISIONAL COMMITTEE (DRSH COMMITTEE)
        </h3>
        <div className="space-y-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              3.1 Committee nominated by Divisional Head (DRSH):
            </span>
            <div>
              {dyn(
                data.drshNominationApproval,
                '[Approval reference and date of nomination of Committee members along with Name and Designation by DRSH]',
                'drshNominationApproval'
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              3.2 Recommendations of the Divisional Committee:
            </span>
            <div>
              {dyn(
                data.drshCommitteeRecommendations,
                '[Recommendation of the Committee for setting up Retail Outlet under Govt Category]',
                'drshCommitteeRecommendations'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. STATE OFFICE SELECTION COMMITTEE */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-2 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          4. STATE OFFICE SELECTION COMMITTEE DETAILS & INTERVIEW
        </h3>
        <div className="space-y-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              4.1 Selection Committee nominated by State Head (SRH):
            </span>
            <div>
              {dyn(
                data.srhNominationApproval,
                '[Approval reference and date of nomination of Selection Committee along with Name and Designation by SRH]',
                'srhNominationApproval'
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              4.2 Authorized Representative nominated by Govt Organization:
            </span>
            <div>
              {dyn(
                data.authorizedRepNominated,
                '[Name and Designation of the person nominated by Govt. Organization along with letter reference]',
                'authorizedRepNominated'
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
              4.3 Candidate / Authorized Representative Interviewed:
            </span>
            <div>
              {dyn(
                data.authorizedRepInterviewed,
                '[Name and Designation of the person nominated by Govt. Organization who appeared for interview]',
                'authorizedRepInterviewed'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. SELECTION COMMITTEE EVALUATION PARAMETERS */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-2 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          5. SELECTION COMMITTEE EVALUATION PARAMETERS (Clause 4.0 of Policy Circular 255-09/2017)
        </h3>
        <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 mb-4">
          <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
            <tr>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">Clause</th>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">Evaluation Parameter</th>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2">Observations & Compliance Verification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">5.1</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Site Development Option
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(
                  data.siteDevTypeA,
                  '[Details of whether the site is to be developed as A site, B site with 2PL, B site with SSLF]',
                  'siteDevTypeA'
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">5.2</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Land Ownership & Physical Control
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(
                  data.landOwnershipStatusControl,
                  '[Details regarding land whether the land is in physical possession and owned by the Govt. Organization]',
                  'landOwnershipStatusControl'
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">5.3</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Financial Capability & Working Capital
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(
                  data.financialCapabilityWorkingCapital,
                  '[Details regarding financial capability, letter from banker specifying working capital arrangement]',
                  'financialCapabilityWorkingCapital'
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">5.4</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Capability to Operate Retail Outlet
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(
                  data.capabilityToOperateDealership,
                  '[Details regarding capability to operate the dealership, designated officer/manager to look after RO business]',
                  'capabilityToOperateDealership'
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">5.5</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Profit Making Status / Financial Exemption
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(
                  data.profitMakingStatusReport,
                  '[Details regarding profit making status of Govt Organization or exemption sought as per Clause 4.4 of Circular 255-09/2017]',
                  'profitMakingStatusReport'
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">5.6</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Willingness to Operate for 20 Years
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(
                  data.willingnessToContinue20Years,
                  '[Confirmation of willingness to continue the retail outlet dealership for a minimum tenure of 20 years]',
                  'willingnessToContinue20Years'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 6. FINAL RECOMMENDATION & DOA APPROVAL */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-2 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          6. SELECTION COMMITTEE RECOMMENDATION & APPROVAL SOUGHT
        </h3>

        <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            6.1 Recommendation of Selection Committee:
          </div>
          <div>
            {dyn(
              data.selectionCommitteeFinalRecommendation,
              '[Recommendation of Selection Committee for issuance of LOI for award of RO dealership to the Govt Organization]',
              'selectionCommitteeFinalRecommendation'
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-xs">
          <div className="font-bold text-red-800 dark:text-red-300 uppercase tracking-wider mb-2">
            6.2 DELEGATION OF AUTHORITY (DOA ITEM 3.01 / POLICY 255-09/2017):
          </div>
          <p className="leading-relaxed text-zinc-800 dark:text-zinc-200">
            In view of the above evaluation and recommendations of the Land Evaluation Committee, Divisional Committee, and State Selection Committee, approval is hereby sought from the competent authority under Delegation of Authority:
          </p>
          <div className="mt-3 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">
            "Approval for issuance of Letter of Intent (LOI) for award of Retail Outlet Dealership under Govt. Category to{' '}
            <strong>{dyn(data.govtOrgName, '[Name of the Govt Organization]', 'govtOrgName')}</strong> for setting up of Retail Outlet at{' '}
            <strong>{dyn(data.location, '[Offered Location]', 'location')}</strong>, District{' '}
            <strong>{dyn(data.district, '[District]', 'district')}</strong>, State{' '}
            <strong>{dyn(data.state, '[State]', 'state')}</strong> and development of site as{' '}
            <strong>{dyn(data.siteDevTypeA, '[A-Site / B-Site]', 'siteDevTypeA')}</strong>."
          </div>
          <div className="mt-3 flex justify-between items-center text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span>Competent Authority: <strong>Country Head (Retail Business) - CH(RB)</strong></span>
            <span>Delegation Item: <strong>Policy Circular 255-09/2017</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
