import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Users, MapPin, Activity, Target, ChevronRight,
  Smartphone, ShieldAlert, BarChart3, CreditCard, AlertTriangle,
  ChevronLeft, X
} from 'lucide-react';
import {
  ZONE_TARGETS, TERRITORY_TARGETS, TEAM_TARGETS, ASE_DAILY_TARGETS,
  KpiTarget, getAchievementPct, ragColor, ragBg
} from '../../data/kpiStore';

interface ZonalOverviewProps {
  onAction: (message: string) => void;
}

type DrillLevel = 'zone' | 'territory' | 'team';

const ZonalOverview: React.FC<ZonalOverviewProps> = ({ onAction }) => {
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('zone');
  const [selectedTdrId, setSelectedTdrId] = useState<string | null>(null);
  const [selectedTlId, setSelectedTlId] = useState<string | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<KpiTarget | null>(null);

  const selectedTerritory = TERRITORY_TARGETS.find(t => t.tdrId === selectedTdrId);
  const selectedTeam = TEAM_TARGETS.find(t => t.tlId === selectedTlId);
  const teamAses = ASE_DAILY_TARGETS.filter(a => a.tlId === selectedTlId);

  // All 5 KPI categories for Zone
  const zoneKpis: { kpi: KpiTarget; icon: React.ReactNode; color: string }[] = [
    { kpi: ZONE_TARGETS.totalDSA, icon: <Users size={14} />, color: 'bg-primary' },
    { kpi: ZONE_TARGETS.activeDSA, icon: <Users size={14} />, color: 'bg-primary/80' },
    { kpi: ZONE_TARGETS.transactingAgents, icon: <Activity size={14} />, color: 'bg-blue-600' },
    { kpi: ZONE_TARGETS.grossAdditions, icon: <TrendingUp size={14} />, color: 'bg-rag-green' },
    { kpi: ZONE_TARGETS.momoGA, icon: <Smartphone size={14} />, color: 'bg-indigo-600' },
    { kpi: ZONE_TARGETS.agentRecruitment, icon: <Users size={14} />, color: 'bg-purple-600' },
    { kpi: ZONE_TARGETS.merchantRecruitment, icon: <Users size={14} />, color: 'bg-violet-600' },
    { kpi: ZONE_TARGETS.cashAvailability, icon: <CreditCard size={14} />, color: 'bg-teal-600' },
    { kpi: ZONE_TARGETS.floatAvailability, icon: <Activity size={14} />, color: 'bg-rag-amber' },
    { kpi: ZONE_TARGETS.servicedCustomers, icon: <Users size={14} />, color: 'bg-cyan-600' },
    { kpi: ZONE_TARGETS.transactionValue, icon: <CreditCard size={14} />, color: 'bg-emerald-600' },
    { kpi: ZONE_TARGETS.totalVisitations, icon: <MapPin size={14} />, color: 'bg-rose-600' },
    { kpi: ZONE_TARGETS.brandingCompliance, icon: <ShieldAlert size={14} />, color: 'bg-orange-600' },
  ];

  // Resource allocation state — ZBM allocates to TDRs
  const allocationFields = [
    { key: 'grossAdditions', label: 'SIMs', unit: 'SIMs' },
    { key: 'momoGA', label: 'MoMo', unit: 'Users' },
    { key: 'floatAvailability', label: 'Float', unit: 'ZMW' },
    { key: 'cashAvailability', label: 'Cash', unit: 'ZMW' },
  ];

  const [allocations, setAllocations] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    TERRITORY_TARGETS.forEach(t => {
      init[t.tdrId] = {
        grossAdditions: t.grossAdditions.target,
        momoGA: t.momoGA.target,
        floatAvailability: t.floatAvailability.target,
        cashAvailability: t.cashAvailability.target,
      };
    });
    return init;
  });

  const handleDrillTerritory = (tdrId: string) => {
    setSelectedTdrId(tdrId);
    setDrillLevel('territory');
  };

  const handleDrillTeam = (tlId: string) => {
    setSelectedTlId(tlId);
    setDrillLevel('team');
  };

  const handleBack = () => {
    if (drillLevel === 'team') { setDrillLevel('territory'); setSelectedTlId(null); }
    else { setDrillLevel('zone'); setSelectedTdrId(null); }
  };

  const renderKpiRow = (kpis: KpiTarget[]) => (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
      {kpis.map((kpi, i) => {
        const pct = getAchievementPct(kpi.target, kpi.actual);
        return (
          <div key={i} className="bg-white rounded-xl p-2.5 border border-black/5">
            <div className="text-[7px] font-black text-on-surface-variant/40 uppercase truncate mb-0.5">{kpi.label}</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-base font-black font-display ${ragColor(pct)}`}>{kpi.actual.toLocaleString()}</span>
              <span className="text-[8px] text-on-surface-variant/30">/ {kpi.target.toLocaleString()}</span>
            </div>
            <div className="text-[7px] font-bold text-on-surface-variant/25 uppercase">{kpi.unit}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {drillLevel === 'zone' && (
          <motion.div key="zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">{ZONE_TARGETS.zoneName}</h1>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{ZONE_TARGETS.period} • Zonal Business Manager</p>
              </div>
              <div className="text-[8px] font-black bg-primary text-white px-3 py-1.5 rounded-xl uppercase tracking-widest shadow">{ZONE_TARGETS.period}</div>
            </div>

            {/* All 13 KPI Cards — Dense Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-7 gap-2">
              {zoneKpis.map((card, i) => {
                const pct = getAchievementPct(card.kpi.target, card.kpi.actual);
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedKpi(card.kpi)}
                    className="bg-white rounded-xl p-2.5 border border-black/5 hover:border-primary/50 cursor-pointer transition-all shadow-sm hover:shadow"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className={`p-1 flex items-center justify-center rounded-md ${card.color} text-white`}>{card.icon}</div>
                      <span className="text-[6px] font-black uppercase tracking-tight text-on-surface-variant truncate">{card.kpi.label}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className={`text-sm font-black font-display flex-1 ${ragColor(pct)}`}>{card.kpi.actual.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[7px] text-on-surface-variant/40">Target: {card.kpi.target.toLocaleString()}</span>
                      <span className="text-[6px] font-bold text-on-surface-variant/30 uppercase bg-surface-container px-1 py-0.5 rounded">{card.kpi.unit}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Resource Allocation to TDRs */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-primary" />
                  <h2 className="text-[10px] font-black text-primary uppercase tracking-widest">Monthly Target & Resource Allocation to TDRs</h2>
                </div>
                <button onClick={() => onAction('Zone targets saved.')} className="btn bg-primary text-white text-[8px] px-3 py-1.5 font-black rounded-lg uppercase shadow">Save</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-2 text-[8px] font-black text-primary uppercase tracking-widest">Territory (TDR)</th>
                      {allocationFields.map(f => (
                        <th key={f.key} className="p-2 text-[7px] font-black text-primary uppercase tracking-widest text-center">{f.label}<br/><span className="text-primary/40">({f.unit})</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {TERRITORY_TARGETS.map(terr => (
                      <tr key={terr.tdrId}>
                        <td className="p-2">
                          <div className="text-[10px] font-black">{terr.territoryName}</div>
                          <div className="text-[7px] font-bold text-on-surface-variant/40">{terr.tdrName}</div>
                        </td>
                        {allocationFields.map(f => (
                          <td key={f.key} className="p-2">
                            <input
                              type="number"
                              value={allocations[terr.tdrId]?.[f.key] === 0 ? '' : (allocations[terr.tdrId]?.[f.key] || '')}
                              placeholder="0"
                              onFocus={(e) => e.target.select()}
                              onChange={e => {
                                const raw = e.target.value;
                                const val = raw === '' ? 0 : parseInt(raw);
                                if (!isNaN(val)) setAllocations(prev => ({
                                  ...prev,
                                  [terr.tdrId]: { ...prev[terr.tdrId], [f.key]: val }
                                }));
                              }}
                              className="w-full bg-white border border-primary/20 rounded-lg px-2 py-1.5 text-xs font-bold text-center outline-none focus:border-primary"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-primary/10">
                      <td className="p-2 text-[9px] font-black text-primary uppercase">Zone Total</td>
                      {allocationFields.map(f => {
                        const allocated = Object.values(allocations).reduce((s, a) => s + (a[f.key] || 0), 0);
                        const zoneTarget = (ZONE_TARGETS as any)[f.key]?.target || 0;
                        return (
                          <td key={f.key} className="p-2 text-center">
                            <span className={`text-xs font-black ${allocated === zoneTarget ? 'text-rag-green' : 'text-rag-amber'}`}>{allocated.toLocaleString()}</span>
                            <span className="text-[7px] text-primary/40 ml-1">/ {zoneTarget.toLocaleString()}</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Territory Drill-down Table */}
            <div className="bg-white rounded-xl border border-black/5">
              <div className="p-3 border-b border-black/5 bg-surface-container-low/50">
                <h2 className="text-[10px] font-black uppercase tracking-widest">Territory Performance (Click to Drill Down)</h2>
              </div>
              <div className="divide-y divide-black/5">
                {TERRITORY_TARGETS.map(terr => {
                  const gaPct = getAchievementPct(terr.grossAdditions.target, terr.grossAdditions.actual);
                  return (
                    <div key={terr.tdrId} onClick={() => handleDrillTerritory(terr.tdrId)}
                      className="p-3 flex justify-between items-center hover:bg-surface-container-low/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${ragBg(gaPct)}`} />
                        <div>
                          <div className="text-xs font-black group-hover:text-primary transition-colors">{terr.territoryName}</div>
                          <div className="text-[8px] font-bold text-on-surface-variant/40">{terr.tdrName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden lg:block">
                          <div className="text-xs font-black">{terr.grossAdditions.actual} <span className="text-on-surface-variant/20">/ {terr.grossAdditions.target}</span></div>
                          <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">GA</div>
                        </div>
                        <div className="text-right hidden lg:block">
                          <div className="text-xs font-black">{terr.totalVisitations.actual} <span className="text-on-surface-variant/20">/ {terr.totalVisitations.target}</span></div>
                          <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">Visits</div>
                        </div>
                        <div className="text-right hidden lg:block">
                          <div className="text-xs font-black">{terr.activeDSA.actual} <span className="text-on-surface-variant/20">/ {terr.activeDSA.target}</span></div>
                          <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">DSA</div>
                        </div>
                        <ChevronRight size={16} className="text-on-surface-variant/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exception Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="bg-rag-red-bg/30 border border-rag-red/15 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1"><AlertTriangle size={12} className="text-rag-red" /><span className="text-[8px] font-black text-rag-red uppercase tracking-widest">Non-Visiting</span></div>
                <div className="text-lg font-black text-rag-red">7</div>
                <div className="text-[7px] font-bold text-on-surface-variant/40">Agents no check-in today</div>
              </div>
              <div className="bg-rag-amber-bg/30 border border-rag-amber/15 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1"><Activity size={12} className="text-rag-amber" /><span className="text-[8px] font-black text-rag-amber uppercase tracking-widest">Dormant</span></div>
                <div className="text-lg font-black text-rag-amber">12</div>
                <div className="text-[7px] font-bold text-on-surface-variant/40">Zero-transaction agents</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1"><Activity size={12} className="text-orange-600" /><span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Float Stockout</span></div>
                <div className="text-lg font-black text-orange-600">4</div>
                <div className="text-[7px] font-bold text-on-surface-variant/40">Below threshold</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TERRITORY DRILL-DOWN ── */}
        {drillLevel === 'territory' && selectedTerritory && (
          <motion.div key="territory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 bg-surface-container rounded-xl hover:bg-primary hover:text-white transition-all"><ChevronLeft size={18} /></button>
              <div>
                <h2 className="text-lg font-black text-primary">{selectedTerritory.territoryName}</h2>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">TDR: {selectedTerritory.tdrName}</p>
              </div>
            </div>
            {renderKpiRow([
              selectedTerritory.activeDSA, selectedTerritory.grossAdditions, selectedTerritory.momoGA,
              selectedTerritory.agentRecruitment, selectedTerritory.floatAvailability, selectedTerritory.totalVisitations,
            ])}
            <div className="bg-white rounded-xl border border-black/5">
              <div className="p-3 border-b border-black/5 bg-surface-container-low/50">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Teams in {selectedTerritory.territoryName}</h3>
              </div>
              <div className="divide-y divide-black/5">
                {TEAM_TARGETS.filter(t => t.tdrId === selectedTdrId).map(team => {
                  const gaPct = getAchievementPct(team.grossAdditions.target, team.grossAdditions.actual);
                  return (
                    <div key={team.tlId} onClick={() => handleDrillTeam(team.tlId)}
                      className="p-3 flex justify-between items-center hover:bg-surface-container-low/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${ragBg(gaPct)}`} />
                        <div>
                          <div className="text-xs font-black group-hover:text-primary">{team.teamName}</div>
                          <div className="text-[7px] font-bold text-on-surface-variant/40">{team.tlName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs font-black">{team.grossAdditions.actual} <span className="text-on-surface-variant/20">/ {team.grossAdditions.target}</span></div>
                          <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">GA</div>
                        </div>
                        <ChevronRight size={16} className="text-on-surface-variant/20 group-hover:text-primary transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TEAM DRILL-DOWN (ASE level) ── */}
        {drillLevel === 'team' && selectedTeam && (
          <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 bg-surface-container rounded-xl hover:bg-primary hover:text-white transition-all"><ChevronLeft size={18} /></button>
              <div>
                <h2 className="text-lg font-black text-primary">{selectedTeam.teamName}</h2>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">TL: {selectedTeam.tlName} • under {selectedTerritory?.territoryName}</p>
              </div>
            </div>
            {renderKpiRow([
              selectedTeam.grossAdditions, selectedTeam.momoGA, selectedTeam.visits,
              selectedTeam.agentRecruitment, selectedTeam.floatAvailability, selectedTeam.brandingCompliance,
            ])}
            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <div className="p-3 border-b border-black/5 bg-surface-container-low/50">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Individual ASEs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/30">
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase">ASE</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase">Visits</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase">GA</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase">MoMo</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase">Float</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {teamAses.map(ase => (
                      <tr key={ase.aseId} className="hover:bg-surface-container-low/30">
                        <td className="p-2.5">
                          <div className="text-[10px] font-black">{ase.aseName}</div>
                          <div className="text-[7px] font-bold text-on-surface-variant/40">{ase.aseId}</div>
                        </td>
                        <td className="p-2.5 text-[10px] font-black"><span className="text-primary">{ase.visits.actual}</span><span className="text-on-surface-variant/20 mx-0.5">/</span><span className="text-on-surface-variant/40">{ase.visits.target}</span></td>
                        <td className="p-2.5 text-[10px] font-black"><span className="text-primary">{ase.grossAdditions.actual}</span><span className="text-on-surface-variant/20 mx-0.5">/</span><span className="text-on-surface-variant/40">{ase.grossAdditions.target}</span></td>
                        <td className="p-2.5 text-[10px] font-black"><span className="text-primary">{ase.momoGA.actual}</span><span className="text-on-surface-variant/20 mx-0.5">/</span><span className="text-on-surface-variant/40">{ase.momoGA.target}</span></td>
                        <td className="p-2.5 text-[10px] font-black"><span className="text-primary">{ase.floatAvailability.actual.toLocaleString()}</span><span className="text-[8px] text-on-surface-variant/30 ml-0.5">ZMW</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Drill-down Modal */}
      <AnimatePresence>
        {selectedKpi && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedKpi(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-black/5 flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><BarChart3 size={20} /></div>
                  <div>
                    <h2 className="text-xl font-black text-primary font-display leading-tight">{selectedKpi.label} Insights</h2>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Zone-wide Breakdown</p>
                  </div>
                </div>
                <button onClick={() => setSelectedKpi(null)} className="p-2 hover:bg-surface-container rounded-xl transition-colors"><X size={20} className="text-on-surface-variant" /></button>
              </div>
              
              <div className="p-6 bg-surface-container-low min-h-[300px]">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                    <div className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-1">Zone Actual</div>
                    <div className="text-2xl font-black font-display text-primary">{selectedKpi.actual.toLocaleString()} <span className="text-xs text-on-surface-variant/40">{selectedKpi.unit}</span></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                    <div className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-1">Zone Target</div>
                    <div className="text-2xl font-black font-display">{selectedKpi.target.toLocaleString()} <span className="text-xs text-on-surface-variant/40">{selectedKpi.unit}</span></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                    <div className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-1">Achievement</div>
                    <div className={`text-2xl font-black font-display ${ragColor(getAchievementPct(selectedKpi.target, selectedKpi.actual))}`}>
                      {getAchievementPct(selectedKpi.target, selectedKpi.actual)}%
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                  <div className="p-3 border-b border-black/5 bg-surface-container-lowest flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Territory Breakdown</h3>
                  </div>
                  <div className="divide-y divide-black/5">
                    {TERRITORY_TARGETS.map(t => {
                      const key = Object.keys(t).find(k => (t as any)[k]?.label === selectedKpi.label);
                      const kpiNode = key ? (t as any)[key] : null;
                      const actual = kpiNode ? kpiNode.actual : Math.round(selectedKpi.actual / 4);
                      const target = kpiNode ? kpiNode.target : Math.round(selectedKpi.target / 4);
                      const pct = getAchievementPct(target, actual);
                      return (
                        <div key={t.tdrId} className="p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                          <div className="flex-1">
                            <div className="text-xs font-black">{t.territoryName} <span className="text-[9px] text-on-surface-variant/50 ml-2 font-bold">{t.tdrName}</span></div>
                            <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                              <div className={`h-full ${ragBg(pct)}`} style={{ width: `${Math.min(100, pct)}%` }} />
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-sm font-black font-display">{actual.toLocaleString()}</div>
                            <div className="text-[8px] font-bold text-on-surface-variant/40">/ {target.toLocaleString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZonalOverview;
