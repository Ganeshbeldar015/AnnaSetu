import React, { useState } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  Truck, 
  Layers,
  ArrowRight
} from '../common/Icons';
import { useApp } from '../../context/AppContext';

export const ProblemSolutionCompare: React.FC = () => {
  const { setCurrentRole, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<'compare' | 'farmer_view' | 'mandi_view'>('compare');

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Mandi Transformation</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Traditional Mandi Chaos vs. e-Kisan Smart System
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Solving the operational root causes of long waiting times, unorganized schedules, and procurement uncertainty.
          </p>
        </div>

        {/* Interactive Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Traditional Process */}
          <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Traditional Reality
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Unscheduled Walk-In Congestion</h3>
                <p className="text-xs text-rose-800 font-medium">18–36 hours average wait on highway</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start space-x-3 bg-white/80 p-3.5 rounded-xl border border-rose-100">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Blind Travel & Road Choke:</strong>
                  <span>Farmers load tractors and travel without knowing if the procurement depot has storage or quota capacity left today.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/80 p-3.5 rounded-xl border border-rose-100">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Overnight Queue in Vehicles:</strong>
                  <span>Tractors idle overnight on highway shoulders causing fuel waste, sleep deprivation, and grain exposure to night moisture.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/80 p-3.5 rounded-xl border border-rose-100">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Opaque Quality & Moisture Cuts:</strong>
                  <span>Manual inspection leads to arbitrary deductions (cut of ₹100–₹300/qtl) by local weighers without standardized proof.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/80 p-3.5 rounded-xl border border-rose-100">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Manual Ledgers & Payment Delays:</strong>
                  <span>Paper receipts get lost; payment verification takes 15–30 days with multiple visits to bank and mandi office.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-800 font-semibold">
              <span>Mandi Throughput: ~250 trolleys/day</span>
              <span className="text-rose-600 font-bold">Severe Bottlenecks</span>
            </div>
          </div>

          {/* Right: e-Kisan Smart System */}
          <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              e-Kisan Smart System
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Intelligent Slot Scheduling</h3>
                <p className="text-xs text-emerald-800 font-medium">Guaranteed &lt; 30 mins turnaround</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start space-x-3 bg-white/90 p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Guaranteed 30-Min Time Slot:</strong>
                  <span>Farmer books a verified slot from home. Center capacity is strictly managed to prevent overbooking and traffic pileups.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/90 p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Live Token Tracker & Mandi PA:</strong>
                  <span>Farmer starts tractor only when their token is 5 positions away. In-mandi audio chimes guide directly to assigned counter.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/90 p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Formula-Driven Dynamic MSP Calculation:</strong>
                  <span>Govt moisture standard benchmark with automated digital formula. Zero tampering, printed digital inspection slip.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/90 p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Instant DBT Mandate to Bank Account:</strong>
                  <span>E-J Form immediately dispatches bank mandate to RBI PFMS Aadhaar Payment Bridge. Direct credit within 24–48 hours.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-semibold">Mandi Throughput: ~600+ trolleys/day</span>
              <button
                onClick={() => {
                  setCurrentRole('farmer');
                  setActiveView('book_slot');
                }}
                className="text-emerald-800 font-bold hover:text-emerald-950 flex items-center space-x-1"
              >
                <span>Try Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
