import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { TEAM_TARGETS, getAchievementPct, ragColor, ragBg } from '../../data/kpiStore';

interface TeamReportsProps {
  onAction: (message: string) => void;
}

const TeamReports: React.FC<TeamReportsProps> = ({ onAction }) => {
  const myTeam = TEAM_TARGETS[0]; // Lusaka East Alpha
  const visitPct = getAchievementPct(myTeam.visits.target, myTeam.visits.actual);
  const gaPct = getAchievementPct(myTeam.grossAdditions.target, myTeam.grossAdditions.actual);

  const weeklyTrends = [
    { day: 'Mon', visits: 45, targets: 50 },
    { day: 'Tue', visits: 52, targets: 50 },
    { day: 'Wed', visits: 48, targets: 50 },
    { day: 'Thu', visits: 53, targets: 50 },
    { day: 'Fri', visits: 60, targets: 50 },
    { day: 'Sat', visits: 35, targets: 50 },
    { day: 'Sun', visits: 25, targets: 50 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary tracking-tight">Team Performance Reports</h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">Comprehensive analysis of {myTeam.teamName} execution cycles</p>
        </div>
        <button 
          onClick={() => onAction('Exporting Full Team Report PDF...')}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 transform active:scale-95"
        >
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6 border-l-4 border-rag-green">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rag-green/10 text-rag-green rounded-xl"><Target size={20} /></div>
            <span className="text-[10px] font-bold text-rag-green bg-rag-green-bg px-2 py-0.5 rounded-full">+12.5% vs Prev Wk</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Team Visit Compliance</p>
          <h3 className="text-3xl font-extrabold font-display mt-1">{visitPct}%</h3>
          <div className="w-full h-1.5 bg-surface-container rounded-full mt-4 overflow-hidden">
            <div className={`h-full ${ragBg(visitPct)}`} style={{ width: `${visitPct}%` }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-6 border-l-4 border-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Users size={20} /></div>
            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">On Track</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Gross Addition Target</p>
          <h3 className="text-3xl font-extrabold font-display mt-1">{myTeam.grossAdditions.actual} <span className="text-sm font-normal text-on-surface-variant">/ {myTeam.grossAdditions.target}</span></h3>
          <div className="w-full h-1.5 bg-surface-container rounded-full mt-4 overflow-hidden">
            <div className={`h-full ${ragBg(gaPct)}`} style={{ width: `${gaPct}%` }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-base p-6 border-l-4 border-rag-amber">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rag-amber/10 text-rag-amber rounded-xl"><TrendingUp size={20} /></div>
            <span className="text-[10px] font-bold text-rag-amber bg-rag-amber-bg px-2 py-0.5 rounded-full">Moderate Grow</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Activation Rate</p>
          <h3 className="text-3xl font-extrabold font-display mt-1">74%</h3>
          <div className="w-full h-1.5 bg-surface-container rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-rag-amber" style={{ width: '74%' }} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Graph */}
        <div className="card-base p-8 space-y-8 h-full flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={20} className="text-primary" /> Team Visit Velocity</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" /> ACTUAL
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-2.5 h-2.5 rounded-full bg-surface-container" /> TARGET
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-3 px-2 min-h-[250px]">
             {weeklyTrends.map((trend, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                   <div className="w-full flex flex-col gap-0.5 justify-end h-full">
                      <motion.div 
                        initial={{ height: 0 }} animate={{ height: `${(trend.visits / 70) * 100}%` }}
                        className="w-full bg-primary rounded-t-lg relative group"
                      >
                         <div className="absolute -top-10 left-1/2 -track-x-1/2 bg-black text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {trend.visits} Visits
                         </div>
                      </motion.div>
                      <div className="w-full h-1 bg-surface-container rounded-sm" />
                   </div>
                   <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{trend.day}</span>
                </div>
             ))}
          </div>
        </div>

        {/* ASE Segmentation */}
        <div className="card-base p-8 space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold flex items-center gap-2"><PieChart size={20} className="text-primary" /> Performance Segmentation</h2>
          </div>
          <div className="p-10 flex items-center justify-center relative">
             <div className="w-48 h-48 rounded-full border-[24px] border-rag-green border-r-rag-amber border-b-rag-red shadow-2xl rotate-45 transform" />
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-3xl font-black text-primary">8 ASEs</div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Active Today</div>
             </div>
          </div>
          <div className="space-y-3 pt-4">
             {[
                { label: 'Exceeding Target', val: '3 ASEs', color: 'bg-rag-green' },
                { label: 'On Target', val: '4 ASEs', color: 'bg-rag-amber' },
                { label: 'Correction Required', val: '1 ASE', color: 'bg-rag-red animate-pulse' },
             ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-2xl border border-black/5">
                   <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
                      <span className="text-xs font-bold">{item.label}</span>
                   </div>
                   <span className="text-xs font-black">{item.val}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamReports;
