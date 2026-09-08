import React, { useState } from 'react';
import { ProposalTemplate, TEMPLATES_REGISTRY } from '../utils/templatesRegistry';
import { downloadSuggestedExcelForTemplate } from '../utils/excelExporter';
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  TrendingUp, 
  Download, 
  Check, 
  TableProperties, 
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: ProposalTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [inspectingTemplate, setInspectingTemplate] = useState<ProposalTemplate | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Select Proposal Note Template</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Select the standard OMC / IOCL executive note format. The system suggests and generates the matching Excel data sheet automatically.
          </p>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TEMPLATES_REGISTRY.map((t) => {
          const isSelected = t.id === selectedTemplateId;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTemplate(t)}
              className={`group relative p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-xs ring-1 ring-orange-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-orange-600'
                      }`}
                    >
                      {getIcon(t.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          {t.code}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-400">
                          {t.category}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {t.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>DOA: <strong className="text-zinc-700 dark:text-zinc-300">{t.doaApprover}</strong></span>
                  <span>{t.suggestedExcelColumns.length} fields</span>
                </div>
              </div>

              {/* Template Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectingTemplate(t);
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium flex items-center gap-1 hover:underline"
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>View Columns</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadSuggestedExcelForTemplate(t);
                  }}
                  title={`Download pre-formatted Excel template for ${t.code}`}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3 h-3 text-orange-600" />
                  <span>Get Excel Template</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Column Schema Inspector Modal */}
      {inspectingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Suggested Excel Structure for {inspectingTemplate.code}</span>
                </h3>
                <p className="text-xs text-zinc-500">{inspectingTemplate.title}</p>
              </div>
              <button
                onClick={() => setInspectingTemplate(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-2.5">Header (Column Key)</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Required</th>
                      <th className="p-2.5">Example / Sample</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {inspectingTemplate.suggestedExcelColumns.map((col, i) => (
                      <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="p-2.5 font-mono text-zinc-900 dark:text-zinc-100 font-medium">
                          {col.key}
                        </td>
                        <td className="p-2.5 text-zinc-500">{col.category}</td>
                        <td className="p-2.5">
                          {col.required ? (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-400">Optional</span>
                          )}
                        </td>
                        <td className="p-2.5 text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
                          {col.sampleValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
              <button
                onClick={() => setInspectingTemplate(null)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  downloadSuggestedExcelForTemplate(inspectingTemplate);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Excel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
