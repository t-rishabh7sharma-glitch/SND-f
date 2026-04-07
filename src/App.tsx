import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MapPin, 
  Navigation, 
  ClipboardList, 
  BarChart3, 
  Activity,
  ArrowRightLeft,
  RefreshCw, 
  LogOut, 
  User, 
  Users,
  Map,
  ShieldAlert,
  FileText,
  Lock, 
  ChevronRight, 
  Menu, 
  X, 
  Wifi, 
  WifiOff, 
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Camera,
  Send,
  Clock,
  ArrowUpRight,
  Trophy,
  ChevronLeft,
  Server,
  Shield,
  Smartphone,
  Database,
  Wallet
} from 'lucide-react';

// Types
import { UserRole, User as UserType, Outlet, VisitData, AseStatus, Exception } from './types';

// Components
import AseDashboard from './components/ase/AseDashboard';
import DailyPlan from './components/ase/DailyPlan';
import VisitModule from './components/ase/VisitModule';
import KpiModule from './components/ase/KpiModule';
import EodModule from './components/ase/EodModule';
import AseWallet from './components/ase/AseWallet';

// TL Components
import TlDashboard from './components/tl/TlDashboard';
import LiveMap from './components/tl/LiveMap';
import ExceptionReview from './components/tl/ExceptionReview';
import VisitValidation from './components/tl/VisitValidation';
import TeamKpis from './components/tl/TeamKpis';
import DailySignoff from './components/tl/DailySignoff';
import TeamReports from './components/tl/TeamReports';

// TDR Components (consolidated 6→3 tabs)
import TerritoryCommand from './components/tdr/TerritoryCommand';
import TeamOversight from './components/tdr/TeamOversight';
import ReportingEngine from './components/tdr/ReportingEngine';

// ZBM Components (consolidated 6→3 tabs)
import ZonalOverview from './components/zbm/ZonalOverview';
import KpiAnalytics from './components/zbm/KpiAnalytics';
import ExecutiveReports from './components/zbm/ExecutiveReports';

// Rebalancer Components
import RebalancerDashboard from './components/rebalancer/RebalancerDashboard';
import AgentLiquidity from './components/rebalancer/AgentLiquidity';
import AgentAudit from './components/rebalancer/AgentAudit';
import SecureTransfer from './components/rebalancer/SecureTransfer';
import RebalancerReports from './components/rebalancer/RebalancerReports';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import RolePermissions from './components/admin/RolePermissions';
import InventoryManagement from './components/admin/InventoryManagement';
import AuditLog from './components/admin/AuditLog';

// --- Mock Data ---

const MOCK_OUTLETS: Outlet[] = [
  { id: 'ZM-101', name: 'Lusaka Central Agent', address: 'Cairo Road, Lusaka', category: 'Agent', distance: '48m', status: 'Next', lat: -15.4167, lng: 28.2833 },
  { id: 'ZM-102', name: 'Kabwe Retail Hub', address: 'Independence Ave, Kabwe', category: 'Retail', distance: '1.2km', status: 'Planned', lat: -14.4469, lng: 28.4464 },
  { id: 'ZM-103', name: 'Copperbelt MoMo', address: 'President Ave, Ndola', category: 'Mobile Money', distance: '2.5km', status: 'Planned', lat: -12.9608, lng: 28.6366 },
  { id: 'ZM-104', name: 'Kitwe Plaza Shop', address: 'Oxford St, Kitwe', category: 'Retail', distance: '3.1km', status: 'Planned', lat: -12.8167, lng: 28.2 },
  { id: 'ZM-105', name: 'Livingstone Gateway', address: 'Mosi-oa-Tunya Rd', category: 'Agent', distance: '4.5km', status: 'Planned', lat: -17.85, lng: 25.85 },
  { id: 'ZM-106', name: 'Chipata East Agent', address: 'Great East Rd, Chipata', category: 'Agent', distance: '5.2km', status: 'Planned', lat: -13.6333, lng: 32.65 },
  { id: 'ZM-107', name: 'Kasama North Retail', address: 'Mbala Rd, Kasama', category: 'Retail', distance: '6.1km', status: 'Planned', lat: -10.2128, lng: 31.1808 },
  { id: 'ZM-108', name: 'Mansa Central', address: 'Chitambo St, Mansa', category: 'Mobile Money', distance: '7.3km', status: 'Planned', lat: -11.1997, lng: 28.8943 },
];

const MOCK_ASE_STATUSES: AseStatus[] = [
  { id: 'ASE-20241', name: 'Mwape Banda', progress: 85, status: 'Active', lastCheckIn: '10:45 AM', currentOutlet: 'Lusaka Central Agent', exceptions: 0, visitsToday: 8, visitsTarget: 10, simsToday: 21, simsTarget: 20 },
  { id: 'ASE-20242', name: 'Chisomo Kunda', progress: 65, status: 'Active', lastCheckIn: '11:15 AM', currentOutlet: 'Bright Cash Agent', exceptions: 0, visitsToday: 7, visitsTarget: 10, simsToday: 14, simsTarget: 20 },
  { id: 'ASE-20243', name: 'Priya Nambwe', progress: 45, status: 'Active', lastCheckIn: '10:15 AM', currentOutlet: 'Kabwe Retail Hub', exceptions: 1, visitsToday: 5, visitsTarget: 10, simsToday: 9, simsTarget: 20 },
  { id: 'ASE-20244', name: 'Tiza Mwale', progress: 30, status: 'Active', lastCheckIn: '10:38 AM', currentOutlet: 'Copperbelt MoMo', exceptions: 1, visitsToday: 3, visitsTarget: 10, simsToday: 6, simsTarget: 20 },
  { id: 'ASE-20245', name: 'Brian Nkosi', progress: 20, status: 'Active', lastCheckIn: '10:42 AM', currentOutlet: 'Cairo Road Mall', exceptions: 1, visitsToday: 2, visitsTarget: 10, simsToday: 4, simsTarget: 20 },
  { id: 'ASE-20246', name: 'Lweendo Phiri', progress: 100, status: 'Completed', lastCheckIn: '04:30 PM', exceptions: 0, visitsToday: 10, visitsTarget: 10, simsToday: 25, simsTarget: 20 },
  { id: 'ASE-20247', name: 'Namukolo Siame', progress: 0, status: 'Offline', exceptions: 0, visitsToday: 0, visitsTarget: 10, simsToday: 0, simsTarget: 20 },
  { id: 'ASE-20248', name: 'Chanda Mutale', progress: 0, status: 'Offline', exceptions: 0, visitsToday: 0, visitsTarget: 10, simsToday: 0, simsTarget: 20 },
];

const MOCK_EXCEPTIONS: Exception[] = [
  { id: 'EX-1', aseId: 'ASE-20245', aseName: 'Brian Nkosi', type: 'Geo-fence Violation', severity: 'High', timestamp: '10:42 AM', details: '3.2km outside assigned territory at Cairo Road Mall', status: 'Pending', outletName: 'Cairo Road Mall' },
  { id: 'EX-2', aseId: 'ASE-20244', aseName: 'Tiza Mwale', type: 'Route Deviation', severity: 'Medium', timestamp: '10:38 AM', details: '28% off planned route near Copperbelt MoMo', status: 'Pending', outletName: 'Copperbelt MoMo' },
  { id: 'EX-3', aseId: 'ASE-20243', aseName: 'Priya Nambwe', type: 'Missed Visit', severity: 'Low', timestamp: '10:15 AM', details: 'No check-in at Kabwe Retail Hub within planned window', status: 'Pending', outletName: 'Kabwe Retail Hub' },
];

const MOCK_VISIT_VALIDATION: VisitData & { aseName: string; outlet: Outlet } = {
  outletId: 'ZM-101',
  aseName: 'Mwape Banda',
  outlet: MOCK_OUTLETS[0],
  checkInTime: '10:45:12 AM',
  purpose: ['Float & cash check', 'SIM registrations', 'Prospecting'],
  simsRegistered: 3,
  floatAmount: 1250,
  cashAdequate: true,
  brandingCompliant: 'Yes',
  pricingCompliant: true,
  photoCaptured: true,
  manualLocation: false,
  competitors: ['MTN', 'Airtel'],
  productPitched: 'MoMo Agent Account',
  customerType: 'Retailer',
  interestLevel: 'High',
  contactDetails: '0977123456',
  notes: 'Agent is performing well. Branding is visible and float is adequate. Pitched MoMo Agent account to nearby retailer.',
};

// --- App Component ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [outlets, setOutlets] = useState<Outlet[]>(MOCK_OUTLETS);
  const [activeVisit, setActiveVisit] = useState<Outlet | null>(null);
  const [aseStatuses, setAseStatuses] = useState<AseStatus[]>(MOCK_ASE_STATUSES);
  const [exceptions, setExceptions] = useState<Exception[]>(MOCK_EXCEPTIONS);
  const [selectedAse, setSelectedAse] = useState<AseStatus | null>(null);
  const [selectedAseForValidation, setSelectedAseForValidation] = useState<AseStatus | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loginId, setLoginId] = useState('');
  const [missedVisitLogs, setMissedVisitLogs] = useState<{ outletName: string; aseName: string; reason: string; notes: string; time: string }[]>([
    { outletName: 'Kabwe Retail Hub', aseName: 'Priya Nambwe', reason: 'Outlet Closed', notes: 'Shutters down, called agent no answer.', time: '10:15 AM' },
    { outletName: 'Mansa Central MoMo', aseName: 'Tiza Mwale', reason: 'Agent Unavailable', notes: 'Agent travelling. Will reschedule tomorrow.', time: '11:30 AM' },
  ]);

  // Session KPIs tracking for 0-based Daily Tasks
  const [sessionKpis, setSessionKpis] = useState({
    visits: 0,
    grossAdditions: 0,
    agentActivation: 0,
    floatChecks: 0,
  });

  const [showProfile, setShowProfile] = useState(false);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = loginId.trim().toUpperCase();
    setIsAuthenticated(true);
    const commonFields = {
      region: 'Lusaka Province',
      territory: 'Lusaka Central',
    };

    if (id.startsWith('TL')) {
      setUser({ 
        id: 'TL-10032', 
        name: 'Brian Phiri', 
        email: 'brian.phiri@zamtel.zm',
        role: 'TL', 
        ...commonFields,
        territory: 'Lusaka East' 
      });
      setActiveView('dashboard');
      setToast({ message: 'TL Portal accessed. Team sync complete.', type: 'success' });
    } else if (id.startsWith('TDR')) {
      setUser({ 
        id: 'TDR-30041', 
        name: 'Sarah Mwale', 
        email: 'sarah.mwale@zamtel.zm',
        role: 'TDR', 
        ...commonFields,
        territory: 'Lusaka East' 
      });
      setActiveView('dashboard');
      setToast({ message: 'TDR Command Center active. Territory sync complete.', type: 'success' });
    } else if (id.startsWith('ZBM')) {
      setUser({ 
        id: 'ZBM-50004', 
        name: 'Executive Director', 
        email: 'exec.dir@zamtel.zm',
        role: 'ZBM', 
        ...commonFields,
        territory: 'Zambia South Zone' 
      });
      setActiveView('dashboard');
      setToast({ message: 'Zonal Command Center active. Executive sync complete.', type: 'success' });
    } else if (id.startsWith('REB')) {
      setUser({ 
        id: 'REB-70012', 
        name: 'John Rebalancer', 
        email: 'john.r@zamtel.zm',
        role: 'REBALANCER', 
        ...commonFields,
        territory: 'Lusaka CBD' 
      });
      setActiveView('dashboard');
      setToast({ message: 'Rebalancer Dashboard active. Secure session initiated.', type: 'success' });
    } else if (id.startsWith('ADMIN')) {
      setUser({ 
        id: 'ADMIN-00001', 
        name: 'System Admin', 
        email: 'admin@zamtel.zm',
        role: 'ADMIN', 
        ...commonFields,
        territory: 'Global' 
      });
      setActiveView('dashboard');
      setToast({ message: 'IT Admin Control Center active. God mode enabled.', type: 'success' });
    } else if (id.startsWith('ASE')) {
      setUser({ 
        id: 'ASE-20241', 
        name: 'Mwape Banda', 
        email: 'mwape.banda@zamtel.zm',
        role: 'ASE', 
        ...commonFields 
      });
      setActiveView('plan');
      setToast({ message: 'Login successful. GPS tracking active.', type: 'success' });
    } else {
      // Default: ASE login for demo
      setUser({ 
        id: 'ASE-20241', 
        name: 'Mwape Banda', 
        email: 'mwape.banda@zamtel.zm',
        role: 'ASE', 
        ...commonFields 
      });
      setActiveView('plan');
      setToast({ message: 'Login successful. GPS tracking active.', type: 'success' });
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('dashboard');
  };

  // Visit Submission
  const handleVisitSubmit = (data: VisitData) => {
    const isMissed = !!data.reasonForMissedVisit;
    const outletName = outlets.find(o => o.id === data.outletId)?.name || data.outletId;
    setOutlets(prev => prev.map(o => o.id === data.outletId ? { ...o, status: isMissed ? 'Missed' : 'Visited' } : o));
    if (isMissed) {
      setMissedVisitLogs(prev => [{
        outletName,
        aseName: user?.name || 'Unknown ASE',
        reason: data.reasonForMissedVisit || 'Other',
        notes: data.notes || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }, ...prev]);
    } else {
      // Valid visit => increment session actuals
      const purposes = data.purpose || [];
      setSessionKpis(prev => ({
        visits: prev.visits + 1,
        grossAdditions: prev.grossAdditions + (data.simsRegistered || 0),
        agentActivation: prev.agentActivation + (purposes.includes('Agent recruitment') ? 1 : 0),
        floatChecks: prev.floatChecks + (purposes.includes('Float & cash check') ? 1 : 0),
      }));
    }
    setActiveVisit(null);
    setToast({ 
      message: isMissed ? 'Missed visit logged & reported to TL.' : 'Visit submitted successfully.', 
      type: 'success' 
    });
    setActiveView('dashboard');
  };

  // EOD Sync
  const handleEodSync = () => {
    setToast({ message: 'Submitting End-of-Day Summary...', type: 'success' });
    setTimeout(() => {
      setToast({ message: 'EOD Summary Submitted. All data synced successfully.', type: 'success' });
      setTimeout(() => handleLogout(), 1500);
    }, 1500);
  };

  const handleExceptionAction = (id: string, action: string) => {
    setToast({ message: `Exception ${id} ${action.toLowerCase()}ed.`, type: 'success' });
    setExceptions(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSignOff = () => {
    setToast({ message: 'Daily sign-off submitted to ZBM.', type: 'success' });
    setTimeout(() => handleLogout(), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md card-base p-8 lg:p-12 space-y-8 shadow-2xl"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-lg">
              <Navigation size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold font-display text-primary leading-tight">ZAMTEL</h1>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sales & Distribution CRM</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Employee ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input 
                  required
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g., ASE-20241 or TL-10032"
                  className="w-full bg-surface-container border-none rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-surface-container border-none rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="btn btn-primary w-full py-4 shadow-xl text-lg font-bold bg-primary hover:bg-primary-dark"
            >
              Sign In
            </button>
            <p className="text-[10px] text-center text-on-surface-variant font-semibold">
              <AlertTriangle size={12} className="inline mr-1 text-rag-amber" />
              GPS and Time tracking will be auto-detected upon login.
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  const desktopNavItems = user?.role === 'TL' ? [
    { id: 'dashboard', label: 'Team Overview', icon: <Users size={20} /> },
    { id: 'map', label: 'Live Map View', icon: <Map size={20} /> },
    { id: 'exceptions', label: 'Exception Review', icon: <ShieldAlert size={20} /> },
    { id: 'validation', label: 'Visit Validation', icon: <CheckCircle2 size={20} /> },
    { id: 'kpis', label: 'Team KPIs', icon: <BarChart3 size={20} /> },
    { id: 'reports', label: 'Reports', icon: <ClipboardList size={20} /> },
    { id: 'signoff', label: 'Daily Sign-off', icon: <Send size={20} /> },
  ] : user?.role === 'TDR' ? [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
    { id: 'operations', label: 'Operations', icon: <Users size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
  ] : user?.role === 'ZBM' ? [
    { id: 'dashboard', label: 'Zonal Command', icon: <LayoutDashboard size={20} /> },
    { id: 'analytics', label: 'Deep Analytics', icon: <TrendingUp size={20} /> },
    { id: 'reports', label: 'Executive Reports', icon: <FileText size={20} /> },
  ] : user?.role === 'REBALANCER' ? [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
    { id: 'liquidity', label: 'Agent Liquidity', icon: <Users size={20} /> },
    { id: 'audit', label: 'Agent Audit', icon: <ClipboardList size={20} /> },
    { id: 'transfer', label: 'Secure Transfer', icon: <ArrowRightLeft size={20} /> },
    { id: 'reports', label: 'Daily Logs', icon: <FileText size={20} /> },
  ] : user?.role === 'ADMIN' ? [
    { id: 'dashboard', label: 'Control Center', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Users & Access', icon: <Users size={20} /> },
    { id: 'roles', label: 'RBAC Matrix', icon: <Shield size={20} /> },
    { id: 'inventory', label: 'Inventory (Ref)', icon: <Server size={20} /> },
    { id: 'audit', label: 'Audit Log', icon: <FileText size={20} /> },
  ] : [
    { id: 'plan', label: 'Your Task', icon: <ClipboardList size={20} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'kpis', label: 'Performance', icon: <BarChart3 size={20} /> },
    { id: 'eod', label: 'EOD Sync', icon: <RefreshCw size={20} /> },
    { id: 'wallet', label: 'Wallet & Float', icon: <Wallet size={20} /> },
    { id: 'route', label: 'Route & Visit', icon: <MapPin size={20} /> },
  ];

  const mobileNavItems = desktopNavItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row text-on-surface font-sans selection:bg-primary/20">
      {/* Sidebar - Desktop Only */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? '280px' : '80px' }}
        className="hidden lg:flex bg-surface-container-lowest border-r border-black/5 flex-col h-screen sticky top-0 z-40"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl shrink-0 flex items-center justify-center text-white shadow-lg">
            <Navigation size={20} />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-extrabold text-primary text-xl">
              ZAMTEL
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {desktopNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative group ${
                activeView === item.id ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              {activeView === item.id && (
                <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3.5 rounded-xl text-rag-red hover:bg-rag-red-bg transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav - Static 4 items */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-black/5 z-50 px-4 py-1 flex items-center h-20 justify-around">
        {mobileNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full rounded-2xl transition-all ${
              activeView === item.id ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <div className={`transition-all duration-300 ${activeView === item.id ? 'bg-primary/10 p-2 rounded-xl scale-110' : 'p-1'}`}>
              {React.cloneElement(item.icon as React.ReactElement, { size: activeView === item.id ? 22 : 20 })}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-all ${activeView === item.id ? 'opacity-100 scale-105' : 'opacity-60'}`}>
              {item.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-16 lg:pb-0">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-surface-container-lowest border-b border-black/5 px-4 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-2 hover:bg-surface-container rounded-xl transition-colors">
              <Menu size={20} />
            </button>
            <div className="lg:hidden w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
              <Navigation size={16} />
            </div>
            <div>
              <div className="text-[8px] lg:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-0.5">Active Territory</div>
              <div className="text-xs lg:text-sm font-bold truncate max-w-[120px] lg:max-w-none">{user?.territory}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <button 
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1.5 px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-bold transition-all ${
                isOffline ? 'bg-rag-amber-bg text-rag-amber' : 'bg-rag-green-bg text-rag-green'
              }`}
            >
              {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
              <span className="hidden xs:inline">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </button>

            {!isOffline && (
              <div className="flex items-center gap-1.5 text-rag-green">
                <RefreshCw size={12} className="animate-spin" />
                <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest">Synced</span>
              </div>
            )}
            
            <div className="hidden sm:block w-px h-6 lg:h-8 bg-black/5" />
            
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs lg:text-sm font-bold">{user?.name}</div>
                <div className="text-[8px] lg:text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest">{user?.role}</div>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 text-xs lg:text-base hover:bg-primary/20 transition-all cursor-pointer"
              >
                {user?.name.split(' ').map(n => n[0]).join('')}
              </button>
              <button onClick={handleLogout} className="lg:hidden p-2 text-rag-red hover:bg-rag-red-bg rounded-lg">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ── Dynamic Profile Modal for all roles ── */}
        <AnimatePresence>
          {showProfile && user && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowProfile(false)}>
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm mt-4 mx-4 overflow-hidden rounded-2xl shadow-2xl"
              >
                {/* Banner */}
                <div className="bg-primary pt-8 pb-12 px-6 text-center relative">
                  <button onClick={() => setShowProfile(false)} className="absolute top-3 right-3 text-white/60 hover:text-white p-1"><X size={18} /></button>
                  <div className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">ZAMTEL ZAMBIA</div>
                  <div className="text-white text-xs font-bold">My Profile</div>
                </div>

                {/* Avatar */}
                <div className="bg-white relative">
                  <div className="flex justify-center -mt-10">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-black text-primary">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center pt-3 pb-4 px-6">
                    <h3 className="text-lg font-black">{user.name}</h3>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{user.id} · {
                      user.role === 'ASE' ? 'Area Sales Exec' : 
                      user.role === 'TL' ? 'Team Leader' : 
                      user.role === 'TDR' ? 'Territory Manager' : 
                      user.role === 'ZBM' ? 'Zonal Manager' : 
                      user.role === 'REBALANCER' ? 'Liquidity Rebalancer' : 'System Admin'
                    }</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full">{user.role}</span>
                      <span className="px-3 py-1 bg-rag-green-bg text-rag-green text-[9px] font-black uppercase rounded-full">Active</span>
                    </div>
                  </div>

                  {/* Info Table */}
                  <div className="mx-5 mb-4 border border-black/5 rounded-xl overflow-hidden">
                    {(() => {
                      let profileData = [];
                      if (user.role === 'TL') {
                        profileData = [
                          { label: 'Region', value: user.region },
                          { label: 'Territory', value: user.territory },
                          { label: 'TDR Manager', value: 'Sarah Mwale' },
                          { label: 'Active ASEs', value: '6 / 6', highlight: true },
                          { label: 'System status', value: 'Active', badge: true },
                        ];
                      } else if (user.role === 'TDR') {
                        profileData = [
                          { label: 'Zone', value: 'Zambia South' },
                          { label: 'Territory', value: user.territory },
                          { label: 'ZBM', value: 'Executive Director' },
                          { label: 'Team Leaders', value: '4 Active', highlight: true },
                          { label: 'System status', value: 'Active', badge: true },
                        ];
                      } else if (user.role === 'ZBM') {
                        profileData = [
                          { label: 'Zone', value: user.territory },
                          { label: 'Country Dir.', value: 'Jane Doe' },
                          { label: 'TDRs Managed', value: '12 Active', highlight: true },
                          { label: 'System status', value: 'Active', badge: true },
                        ];
                      } else if (user.role === 'REBALANCER') {
                        profileData = [
                          { label: 'Region', value: user.region },
                          { label: 'Coverage Area', value: user.territory },
                          { label: 'Cash Carried', value: 'ZMW 500k', highlight: true },
                          { label: 'Security', value: 'Cleared', badge: true },
                        ];
                      } else if (user.role === 'ADMIN') {
                        profileData = [
                          { label: 'Access Level', value: 'God Mode' },
                          { label: 'Last Login', value: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
                          { label: 'System Load', value: '23%', highlight: true },
                          { label: 'Server status', value: 'Online', badge: true },
                        ];
                      } else {
                        // ASE Default
                        profileData = [
                          { label: 'Region', value: user.region },
                          { label: 'Cluster', value: user.territory || 'Lusaka Central' },
                          { label: 'Team Leader', value: 'Brian Phiri' },
                          { label: 'Date', value: new Date().toLocaleDateString('en-GB'), highlight: true },
                          { label: 'GPS status', value: 'Active', badge: true },
                        ];
                      }

                      return profileData.map((row, i) => (
                        <div key={i} className={`flex justify-between items-center px-4 py-3 ${i > 0 ? 'border-t border-black/5' : ''}`}>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{row.label}</span>
                          {row.badge ? (
                            <span className="px-2 py-0.5 bg-rag-green-bg text-rag-green text-[9px] font-black rounded-full uppercase">Active</span>
                          ) : (
                            <span className={`text-xs font-black ${row.highlight ? 'text-primary' : ''}`}>{row.value}</span>
                          )}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 space-y-2">
                    <button
                      onClick={() => { setShowProfile(false); setActiveView(user.role === 'ASE' ? 'plan' : 'dashboard'); }}
                      className="w-full py-3.5 bg-white border-2 border-black/10 rounded-xl text-sm font-black hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      {user.role === 'ASE' ? "View today's plan" : "Go to Dashboard"} <ChevronRight size={16} />
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => { setShowProfile(false); setActiveView(user.role === 'ASE' || user.role === 'TL' ? 'kpis' : 'reports'); }}
                        className="w-full py-3.5 bg-white border-2 border-black/10 rounded-xl text-sm font-black hover:border-primary/30 transition-all"
                      >
                        {user.role === 'ASE' || user.role === 'TL' ? "My KPIs" : "View Reports"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            {/* ASE Views */}
            {user?.role === 'ASE' && (
              <>
                {activeView === 'dashboard' && (
                  <AseDashboard 
                    key="dashboard" 
                    outlets={outlets} 
                    onCheckIn={(o) => {
                      setOutlets(prev => prev.map(outlet => outlet.id === o.id ? { ...outlet, status: 'Visited' as const } : outlet));
                      setToast({ message: `Visit completed: ${o.name}`, type: 'success' });
                    }} 
                    onEodSync={() => setActiveView('eod')}
                    user={user}
                    sessionKpis={sessionKpis}
                  />
                )}
                {activeView === 'wallet' && <AseWallet key="wallet" />}
                {activeView === 'plan' && (
                  <DailyPlan 
                    key="plan" 
                    outlets={outlets} 
                    onCheckIn={(o) => {
                      setOutlets(prev => prev.map(outlet => outlet.id === o.id ? { ...outlet, status: 'Visited' as const } : outlet));
                      setToast({ message: `Visit completed: ${o.name}`, type: 'success' });
                    }}
                    onAction={(msg) => setToast({ message: msg, type: 'success' })}
                    userId={user?.id}
                    sessionKpis={sessionKpis}
                  />
                )}
                {activeView === 'route' && (
                  <div key="route" className="space-y-8">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h1 className="text-2xl lg:text-3xl mb-1">Route & Check-In</h1>
                        <p className="text-on-surface-variant text-sm">Select an outlet to begin validation</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="card-base p-8 space-y-6">
                        <h2 className="text-lg">Nearby Outlets</h2>
                        <div className="space-y-4">
                          {outlets.filter(o => o.status !== 'Visited').map((o, i) => (
                            <div 
                              key={i} 
                              onClick={() => setActiveVisit(o)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                                activeVisit?.id === o.id ? 'border-primary bg-primary/5' : 'border-black/5 bg-surface-container-low hover:border-primary/30'
                              }`}
                            >
                              <div>
                                <div className="font-bold text-sm">{o.name}</div>
                                <div className="text-[10px] text-on-surface-variant font-semibold">{o.address}</div>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-[9px] font-bold px-2 py-0.5 bg-surface-container rounded-full">{o.category}</span>
                                  <span className="text-[9px] font-bold text-on-surface-variant">{o.distance}</span>
                                </div>
                              </div>
                              <ChevronRight size={20} className={activeVisit?.id === o.id ? 'text-primary' : 'text-on-surface-variant/40'} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card-base p-0 overflow-hidden min-h-[400px] relative">
                        <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
                          <div className="text-center p-8">
                            <Navigation size={48} className="text-primary/20 mx-auto mb-4" />
                            <h3 className="text-on-surface-variant">Route Navigation Widget</h3>
                            <p className="text-xs text-on-surface-variant/60">Select an outlet to see route details</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeView === 'kpis' && <KpiModule key="kpis" sessionKpis={sessionKpis} />}
                {activeView === 'eod' && <EodModule key="eod" onSync={handleEodSync} isOffline={isOffline} />}
              </>
            )}

            {/* TL Views */}
            {user?.role === 'TL' && (
              <>
                {activeView === 'dashboard' && (
                  <TlDashboard 
                    key="tl-dashboard" 
                    aseStatuses={aseStatuses} 
                    onSelectAse={(ase) => { setSelectedAseForValidation(ase); setActiveView('validation'); }} 
                    onSignOff={() => setActiveView('signoff')}
                    missedVisitLogs={missedVisitLogs}
                  />
                )}
                {activeView === 'map' && <LiveMap key="tl-map" aseStatuses={aseStatuses} />}
                {activeView === 'exceptions' && (
                  <ExceptionReview 
                    key="tl-exceptions" 
                    exceptions={exceptions} 
                    onAction={handleExceptionAction} 
                  />
                )}
                {activeView === 'validation' && (
                  selectedAseForValidation ? (
                    <VisitValidation 
                      key="tl-validation-detail" 
                      visit={{...MOCK_VISIT_VALIDATION, aseName: selectedAseForValidation.name }} 
                      onApprove={() => { 
                        setToast({ message: `Visit for ${selectedAseForValidation.name} approved.`, type: 'success' }); 
                        setSelectedAseForValidation(null);
                        setActiveView('dashboard'); 
                      }}
                      onFlag={() => { 
                        setToast({ message: `Visit for ${selectedAseForValidation.name} flagged.`, type: 'error' }); 
                        setSelectedAseForValidation(null);
                        setActiveView('dashboard'); 
                      }}
                    />
                  ) : (
                    <div key="tl-validation-select" className="space-y-8">
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-primary mb-1">Visit Validation</h1>
                        <p className="text-on-surface-variant text-sm">Select an ASE to review their field execution</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aseStatuses.map(ase => (
                          <motion.div 
                            key={ase.id} 
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedAseForValidation(ase)}
                            className="card-base p-6 cursor-pointer hover:border-primary transition-all group"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                {ase.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-bold group-hover:text-primary transition-colors">{ase.name}</div>
                                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{ase.id}</div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-black/5">
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pending Review:</span>
                              <span className="text-xs font-black text-primary">1 Visit</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                {activeView === 'kpis' && <TeamKpis key="tl-kpis" />}
                {activeView === 'reports' && (
                  <TeamReports key="tl-reports" onAction={(msg) => setToast({ message: msg, type: 'success' })} />
                )}
                {activeView === 'signoff' && (
                  <DailySignoff 
                    key="tl-signoff" 
                    onSignOff={handleSignOff} 
                    pendingExceptions={exceptions.length} 
                  />
                )}
              </>
            )}

            {/* TDR Views (3 tabs) */}
            {user?.role === 'TDR' && (
              <>
                {activeView === 'dashboard' && <TerritoryCommand key="tdr-dashboard" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                {activeView === 'operations' && <TeamOversight key="tdr-operations" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                {activeView === 'reports' && <ReportingEngine key="tdr-reports" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
              </>
            )}

            {/* ZBM Views (3 tabs) */}
            {user?.role === 'ZBM' && (
              <>
                {activeView === 'dashboard' && <ZonalOverview key="zbm-dashboard" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                {activeView === 'analytics' && <KpiAnalytics key="zbm-analytics" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                {activeView === 'reports' && <ExecutiveReports key="zbm-reports" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
              </>
            )}

            {/* Rebalancer Views */}
            {user?.role === 'REBALANCER' && (
              <>
                {activeView === 'dashboard' && <RebalancerDashboard key="reb-dashboard" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                {activeView === 'liquidity' && <AgentLiquidity key="reb-liquidity" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                {activeView === 'audit' && <AgentAudit key="reb-audit" onAction={(msg) => setToast({ message: msg, type: 'success' })} />}
                { activeView === 'transfer' && <SecureTransfer key="reb-transfer" onAction={(msg) => setToast({ message: msg, type: 'success' })} /> }
                { activeView === 'reports' && <RebalancerReports key="reb-reports" onAction={(msg) => setToast({ message: msg, type: 'success' })} /> }
              </>
            )}

            {/* Admin Views */}
            {user?.role === 'ADMIN' && (
              <>
                { activeView === 'dashboard' && <AdminDashboard key="admin-dashboard" onAction={(msg) => setToast({ message: msg, type: 'success' })} /> }
                { activeView === 'users' && <UserManagement key="admin-users" onAction={(msg) => setToast({ message: msg, type: 'success' })} /> }
                { activeView === 'roles' && <RolePermissions key="admin-roles" onAction={(msg) => setToast({ message: msg, type: 'success' })} /> }
                { activeView === 'inventory' && <InventoryManagement key="admin-inventory" /> }
                { activeView === 'audit' && <AuditLog key="admin-audit" onAction={(msg) => setToast({ message: msg, type: 'success' })} /> }
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Active Visit Modal */}
      <AnimatePresence>
        {activeVisit && (
          <VisitModule 
            outlet={activeVisit} 
            onClose={() => setActiveVisit(null)} 
            onSubmit={handleVisitSubmit} 
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md ${
              toast.type === 'success' ? 'bg-rag-green text-white' : 'bg-rag-red text-white'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
