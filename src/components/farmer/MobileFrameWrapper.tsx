import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Calendar, 
  Clock, 
  CreditCard, 
  User, 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone,
  Sparkles
} from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  const { 
    isMobileEmulation, 
    activeView, 
    setActiveView, 
    myActiveToken 
  } = useApp();

  if (!isMobileEmulation) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="py-6 flex flex-col items-center justify-center bg-slate-200 min-h-[calc(100vh-120px)] animate-fade-in">
      <div className="mb-3 flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white/80 px-3.5 py-1.5 rounded-full shadow-sm">
        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
        <span>Mobile Viewport Emulation Mode (Farmer Mobile Experience)</span>
      </div>

      {/* iPhone / Android Bezel Frame */}
      <div className="w-full max-w-sm bg-slate-900 rounded-[42px] p-3.5 shadow-2xl border-4 border-slate-800 relative">
        {/* Notch / Speaker Bar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-10 h-1.5 bg-slate-800 rounded-full"></div>
        </div>

        {/* Screen Viewport */}
        <div className="bg-slate-50 w-full rounded-[32px] overflow-hidden flex flex-col h-[740px] relative">
          {/* Mobile Top Status Bar */}
          <div className="bg-slate-900 text-white text-[10px] px-6 pt-3 pb-2 flex items-center justify-between font-mono shrink-0 z-20">
            <span>09:41 AM</span>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile App Header */}
          <div className="bg-emerald-800 text-white px-4 py-2.5 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-emerald-950 flex items-center justify-center font-bold text-xs text-amber-400">
                eK
              </div>
              <span className="font-bold text-xs">e-Kisan Mobile</span>
            </div>
            <span className="text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-full text-emerald-200">
              Token: {myActiveToken?.tokenNumber || 'A-024'}
            </span>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {children}
          </div>

          {/* Native Mobile Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around text-[10px] z-30 shadow-lg">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center space-y-0.5 transition ${
                activeView === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('book_slot')}
              className={`flex flex-col items-center space-y-0.5 transition ${
                activeView === 'book_slot' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Slot</span>
            </button>

            <button
              onClick={() => setActiveView('live_queue')}
              className={`flex flex-col items-center space-y-0.5 transition ${
                activeView === 'live_queue' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Live Queue</span>
            </button>

            <button
              onClick={() => setActiveView('payments')}
              className={`flex flex-col items-center space-y-0.5 transition ${
                activeView === 'payments' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveView('register')}
              className={`flex flex-col items-center space-y-0.5 transition ${
                activeView === 'register' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
