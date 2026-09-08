import React from 'react';
import { ProposalData } from '../types';
import { calculateLeaseSchedule } from '../sampleData';
import { Calculator, Percent, IndianRupee, ShieldCheck, RefreshCw } from 'lucide-react';

interface FinancialCalculatorProps {
  data?: ProposalData;
  onChange?: (updated: Partial<ProposalData>) => void;
  currentMonthlyRent?: string;
  currentEscalation?: string;
  schedules?: any[];
  onScheduleUpdate?: (schedules: any[], grossRent: number) => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  data,
  onChange,
  currentMonthlyRent,
  currentEscalation,
  schedules,
  onScheduleUpdate,
}) => {
  const safeData = data || ({} as Partial<ProposalData>);
  const rentVal = currentMonthlyRent || safeData.agreedRentMonthly || '50000';
  const escVal = currentEscalation || safeData.escalationPercent || '10';
  const currentRentNum = parseFloat(String(rentVal).replace(/[^0-9.]/g, '')) || 50000;
  const currentEscPercent = parseFloat(String(escVal).replace(/[^0-9.]/g, '')) || 10;
  const areaNum = parseFloat(String(safeData.agreedAreaSqm || '').replace(/[^0-9.]/g, '')) || 2025;

  const handleRentChange = (newRent: number, newEsc: number) => {
    const computedSchedules = calculateLeaseSchedule(newRent, newEsc, 5, 30, 18);
    const grossRental = computedSchedules.reduce((a, b) => a + b.totalPeriodRent, 0);
    const rentPerSqm = areaNum > 0 ? (newRent / areaNum).toFixed(2) : '0';

    if (onChange) {
      onChange({
        agreedRentMonthly: newRent.toString(),
        escalationPercent: newEsc.toString(),
        agreedRentPerSqm: rentPerSqm,
        leaseSchedules: computedSchedules,
        grossRentalOutgo: grossRental.toLocaleString('en-IN'),
      });
    }

    if (onScheduleUpdate) {
      onScheduleUpdate(computedSchedules, grossRental);
    }
  };

  const handleCostChange = (field: 'materialCostLacs' | 'constructionCostLacs' | 'contingencyCostLacs' | 'statutoryCostLacs', val: string) => {
    const updatedValues = {
      materialCostLacs: field === 'materialCostLacs' ? val : (safeData.materialCostLacs || '18.50'),
      constructionCostLacs: field === 'constructionCostLacs' ? val : (safeData.constructionCostLacs || '14.20'),
      contingencyCostLacs: field === 'contingencyCostLacs' ? val : (safeData.contingencyCostLacs || '1.80'),
      statutoryCostLacs: field === 'statutoryCostLacs' ? val : (safeData.statutoryCostLacs || '2.00'),
    };

    const mat = parseFloat(updatedValues.materialCostLacs) || 0;
    const con = parseFloat(updatedValues.constructionCostLacs) || 0;
    const ctg = parseFloat(updatedValues.contingencyCostLacs) || 0;
    const sta = parseFloat(updatedValues.statutoryCostLacs) || 0;
    const totalBe = (mat + con + ctg + sta).toFixed(2);

    if (onChange) {
      onChange({
        ...updatedValues,
        totalBeLacs: totalBe,
      });
    }
  };

  const handleMirrChange = (mirr: string) => {
    const mirrVal = parseFloat(mirr) || 0;
    const sensitivity = (mirrVal * 0.85).toFixed(2);
    const met = mirrVal >= 12.0 ? 'Yes' : 'No';

    if (onChange) {
      onChange({
        calculatedMirrPercent: mirr,
        sensitivityMirrPercent: sensitivity,
        mirrBenchmarkMet: met,
      });
    }
  };

  const leaseRows = schedules || safeData.leaseSchedules || [];
  const grandTotalRent = leaseRows.reduce((acc, row) => acc + (row.totalPeriodRent || 0), 0);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-red-600" />
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            Financial Implication & Auto-Calculators (Section H)
          </h4>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">
          Auto-updates all 6 periods & conclusion DOA
        </span>
      </div>

      {/* Inputs for Lease Rental */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div>
          <label className="text-zinc-600 dark:text-zinc-400 font-medium block mb-1">
            Agreed Base Rent (Rs/month)
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-zinc-400 font-bold">Rs.</span>
            <input
              type="number"
              value={currentRentNum}
              onChange={(e) => handleRentChange(parseFloat(e.target.value) || 0, currentEscPercent)}
              className="w-full pl-9 pr-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="text-zinc-600 dark:text-zinc-400 font-medium block mb-1">
            Escalation Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={currentEscPercent}
              onChange={(e) => handleRentChange(currentRentNum, parseFloat(e.target.value) || 0)}
              className="w-full pl-2.5 pr-8 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold focus:ring-1 focus:ring-red-500"
            />
            <span className="absolute right-2.5 top-2 text-zinc-400 font-bold">%</span>
          </div>
        </div>

        <div>
          <label className="text-zinc-600 dark:text-zinc-400 font-medium block mb-1">
            Escalation Frequency
          </label>
          <input
            type="text"
            value={safeData.escalationFrequency || 'Every 5 Years'}
            onChange={(e) => onChange && onChange({ escalationFrequency: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500"
            placeholder="e.g. Every 5 Years"
          />
        </div>
      </div>

      {/* Calculated Lease Escalation Matrix */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Computed 30-Year Rental Outgo Schedule (Incl. GST 18%):
          </span>
          <span className="font-bold text-red-700 dark:text-red-400">
            Grand Total: Rs. {grandTotalRent.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border border-zinc-300 dark:border-zinc-700 text-right">
            <thead className="bg-zinc-100 dark:bg-zinc-800 text-center font-bold">
              <tr>
                <th className="border border-zinc-300 dark:border-zinc-700 p-1.5 text-left">Period</th>
                <th className="border border-zinc-300 dark:border-zinc-700 p-1.5">Rent/Mo (Rs)</th>
                <th className="border border-zinc-300 dark:border-zinc-700 p-1.5">GST @18%</th>
                <th className="border border-zinc-300 dark:border-zinc-700 p-1.5">Total/Mo</th>
                <th className="border border-zinc-300 dark:border-zinc-700 p-1.5">Months</th>
                <th className="border border-zinc-300 dark:border-zinc-700 p-1.5">Period Total (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {leaseRows.map((r, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="border border-zinc-300 dark:border-zinc-700 p-1 text-left font-medium">{r.periodLabel}</td>
                  <td className="border border-zinc-300 dark:border-zinc-700 p-1">{r.rentPerMonth?.toLocaleString('en-IN')}</td>
                  <td className="border border-zinc-300 dark:border-zinc-700 p-1">{r.gstAmount?.toLocaleString('en-IN')}</td>
                  <td className="border border-zinc-300 dark:border-zinc-700 p-1 font-semibold">{r.rentInclGst?.toLocaleString('en-IN')}</td>
                  <td className="border border-zinc-300 dark:border-zinc-700 p-1 text-center">{r.months}</td>
                  <td className="border border-zinc-300 dark:border-zinc-700 p-1 font-bold text-zinc-900 dark:text-zinc-100">
                    {r.totalPeriodRent?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capital Outlay (BE) Breakdown */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Capital Outlay (BE) Components (Rs. in Lacs):
          </span>
          <span className="font-bold text-red-700 dark:text-red-400 text-sm">
            Total BE: Rs. {safeData.totalBeLacs || '36.50'} Lacs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-0.5">3.1 Material Cost</label>
            <input
              type="text"
              value={safeData.materialCostLacs || '18.50'}
              onChange={(e) => handleCostChange('materialCostLacs', e.target.value)}
              className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-0.5">3.2 Construction Civil</label>
            <input
              type="text"
              value={safeData.constructionCostLacs || '14.20'}
              onChange={(e) => handleCostChange('constructionCostLacs', e.target.value)}
              className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-0.5">3.3 Contingency/Consult</label>
            <input
              type="text"
              value={safeData.contingencyCostLacs || '1.80'}
              onChange={(e) => handleCostChange('contingencyCostLacs', e.target.value)}
              className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-0.5">3.4 Statutory Cost</label>
            <input
              type="text"
              value={safeData.statutoryCostLacs || '2.00'}
              onChange={(e) => handleCostChange('statutoryCostLacs', e.target.value)}
              className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* MIRR & Benchmark */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] text-zinc-500 block mb-0.5">4.2 Calculated MIRR (%)</label>
          <input
            type="text"
            value={safeData.calculatedMirrPercent || '14.2'}
            onChange={(e) => handleMirrChange(e.target.value)}
            className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold text-emerald-600"
          />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 block mb-0.5">4.3 MIRR @ (-)10% Sensitivity</label>
          <input
            type="text"
            value={safeData.sensitivityMirrPercent || '12.1'}
            onChange={(e) => onChange && onChange({ sensitivityMirrPercent: e.target.value })}
            className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 block mb-0.5">4.4 Benchmark Met (&gt;12%)</label>
          <select
            value={safeData.mirrBenchmarkMet || 'Yes'}
            onChange={(e) => onChange && onChange({ mirrBenchmarkMet: e.target.value })}
            className="w-full px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold"
          >
            <option value="Yes">Yes (Meets Hurdle Rate)</option>
            <option value="No">No (Below 12%)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
