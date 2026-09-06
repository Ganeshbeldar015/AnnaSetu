import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  Search, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';

export const ReportsGenerator: React.FC = () => {
  const { bookings, centers } = useApp();
  const [reportType, setReportType] = useState<'daily' | 'centre' | 'payment' | 'queue'>('daily');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate real downloadable CSV file
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (reportType === 'daily' || reportType === 'payment') {
      csvContent += "Booking_ID,Token_No,Farmer_Name,Village,Crop,Quantity_Qtl,Slot_Time,Stage,Gross_Amount,Net_Payable,UTR_Number,PFMS_Status\n";
      bookings.forEach(b => {
        const netAmt = b.qcDetails?.netPayableAmount || Math.round(b.expectedQuantityQuintals * 2320);
        const grossAmt = b.qcDetails?.grossAmount || Math.round(b.expectedQuantityQuintals * 2320);
        const utr = b.paymentDetails?.utrNumber || 'PENDING_CLEARING';
        const pfms = b.paymentDetails?.status || 'Mandate_Initiated';
        csvContent += `"${b.id}","${b.tokenNumber}","${b.farmerName}","${b.farmerVillage}","${b.cropName}",${b.actualQuantityQuintals || b.expectedQuantityQuintals},"${b.timeSlot}","${b.stage}",${grossAmt},${netAmt},"${utr}","${pfms}"\n`;
      });
    } else {
      csvContent += "Center_Code,Center_Name,District,State,Total_Counters,Active_Counters,Daily_Capacity_Qtl,Daily_Procured_Qtl,Current_Queue,Avg_Wait_Mins,Load_Status\n";
      centers.forEach(c => {
        csvContent += `"${c.code}","${c.name}","${c.district}","${c.state}",${c.totalCounters},${c.activeCounters},${c.dailyCapacityQuintals},${c.dailyProcuredQuintals},${c.currentQueueCount},${c.avgWaitTimeMinutes},"${c.loadStatus}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eKisan_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Official Government Audit & Export Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Reports & Digital Audit Trail Generator
          </h2>
          <p className="text-xs text-slate-500">
            Export filterable, compliant CSV reports for district collectors, APMC secretaries, and Ministry auditors.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Report (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Download Toast */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Report CSV successfully generated and downloaded to your browser!</span>
        </div>
      )}

      {/* Report Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'daily', label: 'Daily Procurement Ledger', desc: 'Farmer-level weighment & MSP breakdown' },
          { key: 'centre', label: 'Centre Performance Matrix', desc: 'Throughput, capacity, active weighbridges' },
          { key: 'payment', label: 'PFMS DBT Settlement SLA', desc: 'Bank reference UTRs & clearance times' },
          { key: 'queue', label: 'Queue & Waiting Time Audit', desc: 'Slot compliance and delay deviations' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key as any)}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              reportType === tab.key
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <FileText className={`w-4 h-4 ${reportType === tab.key ? 'text-amber-400' : 'text-slate-500'}`} />
                <h4 className="font-bold text-xs">{tab.label}</h4>
              </div>
              <p className={`text-[11px] leading-snug ${reportType === tab.key ? 'text-slate-300' : 'text-slate-500'}`}>
                {tab.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Report Preview Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase">
              Live Preview: {reportType.toUpperCase()} PROCUREMENT REPORT ({new Date().toLocaleDateString('en-IN')})
            </h3>
            <p className="text-xs text-slate-500">Government of India • Ministry of Consumer Affairs, Food & Public Distribution</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            FORMAT: AGMARKNET / PFMS V2.4
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'daily' || reportType === 'payment' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Token #</th>
                  <th className="py-3 px-3">Farmer Name</th>
                  <th className="py-3 px-3">Village</th>
                  <th className="py-3 px-3">Crop Weighed</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Net Payable</th>
                  <th className="py-3 px-3">PFMS Status</th>
                  <th className="py-3 px-3 font-mono">UTR Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold font-mono text-slate-900">{b.tokenNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{b.farmerName}</td>
                    <td className="py-3 px-3 text-slate-500">{b.farmerVillage}</td>
                    <td className="py-3 px-3 text-slate-700">{b.cropName}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{b.actualQuantityQuintals || b.expectedQuantityQuintals} qtl</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {formatCurrencyINR(b.qcDetails?.netPayableAmount || Math.round(b.expectedQuantityQuintals * 2320))}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {b.paymentDetails?.status || 'Mandate Initiated'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                      {b.paymentDetails?.utrNumber || 'RBI-PFMS-99824102941'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Center Code</th>
                  <th className="py-3 px-3">Center Name</th>
                  <th className="py-3 px-3">State / District</th>
                  <th className="py-3 px-3">Active Counters</th>
                  <th className="py-3 px-3">Daily Capacity</th>
                  <th className="py-3 px-3">Current Queue</th>
                  <th className="py-3 px-3">Avg Wait</th>
                  <th className="py-3 px-3">Load Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{c.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 text-slate-500">{c.district}, {c.state}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">{c.activeCounters} / {c.totalCounters}</td>
                    <td className="py-3 px-3">{c.dailyProcuredQuintals} / {c.dailyCapacityQuintals} qtl</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{c.currentQueueCount} Trucks</td>
                    <td className="py-3 px-3 font-bold text-amber-700">~{c.avgWaitTimeMinutes}m</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase">
                        {c.loadStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
