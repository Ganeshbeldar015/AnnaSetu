import React from 'react';
import { BookingToken, FarmerProfile } from '../../types';
import { X, Printer, Calendar, QrCode, CheckCircle2, ShieldCheck, MapPin, Clock } from './Icons';
import { formatWeightQuintals } from '../../utils/formatters';

interface PrintableTokenModalProps {
  token: BookingToken;
  farmer: FarmerProfile;
  onClose: () => void;
}

export const PrintableTokenModal: React.FC<PrintableTokenModalProps> = ({ token, farmer, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`e-Kisan Procurement Slot: ${token.tokenNumber} at ${token.centerName}`);
    const details = encodeURIComponent(`Token: ${token.tokenNumber}\nCenter: ${token.centerName}\nCrop: ${token.cropName}\nQty: ${token.expectedQuantityQuintals} qtl\nTime: ${token.timeSlot}`);
    const location = encodeURIComponent(token.centerName);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-slide-up">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official E-Token Entry Pass</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-token" className="p-6 space-y-5 bg-white">
          {/* Ticket Header */}
          <div className="border-b-2 border-dashed border-slate-300 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Government of India • DoCA</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">e-Kisan Procurement Token Pass</h2>
              <p className="text-xs text-slate-500">Booking ID: {token.id}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Assigned Token</span>
              <div className="text-2xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300 inline-block">
                {token.tokenNumber}
              </div>
            </div>
          </div>

          {/* Farmer & Crop Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Farmer Name</span>
              <span className="font-bold text-slate-900 text-sm">{token.farmerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Kisan Card / PM-KISAN</span>
              <span className="font-mono font-semibold text-slate-800">{farmer.kisanCardId}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Crop & Variety</span>
              <span className="font-semibold text-slate-900">{token.cropName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Expected Produce</span>
              <span className="font-semibold text-slate-900">{formatWeightQuintals(token.expectedQuantityQuintals)}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-400 block font-medium flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>Procurement Center & Gate</span>
              </span>
              <span className="font-bold text-slate-900">{token.centerName} (Gate 2 - Inward Bay)</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium flex items-center space-x-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>Scheduled Time Slot</span>
              </span>
              <span className="font-bold text-emerald-800 text-sm">{token.date} | {token.timeSlot}</span>
            </div>
          </div>

          {/* QR Code & Barcode Simulation */}
          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-900 text-white">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
                <QrCode className="w-4 h-4" />
                <span>Digital Gate QR Token</span>
              </div>
              <p className="text-[11px] text-slate-300">Scan at Mandi Entry Weighbridge for instant check-in.</p>
              <div className="font-mono text-[10px] text-slate-400 pt-1">
                AUTH-HASH: {token.qrTokenPayload}
              </div>
            </div>

            {/* Visual QR representation */}
            <div className="w-20 h-20 bg-white p-1.5 rounded-lg shrink-0 flex items-center justify-center">
              <div className="grid grid-cols-5 gap-0.5 w-full h-full bg-slate-900 p-1 rounded">
                <div className="bg-white col-span-2 row-span-2"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-white col-span-2 row-span-2"></div>
                <div className="bg-white"></div>
                <div className="bg-white col-span-2"></div>
                <div className="bg-white col-span-2 row-span-2"></div>
                <div className="bg-white"></div>
                <div className="bg-white col-span-2 row-span-2"></div>
              </div>
            </div>
          </div>

          {/* Important Farmer Instructions */}
          <div className="text-[11px] text-slate-500 space-y-1 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
            <p className="font-bold text-amber-900">Mandi Entry Instructions:</p>
            <p>1. Please arrive 15 minutes before your time slot to ensure fast moisture inspection.</p>
            <p>2. Keep tractor/trolley vehicle registration number ready at Gate 2.</p>
            <p>3. Direct Benefit Transfer (DBT) will be credited to Aadhaar-linked Bank: {farmer.bankName}.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2.5">
          <button
            onClick={handleAddToCalendar}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition flex items-center space-x-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition flex items-center space-x-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Download PDF Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
