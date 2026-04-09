import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Gift,
  MapPin,
  Menu,
  Star,
  TrendingUp,
  User as UserIcon,
  X,
} from 'lucide-react';
import type { Outlet, User } from '../../types';
import { ASE_DAILY_TARGETS } from '../../data/kpiStore';

const BRAND = {
  teal: '#0d7d8c',
  tealDeep: '#0a5f6c',
  green: '#1a6b3c',
  goldSoft: '#f0b429',
};

type Props = {
  user: User;
  outlets: Outlet[];
  sessionKpis: { visits: number; grossAdditions: number; agentActivation: number; floatChecks: number };
  setActiveView: (v: string) => void;
  setActiveVisit: (o: Outlet | null) => void;
  setToast: (t: { message: string; type: 'success' | 'error' }) => void;
  isOffline: boolean;
};

function formatDemoPhone(): string {
  return '+260 (211) 333 155';
}

function pct(actual: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((actual / target) * 100));
}

function useRouteStats(period: 'daily' | 'weekly' | 'monthly', outlets: Outlet[]) {
  return useMemo(() => {
    const v = outlets.filter((o) => o.status === 'Visited').length;
    const m = outlets.filter((o) => o.status === 'Missed').length;
    const r = Math.max(0, outlets.length - v - m);
    if (period === 'daily') {
      return { visited: v, missed: m, remaining: r, hint: 'Today' };
    }
    if (period === 'weekly') {
      return {
        visited: v + 8,
        missed: Math.min(m + 1, 6),
        remaining: Math.max(r + 4, 0),
        hint: 'This week (roll-up)',
      };
    }
    return {
      visited: v + 34,
      missed: Math.min(m + 4, 12),
      remaining: Math.max(r + 14, 0),
      hint: 'This month (roll-up)',
    };
  }, [period, outlets]);
}

function useVisitPeriod(period: 'daily' | 'weekly' | 'monthly', visitActual: number, visitTarget: number) {
  return useMemo(() => {
    if (period === 'daily') return { visitA: visitActual, visitT: visitTarget };
    if (period === 'weekly') return { visitA: Math.min(visitActual + 12, visitTarget * 5), visitT: visitTarget * 5 };
    return { visitA: Math.min(visitActual + 48, visitTarget * 22), visitT: visitTarget * 22 };
  }, [period, visitActual, visitTarget]);
}

export default function AgentHomeZamtel({
  user,
  outlets,
  sessionKpis,
  setActiveView,
  setActiveVisit,
  setToast,
  isOffline,
}: Props) {
  const [periodTab, setPeriodTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const targets = useMemo(
    () => ASE_DAILY_TARGETS.find((t) => t.aseId === user.id) ?? ASE_DAILY_TARGETS[0],
    [user.id],
  );

  const visited = outlets.filter((o) => o.status === 'Visited').length;
  const missed = outlets.filter((o) => o.status === 'Missed').length;
  const remaining = Math.max(0, outlets.length - visited - missed);

  const visitActual = Math.max(visited, sessionKpis.visits);
  const visitTarget = targets.visits.target;

  const routeStats = useRouteStats(periodTab, outlets);
  const vp = useVisitPeriod(periodTab, visitActual, visitTarget);

  const routePreview = outlets.slice(0, 5);
  const territoryLabel = user.territory?.includes('Metro') ? 'Lusaka Central' : user.territory || 'Lusaka Central';
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const overlayActive = menuOpen || notifOpen;

  useEffect(() => {
    if (!overlayActive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [overlayActive]);

  /** Portals must sit above all in-app UI. On narrow screens use full-screen sheets so home chrome never shows through. */
  const menuOverlay =
    menuOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        className="fixed inset-0 z-[99999] flex flex-col bg-white sm:flex-row sm:justify-start sm:bg-transparent"
        role="dialog"
        aria-modal="true"
        aria-labelledby="field-menu-title"
      >
        <button
          type="button"
          className="absolute inset-0 z-0 hidden bg-black/50 backdrop-blur-[1px] sm:block"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative z-[1] flex h-full min-h-0 w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-[min(320px,92vw)]">
          <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-4 py-3.5 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <span id="field-menu-title" className="text-sm font-semibold tracking-tight" style={{ color: BRAND.green }}>
              Menu
            </span>
            <button type="button" onClick={() => setMenuOpen(false)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-black/[0.04]">
              <X size={18} />
            </button>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {[
              { id: 'plan', label: "Today's tasks" },
              { id: 'route', label: 'Route & visit' },
              { id: 'wallet', label: 'Wallet & float' },
              { id: 'loyalty', label: 'Rewards' },
              { id: 'kpis', label: 'Performance' },
            ].map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setActiveView(row.id);
                }}
                className="rounded-xl px-3 py-3.5 text-left text-sm font-medium text-[#333] transition-colors hover:bg-[#eaf5f0]"
              >
                {row.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setActiveView('profile');
              }}
              className="rounded-xl px-3 py-3.5 text-left text-sm font-medium text-[#333] transition-colors hover:bg-[#eaf5f0]"
            >
              Profile
            </button>
          </nav>
        </div>
      </div>,
      document.body,
    );

  const notifOverlay =
    notifOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        className="fixed inset-0 z-[99999] flex flex-col bg-white sm:flex-row sm:justify-end sm:bg-transparent"
        role="dialog"
        aria-modal="true"
        aria-labelledby="field-notif-title"
      >
        <button
          type="button"
          className="absolute inset-0 z-0 hidden bg-black/50 backdrop-blur-[1px] sm:block"
          aria-label="Close notifications"
          onClick={() => setNotifOpen(false)}
        />
        <div className="relative z-[1] flex h-full min-h-0 w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-[min(400px,92vw)]">
          <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-4 py-3.5 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <span id="field-notif-title" className="text-base font-semibold tracking-tight" style={{ color: BRAND.green }}>
              Notifications
            </span>
            <button type="button" onClick={() => setNotifOpen(false)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-black/[0.04]">
              <X size={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {[
              { id: '1', title: 'Route update', body: 'Two new outlets added to Metro North for tomorrow.', time: '2h ago', unread: true },
              { id: '2', title: 'Sync complete', body: 'Your visit data was uploaded successfully.', time: 'Today', unread: true },
              { id: '3', title: 'Loyalty bonus', body: 'Double points on first visit Mondays — active this month.', time: 'Yesterday', unread: false },
            ].map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setToast({ message: n.title, type: 'success' });
                  setNotifOpen(false);
                }}
                className="mb-2 w-full rounded-xl border border-black/[0.06] bg-[#fafcfb] px-3 py-3 text-left transition hover:bg-[#eaf5f0]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[#222]">{n.title}</span>
                  {n.unread && <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-[12px] leading-snug text-[#666]">{n.body}</p>
                <p className="mt-2 text-[10px] font-medium text-[#999]">{n.time}</p>
              </button>
            ))}
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#e7eceb] font-sans text-[#1a1a1a] antialiased"
      style={{ fontFamily: "'Inter', 'Manrope', system-ui, sans-serif" }}
    >
      {menuOverlay}
      {notifOverlay}

      <header
        className="relative shrink-0 overflow-hidden px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
        style={{
          background: `linear-gradient(165deg, ${BRAND.teal} 0%, ${BRAND.tealDeep} 55%, #094a52 100%)`,
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-white/[0.07]" />
        <div className="relative z-[2] flex items-center justify-between gap-1.5 min-[360px]:gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 min-[360px]:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center"
              aria-label="Open menu"
            >
              <span className="absolute inset-0 rounded-full border-2 border-sky-200/35" />
              <span className="absolute inset-[5px] rounded-full border border-red-300/30" />
              <span className="absolute inset-[10px] flex items-center justify-center rounded-full bg-white shadow-inner">
                <Menu size={18} strokeWidth={2} className="text-[#0a5f6c]" />
              </span>
            </button>
            <div className="min-w-0">
              <div className="truncate text-[clamp(0.8125rem,3.8vw,0.9375rem)] font-semibold tracking-tight text-white">
                {user.name}
              </div>
              <div className="mt-0.5 truncate text-[clamp(0.6875rem,3vw,0.75rem)] text-white/75">{formatDemoPhone()}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-white/15 text-[12px] font-bold text-white shadow-sm transition hover:bg-white/25 active:scale-95"
              aria-label="Open profile"
            >
              {initials}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setNotifOpen(true);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
              aria-label="Notifications"
              aria-expanded={notifOpen}
            >
              <Bell size={21} strokeWidth={1.75} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0a5f6c]" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-[3] -mt-1 px-3">
        <section
          className="overflow-hidden rounded-2xl shadow-[0_8px_28px_-6px_rgba(0,0,0,0.2)] ring-1 ring-black/5"
          style={{
            background: `linear-gradient(155deg, #0b6b5a 0%, ${BRAND.green} 55%, #0d3d24 100%)`,
          }}
        >
          <div className="px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">Active territory</p>
            <p className="mt-1 text-[clamp(1.125rem,5.5vw,1.375rem)] font-bold leading-tight tracking-tight text-white">
              {territoryLabel}
            </p>
            <p className="mt-1 text-[13px] text-white/80">{dateStr}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">Today&apos;s status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {isOffline ? 'Offline' : 'Synced'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('plan')}
              className="mt-3 text-[13px] font-semibold text-emerald-200/95 underline-offset-2 transition hover:text-white"
            >
              View tasks ›
            </button>
          </div>
        </section>
      </div>

      <div className="scrollbar-none mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <section className="mx-3 mb-3 overflow-hidden rounded-2xl border border-white/90 bg-white shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-3 divide-x divide-[#e8eceb]">
            <div className="py-4 text-center">
              <div className="text-[26px] font-semibold tabular-nums leading-none" style={{ color: BRAND.teal }}>
                {routeStats.visited}
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-[#8a9190]">Visited</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-[26px] font-semibold tabular-nums leading-none" style={{ color: BRAND.teal }}>
                {routeStats.missed}
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-[#8a9190]">Missed</div>
            </div>
            <div className="py-4 text-center">
              <div
                className="text-[26px] font-semibold tabular-nums leading-none"
                style={{ color: routeStats.remaining > 0 ? BRAND.goldSoft : BRAND.teal }}
              >
                {routeStats.remaining}
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-[#8a9190]">Remaining</div>
            </div>
          </div>

          <p className="border-t border-[#eef2f1] px-3 py-2 text-center text-[10px] font-medium text-[#8a9190]">{routeStats.hint}</p>

          <div className="relative z-20 mx-3 mb-3 flex gap-1 rounded-xl bg-[#eef2f1] p-1 touch-manipulation">
            {(['daily', 'weekly', 'monthly'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriodTab(key)}
                className={`relative z-30 flex-1 cursor-pointer rounded-lg py-2.5 text-[12px] font-semibold transition-all select-none active:scale-[0.98] ${
                  periodTab === key ? 'bg-white text-[#0d7d8c] shadow-sm ring-1 ring-black/[0.06]' : 'text-[#7a8583] hover:text-[#4a5553]'
                }`}
              >
                {key === 'daily' ? 'Daily' : key === 'weekly' ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>

          {/* Single green KPI — Outlet Visited only */}
          <div className="px-3 pb-4">
            <div
              className="rounded-2xl p-4 shadow-md ring-1 ring-white/20"
              style={{ background: `linear-gradient(160deg, ${BRAND.teal} 0%, ${BRAND.green} 100%)` }}
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <UserIcon size={18} className="text-white" strokeWidth={2} />
              </div>
              <div className="text-[12px] font-medium text-white/80">Outlet Visited</div>
              <div className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight text-white">
                {vp.visitA}
                <span className="text-[15px] font-normal text-white/50"> / {vp.visitT}</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-emerald-300/90 transition-all" style={{ width: `${pct(vp.visitA, vp.visitT)}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-3 mb-3 overflow-hidden rounded-2xl border border-[#e0e8e6] bg-white p-4 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.1)]">
          <h2 className="text-[15px] font-semibold tracking-tight text-[#1a1a1a]">Shortcuts</h2>
          <p className="mt-1 text-[11px] text-[#8a9190]">Other capture steps happen during the visit flow.</p>
          <button
            type="button"
            onClick={() => setActiveView('route')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold text-white shadow-md transition active:scale-[0.99]"
            style={{ background: BRAND.green }}
          >
            <MapPin size={18} strokeWidth={2} />
            Start visit
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setActiveView('route')}
              className="flex items-center gap-3 rounded-2xl border border-[#cfe8dc] bg-[#f8fcfa] px-3 py-3 text-left transition hover:bg-[#f0faf5] active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ background: BRAND.green }}>
                <Star size={16} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: BRAND.green }}>
                  Route map
                </div>
                <div className="text-[11px] text-[#7a8785]">{outlets.length} outlets</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('loyalty')}
              className="flex items-center gap-3 rounded-2xl border border-[#cfe8dc] bg-[#f8fcfa] px-3 py-3 text-left transition hover:bg-[#f0faf5] active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ background: BRAND.green }}>
                <Gift size={16} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: BRAND.green }}>
                  Rewards
                </div>
                <div className="text-[11px] text-[#7a8785]">Points & tiers</div>
              </div>
            </button>
          </div>
        </section>

        <section className="mx-3 mb-3 overflow-hidden rounded-2xl border border-[#e8eceb] bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="text-[15px] font-semibold text-[#1a1a1a]">Route Queue</div>
            <button type="button" onClick={() => setActiveView('route')} className="text-[12px] font-semibold" style={{ color: BRAND.green }}>
              See all ›
            </button>
          </div>
          <div className="relative mx-3 mb-2 flex h-[76px] items-center justify-center overflow-hidden rounded-xl border border-[#d4ebe4] bg-gradient-to-b from-[#f4fbf7] to-[#e8f5ef]">
            <div className="absolute left-[8%] right-[8%] top-1/2 h-0.5 -translate-y-1/2 bg-[#1a6b3c]/15" />
            <div className="relative z-[1] flex items-center justify-between px-2" style={{ width: '88%' }}>
              {routePreview.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full shadow-sm transition-all ${i === 0 ? 'h-3.5 w-3.5 bg-[#1a6b3c] ring-2 ring-[#1a6b3c]/25' : 'h-2.5 w-2.5 bg-[#b8dcc9]'}`}
                />
              ))}
            </div>
          </div>
          {routePreview.map((o, idx) => {
            const badge = o.category === 'Mobile Money' ? 'mm' : o.category === 'Agent' ? 'agent' : 'retail';
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setActiveVisit(o);
                  setActiveView('route');
                }}
                className="flex w-full items-center gap-3 border-t border-[#f0f3f2] px-4 py-3.5 text-left transition hover:bg-[#fafcfb] active:bg-[#f3f8f6]"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${idx === 0 ? 'bg-[#1a6b3c]' : 'bg-[#c5e0d0]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-[#1a1a1a]">{o.name}</div>
                  <span
                    className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      badge === 'mm' ? 'bg-[#eef2ff] text-[#4f46e5]' : 'bg-[#eaf5f0] text-[#1a6b3c]'
                    }`}
                  >
                    {o.category}
                  </span>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-[#a8b0ae]">{o.distance}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#ccc]" />
              </button>
            );
          })}
        </section>

        <section className="mx-3 mb-[max(1.25rem,env(safe-area-inset-bottom))] overflow-hidden rounded-2xl border border-[#e8eceb] bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3.5">
            <div className="text-[15px] font-bold tracking-tight" style={{ color: BRAND.green }}>
              Quick Links
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4 pb-5 sm:grid-cols-3">
            {[
              { label: 'My Tasks', icon: Calendar, onClick: () => setActiveView('plan') },
              { label: 'Performance', icon: TrendingUp, onClick: () => setActiveView('kpis') },
              { label: 'End of Day', icon: Clock, onClick: () => setActiveView('eod') },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={q.onClick}
                className="group flex flex-col items-center gap-2 rounded-xl py-1 transition active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#cfe8dc] bg-[#f0faf5] transition group-hover:bg-[#e5f5ed]">
                  <q.icon size={24} strokeWidth={1.75} style={{ color: BRAND.green }} />
                </div>
                <span className="text-center text-[11px] font-medium leading-snug text-[#3d4544]">{q.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
