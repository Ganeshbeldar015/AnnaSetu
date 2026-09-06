import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  CloudRain, 
  Send,
  Radio
} from 'lucide-react';

export const CenterCapacityControl: React.FC = () => {
  const { 
    centers, 
    addNotification, 
    applyRecommendation, 
    recommendations 
  } = useApp();

  const [counter4Active, setCounter4Active] = useState(false);
  const [maxHourlyCap, setMaxHourlyCap] = useState(25);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [sentToast, setSentToast] = useState(false);

  const shivapur = centers[0];

  const handleToggleCounter4 = () => {
    setCounter4Active(!counter4Active);
    addNotification(
      'Counter 4 Status Updated',
      !counter4Active 
        ? 'Reserve Counter 4 activated. Daily center capacity increased by 350 Quintals.' 
        : 'Counter 4 placed on standby.',
      'system'
    );
  };

  const handleWeatherAlert = () => {
    addNotification(
      'Weather Protection Triggered',
      'IMD rain alert broadcast sent to all farmers with afternoon slots. High moisture lots prioritized for covered shed weighing.',
      'sms'
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    addNotification('Mandi Broadcaster', broadcastMsg.trim(), 'sms');
    setBroadcastMsg('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Operational Gatekeeper & Surge Load Balancer</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Center Capacity & Surge Control
        </h2>
        <p className="text-xs text-slate-500">
          Configure hourly slot limits, activate reserve weighbridges, and handle weather contingency protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacity Threshold Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-200 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Slot & Queue Capacity Thresholds</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Max Farmers Allowed Per 30-Min Slot</span>
                <span className="text-emerald-700 font-bold">{maxHourlyCap} Farmers</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={maxHourlyCap}
                onChange={(e) => setMaxHourlyCap(parseInt(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Prevents vehicle bottleneck on mandi approach road.
              </p>
            </div>

            {/* Counter 4 Reserve Toggle */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Reserve Weighbridge (Counter 4)</span>
                <span className="text-[11px] text-slate-500">
                  {counter4Active ? 'Currently Active (Processing Overflow)' : 'Standby Mode'}
                </span>
              </div>
              <button
                onClick={handleToggleCounter4}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  counter4Active
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {counter4Active ? 'Active' : 'Turn On'}
              </button>
            </div>

            {/* Weather Delay Protocol */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <CloudRain className="w-4 h-4 text-blue-700" />
                <span>Weather Contingency Mode</span>
              </div>
              <p className="text-[11px] text-blue-800">
                Trigger emergency shed allocation and notify outdoor tractor queues in case of rain.
              </p>
              <button
                onClick={handleWeatherAlert}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition"
              >
                Broadcast Weather Delay Advisory
              </button>
            </div>
          </div>
        </div>

        {/* SMS Broadcast Channel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-200 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-700" />
              <span>Broadcast SMS to Active Queue</span>
            </h3>

            <p className="text-xs text-slate-500 my-3">
              Send emergency instructions directly to all farmers currently in the waiting bay or en-route.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                rows={4}
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Type official mandi announcement (e.g. Please use Gate 3 for soybean unloading today)..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Broadcast (AX-EKISAN)</span>
              </button>

              {sentToast && (
                <div className="text-center text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">
                  ✓ Broadcast sent to 28 active queue recipients!
                </div>
              )}
            </form>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            <strong>Telecom Gateway Status:</strong> 100% simulated delivery rate across Wardha & Pune telecom circles.
          </div>
        </div>
      </div>
    </div>
  );
};
