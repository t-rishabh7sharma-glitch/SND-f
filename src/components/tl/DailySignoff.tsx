import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, AlertTriangle, Send, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface DailySignoffProps {
  onSignOff: () => void;
  pendingExceptions: number;
}

const DailySignoff: React.FC<DailySignoffProps> = ({ onSignOff, pendingExceptions }) => {
  const [checklist, setChecklist] = useState({
    exceptionsResolved: false,
    escalateToZbm: false,
    dataValidated: false
  });

  const isReady = checklist.exceptionsResolved && checklist.dataValidated;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
          <Clock size={40} />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-primary">Daily Sign-off</h1>
        <p className="text-on-surface-variant text-sm">Final validation and accountability check before closing the workday.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-base p-8 space-y-8">
          <h2 className="text-lg font-bold">EOD Submissions List</h2>
          <div className="space-y-4">
            {[
              { name: 'Mwape Banda', status: 'Submitted', color: 'text-rag-green' },
              { name: 'Chisomo Kunda', status: 'Submitted', color: 'text-rag-green' },
              { name: 'Priya Nambwe', status: 'Pending Sync', color: 'text-rag-amber' },
              { name: 'Tiza Mwale', status: 'Exceptions Open', color: 'text-rag-red' },
              { name: 'Brian Nkosi', status: 'Submitted', color: 'text-rag-green' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-surface-container-low border border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={16} className={item.color} />
                  </div>
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {pendingExceptions > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-rag-red-bg border border-rag-red/20 flex items-start gap-4"
            >
              <ShieldAlert size={24} className="text-rag-red shrink-0" />
              <div>
                <div className="text-sm font-bold text-rag-red">Outstanding Items Warning</div>
                <p className="text-xs font-semibold text-rag-red/80 mt-1 leading-relaxed">
                  {pendingExceptions} exceptions require approval. Resolve all pending issues before signing off.
                </p>
              </div>
            </motion.div>
          )}

          <div className="card-base p-8 space-y-6">
            <h2 className="text-lg font-bold">Final Checklist</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-black/5 bg-surface-container-low cursor-pointer hover:border-primary/30 transition-all">
                <input 
                  type="checkbox" 
                  checked={checklist.exceptionsResolved}
                  onChange={(e) => setChecklist({ ...checklist, exceptionsResolved: e.target.checked })}
                  className="w-5 h-5 rounded border-black/10 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold">All exceptions resolved or triaged</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-black/5 bg-surface-container-low cursor-pointer hover:border-primary/30 transition-all">
                <input 
                  type="checkbox" 
                  checked={checklist.dataValidated}
                  onChange={(e) => setChecklist({ ...checklist, dataValidated: e.target.checked })}
                  className="w-5 h-5 rounded border-black/10 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold">Data accuracy validated across team</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-black/5 bg-surface-container-low cursor-pointer hover:border-primary/30 transition-all">
                <input 
                  type="checkbox" 
                  checked={checklist.escalateToZbm}
                  onChange={(e) => setChecklist({ ...checklist, escalateToZbm: e.target.checked })}
                  className="w-5 h-5 rounded border-black/10 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold flex items-center gap-2">
                  Escalate critical issues to ZBM <ArrowUpRight size={14} />
                </span>
              </label>
            </div>
          </div>

          <button 
            disabled={!isReady}
            onClick={onSignOff}
            className="btn btn-primary w-full py-6 shadow-2xl flex items-center justify-center gap-3 text-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:grayscale transition-all"
          >
            <Send size={24} />
            Submit Daily Sign-off
          </button>
          
          <div className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            This will finalize the day's records and notify the ZBM.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySignoff;
