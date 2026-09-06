export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatWeightQuintals(quintals: number): string {
  return `${quintals.toFixed(1)} Quintals (${(quintals * 0.1).toFixed(2)} MT)`;
}

export function formatTimeSlot(time: string): string {
  return time;
}

export function getStageMeta(stage: string): { label: string; color: string; bg: string; stepIndex: number } {
  switch (stage) {
    case 'booked':
      return { label: 'Slot Confirmed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', stepIndex: 1 };
    case 'checked_in':
      return { label: 'Gate Scanned', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', stepIndex: 2 };
    case 'in_queue':
      return { label: 'In Waiting Bay', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', stepIndex: 3 };
    case 'called':
      return { label: 'Called to Counter', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', stepIndex: 4 };
    case 'weighing_qc':
      return { label: 'Weighing & QC', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', stepIndex: 5 };
    case 'procurement_completed':
      return { label: 'Procurement Done (E-J Form)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', stepIndex: 6 };
    case 'payment_processing':
      return { label: 'PFMS Mandate Sent', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', stepIndex: 7 };
    case 'payment_completed':
      return { label: 'DBT Credited to Bank', color: 'text-green-800', bg: 'bg-green-100 border-green-300', stepIndex: 8 };
    case 'late_arrival':
      return { label: 'Late Arrival (Grace Period)', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', stepIndex: 2 };
    default:
      return { label: stage, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200', stepIndex: 0 };
  }
}
