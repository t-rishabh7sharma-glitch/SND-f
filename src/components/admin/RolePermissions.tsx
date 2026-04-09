import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle2, XCircle, Info, X } from 'lucide-react';

interface RolePermissionsProps {
  onAction: (msg: string) => void;
  variant?: 'default' | 'bo';
}

type Role = 'ASE' | 'TL' | 'TDR' | 'ZBM' | 'REBALANCER' | 'ADMIN';

interface Permission {
  feature: string;
  category: string;
  roles: Record<Role, boolean>;
}

const PERMISSIONS: Permission[] = [
  // Field Operations
  { feature: 'Outlet Check-in / Visit Capture',  category: 'Field Ops',      roles: { ASE: true,  TL: false, TDR: false, ZBM: false, REBALANCER: false, ADMIN: false } },
  { feature: 'Daily Route Plan View',             category: 'Field Ops',      roles: { ASE: true,  TL: true,  TDR: false, ZBM: false, REBALANCER: false, ADMIN: false } },
  { feature: 'SIM Registration Capture',          category: 'Field Ops',      roles: { ASE: true,  TL: false, TDR: false, ZBM: false, REBALANCER: false, ADMIN: false } },
  { feature: 'Float / Cash Check',                category: 'Field Ops',      roles: { ASE: true,  TL: false, TDR: false, ZBM: false, REBALANCER: true,  ADMIN: false } },
  { feature: 'EOD Sync',                          category: 'Field Ops',      roles: { ASE: true,  TL: false, TDR: false, ZBM: false, REBALANCER: false, ADMIN: false } },
  // Monitoring
  { feature: 'Live ASE Map View',                 category: 'Monitoring',     roles: { ASE: false, TL: true,  TDR: true,  ZBM: true,  REBALANCER: false, ADMIN: true  } },
  { feature: 'Exception Review & Action',         category: 'Monitoring',     roles: { ASE: false, TL: true,  TDR: true,  ZBM: false, REBALANCER: false, ADMIN: true  } },
  { feature: 'Visit Validation',                  category: 'Monitoring',     roles: { ASE: false, TL: true,  TDR: false, ZBM: false, REBALANCER: false, ADMIN: false } },
  { feature: 'Geo-fence Alert View',              category: 'Monitoring',     roles: { ASE: false, TL: true,  TDR: true,  ZBM: true,  REBALANCER: false, ADMIN: true  } },
  // KPI & Targets
  { feature: 'View Personal KPIs',               category: 'KPIs & Targets', roles: { ASE: true,  TL: true,  TDR: true,  ZBM: true,  REBALANCER: true,  ADMIN: false } },
  { feature: 'Set Zone Targets',                  category: 'KPIs & Targets', roles: { ASE: false, TL: false, TDR: false, ZBM: true,  REBALANCER: false, ADMIN: false } },
  { feature: 'Set Territory Targets',             category: 'KPIs & Targets', roles: { ASE: false, TL: false, TDR: true,  ZBM: true,  REBALANCER: false, ADMIN: false } },
  { feature: 'Assign Daily ASE Targets',          category: 'KPIs & Targets', roles: { ASE: false, TL: true,  TDR: false, ZBM: false, REBALANCER: false, ADMIN: false } },
  { feature: 'Drill-down to ASE Performance',     category: 'KPIs & Targets', roles: { ASE: false, TL: true,  TDR: true,  ZBM: true,  REBALANCER: false, ADMIN: true  } },
  // Liquidity
  { feature: 'View Agent Float Balances',         category: 'Liquidity',      roles: { ASE: false, TL: false, TDR: false, ZBM: true,  REBALANCER: true,  ADMIN: false } },
  { feature: 'Perform Float Transfer',            category: 'Liquidity',      roles: { ASE: false, TL: false, TDR: false, ZBM: false, REBALANCER: true,  ADMIN: false } },
  { feature: 'Agent Audit',                       category: 'Liquidity',      roles: { ASE: false, TL: false, TDR: false, ZBM: false, REBALANCER: true,  ADMIN: true  } },
  // Admin / System
  { feature: 'User Provisioning (Add/Edit)',       category: 'System Admin',   roles: { ASE: false, TL: false, TDR: false, ZBM: false, REBALANCER: false, ADMIN: true  } },
  { feature: 'Modify Territory / Geo-fence',      category: 'System Admin',   roles: { ASE: false, TL: false, TDR: true,  ZBM: true,  REBALANCER: false, ADMIN: true  } },
  { feature: 'Device Management',                 category: 'System Admin',   roles: { ASE: false, TL: false, TDR: false, ZBM: false, REBALANCER: false, ADMIN: true  } },
  { feature: 'Audit Log Access',                  category: 'System Admin',   roles: { ASE: false, TL: false, TDR: false, ZBM: false, REBALANCER: false, ADMIN: true  } },
  { feature: 'Report Export',                     category: 'Reports',        roles: { ASE: false, TL: true,  TDR: true,  ZBM: true,  REBALANCER: true,  ADMIN: true  } },
];

const ROLES: Role[] = ['ASE', 'TL', 'TDR', 'ZBM', 'REBALANCER', 'ADMIN'];
const ROLE_COLORS_DEFAULT: Record<Role, string> = {
  ASE: 'text-primary', TL: 'text-rag-green', TDR: 'text-rag-amber',
  ZBM: 'text-purple-600', REBALANCER: 'text-blue-600', ADMIN: 'text-on-surface',
};

const ROLE_COLORS_BO: Record<Role, string> = {
  ASE: 'text-bo-primary', TL: 'text-emerald-700', TDR: 'text-amber-800',
  ZBM: 'text-violet-700', REBALANCER: 'text-sky-700', ADMIN: 'text-bo-secondary',
};

const CATEGORIES = [...new Set(PERMISSIONS.map(p => p.category))];

const RolePermissions: React.FC<RolePermissionsProps> = ({ onAction, variant = 'default' }) => {
  const bo = variant === 'bo';
  const ROLE_COLORS = bo ? ROLE_COLORS_BO : ROLE_COLORS_DEFAULT;
  const [perms, setPerms] = useState<Permission[]>(PERMISSIONS);
  const [permDetail, setPermDetail] = useState<Permission | null>(null);

  const toggle = (featureIdx: number, role: Role) => {
    setPerms(prev => prev.map((p, i) =>
      i === featureIdx ? { ...p, roles: { ...p.roles, [role]: !p.roles[role] } } : p
    ));
    onAction(`Permission updated for ${role}.`);
  };

  return (
    <div className={`space-y-8 max-w-7xl mx-auto ${bo ? 'bo-shell' : ''}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-2xl lg:text-4xl font-display font-extrabold ${bo ? 'text-bo-secondary' : 'text-primary'}`}>Role & Permissions</h1>
          <p className={`text-sm font-medium ${bo ? 'text-bo-muted' : 'text-on-surface-variant'}`}>RBAC matrix — configure feature access per role</p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${bo ? 'border-amber-200 bg-amber-50' : 'bg-rag-amber-bg rounded-xl border border-rag-amber/20'}`}>
          <Info size={14} className={bo ? 'text-amber-700' : 'text-rag-amber'} />
          <span className={`text-[10px] font-bold ${bo ? 'text-amber-900' : 'text-rag-amber'}`}>Changes take effect on next user login</span>
        </div>
      </div>

      {CATEGORIES.map(category => (
        <div key={category} className={`p-0 overflow-hidden ${bo ? 'bo-card' : 'card-base'}`}>
          <div className={`p-4 border-b border-black/5 ${bo ? 'bg-bo-surface' : 'bg-surface-container-low'}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{category}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="p-4 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-64">Feature / Permission</th>
                  {ROLES.map(r => (
                    <th key={r} className={`p-4 text-center text-[10px] font-bold uppercase tracking-widest ${ROLE_COLORS[r]}`}>{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perms.filter(p => p.category === category).map((p, idx) => {
                  const featureIdx = perms.indexOf(p);
                  return (
                    <tr key={idx} className="border-b border-black/5 hover:bg-surface-container-low transition-colors">
                      <td className="p-4 text-sm font-semibold">
                        {bo ? (
                          <button type="button" onClick={() => setPermDetail(p)} className="text-left text-bo-secondary underline-offset-2 hover:underline">
                            {p.feature}
                          </button>
                        ) : (
                          p.feature
                        )}
                      </td>
                      {ROLES.map(role => (
                        <td key={role} className="p-4 text-center">
                          <button
                            onClick={() => toggle(featureIdx, role)}
                            className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center transition-all hover:scale-110 ${p.roles[role] ? 'bg-rag-green-bg text-rag-green' : 'bg-surface-container text-on-surface-variant/30'}`}
                          >
                            {p.roles[role] ? <CheckCircle2 size={16} /> : <XCircle size={14} />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <AnimatePresence>
        {bo && permDetail && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/35"
              onClick={() => setPermDetail(null)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-black/5 bg-bo-secondary px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">{permDetail.category}</p>
                  <h2 className="text-lg font-bold leading-tight">{permDetail.feature}</h2>
                </div>
                <button type="button" onClick={() => setPermDetail(null)} className="rounded-lg p-2 hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm text-bo-muted">
                <p>
                  This permission gates UI routes and API scopes. Toggles here are a prototype; production keeps navigation rules in code and syncs policy from{' '}
                  <code className="rounded bg-bo-surface px-1">/bo/roles</code>.
                </p>
                <p className="font-semibold text-black">Roles currently allowed</p>
                <ul className="space-y-1">
                  {ROLES.filter((r) => permDetail.roles[r]).map((r) => (
                    <li key={r} className="flex items-center gap-2 text-bo-secondary">
                      <CheckCircle2 size={14} className="text-emerald-600" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RolePermissions;
