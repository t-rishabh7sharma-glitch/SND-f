import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Settings2 } from 'lucide-react';
import BoPageHeader from '../components/BoPageHeader';
import BoDrillDownPanel from '../components/BoDrillDownPanel';
import {
  useBoSuperAdminConfig,
  KPI_ORDER_ROLES,
  type BoKpiCatalogItem,
  type KpiOrderRole,
} from '../../context/BoSuperAdminConfigContext';

export default function BoKpiEnginePage() {
  const {
    kpiCatalog,
    updateKpiItem,
    kpiOrderByRole,
    moveKpiInRoleOrder,
    setKpiOrderForRole,
  } = useBoSuperAdminConfig();
  const [tab, setTab] = useState<'catalog' | 'order'>('catalog');
  const [selected, setSelected] = useState<BoKpiCatalogItem | null>(null);
  const [orderRole, setOrderRole] = useState<KpiOrderRole>('ZBM');

  const orderedForRole = useMemo(() => {
    const ids = kpiOrderByRole[orderRole];
    const map = new Map(kpiCatalog.map((k) => [k.id, k]));
    return ids.map((id) => map.get(id)).filter(Boolean) as BoKpiCatalogItem[];
  }, [kpiOrderByRole, orderRole, kpiCatalog]);

  const syncOrderWithVisibility = (role: KpiOrderRole) => {
    const visible = kpiCatalog.filter((x) => x.enabled && x.dashboards.includes(role)).map((x) => x.id);
    const current = kpiOrderByRole[role];
    const merged = [...current.filter((id) => visible.includes(id)), ...visible.filter((id) => !current.includes(id))];
    setKpiOrderForRole(role, merged);
  };

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <BoPageHeader title="KPI engine" breadcrumbs={['Back office', 'Performance', 'KPI engine']} />

      <p className="text-sm text-bo-muted">
        Single catalog of metrics used across field and management dashboards. Super Admin defines definitions and visibility; each role has its own <strong>display order</strong>{' '}
        (ZBM can reorder what their zonal console surfaces first — same pattern for TDR, TL, ASE, Rebalancer in production).
      </p>

      <div className="flex gap-2 border-b border-black/10 pb-2">
        {(
          [
            ['catalog', 'Metric catalog'],
            ['order', 'Display order by role'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === id ? 'bg-bo-secondary text-white' : 'text-bo-muted hover:bg-bo-surface'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'catalog' && (
        <div className="bo-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-bo-surface text-[10px] font-bold uppercase tracking-wider text-bo-muted">
              <tr>
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Dashboards</th>
                <th className="px-4 py-3">On</th>
              </tr>
            </thead>
            <tbody>
              {kpiCatalog.map((k) => (
                <tr key={k.id} className="cursor-pointer border-b border-black/5 transition hover:bg-bo-surface/80" onClick={() => setSelected(k)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-semibold text-black">
                      {k.label}
                      <ChevronRight size={14} className="text-bo-primary opacity-60" />
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-bo-muted">{k.key}</div>
                  </td>
                  <td className="px-4 py-3 text-bo-muted">{k.unit}</td>
                  <td className="px-4 py-3 text-bo-muted">{k.frequency}</td>
                  <td className="px-4 py-3 text-xs text-bo-muted">{k.dashboards.join(', ')}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateKpiItem(k.id, { enabled: !k.enabled });
                      }}
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${k.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-black/5 text-bo-muted'}`}
                    >
                      {k.enabled ? 'Yes' : 'No'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'order' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase text-bo-muted">Role view</span>
            <select
              value={orderRole}
              onChange={(e) => setOrderRole(e.target.value as KpiOrderRole)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-bold text-bo-secondary outline-none focus:border-bo-primary"
            >
              {KPI_ORDER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => syncOrderWithVisibility(orderRole)}
              className="flex items-center gap-1 rounded-lg border border-black/10 px-3 py-2 text-xs font-bold text-bo-secondary hover:bg-bo-surface"
            >
              <Settings2 size={14} /> Sync with enabled metrics
            </button>
          </div>
          <p className="text-xs text-bo-muted">
            Order controls how tiles and tables appear for that role in the app. ZBM users typically reorder zone-level KPIs here; TDR/TL follow the same mechanism with their own lists.
          </p>
          <ul className="bo-card divide-y divide-black/5 p-0">
            {orderedForRole.map((k, idx) => (
              <li key={k.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-8 text-center text-xs font-bold text-bo-muted">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-black">{k.label}</p>
                  <p className="text-[10px] text-bo-muted">{k.unit} · {k.frequency}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => moveKpiInRoleOrder(orderRole, k.id, -1)}
                    className="rounded-lg border border-black/10 p-2 hover:bg-bo-surface"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => moveKpiInRoleOrder(orderRole, k.id, 1)}
                    className="rounded-lg border border-black/10 p-2 hover:bg-bo-surface"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </li>
            ))}
            {orderedForRole.length === 0 && <li className="px-4 py-8 text-center text-sm text-bo-muted">No metrics for this role — enable KPIs that include this dashboard tag.</li>}
          </ul>
        </div>
      )}

      <BoDrillDownPanel open={!!selected} onClose={() => setSelected(null)} title={selected?.label ?? ''} subtitle="Metric definition">
        {selected && (
          <div className="space-y-4 text-sm">
            <p className="text-bo-muted">{selected.description}</p>
            <div className="rounded-xl bg-bo-surface p-4">
              <p className="text-[10px] font-bold uppercase text-bo-muted">Formula (reference)</p>
              <code className="mt-1 block text-xs text-bo-secondary">{selected.formula}</code>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Label</label>
                <input
                  value={selected.label}
                  onChange={(e) => updateKpiItem(selected.id, { label: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Unit</label>
                <input
                  value={selected.unit}
                  onChange={(e) => updateKpiItem(selected.id, { unit: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Frequency</label>
                <select
                  value={selected.frequency}
                  onChange={(e) => updateKpiItem(selected.id, { frequency: e.target.value as BoKpiCatalogItem['frequency'] })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                >
                  {(['Daily', 'Weekly', 'Monthly'] as const).map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Technical key</label>
                <input
                  value={selected.key}
                  onChange={(e) => updateKpiItem(selected.id, { key: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-bo-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Description</label>
              <textarea
                value={selected.description}
                onChange={(e) => updateKpiItem(selected.id, { description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Formula</label>
              <input
                value={selected.formula}
                onChange={(e) => updateKpiItem(selected.id, { formula: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-bo-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Dashboards (comma-separated)</label>
              <input
                value={selected.dashboards.join(', ')}
                onChange={(e) =>
                  updateKpiItem(selected.id, {
                    dashboards: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                placeholder="ASE, TL, ZBM"
              />
            </div>
          </div>
        )}
      </BoDrillDownPanel>
    </div>
  );
}
