import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Target, TrendingUp, Activity, MapPin, AlertTriangle,
  CheckCircle2, XCircle, ChevronRight, X, Smartphone, ShieldAlert,
  BarChart3, Clock, Trophy
} from 'lucide-react';
import { AseStatus } from '../../types';
import {
  TEAM_TARGETS, ASE_DAILY_TARGETS, TeamTargets, AseTargets, KpiTarget,
  getAchievementPct, ragColor, ragBg
} from '../../data/kpiStore';

interface TlDashboardProps {
  aseStatuses: AseStatus[];
  onSelectAse: (ase: AseStatus) => void;
  onSignOff: () => void;
  missedVisitLogs: { outletName: string; aseName: string; reason: string; notes: string; time: string }[];
}

const TlDashboard: React.FC<TlDashboardProps> = ({ aseStatuses, onSelectAse, onSignOff, missedVisitLogs }) => {
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [selectedAseBreakdown, setSelectedAseBreakdown] = useState<any>(null);
  const [selectedAseId, setSelectedAseId] = useState<string>('');
  const myTeam: TeamTargets = TEAM_TARGETS[0];
  const myAses = ASE_DAILY_TARGETS.filter(a => a.tlId === myTeam.tlId);

  // TL's own KPIs from spec
  const tlKpiCards: { kpi: KpiTarget; icon: React.ReactNode }[] = [
    { kpi: myTeam.visits, icon: <MapPin size={16} /> },
    { kpi: myTeam.grossAdditions, icon: <TrendingUp size={16} /> },
    { kpi: myTeam.agentRecruitment, icon: <Users size={16} /> },
    { kpi: myTeam.floatAvailability, icon: <Activity size={16} /> },
  ];

  // Target allocation state — Core LOBs: SIM, Float, MoMo, Cash
  const [aseTargets, setAseTargets] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    myAses.forEach(a => {
      init[a.aseId] = {
        grossAdditions: a.grossAdditions.target,
        momoGA: a.momoGA.target,
        floatAvailability: a.floatAvailability.target,
        cashAvailability: a.cashAvailability.target,
      };
    });
    return init;
  });

  const targetFields = [
    { key: 'grossAdditions', label: 'SIM Registrations', unit: 'SIMs' },
    { key: 'momoGA', label: 'MoMo GA', unit: 'Users' },
    { key: 'floatAvailability', label: 'Float Allocation', unit: 'ZMW' },
    { key: 'cashAvailability', label: 'Cash Allocation', unit: 'ZMW' },
  ];

  // Non-visiting agents (Exception Alert from spec)
  const offlineAses = aseStatuses.filter(a => a.status === 'Offline');
  const activeAses = aseStatuses.filter(a => a.status === 'Active' || a.status === 'Completed');

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">{myTeam.teamName}</h1>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Team Leader: {myTeam.tlName} • {myTeam.tlId}</p>
        </div>
        <button
          onClick={() => setShowTargetModal(true)}
          className="btn bg-primary text-white text-[9px] px-4 py-2 font-black rounded-xl flex items-center gap-2 uppercase tracking-widest shadow-lg"
        >
          <Target size={14} /> Assign Targets
        </button>
      </div>

      {/* TL's Own KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {tlKpiCards.map((card, i) => {
          const pct = getAchievementPct(card.kpi.target, card.kpi.actual);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl p-3 border border-black/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded-md bg-primary/10 text-primary">{card.icon}</div>
                <span className="text-[8px] font-black uppercase tracking-tight text-on-surface-variant truncate">{card.kpi.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-black font-display ${ragColor(pct)}`}>{card.kpi.actual.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-on-surface-variant/30">/ {card.kpi.target.toLocaleString()}</span>
              </div>
              <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">{card.kpi.unit}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ASE Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/5 overflow-hidden">
          <div className="p-3 border-b border-black/5 flex justify-between items-center bg-surface-container-low/50">
            <h2 className="text-[10px] font-black uppercase tracking-widest">ASE Performance Matrix</h2>
            <div className="flex gap-1.5">
              <span className="text-[8px] font-black bg-rag-green-bg text-rag-green px-2 py-0.5 rounded-full uppercase">{activeAses.length} Active</span>
              <span className="text-[8px] font-black bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full uppercase">{offlineAses.length} Offline</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="p-3 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">ASE</th>
                  <th className="p-3 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Visits</th>
                  <th className="p-3 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">SIMs</th>
                  <th className="p-3 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">MoMo</th>
                  <th className="p-3 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Float</th>
                  <th className="p-3 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {myAses.map(ase => {
                  const status = aseStatuses.find(s => s.id === ase.aseId);
                  const isActive = status?.status === 'Active' || status?.status === 'Completed';
                  return (
                    <tr
                      key={ase.aseId}
                      onClick={() => { 
                        const s = aseStatuses.find(st => st.id === ase.aseId); 
                        if (s) setSelectedAseBreakdown({ ...ase, status: s.status, exceptions: s.exceptions }); 
                      }}
                      className="hover:bg-surface-container-low/50 cursor-pointer transition-colors group"
                    >
                      <td className="p-3">
                        <div className="font-black text-[10px] uppercase tracking-tight group-hover:text-primary transition-colors">{ase.aseName}</div>
                        <div className="text-[8px] font-bold text-on-surface-variant/40">{ase.aseId}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-black text-primary">{ase.visits.actual}</span>
                        <span className="text-[9px] text-on-surface-variant/20 mx-0.5">/</span>
                        <span className="text-[9px] text-on-surface-variant/40">{ase.visits.target}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-black text-primary">{ase.grossAdditions.actual}</span>
                        <span className="text-[9px] text-on-surface-variant/20 mx-0.5">/</span>
                        <span className="text-[9px] text-on-surface-variant/40">{ase.grossAdditions.target}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-black text-primary">{ase.momoGA.actual}</span>
                        <span className="text-[9px] text-on-surface-variant/20 mx-0.5">/</span>
                        <span className="text-[9px] text-on-surface-variant/40">{ase.momoGA.target}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-black text-primary">{ase.floatAvailability.actual.toLocaleString()}</span>
                        <span className="text-[8px] text-on-surface-variant/30 ml-0.5">ZMW</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${isActive ? 'bg-rag-green-bg text-rag-green' : 'bg-surface-container text-on-surface-variant'}`}>
                          {status?.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Alerts + Leaderboard */}
        <div className="space-y-4">
          {/* Non-visiting Agent Alert (from spec) */}
          {offlineAses.length > 0 && (
            <div className="bg-rag-red-bg/30 border border-rag-red/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-rag-red" />
                <span className="text-[9px] font-black text-rag-red uppercase tracking-widest">Non-Visiting Agents</span>
              </div>
              {offlineAses.map(ase => (
                <div key={ase.id} className="flex justify-between items-center py-1.5 border-t border-rag-red/10">
                  <span className="text-[10px] font-black text-on-surface">{ase.name}</span>
                  <span className="text-[8px] font-bold text-rag-red uppercase">No Check-in</span>
                </div>
              ))}
            </div>
          )}

          {/* Team Leaderboard (weekly from spec) */}
          <div className="bg-white rounded-xl border border-black/5 p-3">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={14} className="text-rag-amber" />
              <span className="text-[9px] font-black uppercase tracking-widest">Team Leaderboard</span>
            </div>
            {myAses.sort((a, b) => b.grossAdditions.actual - a.grossAdditions.actual).map((ase, i) => (
              <div key={ase.aseId} className="flex items-center justify-between py-1.5 border-t border-black/5">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black ${i === 0 ? 'bg-rag-amber text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-black">{ase.aseName}</span>
                </div>
                <span className="text-[9px] font-black text-primary">{ase.grossAdditions.actual} GA</span>
              </div>
            ))}
          </div>

          {/* Missed Visit Logs */}
          {missedVisitLogs.length > 0 && (
            <div className="bg-white rounded-xl border border-black/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={14} className="text-rag-red" />
                <span className="text-[9px] font-black uppercase tracking-widest">Missed Visits</span>
              </div>
              {missedVisitLogs.map((log, i) => (
                <div key={i} className="py-1.5 border-t border-black/5">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black">{log.aseName}</span>
                    <span className="text-[8px] font-bold text-on-surface-variant">{log.time}</span>
                  </div>
                  <div className="text-[8px] text-on-surface-variant font-semibold">{log.outletName} — {log.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Target Allocation Modal — ALL target types with units */}
      <AnimatePresence>
        {showTargetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-black text-primary">Target Allocation to ASEs</h2>
                <button onClick={() => setShowTargetModal(false)} className="p-2 hover:bg-surface-container rounded-xl"><X size={18} /></button>
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold mb-4">Manually set daily targets for each ASE. Each field shows the unit.</p>

              <div className="space-y-4">
                {myAses.map(ase => (
                  <div key={ase.aseId} className="bg-surface-container-low rounded-xl p-4 border border-black/5">
                    <div className="font-black text-xs mb-3">{ase.aseName} <span className="text-on-surface-variant/40 font-bold">({ase.aseId})</span></div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {targetFields.map(field => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">{field.label}</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={aseTargets[ase.aseId]?.[field.key] === 0 ? '' : (aseTargets[ase.aseId]?.[field.key] || '')}
                              placeholder="0"
                              onFocus={(e) => e.target.select()}
                              onChange={e => {
                                const raw = e.target.value;
                                const val = raw === '' ? 0 : parseInt(raw);
                                if (!isNaN(val)) setAseTargets(prev => ({
                                  ...prev,
                                  [ase.aseId]: { ...prev[ase.aseId], [field.key]: val }
                                }));
                              }}
                              className="w-full bg-white border border-black/10 rounded-lg px-2 py-1.5 text-xs font-bold text-right outline-none focus:border-primary"
                            />
                            <span className="text-[7px] font-bold text-on-surface-variant/40 uppercase whitespace-nowrap">{field.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 bg-primary/5 rounded-xl p-3 border border-primary/20">
                <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Team Totals</div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                  {targetFields.map(field => {
                    const total = Object.values(aseTargets).reduce((sum, a) => sum + (a[field.key] || 0), 0);
                    return (
                      <div key={field.key} className="text-center">
                        <div className="text-sm font-black text-primary">{total.toLocaleString()}</div>
                        <div className="text-[7px] font-bold text-on-surface-variant/40 uppercase">{field.unit}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowTargetModal(false)} className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-xs font-bold">Cancel</button>
                <button onClick={() => setShowTargetModal(false)} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg">Save Targets</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ASE Performance Breakdown Modal */}
      <AnimatePresence>
        {selectedAseBreakdown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedAseBreakdown(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-primary p-6 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black">{selectedAseBreakdown.aseName}</h2>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{selectedAseBreakdown.aseId} • ASE Performance Breakdown</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full ${selectedAseBreakdown.status === 'Active' ? 'bg-rag-green text-white' : 'bg-surface-container text-on-surface-variant'}`}>{selectedAseBreakdown.status}</span>
                  <button onClick={() => setSelectedAseBreakdown(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={18} /></button>
                </div>
              </div>

              <div className="p-6 space-y-6 bg-surface">
                {/* Core KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Outlets Visited', kpi: selectedAseBreakdown.visits, icon: <MapPin size={18} />, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'SIM Registration', kpi: selectedAseBreakdown.grossAdditions, icon: <TrendingUp size={18} />, color: 'text-rag-green', bg: 'bg-rag-green-bg' },
                    { label: 'Agent Activation', kpi: selectedAseBreakdown.agentRecruitment, icon: <Users size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Float Checks', kpi: selectedAseBreakdown.floatAvailability, icon: <Activity size={18} />, color: 'text-rag-amber', bg: 'bg-rag-amber-bg' }
                  ].map((metric, i) => {
                    const pct = getAchievementPct(metric.kpi.target, metric.kpi.actual);
                    return (
                      <div key={i} className="bg-white rounded-xl p-4 border border-black/5 hover:border-primary/20 transition-all">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${metric.bg} ${metric.color}`}>
                          {metric.icon}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-1 line-clamp-1">{metric.label}</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black font-display">{metric.kpi.actual}</span>
                          <span className="text-[10px] font-bold text-on-surface-variant/40">/ {metric.kpi.target}</span>
                        </div>
                        <div className="mt-2 h-1 bg-surface-container rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} className={`h-full rounded-full ${pct >= 80 ? 'bg-rag-green' : pct >= 50 ? 'bg-rag-amber' : 'bg-rag-red'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Additional Metrics */}
                  <div className="bg-white rounded-xl p-5 border border-black/5">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4">Quality & Exceptions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-black/5">
                        <span className="text-[10px] font-bold text-on-surface-variant">Geo-fence Compliance</span>
                        <span className="text-sm font-black text-rag-green">98%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-black/5">
                        <span className="text-[10px] font-bold text-on-surface-variant">Route Adherence</span>
                        <span className="text-sm font-black text-primary">92%</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1.5"><AlertTriangle size={12} className="text-rag-red" /> Flags/Exceptions</span>
                        <span className={`text-sm font-black ${selectedAseBreakdown.exceptions > 0 ? 'text-rag-red' : 'text-rag-green'}`}>{selectedAseBreakdown.exceptions || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 justify-center">
                    <button 
                      onClick={() => {
                        const statusObj = aseStatuses.find(s => s.id === selectedAseBreakdown.aseId);
                        if (statusObj) onSelectAse(statusObj);
                      }}
                      className="w-full py-4 bg-white border-2 border-black/10 hover:border-primary text-primary rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <MapPin size={16} /> Navigate to Visit Validation
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TlDashboard;
