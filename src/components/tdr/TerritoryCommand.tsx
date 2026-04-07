import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Users, MapPin, AlertTriangle, Activity, Target, X,
  ChevronRight, Smartphone, ShieldAlert, BarChart3, CreditCard, ChevronLeft
} from 'lucide-react';
import {
  TERRITORY_TARGETS, TEAM_TARGETS, ASE_DAILY_TARGETS, KpiTarget,
  getAchievementPct, ragColor, ragBg
} from '../../data/kpiStore';

interface TerritoryCommandProps {
  onAction: (message: string) => void;
}

const TerritoryCommand: React.FC<TerritoryCommandProps> = ({ onAction }) => {
  const myTerritory = TERRITORY_TARGETS[0];
  const myTeams = TEAM_TARGETS.filter(t => t.tdrId === myTerritory.tdrId);

  // Drill-down state
  const [drillTeamId, setDrillTeamId] = useState<string | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<KpiTarget | null>(null);
  const drillTeam = TEAM_TARGETS.find(t => t.tlId === drillTeamId);
  const drillAses = ASE_DAILY_TARGETS.filter(a => a.tlId === drillTeamId);

  // All 5 KPI categories as dense cards
  const kpiCards: { kpi: KpiTarget; icon: React.ReactNode; color: string }[] = [
    { kpi: myTerritory.activeDSA, icon: <Users size={16} />, color: 'bg-primary' },
    { kpi: myTerritory.grossAdditions, icon: <TrendingUp size={16} />, color: 'bg-rag-green' },
    { kpi: myTerritory.momoGA, icon: <Smartphone size={16} />, color: 'bg-blue-600' },
    { kpi: myTerritory.agentRecruitment, icon: <Users size={16} />, color: 'bg-purple-600' },
    { kpi: myTerritory.merchantRecruitment, icon: <Users size={16} />, color: 'bg-indigo-600' },
    { kpi: myTerritory.cashAvailability, icon: <CreditCard size={16} />, color: 'bg-teal-600' },
    { kpi: myTerritory.floatAvailability, icon: <Activity size={16} />, color: 'bg-rag-amber' },
    { kpi: myTerritory.servicedCustomers, icon: <Users size={16} />, color: 'bg-cyan-600' },
    { kpi: myTerritory.transactionValue, icon: <CreditCard size={16} />, color: 'bg-emerald-600' },
    { kpi: myTerritory.totalVisitations, icon: <MapPin size={16} />, color: 'bg-rose-600' },
    { kpi: myTerritory.brandingCompliance, icon: <ShieldAlert size={16} />, color: 'bg-orange-600' },
  ];

  // Resource allocation state — TDR manually splits to TLs
  const allocationFields = [
    { key: 'grossAdditions', label: 'SIM Allocation', unit: 'SIMs', total: myTerritory.grossAdditions.target },
    { key: 'momoGA', label: 'MoMo GA', unit: 'Users', total: myTerritory.momoGA.target },
    { key: 'floatAvailability', label: 'Float', unit: 'ZMW', total: myTerritory.floatAvailability.target },
    { key: 'cashAvailability', label: 'Cash', unit: 'ZMW', total: myTerritory.cashAvailability.target },
  ];

  const [allocations, setAllocations] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    myTeams.forEach(t => {
      init[t.tlId] = {
        grossAdditions: t.grossAdditions.target,
        momoGA: t.momoGA.target,
        floatAvailability: t.floatAvailability.target,
        cashAvailability: t.cashAvailability.target,
      };
    });
    return init;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {!drillTeamId ? (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">{myTerritory.territoryName} Command</h1>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">TDR: {myTerritory.tdrName} • {myTerritory.tdrId}</p>
              </div>
              <div className="text-[8px] font-black bg-surface-container px-3 py-1.5 rounded-xl text-on-surface-variant uppercase tracking-widest">April 2026</div>
            </div>

            {/* All KPI Cards — Dense Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
              {kpiCards.map((card, i) => {
                const pct = getAchievementPct(card.kpi.target, card.kpi.actual);
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedKpi(card.kpi)}
                    className="bg-white rounded-xl p-3 border border-black/5 hover:border-primary/50 cursor-pointer transition-all shadow-sm hover:shadow"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className={`p-1 flex items-center justify-center rounded-md ${card.color} text-white`}>{card.icon}</div>
                      <span className="text-[7px] font-black uppercase tracking-tight text-on-surface-variant truncate">{card.kpi.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-base font-black font-display flex-1 ${ragColor(pct)}`}>{card.kpi.actual.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[8px] text-on-surface-variant/40">Target: {card.kpi.target.toLocaleString()}</span>
                      <span className="text-[7px] font-bold text-on-surface-variant/30 uppercase bg-surface-container px-1 py-0.5 rounded">{card.kpi.unit}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── RESOURCE ALLOCATION PANEL (ON FRONT SCREEN) ── */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-primary" />
                  <h2 className="text-[10px] font-black text-primary uppercase tracking-widest">Resource Allocation to Team Leads</h2>
                </div>
                <button
                  onClick={() => onAction('Allocations saved successfully.')}
                  className="btn bg-primary text-white text-[8px] px-3 py-1.5 font-black rounded-lg uppercase tracking-widest shadow"
                >
                  Save Split
                </button>
              </div>

              {/* Allocation Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-2 text-[8px] font-black text-primary uppercase tracking-widest">Team Lead</th>
                      {allocationFields.map(f => (
                        <th key={f.key} className="p-2 text-[7px] font-black text-primary uppercase tracking-widest text-center">
                          {f.label}<br /><span className="text-primary/40">({f.unit})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {myTeams.map(team => (
                      <tr key={team.tlId}>
                        <td className="p-2">
                          <div className="text-[10px] font-black">{team.teamName}</div>
                          <div className="text-[8px] font-bold text-on-surface-variant/40">{team.tlName}</div>
                        </td>
                        {allocationFields.map(field => (
                          <td key={field.key} className="p-2">
                            <input
                              type="number"
                              value={allocations[team.tlId]?.[field.key] === 0 ? '' : (allocations[team.tlId]?.[field.key] || '')}
                              placeholder="0"
                              onFocus={(e) => e.target.select()}
                              onChange={e => {
                                const raw = e.target.value;
                                const val = raw === '' ? 0 : parseInt(raw);
                                if (!isNaN(val)) setAllocations(prev => ({
                                  ...prev,
                                  [team.tlId]: { ...prev[team.tlId], [field.key]: val }
                                }));
                              }}
                              className="w-full bg-white border border-primary/20 rounded-lg px-2 py-1.5 text-xs font-bold text-center outline-none focus:border-primary"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-primary/10">
                      <td className="p-2 text-[9px] font-black text-primary uppercase tracking-widest">Allocated Total</td>
                      {allocationFields.map(field => {
                        const allocated = Object.values(allocations).reduce((s, a) => s + (a[field.key] || 0), 0);
                        const isMatch = allocated === field.total;
                        return (
                          <td key={field.key} className="p-2 text-center">
                            <span className={`text-xs font-black ${isMatch ? 'text-rag-green' : 'text-rag-amber'}`}>
                              {allocated.toLocaleString()}
                            </span>
                            <span className="text-[8px] text-primary/40 ml-1">/ {field.total.toLocaleString()}</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── TEAM PERFORMANCE TABLE (Drill-down) ── */}
            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <div className="p-3 border-b border-black/5 bg-surface-container-low/50">
                <h2 className="text-[10px] font-black uppercase tracking-widest">Team Performance (Click to Drill Down)</h2>
              </div>
              <div className="divide-y divide-black/5">
                {myTeams.map(team => {
                  const gaPct = getAchievementPct(team.grossAdditions.target, team.grossAdditions.actual);
                  return (
                    <div
                      key={team.tlId}
                      onClick={() => setDrillTeamId(team.tlId)}
                      className="p-3 flex justify-between items-center hover:bg-surface-container-low/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${ragBg(gaPct)}`} />
                        <div>
                          <div className="text-xs font-black group-hover:text-primary transition-colors">{team.teamName}</div>
                          <div className="text-[8px] font-bold text-on-surface-variant/40">{team.tlName} • {team.tlId}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs font-black">{team.grossAdditions.actual} <span className="text-on-surface-variant/30">/ {team.grossAdditions.target}</span></div>
                          <div className="text-[7px] font-bold text-on-surface-variant/40 uppercase">Gross Additions</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black">{team.visits.actual} <span className="text-on-surface-variant/30">/ {team.visits.target}</span></div>
                          <div className="text-[7px] font-bold text-on-surface-variant/40 uppercase">Visits</div>
                        </div>
                        <ChevronRight size={16} className="text-on-surface-variant/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exception Alerts Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="bg-rag-red-bg/30 border border-rag-red/15 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} className="text-rag-red" />
                  <span className="text-[8px] font-black text-rag-red uppercase tracking-widest">Non-Visiting Agents</span>
                </div>
                <div className="text-lg font-black text-rag-red">3</div>
                <div className="text-[7px] font-bold text-on-surface-variant/40">No check-in today</div>
              </div>
              <div className="bg-rag-amber-bg/30 border border-rag-amber/15 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} className="text-rag-amber" />
                  <span className="text-[8px] font-black text-rag-amber uppercase tracking-widest">Zero Transaction (Dormant)</span>
                </div>
                <div className="text-lg font-black text-rag-amber">5</div>
                <div className="text-[7px] font-bold text-on-surface-variant/40">Agents with 0 txn today</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} className="text-orange-600" />
                  <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Float Stockout Alert</span>
                </div>
                <div className="text-lg font-black text-orange-600">2</div>
                <div className="text-[7px] font-bold text-on-surface-variant/40">Agents below threshold</div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── DRILL-DOWN: Team → ASE detail ── */
          <motion.div key="drill" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrillTeamId(null)} className="p-2 bg-surface-container rounded-xl hover:bg-primary hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <div>
                <h2 className="text-lg font-black text-primary">{drillTeam?.teamName}</h2>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">TL: {drillTeam?.tlName} • {drillTeam?.tlId}</p>
              </div>
            </div>

            {/* Team KPI Summary */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
              {drillTeam && [
                drillTeam.grossAdditions, drillTeam.momoGA, drillTeam.visits,
                drillTeam.agentRecruitment, drillTeam.floatAvailability, drillTeam.brandingCompliance
              ].map((kpi, i) => {
                const pct = getAchievementPct(kpi.target, kpi.actual);
                return (
                  <div key={i} className="bg-white rounded-xl p-3 border border-black/5">
                    <div className="text-[7px] font-black text-on-surface-variant/40 uppercase truncate mb-1">{kpi.label}</div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-base font-black font-display ${ragColor(pct)}`}>{kpi.actual.toLocaleString()}</span>
                      <span className="text-[8px] text-on-surface-variant/30">/ {kpi.target.toLocaleString()}</span>
                    </div>
                    <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">{kpi.unit}</div>
                  </div>
                );
              })}
            </div>

            {/* ASE detail table */}
            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <div className="p-3 border-b border-black/5 bg-surface-container-low/50">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Individual ASE Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/30">
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">ASE</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Visits</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">GA (SIMs)</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">MoMo</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Float (ZMW)</th>
                      <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Branding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {drillAses.map(ase => (
                      <tr key={ase.aseId} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="p-2.5">
                          <div className="text-[10px] font-black">{ase.aseName}</div>
                          <div className="text-[7px] font-bold text-on-surface-variant/40">{ase.aseId}</div>
                        </td>
                        <td className="p-2.5 text-[10px] font-black">
                          <span className="text-primary">{ase.visits.actual}</span> <span className="text-on-surface-variant/20">/</span> <span className="text-on-surface-variant/40">{ase.visits.target}</span>
                        </td>
                        <td className="p-2.5 text-[10px] font-black">
                          <span className="text-primary">{ase.grossAdditions.actual}</span> <span className="text-on-surface-variant/20">/</span> <span className="text-on-surface-variant/40">{ase.grossAdditions.target}</span>
                        </td>
                        <td className="p-2.5 text-[10px] font-black">
                          <span className="text-primary">{ase.momoGA.actual}</span> <span className="text-on-surface-variant/20">/</span> <span className="text-on-surface-variant/40">{ase.momoGA.target}</span>
                        </td>
                        <td className="p-2.5 text-[10px] font-black">
                          <span className="text-primary">{ase.floatAvailability.actual.toLocaleString()}</span> <span className="text-on-surface-variant/20">/</span> <span className="text-on-surface-variant/40">{ase.floatAvailability.target.toLocaleString()}</span>
                        </td>
                        <td className="p-2.5 text-[10px] font-black">
                          <span className="text-primary">{ase.brandingChecks.actual}</span> <span className="text-on-surface-variant/20">/</span> <span className="text-on-surface-variant/40">{ase.brandingChecks.target}</span>
                        </td>
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
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Territory-wide Breakdown</p>
                  </div>
                </div>
                <button onClick={() => setSelectedKpi(null)} className="p-2 hover:bg-surface-container rounded-xl transition-colors"><X size={20} className="text-on-surface-variant" /></button>
              </div>
              
              <div className="p-6 bg-surface-container-low min-h-[300px]">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                    <div className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-1">Territory Actual</div>
                    <div className="text-2xl font-black font-display text-primary">{selectedKpi.actual.toLocaleString()} <span className="text-xs text-on-surface-variant/40">{selectedKpi.unit}</span></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                    <div className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-1">Territory Target</div>
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
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Team Breakdown</h3>
                  </div>
                  <div className="divide-y divide-black/5">
                    {myTeams.map(t => {
                      const key = Object.keys(t).find(k => (t as any)[k]?.label === selectedKpi.label);
                      const kpiNode = key ? (t as any)[key] : null;
                      const actual = kpiNode ? kpiNode.actual : Math.round(selectedKpi.actual / 2);
                      const target = kpiNode ? kpiNode.target : Math.round(selectedKpi.target / 2);
                      const pct = getAchievementPct(target, actual);
                      return (
                        <div key={t.tlId} className="p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                          <div className="flex-1">
                            <div className="text-xs font-black">{t.teamName} <span className="text-[9px] text-on-surface-variant/50 ml-2 font-bold">{t.tlName}</span></div>
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

export default TerritoryCommand;
