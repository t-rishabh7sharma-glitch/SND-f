import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2, AlertTriangle, Navigation } from 'lucide-react';
import type { Outlet, User, VisitData } from '../types';
import AseDashboard from '../components/ase/AseDashboard';
import DailyPlan from '../components/ase/DailyPlan';
import VisitModule from '../components/ase/VisitModule';
import KpiModule from '../components/ase/KpiModule';
import EodModule from '../components/ase/EodModule';
import AseWallet from '../components/ase/AseWallet';
import AgentHomeZamtel from '../components/ase/AgentHomeZamtel';
import AseLoyaltyScreen from '../components/ase/AseLoyaltyScreen';
import FieldProfileView from '../components/ase/FieldProfileView';

export type FieldAppViewsProps = {
  user: User;
  activeView: string;
  setActiveView: (v: string) => void;
  outlets: Outlet[];
  setOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
  activeVisit: Outlet | null;
  setActiveVisit: (o: Outlet | null) => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  setToast: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>;
  sessionKpis: { visits: number; grossAdditions: number; agentActivation: number; floatChecks: number };
  handleVisitSubmit: (data: VisitData) => void;
  handleEodSync: () => void;
  handleLogout: () => void;
  isOffline: boolean;
};

const FULL_BLEED = new Set(['home', 'loyalty', 'profile']);

export default function FieldAppViews({
  user,
  activeView,
  setActiveView,
  outlets,
  setOutlets,
  activeVisit,
  setActiveVisit,
  toast,
  setToast,
  sessionKpis,
  handleVisitSubmit,
  handleEodSync,
  handleLogout,
  isOffline,
}: FieldAppViewsProps) {
  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        className={`min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth ${FULL_BLEED.has(activeView) ? 'p-0' : 'p-4 lg:p-8'}`}
      >
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <AgentHomeZamtel
              key="home"
              user={user}
              outlets={outlets}
              sessionKpis={sessionKpis}
              setActiveView={setActiveView}
              setActiveVisit={setActiveVisit}
              setToast={setToast}
              isOffline={isOffline}
            />
          )}
          {activeView === 'loyalty' && <AseLoyaltyScreen key="loyalty" setToast={setToast} />}
          {activeView === 'profile' && (
            <FieldProfileView key="profile" user={user} sessionKpis={sessionKpis} onLogout={handleLogout} />
          )}
          {activeView === 'dashboard' && (
            <AseDashboard
              key="dashboard"
              outlets={outlets}
              onCheckIn={(o) => {
                setOutlets((prev) => prev.map((outlet) => (outlet.id === o.id ? { ...outlet, status: 'Visited' as const } : outlet)));
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
                setOutlets((prev) => prev.map((outlet) => (outlet.id === o.id ? { ...outlet, status: 'Visited' as const } : outlet)));
                setToast({ message: `Visit completed: ${o.name}`, type: 'success' });
              }}
              onAction={(msg) => setToast({ message: msg, type: 'success' })}
              userId={user.id}
              sessionKpis={sessionKpis}
            />
          )}
          {activeView === 'route' && (
            <div key="route" className="space-y-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-2xl lg:text-3xl mb-1">Route &amp; Check-In</h1>
                  <p className="text-on-surface-variant text-sm">Select an outlet to begin validation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-base p-8 space-y-6">
                  <h2 className="text-lg">Nearby outlets</h2>
                  <div className="space-y-4">
                    {outlets
                      .filter((o) => o.status !== 'Visited')
                      .map((o) => (
                        <div
                          key={o.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveVisit(o)}
                          onKeyDown={(e) => e.key === 'Enter' && setActiveVisit(o)}
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
                      <h3 className="text-on-surface-variant">Route navigation</h3>
                      <p className="text-xs text-on-surface-variant/60">Select an outlet to see route details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeView === 'kpis' && <KpiModule key="kpis" sessionKpis={sessionKpis} />}
          {activeView === 'eod' && <EodModule key="eod" onSync={handleEodSync} isOffline={isOffline} />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeVisit && <VisitModule outlet={activeVisit} onClose={() => setActiveVisit(null)} onSubmit={handleVisitSubmit} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[200] max-[1023px]:bottom-[calc(5.5rem+env(safe-area-inset-bottom))] max-[1023px]:right-4 max-[1023px]:left-4"
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md ${
                toast.type === 'success' ? 'bg-rag-green text-white' : 'bg-rag-red text-white'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
