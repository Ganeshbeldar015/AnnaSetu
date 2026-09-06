import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Scale,
  CreditCard,
  QrCode
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentRole, setActiveView, isAuthenticated, openAuthModal, t } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative background grids & glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top National MSP Portal Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{t('national_msp_portal')}</span>
          </div>
        </div>

        {/* Hero Headline & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t('hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              {t('hero_title_2')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {t('hero_subtitle')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('farmer');
                } else {
                  setCurrentRole('farmer');
                  setActiveView('book_slot');
                }
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl hover:shadow-emerald-600/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>{t('cta_start_journey')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('farmer');
                } else {
                  setCurrentRole('farmer');
                  setActiveView('live_queue');
                }
              }}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 shadow-md backdrop-blur-sm transition flex items-center space-x-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{t('cta_track_queue')}</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('operator');
                } else {
                  setCurrentRole('operator');
                  setActiveView('dashboard');
                }
              }}
              className="px-5 py-3.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 font-semibold text-sm border border-blue-700/50 backdrop-blur-sm transition flex items-center space-x-1.5"
            >
              <span>{t('cta_operator_terminal')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Visual Workflow Pipeline Card */}
        <div className="mt-14 max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                {t('workflow_pipeline_title')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('workflow_pipeline_subtitle')}
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              {t('live_system_badge')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 relative group hover:border-emerald-500/50 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{t('step_1_title')}</h4>
              <p className="text-xs text-slate-400">{t('step_1_desc')}</p>
              <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('step_1_highlight')}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 relative group hover:border-emerald-500/50 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{t('step_2_title')}</h4>
              <p className="text-xs text-slate-400">{t('step_2_desc')}</p>
              <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                <QrCode className="w-3 h-3" />
                <span>{t('step_2_highlight')}</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 relative group hover:border-emerald-500/50 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{t('step_3_title')}</h4>
              <p className="text-xs text-slate-400">{t('step_3_desc')}</p>
              <div className="mt-3 text-[11px] text-amber-400 font-medium flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{t('step_3_highlight')}</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 relative group hover:border-emerald-500/50 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{t('step_4_title')}</h4>
              <p className="text-xs text-slate-400">{t('step_4_desc')}</p>
              <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                <Scale className="w-3 h-3" />
                <span>{t('step_4_highlight')}</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 relative group hover:border-emerald-500/50 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                5
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{t('step_5_title')}</h4>
              <p className="text-xs text-slate-400">{t('step_5_desc')}</p>
              <div className="mt-3 text-[11px] text-green-400 font-medium flex items-center space-x-1">
                <CreditCard className="w-3 h-3" />
                <span>{t('step_5_highlight')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};