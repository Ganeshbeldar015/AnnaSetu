import React from 'react';
import { ShieldCheck, Phone, Mail, CheckCircle2 } from './Icons';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentRole, setActiveView, t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      {/* Gov Initiative Strip */}
      <div className="bg-slate-950 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Department of Consumer Affairs (DoCA)</p>
              <p className="text-xs text-slate-400">{t('doca_ministry')} • {t('gov_india')}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('footer_helpline')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>DoCA Support: <strong className="text-white">msp-procure@nic.in</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-emerald-700 flex items-center justify-center text-white font-bold text-base">
              eK
            </div>
            <span className="font-bold text-white text-base">{t('portal_title')}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('footer_desc')}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Farmer Services</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => { setCurrentRole('farmer'); setActiveView('book_slot'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_book_slot')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('farmer'); setActiveView('live_queue'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_live_queue')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('farmer'); setActiveView('check_in'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_gate_checkin')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('farmer'); setActiveView('payments'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_payments')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('farmer'); setActiveView('register'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_profile')}
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Operational Portals</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => { setCurrentRole('operator'); setActiveView('live_queue'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_op_queue')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('operator'); setActiveView('weighment_terminal'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_op_qc')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('admin'); setActiveView('geospatial_map'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_admin_map')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('admin'); setActiveView('smart_automation'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_admin_automation')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentRole('admin'); setActiveView('reports'); }}
                className="hover:text-emerald-400 transition"
              >
                {t('nav_admin_reports')}
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">National Portal Integrations</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>PFMS Direct Benefit Transfer (DBT)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>PM-KISAN Farmer Database</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Agmarknet & CPGRAMS</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>State Bhulekh Land Records</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Designed for high availability, offline queue continuity, and low-bandwidth rural mobile connectivity.
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-slate-950 py-4 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>{t('footer_copyright')}</p>
      </div>
    </footer>
  );
};