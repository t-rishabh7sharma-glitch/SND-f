import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock,
  ChevronRight, 
  X,
  Activity,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

interface ReportingEngineProps {
  onAction: (message: string) => void;
}

const automatedReports = [
  { id: 'terr-summary', title: 'Territory KPI Summary', type: 'PDF', icon: <FileText size={16} />, color: 'text-primary', desc: 'Aggregated territory performance and monthly target tracking.' },
  { id: 'team-breakdown', title: 'Team Performance Matrix', type: 'XLSX', icon: <BarChart3 size={16} />, color: 'text-rag-green', desc: 'Granular breakdown of KPIs by Team Lead and ASE.' },
  { id: 'stockout-risk', title: 'Float & MoMo Stockout Alerts', type: 'PDF', icon: <Activity size={16} />, color: 'text-rag-amber', desc: 'Critical list of agents running low on electronic value.' },
  { id: 'compliance-log', title: 'Field Exception Log', type: 'XLSX', icon: <ShieldAlert size={16} />, color: 'text-rag-red', desc: 'Raw data log of all missed visits, geo-fence breaches, and exceptions.' },
];

const ReportingEngine: React.FC<ReportingEngineProps> = ({ onAction }) => {
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-primary font-display tracking-tight">Reporting Engine</h1>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pre-generated Territory Insights & Sign-off</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSignOffModalOpen(true)}
            className="btn bg-rag-green text-white px-6 py-2.5 shadow-lg flex items-center gap-2 hover:bg-green-800 rounded-xl"
          >
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Daily Sign-Off</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pre-generated Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-primary">
              <Zap size={14} />
              One-Click Territory Reports
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

        {/* Right Column: Recent Reports & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-primary">
              <Download size={14} /> Export Actions
            </h2>
            <div className="space-y-2">
              <button onClick={() => onAction('Generating Summary...')} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-black/5 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                    <TrendingUp size={14} />
                  </div>
                  <span className="text-[10px] font-black">Performance Summary</span>
                </div>
                <ChevronRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onAction('Generating Coverage Map...')} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-black/5 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-rag-green-bg text-rag-green rounded-lg">
                    <MapPin size={14} />
                  </div>
                  <span className="text-[10px] font-black">Territory Coverage Map</span>
                </div>
                <ChevronRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-primary">
              <Clock size={14} /> Recent Exports
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Weekly_Summary_Mar_W4.pdf', date: 'Mar 28, 2026', size: '2.4 MB' },
                { name: 'Liquidity_Audit_FreedomAve.csv', date: 'Mar 29, 2026', size: '450 KB' },
                { name: 'Team_Performance_Mar_2026.pdf', date: 'Mar 30, 2026', size: '5.1 MB' },
              ].map((report, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-black/5">
                  <FileText size={14} className="text-on-surface-variant" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black truncate">{report.name}</div>
                    <div className="text-[8px] text-on-surface-variant font-bold">{report.date} • {report.size}</div>
                  </div>
                  <button className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sign-Off Confirmation Modal */}
      <AnimatePresence>
        {isSignOffModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-rag-green text-white flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black font-display leading-tight">Daily Sign-Off Confirmation</h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">Submit to Zonal Manager</p>
                </div>
                <button onClick={() => setIsSignOffModalOpen(false)} className="p-2 hover:bg-black/10 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-rag-green/5 rounded-xl border border-rag-green/20">
                  <div className="w-10 h-10 rounded-full bg-rag-green text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-rag-green">Ready for Submission</div>
                    <div className="text-[9px] font-bold text-rag-green/80">All territory data and action plans are synced.</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Summary of Actions</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-surface-container-low rounded-xl border border-black/5">
                      <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Interventions</div>
                      <div className="text-base font-black font-display">4 Active</div>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl border border-black/5">
                      <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Reports</div>
                      <div className="text-base font-black font-display">6 Generated</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-2">
                  <Send size={14} className="text-primary mt-0.5" />
                  <p className="text-[9px] font-bold leading-relaxed text-on-surface-variant">Reports and action plans will be sent directly to Zonal Business Manager (ZBM) for operational review.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setIsSignOffModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  <button onClick={() => { onAction('Sign-off submitted to ZBM successfully.'); setIsSignOffModalOpen(false); }} className="flex-1 py-2.5 rounded-xl bg-rag-green text-white shadow-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-colors">Submit Sign-Off</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportingEngine;
