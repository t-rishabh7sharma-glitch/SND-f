import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, LogOut, Wifi, WifiOff, RefreshCw, Navigation } from 'lucide-react';
import { useFieldAppCore } from './useFieldAppCore';
import FieldAppViews from './FieldAppViews';

/** ASE experience tuned for desktop / tablet browsers (`/field`). */
export default function FieldAppWeb() {
  const core = useFieldAppCore();
  const { user } = core;
  if (!user || user.role !== 'ASE') return null;

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 w-full max-w-[100vw] flex-row overflow-hidden bg-surface font-sans text-on-surface selection:bg-primary/20">
      <motion.aside
        initial={false}
        animate={{ width: core.isSidebarOpen ? 280 : 80 }}
        className="hidden h-dvh max-h-dvh min-h-0 shrink-0 flex-col overflow-hidden border-r border-black/5 bg-white shadow-sm lg:flex"
      >
        <div className="shrink-0 border-b border-black/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
              <Navigation size={20} />
            </div>
            {core.isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-xl font-extrabold text-primary">
                Field
              </motion.div>
            )}
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-4 py-6">
          {core.desktopNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => core.setActiveView(item.id)}
              className={`group relative flex w-full items-center gap-4 rounded-xl p-3.5 transition-all ${
                core.activeView === item.id ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <div className="shrink-0">
                <item.Icon size={20} />
              </div>
              {core.isSidebarOpen && <span className="text-left text-sm font-bold">{item.label}</span>}
              {core.activeView === item.id && <motion.div layoutId="field-nav-pill-web" className="absolute left-0 h-6 w-1 rounded-r-full bg-white" />}
            </button>
          ))}
        </nav>

        <div className="shrink-0 border-t border-black/5 p-4">
          <Link
            to="/field/app"
            className="mb-2 flex w-full items-center gap-4 rounded-xl p-3.5 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-container"
          >
            Open app layout
          </Link>
          <button
            type="button"
            onClick={core.handleLogout}
            className="flex w-full items-center gap-4 rounded-xl p-3.5 text-rag-red transition-all hover:bg-rag-red-bg"
          >
            <LogOut size={20} />
            {core.isSidebarOpen && <span className="text-sm font-bold">Sign out</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:max-h-dvh">
        {core.activeView !== 'home' && (
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-black/5 bg-white px-4 lg:h-20 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => core.setIsSidebarOpen(!core.isSidebarOpen)}
                className="hidden rounded-xl p-2 transition-colors hover:bg-surface-container lg:block"
              >
                <Menu size={20} />
              </button>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm lg:hidden">
                <Navigation size={16} />
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest text-on-surface-variant lg:text-[10px]">
                  Active territory
                </div>
                <div className="max-w-[120px] truncate text-xs font-bold lg:max-w-none lg:text-sm">{user.territory}</div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:gap-6">
              <button
                type="button"
                onClick={() => core.setIsOffline(!core.isOffline)}
                className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] font-bold transition-all lg:px-3 lg:text-[10px] ${
                  core.isOffline ? 'bg-rag-amber-bg text-rag-amber' : 'bg-rag-green-bg text-rag-green'
                }`}
              >
                {core.isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
                <span className="hidden sm:inline">{core.isOffline ? 'OFFLINE' : 'ONLINE'}</span>
              </button>

              {!core.isOffline && (
                <div className="flex items-center gap-1.5 text-rag-green">
                  <RefreshCw size={12} className="animate-spin" />
                  <span className="text-[8px] font-bold uppercase tracking-widest lg:text-[10px]">Synced</span>
                </div>
              )}

              <div className="hidden h-6 w-px bg-black/5 sm:block lg:h-8" />

              <div className="flex items-center gap-2 lg:gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-xs font-bold lg:text-sm">{user.name}</div>
                  <div className="text-[8px] font-semibold uppercase tracking-widest text-on-surface-variant lg:text-[10px]">{user.role}</div>
                </div>
                <button
                  type="button"
                  onClick={() => core.setActiveView('profile')}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary transition-all hover:bg-primary/20 lg:h-10 lg:w-10 lg:text-base"
                >
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </button>
              </div>
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
      </main>
    </div>
  );
}
