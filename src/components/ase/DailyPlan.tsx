import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, CheckCircle2, Clock, XCircle, Target, TrendingUp, UserPlus, Activity, Calendar, ChevronRight } from 'lucide-react';
import { Outlet } from '../../types';
import { ASE_DAILY_TARGETS, AseTargets, getAchievementPct, ragColor } from '../../data/kpiStore';
import VisitModule from './VisitModule';

interface DailyPlanProps {
  outlets: Outlet[];
  onCheckIn: (outlet: Outlet) => void;
  onAction?: (msg: string) => void;
  userId?: string;
  sessionKpis?: { visits: number; grossAdditions: number; agentActivation: number; floatChecks: number; };
}

const DailyPlan: React.FC<DailyPlanProps> = ({ outlets, onCheckIn, onAction, userId, sessionKpis }) => {
  const myTargets: AseTargets = ASE_DAILY_TARGETS.find(a => a.aseId === userId) || ASE_DAILY_TARGETS[0];
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [visitOutlet, setVisitOutlet] = useState<Outlet | null>(null);

  const total = outlets.length;

  // Visited/Missed/Remaining — live for Daily, dummy for Weekly/Monthly
  const visitedToday = outlets.filter(o => o.status === 'Visited').length;
  const missedToday = outlets.filter(o => o.status === 'Missed').length;
  const remainingToday = outlets.filter(o => o.status === 'Planned' || o.status === 'Next').length;

  const visited = period === 'Daily' ? visitedToday : period === 'Weekly' ? 42 : 168;
  const missed = period === 'Daily' ? missedToday : period === 'Weekly' ? 8 : 22;
  const remaining = period === 'Daily' ? remainingToday : period === 'Weekly' ? 20 : 60;

  // Period multiplier for Weekly/Monthly view
  const multiplier = period === 'Weekly' ? 7 : period === 'Monthly' ? 30 : 1;

  // Today's 4 Target Cards — the user's core daily deliverables
  const targetCards = [
    { key: 'visits',       kpi: myTargets.visits,            icon: <MapPin size={18} />,     color: 'bg-primary',   accent: 'border-primary/20',    cardLabel: 'Outlet Visited' },
    { key: 'sims',         kpi: myTargets.grossAdditions,    icon: <TrendingUp size={18} />, color: 'bg-rag-green', accent: 'border-rag-green/20',  cardLabel: 'SIM Registration' },
    { key: 'agents',       kpi: myTargets.agentRecruitment,  icon: <UserPlus size={18} />,   color: 'bg-blue-600',  accent: 'border-blue-600/20',   cardLabel: 'Agent Activation' },
    { key: 'floatChecks',  kpi: myTargets.floatAvailability, icon: <Activity size={18} />,   color: 'bg-rag-amber', accent: 'border-rag-amber/20',  cardLabel: 'Float Checks Done' },
  ];

  const handleOutletClick = (outlet: Outlet) => {
    // Open visit modal inline — do NOT navigate away
    setVisitOutlet(outlet);
  };

  const handleVisitSubmit = (data: any) => {
    onAction?.(`Visit submitted for ${visitOutlet?.name}`);
    setVisitOutlet(null);
    // Update outlet status to Visited (local state only)
    onCheckIn(visitOutlet!);
  };

  return (
    <>
      <div className="space-y-4 pb-8">
        {/* Header + Period Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">Your Task</h1>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-0.5">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })} • Lusaka Central
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1">
            {(['Daily', 'Weekly', 'Monthly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  period === p ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Visit Progress Strip */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-rag-green-bg rounded-xl p-3 text-center cursor-pointer hover:ring-2 hover:ring-rag-green transition-all" onClick={() => onAction?.(`${visited} outlets visited today`)}>
            <div className="text-2xl font-black font-display text-rag-green">{visited}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-rag-green/70">Visited</div>
          </div>
          <div className="bg-rag-red-bg rounded-xl p-3 text-center cursor-pointer hover:ring-2 hover:ring-rag-red transition-all" onClick={() => onAction?.(`${missed} visits missed today`)}>
            <div className="text-2xl font-black font-display text-rag-red">{missed}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-rag-red/70">Missed</div>
          </div>
          <div className="bg-rag-amber-bg rounded-xl p-3 text-center cursor-pointer hover:ring-2 hover:ring-rag-amber transition-all" onClick={() => onAction?.(`${remaining} outlets remaining`)}>
            <div className="text-2xl font-black font-display text-rag-amber">{remaining}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-rag-amber/70">Remaining</div>
          </div>
        </div>

        {/* ── CORE LOB TARGET CARDS — SIM, Float, MoMo + Visits ── */}
        <div className="bg-surface-container-low rounded-2xl border border-black/5 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                {period === 'Daily' ? "Today's Targets" : period === 'Weekly' ? 'This Week' : 'This Month'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={10} className="text-on-surface-variant/40" />
              <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">
                {period === 'Daily' ? 'Fresh Day — All start at 0' : `${period} View`}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {targetCards.map((card, i) => {
              const target = period === 'Daily' ? card.kpi.target : card.kpi.target * multiplier;
              let actual = 0;
              if (period === 'Daily' && sessionKpis) {
                if (card.key === 'visits') actual = sessionKpis.visits;
                else if (card.key === 'sims') actual = sessionKpis.grossAdditions;
                else if (card.key === 'agents') actual = sessionKpis.agentActivation;
                else if (card.key === 'floatChecks') actual = sessionKpis.floatChecks;
              } else {
                // Weekly/Monthly — show realistic dummy data
                actual = Math.round(card.kpi.target * (period === 'Weekly' ? 4.2 : 18));
              }
              const pct = getAchievementPct(target, actual);
              return (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAction?.(`${card.cardLabel}: ${actual} of ${target} ${card.kpi.unit} (${period})`)}
                  className={`bg-white rounded-xl p-4 border-2 ${card.accent} cursor-pointer hover:shadow-lg transition-all group`}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`p-2 rounded-xl ${card.color} text-white shadow-sm`}>
                      {card.icon}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-tight text-on-surface-variant leading-tight">{card.cardLabel}</div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-display ${actual > 0 ? ragColor(pct) : 'text-on-surface/25'}`}>
                      {actual.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-on-surface-variant/30">/ {target.toLocaleString()}</span>
                  </div>
                  <div className="text-[8px] font-bold text-on-surface-variant/35 uppercase tracking-widest mt-0.5">{card.kpi.unit}</div>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${actual > 0 ? (pct >= 80 ? 'bg-rag-green' : pct >= 50 ? 'bg-rag-amber' : 'bg-rag-red') : 'bg-on-surface/10'}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── ROUTE MAP PREVIEW ── */}
        <div className="bg-[#FAF9F6] rounded-2xl border border-black/5 overflow-hidden p-6">
          <div className="relative h-[200px] flex items-center justify-center">
            {/* Map SVG visualization */}
            <svg viewBox="0 0 400 160" className="w-[80%] h-full mt-4 -ml-4" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>
              
              {/* Planned path (dashed) */}
              <path d="M40,120 C80,80 120,100 160,100 C200,100 240,40 320,40" fill="none" stroke="#D1D5DB" strokeWidth="4" strokeDasharray="6,4" />
              
              {/* Actual completed path (red) */}
              <path d="M40,120 C80,80 120,100 145,100" fill="none" stroke="#CE1126" strokeWidth="4" />

              {/* Start node (You) */}
              <g transform="translate(40,120)">
                <circle r="12" fill="white" filter="url(#shadow)" />
                <circle r="8" fill="#1B5E20" />
                <text x="18" y="4" fontSize="10" fontWeight="bold" fill="#666">You</text>
              </g>

              {/* Visited node 2 */}
              <g transform="translate(145,100)">
                <circle r="12" fill="white" filter="url(#shadow)" />
                <circle r="10" fill="#CE1126" />
                <text x="0" y="4" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">2</text>
              </g>

              {/* Planned node 3 */}
              <g transform="translate(230,60)">
                <circle r="12" fill="white" filter="url(#shadow)" />
                <circle r="10" fill="#CE1126" />
                <text x="0" y="4" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">3</text>
              </g>

              {/* Planned node 4 */}
              <g transform="translate(320,40)">
                <circle r="12" fill="white" filter="url(#shadow)" />
                <circle r="10" fill="#CE1126" />
                <text x="0" y="4" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">4</text>
              </g>
            </svg>

            {/* Legend inside the widget */}
            <div className="absolute bottom-2 right-2 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-4 border border-black/5 text-[10px] font-bold">
              <div className="flex items-center gap-1.5 text-[#CE1126]"><div className="w-4 h-0.5 bg-[#CE1126]" /> Actual</div>
              <div className="flex items-center gap-1.5 text-on-surface-variant"><div className="w-4 h-0.5 bg-[#D1D5DB]" style={{ borderBottom: '1px dashed #D1D5DB', height: '0', background: 'none' }} /> Planned</div>
            </div>
          </div>
        </div>

        {/* ── OUTLET QUEUE — clicking opens visit modal inline ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-on-surface">Route Queue</h2>
            <span className="text-[9px] font-bold text-on-surface-variant uppercase">{total} outlets total</span>
          </div>

          {/* Next Up — highlighted */}
          {outlets.filter(o => o.status === 'Next').map((outlet) => (
            <motion.div
              key={outlet.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleOutletClick(outlet)}
              className="bg-primary text-white rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Tap to Start Visit</div>
                  <div className="font-black text-sm">{outlet.name}</div>
                  <div className="text-[10px] opacity-70 font-semibold">{outlet.address}</div>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">
                  <Navigation size={18} />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">{outlet.category}</span>
                <span className="text-[8px] font-bold opacity-70">{outlet.distance} away</span>
              </div>
            </motion.div>
          ))}

          {/* Planned outlets */}
          {outlets.filter(o => o.status === 'Planned').map((outlet, i) => (
            <motion.div
              key={outlet.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleOutletClick(outlet)}
              className="bg-white rounded-xl p-3 border border-black/5 cursor-pointer hover:border-primary/30 active:scale-[0.98] transition-all flex justify-between items-center"
            >
              <div className="flex-1 min-w-0">
                <div className="font-black text-xs truncate">{outlet.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-bold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant uppercase">{outlet.category}</span>
                  <span className="text-[8px] font-bold text-on-surface-variant/50">{outlet.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-on-surface-variant/30">Tap to visit</span>
                <ChevronRight size={14} className="text-primary/40" />
              </div>
            </motion.div>
          ))}

          {/* Visited outlets — collapsed */}
          {outlets.filter(o => o.status === 'Visited').length > 0 && (
            <div className="space-y-1 opacity-60">
              <div className="text-[8px] font-black uppercase tracking-widest text-rag-green px-1 pt-2">Completed ({outlets.filter(o => o.status === 'Visited').length})</div>
              {outlets.filter(o => o.status === 'Visited').map((outlet) => (
                <div key={outlet.id} className="bg-rag-green-bg/30 rounded-lg p-2 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-rag-green" />
                    <span className="font-bold text-[10px] truncate">{outlet.name}</span>
                  </div>
                  <span className="text-[8px] font-bold text-rag-green">Done</span>
                </div>
              ))}
            </div>
          )}

          {/* Missed outlets */}
          {outlets.filter(o => o.status === 'Missed').length > 0 && (
            <div className="space-y-1">
              <div className="text-[8px] font-black uppercase tracking-widest text-rag-red px-1 pt-2">Missed ({outlets.filter(o => o.status === 'Missed').length})</div>
              {outlets.filter(o => o.status === 'Missed').map((outlet) => (
                <div key={outlet.id} className="bg-rag-red-bg/30 rounded-lg p-2 flex justify-between items-center text-xs border border-rag-red/10">
                  <div className="flex items-center gap-2">
                    <XCircle size={12} className="text-rag-red" />
                    <span className="font-bold text-[10px] truncate">{outlet.name}</span>
                  </div>
                  <span className="text-[8px] font-bold text-rag-red">Justification Required</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── VISIT MODULE MODAL — opens inline, user stays on Your Task ── */}
      {visitOutlet && (
        <VisitModule
          outlet={visitOutlet}
          onClose={() => setVisitOutlet(null)}
          onSubmit={handleVisitSubmit}
        />
      )}
    </>
  );
};

export default DailyPlan;
