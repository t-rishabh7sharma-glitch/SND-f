import { Wifi, WifiOff, RefreshCw, Navigation, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FIELD_THEME } from '../components/ase/fieldAppTheme';
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
    <div
      className="field-app-shell flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden font-sans antialiased selection:bg-[#93C5FD]/30"
      style={{ backgroundColor: FIELD_THEME.bg, color: FIELD_THEME.text }}
    >
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {!['home', 'loyalty', 'profile'].includes(core.activeView) && (
          <header
            className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-white px-4"
            style={{ borderColor: FIELD_THEME.border }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                style={{ backgroundColor: FIELD_THEME.primary }}
              >
                <Navigation size={16} />
              </div>
              <div className="min-w-0">
                <div
                  className="mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest"
                  style={{ color: FIELD_THEME.textMuted }}
                >
                  {core.activeView === 'profile' || core.activeView === 'loyalty' ? 'Zamtel field' : 'Active territory'}
                </div>
                <div className="max-w-[160px] truncate text-xs font-bold" style={{ color: FIELD_THEME.text }}>
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
                className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold"
                style={{
                  backgroundColor: `${FIELD_THEME.primary}14`,
                  borderColor: `${FIELD_THEME.primary}33`,
                  color: FIELD_THEME.primary,
                }}
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
            className="pointer-events-auto block rounded-full border bg-white/95 px-3 py-1.5 text-[10px] font-bold shadow-md backdrop-blur-sm hover:opacity-90"
            style={{ borderColor: FIELD_THEME.border, color: FIELD_THEME.textMuted }}
          >
            Web layout
          </Link>
        </div>
      </main>

      <nav
        className="field-app-bottom-nav flex w-full min-w-0 shrink-0 touch-manipulation items-stretch justify-around border-t bg-white px-0.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_24px_rgba(15,23,42,0.06)]"
        style={{ borderColor: FIELD_THEME.border, minHeight: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label="Field navigation"
      >
        {core.mobileNavItems.map((item) => {
          const active = core.activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => core.setActiveView(item.id)}
              className="flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 transition-colors active:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#93C5FD]"
              style={{ color: active ? FIELD_THEME.primary : FIELD_THEME.textMuted }}
            >
              <item.Icon size={20} strokeWidth={1.3} className="shrink-0" style={{ color: active ? FIELD_THEME.primary : '#9CA3AF' }} />
              <span
                className={`max-w-[5.5rem] truncate text-center text-[10px] leading-tight min-[400px]:max-w-none ${
                  active ? 'font-semibold' : 'font-normal'
                }`}
                style={{ color: active ? FIELD_THEME.primary : FIELD_THEME.textMuted }}
              >
                {item.label}
              </span>
              {active && <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#0B5ED7]" aria-hidden />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
