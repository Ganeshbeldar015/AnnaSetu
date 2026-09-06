import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Search, 
  Filter, 
  CheckCircle2, 
  Volume2, 
  Scale, 
  CreditCard, 
  Clock, 
  User, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { getStageMeta } from '../../utils/formatters';
import { announceTokenSpeech } from '../../utils/audio';

export const LiveQueueManager: React.FC = () => {
  const { 
    bookings, 
    checkInFarmerToken, 
    callTokenToCounter, 
    startQCAndWeighing, 
    setActiveView,
    advanceDemoQueueStep 
  } = useApp();

  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesStage = filterStage === 'all' || b.stage === filterStage;
    const matchesSearch = b.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.farmerVillage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleCallFarmer = (tokenId: string, tokenNum: string) => {
    callTokenToCounter(tokenId, 'Counter 2');
  };

  const handleStartQC = (tokenId: string) => {
    startQCAndWeighing(tokenId);
    setActiveView('weighment_terminal');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Mandi Gate & Weighbridge Dispatcher</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Live Queue Management Panel
          </h2>
          <p className="text-xs text-slate-500">
            Control vehicle flow, trigger gate check-ins, sound counter audio calls, and launch electronic weighbridge QC.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={advanceDemoQueueStep}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Advance Next Demo Token</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search token (e.g. A-024), farmer name, village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { key: 'all', label: 'All Tokens' },
            { key: 'booked', label: 'Booked' },
            { key: 'checked_in', label: 'Checked In' },
            { key: 'called', label: 'Called' },
            { key: 'weighing_qc', label: 'In QC' },
            { key: 'procurement_completed', label: 'Procured' },
            { key: 'payment_completed', label: 'Paid' }
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setFilterStage(st.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStage === st.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Token #</th>
                <th className="py-3.5 px-4">Farmer Details</th>
                <th className="py-3.5 px-4">Crop & Quantity</th>
                <th className="py-3.5 px-4">Slot Window</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4 text-right">Operator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No tokens found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((token) => {
                  const stage = getStageMeta(token.stage);
                  const isDemoFarmer = token.tokenNumber === 'A-024';

                  return (
                    <tr 
                      key={token.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isDemoFarmer ? 'bg-amber-50/40 font-medium' : ''
                      }`}
                    >
                      {/* Token # */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                            {token.tokenNumber}
                          </span>
                          {isDemoFarmer && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                              DEMO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Farmer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{token.farmerName}</div>
                        <div className="text-[11px] text-slate-500">
                          {token.farmerVillage}, {token.farmerDistrict} • Ph: {token.farmerPhone}
                        </div>
                      </td>

                      {/* Crop & Quantity */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{token.cropName}</div>
                        <div className="text-[11px] text-slate-500">
                          {token.actualQuantityQuintals ? (
                            <span className="text-emerald-700 font-bold">{token.actualQuantityQuintals} qtl (Weighed)</span>
                          ) : (
                            <span>{token.expectedQuantityQuintals} qtl (Expected)</span>
                          )}
                        </div>
                      </td>

                      {/* Slot Window */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{token.timeSlot}</div>
                        <div className="text-[10px] text-slate-400">{token.date}</div>
                      </td>

                      {/* Current Stage Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stage.bg} ${stage.color}`}>
                          {stage.label}
                        </span>
                        {token.counterAssigned && (
                          <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                            {token.counterAssigned}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {token.stage === 'booked' && (
                          <button
                            onClick={() => checkInFarmerToken(token.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
                          >
                            Check-In at Gate
                          </button>
                        )}

                        {token.stage === 'checked_in' && (
                          <button
                            onClick={() => handleCallFarmer(token.id, token.tokenNumber)}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center space-x-1 ml-auto"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Call to Counter 2</span>
                          </button>
                        )}

                        {token.stage === 'called' && (
                          <button
                            onClick={() => handleStartQC(token.id)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center space-x-1 ml-auto"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Start QC & Weigh</span>
                          </button>
                        )}

                        {token.stage === 'weighing_qc' && (
                          <button
                            onClick={() => setActiveView('weighment_terminal')}
                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center space-x-1 ml-auto"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Finish Weighing</span>
                          </button>
                        )}

                        {token.stage === 'procurement_completed' && (
                          <span className="text-emerald-700 font-bold text-xs flex items-center justify-end space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>E-J Form Issued</span>
                          </span>
                        )}

                        {token.stage === 'payment_processing' && (
                          <span className="text-teal-700 font-bold text-xs">
                            PFMS Clearing...
                          </span>
                        )}

                        {token.stage === 'payment_completed' && (
                          <span className="text-green-700 font-bold text-xs">
                            DBT Disbursed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
