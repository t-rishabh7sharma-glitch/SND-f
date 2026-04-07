import React from 'react';
import { motion } from 'motion/react';
import { Navigation, AlertTriangle, MapPin, User, Info, Clock, Activity } from 'lucide-react';
import { AseStatus } from '../../types';

interface LiveMapProps {
  aseStatuses: AseStatus[];
}

const LiveMap: React.FC<LiveMapProps> = ({ aseStatuses }) => {
  return (
    <div className="space-y-8 h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary tracking-tight">Live Field Command</h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">Real-time GPS tracking of {aseStatuses.length} field agents in Lusaka East</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="bg-white px-5 py-2.5 rounded-[1.25rem] shadow-xl border border-black/5 flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-rag-green animate-ping absolute inset-0" />
              <div className="w-2.5 h-2.5 rounded-full bg-rag-green relative" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Sync Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[600px] pb-8">
        {/* Map Area */}
        <div className="lg:col-span-3 card-base p-0 overflow-hidden relative border-2 border-primary/10 shadow-2xl bg-slate-100 rounded-[2.5rem]">
          <div className="absolute inset-0">
            {/* Grid & Topo Mask (Mock) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
            
            {/* Mock ASE Markers */}
            {aseStatuses.map((ase, idx) => {
              const visitPct = Math.round((ase.visits / ase.target) * 100);
              return (
                <motion.div
                  key={ase.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.15, type: 'spring', damping: 12 }}
                  className="absolute cursor-pointer group z-20"
                  style={{ 
                    top: `${25 + (idx * 28) % 55}%`, 
                    left: `${20 + (idx * 22) % 65}%` 
                  }}
                >
                  <div className="relative">
                    {/* Signal Pulse */}
                    <div className={`absolute -inset-4 rounded-full opacity-20 animate-ping delay-75 ${ase.status === 'Active' ? 'bg-rag-green' : 'bg-rag-amber'}`}></div>
                    
                    {/* Main Marker */}
                    <div className={`relative w-14 h-14 rounded-[1.25rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center transition-all group-hover:scale-110 group-hover:-translate-y-1 ${
                      ase.status === 'Active' ? 'bg-rag-green' : 'bg-rag-amber'
                    }`}>
                      <div className="text-white font-black text-xs leading-none">{ase.name.split(' ').map(n => n[0]).join('')}</div>
                      <div className="text-[8px] text-white/80 font-bold mt-0.5 leading-none">{visitPct}%</div>
                    </div>

                    {/* Status Dot */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-xl border border-black/5">
                      <div className={`w-3 h-3 rounded-full ${ase.status === 'Active' ? 'bg-rag-green' : 'bg-rag-amber'}`}></div>
                    </div>
                  </div>
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white p-5 rounded-[2rem] shadow-2xl border border-black/5 min-w-[200px] space-y-4">
                      <div className="flex justify-between items-start border-b border-black/5 pb-3">
                        <div>
                          <div className="font-bold text-sm text-primary">{ase.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{ase.territory}</div>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest ${ase.status === 'Active' ? 'bg-rag-green-bg text-rag-green' : 'bg-rag-amber-bg text-rag-amber'}`}>
                          {ase.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-on-surface-variant uppercase tracking-widest">Exec. Rate</span>
                          <span className="text-primary">{visitPct}%</span>
                        </div>
                        <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${visitPct}%` }} />
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <div className="text-[9px] font-bold text-on-surface-variant flex items-center gap-1">
                            <Clock size={10} /> {ase.lastSeen}
                          </div>
                          <div className="text-[9px] font-bold text-primary flex items-center gap-1 underline underline-offset-2">
                             Full Route <Navigation size={8} />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="w-4 h-4 bg-white rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 border-r border-b border-black/5"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row justify-between items-end gap-4 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-[1.5rem] shadow-2xl border border-black/5 flex items-center gap-8 pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-rag-green shadow-sm shadow-rag-green/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-rag-amber shadow-sm shadow-rag-amber/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Idle / Gap</span>
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-black/5">
                <Info size={14} className="text-primary" />
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tight italic">Tap agent for detailed route analysis</span>
              </div>
            </div>
            
            <button className="bg-primary text-white p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all pointer-events-auto flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
              <Navigation size={18} /> Route Optimization
            </button>
          </div>
        </div>

        {/* Sidebar Status List */}
        <div className="card-base p-0 overflow-hidden flex flex-col border border-black/5 shadow-xl rounded-[2.5rem] bg-white">
          <div className="p-6 border-b border-black/5 bg-surface-container-lowest">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Activity size={16} /> Team Proximity
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {aseStatuses.map((ase) => {
              const visitPct = Math.round((ase.visits / ase.target) * 100);
              return (
                <motion.div 
                  key={ase.id} 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-[1.5rem] bg-surface-container-low border border-black/5 hover:border-primary/40 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-lg group-hover:rotate-6 transition-transform ${
                      ase.status === 'Active' ? 'bg-rag-green' : 'bg-rag-amber'
                    }`}>
                      {ase.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold truncate group-hover:text-primary transition-colors">{ase.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <div className={`w-2 h-2 rounded-full ${ase.status === 'Active' ? 'bg-rag-green' : 'bg-rag-amber'}`} />
                         <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{ase.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 bg-white/50 p-3 rounded-[1rem] border border-black/5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-on-surface-variant/60">Execution</span>
                      <span className={visitPct >= 80 ? 'text-rag-green' : 'text-rag-amber'}>{visitPct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${visitPct >= 80 ? 'bg-rag-green' : 'bg-rag-amber'}`}
                        style={{ width: `${visitPct}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
