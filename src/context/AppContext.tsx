import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserRole, 
  AuthUser,
  FarmerProfile, 
  ProcurementCenter, 
  CropInfo, 
  BookingToken, 
  SimulatedNotification, 
  SmartRecommendation,
  QCInspection
} from '../types';
import { 
  CROPS_DATA, 
  PROCUREMENT_CENTERS, 
  DEMO_FARMER_PROFILE, 
  INITIAL_BOOKINGS, 
  INITIAL_NOTIFICATIONS, 
  SMART_RECOMMENDATIONS 
} from '../data/mockData';
import { announceTokenSpeech, playMandiChime } from '../utils/audio';
import { estimateWaitTime } from '../utils/calculations';
import { getTranslation, SupportedLanguage } from '../utils/translations';
import { supabaseService } from '../services/supabaseService';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  isMobileEmulation: boolean;
  setIsMobileEmulation: (val: boolean) => void;
  language: 'en' | 'hi' | 'mr' | 'pa';
  setLanguage: (lang: 'en' | 'hi' | 'mr' | 'pa') => void;
  t: (key: string, fallback?: string) => string;
  
  // Data State
  farmerProfile: FarmerProfile;
  setFarmerProfile: (p: FarmerProfile) => void;
  centers: ProcurementCenter[];
  crops: CropInfo[];
  bookings: BookingToken[];
  myActiveToken: BookingToken | null;
  notifications: SimulatedNotification[];
  recommendations: SmartRecommendation[];
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (val: boolean) => void;
  isSecurityMatrixOpen: boolean;
  setIsSecurityMatrixOpen: (val: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (val: boolean) => void;
  updateCenterDetails: (centerId: string, updates: Partial<ProcurementCenter>) => void;
  
  // Authentication State
  isAuthenticated: boolean;
  authUser: AuthUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authIntentRole: UserRole;
  setAuthIntentRole: (role: UserRole) => void;
  openAuthModal: (role?: UserRole) => void;
  login: (credentials: { username: string; password?: string; role: UserRole; name?: string }) => boolean;
  signupFarmer: (farmerData: { name: string; phone: string; village: string; district: string; landSurveyNo: string; landAcreage: number; password?: string }) => void;
  logout: () => void;

  // Interactive Business Logic Actions
  bookNewSlot: (data: {
    centerId: string;
    cropId: string;
    expectedQuintals: number;
    date: string;
    timeSlot: string;
  }) => BookingToken;
  
  checkInFarmerToken: (tokenId: string) => void;
  callTokenToCounter: (tokenId: string, counterNumber?: string) => void;
  startQCAndWeighing: (tokenId: string) => void;
  completeProcurementProcess: (tokenId: string, qc: QCInspection) => void;
  triggerDBTPayment: (tokenId: string) => void;
  markPaymentCompleted: (tokenId: string) => void;
  advanceDemoQueueStep: () => void;
  applyRecommendation: (recId: string) => void;
  addNotification: (title: string, message: string, type?: 'sms' | 'app' | 'system') => void;
  markNotificationAsRead: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('public');
  const [activeView, setActiveView] = useState<string>('landing');
  const [isMobileEmulation, setIsMobileEmulation] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr' | 'pa'>('en');

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(DEMO_FARMER_PROFILE);
  const [centers, setCenters] = useState<ProcurementCenter[]>(PROCUREMENT_CENTERS);
  const [crops] = useState<CropInfo[]>(CROPS_DATA);
  const [bookings, setBookings] = useState<BookingToken[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<SimulatedNotification[]>(INITIAL_NOTIFICATIONS);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>(SMART_RECOMMENDATIONS);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isSecurityMatrixOpen, setIsSecurityMatrixOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Dynamic center detail updater
  const updateCenterDetails = (centerId: string, updates: Partial<ProcurementCenter>) => {
    setCenters(prev => prev.map(c => c.id === centerId ? { ...c, ...updates } : c));
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authIntentRole, setAuthIntentRole] = useState<UserRole>('farmer');

  // Derive demo farmer's active booking (Token A-024)
  const myActiveToken = bookings.find(b => b.farmerId === farmerProfile.id || b.tokenNumber === 'A-024') || bookings[bookings.length - 1] || null;

  // Translation helper function
  const t = (key: string, fallback?: string): string => {
    return getTranslation(key, (language as SupportedLanguage) || 'en') || fallback || key;
  };

  const openAuthModal = (role: UserRole = 'farmer') => {
    setAuthIntentRole(role);
    setIsAuthModalOpen(true);
  };

  const login = (credentials: { username: string; password?: string; role: UserRole; name?: string }): boolean => {
    if (credentials.role === 'farmer') {
      const name = credentials.name || 'Rameshwar Pandurang Patil';
      const user: AuthUser = {
        id: farmerProfile.id,
        name,
        phone: credentials.username || farmerProfile.phone,
        role: 'farmer',
        kisanCardId: farmerProfile.kisanCardId
      };
      setAuthUser(user);
      setIsAuthenticated(true);
      setCurrentRoleState('farmer');
      setActiveView('dashboard');
      setIsAuthModalOpen(false);
      addNotification('Security Verification Success', `Welcome, ${name}! Your farmer account & Token A-024 are verified.`, 'sms');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      return true;
    } else if (credentials.role === 'operator') {
      const user: AuthUser = {
        id: 'op-042',
        name: 'Sanjay Deshmukh (Mandi Incharge)',
        phone: credentials.username || '94220 11029',
        role: 'operator',
        employeeId: 'DOCA-MH-042',
        assignedCenter: 'Shivapur APMC'
      };
      setAuthUser(user);
      setIsAuthenticated(true);
      setCurrentRoleState('operator');
      setActiveView('dashboard');
      setIsAuthModalOpen(false);
      addNotification('Operator Terminal Authenticated', 'Secure access granted to Weighbridge Dispatch & QC Terminal.', 'system');
      return true;
    } else if (credentials.role === 'admin') {
      const user: AuthUser = {
        id: 'admin-doca',
        name: 'Dr. Vivek Sharma (Joint Director, DoCA)',
        phone: credentials.username || 'admin@doca.gov.in',
        role: 'admin',
        employeeId: 'DOCA-HQ-001'
      };
      setAuthUser(user);
      setIsAuthenticated(true);
      setCurrentRoleState('admin');
      setActiveView('overview');
      setIsAuthModalOpen(false);
      addNotification('National Command Authenticated', 'Official DoCA executive telemetry session initiated.', 'system');
      return true;
    }
    return false;
  };

  const signupFarmer = (farmerData: {
    name: string;
    phone: string;
    village: string;
    district: string;
    landSurveyNo: string;
    landAcreage: number;
    password?: string;
  }) => {
    const newProfile: FarmerProfile = {
      ...farmerProfile,
      name: farmerData.name,
      phone: farmerData.phone,
      village: farmerData.village,
      district: farmerData.district,
      landSurveyNo: farmerData.landSurveyNo,
      landAcreage: farmerData.landAcreage,
      kisanCardId: `KCC-MH-2026-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setFarmerProfile(newProfile);
    const user: AuthUser = {
      id: newProfile.id,
      name: newProfile.name,
      phone: newProfile.phone,
      role: 'farmer',
      kisanCardId: newProfile.kisanCardId
    };
    setAuthUser(user);
    setIsAuthenticated(true);
    setCurrentRoleState('farmer');
    setActiveView('dashboard');
    setIsAuthModalOpen(false);
    addNotification('Registration Confirmed', `Kisan ID ${newProfile.kisanCardId} created for ${newProfile.name}. Proceed to book slot.`, 'sms');
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    setCurrentRoleState('public');
    setActiveView('landing');
    addNotification('Session Terminated', 'You have been safely signed out of the portal.', 'system');
  };

  const setCurrentRole = (role: UserRole) => {
    if (role !== 'public' && !isAuthenticated) {
      openAuthModal(role);
      return;
    }
    if (isAuthenticated && authUser && authUser.role !== role && role !== 'public') {
      // User is logged in as one role but attempting to access another role
      openAuthModal(role);
      return;
    }
    setCurrentRoleState(role);
    if (role === 'farmer') {
      setActiveView('dashboard');
    } else if (role === 'operator') {
      setActiveView('dashboard');
    } else if (role === 'admin') {
      setActiveView('overview');
    } else {
      setActiveView('landing');
    }
  };

  const addNotification = (title: string, message: string, type: 'sms' | 'app' | 'system' = 'app') => {
    const newNotif: SimulatedNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // 1. Slot Booking Action
  const bookNewSlot = (data: {
    centerId: string;
    cropId: string;
    expectedQuintals: number;
    date: string;
    timeSlot: string;
  }): BookingToken => {
    const center = centers.find(c => c.id === data.centerId) || centers[0];
    const crop = crops.find(c => c.id === data.cropId) || crops[0];
    
    // Generate next token number e.g. A-027
    const tokenNumber = 'A-024'; // For demo consistency
    const newToken: BookingToken = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      tokenNumber,
      farmerId: farmerProfile.id,
      farmerName: farmerProfile.name,
      farmerPhone: farmerProfile.phone,
      farmerVillage: farmerProfile.village,
      farmerDistrict: farmerProfile.district,
      centerId: center.id,
      centerName: center.name,
      cropId: crop.id,
      cropName: crop.name,
      expectedQuantityQuintals: data.expectedQuintals,
      date: data.date,
      timeSlot: data.timeSlot,
      stage: 'booked',
      queuePosition: 12,
      estimatedWaitMinutes: 35,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      qrTokenPayload: `EKISAN:${tokenNumber}:${center.code}:${data.date}`
    };

    setBookings(prev => {
      const filtered = prev.filter(b => b.tokenNumber !== 'A-024');
      return [...filtered, newToken];
    });

    // Dynamically update center load & queue
    setCenters(prev => prev.map(c => {
      if (c.id === center.id) {
        const newQueue = c.currentQueueCount + 1;
        const newProcured = c.dailyProcuredQuintals + data.expectedQuintals;
        const loadStatus = newProcured > c.dailyCapacityQuintals * 0.9 ? 'high_load' : newProcured > c.dailyCapacityQuintals * 0.7 ? 'busy' : 'normal';
        return {
          ...c,
          currentQueueCount: newQueue,
          dailyProcuredQuintals: newProcured,
          loadStatus
        };
      }
      return c;
    }));

    // Asynchronously sync with Supabase and log security audit
    supabaseService.saveBooking(newToken);
    supabaseService.logAudit(
      farmerProfile.id,
      farmerProfile.name,
      'farmer',
      'BOOK_SLOT',
      `Booked ${data.expectedQuintals} qtl for ${crop.name} at ${center.name} (${data.timeSlot})`
    );

    addNotification(
      'Slot Booked Successfully', 
      `Token ${tokenNumber} allocated for ${data.timeSlot} at ${center.name}.`,
      'sms'
    );

    return newToken;
  };

  // 2. Check-In Action
  const checkInFarmerToken = (tokenId: string) => {
    playMandiChime();
    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(b => {
      if (b.id === tokenId || b.tokenNumber === tokenId) {
        return {
          ...b,
          stage: 'checked_in',
          queuePosition: 8,
          estimatedWaitMinutes: 24,
          checkedInAt: checkInTime
        };
      }
      return b;
    }));

    supabaseService.updateBookingStage(tokenId, 'checked_in', { checkedInAt: checkInTime });
    supabaseService.logAudit(farmerProfile.id, farmerProfile.name, 'farmer', 'GATE_CHECKIN', `Scanned QR at Gate for token ${tokenId}`);

    addNotification(
      'Gate Check-in Successful',
      'Your QR code verified at Gate 2. Current queue position: #8 (Est. 24 mins).',
      'sms'
    );
  };

  // 3. Call Token to Counter Action
  const callTokenToCounter = (tokenId: string, counterNumber: string = 'Counter 2') => {
    let targetToken = 'A-024';
    setBookings(prev => prev.map(b => {
      if (b.id === tokenId || b.tokenNumber === tokenId) {
        targetToken = b.tokenNumber;
        return {
          ...b,
          stage: 'called',
          queuePosition: 0,
          estimatedWaitMinutes: 1,
          counterAssigned: counterNumber,
          calledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return b;
    }));

    announceTokenSpeech(targetToken, counterNumber);

    addNotification(
      `Proceed to ${counterNumber}`,
      `Token ${targetToken}: Please move to ${counterNumber} for electronic weighment and moisture testing.`,
      'sms'
    );
  };

  // 4. Start Weighing & QC Action
  const startQCAndWeighing = (tokenId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === tokenId || b.tokenNumber === tokenId) {
        return {
          ...b,
          stage: 'weighing_qc'
        };
      }
      return b;
    }));
  };

  // 5. Complete Procurement & Issue E-J Form
  const completeProcurementProcess = (tokenId: string, qc: QCInspection) => {
    setBookings(prev => prev.map(b => {
      if (b.id === tokenId || b.tokenNumber === tokenId) {
        return {
          ...b,
          stage: 'procurement_completed',
          qcDetails: qc,
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentDetails: {
            paymentId: `PAY-MH-${Date.now().toString().slice(-5)}`,
            utrNumber: `RBI-PFMS-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
            amount: qc.netPayableAmount,
            status: 'Mandate Initiated',
            bankName: farmerProfile.bankName,
            accountMasked: farmerProfile.accountMasked,
            ifscCode: farmerProfile.ifscCode,
            initiatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pfmsReference: `PFMS/2026/DOCA/${Math.floor(100000 + Math.random() * 900000)}`
          }
        };
      }
      return b;
    }));

    // Trigger celebratory confetti on screen
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Sync QC to Supabase & Log Audit
    supabaseService.saveQCInspection(tokenId, qc);
    supabaseService.updateBookingStage(tokenId, 'procurement_completed', { actualQuantityQuintals: qc.actualQuantityQuintals });
    supabaseService.logAudit(
      'operator',
      qc.inspectorName,
      'operator',
      'ISSUE_EJ_FORM',
      `Issued E-J Form for token ${tokenId}, weight ${qc.actualQuantityQuintals} qtl, net ₹${qc.netPayableAmount}`
    );

    addNotification(
      'Procurement Completed (E-J Form Issued)',
      `Procured: ${qc.actualQuantityQuintals} qtl @ ₹${qc.netRatePerQuintal}/qtl. Total Net Payable: ₹${qc.netPayableAmount.toLocaleString('en-IN')}. DBT mandate triggered.`,
      'sms'
    );
  };

  // 6. Trigger DBT Payment Mandate
  const triggerDBTPayment = (tokenId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === tokenId || b.tokenNumber === tokenId) {
        return {
          ...b,
          stage: 'payment_processing',
          paymentDetails: b.paymentDetails ? {
            ...b.paymentDetails,
            status: 'PFMS Clearing'
          } : undefined
        };
      }
      return b;
    }));

    addNotification(
      'PFMS Payment Processing',
      'DBT payment mandate submitted to RBI Aadhaar Payment Bridge. Clearance expected in < 2 hours.',
      'app'
    );
  };

  // 7. Mark Payment Completed
  const markPaymentCompleted = (tokenId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === tokenId || b.tokenNumber === tokenId) {
        return {
          ...b,
          stage: 'payment_completed',
          paymentDetails: b.paymentDetails ? {
            ...b.paymentDetails,
            status: 'DBT Credited',
            creditedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } : undefined
        };
      }
      return b;
    }));

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    addNotification(
      'DBT Payment Credited (Bank Alert)',
      `₹${myActiveToken?.qcDetails?.netPayableAmount?.toLocaleString('en-IN') || '1,20,750'} successfully credited to A/C ${farmerProfile.accountMasked} via PFMS DBT.`,
      'sms'
    );
  };

  // 8. Auto-advance the Demo Queue (Judge step helper)
  const advanceDemoQueueStep = () => {
    if (!myActiveToken) return;

    if (myActiveToken.stage === 'booked') {
      checkInFarmerToken(myActiveToken.id);
    } else if (myActiveToken.stage === 'checked_in') {
      setBookings(prev => prev.map(b => b.id === myActiveToken.id ? { ...b, queuePosition: 3, estimatedWaitMinutes: 9 } : b));
      addNotification('Queue Update', 'Token A-024 is now 3 positions away. Move to Counter 2 waiting bay.', 'sms');
    } else if (myActiveToken.queuePosition === 3) {
      callTokenToCounter(myActiveToken.id, 'Counter 2');
    } else if (myActiveToken.stage === 'called') {
      startQCAndWeighing(myActiveToken.id);
    } else if (myActiveToken.stage === 'weighing_qc') {
      const defaultQC: QCInspection = {
        moisturePercent: 13.8,
        foreignMatterPercent: 0.6,
        brokenGrainsPercent: 1.0,
        grade: 'Grade A (MSP Premium)',
        baseMspRate: 2320,
        moistureDeductionRate: 0,
        netRatePerQuintal: 2320,
        actualQuantityQuintals: 52.5,
        grossAmount: 121800,
        deductionsAmount: 0,
        netPayableAmount: 121800,
        inspectorName: 'Anil Jadhav (Govt QC Officer)',
        counterNumber: 'Counter 2',
        weighmentSlipNo: 'WB-SHIV-0824',
        inspectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      completeProcurementProcess(myActiveToken.id, defaultQC);
    } else if (myActiveToken.stage === 'procurement_completed') {
      triggerDBTPayment(myActiveToken.id);
    } else if (myActiveToken.stage === 'payment_processing') {
      markPaymentCompleted(myActiveToken.id);
    }
  };

  // 9. Apply Smart Recommendation
  const applyRecommendation = (recId: string) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'applied' } : r));
    setCenters(prev => prev.map(c => {
      if (c.id === 'center-shivapur') {
        return {
          ...c,
          activeCounters: 4,
          avgWaitTimeMinutes: 20,
          loadStatus: 'normal'
        };
      }
      return c;
    }));
    addNotification(
      'Smart Automation Executed',
      'Reserve Counter 4 activated at Shivapur Hub. Average queue wait reduced by 37%.',
      'system'
    );
  };

  // 10. Reset Demo Data
  const resetDemoData = () => {
    setFarmerProfile(DEMO_FARMER_PROFILE);
    setCenters(PROCUREMENT_CENTERS);
    setBookings(INITIAL_BOOKINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setRecommendations(SMART_RECOMMENDATIONS);
    setIsAuthenticated(false);
    setAuthUser(null);
    setCurrentRoleState('public');
    setActiveView('landing');
    addNotification('Demo Data Reset', 'Platform state restored to initial demo benchmark.', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        isMobileEmulation,
        setIsMobileEmulation,
        language,
        setLanguage,
        t,
        farmerProfile,
        setFarmerProfile,
        centers,
        crops,
        bookings,
        myActiveToken,
        notifications,
        recommendations,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isSecurityMatrixOpen,
        setIsSecurityMatrixOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        updateCenterDetails,
        isAuthenticated,
        authUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authIntentRole,
        setAuthIntentRole,
        openAuthModal,
        login,
        signupFarmer,
        logout,
        bookNewSlot,
        checkInFarmerToken,
        callTokenToCounter,
        startQCAndWeighing,
        completeProcurementProcess,
        triggerDBTPayment,
        markPaymentCompleted,
        advanceDemoQueueStep,
        applyRecommendation,
        addNotification,
        markNotificationAsRead,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
