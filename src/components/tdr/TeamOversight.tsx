import React from 'react';
import { motion } from 'motion/react';
import {
  Users, MapPin, AlertTriangle, CheckCircle2, ShieldAlert,
  Activity, Trophy, Clock, TrendingUp, Smartphone, XCircle
} from 'lucide-react';
import { TEAM_TARGETS, ASE_DAILY_TARGETS, getAchievementPct, ragColor, ragBg } from '../../data/kpiStore';

interface TeamOversightProps {
  onAction: (message: string) => void;
}

const TeamOversight: React.FC<TeamOversightProps> = ({ onAction }) => {
  const aseList = [
    { id: 'ASE-20241', name: 'Mwape Banda', team: 'TL-10032', status: 'Active', lastCheckIn: '10:45 AM', outlet: 'Lusaka Central Agent', compliance: 'Passed', visits: 8, visitsTarget: 10, sims: 14, simsTarget: 20, momo: 5, momoTarget: 8 },
    { id: 'ASE-20242', name: 'Chisomo Kunda', team: 'TL-10032', status: 'Active', lastCheckIn: '11:15 AM', outlet: 'Bright Cash Agent', compliance: 'Warning', visits: 6, visitsTarget: 10, sims: 10, simsTarget: 20, momo: 3, momoTarget: 8 },
    { id: 'ASE-20243', name: 'Priya Nambwe', team: 'TL-10033', status: 'Active', lastCheckIn: '10:15 AM', outlet: 'Kabwe Retail Hub', compliance: 'Failed', visits: 4, visitsTarget: 10, sims: 6, simsTarget: 20, momo: 2, momoTarget: 8 },
    { id: 'ASE-20244', name: 'Tiza Mwale', team: 'TL-10033', status: 'Active', lastCheckIn: '10:38 AM', outlet: 'Copperbelt MoMo', compliance: 'Passed', visits: 3, visitsTarget: 10, sims: 4, simsTarget: 20, momo: 1, momoTarget: 8 },
    { id: 'ASE-20245', name: 'Brian Nkosi', team: 'TL-10032', status: 'Active', lastCheckIn: '10:42 AM', outlet: 'Cairo Road Mall', compliance: 'Warning', visits: 2, visitsTarget: 10, sims: 2, simsTarget: 20, momo: 0, momoTarget: 8 },
    { id: 'ASE-20246', name: 'Lweendo Phiri', team: 'TL-10032', status: 'Offline', lastCheckIn: 'N/A', outlet: 'N/A', compliance: 'N/A', visits: 0, visitsTarget: 10, sims: 0, simsTarget: 20, momo: 0, momoTarget: 8 },
    { id: 'ASE-20247', name: 'Namukolo Siame', team: 'TL-10033', status: 'Offline', lastCheckIn: 'N/A', outlet: 'N/A', compliance: 'N/A', visits: 0, visitsTarget: 10, sims: 0, simsTarget: 20, momo: 0, momoTarget: 8 },
  ];

  const activeAses = aseList.filter(a => a.status === 'Active');
  const offlineAses = aseList.filter(a => a.status === 'Offline');

  // Compliance flags
  const complianceFlags = [
    { type: 'Geo-fence Breach', ase: 'Brian Nkosi', time: '10:42 AM', severity: 'High' as const },
    { type: 'Route Deviation', ase: 'Tiza Mwale', time: '10:38 AM', severity: 'Medium' as const },
    { type: 'Proof-of-Visit Failure', ase: 'Priya Nambwe', time: '10:15 AM', severity: 'High' as const },
  ];

  // Zero-transaction / dormant agents
  const dormantAgents = [
    { name: 'Agent Kasama North', id: 'AG-007', days: 3 },
    { name: 'Agent Mansa Sub', id: 'AG-012', days: 2 },
  ];

  // Coverage gaps
  const coverageGaps = [
    { zone: 'Kabulonga', outlets: 8, days: 4 },
    { zone: 'Freedom Ave', outlets: 5, days: 3 },
    { zone: 'Chipata East', outlets: 12, days: 2 },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-black text-primary tracking-tight">Operations Center</h1>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Live field monitoring • Compliance • Performance</p>
        </div>
        <div className="flex gap-1.5">
          <span className="text-[8px] font-black bg-rag-green-bg text-rag-green px-2 py-1 rounded-lg uppercase">{activeAses.length} Active</span>
          <span className="text-[8px] font-black bg-rag-red-bg text-rag-red px-2 py-1 rounded-lg uppercase">{offlineAses.length} Offline</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live ASE Tracker Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/5 overflow-hidden">
          <div className="p-3 border-b border-black/5 bg-surface-container-low/50">
            <h2 className="text-[10px] font-black uppercase tracking-widest">Live ASE Tracker</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">ASE</th>
                  <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Visits</th>
                  <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">SIMs</th>
                  <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">MoMo</th>
                  <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Compliance</th>
                  <th className="p-2.5 text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Last</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {aseList.map((ase) => (
                  <tr key={ase.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-2.5">
                      <div className="text-[10px] font-black">{ase.name}</div>
                      <div className="text-[7px] font-bold text-on-surface-variant/40">{ase.team}</div>
                    </td>
                    <td className="p-2.5 text-[10px] font-black">
                      <span className="text-primary">{ase.visits}</span><span className="text-on-surface-variant/20 mx-0.5">/</span><span className="text-on-surface-variant/40">{ase.visitsTarget}</span>
                    </td>
                    <td className="p-2.5 text-[10px] font-black">
                      <span className="text-primary">{ase.sims}</span><span className="text-on-surface-variant/20 mx-0.5">/</span><span className="text-on-surface-variant/40">{ase.simsTarget}</span>
                    </td>
                    <td className="p-2.5 text-[10px] font-black">
                      <span className="text-primary">{ase.momo}</span><span className="text-on-surface-variant/20 mx-0.5">/</span><span className="text-on-surface-variant/40">{ase.momoTarget}</span>
                    </td>
                    <td className="p-2.5">
                      {ase.compliance !== 'N/A' ? (
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                          ase.compliance === 'Passed' ? 'bg-rag-green text-white' :
                          ase.compliance === 'Warning' ? 'bg-rag-amber text-white' : 'bg-rag-red text-white'
                        }`}>{ase.compliance}</span>
                      ) : <span className="text-[8px] text-on-surface-variant/30">—</span>}
                    </td>
                    <td className="p-2.5 text-[8px] font-bold text-on-surface-variant/40">{ase.lastCheckIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Compliance Flags */}
          <div className="bg-white rounded-xl border border-black/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={14} className="text-rag-red" />
              <span className="text-[9px] font-black uppercase tracking-widest">Compliance Flags</span>
            </div>
            {complianceFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-t border-black/5">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${flag.severity === 'High' ? 'bg-rag-red' : 'bg-rag-amber'}`} />
                <div className="flex-1">
                  <div className="text-[9px] font-black">{flag.ase}</div>
                  <div className="text-[7px] font-bold text-on-surface-variant/40">{flag.type} • {flag.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Dormant Agents (Zero Transaction from spec) */}
          <div className="bg-rag-amber-bg/30 border border-rag-amber/15 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-rag-amber" />
              <span className="text-[9px] font-black text-rag-amber uppercase tracking-widest">Dormant Agents</span>
            </div>
            {dormantAgents.map((agent, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-t border-rag-amber/10">
                <div>
                  <div className="text-[9px] font-black">{agent.name}</div>
                  <div className="text-[7px] font-bold text-on-surface-variant/40">{agent.id}</div>
                </div>
                <span className="text-[8px] font-black text-rag-amber">{agent.days}d inactive</span>
              </div>
            ))}
          </div>

          {/* Coverage Gaps */}
          <div className="bg-white rounded-xl border border-black/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest">Coverage Gaps</span>
            </div>
            {coverageGaps.map((gap, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-t border-black/5">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs">{gap.outlets}</div>
                <div className="flex-1">
                  <div className="text-[9px] font-black">{gap.zone}</div>
                  <div className="text-[7px] font-bold text-on-surface-variant/40">{gap.outlets} outlets • {gap.days}+ days unvisited</div>
                </div>
              </div>
            ))}
            <button
              onClick={() => onAction('Running coverage optimization...')}
              className="w-full btn btn-primary py-2 text-[8px] font-black uppercase tracking-widest mt-2 shadow"
            >
              Optimize Coverage
            </button>
          </div>

          {/* Team Leaderboard */}
          <div className="bg-white rounded-xl border border-black/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={14} className="text-rag-amber" />
              <span className="text-[9px] font-black uppercase tracking-widest">Leaderboard</span>
            </div>
            {[...aseList].filter(a => a.status === 'Active').sort((a, b) => b.sims - a.sims).map((ase, i) => (
              <div key={ase.id} className="flex items-center justify-between py-1.5 border-t border-black/5">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-black ${i === 0 ? 'bg-rag-amber text-white' : 'bg-surface-container text-on-surface-variant'}`}>{i + 1}</span>
                  <span className="text-[9px] font-black">{ase.name}</span>
                </div>
                <span className="text-[9px] font-black text-primary">{ase.sims} SIMs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOversight;
