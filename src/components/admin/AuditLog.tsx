import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Download, Filter } from 'lucide-react';
import { AUDIT_LOG, AuditEntry } from '../../data/kpiStore';

interface AuditLogProps {
  onAction: (msg: string) => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  Info: 'bg-primary/10 text-primary',
  Warning: 'bg-rag-amber-bg text-rag-amber',
  Critical: 'bg-rag-red-bg text-rag-red',
};

const AuditLog: React.FC<AuditLogProps> = ({ onAction }) => {
  const [entries] = useState<AuditEntry[]>(AUDIT_LOG);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sevFilter, setSevFilter] = useState('All');

  const filtered = entries.filter(e => {
    const matchSearch = e.userName.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.target.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || e.role === roleFilter;
    const matchSev  = sevFilter === 'All' || e.severity === sevFilter;
    return matchSearch && matchRole && matchSev;
  });

  const handleExport = () => {
    // Simulated blank download
    const blob = new Blob([''], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zamtel_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onAction('Audit log exported as CSV.');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary">Audit Log</h1>
          <p className="text-on-surface-variant text-sm font-medium">Chronological record of all role-sensitive actions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-3 bg-surface-container rounded-2xl text-xs font-bold border border-black/5 shadow hover:bg-surface-container-low transition-all"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(['Info', 'Warning', 'Critical'] as const).map(sev => (
          <motion.div key={sev} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
            <div className={`text-2xl font-extrabold font-display ${sev === 'Critical' ? 'text-rag-red' : sev === 'Warning' ? 'text-rag-amber' : 'text-primary'}`}>
              {entries.filter(e => e.severity === sev).length}
            </div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{sev} Events</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, action, or target..."
            className="w-full bg-surface-container-lowest border border-black/5 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        {(['All', 'ASE', 'TL', 'TDR', 'ZBM', 'REBALANCER', 'ADMIN'] as const).map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'}`}>
            {r}
          </button>
        ))}
        {(['All', 'Info', 'Warning', 'Critical'] as const).map(s => (
          <button key={s} onClick={() => setSevFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${sevFilter === s ? 'bg-on-surface text-surface' : 'bg-surface-container text-on-surface-variant'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Log Table */}
      <div className="card-base p-0 overflow-hidden">
        <div className="p-4 border-b border-black/5">
          <span className="text-xs font-bold text-on-surface-variant">{filtered.length} entries</span>
        </div>
        <div className="divide-y divide-black/5">
          {filtered.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-start gap-4 p-4 hover:bg-surface-container-low transition-colors">
              <div className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${SEVERITY_STYLES[entry.severity]}`}>
                {entry.severity.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-sm font-bold">{entry.action}</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold shrink-0">{entry.timestamp}</span>
                </div>
                <div className="text-[10px] font-semibold text-primary mt-0.5">
                  {entry.userName} ({entry.role}) → {entry.target}
                </div>
                <div className="text-[10px] text-on-surface-variant mt-0.5">{entry.details}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
