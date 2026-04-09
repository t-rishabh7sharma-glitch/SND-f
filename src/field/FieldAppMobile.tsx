import { Wifi, WifiOff, RefreshCw, Navigation, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFieldAppCore } from './useFieldAppCore';
import FieldAppViews from './FieldAppViews';

const VIEW_TITLE: Record<string, string> = {
  plan: 'Tasks',
  route: 'Route',
  kpis: 'Performance',
  eod: 'End of day',
  wallet: 'Wallet',
  dashboard: 'Dashboard',
  loyalty: 'Rewards',
  profile: 'Profile',
};

/** Compact ASE shell for phones / PWA / in-app WebView (`/field/app`). */
export default function FieldAppMobile() {
  const core = useFieldAppCore();
  const { user } = core;
  if (!user || user.role !== 'ASE') return null;

  const headerTitle = VIEW_TITLE[core.activeView] ?? 'Field';

  return (
    <div className="field-app-shell flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-surface font-sans text-on-surface selection:bg-primary/20">
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {!['home', 'loyalty', 'profile'].includes(core.activeView) && (
          <header className="h-16 bg-white border-b border-black/5 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                <Navigation size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-0.5">
                  {core.activeView === 'profile' || core.activeView === 'loyalty' ? 'Zamtel field' : 'Active territory'}
                </div>
                <div className="text-xs font-bold truncate max-w-[160px]">
                  {core.activeView === 'profile' || core.activeView === 'loyalty' ? headerTitle : user.territory}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => core.setIsOffline(!core.isOffline)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-bold transition-all ${
                  core.isOffline ? 'bg-rag-amber-bg text-rag-amber' : 'bg-rag-green-bg text-rag-green'
                }`}
              >
                {core.isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
              </button>
              {!core.isOffline && <RefreshCw size={12} className="animate-spin text-rag-green" />}
              <button
                type="button"
                onClick={() => core.setActiveView('profile')}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 text-xs"
              >
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </button>
              <button type="button" onClick={core.handleLogout} className="p-2 text-rag-red hover:bg-rag-red-bg rounded-lg">
                <LogOut size={18} />
              </button>
            </div>
          </header>
        )}

        <FieldAppViews
          user={user}
          activeView={core.activeView}
          setActiveView={core.setActiveView}
          outlets={core.outlets}
          setOutlets={core.setOutlets}
          activeVisit={core.activeVisit}
          setActiveVisit={core.setActiveVisit}
          toast={core.toast}
          setToast={core.setToast}
          sessionKpis={core.sessionKpis}
          handleVisitSubmit={core.handleVisitSubmit}
          handleEodSync={core.handleEodSync}
          handleLogout={core.handleLogout}
          isOffline={core.isOffline}
        />
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 sm:bottom-4 sm:right-4">
          <Link
            to="/field"
            className="pointer-events-auto block rounded-full border border-black/10 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-on-surface-variant shadow-md backdrop-blur-sm hover:border-primary/30"
          >
            Web layout
          </Link>
        </div>
      </main>

      <nav
        className="field-app-bottom-nav shrink-0 border-t border-[#e8e8e8] bg-white px-0.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex w-full min-w-0 touch-manipulation items-stretch justify-around"
        style={{ minHeight: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label="Field navigation"
      >
        {core.mobileNavItems.map((item) => {
          const active = core.activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => core.setActiveView(item.id)}
              className={`flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 transition-colors active:opacity-90 ${
                active ? 'text-[#1a6b3c]' : 'text-[#999]'
              }`}
            >
              <item.Icon size={20} strokeWidth={1.3} className={`shrink-0 ${active ? 'text-[#1a6b3c]' : 'text-[#aaa]'}`} />
              <span
                className={`max-w-[5.5rem] truncate text-center text-[10px] leading-tight min-[400px]:max-w-none ${
                  active ? 'font-semibold text-[#1a6b3c]' : 'font-normal text-[#999]'
                }`}
              >
                {item.label}
              </span>
              {active && <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#1a6b3c]" aria-hidden />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
