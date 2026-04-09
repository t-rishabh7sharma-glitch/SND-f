import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Plus } from 'lucide-react';
import BoPageHeader from '../components/BoPageHeader';
import BoDrillDownPanel from '../components/BoDrillDownPanel';
import { useBoSuperAdminConfig, type TargetRollupRow } from '../../context/BoSuperAdminConfigContext';

export default function BoTargetsPage() {
  const {
    targets,
    targetRowOrder,
    moveTargetRow,
    addTargetRow,
    updateTargetRow,
    kpiCatalog,
  } = useBoSuperAdminConfig();
  const [selected, setSelected] = useState<TargetRollupRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    level: 'Team',
    nodeName: '',
    metricKey: 'kpi-visits',
    target: '',
    actual: '',
    period: 'MTD',
  });

  const rows = useMemo(() => {
    const m = new Map(targets.map((t) => [t.id, t]));
    return targetRowOrder.map((id) => m.get(id)).filter(Boolean) as TargetRollupRow[];
  }, [targets, targetRowOrder]);

  const kpiLabel = (key: string) => kpiCatalog.find((k) => k.id === key)?.label ?? key;

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <BoPageHeader
        title="Targets"
        breadcrumbs={['Back office', 'Performance', 'Targets']}
        action={
          <button type="button" onClick={() => setAddOpen(true)} className="btn-bo-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm">
            <Plus size={18} /> Add campaign row
          </button>
        }
      />

      <p className="text-sm text-bo-muted">
        Campaign roll-down rows: each line ties an org node to a KPI from the engine. Order defines how leadership reviews the cascade (same pattern as KPI ordering). Wire to{' '}
        <code className="rounded bg-bo-surface px-1">PATCH /bo/targets</code>.
      </p>

      <div className="bo-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 bg-bo-surface text-[10px] font-bold uppercase tracking-wider text-bo-muted">
            <tr>
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Node</th>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Actual</th>
              <th className="px-4 py-3">Period</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="cursor-pointer border-b border-black/5 transition hover:bg-bo-surface/80" onClick={() => setSelected(r)}>
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-0.5">
                    <button type="button" aria-label="Up" className="rounded p-1 hover:bg-bo-surface" onClick={() => moveTargetRow(r.id, -1)}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" aria-label="Down" className="rounded p-1 hover:bg-bo-surface" onClick={() => moveTargetRow(r.id, 1)}>
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-black">{r.level}</td>
                <td className="px-4 py-3 text-bo-muted">{r.nodeName}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-bo-secondary">{kpiLabel(r.metricKey)}</span>
                  <ChevronRight size={14} className="ml-1 inline text-bo-primary opacity-50" />
                </td>
                <td className="px-4 py-3 font-mono text-black">{r.target}</td>
                <td className="px-4 py-3 font-mono text-bo-muted">{r.actual}</td>
                <td className="px-4 py-3 text-bo-muted">{r.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BoDrillDownPanel open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.level} · ${selected.nodeName}` : ''} subtitle="Target line detail">
        {selected && (
          <div className="space-y-4 text-sm">
            <p className="text-bo-muted">
              This row rolls up <strong>{kpiLabel(selected.metricKey)}</strong> for reporting. Actuals typically sync from the warehouse; targets are patched by admins or ZBM/TDR per policy.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Level</label>
                <input
                  value={selected.level}
                  onChange={(e) => updateTargetRow(selected.id, { level: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Node name</label>
                <input
                  value={selected.nodeName}
                  onChange={(e) => updateTargetRow(selected.id, { nodeName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-bo-muted">KPI (from engine)</label>
                <select
                  value={selected.metricKey}
                  onChange={(e) => updateTargetRow(selected.id, { metricKey: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                >
                  {kpiCatalog.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Target</label>
                <input
                  value={selected.target}
                  onChange={(e) => updateTargetRow(selected.id, { target: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-sm outline-none focus:border-bo-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Actual</label>
                <input
                  value={selected.actual}
                  onChange={(e) => updateTargetRow(selected.id, { actual: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-sm outline-none focus:border-bo-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Period</label>
                <input
                  value={selected.period}
                  onChange={(e) => updateTargetRow(selected.id, { period: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
                />
              </div>
            </div>
          </div>
        )}
      </BoDrillDownPanel>

      <BoDrillDownPanel open={addOpen} onClose={() => setAddOpen(false)} title="Add target row">
        <div className="space-y-4">
          {(['level', 'nodeName', 'target', 'actual', 'period'] as const).map((field) => (
            <div key={field}>
              <label className="text-[10px] font-bold uppercase text-bo-muted">{field}</label>
              <input
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">KPI</label>
            <select
              value={form.metricKey}
              onChange={(e) => setForm((f) => ({ ...f, metricKey: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            >
              {kpiCatalog.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!form.nodeName.trim()) return;
              addTargetRow({
                level: form.level,
                nodeName: form.nodeName.trim(),
                metricKey: form.metricKey,
                target: form.target || '0',
                actual: form.actual || '0',
                period: form.period || 'MTD',
              });
              setAddOpen(false);
            }}
            className="btn-bo-primary w-full rounded-lg py-3 text-sm font-bold"
          >
            Save row
          </button>
        </div>
      </BoDrillDownPanel>
    </div>
  );
}
