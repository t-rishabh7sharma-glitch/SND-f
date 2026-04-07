import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, RefreshCw, LogOut, Send, AlertTriangle } from 'lucide-react';

interface EodModuleProps {
  onSync: () => void;
  isOffline: boolean;
}

const EodModule: React.FC<EodModuleProps> = ({ onSync, isOffline }) => {
  const summary = [
    { label: 'Total Visited', val: 12, icon: <CheckCircle2 size={16} />, color: 'text-rag-green' },
    { label: 'Missed Visits', val: 2, icon: <AlertTriangle size={16} />, color: 'text-rag-red' },
    { label: 'Photos Captured', val: 12, icon: <CheckCircle2 size={16} />, color: 'text-rag-green' },
    { label: 'SIMs Registered', val: 21, icon: <CheckCircle2 size={16} />, color: 'text-rag-green' },
    { label: 'Agents Recruited', val: 4, icon: <CheckCircle2 size={16} />, color: 'text-rag-green' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
          <Clock size={40} />
        </div>
        <h1 className="text-3xl font-extrabold font-display">End of Day Sync</h1>
        <p className="text-on-surface-variant text-sm">Review your daily activity and sync data with the server.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-base p-8 space-y-8">
          <h2 className="text-lg font-bold">Today's Summary</h2>
          <div className="space-y-4">
            {summary.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-surface-container-low border border-black/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                <span className="text-lg font-extrabold">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-base p-8 space-y-6">
            <h2 className="text-lg font-bold">Sync Checklist</h2>
            <div className="space-y-4">
              {[
                { label: 'Missed Reasons', status: 'Done', color: 'text-rag-green' },
                { label: 'Compliance Data', status: 'Done', color: 'text-rag-green' },
                { label: 'Connectivity', status: isOffline ? 'Offline' : 'Online', color: isOffline ? 'text-rag-amber' : 'text-rag-green' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</span>
                  <span className={`text-xs font-extrabold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-black/5">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <span>Auto Check-out In</span>
                <span className="text-rag-red">00:42:15</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onSync}
            className="btn btn-primary w-full py-6 shadow-2xl flex items-center justify-center gap-3 text-lg bg-primary hover:bg-primary-dark"
          >
            <RefreshCw size={24} className={isOffline ? '' : 'animate-spin-slow'} />
            Submit & Sync Data
          </button>
          
          <div className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            This will log you out and send the daily report to your TL.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EodModule;
