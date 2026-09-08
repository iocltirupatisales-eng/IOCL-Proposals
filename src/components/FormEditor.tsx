import React, { useState } from 'react';
import { ProposalData } from '../types';
import { FinancialCalculator } from './FinancialCalculator';
import { 
  FileText, 
  MapPin, 
  TrendingUp, 
  Building, 
  ShieldAlert, 
  CheckSquare, 
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FormEditorProps {
  data: ProposalData;
  onChange: (updated: Partial<ProposalData>) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange }) => {
  const [openSection, setOpenSection] = useState<string>('basic');

  const toggleSection = (s: string) => {
    setOpenSection(openSection === s ? '' : s);
  };

  const handleTextChange = (field: keyof ProposalData, val: string) => {
    onChange({ [field]: val });
  };

  return (
    <div className="space-y-3 text-xs">
      {/* SECTION A: Basic Info */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full p-3.5 flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-600" />
            <span>Section A: Basic Information & LOI / Selection</span>
          </div>
          {openSection === 'basic' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'basic' && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 font-medium block mb-1">Advertised Location Name</label>
                <input
                  type="text"
                  value={data.advtLocationName}
                  onChange={(e) => handleTextChange('advtLocationName', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Advt Location S.No.</label>
                <input
                  type="text"
                  value={data.advtLocationSNo}
                  onChange={(e) => handleTextChange('advtLocationSNo', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">District, State</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.district}
                    onChange={(e) => handleTextChange('district', e.target.value)}
                    placeholder="District"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={data.state}
                    onChange={(e) => handleTextChange('state', e.target.value)}
                    placeholder="State"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Divisional Office & RSA</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.divisionalOffice}
                    onChange={(e) => handleTextChange('divisionalOffice', e.target.value)}
                    placeholder="Divisional Office"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={data.retailSalesArea}
                    onChange={(e) => handleTextChange('retailSalesArea', e.target.value)}
                    placeholder="RSA"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Market Category & Road Type</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.category}
                    onChange={(e) => handleTextChange('category', e.target.value)}
                    placeholder="e.g. Open (Regular)"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={data.roadType}
                    onChange={(e) => handleTextChange('roadType', e.target.value)}
                    placeholder="e.g. NH-71"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Selected Applicant Name</label>
                <input
                  type="text"
                  value={data.applicantName}
                  onChange={(e) => handleTextChange('applicantName', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Selection Mode & Date</label>
                <input
                  type="text"
                  value={data.selectionMode}
                  onChange={(e) => handleTextChange('selectionMode', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">LOI Date & Ref</label>
                <input
                  type="text"
                  value={data.loiDate}
                  onChange={(e) => handleTextChange('loiDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION B: Sales & Feasibility */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        <button
          onClick={() => toggleSection('sales')}
          className="w-full p-3.5 flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Section B: Sales Projections & Trading Area</span>
          </div>
          {openSection === 'sales' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'sales' && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40">
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
                Current Feasibility Projections (MS & HSD in KLPM)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(data.salesFeasibilityCurrent || []).map((row, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">{row.year}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">MS:</span>
                        <input
                          type="text"
                          value={row.ms}
                          onChange={(e) => {
                            const updated = [...data.salesFeasibilityCurrent];
                            updated[idx].ms = e.target.value;
                            onChange({ salesFeasibilityCurrent: updated });
                          }}
                          className="w-16 px-1.5 py-0.5 text-right rounded border border-zinc-300 dark:border-zinc-700"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">HSD:</span>
                        <input
                          type="text"
                          value={row.hsd}
                          onChange={(e) => {
                            const updated = [...data.salesFeasibilityCurrent];
                            updated[idx].hsd = e.target.value;
                            onChange({ salesFeasibilityCurrent: updated });
                          }}
                          className="w-16 px-1.5 py-0.5 text-right rounded border border-zinc-300 dark:border-zinc-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                5. Reasons for Variation (Narrative Justifications)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-500 block mb-0.5">5.1 Subsequent Development</label>
                  <input
                    type="text"
                    value={data.reasonSubsequentDev}
                    onChange={(e) => handleTextChange('reasonSubsequentDev', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-0.5">5.2 New Project in Vicinity</label>
                  <input
                    type="text"
                    value={data.reasonNewProject}
                    onChange={(e) => handleTextChange('reasonNewProject', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-0.5">5.3 Natural Halting Point</label>
                  <input
                    type="text"
                    value={data.reasonHaltingPoint}
                    onChange={(e) => handleTextChange('reasonHaltingPoint', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-0.5">5.5 Road Related Development</label>
                  <input
                    type="text"
                    value={data.reasonRoadDev}
                    onChange={(e) => handleTextChange('reasonRoadDev', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: Land Details & Rent */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        <button
          onClick={() => toggleSection('land')}
          className="w-full p-3.5 flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Section C: Land Particulars, Valuation & Rent Negotiation</span>
          </div>
          {openSection === 'land' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'land' && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-zinc-500 font-medium block mb-1">Land Survey / Khata No.</label>
                <input
                  type="text"
                  value={data.surveyNo}
                  onChange={(e) => handleTextChange('surveyNo', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Plot Area (Sqm)</label>
                <input
                  type="text"
                  value={data.plotAreaSqm}
                  onChange={(e) => {
                    handleTextChange('plotAreaSqm', e.target.value);
                    handleTextChange('agreedAreaSqm', e.target.value);
                  }}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Dimensions (Frontage x Depth)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.plotFrontage}
                    onChange={(e) => handleTextChange('plotFrontage', e.target.value)}
                    placeholder="Frontage"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    value={data.plotDepth}
                    onChange={(e) => handleTextChange('plotDepth', e.target.value)}
                    placeholder="Depth"
                    className="w-1/2 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Landowner Name</label>
                <input
                  type="text"
                  value={data.landownerName}
                  onChange={(e) => handleTextChange('landownerName', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Relationship with Applicant</label>
                <input
                  type="text"
                  value={data.relationshipWithApplicant}
                  onChange={(e) => handleTextChange('relationshipWithApplicant', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">Ownership Document Reference</label>
                <input
                  type="text"
                  value={data.landDocType}
                  onChange={(e) => handleTextChange('landDocType', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Valuation Inputs */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">Valuer 1 Details</span>
                <input
                  type="text"
                  value={data.valuer1Name}
                  onChange={(e) => handleTextChange('valuer1Name', e.target.value)}
                  placeholder="Valuer Name"
                  className="w-full px-2 py-1 mb-1.5 rounded border border-zinc-300 dark:border-zinc-700 text-[11px]"
                />
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Monthly Rent Rec.:</span>
                  <input
                    type="text"
                    value={data.valuer1MonthlyRent}
                    onChange={(e) => handleTextChange('valuer1MonthlyRent', e.target.value)}
                    placeholder="e.g. 55000"
                    className="w-24 px-1.5 py-0.5 text-right rounded border border-zinc-300 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">Valuer 2 Details</span>
                <input
                  type="text"
                  value={data.valuer2Name}
                  onChange={(e) => handleTextChange('valuer2Name', e.target.value)}
                  placeholder="Valuer Name"
                  className="w-full px-2 py-1 mb-1.5 rounded border border-zinc-300 dark:border-zinc-700 text-[11px]"
                />
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Monthly Rent Rec.:</span>
                  <input
                    type="text"
                    value={data.valuer2MonthlyRent}
                    onChange={(e) => handleTextChange('valuer2MonthlyRent', e.target.value)}
                    placeholder="e.g. 58000"
                    className="w-24 px-1.5 py-0.5 text-right rounded border border-zinc-300 dark:border-zinc-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION H: Financial Break-up & Calculator */}
      <FinancialCalculator data={data} onChange={onChange} />

      {/* SECTION F & G: Clearances & Statutory */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        <button
          onClick={() => toggleSection('statutory')}
          className="w-full p-3.5 flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Section F & G: Statutory Approvals & Rationale</span>
          </div>
          {openSection === 'statutory' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'statutory' && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 font-medium block mb-1">1.1 DM / DC NOC Status</label>
                <input
                  type="text"
                  value={data.dmDcNocStatus}
                  onChange={(e) => handleTextChange('dmDcNocStatus', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">1.7 PESO Approval Ref & Date</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.pesoApprovalRef}
                    onChange={(e) => handleTextChange('pesoApprovalRef', e.target.value)}
                    placeholder="PESO Ref No."
                    className="w-2/3 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    value={data.pesoApprovalDate}
                    onChange={(e) => handleTextChange('pesoApprovalDate', e.target.value)}
                    placeholder="Date"
                    className="w-1/3 px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">1.2 NHAI NOC Status</label>
                <input
                  type="text"
                  value={data.nhaiNocStatus}
                  onChange={(e) => handleTextChange('nhaiNocStatus', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="text-zinc-500 font-medium block mb-1">1.3 Land NA / CLU Status</label>
                <input
                  type="text"
                  value={data.landNaCluStatus}
                  onChange={(e) => handleTextChange('landNaCluStatus', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
