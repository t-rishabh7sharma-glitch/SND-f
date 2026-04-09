import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, TrendingUp, MapPin, Users, Trophy, ArrowUpRight, X, Clock, Smartphone, UserPlus, AlertTriangle } from 'lucide-react';

interface KpiModuleProps {
  sessionKpis?: { visits: number; grossAdditions: number; agentActivation: number; floatChecks: number; };
  /**
   * Profile tab: hide the trophy strip, the embedded “Team Leaderboard” inside KPI,
   * and keep weekly breakdown only — one team list lives on `FieldProfileView` below KPIs.
   */
  hideTeamRankBadge?: boolean;
}

const KpiModule: React.FC<KpiModuleProps> = ({ sessionKpis, hideTeamRankBadge = false }) => {
  const [drillCard, setDrillCard] = useState<string | null>(null);

  // ── Session-aware values (today = 0-based from sessionKpis) ──
  const todayVisitsPlanned = 10;
  const todayVisitsDone = sessionKpis?.visits ?? 0;
  const visitPct = todayVisitsPlanned > 0 ? Math.round((todayVisitsDone / todayVisitsPlanned) * 100) : 0;

  const todaySIMs = sessionKpis?.grossAdditions ?? 0;
  // Business logic: activated = ~60% of registered (or 0 if none)
  const todaySIMsActivated = todaySIMs > 0 ? Math.max(1, Math.round(todaySIMs * 0.6)) : 0;

  const todayGeoTotal = todayVisitsDone;
  const todayGeoPassed = todayVisitsDone; // all visits pass geo-fence in the demo
  const todayGeoFailed = 0;
  const geoPct = todayGeoTotal > 0 ? Math.round((todayGeoPassed / todayGeoTotal) * 100) : 0;

  const todayAgents = sessionKpis?.agentActivation ?? 0;

  // Named agents recruited (incremental)
  const agentNames = [
    'Chanda Mwila', 'Musonda Ngosa', 'Bwalya Kapasa', 'Ireen Tembo',
    'Kelvin Zulu', 'Grace Phiri'
  ];

  const heroMetrics = [
    {
      id: 'visit',
      label: 'Visit Rate',
      val: todayVisitsDone > 0 ? `${visitPct}%` : '0%',
      sub: `${todayVisitsDone} of ${todayVisitsPlanned} planned`,
      icon: <CheckCircle2 size={22} />,
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 'sims',
      label: 'SIMs Today',
      val: todaySIMs.toString(),
      sub: `${todaySIMsActivated} activated`,
      icon: <Smartphone size={22} />,
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 'geo',
      label: 'Geo-fence Pass',
      val: todayGeoTotal > 0 ? `${geoPct}%` : '0%',
      sub: `${todayGeoPassed} passed · ${todayGeoFailed} failed`,
      icon: <MapPin size={22} />,
      color: 'bg-rag-amber-bg text-rag-amber',
    },
    {
      id: 'agents',
      label: 'New Agents',
      val: todayAgents.toString(),
      sub: todayAgents > 0 ? agentNames.slice(0, todayAgents).join(', ') : 'None yet',
      icon: <UserPlus size={22} />,
      color: 'bg-primary/10 text-primary',
    },
  ];

  // Weekly breakdown — consistent with daily targets * 7
  const weeklyBreakdown = [
    { label: 'Outlets Visited vs Planned', val: '42 / 70', progress: 60 },
    { label: 'Route Adherence', val: '88%', progress: 88 },
    { label: 'Geo-fence Pass Rate', val: '95%', progress: 95 },
    { label: 'SIMs Registered', val: '84', progress: 60 },
    { label: 'Agents Activated', val: '5', progress: 71 },
    { label: 'Avg. Time Per Outlet', val: '18 min', progress: 72 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">My Performance</h1>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-0.5">Self-monitoring KPIs • Today's session</p>
        </div>
        {!hideTeamRankBadge && (
          <div className="bg-primary/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Trophy size={14} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-wider">#2 in Team • Top 10% Zone</span>
          </div>
        )}
      </div>

      {/* ── HERO KPI CARDS (clickable) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {heroMetrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setDrillCard(metric.id)}
            className="group cursor-pointer rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/35 hover:shadow-lg"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${metric.color} group-hover:scale-110 transition-transform`}>
              {metric.icon}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-1">{metric.label}</div>
            <div className={`text-3xl font-black font-display ${parseInt(metric.val) > 0 || metric.val.includes('%') && metric.val !== '0%' ? 'text-on-surface' : 'text-on-surface/20'}`}>{metric.val}</div>
            <div className="text-[8px] font-bold text-on-surface-variant/40 mt-1 uppercase">{metric.sub}</div>
            <div className="text-[7px] font-bold text-primary/40 mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Tap for detail ›</div>
          </motion.div>
        ))}
      </div>

      {/* ── DRILL-DOWN MODAL ── */}
      <AnimatePresence>
        {drillCard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setDrillCard(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                  {drillCard === 'visit' && 'Visit Rate Detail'}
                  {drillCard === 'sims' && 'SIM Registration & Activation'}
                  {drillCard === 'geo' && 'Geo-fence Compliance'}
                  {drillCard === 'agents' && 'New Agent Activations'}
                </h3>
                <button onClick={() => setDrillCard(null)} className="p-1.5 hover:bg-surface-container rounded-lg"><X size={16} /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* ═══ VISIT RATE DRILL-DOWN ═══ */}
                {drillCard === 'visit' && (
                  <>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-primary/5 rounded-xl p-4">
                        <div className="text-2xl font-black font-display text-primary">{todayVisitsPlanned}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">Planned</div>
                      </div>
                      <div className="bg-rag-green-bg rounded-xl p-4">
                        <div className="text-2xl font-black font-display text-rag-green">{todayVisitsDone}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">Executed</div>
                      </div>
                      <div className="bg-rag-red-bg rounded-xl p-4">
                        <div className="text-2xl font-black font-display text-rag-red">{todayVisitsPlanned - todayVisitsDone}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">Remaining</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">
                        <span>Execution Rate</span>
                        <span className={visitPct >= 80 ? 'text-rag-green' : visitPct >= 50 ? 'text-rag-amber' : 'text-rag-red'}>{visitPct}%</span>
                      </div>
                      <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${visitPct}%` }} className={`h-full rounded-full ${visitPct >= 80 ? 'bg-rag-green' : visitPct >= 50 ? 'bg-rag-amber' : 'bg-rag-red'}`} />
                      </div>
                    </div>
                    {todayVisitsDone === 0 && (
                      <div className="flex items-center gap-2 p-3 bg-rag-amber-bg/30 rounded-xl border border-rag-amber/20">
                        <AlertTriangle size={14} className="text-rag-amber" />
                        <span className="text-[9px] font-bold text-rag-amber uppercase">No visits executed yet. Start your route to update this metric.</span>
                      </div>
                    )}
                  </>
                )}

                {/* ═══ SIMs DRILL-DOWN ═══ */}
                {drillCard === 'sims' && (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-xl bg-primary/10 p-5">
                        <div className="font-display text-3xl font-black text-primary">{todaySIMs}</div>
                        <div className="mt-1 text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50">SIMs Registered</div>
                      </div>
                      <div className="rounded-xl bg-primary/5 p-5">
                        <div className="font-display text-3xl font-black text-primary">{todaySIMsActivated}</div>
                        <div className="mt-1 text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50">SIMs Activated</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl">
                        <span className="text-[9px] font-black uppercase text-on-surface-variant/50">Daily Target</span>
                        <span className="text-sm font-black">20 SIMs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl">
                        <span className="text-[9px] font-black uppercase text-on-surface-variant/50">Activation Rate</span>
                        <span className={`text-sm font-black ${todaySIMs > 0 ? 'text-rag-green' : 'text-on-surface/20'}`}>
                          {todaySIMs > 0 ? `${Math.round((todaySIMsActivated / todaySIMs) * 100)}%` : '0%'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl">
                        <span className="text-[9px] font-black uppercase text-on-surface-variant/50">Balance to Target</span>
                        <span className="text-sm font-black text-rag-amber">{Math.max(0, 20 - todaySIMs)} remaining</span>
                      </div>
                    </div>
                  </>
                )}

                {/* ═══ GEO-FENCE DRILL-DOWN ═══ */}
                {drillCard === 'geo' && (
                  <>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-surface-container-low rounded-xl p-4">
                        <div className="text-2xl font-black font-display">{todayGeoTotal}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">Total Check-ins</div>
                      </div>
                      <div className="bg-rag-green-bg rounded-xl p-4">
                        <div className="text-2xl font-black font-display text-rag-green">{todayGeoPassed}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">Inside Fence</div>
                      </div>
                      <div className="bg-rag-red-bg rounded-xl p-4">
                        <div className="text-2xl font-black font-display text-rag-red">{todayGeoFailed}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">Outside Fence</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">
                        <span>Compliance Rate</span>
                        <span className={todayGeoTotal > 0 ? 'text-rag-green' : 'text-on-surface/20'}>{todayGeoTotal > 0 ? `${geoPct}%` : '—'}</span>
                      </div>
                      <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${geoPct}%` }} className="h-full rounded-full bg-rag-green" />
                      </div>
                    </div>
                    {todayGeoTotal === 0 && (
                      <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl">
                        <MapPin size={14} className="text-on-surface-variant/30" />
                        <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase">No geo-fence data yet. Visit an outlet to populate.</span>
                      </div>
                    )}
                  </>
                )}

                {/* ═══ NEW AGENTS DRILL-DOWN ═══ */}
                {drillCard === 'agents' && (
                  <>
                    <div className="mb-2 flex items-center justify-between rounded-xl bg-primary/10 p-4">
                      <div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-primary/70">Today&apos;s Activations</div>
                        <div className="font-display text-3xl font-black text-primary">{todayAgents}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50">Daily Target</div>
                        <div className="text-lg font-black text-on-surface-variant">1</div>
                      </div>
                    </div>
                    {todayAgents > 0 ? (
                      <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 px-1">Agents Recruited Today</div>
                        {agentNames.slice(0, todayAgents).map((name, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface-container-low p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[10px] font-black text-primary">
                              {name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-black">{name}</div>
                              <div className="text-[8px] font-bold text-on-surface-variant/40 uppercase">Activated today</div>
                            </div>
                            <CheckCircle2 size={14} className="text-rag-green" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl">
                        <Users size={14} className="text-on-surface-variant/30" />
                        <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase">No agents activated yet today. Recruit during outlet visits.</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM: Weekly Breakdown (+ embedded team board on Performance tab only) ── */}
      <div className={`grid gap-4 ${hideTeamRankBadge ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-on-surface">Weekly Breakdown</h2>
          <div className="space-y-4">
            {weeklyBreakdown.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-on-surface-variant">{item.label}</span>
                  <span className="text-[10px] font-black">{item.val}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    className={`h-full rounded-full ${item.progress >= 80 ? 'bg-rag-green' : item.progress >= 50 ? 'bg-rag-amber' : 'bg-rag-red'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {!hideTeamRankBadge && (
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-on-surface">Team Leaderboard</h2>
            <div className="space-y-3">
              {[
                { name: 'Lweendo Phiri', score: 982, rank: 1, trend: 'up' },
                { name: 'You (Mwape Banda)', score: 945, rank: 2, trend: 'up' },
                { name: 'Chisomo Kunda', score: 892, rank: 3, trend: 'down' },
                { name: 'Priya Nambwe', score: 856, rank: 4, trend: 'up' },
                { name: 'Tiza Mwale', score: 812, rank: 5, trend: 'down' },
              ].map((u, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    u.name.includes('You') ? 'border-primary/25 bg-primary/5' : 'border-border bg-surface-container-low'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${u.rank === 1 ? 'bg-rag-amber text-white' : u.rank === 2 ? 'bg-gray-300 text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                    {u.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black truncate">{u.name}</div>
                    <div className="text-[8px] text-on-surface-variant font-bold">{u.score} pts</div>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[9px] font-black ${u.trend === 'up' ? 'text-rag-green' : 'text-rag-red'}`}>
                    <ArrowUpRight size={10} className={u.trend === 'down' ? 'rotate-90' : ''} />
                    {u.trend === 'up' ? '+12%' : '-5%'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiModule;
