import React, { useState } from 'react';
import { 
  Calendar, 
  QrCode, 
  Clock, 
  Scale, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowItWorks: React.FC = () => {
  const { setCurrentRole, setActiveView } = useApp();
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      icon: Calendar,
      title: '1. Dynamic Slot Booking',
      tagline: 'Book 30-min window based on live center capacity',
      description: 'Farmer logs in with mobile number, selects crop type (Paddy/Wheat/Soybean), expected quintals, and views real-time center availability. If Shivapur is full, Wardha East is suggested automatically.',
      highlight: 'Prevents 100% of mandi road congestion before arrival.'
    },
    {
      id: 2,
      icon: QrCode,
      title: '2. E-Token Pass Generation',
      tagline: 'Instant QR pass with vehicle bay allocation',
      description: 'System allocates unique Token Number (e.g. A-024) and encrypted QR pass. Farmer receives instant simulated SMS and can print or save the token to calendar.',
      highlight: 'Full traceability tied to PM-KISAN and Bhulekh land survey record.'
    },
    {
      id: 3,
      icon: Clock,
      title: '3. Live Queue & Smart Arrival',
      tagline: 'Real-time queue & travel departure guidance',
      description: 'Predicts travel time from farmer’s home district (e.g. Nashik, Pune, Sangli) to procurement center (e.g. Satara) and recommends exact departure time so farmers reach with zero roadside waiting.',
      highlight: 'Dynamic departure planning + average wait reduced to < 30 mins.'
    },
    {
      id: 4,
      icon: Scale,
      title: '4. Electronic Weighing & QC',
      tagline: 'Transparent moisture testing with dynamic MSP math',
      description: 'Operator measures moisture (e.g. 13.8%) and weighed quintals (52.5 qtl). The system calculates total amount (₹1,21,800) dynamically using standardized DoCA formulas and issues E-J Form.',
      highlight: 'Zero manual manipulation or middlemen commission.'
    },
    {
      id: 5,
      icon: CreditCard,
      title: '5. Direct DBT Bank Settlement',
      tagline: 'Direct Benefit Transfer via RBI PFMS gateway',
      description: 'Digital E-Procurement certificate automatically dispatches a payment mandate to the farmer’s Aadhaar-seeded bank account with complete transparency and UTR reference number.',
      highlight: '100% digital audit trail for district and central food ministry auditors.'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Workflow Architecture</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            How e-Kisan Solves the Problem in 5 Steps
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Click any step below to explore how the automated digital pipeline works.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = selectedStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-md scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-emerald-700'}`} />
                  <span className="font-bold text-xs">{step.id}. {step.title.split('. ')[1]}</span>
                </div>
                <p className={`text-[11px] truncate ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                  {step.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Feature Box */}
        {(() => {
          const active = steps.find(s => s.id === selectedStep) || steps[0];
          const Icon = active.icon;
          return (
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step {active.id} of 5</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{active.title}</h3>
                <p className="text-emerald-400 font-medium text-sm">{active.tagline}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{active.description}</p>
                
                <div className="pt-2">
                  <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs text-emerald-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Operational Impact: {active.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Step Graphic Preview Box */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Simulated Terminal</span>
                  <span className="text-emerald-400 font-mono text-[10px]">LIVE STATUS: ACTIVE</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">TOKEN HOLDER</span>
                    <span className="text-amber-400 font-bold">Rameshwar Patil (Token A-024)</span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">SCHEDULED APMC</span>
                    <span className="text-white">Shivapur Hub (Counter 2)</span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">GOV RATE APPLIED</span>
                    <span className="text-emerald-400 font-bold">₹2,320 / Quintal (Grade A Paddy)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentRole('farmer');
                    setActiveView('book_slot');
                  }}
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <span>Experience Step in Prototype</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
