import React, { useState, useMemo } from 'react';
import { ProposalData } from '../types';
import { generateProposalMarkdown, cleanValue } from '../utils/markdownGenerator';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Eye, 
  Code, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { downloadProposalExcel } from '../utils/excelExporter';
import { GovtOrgProposalNote } from './GovtOrgProposalNote';
import { BSiteProposalNote } from './BSiteProposalNote';
import { detectMissingTemplateFields, isValueUnfilledOrPlaceholder } from '../utils/missingDataDetector';

interface ProposalViewerProps {
  data: ProposalData;
  highlightDynamic: boolean;
  onToggleHighlight: (val: boolean) => void;
  activeTemplateId?: string;
  onOpenMissingDataAssistant?: (fieldKey?: string) => void;
}

export const ProposalViewer: React.FC<ProposalViewerProps> = ({
  data,
  highlightDynamic,
  onToggleHighlight,
  activeTemplateId = 'RS-01/A',
  onOpenMissingDataAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown' | 'summary'>('preview');
  const [copied, setCopied] = useState(false);

  // Missing data stats for this template
  const { missingCount, totalCount, completionPercent } = useMemo(() => {
    return detectMissingTemplateFields(data, activeTemplateId);
  }, [data, activeTemplateId]);

  const markdownText = generateProposalMarkdown(data, false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (data.location || 'RO_Proposal').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `RO_Proposal_Note_${safeName}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadWordDoc = () => {
    // Generate an HTML document with proper formatting that Microsoft Word parses cleanly
    const content = document.getElementById('proposal-rendered-document')?.innerHTML;
    if (!content) return;

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Proposal Note - ${data.location}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #111; margin: 20mm; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 14pt; }
          th, td { border: 1pt solid #444; padding: 5pt 7pt; font-size: 10pt; text-align: left; }
          th { background-color: #f1f3f5; font-weight: bold; }
          h1 { font-size: 15pt; color: #b91c1c; text-align: center; margin-bottom: 2pt; }
          h2 { font-size: 13pt; text-align: center; margin-top: 0; margin-bottom: 12pt; }
          h3 { font-size: 12pt; border-bottom: 1.5pt solid #333; padding-bottom: 3pt; margin-top: 14pt; }
          .dynamic-text { color: ${highlightDynamic ? '#dc2626' : '#111'}; font-weight: 600; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (data.location || 'RO_Proposal').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `RO_Proposal_Note_${safeName}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render dynamic value
  const dyn = (val: string | number | undefined | null, fallback = 'N/A', fieldKey?: string) => {
    const isUnfilled = isValueUnfilledOrPlaceholder(val, fallback);
    const cleaned = isUnfilled ? fallback : cleanValue(val, fallback);
    
    return (
      <span
        onClick={() => {
          if (onOpenMissingDataAssistant && fieldKey) {
            onOpenMissingDataAssistant(fieldKey);
          }
        }}
        title={fieldKey ? `Click to edit ${fieldKey} (${fallback})` : undefined}
        className={`${onOpenMissingDataAssistant && fieldKey ? 'cursor-pointer hover:underline' : ''} ${
          isUnfilled
            ? 'text-red-700 dark:text-red-400 font-bold bg-red-100/70 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded px-1 py-0.5 animate-pulse inline-block'
            : highlightDynamic
            ? 'text-red-600 font-semibold dark:text-red-400'
            : 'font-medium text-zinc-900 dark:text-zinc-100'
        }`}
      >
        {cleaned}
      </span>
    );
  };

  const leaseRows = data.leaseSchedules || [];
  const grandTotalRent = leaseRows.reduce((acc, row) => acc + (row.totalPeriodRent || 0), 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
      {/* Top Action Header */}
      <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-red-700 text-white p-1.5 rounded-lg shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              Executive Proposal Note (OMC/IOCL)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {data.location || 'Retail Outlet'} • {data.district || 'District'} ({data.category || 'Category'})
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Official Note
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Executive KPIs
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'markdown'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Markdown
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Missing Data Floating Assistant Trigger */}
          {onOpenMissingDataAssistant && (
            <button
              onClick={() => onOpenMissingDataAssistant()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                missingCount > 0
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={
                missingCount > 0
                  ? `${missingCount} missing parameters in template. Click to open floating assistant!`
                  : 'All template parameters are 100% populated!'
              }
            >
              {missingCount > 0 ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{missingCount} Missing Data</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Populated</span>
                </>
              )}
            </button>
          )}

          {/* Highlight toggle */}
          <button
            onClick={() => onToggleHighlight(!highlightDynamic)}
            title="Toggle Red Font highlight for dynamic variables per template specification"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
              highlightDynamic
                ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300'
                : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Red Dynamic Text: <strong>{highlightDynamic ? 'ON' : 'OFF'}</strong></span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Copy standard Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy MD'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Download as Markdown file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.MD</span>
          </button>

          <button
            onClick={handleDownloadWordDoc}
            className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Download as Word DOC"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Word .DOC</span>
          </button>

          <button
            onClick={() => downloadProposalExcel(data)}
            className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Export Proposal Data to Excel Workbook"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'summary' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Capital Outlay (BE)</span>
                  <DollarSign className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Rs. {data.totalBeLacs} Lacs
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Civil: Rs. {data.constructionCostLacs}L • Mat: Rs. {data.materialCostLacs}L
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider">Calculated MIRR</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {data.calculatedMirrPercent}%
                </div>
                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Benchmark 12%: <strong>{data.mirrBenchmarkMet}</strong> (Sens: {data.sensitivityMirrPercent}%)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider">Monthly Lease Rent</span>
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Rs. {data.agreedRentMonthly}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Rs. {data.agreedRentPerSqm}/sqm • {data.escalationPercent}% esc / {data.escalationFrequency}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider">30-Yr Gross Rental Outgo</span>
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Rs. {grandTotalRent > 0 ? (grandTotalRent / 100000).toFixed(2) + ' Lacs' : data.grossRentalOutgo}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Inclusive of 18% GST over {data.leasePeriodYears}
                </div>
              </div>
            </div>

            {/* Quick Site Information Brief */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-red-600" />
                Key Proposal Attributes & Compliance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-500 block">Location as Advertised:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.advtLocationName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">District & State:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.district}, {data.state}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Selected Applicant:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.applicantName} ({data.constitution})</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Survey Number:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.surveyNo}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Plot Dimensions & Area:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.plotFrontage}m x {data.plotDepth}m ({data.plotAreaSqm} Sqm)</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">DM/DC NOC Clearance:</span>
                  <span className="font-semibold text-emerald-600">{data.dmDcNocStatus}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">PESO Construction Approval:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.pesoApprovalRef} dt. {data.pesoApprovalDate}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Sales Volume (Yr 1 / Yr 3):</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    MS: {data.salesFeasibilityCurrent?.[0]?.ms || '-'} / {data.salesFeasibilityCurrent?.[2]?.ms || '-'} KLPM • HSD: {data.salesFeasibilityCurrent?.[0]?.hsd || '-'} / {data.salesFeasibilityCurrent?.[2]?.hsd || '-'} KLPM
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Valuation Comparison:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Valuer 1: Rs. {data.valuer1MonthlyRent} • Valuer 2: Rs. {data.valuer2MonthlyRent} (Agreed: Rs. {data.agreedRentMonthly})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 text-zinc-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800 selection:bg-red-800">
              <pre>{markdownText}</pre>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div 
            id="proposal-rendered-document" 
            className="max-w-4xl mx-auto bg-white dark:bg-zinc-950 p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm text-zinc-900 dark:text-zinc-100 text-sm leading-normal print:p-0 print:border-none print:shadow-none"
          >
            {activeTemplateId === 'RS-02/A' ? (
              <GovtOrgProposalNote
                data={data}
                highlightDynamic={highlightDynamic}
                onFieldClick={onOpenMissingDataAssistant}
              />
            ) : activeTemplateId === 'RS-01/D' ? (
              <BSiteProposalNote
                data={data}
                highlightDynamic={highlightDynamic}
                onFieldClick={onOpenMissingDataAssistant}
              />
            ) : (
              <>
                {/* Official Header */}
                <div className="text-center pb-4 mb-6 border-b-2 border-zinc-900 dark:border-zinc-100">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Indian Oil Corporation Limited • Retail Sales Group
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-red-700 dark:text-red-500 mt-1">
                Template Ref No: {dyn(data.templateRefNo, 'RS-01/A dtd. 01.09.2026')}
              </h1>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {data.proposalTitle || 'Development of new A-site RO under SRMP'}
              </h2>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Date: {dyn(data.documentDate)} • State Office: {dyn(data.stateOffice)} • DO: {dyn(data.divisionalOffice)}
              </div>
            </div>

            {/* SUBJECT */}
            <div className="my-5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                SUBJECT:
              </div>
              <div className="font-medium leading-relaxed">
                Approval for taking land on {dyn(data.tenureType, 'Long Term Lease')} and development of new A-site RO at advertised{' '}
                {dyn(data.location)}, {dyn(data.district)}, {dyn(data.state)} under {dyn(data.category)}.
              </div>
            </div>

            {/* BACKGROUND */}
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 mt-6">
              BACKGROUND:
            </div>

            {/* A) BASIC INFORMATION */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                A) BASIC INFORMATION
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 mb-4">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                    <tr>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">S.No.</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">Particulars</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 font-semibold">
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2" colSpan={2}>Advertisement</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Location as per Advertisement {data.annexAdvt && `[${data.annexAdvt}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        {dyn(data.advtLocationSNo)}, {dyn(data.advtLocationName)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">District, State</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.district)}, {dyn(data.state)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Retail Sales Area</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.retailSalesArea)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Divisional Office, State Office</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.divisionalOffice)}, {dyn(data.stateOffice)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.5</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRMP (Year)</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.srmpYear)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.6</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Date of Advertisement</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.dateOfAdvertisement)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.7</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Corrigendum if any {data.annexCorrigendum && `[${data.annexCorrigendum}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.corrigendumDetails)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.8</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Regular/Rural</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.marketType)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.9</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Class of Market</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.classOfMarket)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.10</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Type of Road abutting to offered plot/Road No.</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.roadType)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.11</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Category</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.category)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.12</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Corpus Fund Scheme</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.corpusFundScheme)}</td>
                    </tr>

                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 font-semibold">
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2" colSpan={2}>Selection / LOI</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Single Applicant / Draw of Lots / Bidding</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        {dyn(data.selectionMode)} {data.bidAmount && data.bidAmount !== 'N/A' && `(Bid Amount: ${data.bidAmount})`}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Name as per Application form {data.annexApplication && `[${data.annexApplication}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">{dyn(data.applicantName)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Constitution</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.constitution)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        ASC {data.annexAsc && `[${data.annexAsc}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.ascApprovalDate)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.5</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        LEC {data.annexLec && `[${data.annexLec}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Date: {dyn(data.lecDate)} • Status: {dyn(data.lecStatus)}<br />
                        <span className="text-zinc-500">{data.lecObservations}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.6</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        FVC {data.annexFvc && `[${data.annexFvc}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Date: {dyn(data.fvcDate)} • Status: {dyn(data.fvcStatus)}<br />
                        <span className="text-zinc-500">{data.fvcObservations}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.7</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        LOI Approval {data.annexLoiApproval && `[${data.annexLoiApproval}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Date: {dyn(data.loiApprovalDate)} • Comments: {dyn(data.loiComments)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.8</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        LOI {data.annexLoi && `[${data.annexLoi}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.loiDate)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.9</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Addendum to LOI if any {data.annexAddendum && `[${data.annexAddendum}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        {data.addendumLoiDate && data.addendumLoiDate !== 'N/A'
                          ? `Date: ${dyn(data.addendumLoiDate)} • Reason: ${dyn(data.addendumReason)}`
                          : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* B) SALES / BUSINESS DATA */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                B) SALES / BUSINESS DATA
              </h3>

              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  1. Sales Projection as per Feasibility (Before Advertisement) {data.annexFeasibilityBefore && `[${data.annexFeasibilityBefore}]`}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 text-center">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                      <tr>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Year</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">MS (KLPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">HSD (KLPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Lubes (KLPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">CNG (MTPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">NFR (Rs. Lacs/mo)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.salesFeasibilityBefore || []).map((row, idx) => (
                        <tr key={idx}>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">{row.year}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.ms)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.hsd)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.lubes)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.cng)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.nfr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  2. Trading Area Summary (Before Advertisement) {data.annexTradingAreaBefore && `[${data.annexTradingAreaBefore}]`}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 text-center">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                      <tr>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">OMCs</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">No. of ROs</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">MS Vol in KLPM</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">HSD Vol in KLPM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.tradingAreaBefore || []).map((row, idx) => (
                        <tr key={idx} className={row.omc === 'Total' ? 'font-bold bg-zinc-100 dark:bg-zinc-800' : ''}>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{row.omc}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.rosCount)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.msVol)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.hsdVol)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  3. Sales Projection as per Feasibility (Current) {data.annexFeasibilityCurrent && `[${data.annexFeasibilityCurrent}]`}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 text-center">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                      <tr>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Year</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">MS (KLPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">HSD (KLPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Lubes (KLPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">CNG (MTPM)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">NFR (Rs. Lacs/mo)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.salesFeasibilityCurrent || []).map((row, idx) => (
                        <tr key={idx}>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">{row.year}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.ms)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.hsd)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.lubes)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.cng)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.nfr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  4. Trading Area Summary (Current) {data.annexTradingAreaCurrent && `[${data.annexTradingAreaCurrent}]`}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 text-center">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                      <tr>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">OMCs</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">No. of ROs</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">MS Vol in KLPM</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">HSD Vol in KLPM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.tradingAreaCurrent || []).map((row, idx) => (
                        <tr key={idx} className={row.omc === 'Total' ? 'font-bold bg-zinc-100 dark:bg-zinc-800' : ''}>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{row.omc}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.rosCount)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.msVol)}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(row.hsdVol)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reasons for variation */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs space-y-1.5">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. Reason for Variation:</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.1 Subsequent development:</span> {dyn(data.reasonSubsequentDev)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.2 New Project:</span> {dyn(data.reasonNewProject)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.3 Natural halting point:</span> {dyn(data.reasonHaltingPoint)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.4 Closure of existing RO:</span> {dyn(data.reasonClosureRO)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.5 Road related development:</span> {dyn(data.reasonRoadDev)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.6 Any other:</span> {dyn(data.reasonOther)}</div>
              </div>
            </div>

            {/* C) LAND DETAILS, NEGOTIATION & TSR */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                C) LAND DETAILS, NEGOTIATION & TSR
              </h3>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                    <tr>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">S.No.</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">Particulars</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 font-semibold">
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2" colSpan={2}>Land Particulars</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Group as per land offered</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.landGroup)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Reference land document to ascertain ownership {data.annexLandDoc && `[${data.annexLandDoc}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        {dyn(data.landDocType)} • Balance period: {dyn(data.leaseBalancePeriod)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Landowner</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">{dyn(data.landownerName)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Relationship with Applicant</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        LOI Holder: {dyn(data.isLoiHolder)} ({dyn(data.relationshipWithApplicant)})
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.5</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Land Survey No.</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                        {dyn(data.surveyNo)} {data.surveyRemarks && `(${data.surveyRemarks})`}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.6</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Land dimensions as per LOI</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Frontage: {dyn(data.plotFrontage)} m x Depth: {dyn(data.plotDepth)} m • Area: {dyn(data.plotAreaSqm)} Sqm
                      </td>
                    </tr>

                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 font-semibold">
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2" colSpan={2}>Rent Negotiation</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Negotiation Date</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.negotiationDate)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Committee nomination Approval {data.annexCommittee && `[${data.annexCommittee}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Date: {dyn(data.committeeApprovalDate)} • Members: {dyn(data.committeeMembers)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Amount & other details quoted in Application</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Area: {dyn(data.quotedArea)} • Amount: {dyn(data.quotedAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Initial offer letter, other than application form {data.annexInitialOffer && `[${data.annexInitialOffer}]`}
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Date: {dyn(data.initialOfferDate)} • Amount: {dyn(data.initialOfferAmount)} • Escalation: {dyn(data.initialOfferEscalation)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Valuation Details Table */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  3. Valuation Details {data.annexValuationReport && `[${data.annexValuationReport}]`}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 text-center">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                      <tr>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-12">S.No.</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Particulars</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Valuer 1: {dyn(data.valuer1Name)}</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Valuer 2: {dyn(data.valuer2Name)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.1</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Date of Valuation</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.valuer1Date)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.valuer2Date)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.2</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Area considered (sqm)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.valuer1Area)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.valuer2Area)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.3</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Guideline value/Circle Rate (Rs/sqm)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer1CircleRate)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer2CircleRate)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.4</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Market Rate (Rs/sqm)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer1MarketRate)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer2MarketRate)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.5</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Value of Property for Area considered (Rs.)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer1PropertyVal)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer2PropertyVal)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.6</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Rent Rate Recommended by Valuer (Rs/sqm/mo)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer1RentRate)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.valuer2RentRate)}</td>
                      </tr>
                      <tr className="font-semibold bg-zinc-50 dark:bg-zinc-900/40">
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.7</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Monthly Rent Recommended for area (Rs/mo)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-zinc-900 dark:text-zinc-100">Rs. {dyn(data.valuer1MonthlyRent)}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-zinc-900 dark:text-zinc-100">Rs. {dyn(data.valuer2MonthlyRent)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4 Negotiation Agreed Framework */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  4. Negotiation T&C: Agreed Framework
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                    <tbody>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium w-1/3">4.1 Area of plot</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.agreedAreaSqm)} Sqm</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.2 Rent for the area</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-red-700 dark:text-red-400">
                          Rs. {dyn(data.agreedRentMonthly)} per month (Exclusive of GST)
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.3 Rent Rate</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {dyn(data.agreedRentPerSqm)} / sqm / month</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.4 GST</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.gstStatus)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.5 Escalation & Frequency</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                          {dyn(data.escalationPercent)}% escalation {dyn(data.escalationFrequency)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.6 Lease Period</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.leasePeriodYears)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.7 Advance Payment</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.advancePayment)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">4.8 Committee Negotiation Report {data.annexCommitteeReport && `[${data.annexCommitteeReport}]`}</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.committeeNegotiationTerms)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5 Legal Opinion */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs space-y-1.5">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. Legal Opinion:</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.1 Title Clearance Search Report:</span> {dyn(data.titleSearchDate)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.2 Land Ownership:</span> {dyn(data.landOwnershipConfirmed)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.3 Title Marketability:</span> {dyn(data.titleAdvocateConfirmation)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.4 Complaint / Court Case:</span> {dyn(data.complaintDetails)}</div>
                <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">5.5 Undertaking:</span> {dyn(data.undertakingDetails)}</div>
              </div>
            </div>

            {/* PROPOSAL: D & E */}
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                PROPOSAL:
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                D) BUSINESS OBJECTIVE
              </h3>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                {dyn(data.businessObjectiveText)}
              </p>

              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                E) SCOPE / KEY FEATURES
              </h3>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                    <tr>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">S.No.</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">Component</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2">Specification / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Archetype</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">{dyn(data.archetype)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Layout Drawing {data.annexLayout && `[${data.annexLayout}]`}</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Legible, duly signed by DRSH & DO Retail Engg.</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Deviation from standard layout</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.layoutDeviation)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">2.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Concept Note</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Date: {dyn(data.conceptNoteDate)} • Deviation: {dyn(data.conceptDeviations)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Tanks, DUs & STP</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.facilitiesTanksDUs)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Infrastructure</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.facilitiesInfrastructure)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Driveway</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.facilitiesDriveway)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3.4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Electrical</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.facilitiesElectrical)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3.5</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">RVI</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.facilitiesRvi)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">3.6</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Miscellaneous</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.facilitiesMisc)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* F) OTHER RELEVANT INFORMATION */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                F) OTHER RELEVANT INFORMATION (Statutory Clearances)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                    <tr>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-16 text-center">S.No.</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">Statutory Clearance</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">DM/DC NOC</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">{dyn(data.dmDcNocStatus)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">NHAI NOC if applicable</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.nhaiNocStatus)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Land NA/CLU</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.landNaCluStatus)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Building Use Permission</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.buildingUsePermissionStatus)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.5</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Site specific permission</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.siteSpecificPermissionStatus)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.6</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Site development {data.annexSiteDev && `[${data.annexSiteDev}]`}</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">MOM Date: {dyn(data.siteDevMomDate)} • Status: {dyn(data.siteDevCurrentStatus)}</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">1.7</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">PESO Construction Approval {data.annexPeso && `[${data.annexPeso}]`}</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">Ref: {dyn(data.pesoApprovalRef)} dt. {dyn(data.pesoApprovalDate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* G) JUSTIFICATION */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                G) JUSTIFICATION
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-1.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">1. Rationale:</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">1.1 Sales Potential:</span> {dyn(data.rationaleSalesPotential)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">1.2 Clear Title:</span> {dyn(data.rationaleClearTitle)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">1.3 MIRR vs Benchmark:</span> {dyn(data.rationaleMirr)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">1.4 Site-specific:</span> {dyn(data.rationaleSiteSpecific)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">1.5 Others:</span> {dyn(data.rationaleOthers)}</div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-1.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">2. Approvals for Exceptions covered under Policy, if any:</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">2.1 Provision of Facilities:</span> {dyn(data.exceptionFacilities)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">2.2 Canopy/RVI (Policy 174-08/2010):</span> {dyn(data.exceptionCanopyRvi)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">2.3 Layout deviation:</span> {dyn(data.exceptionLayout)}</div>
                  <div><span className="font-semibold text-zinc-700 dark:text-zinc-300">2.4 Any other Exception:</span> {dyn(data.exceptionOther)}</div>
                </div>
              </div>
            </div>

            {/* FINANCIAL IMPLICATION: H) FINANCIAL BREAK-UP */}
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                FINANCIAL IMPLICATION:
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                H) FINANCIAL BREAK-UP
              </h3>

              {/* 1 Lease Rental Table */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  1. Lease Rental Escalation Matrix (30 Years)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700 text-right">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-center">
                      <tr>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Period / Escalation</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Rent Per Month (Rs)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">GST @ 18% (Rs)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Rent/Mo (Incl. GST)</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">No. of Months</th>
                        <th className="border border-zinc-300 dark:border-zinc-700 p-2">Total for Period (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaseRows.map((r, idx) => (
                        <tr key={idx}>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left font-semibold">{r.periodLabel}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {r.rentPerMonth?.toLocaleString('en-IN')}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2">Rs. {r.gstAmount?.toLocaleString('en-IN')}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">Rs. {r.rentInclGst?.toLocaleString('en-IN')}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center">{r.months}</td>
                          <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">Rs. {r.totalPeriodRent?.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                      <tr className="bg-zinc-100 dark:bg-zinc-800 font-extrabold">
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-left" colSpan={5}>
                          Total Gross Rental Outgo (Incl. GST 18%)
                        </td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-red-700 dark:text-red-400">
                          Rs. {grandTotalRent.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2 Legal Expenses & 3 Development Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    2. Legal Expenses
                  </div>
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                    <tbody>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">2.1 Stamp Duty</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">{dyn(data.stampDuty)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">2.2 Registration Charges</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">{dyn(data.registrationCharges)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">2.3 Legal & Misc Expenses</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">{dyn(data.legalMiscExpenses)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    3. Development Cost
                  </div>
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                    <tbody>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.1 Material Cost</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">Rs. {dyn(data.materialCostLacs)} Lacs</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.2 Construction Cost</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">Rs. {dyn(data.constructionCostLacs)} Lacs</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.3 Contingency & Consultancy</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">Rs. {dyn(data.contingencyCostLacs)} Lacs</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.4 Statutory payments</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">Rs. {dyn(data.statutoryCostLacs)} Lacs</td>
                      </tr>
                      <tr className="bg-red-50 dark:bg-red-950/30 font-bold">
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">3.5 Total Capital Outlay (BE)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-red-700 dark:text-red-400">
                          Rs. {dyn(data.totalBeLacs)} Lacs
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4 MIRR Working */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  4. MIRR Working
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                    <tbody>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3">4.1 MIRR Reference No.</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-medium">{dyn(data.mirrRefNo)}</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">4.2 Calculated MIRR</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-emerald-700 dark:text-emerald-400">
                          {dyn(data.calculatedMirrPercent)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">4.3 MIRR at (-)10% Sensitivity</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">
                          {dyn(data.sensitivityMirrPercent)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">4.4 MIRR &gt; Benchmark (12%)</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-emerald-600">
                          {dyn(data.mirrBenchmarkMet)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">4.5 Applicability of BFF</td>
                        <td className="border border-zinc-300 dark:border-zinc-700 p-2">{dyn(data.bffApplicability)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DOA & EFFECTIVE AUTHORITY (Page 8 Table) */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-1 mb-3 border-b border-zinc-300 dark:border-zinc-700">
                DOA & EFFECTIVE AUTHORITY
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                    <tr>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/3 text-left">DOA / Policy</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-1/4 text-left">Authority</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Approval Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">2.05</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per DOA</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">For administrative and expenditure approval for Advocate Professional Fees, Incidental expenses</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">3.01 (a) (i)</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per DOA</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">For development of the RO</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">3.02 & 10.04</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per DOA</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">For taking the land on Outright Purchase/Lease as per rentals negotiated</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">3.07 (d)</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per DOA</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Extension of LOI</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">8.03 (b)</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per DOA</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Stamp Duty & Registration fees</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">143-01/2009 dtd. 21.01.2009</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Land Procurement as per Clause 11 of Policy</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">144-02/2009 dtd. 16.02.2009</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Setting-up new ROs under Clause 2.2.4 & exception under 3.2.2.i</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">152-06/2009 dtd. 30.06.2009</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Tank proposed as per Policy</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">174-08/2010 dtd. 30.08.2010</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Mandatory Facilities, exception for not providing Canopy in D1 class market</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">211-02/2013 dtd. 12.02.2013</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">DU proposed as per Clause 2.1 (c) for provision of more than 2 MPDs</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">226-12/2015 dtd. 01.12.2015</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Setting up of new KSK</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">237-03/2016 dtd. 08.03.2016</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Improving Site Security - Outright purchase</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">291-03/2021 dtd. 18.03.2021</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">RVI proposed as per Policy</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">346/03-2026 dtd. 27.03.2026</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH / As per Policy</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">BFF</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">RS/Land Procurement/07-2015</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">As per DOA</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Additional area</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">Clause F-6 of IWPM & RET-ENG/in/26/1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH & SREH</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Layout deviation</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-semibold">ENG/20/377 dtd. 26.03.2006</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">SRH</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Tank capacity - 10/50 KL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CONCLUSION (Page 9) */}
            <div className="mt-8 pt-4 border-t-2 border-zinc-900 dark:border-zinc-100">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                CONCLUSION:
              </div>
              <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed mb-4">
                In view of the above, kind approval is requested for the development of the subject new A-site RO on land admeasuring{' '}
                {dyn(data.plotAreaSqm)} sqm, bearing Survey No. {dyn(data.surveyNo)} at {dyn(data.location)}, {dyn(data.district)}, {dyn(data.state)}.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-zinc-300 dark:border-zinc-700">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold">
                    <tr>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-12 text-center">S.No.</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-28 text-left">Authority</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 text-left">Approval Requested</th>
                      <th className="border border-zinc-300 dark:border-zinc-700 p-2 w-24 text-center">DOA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-bold">1</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">DRSH</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Administrative and expenditure approval for Advocate Professional Fees, incidental expenses of{' '}
                        <strong>Rs. {dyn(data.advocateFeesExpenses)}</strong>
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-medium">2.05 (a)</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-bold">2</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">[As applicable]</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">[Exceptions covered under Policy]</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-medium">[Relevant DOA/Policy]</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-bold">3</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">SRH</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">Extension of LOI</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-medium">3.07 (d)</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-bold">4</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">DRSH/SRH</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Approval for Registration charges & Stamp duty for Sale/Lease agreement of the subject new A-site RO with an estimated expenditure of{' '}
                        <strong>Rs. {dyn(data.registrationStampExp)}</strong>
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-medium">8.03 (b)</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-bold">5</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">SRH/ CH(RB)</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2">
                        Approval for development of the subject new A-site RO with an estimated investment of{' '}
                        <strong>Rs. {dyn(data.totalBeLacs)} Lacs</strong> (including GST & contingency) yielding MIRR of{' '}
                        <strong>{dyn(data.calculatedMirrPercent)}%</strong>
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-medium">03.01 (a) (i)</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-bold">6</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 font-bold text-zinc-900 dark:text-zinc-100">SRH / CH (RB)</td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 leading-relaxed">
                        Approval for taking the above land, as recommended by rental negotiation committee and execution of Lease for{' '}
                        <strong>{dyn(data.leasePeriodYears)}</strong> with Landlord <strong>{dyn(data.landownerName)}</strong> with an initial rental of{' '}
                        <strong>Rs. {dyn(data.agreedRentMonthly)}</strong> per month, excluding GST with escalation once in{' '}
                        <strong>{dyn(data.escalationFrequency)}</strong> @ <strong>{dyn(data.escalationPercent)}%</strong> with gross rental outgo of{' '}
                        <strong>Rs. {grandTotalRent > 0 ? grandTotalRent.toLocaleString('en-IN') : dyn(data.grossRentalOutgo)}</strong>, including GST 18%.
                      </td>
                      <td className="border border-zinc-300 dark:border-zinc-700 p-2 text-center font-medium">3.02 (a) & 10.04 (b)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-center font-mono text-zinc-400 mt-8">
                ********************************
              </div>
            </div>
            </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
