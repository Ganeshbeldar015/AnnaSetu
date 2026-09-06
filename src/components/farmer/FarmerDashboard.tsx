import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Scale, 
  Printer, 
  Sparkles, 
  Bell,
  Truck
} from 'lucide-react';
import { getStageMeta } from '../../utils/formatters';
import { calculateJourneyPlan } from '../../utils/calculations';
import { PrintableTokenModal } from '../common/PrintableTokenModal';

export const FarmerDashboard: React.FC = () => {
  const { 
    farmerProfile, 
    setFarmerProfile,
    myActiveToken, 
    setActiveView, 
    crops,
    setIsNotificationDrawerOpen,
    t
  } = useApp();

  const [showPrintModal, setShowPrintModal] = useState(false);

  const stageMeta = getStageMeta(myActiveToken?.stage || 'booked');

  const journeyPlan = calculateJourneyPlan({
    originLocation: farmerProfile.village ? `${farmerProfile.village}, ${farmerProfile.district}` : farmerProfile.district,
    originDistrict: farmerProfile.district,
    destinationCenter: myActiveToken?.centerName || 'Satara APMC Procurement Hub',
    slotTimeWindow: myActiveToken?.timeSlot || '02:00 PM – 02:30 PM',
    safetyBufferMinutes: 30
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-700/80 border border-emerald-500/40 text-emerald-200">
                {t('verified_beneficiary')}
              </span>
              <span className="text-xs text-slate-300 font-mono">ID: {farmerProfile.kisanCardId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('namaste')}, {farmerProfile.name}
            </h1>
            <p className="text-xs text-slate-300 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{farmerProfile.village}, {farmerProfile.district}, {farmerProfile.state}</span>
              <span>• {farmerProfile.landAcreage} Acres ({farmerProfile.landSurveyNo})</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveView('book_slot')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('book_new_slot')}</span>
            </button>

            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('sms_log')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Active Booking Card */}
      {myActiveToken ? (
        <div className="bg-white border-2 border-emerald-500/60 rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-black text-xl">
                {myActiveToken.tokenNumber}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-base">{t('active_appointment')}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${stageMeta.bg} ${stageMeta.color}`}>
                    {stageMeta.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {t('booking_ref')} <span className="font-mono font-medium">{myActiveToken.id}</span> • {t('scheduled_date')} {myActiveToken.date}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('view_print_pass')}</span>
              </button>

              <button
                onClick={() => setActiveView('live_queue')}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center space-x-1 shadow-sm"
              >
                <span>{t('nav_live_queue')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('to_procurement_center')}</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{myActiveToken.centerName}</span>
              <span className="text-[11px] text-slate-500">{t('gate_inward_bay')}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('scheduled_date')}</span>
              <span className="font-bold text-emerald-800 text-xs sm:text-sm block">{myActiveToken.timeSlot}</span>
              <span className="text-[11px] text-slate-500">{t('window_30min')}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('farmers_ahead')}</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {myActiveToken.queuePosition > 0 ? `#${myActiveToken.queuePosition}` : t('now_serving')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {myActiveToken.queuePosition > 0 ? `(${myActiveToken.queuePosition} ${t('ahead')})` : 'Counter 2'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('estimated_wait_min')}</span>
              <span className="font-extrabold text-amber-700 text-base sm:text-lg block">
                {myActiveToken.estimatedWaitMinutes > 0 ? `~${myActiveToken.estimatedWaitMinutes} mins` : 'Immediate'}
              </span>
              <span className="text-[11px] text-slate-500">{t('ai_estimate')}</span>
            </div>
          </div>

          {/* Quick Stage Progression Tracker */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>{t('next_step_label')} </strong> 
                {myActiveToken.stage === 'booked' && 'Arrive at Gate 2 and scan your Digital QR Pass.'}
                {myActiveToken.stage === 'checked_in' && 'Vehicle checked in. Wait in Bay until Token A-024 is called.'}
                {myActiveToken.stage === 'called' && 'Proceed immediately to Counter 2 for electronic weighment.'}
                {myActiveToken.stage === 'weighing_qc' && 'Moisture & weight inspection in progress at Counter 2.'}
                {myActiveToken.stage === 'procurement_completed' && 'E-J Form issued. Bank DBT mandate initiated.'}
                {myActiveToken.stage === 'payment_processing' && 'Payment mandate submitted to PFMS clearing.'}
                {myActiveToken.stage === 'payment_completed' && 'DBT Payment successfully credited to your Bank Account!'}
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {myActiveToken.stage === 'booked' && (
                <button
                  onClick={() => setActiveView('check_in')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center space-x-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{t('scan_gate_qr')}</span>
                </button>
              )}
              {myActiveToken.stage === 'procurement_completed' && (
                <button
                  onClick={() => setActiveView('payments')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center space-x-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{t('view_dbt_status')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{t('no_active_booking')}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t('no_active_desc')}
          </p>
          <button
            onClick={() => setActiveView('book_slot')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            {t('book_slot_now')}
          </button>
        </div>
      )}

      {/* SMART JOURNEY PLAN CARD (Smart Arrival & Departure Prediction) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-500/40 relative overflow-hidden animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('smart_arrival_badge')}
                </span>
              </div>
              <h3 className="text-xl font-black text-white pt-0.5">
                {t('smart_journey_plan_title')}
              </h3>
            </div>
          </div>

          {/* Location Quick Switcher for Demo / Testing */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] font-medium px-1.5">{t('quick_test_route')}</span>
            <button
              onClick={() => setFarmerProfile({ ...farmerProfile, district: 'Nashik', village: 'Dindori' })}
              title="Test Nashik -> Satara (3 hrs travel)"
              className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                farmerProfile.district.toLowerCase() === 'nashik'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Nashik (3 hrs)
            </button>
            <button
              onClick={() => setFarmerProfile({ ...farmerProfile, district: 'Pune', village: 'Haveli' })}
              title="Test Pune -> Satara (1.5 hrs travel)"
              className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                farmerProfile.district.toLowerCase() === 'pune'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Pune (1.5 hrs)
            </button>
            <button
              onClick={() => setFarmerProfile({ ...farmerProfile, district: 'Sangli', village: 'Miraj' })}
              title="Test Sangli -> Satara (1.5 hrs travel)"
              className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                farmerProfile.district.toLowerCase() === 'sangli'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Sangli (1.5 hrs)
            </button>
          </div>
        </div>

        {/* Journey Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-5 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">{t('from_farmer_loc')}</span>
            <span className="font-bold text-white text-sm">{journeyPlan.originLocation}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">{t('to_procurement_center')}</span>
            <span className="font-bold text-white text-sm truncate">{journeyPlan.destinationCenter}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">{t('est_travel_time')}</span>
            <span className="font-bold text-amber-400 text-sm">{journeyPlan.estimatedTravelFormatted} (~{journeyPlan.estimatedDistanceKm} km)</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">{t('procurement_slot_time')}</span>
            <span className="font-bold text-emerald-400 text-sm">{journeyPlan.slotStartTime}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">{t('safety_buffer')}</span>
            <span className="font-bold text-slate-200 text-sm">{journeyPlan.safetyBufferMinutes} min</span>
          </div>
        </div>

        {/* Main 3-Box Outcome Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-center">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-inner">
            <span className="text-amber-300 text-xs font-bold block mb-1">{t('recommended_leave_time')}</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{journeyPlan.recommendedDepartureTime}</span>
            <span className="text-[11px] text-slate-300 block mt-1">{t('start_journey_from')} {farmerProfile.village || farmerProfile.district}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 shadow-inner">
            <span className="text-blue-300 text-xs font-bold block mb-1">{t('expected_arrival')}</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-300">{journeyPlan.expectedArrivalTime}</span>
            <span className="text-[11px] text-slate-300 block mt-1">{t('arrive_at_gate')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-inner">
            <span className="text-emerald-300 text-xs font-bold block mb-1">{t('expected_procurement')}</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{journeyPlan.expectedProcurementTime}</span>
            <span className="text-[11px] text-slate-300 block mt-1">{t('queue_wait_target')}</span>
          </div>
        </div>

        {/* Explanation Note & Warnings */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <p className="text-slate-300 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{journeyPlan.explanation}</span>
          </p>

          {journeyPlan.warningMessage && (
            <span className="text-amber-300 font-semibold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
              {journeyPlan.warningMessage}
            </span>
          )}
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveView('book_slot')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{t('nav_book_slot')}</h4>
          <p className="text-xs text-slate-500 mt-1">{t('step_1_desc')}</p>
        </button>

        <button
          onClick={() => setActiveView('live_queue')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{t('nav_live_queue')}</h4>
          <p className="text-xs text-slate-500 mt-1">{t('step_3_desc')}</p>
        </button>

        <button
          onClick={() => setActiveView('check_in')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <QrCode className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{t('digital_gate_checkin')}</h4>
          <p className="text-xs text-slate-500 mt-1">{t('step_2_desc')}</p>
        </button>

        <button
          onClick={() => setActiveView('payments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{t('nav_payments')}</h4>
          <p className="text-xs text-slate-500 mt-1">{t('step_5_desc')}</p>
        </button>
      </div>

      {/* Government MSP Rates Transparency Board */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">{t('footer_title')} (DoCA)</h3>
          </div>
          <span className="text-[11px] text-slate-500">Benchmark: ≤14.0%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-lg mb-1">{crop.icon}</div>
              <span className="text-slate-500 block text-[10px] truncate">{crop.name}</span>
              <div className="text-sm font-extrabold text-emerald-800">
                ₹{crop.mspRatePerQuintal.toLocaleString('en-IN')}<span className="text-[10px] text-slate-500 font-normal">/qtl</span>
              </div>
              <span className="text-[10px] text-slate-400">≤{crop.standardMoisturePercent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Modal Pass */}
      {showPrintModal && myActiveToken && (
        <PrintableTokenModal
          token={myActiveToken}
          farmer={farmerProfile}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};