import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  MapPin, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  Clock,
  Building2
} from '../common/Icons';
import { FarmerProfile } from '../../types';

export const RegistrationWizard: React.FC = () => {
  const { 
    farmerProfile, 
    setFarmerProfile, 
    centers, 
    crops, 
    bookNewSlot, 
    setActiveView 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: farmerProfile.name,
    phone: farmerProfile.phone,
    aadhaarMasked: farmerProfile.aadhaarMasked,
    state: farmerProfile.state,
    district: farmerProfile.district,
    village: farmerProfile.village,
    landSurveyNo: farmerProfile.landSurveyNo,
    landAcreage: farmerProfile.landAcreage.toString(),
    kisanCardId: farmerProfile.kisanCardId,
    cropId: crops[0].id,
    expectedQuintals: '52.5',
    centerId: centers[0].id,
    date: '2026-09-02',
    timeSlot: '10:30 AM – 11:00 AM',
    simulatedOtp: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) errs.name = 'Farmer name is required.';
      if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit mobile number required.';
      if (!formData.village.trim()) errs.village = 'Village name required.';
      if (!formData.district.trim()) errs.district = 'District required.';
    } else if (currentStep === 2) {
      if (!formData.landSurveyNo.trim()) errs.landSurveyNo = 'Land Survey / Gat number required.';
      if (!formData.landAcreage || parseFloat(formData.landAcreage) <= 0) errs.landAcreage = 'Valid land acreage required.';
      if (!formData.expectedQuintals || parseFloat(formData.expectedQuintals) <= 0) errs.expectedQuintals = 'Expected produce quantity required.';
    } else if (currentStep === 3) {
      if (!formData.centerId) errs.centerId = 'Please select a procurement centre.';
      if (!formData.timeSlot) errs.timeSlot = 'Please select a time slot.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 3 && !otpSent) {
        setOtpSent(true);
      }
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      // Save farmer profile in state
      const updatedProfile: FarmerProfile = {
        ...farmerProfile,
        name: formData.name,
        phone: formData.phone,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        landSurveyNo: formData.landSurveyNo,
        landAcreage: parseFloat(formData.landAcreage) || 4.8,
        kisanCardId: formData.kisanCardId || 'MH-WRD-2024-9981'
      };
      setFarmerProfile(updatedProfile);

      // Book the slot
      bookNewSlot({
        centerId: formData.centerId,
        cropId: formData.cropId,
        expectedQuintals: parseFloat(formData.expectedQuintals) || 52.5,
        date: formData.date,
        timeSlot: formData.timeSlot
      });

      setIsSuccess(true);
      setTimeout(() => {
        setActiveView('dashboard');
      }, 1500);
    }
  };

  const selectedCrop = crops.find(c => c.id === formData.cropId) || crops[0];
  const selectedCenter = centers.find(c => c.id === formData.centerId) || centers[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4-Step Official Registration & Slot Assignment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Farmer Registration & Direct Slot Booking
        </h2>
        <p className="text-xs text-slate-500">
          Integrated with PM-KISAN, State Land Records (Bhulekh), and APMC Mandi Allocations.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Personal Info' },
            { num: 2, label: 'Crop & Land' },
            { num: 3, label: 'Center & Slot' },
            { num: 4, label: 'Review & Confirm' }
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-xl transition ${
                step === s.num
                  ? 'bg-emerald-800 text-white font-bold shadow'
                  : s.num < step
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider">Step {s.num}</span>
              <span className="truncate block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {isSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Registration & Slot Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Token <strong>A-024</strong> allocated at {selectedCenter.name} for {formData.timeSlot}. Redirecting to your live dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <User className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Step 1: Personal & Geographic Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Farmer Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 text-xs"
                      placeholder="e.g. Rameshwar Pandurang Patil"
                    />
                    {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mobile Number (For SMS Alerts) *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 text-xs"
                      placeholder="e.g. 98221 54321"
                    />
                    {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Aadhaar (Masked for Security)</label>
                    <input
                      type="text"
                      disabled
                      value={formData.aadhaarMasked}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">District *</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                    {errors.district && <p className="text-rose-600 text-[11px] mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Village *</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                    {errors.village && <p className="text-rose-600 text-[11px] mt-1">{errors.village}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Crop & Land Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Step 2: Land Records & Crop Produce</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Kisan Card / Registration ID</label>
                    <input
                      type="text"
                      value={formData.kisanCardId}
                      onChange={(e) => setFormData({ ...formData, kisanCardId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Land Survey No. / 7/12 Gat No. *</label>
                    <input
                      type="text"
                      value={formData.landSurveyNo}
                      onChange={(e) => setFormData({ ...formData, landSurveyNo: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      placeholder="e.g. Gat No. 184/B"
                    />
                    {errors.landSurveyNo && <p className="text-rose-600 text-[11px] mt-1">{errors.landSurveyNo}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Cultivated Land Acreage (Acres) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.landAcreage}
                      onChange={(e) => setFormData({ ...formData, landAcreage: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                    {errors.landAcreage && <p className="text-rose-600 text-[11px] mt-1">{errors.landAcreage}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Crop Type for Procurement *</label>
                    <select
                      value={formData.cropId}
                      onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      {crops.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name} (MSP: ₹{c.mspRatePerQuintal}/qtl)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Expected Produce Quantity (Quintals) *</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.expectedQuintals}
                      onChange={(e) => setFormData({ ...formData, expectedQuintals: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      placeholder="e.g. 52.5"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Estimated MSP value: <strong>₹{(parseFloat(formData.expectedQuintals || '0') * selectedCrop.mspRatePerQuintal).toLocaleString('en-IN')}</strong> (Subject to moisture test)
                    </p>
                    {errors.expectedQuintals && <p className="text-rose-600 text-[11px] mt-1">{errors.expectedQuintals}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Procurement Center & Slot Preferences */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Step 3: Mandi Center & Preferred Time Slot</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Select Procurement Centre *</label>
                    <select
                      value={formData.centerId}
                      onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.district}) - {c.loadStatus.toUpperCase()} (Wait: ~{c.avgWaitTimeMinutes}m)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Select Date *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Select 30-Min Time Window *</label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                      >
                        <option value="09:00 AM – 09:30 AM">09:00 AM – 09:30 AM (Fast Filling)</option>
                        <option value="09:30 AM – 10:00 AM">09:30 AM – 10:00 AM (Moderate)</option>
                        <option value="10:00 AM – 10:30 AM">10:00 AM – 10:30 AM (Available)</option>
                        <option value="10:30 AM – 11:00 AM">10:30 AM – 11:00 AM (Recommended)</option>
                        <option value="11:00 AM – 11:30 AM">11:00 AM – 11:30 AM (Available)</option>
                        <option value="02:00 PM – 02:30 PM">02:00 PM – 02:30 PM (Low Load)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Selected Hub capacity managed: We guarantee under 30 minutes turnaround.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review, Confirm & Simulated OTP */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Step 4: Review Summary & Aadhaar OTP Verification</h3>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block font-medium">Farmer Name</span>
                      <span className="font-bold text-slate-900">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Mobile Number</span>
                      <span className="font-bold text-slate-900">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Crop & Variety</span>
                      <span className="font-bold text-slate-900">{selectedCrop.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Quantity</span>
                      <span className="font-bold text-slate-900">{formData.expectedQuintals} Quintals</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block font-medium">Procurement Center</span>
                      <span className="font-bold text-slate-900">{selectedCenter.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-medium">Time Window</span>
                      <span className="font-bold text-emerald-800 text-sm">{formData.date} | {formData.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-900">
                    <span className="font-semibold">Simulated Aadhaar OTP sent to +91 {formData.phone}</span>
                    <span className="font-mono text-[10px] bg-amber-200/80 px-2 py-0.5 rounded font-bold text-amber-950">
                      DEMO OTP: 8924
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP (e.g. 8924)"
                    defaultValue="8924"
                    className="w-full px-3 py-2 border border-amber-300 rounded-xl text-xs font-mono tracking-widest text-center font-bold bg-white"
                  />
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition flex items-center space-x-1 shadow"
                >
                  <span>Proceed to Step {step + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition flex items-center space-x-1.5 shadow-lg"
                >
                  <span>Confirm & Generate Token A-024</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
