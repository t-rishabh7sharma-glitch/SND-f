import React from 'react';
import { LogOut, Trophy } from 'lucide-react';
import type { User } from '../../types';
import KpiModule from './KpiModule';
import { MOCK_ASE_STATUSES } from '../../data/fieldMocks';

type Props = {
  user: User;
  sessionKpis: { visits: number; grossAdditions: number; agentActivation: number; floatChecks: number };
  onLogout: () => void;
};

export default function FieldProfileView({ user, sessionKpis, onLogout }: Props) {
  const board = [...MOCK_ASE_STATUSES]
    .filter((a) => a.status === 'Active')
    .sort((a, b) => (b.visitsToday ?? 0) - (a.visitsToday ?? 0));
  const rankIdx = board.findIndex((a) => a.id === user.id);
  const rankDisplay = rankIdx >= 0 ? String(rankIdx + 1) : '—';

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#f0f4f3] pb-4">
      <div className="bg-primary px-[max(1rem,env(safe-area-inset-left))] pb-8 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 text-xl font-black">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-[clamp(1rem,4vw,1.125rem)] font-bold">{user.name}</h1>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              {user.id} · ASE
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col px-3 [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))]">
      {/* KPIs first — single “performance” block; no duplicate team rank (that’s in Leaderboard below) */}
      <div className="-mt-4 mx-0">
        <h2 className="mb-2 px-1 text-sm font-black uppercase tracking-widest text-on-surface-variant">Performance &amp; KPIs</h2>
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <KpiModule sessionKpis={sessionKpis} hideTeamRankBadge />
        </div>
      </div>

      <div className="mx-0 mt-4 rounded-2xl border border-black/5 bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2 text-primary">
          <Trophy size={18} />
          <h2 className="text-sm font-black uppercase tracking-widest">Team leaderboard</h2>
        </div>
        <p className="mt-2 text-[11px] text-on-surface-variant">
          You are #{rankDisplay} in your team (by visits today).
        </p>
        <ul className="mt-3 space-y-2">
          {board.slice(0, 6).map((row, i) => (
            <li
              key={row.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                row.id === user.id ? 'border border-primary/25 bg-primary/10 font-bold text-primary' : 'bg-surface-container-low'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-xs font-bold text-on-surface-variant">
                  {i + 1}
                </span>
                <span>{row.id === user.id ? `You (${row.name})` : row.name}</span>
              </span>
              <span className="tabular-nums text-xs text-on-surface-variant">{row.visitsToday ?? 0} visits</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-0 mt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-rag-red/30 py-3.5 text-sm font-bold text-rag-red transition hover:bg-rag-red-bg"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
      </div>
    </div>
  );
}
