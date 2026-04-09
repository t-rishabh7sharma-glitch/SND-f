import React, { useMemo, useState } from 'react';
import { MapPin, Plus, Trash2, Grid3x3 } from 'lucide-react';
import BoPageHeader from '../components/BoPageHeader';
import BoDrillDownPanel from '../components/BoDrillDownPanel';
import { useBoSuperAdminConfig, type TerritoryRecord } from '../../context/BoSuperAdminConfigContext';

export default function BoTerritoryPage() {
  const { territory, addTerritoryNode, updateTerritoryNode, removeTerritoryNode } = useBoSuperAdminConfig();
  const [selected, setSelected] = useState<TerritoryRecord | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [parentForAdd, setParentForAdd] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '', routeGroups: 1, activeDsas: 0, description: '' });

  const roots = useMemo(() => territory.filter((t) => t.parentId === null), [territory]);

  const childrenOf = (id: string) => territory.filter((t) => t.parentId === id);

  const openAdd = (parentId: string | null) => {
    setParentForAdd(parentId);
    setForm({ name: '', code: '', routeGroups: 1, activeDsas: 0, description: '' });
    setAddOpen(true);
  };

  const submitAdd = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    addTerritoryNode({
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      routeGroups: Math.max(1, form.routeGroups),
      activeDsas: Math.max(0, form.activeDsas),
      parentId: parentForAdd,
      description: form.description.trim() || 'Territory coverage area.',
    });
    setAddOpen(false);
  };

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <BoPageHeader
        title="Territory"
        breadcrumbs={['Back office', 'Organisation', 'Territory']}
        action={
          <button type="button" onClick={() => openAdd(null)} className="btn-bo-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm">
            <Plus size={18} /> Add territory
          </button>
        }
      />

      <div className="rounded-xl border border-black/5 bg-bo-surface px-4 py-3 text-sm text-bo-muted">
        <p>
          <strong className="text-bo-secondary">Route groups</strong> = how many distinct TL-level outlet / daily-route groupings sit under this territory (not the same as{' '}
          <em>child territories</em> in the hierarchy). It is a planning count for coverage and float logistics — not a term your field teams need to use day to day.
        </p>
      </div>

      <p className="text-sm text-bo-muted">
        Coverage map: each card is clickable for drill-down and edits. Syncs with <code className="rounded bg-bo-surface px-1">/bo/territory</code>.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {roots.map((t) => {
          const kids = childrenOf(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              className="bo-card group relative overflow-hidden p-6 text-left transition hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-bo-primary/10 via-transparent to-bo-secondary/10 opacity-80" />
              <div className="relative">
                <div className="flex items-center gap-2 text-bo-secondary">
                  <MapPin size={20} className="text-bo-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-bo-muted">{t.code}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-black">{t.name}</h3>
                <div className="mt-4 flex gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-bo-muted">Route groups</p>
                    <p className="font-bold text-bo-secondary">{t.routeGroups}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-bo-muted">Active DSAs</p>
                    <p className="font-bold text-bo-secondary">{t.activeDsas}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-bo-muted">Child rows</p>
                    <p className="font-bold text-bo-secondary">{kids.length}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-bo-muted">{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {roots.length === 0 && (
        <div className="bo-card flex flex-col items-center justify-center py-16 text-center">
          <Grid3x3 className="text-bo-primary/40" size={40} />
          <p className="mt-4 text-sm text-bo-muted">No territories yet. Add a root territory to start.</p>
        </div>
      )}

      <BoDrillDownPanel open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={selected ? `Code ${selected.code}` : undefined}>
        {selected && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase text-bo-muted">Coverage summary</p>
              <p className="mt-2 text-sm text-black">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Route groups</label>
                <p className="mb-1 text-[10px] text-bo-muted">TL outlet / route groupings</p>
                <input
                  type="number"
                  min={1}
                  value={selected.routeGroups}
                  onChange={(e) => updateTerritoryNode(selected.id, { routeGroups: Number(e.target.value) || 1 })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-bold outline-none focus:border-bo-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-bo-muted">Active DSAs</label>
                <input
                  type="number"
                  min={0}
                  value={selected.activeDsas}
                  onChange={(e) => updateTerritoryNode(selected.id, { activeDsas: Number(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-bold outline-none focus:border-bo-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Description</label>
              <textarea
                value={selected.description}
                onChange={(e) => updateTerritoryNode(selected.id, { description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { openAdd(selected.id); setSelected(null); }} className="btn-bo-primary rounded-lg px-4 py-2 text-sm font-bold">
                <Plus size={16} className="mr-1 inline" /> Add child territory
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Remove this territory and nested areas?')) {
                    removeTerritoryNode(selected.id);
                    setSelected(null);
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-bo-muted">Child territories</p>
              <ul className="mt-2 space-y-2">
                {childrenOf(selected.id).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="flex w-full items-center justify-between rounded-lg border border-black/5 bg-bo-surface px-3 py-2 text-left text-sm font-semibold hover:border-bo-primary/40"
                    >
                      <span>
                        {c.name} <span className="text-bo-muted">({c.code})</span>
                      </span>
                      <span className="text-xs text-bo-muted">{c.routeGroups} route groups</span>
                    </button>
                  </li>
                ))}
                {childrenOf(selected.id).length === 0 && <li className="text-sm text-bo-muted">No nested territories.</li>}
              </ul>
            </div>
          </div>
        )}
      </BoDrillDownPanel>

      <BoDrillDownPanel open={addOpen} onClose={() => setAddOpen(false)} title="Add territory" subtitle={parentForAdd ? 'Nested under selected parent' : 'Root coverage'}>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Code</label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              placeholder="ME-04"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Route groups</label>
              <p className="mb-1 text-[10px] leading-snug text-bo-muted">TL-level groupings</p>
              <input
                type="number"
                min={1}
                value={form.routeGroups}
                onChange={(e) => setForm((f) => ({ ...f, routeGroups: Number(e.target.value) }))}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-bo-muted">Active DSAs</label>
              <input
                type="number"
                min={0}
                value={form.activeDsas}
                onChange={(e) => setForm((f) => ({ ...f, activeDsas: Number(e.target.value) }))}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-bo-muted">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-bo-primary"
            />
          </div>
          <button type="button" onClick={submitAdd} className="btn-bo-primary w-full rounded-lg py-3 text-sm font-bold">
            Save
          </button>
        </div>
      </BoDrillDownPanel>
    </div>
  );
}
