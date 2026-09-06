import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Users, 
  Building2, 
  CreditCard, 
  Sparkles, 
  FileSpreadsheet, 
  Radio, 
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { 
    centers, 
    bookings, 
    recommendations, 
    setActiveView 
  } = useApp();

  const activeRecsCount = recommendations.filter(r => r.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* DoCA Ministry Top Command Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>DoCA National Command & Operations Monitoring Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National MSP Procurement Executive Dashboard
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Centralized multi-state telemetry for real-time slot adherence, mandi queue congestion, electronic weighbridge accuracy, and direct DBT bank disbursements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => setActiveView('smart_automation')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Smart Automation ({activeRecsCount} Active)</span>
          </button>

          <button
            onClick={() => setActiveView('geospatial_map')}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Geospatial Network Map</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">REGISTERED FARMERS</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">18,420+</span>
          <span className="text-[11px] text-emerald-700 font-semibold">+12% this week</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">TODAY'S VOLUME</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">12,850 MT</span>
          <span className="text-[11px] text-slate-500">Across 6 States</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">ACTIVE APMC HUBS</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{centers.length} Centers</span>
          <span className="text-[11px] text-slate-500">100% Operational</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">DBT DISBURSED</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">₹48.2 Cr</span>
          <span className="text-[11px] text-emerald-700 font-semibold">PFMS Settled</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">AVG TURNAROUND</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">28 Mins</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Down from 18.5 hrs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">SLOT ADHERENCE</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">94.6%</span>
          <span className="text-[11px] text-slate-500">Zero Road Choke</span>
        </div>
      </div>

      {/* Quick Access Admin Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setActiveView('geospatial_map')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
              <span>Inspect Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Geospatial Procurement Map</h3>
          <p className="text-xs text-slate-500 mt-1">
            Visual cluster map of APMC mandi loads, waiting times, and truck queues nationwide.
          </p>
        </div>

        <div 
          onClick={() => setActiveView('analytics')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-700 flex items-center space-x-1">
              <span>View Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Advanced Analytics & Heatmaps</h3>
          <p className="text-xs text-slate-500 mt-1">
            Hourly capacity trends, crop volume distribution, and payment turnaround SLA charts.
          </p>
        </div>

        <div 
          onClick={() => setActiveView('reports')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-700 flex items-center space-x-1">
              <span>Export CSV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Official Audit & CSV Reports</h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate and download daily procurement ledgers, SLA audit logs, and PFMS summaries.
          </p>
        </div>
      </div>
    </div>
  );
};
