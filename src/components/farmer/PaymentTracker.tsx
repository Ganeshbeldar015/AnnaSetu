import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Download, 
  AlertCircle, 
  Sparkles,
  Building2,
  ArrowRight
} from '../common/Icons';
import { formatCurrencyINR, formatWeightQuintals } from '../../utils/formatters';

export const PaymentTracker: React.FC = () => {
  const { 
    myActiveToken, 
    farmerProfile, 
    markPaymentCompleted 
  } = useApp();

  const [showEJFormModal, setShowEJFormModal] = useState(false);

  // If active token has QC and payment details, use them; otherwise use standard realistic defaults
  const qc = myActiveToken?.qcDetails || {
    moisturePercent: 13.8,
    foreignMatterPercent: 0.6,
    brokenGrainsPercent: 1.0,
    grade: 'Grade A (MSP Premium)' as const,
    baseMspRate: 2320,
    moistureDeductionRate: 0,
    netRatePerQuintal: 2320,
    actualQuantityQuintals: 52.5,
    grossAmount: 121800,
    deductionsAmount: 0,
    netPayableAmount: 121800,
    inspectorName: 'Anil Jadhav (Govt QC Officer)',
    counterNumber: 'Counter 2',
    weighmentSlipNo: 'WB-SHIV-0824',
    inspectedAt: 'Today, 10:35 AM'
  };

  const payment = myActiveToken?.paymentDetails || {
    paymentId: 'PAY-MH-99824',
    utrNumber: 'RBI-PFMS-2026889104',
    amount: qc.netPayableAmount,
    status: myActiveToken?.stage === 'payment_completed' ? 'DBT Credited' : 'PFMS Clearing',
    bankName: farmerProfile.bankName,
    accountMasked: farmerProfile.accountMasked,
    ifscCode: farmerProfile.ifscCode,
    initiatedAt: 'Today, 10:40 AM',
    creditedAt: myActiveToken?.stage === 'payment_completed' ? 'Today, 11:15 AM' : undefined,
    pfmsReference: 'PFMS/2026/DOCA/994182'
  };

  const isCompleted = myActiveToken?.stage === 'payment_completed' || payment.status === 'DBT Credited';

  const paymentSteps = [
    { title: '1. Moisture QC & Weighing Done', time: '10:35 AM', done: true, desc: 'Weighed 52.5 qtl at Counter 2 (Moisture 13.8%)' },
    { title: '2. Digital E-J Form Approved', time: '10:38 AM', done: true, desc: 'Official procurement certificate signed by Mandi Incharge' },
    { title: '3. PFMS Payment Mandate Initiated', time: '10:40 AM', done: true, desc: 'Bank mandate dispatched via Aadhaar Payment Bridge' },
    { title: '4. RBI Clearing Settlement', time: isCompleted ? '11:05 AM' : 'In Progress', done: isCompleted, desc: 'PFMS inter-bank batch reconciliation' },
    { title: '5. DBT Credited to Bank Account', time: isCompleted ? '11:15 AM' : 'Estimated < 2 hrs', done: isCompleted, desc: `Direct credit to ${farmerProfile.bankName} (A/C ${farmerProfile.accountMasked})` }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Benefit Transfer (DBT) Transparency Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Payment & Settlement Tracker
          </h2>
          <p className="text-xs text-slate-500">
            Real-time integration with Public Financial Management System (PFMS) and RBI Aadhaar Payment Bridge.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isCompleted ? (
            <button
              onClick={() => myActiveToken && markPaymentCompleted(myActiveToken.id)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Mark Payment Complete</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>DBT Payment Completed</span>
            </div>
          )}

          <button
            onClick={() => setShowEJFormModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>View Digital E-J Form</span>
          </button>
        </div>
      </div>

      {/* Direct Benefit Transfer Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-emerald-950">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          <strong>Direct Benefit Transfer (DBT):</strong> Payments are settled directly to the farmer's Aadhaar-linked bank account via Public Financial Management System (PFMS).
        </span>
      </div>

      {/* Main Payment Summary Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big Amount Card */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-700/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">TOTAL NET PAYABLE MSP</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                isCompleted ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'
              }`}>
                {isCompleted ? 'DBT CREDITED' : 'PFMS PROCESSING'}
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl font-black tracking-tight text-white">
                {formatCurrencyINR(qc.netPayableAmount)}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Zero middleman deductions • 100% Government MSP
              </p>
            </div>
          </div>

          {/* Bank Account Info */}
          <div className="bg-emerald-950/80 border border-emerald-700/50 p-3.5 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 text-[10px] uppercase font-semibold">Credited Bank</span>
              <span className="text-white font-bold">{farmerProfile.bankName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 text-[10px] uppercase font-semibold">Account Number</span>
              <span className="text-white font-mono font-bold">{farmerProfile.accountMasked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 text-[10px] uppercase font-semibold">IFSC Code</span>
              <span className="text-white font-mono">{farmerProfile.ifscCode}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Calculation Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-200">
              Procurement Weighment & Formula Calculation
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">ACTUAL QUANTITY</span>
                <span className="font-bold text-slate-900 text-sm">{formatWeightQuintals(qc.actualQuantityQuintals)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">BASE MSP RATE</span>
                <span className="font-bold text-slate-900 text-sm">₹{qc.baseMspRate}/qtl</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">MOISTURE CONTENT</span>
                <span className="font-bold text-emerald-700 text-sm">{qc.moisturePercent}% (Standard: ≤14%)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">GROSS AMOUNT</span>
                <span className="font-bold text-slate-900 text-sm">{formatCurrencyINR(qc.grossAmount)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">MOISTURE DEDUCTION</span>
                <span className="font-bold text-emerald-700 text-sm">₹{qc.deductionsAmount} (0.0%)</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 block text-[10px] font-bold">NET PAYABLE AMOUNT</span>
                <span className="font-extrabold text-emerald-900 text-sm">{formatCurrencyINR(qc.netPayableAmount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 flex flex-wrap items-center justify-between gap-2">
            <span>UTR: <strong className="text-slate-900">{payment.utrNumber}</strong></span>
            <span>PFMS REF: <strong className="text-slate-900">{payment.pfmsReference}</strong></span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Payment Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-200">
          Direct Benefit Transfer (DBT) Milestone Timeline
        </h3>

        <div className="space-y-4">
          {paymentSteps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                step.done 
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500' 
                  : 'bg-slate-100 text-slate-400 border border-slate-300'
              }`}>
                {step.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : idx + 1}
              </div>

              <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{step.title}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    step.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E-J Form Modal */}
      {showEJFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-slide-up">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Official Digital E-J Form (Procurement Certificate)</span>
              </div>
              <button onClick={() => setShowEJFormModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs bg-white">
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <h3 className="font-extrabold text-base text-slate-900 uppercase">Government of India • Ministry of Consumer Affairs</h3>
                <p className="text-xs text-slate-500">Department of Consumer Affairs (DoCA) • Digital APMC Procurement Slip</p>
                <div className="mt-2 inline-block bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded font-mono font-bold">
                  E-J FORM CERTIFICATE NO: DOCA/MH/2026/0924
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Farmer Name</span>
                  <span className="font-bold text-slate-900 text-sm">{farmerProfile.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Kisan Card / PM-KISAN ID</span>
                  <span className="font-mono font-bold text-slate-900">{farmerProfile.kisanCardId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Produce Weighed</span>
                  <span className="font-semibold text-slate-900">{myActiveToken?.cropName || 'Paddy (Grade A / PR-126)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Net Weight Procured</span>
                  <span className="font-bold text-slate-900">{qc.actualQuantityQuintals} Quintals</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Base MSP Rate</span>
                  <span className="font-bold text-slate-900">₹{qc.baseMspRate} / Quintal</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Moisture Content</span>
                  <span className="font-semibold text-slate-900">{qc.moisturePercent}% (Within FAQ Standards)</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block font-medium">Total Net Payable Amount</span>
                  <span className="text-xl font-extrabold text-emerald-800">{formatCurrencyINR(qc.netPayableAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-[11px] text-slate-500">
                  <p>Inspector: <strong>{qc.inspectorName}</strong></p>
                  <p>Procurement Hub: <strong>Shivapur APMC Center</strong></p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-10 border-2 border-dashed border-emerald-600 rounded flex items-center justify-center text-emerald-800 font-bold text-[10px]">
                    DIGITALLY STAMPED
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official E-J Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
