import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Filter, Wallet, ArrowRightLeft, AlertTriangle, 
  CheckCircle2, ChevronRight, TrendingDown, Clock, MoveRight, 
  BarChart3, Download
} from 'lucide-react';
import { AGENT_FLOAT_DATA, getAchievementPct, ragColor, ragBg } from '../../data/kpiStore';

interface AgentLiquidityProps {
  onAction: (message: string) => void;
}

const AgentLiquidity: React.FC<AgentLiquidityProps> = ({ onAction }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Low' | 'Dormant'>('All');

  const filteredAgents = AGENT_FLOAT_DATA.filter(agent => {
    const matchesSearch = agent.agentName.toLowerCase().includes(search.toLowerCase()) || 
                          agent.agentId.toLowerCase().includes(search.toLowerCase());
    const pct = getAchievementPct(agent.minThreshold, agent.currentFloat);
    
    if (filter === 'Critical') return matchesSearch && pct < 20;
    if (filter === 'Low') return matchesSearch && pct < 50;
    if (filter === 'Dormant') return matchesSearch && agent.isDormant;
    return matchesSearch;
  });

  const stats = [
    { label: 'Critical Stockouts', val: AGENT_FLOAT_DATA.filter(a => (a.currentFloat / a.minThreshold) < 0.2).length, icon: <AlertTriangle />, color: 'text-rag-red' },
    { label: 'Dormant Float', val: AGENT_FLOAT_DATA.filter(a => a.isDormant).length, icon: <Clock />, color: 'text-rag-amber' },
    { label: 'Healthy Agents', val: AGENT_FLOAT_DATA.filter(a => (a.currentFloat / a.minThreshold) >= 0.8).length, icon: <CheckCircle2 />, color: 'text-rag-green' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary tracking-tight">Liquidity Management</h1>
          <p className="text-on-surface-variant text-sm font-medium">Float monitoring & Stockout projections (FR37-FR44)</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => onAction('Exporting Liquidity Report...')}
            className="flex-1 sm:flex-none btn bg-surface-container text-on-surface text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Macro Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card-base p-6 border-b-4 border-black/5"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{s.label}</span>
              <div className={s.color}>{s.icon}</div>
            </div>
            <div className="text-3xl font-extrabold font-display">{s.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Agent ID or Name..." 
            className="w-full bg-surface-container-lowest border border-black/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-surface-container rounded-2xl">
          {(['All', 'Critical', 'Low', 'Dormant'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Liquidity Table */}
      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-black/5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <th className="p-6">Agent / ID</th>
                <th className="p-6">Float Level (FR37)</th>
                <th className="p-6">Cash on Hand (FR38)</th>
                <th className="p-6">Stockout Projection (FR40)</th>
                <th className="p-6">Dormancy (FR44)</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredAgents.map((agent, i) => {
                const pct = getAchievementPct(agent.minThreshold, agent.currentFloat);
                return (
                  <motion.tr 
                    key={agent.agentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-surface-container-low/50 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {agent.agentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-on-surface">{agent.agentName}</div>
                          <div className="text-[10px] text-on-surface-variant font-semibold">{agent.agentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1.5 w-32">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className={ragColor(pct)}>{agent.currentFloat.toLocaleString()} K</span>
                          <span className="text-on-surface-variant">Min: {agent.minThreshold.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div className={`h-full ${ragBg(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 font-bold text-sm text-rag-green">
                        <Wallet size={16} />
                        {agent.lastCashCheck.toLocaleString()} K
                      </div>
                      <div className="text-[9px] text-on-surface-variant font-semibold">Verified {agent.lastStockCheck}</div>
                    </td>
                    <td className="p-6">
                      <div className={`flex items-center gap-2 text-xs font-bold ${pct < 20 ? 'text-rag-red' : 'text-on-surface'}`}>
                        <TrendingDown size={14} />
                        {agent.timeToStockout}
                      </div>
                      <div className="text-[9px] text-on-surface-variant font-semibold">Rate: {agent.depletionRate}</div>
                    </td>
                    <td className="p-6">
                      {agent.isDormant ? (
                        <span className="px-2.5 py-1 rounded-full bg-rag-amber-bg text-rag-amber text-[9px] font-bold flex items-center gap-1.5 w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-rag-amber animate-pulse" /> REDISTRIBUTE
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rag-green-bg text-rag-green text-[9px] font-bold flex items-center gap-1.5 w-fit">
                          <CheckCircle2 size={12} /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => onAction(`Initiating Rebalancing for ${agent.agentName}...`)}
                        className="btn bg-primary text-white text-[10px] px-4 py-2 font-bold rounded-xl flex items-center gap-2 hover:bg-primary-dark shadow-lg transition-all ml-auto"
                      >
                        <ArrowRightLeft size={14} /> Rebalance
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentLiquidity;
