import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Search, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Phone
} from 'lucide-react';

export const CenterLocatorPreview: React.FC = () => {
  const { centers, setCurrentRole, setActiveView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  const filteredCenters = centers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || c.state.toLowerCase() === selectedState.toLowerCase();
    return matchesSearch && matchesState;
  });

  const getLoadBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Available (Low Load)</span>;
      case 'busy':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Moderate Queue</span>;
      case 'high_load':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">High Traffic</span>;
      case 'full':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Full Capacity</span>;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Network Transparency</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Procurement Center Status
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Check real-time queue lengths, active weighment counters, and available booking slots before leaving your farm.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search center, mandi, district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 w-56"
              />
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All States (All Hubs)</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="haryana">Haryana</option>
              <option value="punjab">Punjab</option>
              <option value="madhya pradesh">Madhya Pradesh</option>
              <option value="uttar pradesh">Uttar Pradesh</option>
            </select>
          </div>
        </div>

        {/* Center Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{center.code}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{center.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{center.district}, {center.state}</span>
                    </p>
                  </div>
                  {getLoadBadge(center.loadStatus)}
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CURRENT QUEUE</span>
                    <span className="font-bold text-slate-900">{center.currentQueueCount} Vehicles</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ACTIVE COUNTERS</span>
                    <span className="font-bold text-emerald-700">{center.activeCounters} of {center.totalCounters} Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">AVG WAIT TIME</span>
                    <span className="font-bold text-slate-900">~{center.avgWaitTimeMinutes} mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DAILY CAPACITY</span>
                    <span className="font-bold text-slate-900">{center.dailyProcuredQuintals} / {center.dailyCapacityQuintals} qtl</span>
                  </div>
                </div>

                <div className="text-xs bg-emerald-50/70 text-emerald-900 p-2.5 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Next Slot: <strong>{center.nextAvailableSlot}</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Distance: ~{center.distanceKm} km</span>
                <button
                  onClick={() => {
                    setCurrentRole('farmer');
                    setActiveView('book_slot');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                >
                  <span>Book Here</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
