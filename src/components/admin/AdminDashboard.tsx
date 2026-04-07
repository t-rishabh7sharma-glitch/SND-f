import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Shield, Smartphone, Activity, ClipboardList,
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Server,
  UserPlus, Wifi, WifiOff, BarChart3
} from 'lucide-react';
import { SYSTEM_USERS, SYSTEM_DEVICES, AUDIT_LOG } from '../../data/kpiStore';

interface AdminDashboardProps {
  onAction: (msg: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAction }) => {
  const roleCount = (role: string) => SYSTEM_USERS.filter(u => u.role === role).length;
  const activeUsers = SYSTEM_USERS.filter(u => u.status === 'Active').length;
  const pendingUsers = SYSTEM_USERS.filter(u => u.status === 'Pending').length;
  const suspendedUsers = SYSTEM_USERS.filter(u => u.status === 'Suspended').length;
  const statCards = [
    { label: 'Total Users',       value: SYSTEM_USERS.length.toString(),  sub: `${activeUsers} Active`,      icon: <Users size={22} />,        color: 'bg-primary/10 text-primary'       },
    { label: 'Pending Approval',  value: pendingUsers.toString(),          sub: 'Awaiting activation',        icon: <Clock size={22} />,        color: 'bg-rag-amber-bg text-rag-amber'   },
  ];

  const roleBreakdown = [
    { role: 'ASE',        count: roleCount('ASE'),        color: 'bg-primary',     pct: Math.round((roleCount('ASE') / SYSTEM_USERS.length) * 100) },
    { role: 'TL',         count: roleCount('TL'),         color: 'bg-rag-green',   pct: Math.round((roleCount('TL') / SYSTEM_USERS.length) * 100)  },
    { role: 'TDR',        count: roleCount('TDR'),        color: 'bg-rag-amber',   pct: Math.round((roleCount('TDR') / SYSTEM_USERS.length) * 100) },
    { role: 'ZBM',        count: roleCount('ZBM'),        color: 'bg-purple-500',  pct: Math.round((roleCount('ZBM') / SYSTEM_USERS.length) * 100) },
    { role: 'REBALANCER', count: roleCount('REBALANCER'), color: 'bg-blue-500',    pct: Math.round((roleCount('REBALANCER') / SYSTEM_USERS.length) * 100) },
  ];

  const systemServices = [
    { name: 'GPS / Geo-fence Service', status: 'Operational', uptime: '99.9%', color: 'text-rag-green' },
    { name: 'Authentication Service',  status: 'Operational', uptime: '100%',  color: 'text-rag-green' },
    { name: 'Data Sync Engine',        status: 'Operational', uptime: '99.4%', color: 'text-rag-green' },
    { name: 'Report Generator',        status: 'Degraded',    uptime: '94.2%', color: 'text-rag-amber' },
    { name: 'Push Notifications',      status: 'Operational', uptime: '99.7%', color: 'text-rag-green' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary">IT Admin Control Center</h1>
          <p className="text-on-surface-variant text-sm font-medium">System governance, RBAC, and device management</p>
        </div>
        <button
          onClick={() => onAction('Opening user provisioning wizard...')}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-base p-6 flex flex-col gap-2"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 ${s.color}`}>
              {s.icon}
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{s.label}</span>
            <div className="text-3xl font-extrabold font-display">{s.value}</div>
            <span className="text-[10px] text-on-surface-variant font-semibold">{s.sub}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Role Breakdown */}
        <div className="card-base p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Users by Role</h2>
            <Shield size={20} className="text-primary" />
          </div>
          <div className="space-y-4">
            {roleBreakdown.map((r, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-black/5 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${r.color}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{r.role}</span>
                </div>
                <span className="text-sm font-extrabold text-primary">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-black/5 flex justify-between text-xs font-bold">
            <span className="text-rag-red">{suspendedUsers} Suspended</span>
            <span className="text-rag-amber">{pendingUsers} Pending</span>
            <span className="text-rag-green">{activeUsers} Active</span>
          </div>
        </div>
        <div className="lg:col-span-2 card-base p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Audit Events</h2>
            <button onClick={() => onAction('Opening full audit log...')} className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-black/5 h-[320px] overflow-y-auto">
            {AUDIT_LOG.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 p-4 hover:bg-surface-container-low transition-colors">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${entry.severity === 'Critical' ? 'bg-rag-red' : entry.severity === 'Warning' ? 'bg-rag-amber' : 'bg-rag-green'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold">{entry.action}</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold shrink-0 ml-2">{entry.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant font-semibold">{entry.userName} ({entry.role}) → {entry.target}</div>
                  <div className="text-[10px] text-on-surface-variant/70 mt-0.5">{entry.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
