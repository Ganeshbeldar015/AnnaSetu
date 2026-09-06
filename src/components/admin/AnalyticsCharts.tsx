import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');

  // Realistic mock data sets for analytics
  const dailyVolumeData = [
    { day: 'Mon', volumeMT: 1850, dbtCrores: 4.2 },
    { day: 'Tue', volumeMT: 2100, dbtCrores: 4.8 },
    { day: 'Wed', volumeMT: 2450, dbtCrores: 5.6 },
    { day: 'Thu', volumeMT: 2900, dbtCrores: 6.7 },
    { day: 'Fri', volumeMT: 3400, dbtCrores: 7.9 },
    { day: 'Sat', volumeMT: 3100, dbtCrores: 7.1 },
    { day: 'Sun (Today)', volumeMT: 1285, dbtCrores: 3.1 }
  ];

  const hourlyUtilizationData = [
    { time: '08:00', slotsBooked: 24, maxCapacity: 25, waitMins: 15 },
    { time: '09:00', slotsBooked: 25, maxCapacity: 25, waitMins: 22 },
    { time: '10:00', slotsBooked: 25, maxCapacity: 25, waitMins: 32 },
    { time: '11:00', slotsBooked: 25, maxCapacity: 25, waitMins: 35 },
    { time: '12:00', slotsBooked: 20, maxCapacity: 25, waitMins: 24 },
    { time: '14:00', slotsBooked: 18, maxCapacity: 25, waitMins: 18 },
    { time: '15:00', slotsBooked: 15, maxCapacity: 25, waitMins: 14 },
    { time: '16:00', slotsBooked: 12, maxCapacity: 25, waitMins: 10 }
  ];

  const waitTimeComparisonData = [
    { center: 'Shivapur Hub', traditionalHours: 16.5, digitalMinutes: 32 },
    { center: 'Wardha East', traditionalHours: 14.0, digitalMinutes: 12 },
    { center: 'Karnal Silo', traditionalHours: 22.0, digitalMinutes: 48 },
    { center: 'Ludhiana North', traditionalHours: 28.0, digitalMinutes: 55 },
    { center: 'Sehore Mandi', traditionalHours: 12.5, digitalMinutes: 18 },
    { center: 'Bareilly Samiti', traditionalHours: 18.0, digitalMinutes: 28 }
  ];

  const cropShareData = [
    { name: 'Paddy (Grade A)', value: 45, color: '#10b981' },
    { name: 'Paddy (Common)', value: 25, color: '#059669' },
    { name: 'Wheat (Sharbati)', value: 15, color: '#f59e0b' },
    { name: 'Soybean (Yellow)', value: 10, color: '#3b82f6' },
    { name: 'Mustard / Pulses', value: 5, color: '#8b5cf6' }
  ];

  const paymentSLAData = [
    { name: '< 24 Hours (Fast DBT)', value: 82, color: '#10b981' },
    { name: '24–48 Hours (Standard)', value: 15, color: '#3b82f6' },
    { name: '> 48 Hours (Exceptions)', value: 3, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>National Telemetry Analytics Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Procurement Analytics & Impact Heatmaps
          </h2>
          <p className="text-xs text-slate-500">
            Comparative analysis of waiting time reductions, hourly slot capacities, and direct DBT bank settlement SLAs.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All States (Nationwide)</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="haryana">Haryana</option>
            <option value="punjab">Punjab</option>
            <option value="mp">Madhya Pradesh</option>
            <option value="up">Uttar Pradesh</option>
          </select>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Crops (MSP 2024-25)</option>
            <option value="paddy">Paddy (All Varieties)</option>
            <option value="wheat">Wheat</option>
            <option value="soybean">Soybean</option>
            <option value="mustard">Mustard</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Procurement Volume Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daily Procurement Volume Trend (MT)</h3>
              <p className="text-[11px] text-slate-500">Total grain procured across active APMC centers.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              12,850 MT Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyVolumeData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val} MT`, 'Volume Procured']} />
                <Area type="monotone" dataKey="volumeMT" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Slot Utilization vs Wait Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Hourly Slot Capacity vs. Queue Wait Time</h3>
              <p className="text-[11px] text-slate-500">Hourly load balancing prevents mid-day congestion peaks.</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Peak: 11:00 AM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="slotsBooked" name="Booked Slots" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="waitMins" name="Avg Wait (Mins)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Waiting Time Before vs After Digital Scheduling */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Turnaround Time: Traditional vs. e-Kisan</h3>
              <p className="text-[11px] text-slate-500">Center-wise comparison of waiting hours reduced to minutes.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              88% Average Reduction
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitTimeComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="h" />
                <YAxis type="category" dataKey="center" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={(val: any, name: any) => [name === 'traditionalHours' ? `${val} Hours` : `${val} Mins`, name === 'traditionalHours' ? 'Traditional Wait' : 'e-Kisan Digital Wait']} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="traditionalHours" name="Traditional Wait (Hours)" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                <Bar dataKey="digitalMinutes" name="Digital Wait (Mins / 60)" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Crop Share & DBT Settlement SLA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Benefit Transfer (DBT) Settlement SLA</h3>
              <p className="text-[11px] text-slate-500">82% of payments credited within 24 hours directly via PFMS.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ₹48.2 Cr Settled
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentSLAData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={(entry: any) => `${entry.name?.split(' ')[0] || ''} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                >
                  {paymentSLAData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}% of Payments`, 'SLA Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
