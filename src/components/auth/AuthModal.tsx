import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  User, 
  Building2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  MapPin, 
  FileText,
  KeyRound
} from '../common/Icons';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authIntentRole, 
    login, 
    signupFarmer, 
    farmerProfile,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'farmer_login' | 'farmer_signup' | 'official_login'>('farmer_login');
  const [officialSubRole, setOfficialSubRole] = useState<'operator' | 'admin'>('operator');
  
  // Login Form States
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Signup Form States
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    village: 'Dindori',
    district: 'Nashik',
    landSurveyNo: '77/2A',
    landAcreage: 4.5,
    password: ''
  });

  // Sync active tab with intent role when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMsg('');
      if (authIntentRole === 'operator') {
        setActiveTab('official_login');
        setOfficialSubRole('operator');
        setUsername('DOCA-MH-042');
        setPassword('operator@123');
      } else if (authIntentRole === 'admin') {
        setActiveTab('official_login');
        setOfficialSubRole('admin');
        setUsername('admin@doca.gov.in');
        setPassword('admin@123');
      } else {
        setActiveTab('farmer_login');
        setUsername('98221 54321');
        setPassword('kisan123');
      }
    }
  }, [isAuthModalOpen, authIntentRole]);

  if (!isAuthModalOpen) return null;

  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('Please enter your Mobile Number or Kisan ID');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your 4-digit PIN or password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        username: username.trim(),
        password: password.trim(),
        role: 'farmer',
        name: farmerProfile.name
      });
    }, 400);
  };

  const handleOfficialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter credentials');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        username: username.trim(),
        password: password.trim(),
        role: officialSubRole
      });
    }, 400);
  };

  const handleFarmerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signupData.name.trim() || !signupData.phone.trim() || !signupData.password.trim()) {
      setErrorMsg('Please fill in all mandatory fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signupFarmer(signupData);
    }, 500);
  };

  const autofillDemoFarmer = () => {
    setUsername('98221 54321');
    setPassword('kisan123');
    setErrorMsg('');
    login({
      username: '98221 54321',
      password: 'kisan123',
      role: 'farmer',
      name: 'Rameshwar Pandurang Patil'
    });
  };

  const autofillDemoOperator = () => {
    setUsername('DOCA-MH-042');
    setPassword('operator@123');
    setOfficialSubRole('operator');
    setErrorMsg('');
    login({
      username: 'DOCA-MH-042',
      password: 'operator@123',
      role: 'operator'
    });
  };

  const autofillDemoAdmin = () => {
    setUsername('admin@doca.gov.in');
    setPassword('admin@123');
    setOfficialSubRole('admin');
    setErrorMsg('');
    login({
      username: 'admin@doca.gov.in',
      password: 'admin@123',
      role: 'admin'
    });
  };

  const autofillNewFarmer = () => {
    setSignupData({
      name: 'Kishore Baburao Gaikwad',
      phone: '94231 88120',
      village: 'Dindori',
      district: 'Nashik',
      landSurveyNo: '104/B',
      landAcreage: 6.0,
      password: 'pass'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top National Portal Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  {t('sso_portal_title')}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {t('sso_portal_subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 gap-1.5 mt-5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveTab('farmer_login'); setErrorMsg(''); }}
              className={`py-2 px-2.5 rounded-xl font-semibold transition text-center truncate ${
                activeTab === 'farmer_login'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👨‍🌾 {t('tab_farmer_login')}
            </button>
            <button
              onClick={() => { setActiveTab('farmer_signup'); setErrorMsg(''); }}
              className={`py-2 px-2.5 rounded-xl font-semibold transition text-center truncate ${
                activeTab === 'farmer_signup'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 {t('tab_farmer_signup')}
            </button>
            <button
              onClick={() => { setActiveTab('official_login'); setErrorMsg(''); }}
              className={`py-2 px-2.5 rounded-xl font-semibold transition text-center truncate ${
                activeTab === 'official_login'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 {t('tab_official_login')}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2 animate-shake">
              <span className="font-bold">Error:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: FARMER LOGIN */}
          {activeTab === 'farmer_login' && (
            <form onSubmit={handleFarmerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('mobile_or_kisan_id')}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. 98221 54321 or KCC-MH-2024-88421"
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('security_pin')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter PIN (e.g. kisan123)"
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>Remember this device</span>
                </label>
                <span className="text-emerald-700 hover:underline cursor-pointer font-medium">OTP Login</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{t('enter_portal_btn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Login Preset */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">
                  Demo 1-Click Login:
                </p>
                <button
                  type="button"
                  onClick={autofillDemoFarmer}
                  className="w-full p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      RP
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-950">Rameshwar Pandurang Patil</h4>
                      <p className="text-emerald-800 text-[11px]">Nashik → Satara • Token: A-024</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-700 text-white font-bold rounded-lg text-[10px]">
                    1-Click ⚡
                  </span>
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  New Farmer?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('farmer_signup'); setErrorMsg(''); }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    {t('tab_farmer_signup')}
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: NEW FARMER REGISTRATION */}
          {activeTab === 'farmer_signup' && (
            <form onSubmit={handleFarmerSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('full_name_label')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="e.g. Kishore Baburao Gaikwad"
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('mobile_number_label')}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      placeholder="94231 88120"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('village_label')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.village}
                      onChange={(e) => setSignupData({ ...signupData, village: e.target.value })}
                      placeholder="Dindori, Nashik"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('land_survey_label')}
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupData.landSurveyNo}
                      onChange={(e) => setSignupData({ ...signupData, landSurveyNo: e.target.value })}
                      placeholder="77/2A"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('create_pin_label')}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="e.g. 1234"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('register_btn')}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={autofillNewFarmer}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                >
                  {t('quick_sample_autofill')}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('farmer_login'); setErrorMsg(''); }}
                  className="text-xs text-emerald-700 hover:underline font-bold"
                >
                  Already registered? Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: OFFICIALS LOGIN (OPERATOR & ADMIN) */}
          {activeTab === 'official_login' && (
            <form onSubmit={handleOfficialLogin} className="space-y-4">
              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setOfficialSubRole('operator');
                    setUsername('DOCA-MH-042');
                    setPassword('operator@123');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    officialSubRole === 'operator'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('operator_login_btn')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfficialSubRole('admin');
                    setUsername('admin@doca.gov.in');
                    setPassword('admin@123');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    officialSubRole === 'admin'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('admin_login_btn')}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {officialSubRole === 'operator' ? 'Operator Employee ID / Center Code' : 'DoCA Officer Government Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Security Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authorizing...</span>
                ) : (
                  <>
                    <span>Sign In to {officialSubRole === 'operator' ? 'Mandi Terminal' : 'National Command'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Credentials */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={autofillDemoOperator}
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left text-xs transition"
                >
                  <p className="font-bold text-blue-900">{t('quick_operator_creds')}</p>
                  <p className="text-[10px] text-blue-700">Satara APMC Hub</p>
                </button>
                <button
                  type="button"
                  onClick={autofillDemoAdmin}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left text-xs transition"
                >
                  <p className="font-bold text-emerald-900">{t('quick_admin_creds')}</p>
                  <p className="text-[10px] text-emerald-700">DoCA HQ Director</p>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};