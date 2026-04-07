import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, CheckCircle2, MapPin, Users, Trophy, ArrowUpRight, Download, Share2 } from 'lucide-react';

const TeamKpis: React.FC = () => {
  const heroMetrics = [
    { label: 'Outlets Covered', val: '312/420', icon: <MapPin size={24} />, color: 'bg-primary/10 text-primary' },
    { label: 'GA (SIM+MoMo)', val: '142', icon: <TrendingUp size={24} />, color: 'bg-rag-green-bg text-rag-green' },
    { label: 'Recruited Agents', val: '12', icon: <Users size={24} />, color: 'bg-rag-amber-bg text-rag-amber' },
    { label: 'Compliance Rate', val: '94%', icon: <CheckCircle2 size={24} />, color: 'bg-primary/10 text-primary' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1 text-primary font-display font-extrabold">Team Performance KPIs</h1>
          <p className="text-on-surface-variant text-sm">Weekly performance breakdown for Lusaka East Team</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none btn btn-ghost text-xs py-2 px-4 border-black/10 flex items-center justify-center gap-2">
            <Download size={14} /> Export Report
          </button>
          <button className="flex-1 sm:flex-none btn btn-primary text-xs py-2 px-4 shadow-lg flex items-center justify-center gap-2">
            <Share2 size={14} /> Share with ZBM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {heroMetrics.map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-base p-4 sm:p-8 flex flex-col gap-2"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 ${metric.color}`}>
              {React.cloneElement(metric.icon as React.ReactElement, { size: 20 })}
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{metric.label}</span>
            <div className="text-xl sm:text-3xl font-extrabold font-display">{metric.val}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-base p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-lg font-bold">ASE Performance Breakdown</h2>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">This Week</span>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-black/5">
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ASE Name</th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Outlets</th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">GA Count</th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Compliance</th>
                  <th className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Quota</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Mwape Banda', outlets: '58/70', ga: 28, compliance: '98%', quota: 92 },
                  { name: 'Chisomo Kunda', outlets: '52/70', ga: 24, compliance: '94%', quota: 88 },
                  { name: 'Priya Nambwe', outlets: '48/70', ga: 21, compliance: '92%', quota: 82 },
                  { name: 'Tiza Mwale', outlets: '45/70', ga: 18, compliance: '88%', quota: 78 },
                  { name: 'Brian Nkosi', outlets: '32/70', ga: 12, compliance: '72%', quota: 55 },
                ].map((ase, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-surface-container-low transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-sm">{ase.name}</div>
                    </td>
                    <td className="p-4 text-xs font-bold">{ase.outlets}</td>
                    <td className="p-4 text-xs font-bold">{ase.ga}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold ${parseInt(ase.compliance) > 90 ? 'text-rag-green' : parseInt(ase.compliance) > 80 ? 'text-rag-amber' : 'text-rag-red'}`}>
                        {ase.compliance}
                      </span>
                    </td>
                    <td className="p-4 w-32">
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${ase.quota}%` }}
                          className={`h-full ${ase.quota > 80 ? 'bg-rag-green' : ase.quota > 40 ? 'bg-rag-amber' : 'bg-rag-red'}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-black/5">
            {[
              { name: 'Mwape Banda', outlets: '58/70', ga: 28, compliance: '98%', quota: 92 },
              { name: 'Chisomo Kunda', outlets: '52/70', ga: 24, compliance: '94%', quota: 88 },
              { name: 'Priya Nambwe', outlets: '48/70', ga: 21, compliance: '92%', quota: 82 },
              { name: 'Tiza Mwale', outlets: '45/70', ga: 18, compliance: '88%', quota: 78 },
              { name: 'Brian Nkosi', outlets: '32/70', ga: 12, compliance: '72%', quota: 55 },
            ].map((ase, i) => (
              <div key={i} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-sm">{ase.name}</div>
                  <span className={`text-xs font-bold ${parseInt(ase.compliance) > 90 ? 'text-rag-green' : parseInt(ase.compliance) > 80 ? 'text-rag-amber' : 'text-rag-red'}`}>
                    {ase.compliance}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Outlets</div>
                    <div className="text-xs font-bold">{ase.outlets}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">GA Count</div>
                    <div className="text-xs font-bold">{ase.ga}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span className="text-on-surface-variant uppercase tracking-widest">Quota Progress</span>
                    <span>{ase.quota}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ase.quota}%` }}
                      className={`h-full ${ase.quota > 80 ? 'bg-rag-green' : ase.quota > 40 ? 'bg-rag-amber' : 'bg-rag-red'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-base p-8 space-y-8">
          <h2 className="text-lg font-bold">Team Leaderboard</h2>
          <div className="space-y-6">
            {[
              { name: 'Mwape Banda', score: 982, rank: 1, trend: 'up' },
              { name: 'Chisomo Kunda', score: 945, rank: 2, trend: 'up' },
              { name: 'Priya Nambwe', score: 892, rank: 3, trend: 'down' },
              { name: 'Tiza Mwale', score: 856, rank: 4, trend: 'up' },
              { name: 'Brian Nkosi', score: 812, rank: 5, trend: 'down' }
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-black/5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${user.rank === 1 ? 'bg-rag-amber text-white' : 'bg-primary/10 text-primary'}`}>
                  {user.rank}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{user.name}</div>
                  <div className="text-[10px] text-on-surface-variant font-semibold">{user.score} Points</div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${user.trend === 'up' ? 'text-rag-green' : 'text-rag-red'}`}>
                  {user.trend === 'up' ? <ArrowUpRight size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                  {user.trend === 'up' ? '+12%' : '-5%'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamKpis;
