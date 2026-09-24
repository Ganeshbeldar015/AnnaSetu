import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Building2, 
  Clock, 
  Scale, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Filter,
  Phone,
  ArrowRight,
  ShieldCheck
} from '../common/Icons';
import { ProcurementCenter } from '../../types';

export const GeospatialCenterMap: React.FC = () => {
  const { centers, recommendations, applyRecommendation } = useApp();
  const [selectedCenter, setSelectedCenter] = useState<ProcurementCenter>(centers[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCenters = centers.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.loadStatus === statusFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-500 ring-emerald-300';
      case 'busy':
        return 'bg-blue-500 ring-blue-300';
      case 'high_load':
        return 'bg-amber-500 ring-amber-300';
      case 'full':
        return 'bg-rose-500 ring-rose-300';
      default:
        return 'bg-slate-500 ring-slate-300';
    }
  };

  const getLoadBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">LOW LOAD</span>;
      case 'busy':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">MODERATE</span>;
      case 'high_load':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">HIGH LOAD</span>;
      case 'full':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">CRITICAL FULL</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>National Geospatial Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Procurement Hub Network Map & Real-Time Telemetry
          </h2>
          <p className="text-xs text-slate-500">
            Live geographic monitoring of APMC mandi queue density, active weighbridges, and storage capacity across India.
          </p>
        </div>
      </div>

      {/* Main Interactive Map & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas Representation */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Map Top Filter Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-300">Status Filter:</span>
              <div className="flex items-center space-x-1 text-[11px]">
                {['all', 'normal', 'busy', 'high_load', 'full'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded-lg font-medium transition ${
                      statusFilter === st
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              6 REGIONAL HUBS TRACKED
            </div>
          </div>

          {/* Interactive Geographic Hub Nodes Grid */}
          <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredCenters.map((center) => {
              const isSelected = selectedCenter.id === center.id;
              const colorClass = getMarkerColor(center.loadStatus);

              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/95 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg scale-105'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{center.code}</span>
                      <span className={`w-3 h-3 rounded-full ring-4 ${colorClass}`}></span>
                    </div>

                    <h4 className="text-white font-bold text-xs truncate">{center.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{center.district}, {center.state}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Queue: <strong className="text-white">{center.currentQueueCount}</strong></span>
                    <span className="text-amber-400 font-medium">~{center.avgWaitTimeMinutes}m</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Legend & Disclaimer */}
          <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px]">Normal (&lt; 20m)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-[11px]">Busy (20-35m)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-[11px]">High Load (&gt; 35m)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-[11px]">Full Capacity</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-400 font-medium">
              Live National Mandi Network Telemetry
            </span>
          </div>
        </div>

        {/* Right: Selected Center Live Inspection Drawer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{selectedCenter.code}</span>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedCenter.name}</h3>
                <p className="text-xs text-slate-500">{selectedCenter.address}</p>
              </div>
              {getLoadBadge(selectedCenter.loadStatus)}
            </div>

            {/* Live Center Telemetry Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">CURRENT QUEUE</span>
                <span className="font-extrabold text-slate-900 text-base">{selectedCenter.currentQueueCount} Vehicles</span>
                <span className="text-[10px] text-slate-500 block">Inward Gate 2 Bay</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">AVG WAIT TIME</span>
                <span className="font-extrabold text-amber-700 text-base">~{selectedCenter.avgWaitTimeMinutes} Mins</span>
                <span className="text-[10px] text-slate-500 block">AI Estimated</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">WEIGHBRIDGES</span>
                <span className="font-extrabold text-emerald-700 text-base">{selectedCenter.activeCounters} of {selectedCenter.totalCounters} Active</span>
                <span className="text-[10px] text-slate-500 block">Calibrated Scales</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">DAILY CAPACITY</span>
                <span className="font-extrabold text-slate-900 text-base">{selectedCenter.dailyProcuredQuintals} / {selectedCenter.dailyCapacityQuintals} qtl</span>
                <span className="text-[10px] text-slate-500 block">
                  {Math.round((selectedCenter.dailyProcuredQuintals / selectedCenter.dailyCapacityQuintals) * 100)}% Utilized
                </span>
              </div>
            </div>

            {/* Contact Person & Officers */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mandi Secretary / Incharge:</span>
                <strong className="text-slate-900">{selectedCenter.contactPerson}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Official Helpline:</span>
                <span className="font-mono text-emerald-800 font-bold">{selectedCenter.contactPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Next Available Slot:</span>
                <strong className="text-slate-900">{selectedCenter.nextAvailableSlot}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => applyRecommendation('rec-01')}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Apply Load Balancer Recommendation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
