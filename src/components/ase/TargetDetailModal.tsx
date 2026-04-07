import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, XCircle, CheckCircle2, Clock, Users, MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { Outlet } from '../../types';

interface TargetDetailModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  outlets: Outlet[];
  onCheckIn: (outlet: Outlet) => void;
}

const TargetDetailModal: React.FC<TargetDetailModalProps> = ({ type, isOpen, onClose, outlets, onCheckIn }) => {
  if (!isOpen) return null;

  let title = '';
  let content = null;
  let icon = <Target size={24} />;

  if (type === 'Visits') {
    title = 'Planned Visits Today';
    icon = <MapPin size={24} />;
    
    const planned = outlets.filter(o => o.status === 'Planned' || o.status === 'Next');
    const visited = outlets.filter(o => o.status === 'Visited');
    const missed = outlets.filter(o => o.status === 'Missed');

    content = (
      <div className="space-y-6">
        {visited.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-rag-green uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} /> Visited ({visited.length})</h4>
            {visited.map((o, i) => (
              <div key={i} className="p-3 bg-rag-green-bg/30 border border-rag-green/20 rounded-xl flex justify-between items-center opacity-70">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-on-surface-variant font-mono">{o.distance}</div>
              </div>
            ))}
          </div>
        )}

        {missed.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-rag-red uppercase tracking-widest flex items-center gap-2"><XCircle size={14} /> Missed ({missed.length})</h4>
            {missed.map((o, i) => (
              <div key={i} className="p-3 bg-rag-red-bg/30 border border-rag-red/20 rounded-xl flex justify-between items-center opacity-70">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-on-surface-variant font-mono">{o.distance}</div>
              </div>
            ))}
          </div>
        )}

        {planned.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-rag-amber uppercase tracking-widest flex items-center gap-2"><Clock size={14} /> Remaining ({planned.length})</h4>
            {planned.map((o, i) => (
              <div key={i} onClick={() => { onClose(); onCheckIn(o); }} className="p-3 bg-surface-container-low border border-black/5 rounded-xl flex justify-between items-center cursor-pointer hover:border-primary/30 transition-all group">
                <div>
                  <div className="font-bold text-xs group-hover:text-primary transition-colors">{o.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{o.category}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[10px] text-on-surface-variant font-mono">{o.distance}</div>
                  <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}

        {planned.length === 0 && visited.length === 0 && missed.length === 0 && (
          <div className="p-6 text-center text-on-surface-variant text-sm border-2 border-dashed border-black/5 rounded-2xl">
            No visits planned for today.
          </div>
        )}
      </div>
    );
  } else if (type === 'SIM Registrations') {
    title = 'SIM Registrations Ledger';
    icon = <TrendingUp size={24} />;
    content = (
      <div className="space-y-4">
        {[
          { id: 'SIM-9021', time: '10:45 AM', type: 'Prepaid', status: 'Active' },
          { id: 'SIM-9022', time: '11:15 AM', type: 'MoMo Linked', status: 'Active' },
          { id: 'SIM-9023', time: '12:30 PM', type: 'Data Only', status: 'Pending' },
          { id: 'SIM-9024', time: '02:00 PM', type: 'Prepaid', status: 'Active' },
        ].map((sim, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-black/5 bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp size={14} />
              </div>
              <div>
                <div className="font-bold text-xs">{sim.id}</div>
                <div className="text-[9px] text-on-surface-variant uppercase tracking-widest">{sim.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold">{sim.time}</div>
              <div className={`text-[9px] font-bold ${sim.status === 'Active' ? 'text-rag-green' : 'text-rag-amber'}`}>{sim.status}</div>
            </div>
          </div>
        ))}
        <div className="p-4 bg-primary/5 text-primary text-xs font-bold text-center rounded-xl border border-primary/20">
          Viewing recent 4 registrations. Check Reports for full ledger.
        </div>
      </div>
    );
  } else {
    // Agents Recruited, Activations, etc
    title = `${type} Details`;
    if (type === 'Agents Recruited') icon = <Users size={24} />;
    if (type === 'Activations') icon = <CheckCircle2 size={24} />;
    
    content = (
      <div className="p-8 text-center text-on-surface-variant text-sm border border-black/5 rounded-2xl bg-surface-container-lowest">
        <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-4">
          <Clock size={24} className="text-on-surface-variant/40" />
        </div>
        Detailed drill-down for {type} is currently being synced from the master ledger.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-8 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 bg-surface-container-lowest border-b border-black/5 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {icon}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Target Drill-down</div>
              <h2 className="text-lg font-bold leading-tight">{title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

export default TargetDetailModal;
