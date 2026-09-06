import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calendar,
  Printer,
  ArrowRight,
  Truck
} from 'lucide-react';
import { calculateJourneyPlan } from '../../utils/calculations';
import { BookingToken } from '../../types';
import { PrintableTokenModal } from '../common/PrintableTokenModal';

export const SlotBooking: React.FC = () => {
  const { 
    crops, 
    centers, 
    farmerProfile,
    setFarmerProfile,
    bookNewSlot, 
    setActiveView,
    t
  } = useApp();

  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || 'crop-paddy');
  const [selectedCenterId, setSelectedCenterId] = useState<string>(centers[0]?.id || 'center-shivapur');
  const [expectedQuintals, setExpectedQuintals] = useState<string>('45');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('02:00 PM – 02:30 PM');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingToken | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];
  const selectedCenter = centers.find(c => c.id === selectedCenterId) || centers[0];
  const alternateCenter = centers.find(c => c.id !== selectedCenterId && c.loadStatus === 'normal') || centers[1] || centers[0];

  // Simulated Time Slots for selected date
  const slots = [
    { id: 'slot-1', timeWindow: '09:00 AM – 09:30 AM', bookedCount: 8, maxCapacity: 8, status: 'full' },
    { id: 'slot-2', timeWindow: '09:30 AM – 10:00 AM', bookedCount: 8, maxCapacity: 8, status: 'full' },
    { id: 'slot-3', timeWindow: '10:00 AM – 10:30 AM', bookedCount: 7, maxCapacity: 8, status: 'fast_filling' },
    { id: 'slot-4', timeWindow: '10:30 AM – 11:00 AM', bookedCount: 4, maxCapacity: 8, status: 'available' },
    { id: 'slot-5', timeWindow: '11:00 AM – 11:30 AM', bookedCount: 3, maxCapacity: 8, status: 'available' },
    { id: 'slot-6', timeWindow: '11:30 AM – 12:00 PM', bookedCount: 5, maxCapacity: 8, status: 'available' },
    { id: 'slot-7', timeWindow: '02:00 PM – 02:30 PM', bookedCount: 2, maxCapacity: 8, status: 'available' },
    { id: 'slot-8', timeWindow: '02:30 PM – 03:00 PM', bookedCount: 1, maxCapacity: 8, status: 'available' },
    { id: 'slot-9', timeWindow: '03:00 PM – 03:30 PM', bookedCount: 4, maxCapacity: 8, status: 'available' },
    { id: 'slot-10', timeWindow: '03:30 PM – 04:00 PM', bookedCount: 6, maxCapacity: 8, status: 'fast_filling' }
  ];

  // Live dynamic calculation of journey plan before confirming
  const liveJourneyPlan = calculateJourneyPlan({
    originLocation: farmerProfile.village ? `${farmerProfile.village}, ${farmerProfile.district}` : farmerProfile.district,
    originDistrict: farmerProfile.district,
    destinationCenter: selectedCenter.name,
    slotTimeWindow: selectedSlotTime,
    safetyBufferMinutes: 30
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const token = bookNewSlot({
      centerId: selectedCenterId,
      cropId: selectedCropId,
      expectedQuintals: parseFloat(expectedQuintals) || 40,
      date: selectedDate,
      timeSlot: selectedSlotTime
    });
    setConfirmedBooking(token);
  };

  const handleAddToCalendar = () => {
    if (!confirmedBooking) return;
    const title = encodeURIComponent(`e-Kisan MSP Slot: ${confirmedBooking.tokenNumber} at ${confirmedBooking.centerName}`);
    const details = encodeURIComponent(`Token: ${confirmedBooking.tokenNumber}\nCenter: ${confirmedBooking.centerName}\nCrop: ${confirmedBooking.cropName}\nTime: ${confirmedBooking.timeSlot}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${encodeURIComponent(confirmedBooking.centerName)}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Automated Load Balancing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('slot_booking_title')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('slot_booking_subtitle')}
          </p>
        </div>
      </div>

      {confirmedBooking ? (
        /* Confirmation Screen */
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('procurement_slot_confirmed')}
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 pt-2">
              {t('assigned_token')} <span className="text-emerald-700">{confirmedBooking.tokenNumber}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t('booking_ref')} <span className="font-mono font-semibold">{confirmedBooking.id}</span>
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block font-medium">Farmer Name</span>
              <span className="font-bold text-slate-900">{confirmedBooking.farmerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Kisan Card / PM-KISAN</span>
              <span className="font-mono font-semibold text-slate-800">{farmerProfile.kisanCardId}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">{t('select_crop')}</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.cropName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">{t('expected_weight_qtl')}</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.expectedQuantityQuintals} Quintals</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-400 block font-medium">{t('to_procurement_center')}</span>
              <span className="font-bold text-slate-900 text-sm">{confirmedBooking.centerName}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">{t('scheduled_date')}</span>
              <span className="font-extrabold text-emerald-800 text-sm">{confirmedBooking.date} | {confirmedBooking.timeSlot}</span>
            </div>
            
            {/* Confirmed Smart Journey Advice */}
            <div className="col-span-2 pt-2 border-t border-slate-200 bg-emerald-50/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  {t('recommended_leave_time')}
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  Leave around <strong className="text-emerald-900">{liveJourneyPlan.recommendedDepartureTime}</strong> from {farmerProfile.village || farmerProfile.district} ({liveJourneyPlan.estimatedTravelFormatted} travel + 30 min buffer)
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">{t('expected_arrival')}</span>
                <span className="font-extrabold text-slate-900 text-sm">{liveJourneyPlan.expectedArrivalTime}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>{t('download_print_pass')}</span>
            </button>

            <button
              onClick={handleAddToCalendar}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{t('add_to_calendar')}</span>
            </button>

            <button
              onClick={() => setActiveView('live_queue')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow flex items-center space-x-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{t('track_live_queue')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Booking Configuration Form */
        <form onSubmit={handleConfirmBooking} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Crop & Mandi Select */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>{t('select_produce_center')}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t('select_crop')}</label>
                  <select
                    value={selectedCropId}
                    onChange={(e) => setSelectedCropId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name} (MSP: ₹{c.mspRatePerQuintal}/qtl)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t('expected_weight_qtl')}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={expectedQuintals}
                    onChange={(e) => setExpectedQuintals(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {t('gross_msp_val')} <strong>₹{(parseFloat(expectedQuintals || '0') * selectedCrop.mspRatePerQuintal).toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t('preferred_hub')}</label>
                  <select
                    value={selectedCenterId}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.loadStatus.toUpperCase()} - {c.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t('procurement_date')}</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              {/* Smart Alternate Center Suggestion Banner */}
              {selectedCenter.loadStatus === 'busy' && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>AI Smart Recommendation:</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {selectedCenter.name} has moderate queues. <strong>{alternateCenter.name}</strong> is only {alternateCenter.distanceKm} km away with immediate zero-wait slots!
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCenterId(alternateCenter.id)}
                    className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline"
                  >
                    Switch to {alternateCenter.name} →
                  </button>
                </div>
              )}
            </div>

            {/* Right 2 Columns: Time Slots Matrix with Real-Time Capacity Meters */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>{t('select_time_slot')} ({selectedDate})</span>
                </h3>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>{t('available')}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>{t('fast_filling')}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>{t('full_blocked')}</span>
                  </span>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((slot) => {
                  const remaining = slot.maxCapacity - slot.bookedCount;
                  const isFull = slot.status === 'full';
                  const isSelected = selectedSlotTime === slot.timeWindow && !isFull;

                  return (
                    <button
                      type="button"
                      key={slot.id}
                      disabled={isFull}
                      onClick={() => !isFull && setSelectedSlotTime(slot.timeWindow)}
                      className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                        isFull
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs">{slot.timeWindow}</span>
                        {isFull ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            FULL
                          </span>
                        ) : slot.status === 'fast_filling' ? (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {remaining} Left
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {remaining} {t('available')}
                          </span>
                        )}
                      </div>

                      {/* Capacity Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-rose-500' : isSelected ? 'bg-amber-300' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${(slot.bookedCount / slot.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-80">
                          <span>{slot.bookedCount} / {slot.maxCapacity} booked</span>
                          <span>{Math.round((slot.bookedCount / slot.maxCapacity) * 100)}% capacity</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Smart Arrival & Departure Plan Preview Card (Before Confirmation) */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/40 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <span>{t('your_smart_arrival_plan')}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {t('ai_departure_recommendation')}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        From <strong>{liveJourneyPlan.originLocation}</strong> to <strong>{selectedCenter.name}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Location Quick Switcher to test different farmer locations right inside slot booking */}
                  <div className="flex items-center space-x-1.5 text-xs bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-medium">Test Origin:</span>
                    <button
                      type="button"
                      onClick={() => setFarmerProfile({ ...farmerProfile, district: 'Nashik', village: 'Dindori' })}
                      title="Test Nashik -> Satara (3 hrs travel)"
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        farmerProfile.district.toLowerCase() === 'nashik' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Nashik (3 hrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFarmerProfile({ ...farmerProfile, district: 'Pune', village: 'Haveli' })}
                      title="Test Pune -> Satara (1.5 hrs travel)"
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        farmerProfile.district.toLowerCase() === 'pune' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Pune (1.5 hrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFarmerProfile({ ...farmerProfile, district: 'Sangli', village: 'Miraj' })}
                      title="Test Sangli -> Satara (1.5 hrs travel)"
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        farmerProfile.district.toLowerCase() === 'sangli' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Sangli (1.5 hrs)
                    </button>
                  </div>
                </div>

                {/* 4-Stat Metric Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                    <span className="text-[10px] text-amber-300 font-bold uppercase block">{t('leave_home')}</span>
                    <span className="text-lg font-black text-amber-400">{liveJourneyPlan.recommendedDepartureTime}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Recommended</span>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('est_travel_time')}</span>
                    <span className="text-lg font-black text-slate-200">{liveJourneyPlan.estimatedTravelFormatted}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">~{liveJourneyPlan.estimatedDistanceKm} km</span>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 p-2.5 rounded-xl">
                    <span className="text-[10px] text-blue-300 font-bold uppercase block">{t('arrival_with_buffer')}</span>
                    <span className="text-lg font-black text-blue-300">{liveJourneyPlan.expectedArrivalTime}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">30-min buffer</span>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase block">{t('procurement_slot_time')}</span>
                    <span className="text-lg font-black text-emerald-400">{liveJourneyPlan.slotStartTime}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Window: {selectedSlotTime}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 flex items-center space-x-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{liveJourneyPlan.explanation}</span>
                </p>

                {liveJourneyPlan.warningMessage && (
                  <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{liveJourneyPlan.warningMessage}</span>
                  </div>
                )}
              </div>

              {/* Submit / Confirm Button */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Selected: <strong className="text-slate-900">{selectedSlotTime}</strong> at <strong className="text-slate-900">{selectedCenter.name}</strong>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md flex items-center justify-center space-x-1.5"
                >
                  <span>{t('confirm_slot_btn')}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Printable Pass Modal */}
      {showPrintModal && confirmedBooking && (
        <PrintableTokenModal
          token={confirmedBooking}
          farmer={farmerProfile}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};