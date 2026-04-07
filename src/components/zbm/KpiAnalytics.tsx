import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Users, MapPin, Activity,
  BarChart3, Download, Target, Trophy,
  Smartphone, CreditCard, UserPlus, Zap
} from 'lucide-react';
import { ZONE_TARGETS, TERRITORY_TARGETS, TEAM_TARGETS, getAchievementPct, ragColor, ragBg } from '../../data/kpiStore';

interface KpiAnalyticsProps {
  onAction: (message: string) => void;
}

const KpiAnalytics: React.FC<KpiAnalyticsProps> = ({ onAction }) => {
  const [reportType, setReportType] = useState<'Acquisition Funnel' | 'Channel Mix' | 'Territory Benchmark' | 'Market Penetration'>('Acquisition Funnel');

  const totalGa = ZONE_TARGETS.grossAdditions.actual;
  const targetGa = ZONE_TARGETS.grossAdditions.target;
  const momoGa = ZONE_TARGETS.momoGA.actual;

  // Funnel (Prospects → Leads → GA → MoMo)
  const funnelSteps = [
    { stage: 'Prospects Logged', val: totalGa * 3, conv: '100%', color: 'bg-primary/20 text-primary' },
    { stage: 'Verified Leads', val: Math.round(totalGa * 1.5), conv: '50%', color: 'bg-primary/40 text-primary' },
    { stage: 'SIM Registrations (GA)', val: totalGa, conv: '33%', color: 'bg-primary/60 text-white' },
    { stage: 'MoMo Registrations', val: momoGa, conv: `${Math.round((momoGa / totalGa) * 100)}%`, color: 'bg-rag-green text-white' },
  ];

  // Channel Mix
  const channels = [
    { name: 'Direct Sales (DSA)', val: Math.round(totalGa * 0.4), pct: 40, color: 'bg-primary' },
    { name: 'Agent-led (Retail)', val: Math.round(totalGa * 0.45), pct: 45, color: 'bg-rag-amber' },
    { name: 'Merchant-led', val: Math.round(totalGa * 0.15), pct: 15, color: 'bg-rag-green' },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">Deep Analytics</h1>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Acquisition • Channels • Benchmarks • Market</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="flex-1 sm:flex-none bg-surface-container text-[9px] py-2 px-3 rounded-xl border-none font-black uppercase tracking-widest"
          >
            <option>Acquisition Funnel</option>
            <option>Channel Mix</option>
            <option>Territory Benchmark</option>
            <option>Market Penetration</option>
          </select>
          <button
            onClick={() => onAction(`Downloading ${reportType} Report PDF...`)}
            className="btn bg-primary text-white text-[8px] px-3 py-2 rounded-xl font-black flex items-center gap-1 shadow"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Macro KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { label: 'Gross Additions', val: totalGa, tgt: targetGa, icon: <UserPlus size={16} /> },
          { label: 'MoMo Registrations', val: momoGa, tgt: ZONE_TARGETS.momoGA.target, icon: <Smartphone size={16} /> },
          { label: 'Agent Recruitment', val: ZONE_TARGETS.agentRecruitment.actual, tgt: ZONE_TARGETS.agentRecruitment.target, icon: <Users size={16} /> },
          { label: 'Merchant Recruitment', val: ZONE_TARGETS.merchantRecruitment.actual, tgt: ZONE_TARGETS.merchantRecruitment.target, icon: <Users size={16} /> },
        ].map((kpi, i) => {
          const pct = getAchievementPct(kpi.tgt, kpi.val);
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-3 border border-black/5 border-l-4 border-l-primary/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-primary/10 text-primary rounded-lg">{kpi.icon}</div>
                <span className="text-[8px] font-black uppercase tracking-tight text-on-surface-variant truncate">{kpi.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-black font-display ${ragColor(pct)}`}>{kpi.val.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-on-surface-variant/30">/ {kpi.tgt.toLocaleString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/5 p-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
            <h3 className="text-sm font-black">{reportType} Analysis</h3>
            <span className="text-[8px] font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-0.5 rounded-full">Zone Level</span>
          </div>

          {reportType === 'Acquisition Funnel' && (
            <div className="space-y-3">
              <p className="text-[9px] text-on-surface-variant font-semibold mb-4">End-to-end view from lead generation to MoMo activation.</p>
              {funnelSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 text-right">
                    <span className="text-[10px] font-black text-primary">{step.conv}</span>
                  </div>
                  <div className="flex-1">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${100 - (i * 18)}%` }} transition={{ delay: i * 0.1 }}
                      className={`p-2.5 rounded-r-xl ${step.color} shadow-sm flex items-center justify-between`}
                    >
                      <span className="text-[9px] font-bold">{step.stage}</span>
                      <span className="text-xs font-black">{step.val.toLocaleString()}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-black/5 grid grid-cols-2 gap-2">
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <div className="text-[8px] font-bold text-on-surface-variant uppercase">Lead → GA Drop-off</div>
                  <div className="text-lg font-black text-rag-amber">66.6%</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <div className="text-[8px] font-bold text-on-surface-variant uppercase">GA → MoMo Drop-off</div>
                  <div className="text-lg font-black text-rag-red">{100 - Math.round((momoGa / totalGa) * 100)}%</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'Channel Mix' && (
            <div className="space-y-4">
              <p className="text-[9px] text-on-surface-variant font-semibold mb-3">Gross Additions by acquisition channel.</p>
              <div className="flex h-10 rounded-full overflow-hidden shadow-inner">
                {channels.map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className={`${c.color} flex items-center justify-center text-white text-[9px] font-black`} style={{ width: `${c.pct}%` }}
                  >{c.pct > 10 ? `${c.pct}%` : ''}</motion.div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {channels.map((c, i) => (
                  <div key={i} className="p-3 border border-black/5 rounded-xl">
                    <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-on-surface-variant mb-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} /> {c.name}
                    </div>
                    <div className="text-lg font-black font-display">{c.val.toLocaleString()}</div>
                    <div className="text-[8px] font-semibold text-primary">{c.pct}% of total</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'Territory Benchmark' && (
            <div className="space-y-3">
              <p className="text-[9px] text-on-surface-variant font-semibold mb-3">Territory performance scorecard ranked by GA achievement.</p>
              {TERRITORY_TARGETS.map((terr, i) => {
                const pct = getAchievementPct(terr.grossAdditions.target, terr.grossAdditions.actual);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black ${i === 0 ? 'bg-rag-amber text-white' : 'bg-surface-container text-on-surface-variant'}`}>{i + 1}</span>
                    <div className="flex-1">
                      <div className="text-xs font-black">{terr.territoryName}</div>
                      <div className="text-[8px] font-bold text-on-surface-variant/40">{terr.tdrName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black">{terr.grossAdditions.actual} <span className="text-on-surface-variant/20">/ {terr.grossAdditions.target}</span></div>
                      <div className="text-[7px] font-bold text-on-surface-variant/30 uppercase">GA ({pct}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {reportType === 'Market Penetration' && (
            <div className="space-y-4">
              <p className="text-[9px] text-on-surface-variant font-semibold mb-3">Zamtel market share vs competitors.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 p-4 rounded-xl">
                  <div className="text-[8px] font-bold text-primary uppercase mb-1">Zamtel Share</div>
                  <div className="text-2xl font-black text-primary font-display">28.4%</div>
                  <div className="text-[9px] font-semibold text-on-surface-variant">+1.2% growth this Qtr</div>
                </div>
                <div className="bg-rag-amber/10 p-4 rounded-xl">
                  <div className="text-[8px] font-bold text-rag-amber uppercase mb-1">Competitor A</div>
                  <div className="text-2xl font-black text-rag-amber font-display">42.1%</div>
                  <div className="text-[9px] font-semibold text-on-surface-variant">Slight decline</div>
                </div>
              </div>
              <div className="pt-3 border-t border-black/5">
                <div className="text-[8px] font-bold text-on-surface-variant uppercase mb-3">Regional Penetration</div>
                {[
                  { region: 'Lusaka CBD', share: '45%' },
                  { region: 'Copperbelt', share: '32%' },
                  { region: 'North Western', share: '18%' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-surface-container-low p-2.5 rounded-xl mb-1">
                    <span className="text-[10px] font-black">{r.region}</span>
                    <span className="text-[10px] font-black text-primary">{r.share}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GA Territory Gap + Leaderboard */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-black/5 p-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-3">
              <h3 className="text-xs font-black">GA Territory Gap</h3>
              <span className="text-[7px] font-bold text-rag-red uppercase bg-rag-red-bg px-1.5 py-0.5 rounded-full">Action Required</span>
            </div>
            {TERRITORY_TARGETS.map(t => ({
              name: t.territoryName,
              gap: t.grossAdditions.target - t.grossAdditions.actual,
              pct: getAchievementPct(t.grossAdditions.target, t.grossAdditions.actual)
            }))
            .sort((a, b) => b.gap - a.gap)
            .slice(0, 4)
            .map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-t border-black/5">
                <div>
                  <div className="text-[10px] font-black">{t.name}</div>
                  <div className={`text-[8px] font-bold ${ragColor(t.pct)}`}>{t.pct}% on target</div>
                </div>
                <div className="text-xs font-black text-rag-red">-{t.gap.toLocaleString()}</div>
              </div>
            ))}
            <button
              onClick={() => onAction('Generating GAP Escalation Report...')}
              className="w-full btn btn-ghost py-2 text-[8px] font-black text-rag-red uppercase border-rag-red/20 hover:bg-rag-red/10 mt-2"
            >
              Escalate Gaps
            </button>
          </div>

          {/* Zone-wide Leaderboard */}
          <div className="bg-white rounded-xl border border-black/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={14} className="text-rag-amber" />
              <span className="text-[9px] font-black uppercase tracking-widest">Zone Leaderboard</span>
            </div>
            {TEAM_TARGETS.sort((a, b) => b.grossAdditions.actual - a.grossAdditions.actual).map((t, i) => (
              <div key={t.tlId} className="flex items-center justify-between py-1.5 border-t border-black/5">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-black ${i === 0 ? 'bg-rag-amber text-white' : 'bg-surface-container text-on-surface-variant'}`}>{i + 1}</span>
                  <div>
                    <div className="text-[9px] font-black">{t.teamName}</div>
                    <div className="text-[7px] font-bold text-on-surface-variant/40">{t.tlName}</div>
                  </div>
                </div>
                <span className="text-[9px] font-black text-primary">{t.grossAdditions.actual} GA</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiAnalytics;
