import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  BarChart3,
  RefreshCw,
  Wallet,
  Home,
  User,
  Gift,
  type LucideIcon,
} from 'lucide-react';
import type { Outlet, VisitData } from '../types';
import { useSession } from '../context/SessionContext';
import { MOCK_OUTLETS } from '../data/fieldMocks';

export type FieldNavItem = { id: string; label: string; Icon: LucideIcon };

export function useFieldAppCore() {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [outlets, setOutlets] = useState<Outlet[]>(MOCK_OUTLETS);
  const [activeVisit, setActiveVisit] = useState<Outlet | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sessionKpis, setSessionKpis] = useState({
    visits: 0,
    grossAdditions: 0,
    agentActivation: 0,
    floatChecks: 0,
  });
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const handleVisitSubmit = useCallback((data: VisitData) => {
    const isMissed = !!data.reasonForMissedVisit;
    setOutlets((prev) =>
      prev.map((o) => (o.id === data.outletId ? { ...o, status: isMissed ? 'Missed' : 'Visited' } : o)),
    );
    if (!isMissed) {
      const purposes = data.purpose || [];
      setSessionKpis((prev) => ({
        visits: prev.visits + 1,
        grossAdditions: prev.grossAdditions + (data.simsRegistered || 0),
        agentActivation: prev.agentActivation + (purposes.includes('Agent recruitment') ? 1 : 0),
        floatChecks: prev.floatChecks + (purposes.includes('Float & cash check') ? 1 : 0),
      }));
    }
    setActiveVisit(null);
    setToast({
      message: isMissed ? 'Missed visit logged & reported to TL.' : 'Visit submitted successfully.',
      type: 'success',
    });
    setActiveView('home');
  }, []);

  const handleEodSync = useCallback(() => {
    setToast({ message: 'Submitting End-of-Day Summary...', type: 'success' });
    setTimeout(() => {
      setToast({ message: 'EOD Summary Submitted. All data synced successfully.', type: 'success' });
      setTimeout(() => handleLogout(), 1500);
    }, 1500);
  }, [handleLogout]);

  const desktopNavItems = useMemo<FieldNavItem[]>(
    () => [
      { id: 'home', label: 'Home', Icon: Home },
      { id: 'plan', label: 'Tasks', Icon: ClipboardList },
      { id: 'loyalty', label: 'Rewards', Icon: Gift },
      { id: 'profile', label: 'Profile', Icon: User },
      { id: 'route', label: 'Route & visit', Icon: MapPin },
      { id: 'wallet', label: 'Wallet & float', Icon: Wallet },
      { id: 'kpis', label: 'Performance', Icon: BarChart3 },
      { id: 'eod', label: 'End of day', Icon: RefreshCw },
      { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    ],
    [],
  );

  const mobileNavItems = useMemo<FieldNavItem[]>(
    () => [
      { id: 'home', label: 'Home', Icon: Home },
      { id: 'plan', label: 'Tasks', Icon: ClipboardList },
      { id: 'loyalty', label: 'Rewards', Icon: Gift },
      { id: 'profile', label: 'Profile', Icon: User },
    ],
    [],
  );

  return {
    user,
    activeView,
    setActiveView,
    isSidebarOpen,
    setIsSidebarOpen,
    isOffline,
    setIsOffline,
    outlets,
    setOutlets,
    activeVisit,
    setActiveVisit,
    toast,
    setToast,
    sessionKpis,
    setSessionKpis,
    handleLogout,
    handleVisitSubmit,
    handleEodSync,
    desktopNavItems,
    mobileNavItems,
  };
}
