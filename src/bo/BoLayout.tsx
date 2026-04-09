import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Monitor,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  X,
  Inbox,
  Settings2,
  FileWarning,
} from 'lucide-react';
import { buildUserFromLoginId, getBoPrefix, useSession } from '../context/SessionContext';
import { getBoNav, DEMO_ROLE_PRESETS, type BoNavItem } from './boNav';
import { useBoData } from '../context/BoDataContext';
import { BoToastEffect } from './boChildRoutes';
import { BoSuperAdminConfigProvider } from '../context/BoSuperAdminConfigContext';

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

const BO_NOTIFICATION_DEMOS: { id: string; title: string; body: string; time: string; Icon: typeof Inbox }[] = [
  {
    id: 'n1',
    title: 'Visit validation queue',
    body: '3 outlets pending TL sign-off before payroll lock.',
    time: '12 min ago',
    Icon: Inbox,
  },
  {
    id: 'n2',
    title: 'Float alert — Copperbelt',
    body: 'Two DSAs under policy float minimum. Rebalancer notified.',
    time: '1 hr ago',
    Icon: FileWarning,
  },
  {
    id: 'n3',
    title: 'KPI config published',
    body: 'MoMo GA weighting updated for TDR dashboards — review targets.',
    time: 'Yesterday',
    Icon: Settings2,
  },
];

/** Sidebar tokens aligned to reference: white rail, lavender active row, grey labels, blue bullets */
const NAV = {
  muted: 'text-[#6B7280]',
  activeBg: 'bg-[#EEF2FF]',
  dot: 'bg-[#3B82F6]',
  activeText: 'text-zinc-900',
} as const;

function NavEntry({
  item,
  pathname,
  depth,
  expanded,
  toggle,
  sidebarOpen,
  expandSidebar,
}: {
  item: BoNavItem;
  pathname: string;
  depth: number;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  sidebarOpen: boolean;
  expandSidebar: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const childActive = hasChildren && item.children!.some((c) => matchesPath(pathname, c.path));
  const isOpen = expanded[item.id] ?? !!childActive;

  if (hasChildren) {
    if (!sidebarOpen) {
      return (
        <div className="flex justify-center">
          <button
            type="button"
            title={item.label}
            onClick={() => {
              expandSidebar();
              toggle(item.id);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              childActive ? `${NAV.activeBg} shadow-sm` : `${NAV.muted} hover:bg-zinc-50`
            }`}
          >
            <item.icon size={18} strokeWidth={1.75} className={childActive ? 'text-zinc-800' : 'text-[#6B7280]'} />
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => toggle(item.id)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
            childActive
              ? `${NAV.activeBg} ${NAV.activeText} font-semibold shadow-sm`
              : `${NAV.muted} hover:bg-zinc-50 font-medium`
          }`}
          style={{ paddingLeft: 12 + depth * 10 }}
        >
          <item.icon size={18} strokeWidth={1.75} className={`shrink-0 ${childActive ? 'text-zinc-800' : 'text-[#6B7280]'}`} />
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronRight
            size={16}
            strokeWidth={2}
            className={`shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            aria-hidden
          />
        </button>
        {isOpen && (
          <div className="space-y-0.5 border-l-2 border-zinc-200 py-0.5 pl-3" style={{ marginLeft: 10 + depth * 10 }}>
            {item.children!.map((ch) => (
              <NavLink
                key={ch.id}
                to={ch.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg py-2 pl-1 pr-2 text-sm transition-colors ${
                    isActive ? `${NAV.activeText} font-bold` : `${NAV.muted} font-medium hover:bg-zinc-50 hover:text-zinc-700`
                  }`
                }
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${NAV.dot}`} aria-hidden />
                <span className="truncate">{ch.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!sidebarOpen) {
    return (
      <div className="flex justify-center">
        <NavLink
          to={item.path}
          title={item.label}
          className={({ isActive }) =>
            `flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              isActive ? `${NAV.activeBg} shadow-sm` : `${NAV.muted} hover:bg-zinc-50`
            }`
          }
          style={{ marginLeft: 0 }}
        >
          {({ isActive }) => (
            <item.icon
              size={18}
              strokeWidth={1.75}
              className={`shrink-0 ${isActive ? 'text-zinc-800' : 'text-[#6B7280]'}`}
            />
          )}
        </NavLink>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? `${NAV.activeBg} ${NAV.activeText} font-semibold shadow-sm`
            : `${NAV.muted} font-medium hover:bg-zinc-50 hover:text-zinc-700`
        }`
      }
      style={{ marginLeft: depth * 10 }}
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={18}
            strokeWidth={1.75}
            className={`shrink-0 ${isActive ? 'text-zinc-800' : 'text-[#6B7280]'}`}
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

const LG_MIN = '(min-width: 1024px)';

const ALL_BO_NOTIF_IDS = BO_NOTIFICATION_DEMOS.map((n) => n.id);

export default function BoLayout() {
  const { user, setUser, logout } = useSession();
  const { toast, setToast } = useBoData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  /** Notification ids the user has marked read (demo — replace with server sync later). */
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(() => new Set());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(LG_MIN).matches : true,
  );

  useEffect(() => {
    const mq = window.matchMedia(LG_MIN);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const prefix = user ? getBoPrefix(user.role) : 'admin';
  const nav = useMemo(() => (user ? getBoNav(user.role, prefix) : []), [user, prefix]);

  useEffect(() => {
    if (!user) return;
    const p = getBoPrefix(user.role);
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length < 2 || parts[0] !== 'bo') return;
    if (parts[1] !== p) navigate(`/bo/${p}/dashboard`, { replace: true });
  }, [user, location.pathname, navigate]);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.replace(/^\/bo\/?/, '').split('/').filter(Boolean);
    if (parts.length < 2) return ['Back office', 'Dashboard'];
    const [, page, ...rest] = parts;
    const labels: Record<string, string> = {
      dashboard: 'Dashboard',
      hierarchy: 'Hierarchy',
      territory: 'Territory',
      users: 'Users & agents',
      roles: 'Roles & RBAC',
      kpis: 'KPI engine',
      targets: 'Targets',
      incentives: 'Incentives',
      inventory: 'Inventory',
      map: 'Live map',
      exceptions: 'Exceptions',
      validation: 'Visit validation',
      signoff: 'Sign-off',
      operations: 'Operations',
      analytics: 'Analytics',
      liquidity: 'Liquidity',
      audit: 'Audit',
      transfer: 'Transfer',
    };
    const mid = labels[page] || page;
    return ['Back office', mid, ...(rest.length ? rest : [])];
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    setReadNotifIds(new Set());
  }, [user?.id]);

  const unreadNotifCount = useMemo(
    () => ALL_BO_NOTIF_IDS.filter((id) => !readNotifIds.has(id)).length,
    [readNotifIds],
  );
  const allNotifsRead = unreadNotifCount === 0;

  const markNotifRead = (id: string) => {
    setReadNotifIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const markAllNotifsRead = () => {
    setReadNotifIds(new Set(ALL_BO_NOTIF_IDS));
    setToast({ message: 'All notifications marked as read.', type: 'success' });
  };

  const onRoleSwitch = (loginHint: string) => {
    const next = buildUserFromLoginId(loginHint);
    setUser(next);
    setRoleMenuOpen(false);
    if (next.role === 'ASE') {
      navigate('/field', { replace: true });
      return;
    }
    navigate(`/bo/${getBoPrefix(next.role)}/dashboard`, { replace: true });
  };

  if (!user) return null;

  if (!isDesktop) {
    return (
      <div className="bo-shell flex min-h-screen flex-col items-center justify-center bg-bo-surface p-6 text-center">
        <div className="bo-card max-w-md space-y-6 p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-bo-secondary text-bo-primary">
            <Monitor size={28} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-black">Back office — desktop only</h1>
            <p className="mt-2 text-sm text-bo-muted">This console is not available on phone-sized screens. Use a laptop or desktop browser.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="btn-bo-primary w-full rounded-lg py-3 text-sm font-bold"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bo-shell flex min-h-screen bg-bo-surface text-black">
      <BoToastEffect />
      <aside
        className={`sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-black/10 bg-white shadow-[2px_0_12px_rgba(0,41,112,0.04)] transition-[width] duration-200 lg:flex ${
          sidebarOpen ? 'w-[280px]' : 'w-[80px]'
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-black/5 ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6] text-white shadow-sm">
            <Navigation size={20} strokeWidth={1.75} />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-black">Distribution CRM</div>
              <div className="truncate text-[10px] font-semibold uppercase tracking-wider text-bo-muted">Back office</div>
            </div>
          )}
        </div>
        <nav className={`flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-4 ${sidebarOpen ? 'px-3' : 'px-1.5'}`}>
          {nav.map((item) => (
            <React.Fragment key={item.id}>
              <NavEntry
                item={item}
                pathname={location.pathname}
                depth={0}
                expanded={expanded}
                toggle={toggle}
                sidebarOpen={sidebarOpen}
                expandSidebar={() => setSidebarOpen(true)}
              />
            </React.Fragment>
          ))}
        </nav>
        <div className={`border-t border-black/5 ${sidebarOpen ? 'p-3' : 'flex justify-center p-2'}`}>
          <button
            type="button"
            title="Sign out"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className={`flex items-center gap-3 rounded-lg text-sm font-semibold text-red-600 transition hover:bg-red-50 ${
              sidebarOpen ? 'w-full px-3 py-2.5' : 'h-10 w-10 justify-center p-0'
            }`}
          >
            <LogOut size={18} />
            {sidebarOpen && 'Sign out'}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-black/5 bg-white px-4 shadow-sm lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="hidden rounded-lg p-2 text-bo-secondary transition hover:bg-bo-surface lg:block"
              aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((s) => !s)}
            >
              <Menu size={20} strokeWidth={2} />
            </button>
            <div className="lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bo-secondary text-white">
                <Navigation size={18} />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-bo-muted">Environment</p>
              <p className="truncate text-sm font-bold text-black">{user.territory || user.region}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setRoleMenuOpen((o) => !o);
                  setNotifOpen(false);
                }}
                className="flex max-w-[220px] items-center gap-2 rounded-lg border border-black/10 bg-bo-surface px-3 py-2 text-left text-xs font-bold text-bo-secondary sm:max-w-xs"
              >
                <span className="truncate">
                  BO · {user.role === 'ADMIN' ? 'Super Admin' : user.role} · {user.id}
                </span>
                <ChevronDown size={16} className="shrink-0 opacity-60" />
              </button>
              {roleMenuOpen && (
                <>
                  <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close menu" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-bo-card">
                    {DEMO_ROLE_PRESETS.map((p) => (
                      <button
                        key={p.loginHint}
                        type="button"
                        onClick={() => onRoleSwitch(p.loginHint)}
                        className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-black hover:bg-bo-surface"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setNotifOpen(true);
                setRoleMenuOpen(false);
              }}
              className={`relative rounded-lg p-2 transition-colors ${notifOpen ? 'bg-bo-surface text-bo-secondary' : 'text-bo-muted hover:bg-bo-surface'}`}
              aria-label={unreadNotifCount > 0 ? `Notifications, ${unreadNotifCount} unread` : 'Notifications'}
              aria-expanded={notifOpen}
            >
              <Bell size={20} />
              {unreadNotifCount > 0 && (
                <span
                  className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-bo-primary px-0.5 text-[9px] font-bold text-white ring-2 ring-white"
                  aria-hidden
                >
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bo-primary/15 text-sm font-bold text-bo-secondary">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </div>
        </header>

        <div className="border-b border-black/5 bg-white px-4 py-4 lg:px-8">
          <h1 className="text-lg font-bold text-black lg:text-xl">{breadcrumbs[breadcrumbs.length - 1]}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-bo-muted">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="opacity-40" />}
                <span className={i === breadcrumbs.length - 1 ? 'font-semibold text-bo-secondary' : ''}>{c}</span>
              </span>
            ))}
          </p>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {user.role === 'ADMIN' ? (
            <BoSuperAdminConfigProvider>
              <Outlet />
            </BoSuperAdminConfigProvider>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.button
              type="button"
              key="notif-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] cursor-default bg-black/25"
              aria-label="Close notifications"
              onClick={() => setNotifOpen(false)}
            />
            <motion.aside
              key="notif-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="bo-notif-title"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 z-[60] flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white shadow-[-8px_0_32px_rgba(0,41,112,0.12)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
                <div>
                  <h2 id="bo-notif-title" className="text-lg font-bold text-black">
                    Notifications
                  </h2>
                  <p className="text-xs text-bo-muted">
                    {unreadNotifCount > 0
                      ? `${unreadNotifCount} unread · demo data (connect API later)`
                      : 'You’re all caught up · demo data'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="rounded-lg p-2 text-bo-muted transition hover:bg-bo-surface hover:text-black"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-2">
                  {BO_NOTIFICATION_DEMOS.map((n) => {
                    const isRead = readNotifIds.has(n.id);
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          className={`flex w-full gap-3 rounded-xl border p-4 text-left transition ${
                            isRead
                              ? 'border-black/5 bg-white/90 opacity-80 hover:bg-bo-surface/60'
                              : 'border-bo-primary/20 bg-bo-surface/80 hover:border-bo-primary/40 hover:bg-white'
                          }`}
                          onClick={() => markNotifRead(n.id)}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 ring-black/5 ${
                              isRead ? 'bg-bo-surface text-bo-muted' : 'bg-white text-bo-secondary'
                            }`}
                          >
                            <n.Icon size={20} strokeWidth={2} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-start justify-between gap-2">
                              <span className={`text-sm ${isRead ? 'font-semibold text-bo-muted' : 'font-bold text-black'}`}>{n.title}</span>
                              <span className="flex shrink-0 flex-col items-end gap-1">
                                {!isRead && <span className="h-2 w-2 rounded-full bg-bo-primary" aria-hidden />}
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-bo-muted">{n.time}</span>
                              </span>
                            </span>
                            <span className={`mt-1 block text-xs leading-snug ${isRead ? 'text-bo-muted/90' : 'text-bo-muted'}`}>{n.body}</span>
                            {isRead && (
                              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-bo-muted">
                                <CheckCircle2 size={12} className="text-emerald-600" aria-hidden />
                                Read
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="space-y-2 border-t border-black/5 bg-white p-4">
                <button
                  type="button"
                  disabled={allNotifsRead}
                  className="btn-bo-primary w-full rounded-lg py-3 text-sm font-bold shadow-sm disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => {
                    markAllNotifsRead();
                  }}
                >
                  {allNotifsRead ? 'All read' : 'Mark all as read'}
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg border border-black/10 py-3 text-sm font-semibold text-bo-secondary transition hover:bg-bo-surface"
                  onClick={() => {
                    setNotifOpen(false);
                    setToast({
                      message: 'Notification preferences would open here (email, push, thresholds).',
                      type: 'success',
                    });
                  }}
                >
                  Notification settings
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm"
          >
            <div
              className={`flex items-center gap-3 rounded-2xl border border-white/20 px-5 py-4 text-sm font-bold text-white shadow-lg ${
                toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
