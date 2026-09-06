import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scale, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Printer, 
  ShieldCheck, 
  Calculator,
  Building2,
  User
} from 'lucide-react';
import { calculateMSPProcurement } from '../../utils/calculations';
import { formatCurrencyINR, formatWeightQuintals } from '../../utils/formatters';
import { QCInspection } from '../../types';

export const ProcurementQCTerminal: React.FC = () => {
  const { 
    bookings, 
    crops, 
    completeProcurementProcess, 
    setActiveView,
    myActiveToken 
  } = useApp();

  const [selectedTokenId, setSelectedTokenId] = useState<string>(myActiveToken?.id || 'BK-2026-0824');
  const [actualQuintals, setActualQuintals] = useState<string>('52.5');
  const [moisturePercent, setMoisturePercent] = useState<string>('13.8');
  const [foreignMatterPercent, setForeignMatterPercent] = useState<string>('0.6');
  const [brokenGrainsPercent, setBrokenGrainsPercent] = useState<string>('1.0');
  const [grade, setGrade] = useState<'Grade A (MSP Premium)' | 'FAQ (Standard MSP)' | 'Below FAQ'>('Grade A (MSP Premium)');
  const [counterNumber, setCounterNumber] = useState<string>('Counter 2');
  const [inspectorName, setInspectorName] = useState<string>('Anil Jadhav (Govt QC Officer)');
  const [remarks, setRemarks] = useState<string>('Clean dry lot. Moisture tested via calibrated electronic hygrometer. Grade A compliant.');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const selectedBooking = bookings.find(b => b.id === selectedTokenId) || myActiveToken || bookings[0];
  const crop = crops.find(c => c.id === selectedBooking.cropId) || crops[0];

  // Dynamic MSP calculation result
  const calcResult = calculateMSPProcurement({
    baseMspRate: crop.mspRatePerQuintal,
    quantityQuintals: parseFloat(actualQuintals) || 0,
    moisturePercent: parseFloat(moisturePercent) || 14.0,
    foreignMatterPercent: parseFloat(foreignMatterPercent) || 0,
    standardMoisture: crop.standardMoisturePercent,
    grade
  });

  const handleCompleteProcurement = (e: React.FormEvent) => {
    e.preventDefault();
    const qcData: QCInspection = {
      moisturePercent: parseFloat(moisturePercent) || 13.8,
      foreignMatterPercent: parseFloat(foreignMatterPercent) || 0.6,
      brokenGrainsPercent: parseFloat(brokenGrainsPercent) || 1.0,
      grade,
      baseMspRate: crop.mspRatePerQuintal,
      moistureDeductionRate: calcResult.moistureDeductionPerQtl,
      netRatePerQuintal: calcResult.netRatePerQuintal,
      actualQuantityQuintals: parseFloat(actualQuintals) || 52.5,
      grossAmount: calcResult.grossPayableAmount,
      deductionsAmount: calcResult.totalDeductions,
      netPayableAmount: calcResult.netPayableAmount,
      inspectorName,
      counterNumber,
      weighmentSlipNo: `WB-SHIV-${Math.floor(1000 + Math.random() * 9000)}`,
      inspectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    completeProcurementProcess(selectedBooking.id, qcData);
    setIsCompleted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Digital Moisture Testing & IoT Electronic Weighbridge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Procurement Weighment & QC Terminal
          </h2>
          <p className="text-xs text-slate-500">
            Standardized government quality grading with automated formula-based MSP calculation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('live_queue')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            ← Back to Live Queue
          </button>
        </div>
      </div>

      {isCompleted ? (
        /* Completed Procurement State */
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-6 shadow-xl animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Procurement Successfully Finalized
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-2">
              Official Digital E-J Form Issued
            </h3>
            <p className="text-xs text-slate-500">
              Farmer: <strong>{selectedBooking.farmerName}</strong> (Token: {selectedBooking.tokenNumber})
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Weighed Quantity:</span>
              <span className="font-bold text-slate-900">{actualQuintals} Quintals</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Effective MSP Rate:</span>
              <span className="font-bold text-slate-900">₹{calcResult.netRatePerQuintal} / qtl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Moisture Content:</span>
              <span className="font-bold text-emerald-700">{moisturePercent}% (Standard ≤14%)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="font-bold text-slate-900">Net Payable Amount:</span>
              <span className="font-extrabold text-emerald-800">{formatCurrencyINR(calcResult.netPayableAmount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setActiveView('live_queue')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow"
            >
              Return to Live Queue
            </button>

            <button
              onClick={() => {
                setActiveView('dashboard');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow"
            >
              View Farmer View & DBT Mandate
            </button>
          </div>
        </div>
      ) : (
        /* Weighment & QC Entry Form */
        <form onSubmit={handleCompleteProcurement} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Parameters */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Farmer Weighbridge & QC Parameters</span>
                </h3>

                {/* Farmer / Token Switcher */}
                <select
                  value={selectedTokenId}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                  className="px-3 py-1 text-xs border border-slate-300 rounded-lg font-bold text-slate-900 bg-slate-50"
                >
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>
                      Token {b.tokenNumber} - {b.farmerName} ({b.cropName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Farmer Info Strip */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">FARMER</span>
                  <span className="font-bold text-slate-900">{selectedBooking.farmerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VILLAGE / DIST</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.farmerVillage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CROP</span>
                  <span className="font-semibold text-slate-900">{crop.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EXPECTED</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.expectedQuantityQuintals} qtl</span>
                </div>
              </div>

              {/* Dynamic Input Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Actual Weighed Quantity (Quintals) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={actualQuintals}
                    onChange={(e) => setActualQuintals(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. 52.5"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Weight recorded by electronic weighbridge sensor.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Moisture Content (%) * (Benchmark: ≤{crop.standardMoisturePercent}%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. 13.8"
                  />
                  <span className={`text-[11px] mt-1 block font-medium ${
                    parseFloat(moisturePercent) <= crop.standardMoisturePercent
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}>
                    {parseFloat(moisturePercent) <= crop.standardMoisturePercent
                      ? '✓ Moisture within official standard. 0% deduction.'
                      : '⚠️ Excess moisture detected. Dynamic standard deduction applied.'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Foreign Matter / Admixture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foreignMatterPercent}
                    onChange={(e) => setForeignMatterPercent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    placeholder="e.g. 0.6"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Crop Quality Grade Classification
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-semibold"
                  >
                    <option value="Grade A (MSP Premium)">Grade A (MSP Full Premium)</option>
                    <option value="FAQ (Standard MSP)">FAQ (Fair Average Quality)</option>
                    <option value="Below FAQ">Below FAQ (Substandard Deductions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Weighment Counter</label>
                  <input
                    type="text"
                    value={counterNumber}
                    onChange={(e) => setCounterNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Government QC Officer Name</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">QC Remarks & Inspection Log</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Calculation Summary Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                    <Calculator className="w-4 h-4" />
                    <span>Real-Time MSP Calculation</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">AUTOMATED</span>
                </div>

                {/* Math Breakdown */}
                <div className="space-y-3 mt-4 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Government MSP:</span>
                    <span className="text-white font-bold">₹{calcResult.baseMspRate}/qtl</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Actual Weight:</span>
                    <span className="text-white font-bold">{actualQuintals} Quintals</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Moisture Deduction:</span>
                    <span className={calcResult.moistureDeductionPerQtl > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      -₹{calcResult.moistureDeductionPerQtl.toFixed(2)}/qtl
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Net Rate / Quintal:</span>
                    <span className="text-emerald-400 font-bold">₹{calcResult.netRatePerQuintal.toFixed(2)}/qtl</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      TOTAL NET PAYABLE AMOUNT (DBT)
                    </span>
                    <div className="text-3xl font-black text-emerald-400">
                      {formatCurrencyINR(calcResult.netPayableAmount)}
                    </div>
                  </div>
                </div>

                {/* Calculation Rationale */}
                <div className="mt-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300">
                  {calcResult.breakdownSummary}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Issue Digital E-J Form & Complete</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
