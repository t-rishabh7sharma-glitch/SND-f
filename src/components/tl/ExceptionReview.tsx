import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, XCircle, Send, ArrowUpRight, MessageSquare, ShieldAlert } from 'lucide-react';
import { Exception } from '../../types';

interface ExceptionReviewProps {
  exceptions: Exception[];
  onAction: (exceptionId: string, action: 'Approve' | 'Reject' | 'Request Reason' | 'Escalate') => void;
}

const ExceptionReview: React.FC<ExceptionReviewProps> = ({ exceptions, onAction }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1 text-primary font-display font-extrabold">Exception Triage Center</h1>
          <p className="text-on-surface-variant text-sm">Review and resolve system-generated field exceptions</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost text-xs py-1.5 px-4 border-black/10">Export Log</button>
          <button className="btn btn-primary text-xs py-1.5 px-4 shadow-lg">Batch Approve</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {exceptions.map((ex, i) => (
          <motion.div 
            key={ex.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card-base p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center border-l-4 ${
              ex.severity === 'High' ? 'border-l-rag-red' : 
              ex.severity === 'Medium' ? 'border-l-rag-amber' : 'border-l-primary'
            }`}
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  ex.severity === 'High' ? 'bg-rag-red-bg text-rag-red' : 
                  ex.severity === 'Medium' ? 'bg-rag-amber-bg text-rag-amber' : 'bg-primary/10 text-primary'
                }`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{ex.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      ex.severity === 'High' ? 'bg-rag-red text-white' : 
                      ex.severity === 'Medium' ? 'bg-rag-amber text-white' : 'bg-primary text-white'
                    }`}>
                      {ex.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                    {ex.aseName} ({ex.aseId}) • {ex.timestamp}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-3 rounded-xl border border-black/5">
                  <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Details</div>
                  <p className="text-xs font-semibold leading-relaxed">{ex.details}</p>
                </div>
                {ex.outletName && (
                  <div className="bg-surface-container-low p-3 rounded-xl border border-black/5">
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Outlet Context</div>
                    <p className="text-xs font-semibold leading-relaxed">{ex.outletName}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button 
                onClick={() => onAction(ex.id, 'Request Reason')}
                className="btn btn-ghost text-[10px] py-2 px-4 border-black/5 flex items-center gap-2"
              >
                <MessageSquare size={14} /> Request Reason
              </button>
              <button 
                onClick={() => onAction(ex.id, 'Reject')}
                className="btn btn-ghost text-[10px] py-2 px-4 border-rag-red/20 text-rag-red hover:bg-rag-red-bg flex items-center gap-2"
              >
                <XCircle size={14} /> Reject
              </button>
              <button 
                onClick={() => onAction(ex.id, 'Approve')}
                className="btn btn-ghost text-[10px] py-2 px-4 border-rag-green/20 text-rag-green hover:bg-rag-green-bg flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> Approve
              </button>
              <button 
                onClick={() => onAction(ex.id, 'Escalate')}
                className="btn btn-primary text-[10px] py-2 px-4 shadow-lg flex items-center gap-2"
              >
                <ArrowUpRight size={14} /> Escalate to ZBM
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExceptionReview;
