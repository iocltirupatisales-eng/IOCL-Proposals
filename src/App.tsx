import React, { useState, useEffect, useMemo } from 'react';
import { ProposalData } from './types';
import { ProposalTemplate, TEMPLATES_REGISTRY, getTemplateById } from './utils/templatesRegistry';
import { TemplateSelector } from './components/TemplateSelector';
import { ExcelUploader } from './components/ExcelUploader';
import { FormEditor } from './components/FormEditor';
import { FinancialCalculator } from './components/FinancialCalculator';
import { ProposalViewer } from './components/ProposalViewer';
import { DriveModal } from './components/DriveModal';
import { FloatingMissingDataAssistant } from './components/FloatingMissingDataAssistant';
import { detectMissingTemplateFields } from './utils/missingDataDetector';
import { initAuth, googleSignIn, saveProposalToDrive } from './utils/googleDrive';
import { User } from 'firebase/auth';
import { 
  Building2, 
  Sparkles, 
  Cloud, 
  FolderSync, 
  Layers, 
  SlidersHorizontal, 
  FileText, 
  Calculator, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Check, 
  CheckCircle2, 
  Download, 
  Share2, 
  PlusCircle, 
  ChevronDown,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Active Template
  const [activeTemplate, setActiveTemplate] = useState<ProposalTemplate>(TEMPLATES_REGISTRY[0]);
  
  // Proposal Data (default initialized to the active template's dataset)
  const [currentProposal, setCurrentProposal] = useState<ProposalData>(activeTemplate.getInitialData());
  const [siteLabel, setSiteLabel] = useState<string>('Yerpedu Bypass on NH-71');
  
  // Highlighting dynamic variables in red font
  const [highlightDynamic, setHighlightDynamic] = useState<boolean>(true);

  // Workflow / Step navigation
  const [activeStep, setActiveStep] = useState<'templates' | 'editor' | 'calculator'>('templates');
  
  // Layout view modes: 'split' (side by side) vs 'reading' (full-width document)
  const [viewMode, setViewMode] = useState<'split' | 'reading'>('split');
  const [mobileTab, setMobileTab] = useState<'workspace' | 'note'>('workspace');

  // Google Drive Integration State
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveSaveStatus, setDriveSaveStatus] = useState<string | null>(null);

  // Floating Missing Data Assistant State
  const [isMissingDataModalOpen, setIsMissingDataModalOpen] = useState(false);
  const [focusedFieldKey, setFocusedFieldKey] = useState<string | null>(null);

  // Missing data stats for current proposal and active template
  const missingStats = useMemo(() => {
    return detectMissingTemplateFields(currentProposal, activeTemplate.id);
  }, [currentProposal, activeTemplate.id]);

  const handleOpenMissingDataAssistant = (fieldKey?: string) => {
    setFocusedFieldKey(fieldKey || null);
    setIsMissingDataModalOpen(true);
  };

  // Auth initialization for Drive
  useEffect(() => {
    const unsub = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setDriveToken(token || null);
      },
      () => {
        setUser(null);
        setDriveToken(null);
      }
    );
    return () => unsub();
  }, []);

  // When user switches templates
  const handleSelectTemplate = (template: ProposalTemplate) => {
    setActiveTemplate(template);
    const initial = template.getInitialData();
    setCurrentProposal(initial);
    setSiteLabel(initial.location || template.shortName);
  };

  // When an Excel file is uploaded and parsed
  const handleDataLoaded = (data: ProposalData, label: string) => {
    setCurrentProposal(data);
    setSiteLabel(label);
    
    // Automatically check for missing fields and pop up floating assistant if any missing
    const stats = detectMissingTemplateFields(data, activeTemplate.id);
    if (stats.missingCount > 0) {
      setFocusedFieldKey(null);
      setIsMissingDataModalOpen(true);
    }
  };

  // When template is auto-detected from uploaded workbook
  const handleTemplateDetected = (templateId: string) => {
    const found = TEMPLATES_REGISTRY.find((t) => t.id === templateId);
    if (found && found.id !== activeTemplate.id) {
      setActiveTemplate(found);
    }
  };

  const handleDataChange = (updated: Partial<ProposalData>) => {
    setCurrentProposal((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // When user retrieves a saved proposal from Google Drive
  const handleProposalRetrieved = (proposal: ProposalData, templateId: string, siteName: string) => {
    const matchedTemplate = getTemplateById(templateId);
    setActiveTemplate(matchedTemplate);
    setCurrentProposal(proposal);
    setSiteLabel(siteName || proposal.location || 'Retrieved Site');
    setViewMode('split');
  };

  // 1-Click quick save to Google Drive
  const handleQuickSaveToDrive = async () => {
    if (!driveToken) {
      // Prompt sign-in first
      try {
        const res = await googleSignIn();
        if (res) {
          setUser(res.user);
          setDriveToken(res.accessToken);
          setDriveSaveStatus('Saving to Drive...');
          await saveProposalToDrive(res.accessToken, currentProposal, activeTemplate.id, siteLabel);
          setDriveSaveStatus('Saved to Drive!');
          setTimeout(() => setDriveSaveStatus(null), 3000);
        }
      } catch (err: any) {
        console.error('Sign-in error:', err);
        setIsDriveModalOpen(true);
      }
      return;
    }

    try {
      setDriveSaveStatus('Saving to Drive...');
      await saveProposalToDrive(driveToken, currentProposal, activeTemplate.id, siteLabel);
      setDriveSaveStatus('Saved to Drive!');
      setTimeout(() => setDriveSaveStatus(null), 3000);
    } catch (err: any) {
      console.error('Save error:', err);
      setDriveSaveStatus('Save failed');
      setIsDriveModalOpen(true);
      setTimeout(() => setDriveSaveStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-orange-500 selection:text-white">
      {/* Top Corporate Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-2.5 transition-colors no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Corporate Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Retail Outlet Proposal Engine
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900">
                  OMC / IOCL Standard
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {activeTemplate.code}
                </span>
                <span>•</span>
                <span className="truncate max-w-[180px] sm:max-w-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  {siteLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right Toolbar: Google Drive Integration, View Modes, & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Google Drive Status & Action Pill */}
            <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
              <button
                onClick={handleQuickSaveToDrive}
                title={user ? `Save proposal note directly to Google Drive as ${user.email}` : 'Sign in & Save note to Google Drive'}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{driveSaveStatus || 'Save to Drive'}</span>
              </button>

              <button
                onClick={() => setIsDriveModalOpen(true)}
                title="Browse & retrieve saved proposal notes from Google Drive"
                className="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
              >
                <FolderSync className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Drive Archive</span>
                {user && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title={`Connected as ${user.email}`} />
                )}
              </button>

              {/* Floating Missing Data Assistant Trigger */}
              <button
                onClick={() => handleOpenMissingDataAssistant()}
                title={
                  missingStats.missingCount > 0
                    ? `${missingStats.missingCount} red bracketed items are missing. Click to open floating assistant.`
                    : 'All parameters in template are filled!'
                }
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                  missingStats.missingCount > 0
                    ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 animate-pulse'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {missingStats.missingCount > 0 ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>{missingStats.missingCount} Missing Fields</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Fields Complete</span>
                  </>
                )}
              </button>
            </div>

            {/* View Mode Toggle: Split vs Reading View */}
            <div className="hidden md:flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                title="Interactive Split View (Inputs on Left, Live Note on Right)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                onClick={() => setViewMode('reading')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'reading'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                title="Immersive Full Reading View (Ideal for final review & print)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Note View</span>
              </button>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex md:hidden bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setMobileTab('workspace')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  mobileTab === 'workspace'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => setMobileTab('note')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  mobileTab === 'note'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Note View
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
        {viewMode === 'reading' ? (
          /* FULL DOCUMENT READING VIEW */
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs no-print">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                  {activeTemplate.code}
                </span>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {activeTemplate.title}
                </span>
              </div>
              <button
                onClick={() => setViewMode('split')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Return to Split Workspace</span>
              </button>
            </div>

            <ProposalViewer
              data={currentProposal}
              highlightDynamic={highlightDynamic}
              onToggleHighlight={setHighlightDynamic}
              activeTemplateId={activeTemplate.id}
              onOpenMissingDataAssistant={handleOpenMissingDataAssistant}
            />
          </div>
        ) : (
          /* INTERACTIVE SPLIT WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Clean, Decluttered Tabbed Workspace */}
            <div
              className={`lg:col-span-5 space-y-4 ${
                mobileTab === 'note' ? 'hidden lg:block' : 'block'
              } no-print`}
            >
              {/* Clean Stepper / Workspace Navigation */}
              <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs text-xs font-medium">
                <button
                  onClick={() => setActiveStep('templates')}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeStep === 'templates'
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1. Template & Excel</span>
                </button>

                <button
                  onClick={() => setActiveStep('editor')}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeStep === 'editor'
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>2. Review Data</span>
                </button>

                <button
                  onClick={() => setActiveStep('calculator')}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeStep === 'calculator'
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>3. Financials</span>
                </button>
              </div>

              {/* TAB 1: TEMPLATES & SUGGESTED EXCEL INGESTION */}
              {activeStep === 'templates' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Template Picker */}
                  <TemplateSelector
                    selectedTemplateId={activeTemplate.id}
                    onSelectTemplate={handleSelectTemplate}
                  />

                  {/* Excel Upload & Auto-Generation tailored for the active template */}
                  <ExcelUploader
                    activeTemplate={activeTemplate}
                    onDataLoaded={handleDataLoaded}
                    currentSiteName={siteLabel}
                    onTemplateDetected={handleTemplateDetected}
                  />
                </div>
              )}

              {/* TAB 2: PARAMETERS & FIELD REVIEW */}
              {activeStep === 'editor' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Proposal Details & Fine-Tuning
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Template: {activeTemplate.code}
                    </span>
                  </div>
                  <FormEditor data={currentProposal} onChange={handleDataChange} />
                </div>
              )}

              {/* TAB 3: FINANCIAL LEASE & DOA CALCULATOR */}
              {activeStep === 'calculator' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      30-Year Lease Escalation & MIRR Engine
                    </span>
                  </div>
                  <FinancialCalculator
                    data={currentProposal}
                    onChange={handleDataChange}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Live High-Fidelity Executive Proposal Note */}
            <div
              className={`lg:col-span-7 flex flex-col h-[calc(100vh-6.5rem)] sticky top-20 ${
                mobileTab === 'workspace' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <ProposalViewer
                data={currentProposal}
                highlightDynamic={highlightDynamic}
                onToggleHighlight={setHighlightDynamic}
                activeTemplateId={activeTemplate.id}
                onOpenMissingDataAssistant={handleOpenMissingDataAssistant}
              />
            </div>
          </div>
        )}
      </main>

      {/* Google Drive Archive & Retrieval Modal */}
      <DriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        currentProposal={currentProposal}
        currentTemplateId={activeTemplate.id}
        currentSiteName={siteLabel}
        onProposalRetrieved={handleProposalRetrieved}
      />

      {/* Floating Missing Data Assistant */}
      <FloatingMissingDataAssistant
        isOpen={isMissingDataModalOpen}
        onClose={() => {
          setIsMissingDataModalOpen(false);
          setFocusedFieldKey(null);
        }}
        data={currentProposal}
        templateId={activeTemplate.id}
        onChange={handleDataChange}
        focusedFieldKey={focusedFieldKey}
      />
    </div>
  );
}
