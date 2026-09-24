import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, Lock, ArrowRight, User, Building2, Cpu } from './Icons';

interface RoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole, children }) => {
  const { currentRole, isAuthenticated, openAuthModal, t } = useApp();

  // If user has the required role and is authenticated (or role is public), render the protected view
  if (currentRole === requiredRole && (isAuthenticated || requiredRole === 'public')) {
    return <>{children}</>;
  }

  const roleTitleMap: Record<UserRole, { title: string; desc: string; icon: any; color: string }> = {
    farmer: {
      title: 'Farmer Beneficiary Portal',
      desc: 'Access to slot scheduling, token tracking, and direct benefit payments requires Farmer authentication.',
      icon: User,
      color: 'emerald'
    },
    operator: {
      title: 'Mandi Centre Operator Terminal',
      desc: 'Access to electronic moisture scale calibration, gate verification, and token dispatching requires Operator authentication.',
      icon: Building2,
      color: 'blue'
    },
    admin: {
      title: 'Government DoCA Executive Telemetry',
      desc: 'Access to macro-analytics, geospatial network control, and official audit ledgers requires Department Admin authentication.',
      icon: Cpu,
      color: 'purple'
    },
    public: {
      title: 'Public Portal',
      desc: 'Public overview and center locator information.',
      icon: ShieldCheck,
      color: 'slate'
    }
  };

  const target = roleTitleMap[requiredRole];
  const TargetIcon = target.icon;

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-inner">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-300">
          Security Protocol 403: Role Verification Needed
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {target.title}
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          {target.desc}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Your Current Session:</span>
          <span className="font-bold capitalize px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">
            {currentRole}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Required Role:</span>
          <span className="font-bold capitalize px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
            {requiredRole}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => openAuthModal(requiredRole)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-md flex items-center justify-center space-x-2"
        >
          <TargetIcon className="w-4 h-4" />
          <span>Authenticate as {requiredRole.toUpperCase()}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
