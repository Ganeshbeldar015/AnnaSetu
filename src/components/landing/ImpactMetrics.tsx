import React from 'react';
import { 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowDownRight, 
  CheckCircle2,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ImpactMetrics: React.FC = () => {
  const { setCurrentRole, setActiveView } = useApp();

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Field Validation & Operational Impact</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Measurable Impact on Mandi Operations
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Real-time indicators simulated across 6 regional APMC hubs in Maharashtra, Punjab, Haryana, MP, and UP.
          </p>
        </div>

        {/* National Performance Strip */}
        <div className="max-w-3xl mx-auto mb-8 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <strong>National Procurement Indicators:</strong> Key performance benchmarks recorded across digitized APMC hubs in Maharashtra, Punjab, Haryana, MP, and UP.
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Metric 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                <ArrowDownRight className="w-3 h-3" />
                <span>88% Cut</span>
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">28 Mins</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Average Turnaround Time</p>
            <p className="text-[11px] text-slate-500 mt-2">
              Reduced from 18.5 hours of manual queuing to under 30 minutes.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                94.6% Rate
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">12,480+</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Digital Slots Booked</p>
            <p className="text-[11px] text-slate-500 mt-2">
              High adherence to allocated time slots with zero gate congestion.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Direct
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">₹48.2 Cr</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Transparent DBT Disbursed</p>
            <p className="text-[11px] text-slate-500 mt-2">
              Credited directly to farmer bank accounts without middleman cuts.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Load Balancer
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">2.4x</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Mandi Daily Throughput</p>
            <p className="text-[11px] text-slate-500 mt-2">
              APMC centers process more than double the volume with existing sheds.
            </p>
          </div>
        </div>

        {/* CTA to view full admin analytics */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">Want to inspect real-time government analytics and live heatmap?</h3>
            <p className="text-xs text-slate-300">Explore DoCA central command charts, queue load distributions, and exportable reports.</p>
          </div>
          <button
            onClick={() => {
              setCurrentRole('admin');
              setActiveView('analytics');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shrink-0 shadow-lg"
          >
            Open Admin Command Analytics
          </button>
        </div>
      </div>
    </section>
  );
};
