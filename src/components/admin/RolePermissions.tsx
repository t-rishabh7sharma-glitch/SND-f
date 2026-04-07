import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle2, XCircle, Info } from 'lucide-react';

interface RolePermissionsProps {
  onAction: (msg: string) => void;
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
const ROLE_COLORS: Record<Role, string> = {
  ASE: 'text-primary', TL: 'text-rag-green', TDR: 'text-rag-amber',
  ZBM: 'text-purple-600', REBALANCER: 'text-blue-600', ADMIN: 'text-on-surface',
};

const CATEGORIES = [...new Set(PERMISSIONS.map(p => p.category))];

const RolePermissions: React.FC<RolePermissionsProps> = ({ onAction }) => {
  const [perms, setPerms] = useState<Permission[]>(PERMISSIONS);

  const toggle = (featureIdx: number, role: Role) => {
    setPerms(prev => prev.map((p, i) =>
      i === featureIdx ? { ...p, roles: { ...p.roles, [role]: !p.roles[role] } } : p
    ));
    onAction(`Permission updated for ${role}.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary">Role & Permissions</h1>
          <p className="text-on-surface-variant text-sm font-medium">RBAC matrix — configure feature access per role</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rag-amber-bg rounded-xl border border-rag-amber/20">
          <Info size={14} className="text-rag-amber" />
          <span className="text-[10px] font-bold text-rag-amber">Changes take effect on next user login</span>
        </div>
      </div>

      {CATEGORIES.map(category => (
        <div key={category} className="card-base p-0 overflow-hidden">
          <div className="p-4 bg-surface-container-low border-b border-black/5">
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
                      <td className="p-4 text-sm font-semibold">{p.feature}</td>
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
    </div>
  );
};

export default RolePermissions;
