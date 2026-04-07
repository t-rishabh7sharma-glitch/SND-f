import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, TrendingUp, UserPlus, Activity, Navigation, Target, ChevronRight, Calendar } from 'lucide-react';
import { Outlet, User as UserType } from '../../types';
import { ASE_DAILY_TARGETS, AseTargets, getAchievementPct, ragColor } from '../../data/kpiStore';
import VisitModule from './VisitModule';

interface AseDashboardProps {
  outlets: Outlet[];
  onCheckIn: (outlet: Outlet) => void;
  onEodSync?: () => void;
  user?: UserType | null;
  sessionKpis?: { visits: number; grossAdditions: number; agentActivation: number; floatChecks: number; };
}

const AseDashboard: React.FC<AseDashboardProps> = ({ outlets, onCheckIn, onEodSync, user, sessionKpis }) => {
  const myTargets: AseTargets = ASE_DAILY_TARGETS.find(a => a.aseId === user?.id) || ASE_DAILY_TARGETS[0];
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [visitOutlet, setVisitOutlet] = useState<Outlet | null>(null);

  const visited = outlets.filter(o => o.status === 'Visited').length;
  const remaining = outlets.filter(o => o.status === 'Planned' || o.status === 'Next').length;
  const multiplier = period === 'Weekly' ? 7 : period === 'Monthly' ? 30 : 1;

  // Core hero KPIs matching Your Task
  const heroKpis = [
    { key: 'visits',      kpi: myTargets.visits,           icon: <MapPin size={20} />,     color: 'text-primary',   bg: 'bg-primary/5',      cardLabel: 'Outlet Visited' },
    { key: 'sims',        kpi: myTargets.grossAdditions,   icon: <TrendingUp size={20} />, color: 'text-rag-green', bg: 'bg-rag-green-bg',   cardLabel: 'SIM Registration' },
    { key: 'agents',      kpi: myTargets.agentRecruitment, icon: <UserPlus size={20} />,   color: 'text-blue-600',  bg: 'bg-blue-50',        cardLabel: 'Agent Activation' },
    { key: 'floatChecks', kpi: myTargets.floatAvailability, icon: <Activity size={20} />,  color: 'text-rag-amber', bg: 'bg-rag-amber-bg',   cardLabel: 'Float Checks Done' },
  ];

  const handleOutletClick = (outlet: Outlet) => {
    setVisitOutlet(outlet);
  };

  const handleVisitSubmit = (data: any) => {
    setVisitOutlet(null);
    onCheckIn(visitOutlet!);
  };

  return (
    <>
      <div className="space-y-4 pb-20 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">Performance Hub</h1>
            <div className="flex flex-wrap gap-x-3 text-on-surface-variant text-[9px] font-bold uppercase tracking-widest mt-0.5">
              <span className="flex items-center gap-1"><MapPin size={9} /> {user?.region} • {user?.territory}</span>
              <span>Today: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          {/* Period Toggle */}
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

        {/* ── HERO: Core Daily KPIs (Outlet Visited, SIM, Agent, Float) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {heroKpis.map((card, i) => {
            const target = card.kpi.target * multiplier;
            let actual = 0;
            if (period === 'Daily' && sessionKpis) {
              if (card.key === 'visits') actual = sessionKpis.visits;
              else if (card.key === 'sims') actual = sessionKpis.grossAdditions;
              else if (card.key === 'agents') actual = sessionKpis.agentActivation;
              else if (card.key === 'floatChecks') actual = sessionKpis.floatChecks;
            } else {
              actual = Math.round(card.kpi.target * (period === 'Weekly' ? 4.2 : 18));
            }
            const pct = getAchievementPct(target, actual);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${card.bg} rounded-2xl p-4 border border-black/5`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={card.color}>{card.icon}</div>
                  <span className="text-[8px] font-black uppercase tracking-tight text-on-surface-variant">{card.cardLabel}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-black font-display ${actual > 0 ? ragColor(pct) : 'text-on-surface/20'}`}>
                    {actual.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-on-surface-variant/30">/ {target.toLocaleString()}</span>
                </div>
                <div className="text-[8px] font-bold text-on-surface-variant/30 uppercase mt-0.5">{card.kpi.unit}</div>
                {/* Mini progress bar */}
                <div className="mt-2 h-1.5 bg-black/5 rounded-full overflow-hidden">
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

        {/* ── ROUTE MAP ── */}
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="p-3 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase tracking-widest">Route Map</h2>
            <div className="flex gap-2">
              <span className="text-[8px] font-black bg-rag-green-bg text-rag-green px-2 py-0.5 rounded-full uppercase">{visited} Done</span>
              <span className="text-[8px] font-black bg-rag-amber-bg text-rag-amber px-2 py-0.5 rounded-full uppercase">{remaining} Left</span>
            </div>
          </div>
          <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-white to-rag-green/5 relative flex items-center justify-center">
            <svg viewBox="0 0 600 280" className="absolute inset-0 w-full h-full p-4">
              <path d="M40,220 C100,180 140,60 220,80 S350,200 420,120 S520,40 570,80" fill="none" stroke="#1B5E20" strokeWidth="2.5" strokeDasharray="6,3" opacity="0.3"/>
              {outlets.filter(o => o.status === 'Visited').map((o, i) => (
                <g key={o.id}>
                  <circle cx={40 + i * 90} cy={220 - i * 70} r="12" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="2"/>
                  <text x={40 + i * 90} y={220 - i * 70 + 4} textAnchor="middle" fill="#4CAF50" fontSize="8" fontWeight="bold">✓</text>
                  <text x={40 + i * 90} y={220 - i * 70 + 24} textAnchor="middle" fill="#666" fontSize="7" fontWeight="600">{o.name.split(' ').slice(0,2).join(' ')}</text>
                </g>
              ))}
              {outlets.filter(o => o.status === 'Next').map((o, i) => (
                <g key={o.id}>
                  <circle cx={220 + i * 100} cy={80} r="14" fill="#1B5E20" stroke="white" strokeWidth="3">
                    <animate attributeName="r" values="14;17;14" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x={220 + i * 100} y={84} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">▶</text>
                  <text x={220 + i * 100} y={106} textAnchor="middle" fill="#1B5E20" fontSize="8" fontWeight="700">{o.name.split(' ').slice(0,2).join(' ')}</text>
                </g>
              ))}
              {outlets.filter(o => o.status === 'Planned').slice(0, 3).map((o, i) => (
                <g key={o.id}>
                  <circle cx={370 + i * 80} cy={160 - i * 50} r="10" fill="white" stroke="#CCC" strokeWidth="1.5" strokeDasharray="3,2"/>
                  <text x={370 + i * 80} y={164 - i * 50} textAnchor="middle" fill="#999" fontSize="7">{i + 3}</text>
                  <text x={370 + i * 80} y={180 - i * 50} textAnchor="middle" fill="#999" fontSize="6">{o.name.split(' ').slice(0,2).join(' ')}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Next Queue — clicking opens visit modal inline */}
        <div className="bg-surface-container-low rounded-xl border border-black/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[9px] font-black uppercase tracking-widest">Next Outlets</h2>
            <span className="text-[8px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-black uppercase">Tap to Visit</span>
          </div>
          <div className="space-y-1.5">
            {outlets.filter(o => o.status === 'Next' || o.status === 'Planned').slice(0, 4).map((outlet, i) => (
              <div key={i} className="bg-white p-2.5 rounded-lg border border-black/5 flex justify-between items-center hover:border-primary/30 cursor-pointer transition-all" onClick={() => handleOutletClick(outlet)}>
                <div className="min-w-0 flex-1 pr-2">
                  <div className="font-black text-[10px] truncate uppercase tracking-tight">{outlet.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[7px] font-bold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant uppercase">{outlet.category}</span>
                    <span className="text-[7px] font-bold text-on-surface-variant/40">{outlet.distance}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-primary/40 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VISIT MODULE MODAL — user stays on Dashboard ── */}
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

export default AseDashboard;
