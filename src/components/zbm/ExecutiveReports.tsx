import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Activity,
  ShieldAlert,
  Zap,
  ChevronRight
} from 'lucide-react';

interface ExecutiveReportsProps {
  onAction: (message: string) => void;
}

const automatedReports = [
  { id: 'exec-summary', title: 'Zonal Executive Summary', type: 'PDF', icon: <FileText size={16} />, color: 'text-primary', desc: 'High-level aggregation of all KPIs and target achievements across the zone.' },
  { id: 'terr-breakdown', title: 'Territorial KPI Breakdown', type: 'XLSX', icon: <BarChart3 size={16} />, color: 'text-rag-green', desc: 'Granular territory-by-territory metric comparison and ranking.' },
  { id: 'liquidity', title: 'Agent Liquidity & Stockout', type: 'PDF', icon: <Activity size={16} />, color: 'text-rag-amber', desc: 'Actionable list of dormant and low-float agents requiring immediate rebalancing.' },
  { id: 'momo', title: 'MoMo GA & Channel Mix', type: 'PDF', icon: <TrendingUp size={16} />, color: 'text-blue-600', desc: 'Mobile money acquisition split by agent, retail, and direct sales channels.' },
  { id: 'compliance', title: 'Compliance & Exception Log', type: 'XLSX', icon: <ShieldAlert size={16} />, color: 'text-rag-red', desc: 'Raw data logs of all field exceptions, missed visits, and geofence breaches.' },
];

const automatedInsights = [
  { title: 'Gross Additions Pace', desc: 'Zone is tracking 12% ahead of national average. Lusaka East is driving 40% of standard SIM GA.', color: 'text-rag-green', border: 'border-rag-green/20', bg: 'bg-rag-green/5', icon: <TrendingUp size={14} /> },
  { title: 'Liquidity Risk Warning', desc: '14 agents in Lusaka West are critically low on float (< 200 ZMW). Immediate deployment of rebalancers is required to prevent revenue loss.', color: 'text-rag-amber', border: 'border-rag-amber/20', bg: 'bg-rag-amber/5', icon: <AlertTriangle size={14} /> },
  { title: 'Field Execution Improvement', desc: 'Non-visiting ASE count has dropped by 5% since last week, indicating stronger Team Lead oversight during morning dispatch.', color: 'text-primary', border: 'border-primary/20', bg: 'bg-primary/5', icon: <Activity size={14} /> }
];

const ExecutiveReports: React.FC<ExecutiveReportsProps> = ({ onAction }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-primary font-display tracking-tight">Executive Intelligence</h1>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pre-generated Automated Insights & One-Click Reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Automated 1-Click Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-primary">
              <Zap size={14} />
              One-Click Executive Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {automatedReports.map((report, i) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onAction(`Downloading ${report.title}...`)}
                  className="p-3 bg-surface-container-low rounded-xl border border-black/5 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-white shadow-sm ${report.color}`}>
                        {report.icon}
                      </div>
                      <span className="text-xs font-black group-hover:text-primary transition-colors">{report.title}</span>
                    </div>
                    <span className="text-[8px] font-black bg-surface-container px-2 py-0.5 rounded text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">
                      {report.type}
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-on-surface-variant/70 leading-snug">
                    {report.desc}
                  </p>
                  <div className="mt-3 flex items-center justify-end gap-1 text-[8px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    DOWNLOAD <Download size={10} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-primary">
              <BarChart3 size={14} />
              Automated Zonal Insights
            </h2>
            <div className="space-y-3">
              {automatedInsights.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-xl border ${insight.bg} ${insight.border}`}
                >
                  <div className={`flex items-center gap-2 mb-1.5 ${insight.color}`}>
                    {insight.icon}
                    <h3 className="text-[9px] font-black uppercase tracking-widest">{insight.title}</h3>
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant leading-relaxed">
                    {insight.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container rounded-xl border border-black/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Next Executive Sync</h4>
            <div className="text-xl font-black font-display text-primary">Tomorrow, 09:00 AM</div>
            <p className="text-[9px] font-bold text-on-surface-variant mt-1">Reviewing week 2 progress with CSDO.</p>
            <button className="mt-4 w-full py-2 bg-white text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-black/5 shadow-sm hover:border-primary/30 transition-all flex items-center justify-center gap-1">
              Prepare Deck <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveReports;
