import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Bell, 
  Smartphone, 
  Monitor, 
  Globe, 
  User, 
  Building2, 
  ShieldCheck,
  RotateCcw,
  Lock,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    isMobileEmulation,
    setIsMobileEmulation,
    language,
    setLanguage,
    t,
    notifications,
    setIsNotificationDrawerOpen,
    resetDemoData,
    isAuthenticated,
    authUser,
    openAuthModal,
    logout,
    myActiveToken
  } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Gov Indian National Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-medium text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('gov_india')}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden md:inline text-slate-400">
            {t('doca_ministry')}
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Quick Dual-Language Switcher Pills (English | मराठी) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 rounded-md font-bold transition ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2.5 py-0.5 rounded-md font-bold transition ${
                language === 'mr'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-0.5 rounded-md font-bold transition hidden sm:inline ${
                language === 'hi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={resetDemoData}
            title={t('reset_demo_title')}
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{t('reset_demo')}</span>
          </button>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => {
              if (currentRole === 'public') setActiveView('landing');
              else if (currentRole === 'farmer') setActiveView('dashboard');
              else if (currentRole === 'operator') setActiveView('dashboard');
              else setActiveView('overview');
            }}
            className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
          >
            {/* National Emblem & Emblem Logo */}
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition shrink-0">
              <span className="text-amber-400">e</span>K
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight whitespace-nowrap">
                {t('portal_title')}
              </span>
              <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap leading-tight mt-0.5">
                {t('portal_tagline')}
              </p>
            </div>
          </div>

          {/* Strict Role-Based Session Header / Auth Gate */}
          <div className="hidden lg:flex items-center space-x-2">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setCurrentRole('public'); setActiveView('landing'); }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    currentRole === 'public'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{t('public_portal')}</span>
                </button>

                <button
                  onClick={() => openAuthModal('farmer')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('farmer_portal_btn')}</span>
                </button>

                <button
                  onClick={() => openAuthModal('operator')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t('operator_login_btn')}</span>
                </button>

                <button
                  onClick={() => openAuthModal('admin')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>{t('admin_login_btn')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 animate-fade-in">
                {currentRole === 'farmer' && (
                  <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-sm">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>{t('farmer_portal_badge')}</span>
                  </div>
                )}
                {currentRole === 'operator' && (
                  <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold shadow-sm">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span>{t('operator_portal_badge')}</span>
                  </div>
                )}
                {currentRole === 'admin' && (
                  <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs font-bold shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('admin_portal_badge')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Viewport Simulator Toggle (for Farmer UI) */}
            {currentRole === 'farmer' && (
              <button
                onClick={() => setIsMobileEmulation(!isMobileEmulation)}
                title={isMobileEmulation ? "Switch to Desktop View" : "Simulate Mobile Screen"}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                  isMobileEmulation
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isMobileEmulation ? (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Desktop</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden sm:inline">Mobile</span>
                  </>
                )}
              </button>
            )}

            {/* Notification Bell with SMS simulation drawer */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title={t('sms_log')}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Authentication Button or User Profile Badge */}
            {!isAuthenticated ? (
              <button
                onClick={() => openAuthModal('farmer')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-200" />
                <span>{t('sign_in_register')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-slate-100 pl-2.5 pr-1 py-1 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-1.5 text-xs text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold">
                    {authUser?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="font-bold text-[11px] max-w-[120px] truncate">{authUser?.name?.split(' ')[0]}</p>
                    {authUser?.role === 'farmer' && (
                      <p className="text-[10px] text-emerald-700 font-mono font-bold">Token {myActiveToken?.tokenNumber || 'A-024'}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign out of portal"
                  className="px-2 py-1 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-white transition text-xs font-semibold flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline text-[11px]">{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};