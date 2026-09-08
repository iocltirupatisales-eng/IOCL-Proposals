import React, { useState, useMemo } from 'react';
import { ProposalData } from '../types';
import { 
  detectMissingTemplateFields, 
  MissingFieldItem, 
  isValueUnfilledOrPlaceholder 
} from '../utils/missingDataDetector';
import { 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight,
  Database,
  FileText,
  HelpCircle
} from 'lucide-react';

interface FloatingMissingDataAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProposalData;
  templateId: string;
  onChange: (updates: Partial<ProposalData>) => void;
  focusedFieldKey?: string | null;
}

export const FloatingMissingDataAssistant: React.FC<FloatingMissingDataAssistantProps> = ({
  isOpen,
  onClose,
  data,
  templateId,
  onChange,
  focusedFieldKey,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMinimized, setIsMinimized] = useState(false);

  // Compute missing vs available fields
  const { missingFields, availableFields, totalCount, missingCount, completionPercent } = useMemo(() => {
    return detectMissingTemplateFields(data, templateId);
  }, [data, templateId]);

  // Categories present in this template
  const categories = useMemo(() => {
    const set = new Set<string>();
    missingFields.forEach((f) => set.add(f.category));
    return ['all', ...Array.from(set)];
  }, [missingFields]);

  // Filtered missing fields
  const displayedFields = useMemo(() => {
    return missingFields.filter((field) => {
      const matchesCat = selectedCategory === 'all' || field.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.placeholderText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [missingFields, selectedCategory, searchTerm]);

  // Handle single field input
  const handleFieldChange = (key: keyof ProposalData, value: string) => {
    onChange({ [key]: value });
  };

  // Quick fill all missing fields with OMC suggested defaults
  const handleFillAllDefaults = () => {
    const updates: Partial<ProposalData> = {};
    for (const item of missingFields) {
      if (item.suggestedDefault) {
        updates[item.key] = item.suggestedDefault as any;
      }
    }
    onChange(updates);
  };

  // Fill single default
  const handleFillSingleDefault = (item: MissingFieldItem) => {
    onChange({ [item.key]: item.suggestedDefault as any });
  };

  if (!isOpen) return null;

  return (
    <div
      id="floating-missing-data-window"
      className={`fixed z-50 transition-all duration-300 shadow-2xl border ${
        isMinimized
          ? 'bottom-6 right-6 w-80 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded-2xl p-3.5'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[540px] max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 border-red-200 dark:border-red-900/50 rounded-2xl'
      }`}
    >
      {/* Minimized View Header */}
      {isMinimized ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Missing Master Data
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                  {missingCount}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">
                {completionPercent}% template fields populated
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
              title="Expand Window"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Expanded Window Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-red-50/70 via-white to-amber-50/50 dark:from-red-950/40 dark:via-zinc-900 dark:to-amber-950/20 rounded-t-2xl">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                      Missing Data Assistant
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                      {templateId}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Data not found in master file to populate red bracketed placeholders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  title="Close Floating Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress & Quick Fill Bar */}
            <div className="mt-3.5 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {missingCount === 0 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> All 100% Populated!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                      <strong>{missingCount}</strong> missing field{missingCount > 1 ? 's' : ''} remaining
                    </span>
                  )}
                </div>
                <div className="w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      completionPercent === 100 ? 'bg-emerald-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-zinc-500">
                  {completionPercent}%
                </span>
              </div>

              {missingCount > 0 && (
                <button
                  onClick={handleFillAllDefaults}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  title="Auto-fill all missing parameters with standard IndianOil template values"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Fill All Defaults
                </button>
              )}
            </div>

            {/* Search & Category Filter */}
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search missing field or bracketed placeholder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
              </div>

              {categories.length > 2 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md whitespace-nowrap font-semibold transition-colors ${
                        selectedCategory === cat
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      {cat === 'all' ? `All (${missingCount})` : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Body: Scrollable Missing Fields List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[160px] max-h-[50vh]">
            {missingCount === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  All Master Data Fully Populated!
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-1">
                  Every red bracketed parameter in the {templateId} proposal note has been populated.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View Completed Proposal Note
                </button>
              </div>
            ) : displayedFields.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No missing fields match your search filter "{searchTerm}".
              </div>
            ) : (
              displayedFields.map((item) => {
                const isCurrentlyFocused = focusedFieldKey === item.key;
                const currentValue = (data as any)[item.key] || '';

                return (
                  <div
                    key={String(item.key)}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrentlyFocused
                        ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 ring-2 ring-red-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Placeholder and Category */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {item.label}
                        </div>
                        <div className="inline-block mt-0.5 font-mono text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/50">
                          {item.placeholderText}
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800">
                        {item.category}
                      </span>
                    </div>

                    {/* Input Control */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1">
                        {item.inputType === 'select' && item.options ? (
                          <select
                            value={currentValue}
                            onChange={(e) => handleFieldChange(item.key, e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-1 focus:ring-red-500"
                          >
                            <option value="">-- Select {item.label} --</option>
                            {item.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : item.inputType === 'textarea' ? (
                          <textarea
                            rows={2}
                            value={currentValue}
                            onChange={(e) => handleFieldChange(item.key, e.target.value)}
                            placeholder={`Enter ${item.label.toLowerCase()}...`}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-1 focus:ring-red-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleFieldChange(item.key, e.target.value)}
                            placeholder={`Enter ${item.label.toLowerCase()}...`}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-1 focus:ring-red-500"
                          />
                        )}
                      </div>

                      {/* Quick fill suggestion button */}
                      {item.suggestedDefault && (
                        <button
                          type="button"
                          onClick={() => handleFillSingleDefault(item)}
                          className="px-2.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-semibold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                          title={`Quick-fill standard recommendation: "${item.suggestedDefault}"`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Fill
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-b-2xl flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              Changes apply to proposal in real time
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Done / Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};
