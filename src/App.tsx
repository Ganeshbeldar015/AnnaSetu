import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { ProblemSolutionCompare } from './components/landing/ProblemSolutionCompare';
import { HowItWorks } from './components/landing/HowItWorks';
import { ImpactMetrics } from './components/landing/ImpactMetrics';
import { CenterLocatorPreview } from './components/landing/CenterLocatorPreview';

// Farmer Components
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { SlotBooking } from './components/farmer/SlotBooking';
import { LiveQueueTracker } from './components/farmer/LiveQueueTracker';
import { DigitalCheckIn } from './components/farmer/DigitalCheckIn';
import { PaymentTracker } from './components/farmer/PaymentTracker';
import { RegistrationWizard } from './components/farmer/RegistrationWizard';
import { MobileFrameWrapper } from './components/farmer/MobileFrameWrapper';

// Operator Components
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { LiveQueueManager } from './components/operator/LiveQueueManager';
import { ProcurementQCTerminal } from './components/operator/ProcurementQCTerminal';
import { CenterCapacityControl } from './components/operator/CenterCapacityControl';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GeospatialCenterMap } from './components/admin/GeospatialCenterMap';
import { AnalyticsCharts } from './components/admin/AnalyticsCharts';
import { SmartAutomationHub } from './components/admin/SmartAutomationHub';
import { ReportsGenerator } from './components/admin/ReportsGenerator';

import { RoleGuard } from './components/common/RoleGuard';

// Navigation Icons (powered by react-icons)
import { 
  Home, 
  Calendar, 
  Clock, 
  QrCode, 
  CreditCard, 
  User, 
  Building2, 
  Radio, 
  Scale, 
  Sliders, 
  BarChart3, 
  FileSpreadsheet, 
  Cpu, 
  MapPin, 
  Globe,
  Sparkles,
  ShieldCheck
} from './components/common/Icons';

export const App: React.FC = () => {
  const { currentRole, activeView, setActiveView, isMobileEmulation, t } = useApp();

  // Sub-Navigation tabs for each role
  const renderRoleSubNav = () => {
    if (currentRole === 'public') {
      return (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 sm:space-x-6 overflow-x-auto py-2 text-xs font-semibold text-slate-600">
              {[
                { key: 'landing', label: t('tab_overview', 'Portal Overview') },
                { key: 'compare', label: t('tab_compare', 'Traditional vs. e-Kisan') },
                { key: 'how_it_works', label: t('tab_how_it_works', '5-Step Workflow') },
                { key: 'impact', label: t('tab_impact', 'Impact & Metrics') },
                { key: 'centers', label: t('tab_centers', 'Mandi Center Network') }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveView(tab.key)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                    activeView === tab.key
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentRole === 'farmer' && !isMobileEmulation) {
      return (
        <div className="bg-emerald-900 text-white border-b border-emerald-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2 text-xs font-semibold">
              {[
                { key: 'dashboard', label: t('nav_dashboard', 'Dashboard'), icon: Home },
                { key: 'book_slot', label: t('nav_book_slot', 'Book Slot'), icon: Calendar },
                { key: 'live_queue', label: t('nav_live_queue', 'Live Queue'), icon: Clock },
                { key: 'check_in', label: t('nav_gate_checkin', 'Gate Check-In'), icon: QrCode },
                { key: 'payments', label: t('nav_payments', 'DBT Payments'), icon: CreditCard },
                { key: 'register', label: t('nav_profile', 'Farmer Profile'), icon: User }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveView(tab.key)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                      activeView === tab.key
                        ? 'bg-emerald-700 text-white font-bold shadow'
                        : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (currentRole === 'operator') {
      return (
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2 text-xs font-semibold">
              {[
                { key: 'dashboard', label: t('nav_op_overview', 'Station Overview'), icon: Building2 },
                { key: 'live_queue', label: t('nav_op_queue', 'Live Queue Dispatch'), icon: Radio },
                { key: 'weighment_terminal', label: t('nav_op_qc', 'Moisture QC & Weighing'), icon: Scale },
                { key: 'capacity_control', label: t('nav_op_capacity', 'Surge Capacity Gatekeeper'), icon: Sliders }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveView(tab.key)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                      activeView === tab.key
                        ? 'bg-blue-700 text-white font-bold shadow'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (currentRole === 'admin') {
      return (
        <div className="bg-slate-950 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2 text-xs font-semibold">
              {[
                { key: 'overview', label: t('nav_admin_overview', 'National Command'), icon: ShieldCheck },
                { key: 'geospatial_map', label: t('nav_admin_map', 'Geospatial Mandi Map'), icon: MapPin },
                { key: 'analytics', label: t('nav_admin_analytics', 'Analytics & SLAs'), icon: BarChart3 },
                { key: 'smart_automation', label: t('nav_admin_automation', 'Smart Automation Hub'), icon: Cpu },
                { key: 'reports', label: t('nav_admin_reports', 'Official Reports & CSV'), icon: FileSpreadsheet }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveView(tab.key)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                      activeView === tab.key
                        ? 'bg-emerald-700 text-white font-bold shadow'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Main View Content Renderer
  const renderMainContent = () => {
    // PUBLIC ROLE
    if (currentRole === 'public') {
      if (activeView === 'compare') {
        return (
          <div className="py-8">
            <ProblemSolutionCompare />
          </div>
        );
      }
      if (activeView === 'how_it_works') {
        return (
          <div className="py-8">
            <HowItWorks />
          </div>
        );
      }
      if (activeView === 'impact') {
        return (
          <div className="py-8">
            <ImpactMetrics />
          </div>
        );
      }
      if (activeView === 'centers') {
        return (
          <div className="py-8">
            <CenterLocatorPreview />
          </div>
        );
      }
      return (
        <div>
          <HeroSection />
          <ProblemSolutionCompare />
          <HowItWorks />
          <ImpactMetrics />
          <CenterLocatorPreview />
        </div>
      );
    }

    // FARMER ROLE
    if (currentRole === 'farmer') {
      const farmerContent = (() => {
        switch (activeView) {
          case 'book_slot':
            return <SlotBooking />;
          case 'live_queue':
            return <LiveQueueTracker />;
          case 'check_in':
            return <DigitalCheckIn />;
          case 'payments':
            return <PaymentTracker />;
          case 'register':
            return <RegistrationWizard />;
          case 'dashboard':
          default:
            return <FarmerDashboard />;
        }
      })();

      return (
        <RoleGuard requiredRole="farmer">
          <MobileFrameWrapper>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {farmerContent}
            </div>
          </MobileFrameWrapper>
        </RoleGuard>
      );
    }

    // OPERATOR ROLE
    if (currentRole === 'operator') {
      return (
        <RoleGuard requiredRole="operator">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {(() => {
              switch (activeView) {
                case 'live_queue':
                  return <LiveQueueManager />;
                case 'weighment_terminal':
                  return <ProcurementQCTerminal />;
                case 'capacity_control':
                  return <CenterCapacityControl />;
                case 'dashboard':
                default:
                  return <OperatorDashboard />;
              }
            })()}
          </div>
        </RoleGuard>
      );
    }

    // ADMIN ROLE
    if (currentRole === 'admin') {
      return (
        <RoleGuard requiredRole="admin">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {(() => {
              switch (activeView) {
                case 'geospatial_map':
                  return <GeospatialCenterMap />;
                case 'analytics':
                  return <AnalyticsCharts />;
                case 'smart_automation':
                  return <SmartAutomationHub />;
                case 'reports':
                  return <ReportsGenerator />;
                case 'overview':
                default:
                  return <AdminDashboard />;
              }
            })()}
          </div>
        </RoleGuard>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Gov Header & 1-Click Role Switcher */}
      <Header />

      {/* Role-Specific Sub Navigation */}
      {renderRoleSubNav()}

      {/* Main Page Content */}
      <main className="flex-1">
        {renderMainContent()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Simulated SMS & Push Alerts Drawer */}
      <NotificationDrawer />

      {/* Secure Authentication & Single Sign-On Modal */}
      <AuthModal />
    </div>
  );
};
