import React from 'react';
import { motion } from 'motion/react';
import { Server, RefreshCw, Activity, Wifi } from 'lucide-react';

interface SystemHealthProps {
  onAction: (msg: string) => void;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ onAction }) => {
  const services = [
    { name: 'GPS / Geo-fence Engine', status: 'Operational', uptime: 99.9, responseMs: 42,  color: 'rag-green' },
    { name: 'Authentication Service',  status: 'Operational', uptime: 100,  responseMs: 18,  color: 'rag-green' },
    { name: 'Data Sync Engine',        status: 'Operational', uptime: 99.4, responseMs: 87,  color: 'rag-green' },
    { name: 'Report Generator',        status: 'Degraded',    uptime: 94.2, responseMs: 340, color: 'rag-amber' },
    { name: 'Push Notifications',      status: 'Operational', uptime: 99.7, responseMs: 65,  color: 'rag-green' },
    { name: 'RBAC / Permission API',   status: 'Operational', uptime: 100,  responseMs: 22,  color: 'rag-green' },
  ];

  const events = [
    { time: '11:30 AM', type: 'Info',     msg: 'Data sync completed — 248 records updated' },
    { time: '10:42 AM', type: 'Warning',  msg: 'Report generator latency spike (340ms avg)' },
    { time: '09:15 AM', type: 'Info',     msg: 'GPS engine restarted — agents re-connected' },
    { time: '08:00 AM', type: 'Info',     msg: 'Scheduled maintenance completed successfully' },
    { time: 'Yesterday',type: 'Critical', msg: 'Auth timeout — 4 users logged out forcibly' },
  ];

  const macroStats = [
    { label: 'System Uptime',   value: '99.8%', color: 'text-rag-green', sub: 'Last 30 days' },
    { label: 'Active Sessions', value: '31',    color: 'text-primary',   sub: 'Right now' },
    { label: 'Avg API Latency', value: '96ms',  color: 'text-rag-amber', sub: 'Today' },
    { label: 'Error Rate',      value: '0.12%', color: 'text-rag-green', sub: 'Last 24h' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary">System Health</h1>
          <p className="text-on-surface-variant text-sm font-medium">Live monitoring of all platform services</p>
        </div>
        <button onClick={() => onAction('Refreshing metrics...')} className="flex items-center gap-2 px-4 py-2.5 bg-surface-container rounded-xl text-xs font-bold border border-black/5 hover:bg-surface-container-low transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {macroStats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-base p-6">
            <div className={`text-3xl font-extrabold font-display ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{s.label}</div>
            <div className="text-[9px] text-on-surface-variant/60 font-semibold">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-base p-8 space-y-4">
          <h2 className="text-lg font-bold">Service Status</h2>
          {services.map((svc, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-black/5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${svc.color === 'rag-green' ? 'bg-rag-green-bg text-rag-green' : 'bg-rag-amber-bg text-rag-amber'}`}>
                  <Server size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{svc.name}</div>
                  <div className="text-[9px] font-bold text-on-surface-variant uppercase">{svc.uptime}% uptime</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-on-surface-variant">{svc.responseMs}ms</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${svc.color === 'rag-green' ? 'bg-rag-green-bg text-rag-green' : 'bg-rag-amber-bg text-rag-amber'}`}>
                  {svc.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card-base p-8 space-y-6">
          <h2 className="text-lg font-bold">System Events</h2>
          <div className="space-y-4">
            {events.map((ev, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${ev.type === 'Critical' ? 'bg-rag-red' : ev.type === 'Warning' ? 'bg-rag-amber' : 'bg-rag-green'}`} />
                <div>
                  <div className="text-[10px] font-bold text-on-surface-variant">{ev.time}</div>
                  <div className="text-xs font-semibold mt-0.5">{ev.msg}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-black/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">30-Day Uptime</span>
              <span className="text-xs font-extrabold text-rag-green">99.8%</span>
            </div>
            <div className="flex gap-0.5 h-6">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.02 }}
                  className={`flex-1 rounded-sm ${[6, 22].includes(i) ? 'bg-rag-amber' : i === 15 ? 'bg-rag-red' : 'bg-rag-green'}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-semibold text-on-surface-variant">
              <span>30d ago</span><span>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
