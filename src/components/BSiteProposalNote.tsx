import React from 'react';
import { ProposalData } from '../types';
import { cleanValue } from '../utils/markdownGenerator';
import { ShieldCheck, DollarSign, TrendingUp, Building2, CheckCircle2 } from 'lucide-react';
import { isValueUnfilledOrPlaceholder } from '../utils/missingDataDetector';

interface BSiteProposalNoteProps {
  data: ProposalData;
  highlightDynamic: boolean;
  onFieldClick?: (fieldKey: string) => void;
}

export const BSiteProposalNote: React.FC<BSiteProposalNoteProps> = ({
  data,
  highlightDynamic,
  onFieldClick,
}) => {
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
          Indian Oil Corporation Limited • Retail Sales Group
        </div>
        <h1 className="text-lg sm:text-xl font-extrabold text-red-700 dark:text-red-500 mt-1.5">
          TEMPLATE REF NO: {dyn(data.templateRefNo, 'RS-01/D dtd. 01.09.2026', 'templateRefNo')}
        </h1>
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 uppercase">
          DEVELOPMENT OF NEW B-SITE RO UNDER SRMP
        </h2>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          State Office: {dyn(data.stateOffice, '[State Office]', 'stateOffice')} • Divisional Office: {dyn(data.divisionalOffice, '[Divisional Office]', 'divisionalOffice')} • Date: {dyn(data.documentDate, '[Date]', 'documentDate')}
        </div>
      </div>

      {/* SUBJECT */}
      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
          SUBJECT:
        </div>
        <div className="font-medium text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
          Approval for development of new B-site Retail Outlet on Dealer Owned Land at advertised location{' '}
          <strong>{dyn(data.location, '[Location]', 'location')}</strong>, District{' '}
          <strong>{dyn(data.district, '[District]', 'district')}</strong>, State{' '}
          <strong>{dyn(data.state, '[State]', 'state')}</strong> under reservation category{' '}
          <strong>{dyn(data.category, '[Category]', 'category')}</strong>.
        </div>
      </div>

      {/* BACKGROUND */}
      <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
        BACKGROUND & PROPOSAL SUMMARY:
      </div>
      <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
        This proposal note is initiated for developing a new "B" Site Retail Outlet under the State Retail Marketing Plan (SRMP). The selected candidate <strong>{dyn(data.applicantName, '[Applicant Name]', 'applicantName')}</strong> has offered land under Sy. No. <strong>{dyn(data.surveyNo, '[Khata No./Khatauni No./Khasra No./Gata No./Plot No./Others]', 'surveyNo')}</strong> with frontage of <strong>{dyn(data.plotFrontage, '[Frontage in m]', 'plotFrontage')} m</strong> and depth of <strong>{dyn(data.plotDepth, '[Depth in m]', 'plotDepth')} m</strong>. The land has been inspected and found suitable by the Land Evaluation Committee (LEC). The capital outlay by IOC covers equipment and pump island works with an estimated budget outlay of <strong>Rs. {dyn(data.totalBeLacs, '[Total BE Capex in Lacs]', 'totalBeLacs')} Lacs</strong> yielding a project MIRR of <strong>{dyn(data.calculatedMirrPercent, '[Calculated MIRR %]', 'calculatedMirrPercent')}%</strong>.
      </p>

      {/* A) BASIC INFORMATION */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          A) BASIC INFORMATION & SELECTION
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
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Location as per Advertisement</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">
                {dyn(data.location, '[Advertised Location Name]', 'location')} (Advt S.No: {dyn(data.advtLocationSNo, '[Advt S.No.]', 'advtLocationSNo')})
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.2</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">District, State</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.district, '[District]', 'district')}, {dyn(data.state, '[State]', 'state')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.3</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Retail Sales Area / Divisional Office</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.retailSalesArea, '[Retail Sales Area]', 'retailSalesArea')} / {dyn(data.divisionalOffice, '[Divisional Office]', 'divisionalOffice')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.4</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Category & Market Type</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Category: <strong>{dyn(data.category, '[Category]', 'category')}</strong> | Market: <strong>{dyn(data.marketType, '[Regular/Rural]', 'marketType')} ({dyn(data.classOfMarket, '[Class of Market]', 'classOfMarket')})</strong>
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">1.5</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Abutting Road Classification</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.roadType, '[Type of Road abutting to plot / Road No.]', 'roadType')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">2.1</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Selected Applicant Name</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">
                {dyn(data.applicantName, '[Applicant Name]', 'applicantName')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">2.2</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Constitution & Mode of Selection</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Constitution: <strong>{dyn(data.constitution, '[Constitution]', 'constitution')}</strong> | Selection Mode: <strong>{dyn(data.selectionMode, '[Single Applicant / Draw of Lots / Bidding]', 'selectionMode')}</strong>
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-semibold">2.3</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Site Tenure / Dealership Model</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                Dealer Owned Land ("B" Site Dealership)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* B) LAND PARTICULARS */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          B) LAND PARTICULARS & SUITABILITY
        </h3>
        <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 mb-4">
          <tbody>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3 font-semibold">Revenue Survey / Khasra No.</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.surveyNo, '[Khata No./Khatauni No./Khasra No./Gata No./Plot No./Others]', 'surveyNo')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">Plot Dimensions & Area</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Frontage: <strong>{dyn(data.plotFrontage, '[Frontage in m]', 'plotFrontage')} m</strong> × Depth: <strong>{dyn(data.plotDepth, '[Depth in m]', 'plotDepth')} m</strong> (Area: <strong>{dyn(data.plotAreaSqm, '[Plot Area in sq.m]', 'plotAreaSqm')} sq.m</strong>)
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">Ownership Title of Dealer</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.landOwnerLegalOpinion, '[Legal search report confirms clear, unencumbered marketable title held by applicant]', 'landOwnerLegalOpinion')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">Land Evaluation Committee (LEC)</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.lecReportDateAndObservations, '[Land found suitable in LEC inspection report as per MoRTH and OMC guidelines]', 'lecReportDateAndObservations')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* C) FINANCIAL ESTIMATES & MIRR */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          C) CAPITAL BUDGET ESTIMATE (BE) & ECONOMIC VIABILITY
        </h3>
        <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 mb-4">
          <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
            <tr>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">S.No.</th>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2">Budget Estimate Head</th>
              <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-32 text-right">Amount (Rs. Lacs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Material Cost (Tanks, Dispensing Units, RVI, Automation provided by IOCL)
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-right font-bold">
                {dyn(data.materialCostLacs, '[Material Cost in Lacs]', 'materialCostLacs')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                Construction Cost (Driveway, Pump Island, Electrical cabling)
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-right font-bold">
                {dyn(data.constructionCostLacs, '[Construction Cost in Lacs]', 'constructionCostLacs')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Contingency & Incidentals</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-right">
                {dyn(data.contingencyCostLacs, '[Contingency in Lacs]', 'contingencyCostLacs')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">4</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">Statutory / Professional Fees</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-right">
                {dyn(data.statutoryCostLacs, '[Statutory Cost in Lacs]', 'statutoryCostLacs')}
              </td>
            </tr>
            <tr className="bg-zinc-100 dark:bg-zinc-800 font-extrabold">
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center" colSpan={2}>
                TOTAL CAPITAL BUDGET ESTIMATE (BE)
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-right text-red-700 dark:text-red-400 text-sm">
                Rs. {dyn(data.totalBeLacs, '[Total BE Capex in Lacs]', 'totalBeLacs')} Lacs
              </td>
            </tr>
          </tbody>
        </table>

        {/* MIRR Compliance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs">
            <span className="text-zinc-500 block">Calculated MIRR:</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {dyn(data.calculatedMirrPercent, '[Calculated MIRR %]', 'calculatedMirrPercent')}%
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              Benchmark 12% Hurdle Rate Met: <strong>{dyn(data.mirrBenchmarkMet, 'Yes', 'mirrBenchmarkMet')}</strong>
            </span>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs">
            <span className="text-zinc-500 block">Sensitivity MIRR (-10% Volume):</span>
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {dyn(data.sensitivityMirrPercent, '[Sensitivity MIRR %]', 'sensitivityMirrPercent')}%
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              Remains financially viable under stress conditions
            </span>
          </div>
        </div>
      </div>

      {/* D) STATUTORY STATUS & DOA APPROVAL */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-2 border-b border-zinc-300 dark:border-zinc-700 uppercase">
          D) STATUTORY CLEARANCES & APPROVAL SOUGHT UNDER DOA
        </h3>

        <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 mb-3">
          <tbody>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3 font-semibold">DM / DC NOC Status</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.dmDcNocStatus, '[Applied / Under verification]', 'dmDcNocStatus')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">NHAI / PWD Access Permission</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.nhaiNocStatus, '[In-Principle approved / Applied]', 'nhaiNocStatus')}
              </td>
            </tr>
            <tr>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">PESO Layout Approval</td>
              <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                {dyn(data.pesoApprovalRef, '[PESO Plan Drawing submitted]', 'pesoApprovalRef')}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-xs">
          <div className="font-bold text-red-800 dark:text-red-300 uppercase tracking-wider mb-2">
            APPROVAL SOUGHT UNDER DELEGATION OF AUTHORITY (DOA ITEM 3.01 (b)):
          </div>
          <p className="leading-relaxed text-zinc-800 dark:text-zinc-200">
            Approval is hereby sought from the Competent Authority for development of new "B" Site Retail Outlet on dealer-owned land at{' '}
            <strong>{dyn(data.location, '[Advertised Location]', 'location')}</strong> with an estimated capital outlay of{' '}
            <strong>Rs. {dyn(data.totalBeLacs, '[Total BE Capex in Lacs]', 'totalBeLacs')} Lacs</strong> and appointment of{' '}
            <strong>{dyn(data.applicantName, '[Applicant Name]', 'applicantName')}</strong> as retail outlet dealer upon compliance with all statutory permissions and Corporation guidelines.
          </p>
          <div className="mt-3 flex justify-between items-center text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span>Competent Authority: <strong>State Head (SRH) / ED (State Office)</strong></span>
            <span>Delegation Item: <strong>DOA Item 3.01 (b) / SRMP Guidelines</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
