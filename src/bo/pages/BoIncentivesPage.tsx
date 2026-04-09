import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Plus } from 'lucide-react';
import BoPageHeader from '../components/BoPageHeader';
import BoDrillDownPanel from '../components/BoDrillDownPanel';
import { useBoSuperAdminConfig, type IncentivePlanRow } from '../../context/BoSuperAdminConfigContext';

const ROLE_OPTS = ['ASE', 'TL', 'TDR', 'ZBM', 'REBALANCER', 'ADMIN'] as const;

export default function BoIncentivesPage() {
  const { incentives, incentiveRowOrder, moveIncentiveRow, addIncentiveRow, updateIncentiveRow } = useBoSuperAdminConfig();
  const [selected, setSelected] = useState<IncentivePlanRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    planName: '',
    slabLabel: '',
    payoutRule: '',
    appliesToRoles: 'ASE, TL' as string,
    active: true,
  });

  const rows = useMemo(() => {
    const m = new Map(incentives.map((i) => [i.id, i]));
    return incentiveRowOrder.map((id) => m.get(id)).filter(Boolean) as IncentivePlanRow[];
  }, [incentives, incentiveRowOrder]);

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <BoPageHeader
        title="Incentives"
        breadcrumbs={['Back office', 'Performance', 'Incentives']}
        action={
          <button type="button" onClick={() => setAddOpen(true)} className="btn-bo-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm">
            <Plus size={18} /> Add slab / plan
          </button>
        }
      />

      <p className="text-sm text-bo-muted">
        Slab and bonus plans (read-only API in MVP). Order controls how plans appear in comms and payroll handoff. Super Admin configures definitions; ZBM-facing order can mirror production by moving zonal plans up.
      </p>

      <div className="bo-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 bg-bo-surface text-[10px] font-bold uppercase tracking-wider text-bo-muted">
            <tr>
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Slab</th>
              <th className="px-4 py-3">Payout</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="cursor-pointer border-b border-black/5 transition hover:bg-bo-surface/80" onClick={() => setSelected(r)}>
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-0.5">
                    <button type="button" className="rounded p-1 hover:bg-bo-surface" onClick={() => moveIncentiveRow(r.id, -1)}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" className="rounded p-1 hover:bg-bo-surface" onClick={() => moveIncentiveRow(r.id, 1)}>
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-black">
                  {r.planName}
                  <ChevronRight size={14} className="ml-1 inline text-bo-primary opacity-50" />
                </td>
                <td className="px-4 py-3 text-bo-muted">{r.slabLabel}</td>
                <td className="px-4 py-3 text-bo-secondary">{r.payoutRule}</td>
                <td className="px-4 py-3 text-xs text-bo-muted">{r.appliesToRoles.join(', ')}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${r.active ? 'bg-emerald-100 text-emerald-800' : 'bg-black/5 text-bo-muted'}`}>
                    {r.active ? 'On' : 'Off'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BoDrillDownPanel open={!!selected} onClose={() => setSelected(null)} title={selected?.planName ?? ''} subtitle="Incentive rule">
        {selected && (
          <div className="space-y-4 text-sm">
            <p className="text-bo-muted">
              Eligibility and accrual are evaluated in the incentives service. This panel is for catalog metadata and rollout flags until mutate APIs ship.
            </p>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Plan name</label>
              <input
                value={selected.planName}
                onChange={(e) => updateIncentiveRow(selected.id, { planName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Slab label</label>
              <input
                value={selected.slabLabel}
                onChange={(e) => updateIncentiveRow(selected.id, { slabLabel: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Payout rule</label>
              <input
                value={selected.payoutRule}
                onChange={(e) => updateIncentiveRow(selected.id, { payoutRule: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Applies to roles</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {ROLE_OPTS.map((role) => (
                  <label key={role} className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={selected.appliesToRoles.includes(role)}
                      onChange={() => {
                        const set = new Set(selected.appliesToRoles);
                        if (set.has(role)) set.delete(role);
                        else set.add(role);
                        updateIncentiveRow(selected.id, { appliesToRoles: [...set] });
                      }}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={selected.active}
                onChange={(e) => updateIncentiveRow(selected.id, { active: e.target.checked })}
              />
              Active in catalog
            </label>
          </div>
        )}
      </BoDrillDownPanel>

      <BoDrillDownPanel open={addOpen} onClose={() => setAddOpen(false)} title="Add incentive row">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Plan name</label>
            <input
              value={form.planName}
              onChange={(e) => setForm((f) => ({ ...f, planName: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Slab</label>
            <input
              value={form.slabLabel}
              onChange={(e) => setForm((f) => ({ ...f, slabLabel: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Payout rule</label>
            <input
              value={form.payoutRule}
              onChange={(e) => setForm((f) => ({ ...f, payoutRule: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Roles (comma-separated)</label>
            <input
              value={form.appliesToRoles}
              onChange={(e) => setForm((f) => ({ ...f, appliesToRoles: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Active
          </label>
          <button
            type="button"
            onClick={() => {
              if (!form.planName.trim()) return;
              const roles = form.appliesToRoles
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean) as IncentivePlanRow['appliesToRoles'];
              addIncentiveRow({
                planName: form.planName.trim(),
                slabLabel: form.slabLabel.trim() || '—',
                payoutRule: form.payoutRule.trim() || '—',
                appliesToRoles: roles.length ? roles : ['ASE'],
                active: form.active,
              });
              setAddOpen(false);
            }}
            className="btn-bo-primary w-full rounded-lg py-3 text-sm font-bold"
          >
            Save
          </button>
        </div>
      </BoDrillDownPanel>
    </div>
  );
}
