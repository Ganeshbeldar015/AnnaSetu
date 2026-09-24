import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Clock,
  ShieldCheck
} from '../common/Icons';
import { playMandiChime } from '../../utils/audio';

export const DigitalCheckIn: React.FC = () => {
  const { 
    myActiveToken, 
    checkInFarmerToken, 
    setActiveView 
  } = useApp();

  const [inputToken, setInputToken] = useState('A-024');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'already_checked' | 'invalid' | 'late_grace'>('idle');

  const handleSimulateQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      executeCheckIn('A-024');
    }, 1200);
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    executeCheckIn(inputToken.trim().toUpperCase());
  };
  const executeCheckIn = (tokenStr: string) => {
    if (tokenStr === 'A-024' || tokenStr === myActiveToken?.id || tokenStr === myActiveToken?.tokenNumber) {
      if (myActiveToken?.stage !== 'booked') {
        setScanStatus('already_checked');
      } else {
        checkInFarmerToken(myActiveToken.id);
        setScanStatus('success');
      }
    } else if (tokenStr === 'INVALID' || tokenStr === '999') {
      setScanStatus('invalid');
    } else if (tokenStr === 'LATE') {
      setScanStatus('late_grace');
    } else {
      // Allow any demo token
      if (myActiveToken) checkInFarmerToken(myActiveToken.id);
      setScanStatus('success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <QrCode className="w-3.5 h-3.5" />
          <span>Mandi Gate 2 Digital Access Terminal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Digital Gate Self Check-In
        </h2>
        <p className="text-xs text-slate-500">
          Scan the QR token from your mobile screen or enter token number upon arrival at the weighbridge gate.
        </p>
      </div>

      {/* Main Check-In Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Simulated QR Scanner Viewfinder */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <Camera className="w-4 h-4" />
                <span>Simulated Gate QR Scanner</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">GATE-CAM 02</span>
            </div>

            {/* Viewfinder Target */}
            <div className="my-6 relative bg-slate-950 rounded-2xl h-56 flex items-center justify-center border-2 border-slate-700 overflow-hidden">
              {isScanning ? (
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-mono text-emerald-400 animate-pulse">Scanning QR Payload...</p>
                </div>
              ) : (
                <div className="relative w-40 h-40 border-2 border-dashed border-emerald-500/60 rounded-xl flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                  
                  <QrCode className="w-16 h-16 text-slate-600" />
                </div>
              )}

              {/* Laser scan animation bar */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce"></div>
              )}
            </div>
          </div>

          <button
            onClick={handleSimulateQRScan}
            disabled={isScanning}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <Camera className="w-4 h-4" />
            <span>{isScanning ? 'Verifying Token QR...' : 'Simulate Scanning Farmer Mobile Pass'}</span>
          </button>
        </div>

        {/* Right: Manual Token Entry & Results State */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-200">
              Manual Token Lookup or Verification
            </h3>

            <form onSubmit={handleManualCheckIn} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Enter Token Number or Booking ID</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="e.g. A-024 or BK-2026-0824"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl uppercase font-mono font-bold text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition text-xs flex items-center space-x-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons for Edge Cases */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1.5">DEMO EDGE CASE SCENARIOS:</span>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => { setInputToken('A-024'); executeCheckIn('A-024'); }}
                    className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                  >
                    ✓ Normal On-Time (A-024)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputToken('LATE'); executeCheckIn('LATE'); }}
                    className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                  >
                    ⚠️ Late (Grace Period)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputToken('INVALID'); executeCheckIn('INVALID'); }}
                    className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium"
                  >
                    ✗ Invalid Token
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Dynamic Result State Box */}
          <div>
            {scanStatus === 'success' && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-xs text-emerald-900 space-y-2 animate-slide-up">
                <div className="flex items-center space-x-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Check-In Successful! Gate Barrier Opened.</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-200">
                  <div>Token: <strong>A-024</strong></div>
                  <div>Queue Position: <strong>#8 (24 min wait)</strong></div>
                  <div>Bay Assigned: <strong>Waiting Bay 2</strong></div>
                  <div>Counter: <strong>Counter 2 (Grade A Paddy)</strong></div>
                </div>
                <button
                  onClick={() => setActiveView('live_queue')}
                  className="w-full mt-2 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-center flex items-center justify-center space-x-1"
                >
                  <span>Open Live Queue Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {scanStatus === 'already_checked' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2 animate-slide-up">
                <div className="flex items-center space-x-2 font-bold text-blue-800">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Already Checked In</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Token A-024 has already passed gate verification and is currently in the active queue.
                </p>
                <button
                  onClick={() => setActiveView('live_queue')}
                  className="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold"
                >
                  View Queue Position
                </button>
              </div>
            )}

            {scanStatus === 'late_grace' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2 animate-slide-up">
                <div className="flex items-center space-x-2 font-bold text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Late Arrival - 15 Min Grace Period Applied</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  You arrived 12 minutes after your designated slot window. Intelligent load balancer automatically accommodated your tractor in Standby Lane 3.
                </p>
              </div>
            )}

            {scanStatus === 'invalid' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-2 animate-slide-up">
                <div className="flex items-center space-x-2 font-bold text-rose-800">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Invalid Token / Wrong Center</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Token not found in Shivapur APMC database. Please verify your center booking or scan original token pass.
                </p>
              </div>
            )}

            {scanStatus === 'idle' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 text-center">
                Scan QR or click "Normal On-Time" to simulate gate entry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
