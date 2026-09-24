import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Building2, 
  Cpu, 
  Eye, 
  EyeOff, 
  Database,
  ArrowRight,
  Info
} from './Icons';

interface SecurityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityMatrixModal: React.FC<SecurityMatrixModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, authUser, isAuthenticated, openAuthModal } = useApp();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'operator' | 'admin'>('farmer');

  if (!isOpen) return null;

  const roleRules = {
    farmer: {
      title: 'Farmer Role (किसान)',
      badge: 'Tier 1 - Citizen Beneficiary',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Designed with ultra-simple, mobile-first workflows for farmers with voice assistance and high-contrast touch points.',
      permissions: [
        { feature: 'Book MSP Time Slot', allowed: true, note: 'Can book slots for Kharif/Rabi crops in 30-min windows' },
        { feature: 'Live Queue Tracking & Token A-024', allowed: true, note: 'Live position countdown, counter display, airport audio chime' },
        { feature: 'Digital Gate QR Self Check-In', allowed: true, note: 'Scan gate QR code upon physical arrival with tractor/trolley' },
        { feature: 'View Own Electronic QC Receipt', allowed: true, note: 'Inspect moisture %, foreign matter %, and net MSP calculation' },
        { feature: 'Direct Benefit Transfer (DBT) Tracker', allowed: true, note: 'Track PFMS clearance and RBI UTR credit to bank account' },
        { feature: 'Gatekeeper Surge Capacity Control', allowed: false, note: 'Restricted: Only Centre Operators can adjust daily quotas' },
        { feature: 'Electronic Weighbridge Data Entry', allowed: false, note: 'Restricted: Official electronic scales operated by Mandi QC team' },
        { feature: 'Token Dispatch to Weigh Counters', allowed: false, note: 'Restricted: Centre operator dispatches tokens to counters' },
        { feature: 'View Other Farmers Private Data', allowed: false, note: 'Strictly Prohibited: Bank and Aadhaar numbers are masked' },
        { feature: 'National Policy & State Telemetry', allowed: false, note: 'Restricted: Government executive command clearance required' }
      ]
    },
    operator: {
      title: 'Mandi Centre Operator (मंडी ऑपरेटर व QC इनचार्ज)',
      badge: 'Tier 2 - Field Operations & Scale Inspector',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'High-throughput operational terminal for gate verification, moisture testing, weighment, and digital E-J Form dispatch.',
      permissions: [
        { feature: 'Live Counter Dispatch & Calling', allowed: true, note: 'Call tokens to Counter 1-4 with broadcast audio announcements' },
        { feature: 'Physical Gate Verification', allowed: true, note: 'Check-in arriving tractor-trolleys and manage wait bay' },
        { feature: 'Electronic Moisture & QC Testing', allowed: true, note: 'Input moisture %; automatic formula calculates deductions' },
        { feature: 'Generate Digital E-J Form', allowed: true, note: 'Issue official government procurement certificates with QR' },
        { feature: 'Dispatch PFMS Payment Mandate', allowed: true, note: 'Transmit verified batch to RBI Aadhaar Payment Bridge' },
        { feature: 'Surge Capacity & Reserve Counters', allowed: true, note: 'Activate reserve weighbridges during peak harvest congestion' },
        { feature: 'Alter Base MSP Support Rates', allowed: false, note: 'Strictly Prohibited: Base MSP is set by Central Government (CACP)' },
        { feature: 'Modify Other Mandi Center Data', allowed: false, note: 'Restricted: Operator is confined to assigned APMC center' },
        { feature: 'National Executive Policy Override', allowed: false, note: 'Restricted: Ministry of Consumer Affairs command only' }
      ]
    },
    admin: {
      title: 'Government Admin (उपभोक्ता मामले मंत्रालय - DoCA)',
      badge: 'Tier 3 - National Executive Telemetry',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Macro oversight command center across all states, clusters, AI congestion recommendations, and tamper-evident audit logs.',
      permissions: [
        { feature: 'National Command Center Telemetry', allowed: true, note: 'Real-time KPIs across all states, volume procured, and payments' },
        { feature: 'Geospatial Mandi Network Cluster Map', allowed: true, note: 'Live center load status: Normal, Busy, High Load, Full' },
        { feature: 'AI Wait-Time & Rerouting Automation', allowed: true, note: 'Dynamic load balancing algorithm: T = (Q x P) / N' },
        { feature: 'Official Tamper-Evident Audit CSV/PDF', allowed: true, note: 'Download verified DBT transaction ledgers with digital hashes' },
        { feature: 'Security Policy & RBAC Governance', allowed: true, note: 'Manage role assignments, inspect security logs, revoke access' },
        { feature: 'Central Crop MSP Rate Updates', allowed: true, note: 'Publish statutory MSP notifications for upcoming seasons' },
        { feature: 'Physical Bag Weighbridge Scale Entry', allowed: false, note: 'Separation of duties: Admins oversee policy, not physical bags' }
      ]
    }
  };

  const currentRuleData = roleRules[selectedRole];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                    Security Architecture
                  </span>
                  <span className="text-xs text-slate-400">ISO/IEC 27001 & GovTech Standards</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  Role-Based Access Control (RBAC) Matrix
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Explicit access rules defining who has access and who has no access across all three roles.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            {(['farmer', 'operator', 'admin'] as const).map((role) => {
              const info = roleRules[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-2xl text-left transition flex items-center space-x-3 border ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white shadow-lg font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                    role === 'operator' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {role === 'farmer' && <User className="w-5 h-5" />}
                    {role === 'operator' && <Building2 className="w-5 h-5" />}
                    {role === 'admin' && <Cpu className="w-5 h-5" />}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold capitalize truncate">
                      {role === 'farmer' ? '1. Farmer (किसान)' : role === 'operator' ? '2. Operator (मंडी)' : '3. Admin (DoCA)'}
                    </p>
                    <p className={`text-[10px] ${isSelected ? 'text-slate-600' : 'text-slate-400'} truncate`}>
                      {info.badge.split(' - ')[0]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Active Role Card Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{currentRuleData.title}</h3>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentRuleData.badgeColor}`}>
                  {currentRuleData.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{currentRuleData.description}</p>
            </div>

            {currentRole !== selectedRole && (
              <button
                onClick={() => {
                  onClose();
                  openAuthModal(selectedRole);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-emerald-700 transition shrink-0 flex items-center space-x-1.5 shadow"
              >
                <span>Switch to this Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Granular Permission Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Security Rule / Feature Scope</span>
              <span className="w-28 text-center">Access Status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {currentRuleData.permissions.map((perm: { feature: string; allowed: boolean; note: string }, idx: number) => (
                <div key={idx} className="p-3 sm:px-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900 flex items-center space-x-2">
                      <span>{perm.feature}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">{perm.note}</p>
                  </div>

                  <div className="shrink-0 w-28 flex justify-center">
                    {perm.allowed ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Granted</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <Lock className="w-3.5 h-3.5 text-rose-700" />
                        <span>Restricted</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Protection & Anti-Tampering Shield */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Data Security & Anti-Middleman Enforcement
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Every weighment record is tied to a cryptographically validated digital token and GPS-verified Mandi terminal. Direct Benefit Transfer (DBT) mandates are dispatched directly to the <strong>RBI PFMS / Aadhaar Payment Bridge</strong> with zero cash handling, completely eliminating unauthorized fee cuts and arbitrary moisture deductions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Active Session: <strong>{authUser ? `${authUser.name} (${authUser.role.toUpperCase()})` : 'Public Citizen'}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Close Security Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
