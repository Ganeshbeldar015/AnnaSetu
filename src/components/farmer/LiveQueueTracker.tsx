import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Radio,
  Truck
} from '../common/Icons';
import { getStageMeta } from '../../utils/formatters';
import { calculateJourneyPlan } from '../../utils/calculations';
import { announceTokenSpeech, playMandiChime } from '../../utils/audio';

export const LiveQueueTracker: React.FC = () => {
  const { 
    farmerProfile,
    myActiveToken, 
    bookings, 
    setActiveView,
    t 
  } = useApp();

  const journeyPlan = calculateJourneyPlan({
    originLocation: farmerProfile.village ? `${farmerProfile.village}, ${farmerProfile.district}` : farmerProfile.district,
    originDistrict: farmerProfile.district,
    destinationCenter: myActiveToken?.centerName || 'Satara APMC Procurement Hub',
    slotTimeWindow: myActiveToken?.timeSlot || '02:00 PM – 02:30 PM',
    safetyBufferMinutes: 30
  });

  // Active serving tokens at counters
  const completedTokensCount = bookings.filter(b => b.stage === 'procurement_completed' || b.stage === 'payment_processing' || b.stage === 'payment_completed').length;
  const totalScheduledCount = bookings.length;

  const currentStageMeta = getStageMeta(myActiveToken?.stage || 'booked');

  const handleTestAudio = () => {
    playMandiChime();
    announceTokenSpeech(myActiveToken?.tokenNumber || 'A-024', 'Counter 2');
  };

  const stagesList = [
    { key: 'booked', label: 'Slot Confirmed', desc: 'Appointment booked online' },
    { key: 'checked_in', label: 'Gate Scanned', desc: 'QR code verified at Mandi Gate' },
    { key: 'in_queue', label: 'In Waiting Bay', desc: 'Tractor queued in designated lane' },
    { key: 'called', label: 'Called to Counter', desc: 'Proceed to Counter 2' },
    { key: 'weighing_qc', label: 'Weighing & QC', desc: 'Moisture tested & weighed' },
    { key: 'procurement_completed', label: 'Procurement Done', desc: 'Digital E-J Form generated' },
    { key: 'payment_processing', label: 'PFMS Mandate', desc: 'Sent to RBI Aadhaar Bridge' },
    { key: 'payment_completed', label: 'DBT Credited', desc: 'Direct credit in Bank A/C' },
  ];

  const currentStepNumber = currentStageMeta.stepIndex;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Real-Time Mandi Queue Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('live_queue_title')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('live_queue_subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestAudio}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-300"
            title="Play Mandi PA announcement chime"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>{t('test_chime_btn')}</span>
          </button>
        </div>
      </div>

      {/* Main Live Queue Status Display Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Token Big Hero Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                {t('your_mandi_token')}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentStageMeta.bg} ${currentStageMeta.color}`}>
                {currentStageMeta.label}
              </span>
            </div>

            <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  {myActiveToken?.tokenNumber || 'A-024'}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Holder: <strong className="text-white">{myActiveToken?.farmerName || 'Rameshwar Patil'}</strong> • {myActiveToken?.cropName || 'Paddy (Grade A)'}
                </p>
              </div>

              {/* Position and Wait Estimates */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-2 text-right">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('farmers_ahead')}</span>
                  <span className="text-2xl font-black text-amber-400">
                    {myActiveToken?.queuePosition ?? 12}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('estimated_wait_min')}</span>
                  <span className="text-base font-bold text-white">
                    ~{myActiveToken?.estimatedWaitMinutes ?? 35} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Mandi Location & Instructions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{myActiveToken?.centerName || 'Satara APMC Hub'} (Counter 2 Waiting Bay)</span>
            </div>

            {myActiveToken?.stage === 'booked' && (
              <button
                onClick={() => setActiveView('check_in')}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1"
              >
                <span>{t('digital_gate_checkin')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {myActiveToken?.stage === 'procurement_completed' && (
              <button
                onClick={() => setActiveView('payments')}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1"
              >
                <span>{t('view_dbt_status')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mandi Live Counters Dispatch Board */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>{t('now_serving_counters')}</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">LIVE SYNC</span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">{t('counter_paddy')}</span>
                  <span className="text-xs text-slate-600">Kailash Nath Mishra</span>
                </div>
                <div className="text-xl font-black text-emerald-800">A-021</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">{t('counter_premium')}</span>
                  <span className="text-xs text-slate-600">Gajanan Rao Kadam</span>
                </div>
                <div className="text-xl font-black text-amber-800">A-022</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase block">{t('counter_standard')}</span>
                  <span className="text-xs text-slate-600">Vikas Jagannath Raut</span>
                </div>
                <div className="text-xl font-black text-blue-800">A-023</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Completed Today: <strong>{completedTokensCount}</strong></span>
            <span>Total Booked: <strong>{totalScheduledCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Visual Multi-Stage Progress Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Mandi Stage Progression</h3>
            <p className="text-xs text-slate-500">Track each step from online booking to DBT bank credit.</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Step {currentStepNumber} of 8 Completed
          </span>
        </div>

        {/* Timeline Horizontal Line / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stagesList.map((st, idx) => {
            const stepNum = idx + 1;
            const isPassed = stepNum <= currentStepNumber;
            const isCurrent = stepNum === currentStepNumber;

            return (
              <div
                key={st.key}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500 scale-105'
                    : isPassed
                    ? 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-extrabold ${isCurrent ? 'text-amber-300' : 'text-slate-400'}`}>
                      0{stepNum}
                    </span>
                    {isPassed && <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-300' : 'text-emerald-600'}`} />}
                  </div>
                  <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                    {st.label}
                  </h4>
                </div>
                <p className={`text-[10px] mt-2 leading-snug ${isCurrent ? 'text-emerald-200' : 'text-slate-500'}`}>
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Smart Departure & Journey Advisory Banner */}
        <div className="mt-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-4 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-amber-400 text-xs flex items-center space-x-2">
                <span>{t('smart_arrival_badge')}</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {journeyPlan.originDistrict || journeyPlan.originLocation} → {journeyPlan.destinationCenter}
                </span>
              </span>
              <span className="text-slate-300 text-[11px] block mt-0.5">
                {t('recommended_leave_time')}: <strong className="text-amber-300">{journeyPlan.recommendedDepartureTime}</strong> • {t('est_travel_time')}: <strong>{journeyPlan.estimatedTravelFormatted}</strong> (~{journeyPlan.estimatedDistanceKm} km) • {t('expected_arrival')}: <strong className="text-blue-300">{journeyPlan.expectedArrivalTime}</strong>
              </span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs whitespace-nowrap self-end sm:self-center">
            Slot: {myActiveToken?.timeSlot || '02:00 PM – 02:30 PM'}
          </div>
        </div>
      </div>
    </div>
  );
};