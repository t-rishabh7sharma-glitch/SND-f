import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Wifi, WifiOff, Battery, AlertTriangle, ShieldOff, RefreshCw, Trash2, Search } from 'lucide-react';
import { SYSTEM_DEVICES, SYSTEM_USERS, SystemDevice } from '../../data/kpiStore';

interface DeviceManagementProps {
  onAction: (msg: string) => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ onAction }) => {
  const [devices, setDevices] = useState<SystemDevice[]>(SYSTEM_DEVICES);
  const [search, setSearch] = useState('');

  const filtered = devices.filter(d =>
    d.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
    d.imei.includes(search) ||
    d.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleWipe = (imei: string) => {
    setDevices(prev => prev.map(d => d.imei === imei ? { ...d, status: 'Wiped', connectivity: 'Offline' } : d));
    onAction(`Remote wipe initiated for device ${imei}.`);
  };

  const handleDeactivate = (imei: string) => {
    setDevices(prev => prev.map(d => d.imei === imei ? { ...d, status: 'Inactive', connectivity: 'Offline' } : d));
    onAction(`Device ${imei} has been deactivated.`);
  };

  const batteryColor = (level: number) => level > 50 ? 'text-rag-green' : level > 20 ? 'text-rag-amber' : 'text-rag-red';

  const stats = [
    { label: 'Total Enrolled', value: devices.length, color: 'text-primary' },
    { label: 'Online Now', value: devices.filter(d => d.connectivity === 'Online').length, color: 'text-rag-green' },
    { label: 'Low Battery (<20%)', value: devices.filter(d => d.batteryLevel < 20 && d.status === 'Active').length, color: 'text-rag-amber' },
    { label: 'Inactive / Wiped', value: devices.filter(d => d.status !== 'Active').length, color: 'text-rag-red' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary">Device Management</h1>
        <p className="text-on-surface-variant text-sm font-medium">Enrolled field devices — health, connectivity, and control</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-base p-6">
            <div className={`text-3xl font-extrabold font-display ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by user, IMEI, or device model..."
          className="w-full bg-surface-container-lowest border border-black/5 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((d, i) => (
          <motion.div key={d.imei} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`card-base p-6 space-y-4 border-l-4 ${d.status === 'Active' ? 'border-rag-green' : d.status === 'Wiped' ? 'border-rag-red' : 'border-black/10'}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.connectivity === 'Online' ? 'bg-rag-green-bg text-rag-green' : 'bg-surface-container text-on-surface-variant'}`}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm">{d.model}</div>
                  <div className="text-[10px] font-semibold text-on-surface-variant">{d.assignedTo} • {d.userId}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {d.connectivity === 'Online' ? <Wifi size={14} className="text-rag-green" /> : <WifiOff size={14} className="text-on-surface-variant/40" />}
                <span className={`text-[10px] font-bold ${d.connectivity === 'Online' ? 'text-rag-green' : 'text-on-surface-variant/50'}`}>{d.connectivity}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-surface-container-low rounded-xl p-3">
                <div className={`text-lg font-extrabold font-display ${batteryColor(d.batteryLevel)}`}>{d.batteryLevel}%</div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Battery</div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3">
                <div className="text-lg font-extrabold font-display text-on-surface">{d.appVersion}</div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">App Ver.</div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3">
                <div className={`text-xs font-extrabold ${d.status === 'Active' ? 'text-rag-green' : d.status === 'Wiped' ? 'text-rag-red' : 'text-rag-amber'}`}>{d.status}</div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Status</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-black/5">
              <div className="text-[10px] font-semibold text-on-surface-variant">IMEI: {d.imei}</div>
              <div className="text-[10px] font-semibold text-on-surface-variant">Last Active: {d.lastActive}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => onAction(`Refreshing device data for ${d.imei}...`)}
                  className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={13} />
                </button>
                {d.status === 'Active' && (
                  <button
                    onClick={() => handleDeactivate(d.imei)}
                    className="p-1.5 hover:bg-rag-amber-bg text-rag-amber rounded-lg transition-colors"
                    title="Deactivate"
                  >
                    <ShieldOff size={13} />
                  </button>
                )}
                <button
                  onClick={() => handleWipe(d.imei)}
                  className="p-1.5 hover:bg-rag-red-bg text-rag-red rounded-lg transition-colors"
                  title="Remote Wipe"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DeviceManagement;
