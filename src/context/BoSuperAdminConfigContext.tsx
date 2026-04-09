import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** Field hierarchy: zone → territory → team → executive (matches dashboards / target cascade). */
export type OrgLevel = 'ZBM' | 'TDR' | 'TL' | 'ASE';

export interface HierarchyNode {
  id: string;
  label: string;
  level: OrgLevel;
  parentId: string | null;
  description: string;
  metricHint?: string;
}

export interface TerritoryRecord {
  id: string;
  name: string;
  code: string;
  /** Distinct TL-level route / outlet groupings under this territory (not individual outlets). */
  routeGroups: number;
  activeDsas: number;
  parentId: string | null;
  description: string;
}

export interface BoKpiCatalogItem {
  id: string;
  key: string;
  label: string;
  description: string;
  unit: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  formula: string;
  dashboards: string[];
  enabled: boolean;
}

export type KpiOrderRole = 'ASE' | 'TL' | 'TDR' | 'ZBM' | 'REBALANCER';

export interface TargetRollupRow {
  id: string;
  level: string;
  nodeName: string;
  metricKey: string;
  target: string;
  actual: string;
  period: string;
}

export interface IncentivePlanRow {
  id: string;
  planName: string;
  slabLabel: string;
  payoutRule: string;
  appliesToRoles: string[];
  active: boolean;
}

const INITIAL_HIERARCHY: HierarchyNode[] = [
  {
    id: 'h-z1',
    label: 'ZBM · Metro South',
    level: 'ZBM',
    parentId: null,
    description: 'Zonal manager: owns zone targets, incentives roll-up, and TDR roster for this zone.',
    metricHint: 'Zone GA, liquidity index, branding compliance',
  },
  {
    id: 'h-z2',
    label: 'ZBM · Copperbelt',
    level: 'ZBM',
    parentId: null,
    description: 'Zonal manager for Copperbelt footprint; cascades national plan to territories.',
    metricHint: 'Zone visitations, DSA activity rate',
  },
  {
    id: 'h-tdr1',
    label: 'TDR · Metro East',
    level: 'TDR',
    parentId: 'h-z1',
    description: 'Territory director: splits zone targets across TL teams and route plans.',
    metricHint: 'Territory gross additions, float risk',
  },
  {
    id: 'h-tdr2',
    label: 'TDR · Central Copperbelt',
    level: 'TDR',
    parentId: 'h-z2',
    description: 'Territory director for central Copperbelt corridors.',
    metricHint: 'MoMo GA, merchant recruitment',
  },
  {
    id: 'h-tl1',
    label: 'TL · Lusaka East',
    level: 'TL',
    parentId: 'h-tdr1',
    description: 'Team lead: daily ASE targets, visit validation, exception review.',
    metricHint: 'Team visit adherence, SIM GA',
  },
  {
    id: 'h-tl2',
    label: 'TL · Ndola North',
    level: 'TL',
    parentId: 'h-tdr2',
    description: 'Team lead for Ndola north outlet cluster.',
    metricHint: 'ASE compliance, missed visits',
  },
  {
    id: 'h-ase1',
    label: 'ASE · Mwape Banda',
    level: 'ASE',
    parentId: 'h-tl1',
    description: 'Area sales executive: outlet visits, SIM, float checks, EOD sync.',
    metricHint: 'Daily visits vs plan, session KPIs',
  },
  {
    id: 'h-ase2',
    label: 'ASE · Priya Nambwe',
    level: 'ASE',
    parentId: 'h-tl1',
    description: 'Field execution under TL · Lusaka East.',
    metricHint: 'Route adherence, geo-fence pass',
  },
  {
    id: 'h-ase3',
    label: 'ASE · Tiza Mwale',
    level: 'ASE',
    parentId: 'h-tl2',
    description: 'Field execution under TL · Ndola North.',
    metricHint: 'Gross additions, activations',
  },
];

const INITIAL_TERRITORY: TerritoryRecord[] = [
  {
    id: 't-1',
    name: 'Metro East',
    code: 'ME-01',
    routeGroups: 14,
    activeDsas: 128,
    parentId: null,
    description: 'Urban east: high outlet density; geo-fences tuned for CBD. Route groups map to TL teams / daily plans.',
  },
  {
    id: 't-2',
    name: 'Metro West',
    code: 'MW-02',
    routeGroups: 11,
    activeDsas: 96,
    parentId: null,
    description: 'Retail-heavy; MoMo agent focus. Route roster reconciled weekly with TL assignments.',
  },
  {
    id: 't-3',
    name: 'Copperbelt Central',
    code: 'CC-03',
    routeGroups: 22,
    activeDsas: 201,
    parentId: null,
    description: 'Mining corridor coverage; route groups align with float rebalancing runs.',
  },
];

/** KPIs referenced across ASE, TL, TDR, ZBM, Rebalancer and admin dashboards */
const INITIAL_KPI_CATALOG: BoKpiCatalogItem[] = [
  { id: 'kpi-visits', key: 'visits', label: 'Outlets visited', description: 'Completed valid visits vs planned route.', unit: 'count', frequency: 'Daily', formula: 'completed_visits', dashboards: ['ASE', 'TL', 'TDR'], enabled: true },
  { id: 'kpi-visit-rate', key: 'visit_rate', label: 'Visit rate', description: 'Share of planned outlets visited same day.', unit: '%', frequency: 'Daily', formula: 'visited / planned * 100', dashboards: ['ASE', 'TL'], enabled: true },
  { id: 'kpi-route-adherence', key: 'route_adherence', label: 'Route adherence', description: 'Deviation from planned sequence / corridor.', unit: '%', frequency: 'Daily', formula: '1 - route_deviation_index', dashboards: ['ASE', 'TL'], enabled: true },
  { id: 'kpi-geo', key: 'geo_pass', label: 'Geo-fence pass rate', description: 'Check-ins inside assigned polygon.', unit: '%', frequency: 'Daily', formula: 'pass / total_checkins * 100', dashboards: ['ASE', 'TL', 'TDR', 'ADMIN'], enabled: true },
  { id: 'kpi-sim', key: 'gross_add', label: 'Gross additions (SIM)', description: 'SIM registrations attributed to field.', unit: 'SIMs', frequency: 'Daily', formula: 'sum(sim_reg)', dashboards: ['ASE', 'TL', 'TDR', 'ZBM'], enabled: true },
  { id: 'kpi-momo-ga', key: 'momo_ga', label: 'MoMo gross additions', description: 'Mobile money account openings.', unit: 'count', frequency: 'Daily', formula: 'sum(momo_onboard)', dashboards: ['TL', 'TDR', 'ZBM'], enabled: true },
  { id: 'kpi-ga-combo', key: 'ga_sim_momo', label: 'GA (SIM + MoMo)', description: 'Composite growth metric on TL team view.', unit: 'count', frequency: 'Daily', formula: 'sim_ga + momo_ga', dashboards: ['TL'], enabled: true },
  { id: 'kpi-agent-recruit', key: 'agent_recruit', label: 'Agent recruitment', description: 'New agents activated in period.', unit: 'count', frequency: 'Weekly', formula: 'count(new_agent_id)', dashboards: ['ASE', 'TL', 'TDR'], enabled: true },
  { id: 'kpi-merchant', key: 'merchant_recruit', label: 'Merchant recruitment', description: 'New merchants boarded.', unit: 'count', frequency: 'Monthly', formula: 'count(merchant_id)', dashboards: ['TDR', 'ZBM'], enabled: true },
  { id: 'kpi-float', key: 'float_avail', label: 'Float availability', description: 'Adequate float at outlet vs threshold.', unit: 'ZMW / %', frequency: 'Daily', formula: 'weighted_float_score', dashboards: ['ASE', 'TL', 'ZBM', 'REBALANCER'], enabled: true },
  { id: 'kpi-cash', key: 'cash_avail', label: 'Cash availability', description: 'Cash adequacy for agent operations.', unit: 'ZMW / %', frequency: 'Daily', formula: 'cash_vs_policy', dashboards: ['TL', 'TDR', 'ZBM'], enabled: true },
  { id: 'kpi-dsa-active', key: 'active_dsa', label: 'Active DSAs', description: 'DSAs with activity in rolling window.', unit: 'count', frequency: 'Weekly', formula: 'count(distinct dsa where txns>0)', dashboards: ['TDR', 'ZBM'], enabled: true },
  { id: 'kpi-dsa-total', key: 'total_dsa', label: 'Total DSA base', description: 'Registered distribution points in territory.', unit: 'count', frequency: 'Monthly', formula: 'count(dsa)', dashboards: ['ZBM'], enabled: true },
  { id: 'kpi-branding', key: 'branding', label: 'Branding compliance', description: 'Audits passing branding standard.', unit: '%', frequency: 'Weekly', formula: 'pass_audits / audits * 100', dashboards: ['ASE', 'TL', 'ZBM'], enabled: true },
  { id: 'kpi-serviced', key: 'serviced_cust', label: 'Serviced customers', description: 'Unique customers touched at outlets.', unit: 'count', frequency: 'Monthly', formula: 'uniq(customer_id)', dashboards: ['TDR', 'ZBM'], enabled: true },
  { id: 'kpi-tx-value', key: 'tx_value', label: 'Transaction value', description: 'Aggregated throughput via agent channel.', unit: 'ZMW', frequency: 'Monthly', formula: 'sum(txn_amount)', dashboards: ['ZBM'], enabled: true },
  { id: 'kpi-visitations', key: 'total_visits_z', label: 'Total visitations (zone)', description: 'Zonal sum of field visitations.', unit: 'count', frequency: 'Weekly', formula: 'sum(ase_visits)', dashboards: ['ZBM'], enabled: true },
  { id: 'kpi-dsa-activity', key: 'dsa_activity_rate', label: 'DSA activity rate', description: 'Share of DSAs transacting vs base.', unit: '%', frequency: 'Weekly', formula: 'active_dsa / total_dsa * 100', dashboards: ['TL', 'TDR'], enabled: true },
  { id: 'kpi-liquidity', key: 'liquidity_risk', label: 'Liquidity / stockout risk', description: 'Agents below min float or dormant.', unit: 'index', frequency: 'Daily', formula: 'weighted_risk_score', dashboards: ['ZBM', 'REBALANCER'], enabled: true },
  { id: 'kpi-reb-transfer', key: 'float_transfers', label: 'Float transfers completed', description: 'Secure transfers executed by rebalancer.', unit: 'count', frequency: 'Daily', formula: 'count(transfer_id)', dashboards: ['REBALANCER'], enabled: true },
  { id: 'kpi-time-outlet', key: 'avg_dwell', label: 'Avg time per outlet', description: 'Mean dwell for compliant visits.', unit: 'min', frequency: 'Daily', formula: 'avg(checkout-checkin)', dashboards: ['ASE', 'TL'], enabled: true },
];

function defaultOrders(): Record<KpiOrderRole, string[]> {
  const ids = INITIAL_KPI_CATALOG.filter((k) => k.enabled).map((k) => k.id);
  const pick = (pred: (k: BoKpiCatalogItem) => boolean) => INITIAL_KPI_CATALOG.filter((k) => k.enabled && pred(k)).map((k) => k.id);
  return {
    ASE: pick((k) => k.dashboards.includes('ASE')),
    TL: pick((k) => k.dashboards.includes('TL')),
    TDR: pick((k) => k.dashboards.includes('TDR')),
    ZBM: pick((k) => k.dashboards.includes('ZBM')),
    REBALANCER: pick((k) => k.dashboards.includes('REBALANCER')),
  };
}

const INITIAL_TARGETS: TargetRollupRow[] = [
  { id: 'tg-1', level: 'Zone', nodeName: 'South', metricKey: 'kpi-sim', target: '12000', actual: '9420', period: 'MTD' },
  { id: 'tg-2', level: 'Territory', nodeName: 'Metro East', metricKey: 'kpi-visits', target: '2400', actual: '1890', period: 'MTD' },
  { id: 'tg-3', level: 'Team', nodeName: 'TL-10032', metricKey: 'kpi-ga-combo', target: '420', actual: '355', period: 'MTD' },
];

const INITIAL_INCENTIVES: IncentivePlanRow[] = [
  { id: 'inc-1', planName: 'Q1 Accelerator', slabLabel: '100–109% attainment', payoutRule: '+3% variable', appliesToRoles: ['ASE', 'TL'], active: true },
  { id: 'inc-2', planName: 'Q1 Accelerator', slabLabel: '110%+ attainment', payoutRule: '+5% variable', appliesToRoles: ['ASE', 'TL'], active: true },
  { id: 'inc-3', planName: 'Zonal stretch', slabLabel: 'Zone GA top quartile', payoutRule: 'Lump sum', appliesToRoles: ['ZBM'], active: true },
];

type BoSuperAdminConfigContextValue = {
  hierarchy: HierarchyNode[];
  addHierarchyNode: (n: Omit<HierarchyNode, 'id'> & { id?: string }) => void;
  updateHierarchyNode: (id: string, patch: Partial<HierarchyNode>) => void;
  removeHierarchyNode: (id: string) => void;
  territory: TerritoryRecord[];
  addTerritoryNode: (n: Omit<TerritoryRecord, 'id'> & { id?: string }) => void;
  updateTerritoryNode: (id: string, patch: Partial<TerritoryRecord>) => void;
  removeTerritoryNode: (id: string) => void;
  kpiCatalog: BoKpiCatalogItem[];
  setKpiCatalog: React.Dispatch<React.SetStateAction<BoKpiCatalogItem[]>>;
  updateKpiItem: (id: string, patch: Partial<BoKpiCatalogItem>) => void;
  kpiOrderByRole: Record<KpiOrderRole, string[]>;
  setKpiOrderForRole: (role: KpiOrderRole, orderedIds: string[]) => void;
  moveKpiInRoleOrder: (role: KpiOrderRole, id: string, dir: -1 | 1) => void;
  targets: TargetRollupRow[];
  setTargets: React.Dispatch<React.SetStateAction<TargetRollupRow[]>>;
  addTargetRow: (row: Omit<TargetRollupRow, 'id'> & { id?: string }) => void;
  updateTargetRow: (id: string, patch: Partial<TargetRollupRow>) => void;
  incentives: IncentivePlanRow[];
  setIncentives: React.Dispatch<React.SetStateAction<IncentivePlanRow[]>>;
  addIncentiveRow: (row: Omit<IncentivePlanRow, 'id'> & { id?: string }) => void;
  updateIncentiveRow: (id: string, patch: Partial<IncentivePlanRow>) => void;
  targetRowOrder: string[];
  moveTargetRow: (id: string, dir: -1 | 1) => void;
  incentiveRowOrder: string[];
  moveIncentiveRow: (id: string, dir: -1 | 1) => void;
};

const BoSuperAdminConfigContext = createContext<BoSuperAdminConfigContextValue | null>(null);

export function BoSuperAdminConfigProvider({ children }: { children: React.ReactNode }) {
  const [hierarchy, setHierarchy] = useState<HierarchyNode[]>(INITIAL_HIERARCHY);
  const [territory, setTerritory] = useState<TerritoryRecord[]>(INITIAL_TERRITORY);
  const [kpiCatalog, setKpiCatalog] = useState<BoKpiCatalogItem[]>(INITIAL_KPI_CATALOG);
  const [kpiOrderByRole, setKpiOrderByRole] = useState<Record<KpiOrderRole, string[]>>(defaultOrders);
  const [targets, setTargets] = useState<TargetRollupRow[]>(INITIAL_TARGETS);
  const [incentives, setIncentives] = useState<IncentivePlanRow[]>(INITIAL_INCENTIVES);
  const [targetRowOrder, setTargetRowOrder] = useState<string[]>(INITIAL_TARGETS.map((t) => t.id));
  const [incentiveRowOrder, setIncentiveRowOrder] = useState<string[]>(INITIAL_INCENTIVES.map((i) => i.id));

  const addHierarchyNode = useCallback((n: Omit<HierarchyNode, 'id'> & { id?: string }) => {
    const id = n.id ?? `h-${Date.now()}`;
    setHierarchy((prev) => [...prev, { ...n, id } as HierarchyNode]);
  }, []);

  const updateHierarchyNode = useCallback((id: string, patch: Partial<HierarchyNode>) => {
    setHierarchy((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const removeHierarchyNode = useCallback((id: string) => {
    setHierarchy((prev) => {
      const childrenOf = (pid: string) => prev.filter((x) => x.parentId === pid).map((x) => x.id);
      const stack = [id];
      const remove = new Set<string>();
      while (stack.length) {
        const cur = stack.pop()!;
        remove.add(cur);
        childrenOf(cur).forEach((c) => stack.push(c));
      }
      return prev.filter((x) => !remove.has(x.id));
    });
  }, []);

  const addTerritoryNode = useCallback((n: Omit<TerritoryRecord, 'id'> & { id?: string }) => {
    const id = n.id ?? `t-${Date.now()}`;
    setTerritory((prev) => [...prev, { ...n, id } as TerritoryRecord]);
  }, []);

  const updateTerritoryNode = useCallback((id: string, patch: Partial<TerritoryRecord>) => {
    setTerritory((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const removeTerritoryNode = useCallback((id: string) => {
    setTerritory((prev) => {
      const childrenOf = (pid: string) => prev.filter((x) => x.parentId === pid).map((x) => x.id);
      const stack = [id];
      const remove = new Set<string>();
      while (stack.length) {
        const cur = stack.pop()!;
        remove.add(cur);
        childrenOf(cur).forEach((c) => stack.push(c));
      }
      return prev.filter((x) => !remove.has(x.id));
    });
  }, []);

  const updateKpiItem = useCallback((id: string, patch: Partial<BoKpiCatalogItem>) => {
    setKpiCatalog((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const setKpiOrderForRole = useCallback((role: KpiOrderRole, orderedIds: string[]) => {
    setKpiOrderByRole((prev) => ({ ...prev, [role]: orderedIds }));
  }, []);

  const moveKpiInRoleOrder = useCallback((role: KpiOrderRole, id: string, dir: -1 | 1) => {
    setKpiOrderByRole((prev) => {
      const list = [...prev[role]];
      const i = list.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= list.length) return prev;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...prev, [role]: list };
    });
  }, []);

  const addTargetRow = useCallback((row: Omit<TargetRollupRow, 'id'> & { id?: string }) => {
    const id = row.id ?? `tg-${Date.now()}`;
    setTargets((prev) => [...prev, { ...row, id } as TargetRollupRow]);
    setTargetRowOrder((o) => [...o, id]);
  }, []);

  const updateTargetRow = useCallback((id: string, patch: Partial<TargetRollupRow>) => {
    setTargets((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const moveTargetRow = useCallback((id: string, dir: -1 | 1) => {
    setTargetRowOrder((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  const addIncentiveRow = useCallback((row: Omit<IncentivePlanRow, 'id'> & { id?: string }) => {
    const id = row.id ?? `inc-${Date.now()}`;
    setIncentives((prev) => [...prev, { ...row, id } as IncentivePlanRow]);
    setIncentiveRowOrder((o) => [...o, id]);
  }, []);

  const updateIncentiveRow = useCallback((id: string, patch: Partial<IncentivePlanRow>) => {
    setIncentives((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const moveIncentiveRow = useCallback((id: string, dir: -1 | 1) => {
    setIncentiveRowOrder((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      hierarchy,
      addHierarchyNode,
      updateHierarchyNode,
      removeHierarchyNode,
      territory,
      addTerritoryNode,
      updateTerritoryNode,
      removeTerritoryNode,
      kpiCatalog,
      setKpiCatalog,
      updateKpiItem,
      kpiOrderByRole,
      setKpiOrderForRole,
      moveKpiInRoleOrder,
      targets,
      setTargets,
      addTargetRow,
      updateTargetRow,
      incentives,
      setIncentives,
      addIncentiveRow,
      updateIncentiveRow,
      targetRowOrder,
      moveTargetRow,
      incentiveRowOrder,
      moveIncentiveRow,
    }),
    [
      hierarchy,
      territory,
      kpiCatalog,
      kpiOrderByRole,
      targets,
      incentives,
      targetRowOrder,
      incentiveRowOrder,
      addHierarchyNode,
      updateHierarchyNode,
      removeHierarchyNode,
      addTerritoryNode,
      updateTerritoryNode,
      removeTerritoryNode,
      updateKpiItem,
      setKpiOrderForRole,
      moveKpiInRoleOrder,
      addTargetRow,
      updateTargetRow,
      addIncentiveRow,
      updateIncentiveRow,
      moveTargetRow,
      moveIncentiveRow,
    ],
  );

  return <BoSuperAdminConfigContext.Provider value={value}>{children}</BoSuperAdminConfigContext.Provider>;
}

export function useBoSuperAdminConfig() {
  const ctx = useContext(BoSuperAdminConfigContext);
  if (!ctx) throw new Error('useBoSuperAdminConfig must be used within BoSuperAdminConfigProvider');
  return ctx;
}

export const ORG_LEVELS: OrgLevel[] = ['ZBM', 'TDR', 'TL', 'ASE'];
export const KPI_ORDER_ROLES: KpiOrderRole[] = ['ASE', 'TL', 'TDR', 'ZBM', 'REBALANCER'];
