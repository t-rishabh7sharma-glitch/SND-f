import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, UserPlus, MoreVertical, CheckCircle2, XCircle,
  Clock, Edit2, RefreshCw, MapPin, Shield, Smartphone, X
} from 'lucide-react';
import { SYSTEM_USERS, SystemUser } from '../../data/kpiStore';

interface UserManagementProps {
  onAction: (msg: string) => void;
}

const ROLE_COLORS: Record<string, string> = {
  ASE: 'bg-primary/10 text-primary',
  TL: 'bg-rag-green-bg text-rag-green',
  TDR: 'bg-rag-amber-bg text-rag-amber',
  ZBM: 'bg-purple-100 text-purple-700',
  REBALANCER: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-on-surface/10 text-on-surface',
};

const TERRITORIES = [
  'Lusaka East', 'Lusaka West', 'Lusaka Central', 'Lusaka CBD',
  'Ndola Central', 'Kitwe North', 'Kabwe Central', 'Livingstone South',
  'Chipata East', 'Kasama North', 'Mansa Central', 'Zambia South',
];

const UserManagement: React.FC<UserManagementProps> = ({ onAction }) => {
  const [users, setUsers] = useState<SystemUser[]>(SYSTEM_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'ASE', territory: 'Lusaka East', region: 'Lusaka' });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleStatusToggle = (id: string, action: 'activate' | 'suspend') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: action === 'activate' ? 'Active' : 'Suspended' } : u));
    onAction(`User ${id} has been ${action === 'activate' ? 'activated' : 'suspended'}.`);
  };

  const handleAddUser = () => {
    const rolePrefix = newUser.role === 'ASE' ? 'ASE' : newUser.role === 'TL' ? 'TL' : newUser.role === 'TDR' ? 'TDR' : newUser.role === 'ZBM' ? 'ZBM' : 'REB';
    const newId = `${rolePrefix}-${Math.floor(10000 + Math.random() * 90000)}`;
    const user: SystemUser = {
      id: newId, name: newUser.name, email: newUser.email,
      role: newUser.role as SystemUser['role'], region: newUser.region,
      territory: newUser.territory, geoFenceAssigned: false,
      status: 'Pending', lastLogin: 'Never', addedBy: 'ADMIN-00001',
      addedDate: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [user, ...prev]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'ASE', territory: 'Lusaka East', region: 'Lusaka' });
    onAction(`New user ${newId} created. Pending activation.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary">User Management</h1>
          <p className="text-on-surface-variant text-sm font-medium">Provision, manage, and assign roles to all system users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full bg-surface-container-lowest border border-black/5 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        {(['All', 'ASE', 'TL', 'TDR', 'ZBM', 'REBALANCER'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            {r}
          </button>
        ))}
        {(['All', 'Active', 'Pending', 'Suspended'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-on-surface text-surface' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-base p-0 overflow-hidden">
        <div className="p-4 border-b border-black/5 flex justify-between items-center">
          <span className="text-xs font-bold text-on-surface-variant">{filtered.length} users found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-black/5">
                {['User', 'Role', 'Territory', 'Geo-fence', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-black/5 hover:bg-surface-container-low transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{u.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-semibold">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
                      <MapPin size={12} /> {u.territory}
                    </div>
                    <div className="text-[9px] text-on-surface-variant/60 font-semibold">{u.region}</div>
                  </td>
                  <td className="p-4">
                    {u.geoFenceAssigned
                      ? <span className="flex items-center gap-1 text-[10px] font-bold text-rag-green"><CheckCircle2 size={12} /> Assigned</span>
                      : <span className="flex items-center gap-1 text-[10px] font-bold text-rag-red"><XCircle size={12} /> Not Set</span>
                    }
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.status === 'Active' ? 'bg-rag-green-bg text-rag-green' : u.status === 'Pending' ? 'bg-rag-amber-bg text-rag-amber' : 'bg-rag-red-bg text-rag-red'}`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant">
                      <Clock size={11} /> {u.lastLogin}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {u.status !== 'Active' && (
                        <button
                          onClick={() => handleStatusToggle(u.id, 'activate')}
                          className="p-1.5 hover:bg-rag-green-bg text-rag-green rounded-lg transition-colors"
                          title="Activate"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      {u.status === 'Active' && (
                        <button
                          onClick={() => handleStatusToggle(u.id, 'suspend')}
                          className="p-1.5 hover:bg-rag-red-bg text-rag-red rounded-lg transition-colors"
                          title="Suspend"
                        >
                          <XCircle size={15} />
                        </button>
                      )}
                      <button onClick={() => onAction(`Editing user ${u.id}...`)} className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => onAction(`Password reset sent to ${u.email}`)} className="p-1.5 hover:bg-surface-container text-on-surface-variant rounded-lg transition-colors" title="Reset Password">
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Add New User</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-container rounded-xl"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Mwape Banda' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'e.g. name@zamtel.zm' },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{f.label}</label>
                    <input
                      type={f.type}
                      value={(newUser as any)[f.key]}
                      onChange={e => setNewUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                  >
                    {['ASE', 'TL', 'TDR', 'ZBM', 'REBALANCER'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Territory (Geo-fence Zone)</label>
                  <select
                    value={newUser.territory}
                    onChange={e => setNewUser(p => ({ ...p, territory: e.target.value }))}
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                  >
                    {TERRITORIES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-2xl bg-surface-container text-on-surface-variant text-sm font-bold hover:bg-surface-container-low transition-all">Cancel</button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                  className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  Create User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
