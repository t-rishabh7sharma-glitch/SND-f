import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Map,
  Network,
  Package,
  Send,
  Shield,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';
import type { UserRole } from '../types';

export type BoNavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  children?: BoNavItem[];
};

function adminNav(prefix: string): BoNavItem[] {
  const p = `/bo/${prefix}`;
  return [
    { id: 'dashboard', label: 'Dashboard', path: `${p}/dashboard`, icon: LayoutDashboard },
    {
      id: 'org',
      label: 'Organisation',
      path: `${p}/hierarchy`,
      icon: Network,
      children: [
        { id: 'hierarchy', label: 'Hierarchy', path: `${p}/hierarchy`, icon: Network },
        { id: 'territory', label: 'Territory', path: `${p}/territory`, icon: Map },
      ],
    },
    {
      id: 'people',
      label: 'People & access',
      path: `${p}/users`,
      icon: Users,
      children: [
        { id: 'users', label: 'Users & agents', path: `${p}/users`, icon: Users },
        { id: 'roles', label: 'Roles & RBAC', path: `${p}/roles`, icon: Shield },
      ],
    },
    {
      id: 'performance',
      label: 'Performance',
      path: `${p}/kpis`,
      icon: TrendingUp,
      children: [
        { id: 'kpis', label: 'KPI engine', path: `${p}/kpis`, icon: BarChart3 },
        { id: 'targets', label: 'Targets', path: `${p}/targets`, icon: Target },
        { id: 'incentives', label: 'Incentives', path: `${p}/incentives`, icon: TrendingUp },
      ],
    },
    { id: 'inventory', label: 'Inventory', path: `${p}/inventory`, icon: Package },
  ];
}

function tlNav(prefix: string): BoNavItem[] {
  const p = `/bo/${prefix}`;
  return [
    { id: 'dashboard', label: 'Team overview', path: `${p}/dashboard`, icon: Users },
    { id: 'map', label: 'Live map', path: `${p}/map`, icon: Map },
    { id: 'exceptions', label: 'Exception review', path: `${p}/exceptions`, icon: ShieldAlert },
    { id: 'validation', label: 'Visit validation', path: `${p}/validation`, icon: CheckCircle2 },
    { id: 'kpis', label: 'Team KPIs', path: `${p}/kpis`, icon: BarChart3 },
    { id: 'reports', label: 'Reports', path: `${p}/reports`, icon: ClipboardList },
    { id: 'signoff', label: 'Daily sign-off', path: `${p}/signoff`, icon: Send },
  ];
}

function tdrNav(prefix: string): BoNavItem[] {
  const p = `/bo/${prefix}`;
  return [
    { id: 'dashboard', label: 'Command center', path: `${p}/dashboard`, icon: LayoutDashboard },
    { id: 'operations', label: 'Operations', path: `${p}/operations`, icon: Users },
    { id: 'reports', label: 'Reports', path: `${p}/reports`, icon: FileText },
  ];
}

function zbmNav(prefix: string): BoNavItem[] {
  const p = `/bo/${prefix}`;
  return [
    { id: 'dashboard', label: 'Zonal command', path: `${p}/dashboard`, icon: LayoutDashboard },
    { id: 'analytics', label: 'Deep analytics', path: `${p}/analytics`, icon: TrendingUp },
    { id: 'reports', label: 'Executive reports', path: `${p}/reports`, icon: FileText },
  ];
}

function rebNav(prefix: string): BoNavItem[] {
  const p = `/bo/${prefix}`;
  return [
    { id: 'dashboard', label: 'Command center', path: `${p}/dashboard`, icon: LayoutDashboard },
    { id: 'liquidity', label: 'Agent liquidity', path: `${p}/liquidity`, icon: Users },
    { id: 'audit', label: 'Agent audit', path: `${p}/audit`, icon: ClipboardList },
    { id: 'transfer', label: 'Secure transfer', path: `${p}/transfer`, icon: ArrowRightLeft },
    { id: 'reports', label: 'Daily logs', path: `${p}/reports`, icon: FileText },
  ];
}

export function getBoNav(role: UserRole, prefix: string): BoNavItem[] {
  switch (role) {
    case 'ADMIN':
      return adminNav(prefix);
    case 'TL':
      return tlNav(prefix);
    case 'TDR':
      return tdrNav(prefix);
    case 'ZBM':
      return zbmNav(prefix);
    case 'REBALANCER':
      return rebNav(prefix);
    default:
      return adminNav(prefix);
  }
}

/** Flatten nav for role switcher labels */
export const DEMO_ROLE_PRESETS: { role: UserRole; label: string; loginHint: string }[] = [
  { role: 'ADMIN', label: 'BO · Super Admin', loginHint: 'ADMIN-00001' },
  { role: 'ZBM', label: 'BO · ZBM', loginHint: 'ZBM-50004' },
  { role: 'TDR', label: 'BO · TDR', loginHint: 'TDR-30041' },
  { role: 'TL', label: 'BO · Team Lead', loginHint: 'TL-10032' },
  { role: 'REBALANCER', label: 'BO · Rebalancer', loginHint: 'REB-70012' },
  { role: 'ASE', label: 'Field · ASE', loginHint: 'ASE-20241' },
];
