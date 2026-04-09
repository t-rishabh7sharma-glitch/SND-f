import React, { useMemo, useState } from 'react';
import { ChevronRight, Layers, Plus, Trash2 } from 'lucide-react';
import BoPageHeader from '../components/BoPageHeader';
import BoDrillDownPanel from '../components/BoDrillDownPanel';
import { useBoSuperAdminConfig, ORG_LEVELS, type HierarchyNode, type OrgLevel } from '../../context/BoSuperAdminConfigContext';

const LEVEL_RANK: Record<OrgLevel, number> = {
  ZBM: 0,
  TDR: 1,
  TL: 2,
  ASE: 3,
};

function nextLevel(level: OrgLevel): OrgLevel | null {
  const r = LEVEL_RANK[level];
  const next = ORG_LEVELS.find((l) => LEVEL_RANK[l] === r + 1);
  return next ?? null;
}

export default function BoHierarchyPage() {
  const { hierarchy, addHierarchyNode, updateHierarchyNode, removeHierarchyNode } = useBoSuperAdminConfig();
  const [selected, setSelected] = useState<HierarchyNode | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', level: 'ZBM' as OrgLevel, description: '' });

  const byLevel = useMemo(() => {
    const map = new Map<number, HierarchyNode[]>();
    hierarchy.forEach((n) => {
      const rank = LEVEL_RANK[n.level];
      if (!map.has(rank)) map.set(rank, []);
      map.get(rank)!.push(n);
    });
    map.forEach((arr) => arr.sort((a, b) => a.label.localeCompare(b.label)));
    return map;
  }, [hierarchy]);

  const ranks = useMemo(() => [...byLevel.keys()].sort((a, b) => a - b), [byLevel]);

  const openAdd = (parent: HierarchyNode | null) => {
    setAddParentId(parent?.id ?? null);
    const lvl = parent ? nextLevel(parent.level) : 'ZBM';
    setForm({
      label: '',
      level: (lvl || 'ASE') as OrgLevel,
      description: '',
    });
    setAddOpen(true);
  };

  const submitAdd = () => {
    if (!form.label.trim()) return;
    addHierarchyNode({
      label: form.label.trim(),
      level: form.level,
      parentId: addParentId,
      description: form.description.trim() || 'New organisation node.',
    });
    setAddOpen(false);
  };

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <BoPageHeader
        title="Hierarchy"
        breadcrumbs={['Back office', 'Organisation', 'Hierarchy']}
        action={
          <button type="button" onClick={() => openAdd(null)} className="btn-bo-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm">
            <Plus size={18} /> Add ZBM (zone)
          </button>
        }
      />

      <p className="text-sm text-bo-muted">
        Pyramid follows <strong>ZBM → TDR → TL → ASE</strong>. Root nodes are zones (ZBM). Click a node for details and to add the next level down. Syncs with{' '}
        <code className="rounded bg-bo-surface px-1">/bo/hierarchy</code>.
      </p>

      <div className="bo-card overflow-hidden bg-gradient-to-b from-bo-surface to-white p-8">
        <div className="mb-8 flex items-center gap-2 text-bo-secondary">
          <Layers size={22} className="text-bo-primary" />
          <h2 className="text-base font-bold">Organisation pyramid</h2>
        </div>

        <div className="flex flex-col items-center gap-6">
          {ranks.map((rank) => {
            const nodes = byLevel.get(rank) ?? [];
            return (
              <div key={rank} className="flex w-full flex-col items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-bo-muted">
                  {nodes[0]?.level ?? (Object.keys(LEVEL_RANK).find((l) => LEVEL_RANK[l as OrgLevel] === rank) as OrgLevel)}
                </span>
                <div
                  className="flex flex-wrap justify-center gap-3"
                  style={{ maxWidth: `${Math.min(100, 40 + nodes.length * 18)}%` }}
                >
                  {nodes.map((node) => {
                    const children = hierarchy.filter((c) => c.parentId === node.id);
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelected(node)}
                        className="group relative min-w-[140px] max-w-[200px] rounded-xl border-2 border-bo-primary/25 bg-white px-4 py-3 text-left shadow-sm transition hover:border-bo-primary hover:shadow-md"
                      >
                        <div className="text-xs font-bold text-bo-secondary line-clamp-2">{node.label}</div>
                        <div className="mt-1 text-[10px] text-bo-muted">{children.length} direct reports</div>
                        <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-bo-primary opacity-0 transition group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </div>
                {rank < 3 && <div className="h-6 w-px bg-gradient-to-b from-bo-primary/40 to-bo-secondary/20" aria-hidden />}
              </div>
            );
          })}
        </div>
      </div>

      <BoDrillDownPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.label ?? ''}
        subtitle={selected ? `${selected.level} · org node` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-bo-muted">Explanation</p>
              <p className="mt-2 text-sm text-black">{selected.description}</p>
            </div>
            {selected.metricHint && (
              <div className="rounded-xl border border-black/5 bg-bo-surface p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-bo-muted">Typical metrics</p>
                <p className="mt-1 text-sm font-semibold text-bo-secondary">{selected.metricHint}</p>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Edit description</label>
              <textarea
                value={selected.description}
                onChange={(e) => updateHierarchyNode(selected.id, { description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-bo-primary focus:ring-2 focus:ring-bo-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {nextLevel(selected.level) && (
                <button
                  type="button"
                  onClick={() => {
                    openAdd(selected);
                    setSelected(null);
                  }}
                  className="btn-bo-primary rounded-lg px-4 py-2 text-sm font-bold"
                >
                  <Plus size={16} className="mr-1 inline" /> Add child ({nextLevel(selected.level)})
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Remove this node and any children below it in the list?')) {
                    removeHierarchyNode(selected.id);
                    setSelected(null);
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-bo-muted">Direct reports</p>
              <ul className="mt-2 space-y-2">
                {hierarchy
                  .filter((c) => c.parentId === selected.id)
                  .map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => setSelected(c)} className="w-full rounded-lg border border-black/5 bg-bo-surface px-3 py-2 text-left text-sm font-semibold text-black hover:border-bo-primary/40">
                        {c.label} <span className="text-bo-muted">· {c.level}</span>
                      </button>
                    </li>
                  ))}
                {hierarchy.filter((c) => c.parentId === selected.id).length === 0 && (
                  <li className="text-sm text-bo-muted">No children yet — add a child node.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </BoDrillDownPanel>

      <BoDrillDownPanel open={addOpen} onClose={() => setAddOpen(false)} title="Add organisation node" subtitle="Creates a row for API sync when wired.">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Label</label>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary focus:ring-2 focus:ring-bo-primary/20"
              placeholder="e.g. ZBM · Central"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Level</label>
            <select
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as OrgLevel }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            >
              {ORG_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <button type="button" onClick={submitAdd} className="btn-bo-primary w-full rounded-lg py-3 text-sm font-bold">
            Save node
          </button>
        </div>
      </BoDrillDownPanel>
    </div>
  );
}
