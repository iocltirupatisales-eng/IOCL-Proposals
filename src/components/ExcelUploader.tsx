import React, { useRef, useState } from 'react';
import { parseExcelWorkbook } from '../utils/excelParser';
import { ProposalData } from '../types';
import { downloadSuggestedExcelForTemplate } from '../utils/excelExporter';
import { ProposalTemplate } from '../utils/templatesRegistry';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Download, 
  MapPin, 
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface ExcelUploaderProps {
  onDataLoaded: (data: ProposalData, siteLabel: string) => void;
  currentSiteName: string;
  activeTemplate: ProposalTemplate;
  onTemplateDetected?: (templateId: string) => void;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onDataLoaded,
  currentSiteName,
  activeTemplate,
  onTemplateDetected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [detectedSites, setDetectedSites] = useState<{ siteName: string; data: ProposalData }[]>([]);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const processFile = async (file: File) => {
    try {
      setErrorMessage(null);
      setSuccessInfo(null);
      const buffer = await file.arrayBuffer();
      const result = parseExcelWorkbook(buffer, activeTemplate.getInitialData(), activeTemplate.id);

      if (result.sites.length === 0) {
        setErrorMessage('No proposal data rows detected in this workbook.');
        return;
      }

      setLoadedFileName(file.name);
      setDetectedSites(result.sites);

      if (result.detectedTemplateId && result.detectedTemplateId !== activeTemplate.id && onTemplateDetected) {
        onTemplateDetected(result.detectedTemplateId);
      }

      // Load first site automatically
      const first = result.sites[0];
      onDataLoaded(first.data, first.siteName);
      setSuccessInfo(`Parsed ${result.sites.length} site proposal(s). Note generated automatically for "${first.siteName}"!`);
    } catch (err: any) {
      console.error('Error parsing excel:', err);
      setErrorMessage(err?.message || 'Error processing Excel file. Please ensure it is a valid .xlsx or .csv.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header with Template Association */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Suggested Excel Ingestion & Auto-Generation
            </h3>
          </div>
          <p className="text-xs text-zinc-500">
            Current active template: <strong className="text-zinc-800 dark:text-zinc-200">{activeTemplate.code} ({activeTemplate.shortName})</strong>
          </p>
        </div>

        {/* Direct Download of Suggested Excel for this template */}
        <button
          onClick={() => downloadSuggestedExcelForTemplate(activeTemplate)}
          className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors shadow-2xs self-start sm:self-center"
          title={`Download suggested Excel template workbook formatted specifically for ${activeTemplate.code}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Suggested Excel ({activeTemplate.code})</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-500/60 bg-zinc-50/60 dark:bg-zinc-950/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Drop your completed Excel sheet here or <span className="text-emerald-600 underline">browse file</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Upload any single-site or multi-site survey workbook (.xlsx, .xls, .csv). The final note is generated automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successInfo}</span>
        </div>
      )}

      {/* Detected Sites List */}
      {detectedSites.length > 0 && (
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Loaded File: <strong>{loadedFileName}</strong> ({detectedSites.length} site{detectedSites.length > 1 ? 's' : ''})</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1.5">
              Available Sites in Workbook (Click to switch proposal):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {detectedSites.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onDataLoaded(s.data, s.siteName)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                    currentSiteName === s.siteName
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{s.siteName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
