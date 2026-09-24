import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Scale, 
  Sparkles, 
  Radio, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RotateCcw
} from '../common/Icons';
import { formatCurrencyINR } from '../../utils/formatters';

export const OperatorDashboard: React.FC = () => {
  const { 
    centers, 
    bookings, 
    setActiveView, 
    callTokenToCounter, 
    advanceDemoQueueStep 
  } = useApp();

  const currentCenter = centers[0]; // Shivapur APMC Hub

  const checkedInCount = bookings.filter(b => b.stage === 'checked_in' || b.stage === 'in_queue').length;
  const inProgressCount = bookings.filter(b => b.stage === 'weighing_qc' || b.stage === 'called').length;
  const completedCount = bookings.filter(b => b.stage === 'procurement_completed' || b.stage === 'payment_processing' || b.stage === 'payment_completed').length;
  const pendingPaymentCount = bookings.filter(b => b.stage === 'payment_processing').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Operator Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-700/80 border border-blue-500/40 text-blue-200">
              Procurement Operator Station
            </span>
            <span className="text-xs text-slate-300 font-mono">HUB ID: {currentCenter.code}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {currentCenter.name}
          </h1>
          <p className="text-xs text-slate-300 flex items-center space-x-2">
            <span>Incharge: {currentCenter.contactPerson}</span>
            <span>• {currentCenter.activeCounters} of {currentCenter.totalCounters} Weighbridges Active</span>
            <span>• Load: <strong className="text-amber-400 uppercase">{currentCenter.loadStatus}</strong></span>
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveView('live_queue')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Open Live Queue Panel</span>
          </button>

          <button
            onClick={() => setActiveView('weighment_terminal')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <Scale className="w-4 h-4" />
            <span>Weighment & QC Terminal</span>
          </button>
        </div>
      </div>

      {/* Operator Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">TODAY'S BOOKINGS</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{bookings.length + 24}</span>
          <span className="text-[11px] text-slate-500">Scheduled Slots</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">CHECKED-IN / WAITING</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{checkedInCount}</span>
          <span className="text-[11px] text-slate-500">In Waiting Bay</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">WEIGHING IN PROGRESS</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{inProgressCount}</span>
          <span className="text-[11px] text-slate-500">At Counters 1–3</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">COMPLETED E-J FORMS</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{completedCount}</span>
          <span className="text-[11px] text-slate-500">Procured & Stamped</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">PENDING DBT</span>
          <span className="text-2xl font-black text-teal-700 mt-1 block">{pendingPaymentCount}</span>
          <span className="text-[11px] text-slate-500">PFMS Clearing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">AVG TURNAROUND</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">~28m</span>
          <span className="text-[11px] text-slate-500">Target: &lt; 35 mins</span>
        </div>
      </div>

      {/* Multi-Counter Live Status Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Active Electronic Weighbridges & QC Terminals</h3>
            <p className="text-xs text-slate-500">Live dispatcher view of weighment counters at Shivapur Hub.</p>
          </div>
          <button
            onClick={() => setActiveView('capacity_control')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            Manage Counters & Capacities →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Counter 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Counter 1 (Common Paddy)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px]">CURRENT TOKEN</span>
              <span className="font-bold text-emerald-800 text-base">A-021</span>
              <p className="text-slate-600 text-[11px] truncate">Kailash Nath Mishra (48.0 qtl)</p>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">Status: Moisture Testing (13.9%)</span>
          </div>

          {/* Counter 2 */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Counter 2 (Grade A Paddy)</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px]">CURRENT TOKEN</span>
              <span className="font-bold text-amber-800 text-base">A-022</span>
              <p className="text-slate-600 text-[11px] truncate">Gajanan Rao Kadam (55.0 qtl)</p>
            </div>
            <span className="text-[10px] text-amber-800 font-bold block">Next in Line: Token A-024 (Rameshwar)</span>
          </div>

          {/* Counter 3 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Counter 3 (Soybean / Pulses)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px]">CURRENT TOKEN</span>
              <span className="font-bold text-blue-800 text-base">A-023</span>
              <p className="text-slate-600 text-[11px] truncate">Vikas Jagannath Raut (30.0 qtl)</p>
            </div>
            <span className="text-[10px] text-blue-700 font-bold block">Status: Weighbridge Tare Calibration</span>
          </div>

          {/* Counter 4 (Standby) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 space-y-3 opacity-80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Counter 4 (Reserve Shed)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">STANDBY</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Auto-activates when peak queue exceeds 20 vehicles to balance arrival load.
            </p>
            <button
              onClick={() => setActiveView('capacity_control')}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold"
            >
              Activate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
