// ─────────────────────────────────────────────────────────────────
// ZAMTEL CRM — Central KPI Store
// Single source of truth for the full target cascade:
//   ZBM → TDR → TL → ASE
// All 5 KPI categories per spec:
//   1. Agent Base & Activity
//   2. Recruitment & Growth
//   3. Liquidity & Float
//   4. Customer & Transaction Activity
//   5. Field Activity & Visibility
// ─────────────────────────────────────────────────────────────────

export interface KpiTarget {
  label: string;
  target: number;
  actual: number;
  unit: string;
}

// ─── ZONE TARGETS (Set by ZBM — top of cascade) ─────────────────

export interface ZoneTargets {
  zoneId: string;
  zoneName: string;
  period: string;
  // 1. Agent Base & Activity
  totalDSA: KpiTarget;
  activeDSA: KpiTarget;
  transactingAgents: KpiTarget;
  // 2. Recruitment & Growth
  grossAdditions: KpiTarget;
  momoGA: KpiTarget;
  agentRecruitment: KpiTarget;
  merchantRecruitment: KpiTarget;
  // 3. Liquidity & Float
  cashAvailability: KpiTarget;
  floatAvailability: KpiTarget;
  // 4. Customer & Transaction
  servicedCustomers: KpiTarget;
  transactionValue: KpiTarget;
  // 5. Field Activity & Visibility
  totalVisitations: KpiTarget;
  brandingCompliance: KpiTarget;
}

// ─── TERRITORY TARGETS (Set by TDR — receives from ZBM) ─────────

export interface TerritoryTargets {
  tdrId: string;
  tdrName: string;
  territoryName: string;
  // 1. Agent Base & Activity
  activeDSA: KpiTarget;
  // 2. Recruitment & Growth
  grossAdditions: KpiTarget;
  momoGA: KpiTarget;
  agentRecruitment: KpiTarget;
  merchantRecruitment: KpiTarget;
  // 3. Liquidity & Float
  cashAvailability: KpiTarget;
  floatAvailability: KpiTarget;
  // 4. Customer & Transaction
  servicedCustomers: KpiTarget;
  transactionValue: KpiTarget;
  // 5. Field Activity & Visibility
  totalVisitations: KpiTarget;
  brandingCompliance: KpiTarget;
}

// ─── TEAM TARGETS (Set by TL — receives from TDR) ───────────────

export interface TeamTargets {
  tlId: string;
  tlName: string;
  teamName: string;
  tdrId: string;
  // 1. Agent Base & Activity (DSA Activity Rate unique to TL)
  totalDSA: KpiTarget;
  activeDSA: KpiTarget;
  dsaActivityRate: KpiTarget;
  // 2. Recruitment & Growth
  grossAdditions: KpiTarget;
  gaConversion: KpiTarget;
  momoGA: KpiTarget;
  momoGAConversion: KpiTarget;
  agentRecruitment: KpiTarget;
  // 3. Liquidity & Float
  cashAvailability: KpiTarget;
  floatAvailability: KpiTarget;
  // 4. Customer & Transaction
  servicedCustomers: KpiTarget;
  transactionValue: KpiTarget;
  // 5. Field Activity & Visibility
  visits: KpiTarget;
  brandingCompliance: KpiTarget;
}

// ─── ASE DAILY TARGETS (Set by TL — bottom of cascade) ──────────

export interface AseTargets {
  aseId: string;
  aseName: string;
  tlId: string;
  date: string;
  // 1. Agent Base & Activity
  totalDSA: KpiTarget;
  activeDSA: KpiTarget;
  transactingAgents: KpiTarget;
  // 2. Recruitment & Growth
  grossAdditions: KpiTarget;
  momoGA: KpiTarget;
  agentRecruitment: KpiTarget;
  merchantRecruitment: KpiTarget;
  // 3. Liquidity & Float
  cashAvailability: KpiTarget;
  floatAvailability: KpiTarget;
  // 4. Customer & Transaction
  servicedCustomers: KpiTarget;
  transactionValue: KpiTarget;
  // 5. Field Activity & Visibility
  visits: KpiTarget;
  brandingChecks: KpiTarget;
}

// ─── SUPPORTING TYPES ────────────────────────────────────────────

export interface AgentFloat {
  agentId: string;
  agentName: string;
  location: string;
  region: string;
  floatBalance: number;
  floatTarget: number;
  minThreshold: number;
  currentFloat: number;
  depletionRate: string;
  timeToStockout: string;
  isDormant: boolean;
  lastCashCheck: number;
  lastStockCheck: string;
  lastRebalanced: string;
  status: 'Healthy' | 'Near Stockout' | 'Stockout' | 'Dormant';
  transactionsToday: number;
  liquidityScore: number;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'ASE' | 'TL' | 'TDR' | 'ZBM' | 'REBALANCER' | 'ADMIN';
  region: string;
  territory: string;
  geoFenceAssigned: boolean;
  status: 'Active' | 'Suspended' | 'Pending';
  lastLogin: string;
  deviceImei?: string;
  addedBy: string;
  addedDate: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────

export const getAchievementPct = (target: number, actual: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((actual / target) * 100), 100);
};

export const getRAGStatus = (pct: number): 'green' | 'amber' | 'red' => {
  if (pct >= 80) return 'green';
  if (pct >= 50) return 'amber';
  return 'red';
};

export const ragColor = (pct: number) => {
  const s = getRAGStatus(pct);
  return s === 'green' ? 'text-rag-green' : s === 'amber' ? 'text-rag-amber' : 'text-rag-red';
};

export const ragBg = (pct: number) => {
  const s = getRAGStatus(pct);
  return s === 'green' ? 'bg-rag-green' : s === 'amber' ? 'bg-rag-amber' : 'bg-rag-red';
};

// ═══════════════════════════════════════════════════════════════════
// ZONE TARGETS (Set by ZBM — April 2026)
// ═══════════════════════════════════════════════════════════════════

export const ZONE_TARGETS: ZoneTargets = {
  zoneId: 'ZONE-S01',
  zoneName: 'Zambia South Zone',
  period: 'April 2026',
  // 1. Agent Base & Activity
  totalDSA:          { label: 'Total DSA',             target: 250,   actual: 218,   unit: 'Agents' },
  activeDSA:         { label: 'Active DSA',            target: 200,   actual: 172,   unit: 'Agents' },
  transactingAgents: { label: 'Transacting Agents',    target: 180,   actual: 148,   unit: 'Agents' },
  // 2. Recruitment & Growth
  grossAdditions:      { label: 'Gross Additions',       target: 5000, actual: 3840, unit: 'SIMs' },
  momoGA:              { label: 'MoMo Gross Additions',  target: 2000, actual: 1420, unit: 'Users' },
  agentRecruitment:    { label: 'Agent Recruitment',     target: 80,   actual: 54,   unit: 'Agents' },
  merchantRecruitment: { label: 'Merchant Recruitment',  target: 40,   actual: 28,   unit: 'Merchants' },
  // 3. Liquidity & Float
  cashAvailability:  { label: 'Cash Availability',     target: 500000, actual: 385000, unit: 'ZMW' },
  floatAvailability: { label: 'Float Availability',    target: 800000, actual: 642000, unit: 'ZMW' },
  // 4. Customer & Transaction
  servicedCustomers: { label: 'Serviced Customers',    target: 12000, actual: 9240,  unit: 'Customers' },
  transactionValue:  { label: 'Transaction Value',     target: 2500000, actual: 1860000, unit: 'ZMW' },
  // 5. Field Activity & Visibility
  totalVisitations:    { label: 'Total Visitations',     target: 2000, actual: 1580, unit: 'Visits' },
  brandingCompliance:  { label: 'Branding Compliance',   target: 500,  actual: 412,  unit: 'Audits' },
};

// ═══════════════════════════════════════════════════════════════════
// TERRITORY TARGETS (Set by TDR — derived from Zone)
// ═══════════════════════════════════════════════════════════════════

export const TERRITORY_TARGETS: TerritoryTargets[] = [
  {
    tdrId: 'TDR-30041', tdrName: 'Sarah Mwale', territoryName: 'Lusaka East',
    activeDSA:           { label: 'Active DSA',            target: 55,    actual: 48,    unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',       target: 1400,  actual: 1248,  unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',               target: 560,   actual: 412,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',     target: 22,    actual: 16,    unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment',  target: 12,    actual: 8,     unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',     target: 140000, actual: 112000, unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',    target: 220000, actual: 184000, unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',    target: 3400,  actual: 2860,  unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',     target: 700000, actual: 542000, unit: 'ZMW' },
    totalVisitations:    { label: 'Total Visitations',     target: 560,   actual: 482,   unit: 'Visits' },
    brandingCompliance:  { label: 'Branding Compliance',   target: 140,   actual: 118,   unit: 'Audits' },
  },
  {
    tdrId: 'TDR-30042', tdrName: 'Kelvin Daka', territoryName: 'Lusaka West',
    activeDSA:           { label: 'Active DSA',            target: 50,    actual: 34,    unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',       target: 1200,  actual: 740,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',               target: 480,   actual: 290,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',     target: 20,    actual: 10,    unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment',  target: 10,    actual: 5,     unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',     target: 120000, actual: 78000,  unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',    target: 190000, actual: 124000, unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',    target: 2800,  actual: 1640,  unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',     target: 580000, actual: 356000, unit: 'ZMW' },
    totalVisitations:    { label: 'Total Visitations',     target: 480,   actual: 296,   unit: 'Visits' },
    brandingCompliance:  { label: 'Branding Compliance',   target: 120,   actual: 72,    unit: 'Audits' },
  },
  {
    tdrId: 'TDR-30043', tdrName: 'Mwiza Tembo', territoryName: 'Copperbelt North',
    activeDSA:           { label: 'Active DSA',            target: 52,    actual: 46,    unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',       target: 1300,  actual: 1104,  unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',               target: 520,   actual: 418,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',     target: 20,    actual: 16,    unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment',  target: 10,    actual: 9,     unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',     target: 130000, actual: 108000, unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',    target: 210000, actual: 182000, unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',    target: 3200,  actual: 2680,  unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',     target: 650000, actual: 528000, unit: 'ZMW' },
    totalVisitations:    { label: 'Total Visitations',     target: 520,   actual: 448,   unit: 'Visits' },
    brandingCompliance:  { label: 'Branding Compliance',   target: 130,   actual: 112,   unit: 'Audits' },
  },
  {
    tdrId: 'TDR-30044', tdrName: 'Grace Phiri', territoryName: 'Southern Province',
    activeDSA:           { label: 'Active DSA',            target: 43,    actual: 32,    unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',       target: 1100,  actual: 748,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',               target: 440,   actual: 300,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',     target: 18,    actual: 12,    unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment',  target: 8,     actual: 6,     unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',     target: 110000, actual: 87000,  unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',    target: 180000, actual: 152000, unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',    target: 2600,  actual: 2060,  unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',     target: 570000, actual: 434000, unit: 'ZMW' },
    totalVisitations:    { label: 'Total Visitations',     target: 440,   actual: 354,   unit: 'Visits' },
    brandingCompliance:  { label: 'Branding Compliance',   target: 110,   actual: 86,    unit: 'Audits' },
  },
];

// ═══════════════════════════════════════════════════════════════════
// TEAM TARGETS (Set by TL — derived from Territory)
// ═══════════════════════════════════════════════════════════════════

export const TEAM_TARGETS: TeamTargets[] = [
  {
    tlId: 'TL-10032', tlName: 'Brian Phiri', teamName: 'Lusaka East Alpha', tdrId: 'TDR-30041',
    totalDSA:          { label: 'Total DSA',          target: 30,   actual: 26,   unit: 'Agents' },
    activeDSA:         { label: 'Active DSA',         target: 25,   actual: 22,   unit: 'Agents' },
    dsaActivityRate:   { label: 'DSA Activity Rate',  target: 85,   actual: 78,   unit: '%' },
    grossAdditions:    { label: 'Gross Additions',    target: 700,  actual: 612,  unit: 'SIMs' },
    gaConversion:      { label: 'GA Conversion',      target: 75,   actual: 68,   unit: '%' },
    momoGA:            { label: 'MoMo GA',            target: 280,  actual: 206,  unit: 'Users' },
    momoGAConversion:  { label: 'MoMo GA Conversion', target: 60,   actual: 52,   unit: '%' },
    agentRecruitment:  { label: 'Agent Recruitment',  target: 12,   actual: 8,    unit: 'Agents' },
    cashAvailability:  { label: 'Cash Availability',  target: 70000, actual: 56000, unit: 'ZMW' },
    floatAvailability: { label: 'Float Availability',  target: 110000, actual: 92000, unit: 'ZMW' },
    servicedCustomers: { label: 'Serviced Customers', target: 1700, actual: 1430, unit: 'Customers' },
    transactionValue:  { label: 'Transaction Value',  target: 350000, actual: 271000, unit: 'ZMW' },
    visits:            { label: 'Team Visits',        target: 280,  actual: 241,  unit: 'Visits' },
    brandingCompliance:{ label: 'Branding Compliance', target: 70,  actual: 58,   unit: 'Audits' },
  },
  {
    tlId: 'TL-10033', tlName: 'Angela Musonda', teamName: 'Lusaka East Beta', tdrId: 'TDR-30041',
    totalDSA:          { label: 'Total DSA',          target: 25,   actual: 22,   unit: 'Agents' },
    activeDSA:         { label: 'Active DSA',         target: 22,   actual: 18,   unit: 'Agents' },
    dsaActivityRate:   { label: 'DSA Activity Rate',  target: 85,   actual: 72,   unit: '%' },
    grossAdditions:    { label: 'Gross Additions',    target: 700,  actual: 536,  unit: 'SIMs' },
    gaConversion:      { label: 'GA Conversion',      target: 75,   actual: 61,   unit: '%' },
    momoGA:            { label: 'MoMo GA',            target: 280,  actual: 196,  unit: 'Users' },
    momoGAConversion:  { label: 'MoMo GA Conversion', target: 60,   actual: 48,   unit: '%' },
    agentRecruitment:  { label: 'Agent Recruitment',  target: 10,   actual: 6,    unit: 'Agents' },
    cashAvailability:  { label: 'Cash Availability',  target: 70000, actual: 52000, unit: 'ZMW' },
    floatAvailability: { label: 'Float Availability',  target: 110000, actual: 86000, unit: 'ZMW' },
    servicedCustomers: { label: 'Serviced Customers', target: 1700, actual: 1280, unit: 'Customers' },
    transactionValue:  { label: 'Transaction Value',  target: 350000, actual: 248000, unit: 'ZMW' },
    visits:            { label: 'Team Visits',        target: 280,  actual: 218,  unit: 'Visits' },
    brandingCompliance:{ label: 'Branding Compliance', target: 70,  actual: 52,   unit: 'Audits' },
  },
];

// ═══════════════════════════════════════════════════════════════════
// ASE DAILY TARGETS (Set by TL — field-level execution)
// Fresh day starts at 0 for each KPI
// ═══════════════════════════════════════════════════════════════════

export const ASE_DAILY_TARGETS: AseTargets[] = [
  {
    aseId: 'ASE-20241', aseName: 'Mwape Banda', tlId: 'TL-10032', date: 'Today',
    totalDSA:            { label: 'Total DSA',            target: 6,     actual: 6,   unit: 'Agents' },
    activeDSA:           { label: 'Active DSA',           target: 5,     actual: 4,   unit: 'Agents' },
    transactingAgents:   { label: 'Transacting Agents',   target: 4,     actual: 3,   unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',      target: 20,    actual: 0,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',              target: 8,     actual: 0,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',    target: 1,     actual: 0,   unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment', target: 1,     actual: 0,   unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',    target: 5000,  actual: 0,   unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',   target: 8000,  actual: 0,   unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',   target: 15,    actual: 0,   unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',    target: 25000, actual: 0,   unit: 'ZMW' },
    visits:              { label: 'Outlet Visits',        target: 10,    actual: 0,   unit: 'Visits' },
    brandingChecks:      { label: 'Branding Checks',      target: 5,     actual: 0,   unit: 'Audits' },
  },
  {
    aseId: 'ASE-20242', aseName: 'Chisomo Kunda', tlId: 'TL-10032', date: 'Today',
    totalDSA:            { label: 'Total DSA',            target: 5,     actual: 5,   unit: 'Agents' },
    activeDSA:           { label: 'Active DSA',           target: 4,     actual: 3,   unit: 'Agents' },
    transactingAgents:   { label: 'Transacting Agents',   target: 3,     actual: 2,   unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',      target: 20,    actual: 0,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',              target: 8,     actual: 0,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',    target: 1,     actual: 0,   unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment', target: 1,     actual: 0,   unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',    target: 5000,  actual: 0,   unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',   target: 8000,  actual: 0,   unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',   target: 15,    actual: 0,   unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',    target: 25000, actual: 0,   unit: 'ZMW' },
    visits:              { label: 'Outlet Visits',        target: 10,    actual: 0,   unit: 'Visits' },
    brandingChecks:      { label: 'Branding Checks',      target: 5,     actual: 0,   unit: 'Audits' },
  },
  {
    aseId: 'ASE-20243', aseName: 'Priya Nambwe', tlId: 'TL-10032', date: 'Today',
    totalDSA:            { label: 'Total DSA',            target: 5,     actual: 5,   unit: 'Agents' },
    activeDSA:           { label: 'Active DSA',           target: 4,     actual: 3,   unit: 'Agents' },
    transactingAgents:   { label: 'Transacting Agents',   target: 3,     actual: 2,   unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',      target: 20,    actual: 0,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',              target: 8,     actual: 0,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',    target: 1,     actual: 0,   unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment', target: 1,     actual: 0,   unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',    target: 5000,  actual: 0,   unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',   target: 8000,  actual: 0,   unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',   target: 15,    actual: 0,   unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',    target: 25000, actual: 0,   unit: 'ZMW' },
    visits:              { label: 'Outlet Visits',        target: 10,    actual: 0,   unit: 'Visits' },
    brandingChecks:      { label: 'Branding Checks',      target: 5,     actual: 0,   unit: 'Audits' },
  },
  {
    aseId: 'ASE-20244', aseName: 'Tiza Mwale', tlId: 'TL-10032', date: 'Today',
    totalDSA:            { label: 'Total DSA',            target: 5,     actual: 5,   unit: 'Agents' },
    activeDSA:           { label: 'Active DSA',           target: 4,     actual: 2,   unit: 'Agents' },
    transactingAgents:   { label: 'Transacting Agents',   target: 3,     actual: 1,   unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',      target: 20,    actual: 0,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',              target: 8,     actual: 0,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',    target: 1,     actual: 0,   unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment', target: 1,     actual: 0,   unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',    target: 5000,  actual: 0,   unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',   target: 8000,  actual: 0,   unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',   target: 15,    actual: 0,   unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',    target: 25000, actual: 0,   unit: 'ZMW' },
    visits:              { label: 'Outlet Visits',        target: 10,    actual: 0,   unit: 'Visits' },
    brandingChecks:      { label: 'Branding Checks',      target: 5,     actual: 0,   unit: 'Audits' },
  },
  {
    aseId: 'ASE-20245', aseName: 'Brian Nkosi', tlId: 'TL-10032', date: 'Today',
    totalDSA:            { label: 'Total DSA',            target: 4,     actual: 4,   unit: 'Agents' },
    activeDSA:           { label: 'Active DSA',           target: 3,     actual: 2,   unit: 'Agents' },
    transactingAgents:   { label: 'Transacting Agents',   target: 3,     actual: 1,   unit: 'Agents' },
    grossAdditions:      { label: 'Gross Additions',      target: 20,    actual: 0,   unit: 'SIMs' },
    momoGA:              { label: 'MoMo GA',              target: 8,     actual: 0,   unit: 'Users' },
    agentRecruitment:    { label: 'Agent Recruitment',    target: 1,     actual: 0,   unit: 'Agents' },
    merchantRecruitment: { label: 'Merchant Recruitment', target: 1,     actual: 0,   unit: 'Merchants' },
    cashAvailability:    { label: 'Cash Availability',    target: 5000,  actual: 0,   unit: 'ZMW' },
    floatAvailability:   { label: 'Float Availability',   target: 8000,  actual: 0,   unit: 'ZMW' },
    servicedCustomers:   { label: 'Serviced Customers',   target: 15,    actual: 0,   unit: 'Customers' },
    transactionValue:    { label: 'Transaction Value',    target: 25000, actual: 0,   unit: 'ZMW' },
    visits:              { label: 'Outlet Visits',        target: 10,    actual: 0,   unit: 'Visits' },
    brandingChecks:      { label: 'Branding Checks',      target: 5,     actual: 0,   unit: 'Audits' },
  },
];

// ─── AGENT FLOAT DATA (Rebalancer) ────────────────────────────────

export const AGENT_FLOAT_DATA: AgentFloat[] = [
  { agentId: 'AG-001', agentName: 'Lusaka Central Agent', location: 'Cairo Road, Lusaka', region: 'Lusaka', floatBalance: 18500, floatTarget: 20000, lastRebalanced: '2h ago', status: 'Healthy', transactionsToday: 42, liquidityScore: 92, minThreshold: 5000, currentFloat: 18500, depletionRate: '200 K/hr', timeToStockout: '68 hrs', isDormant: false, lastCashCheck: 12000, lastStockCheck: '10:15 AM' },
  { agentId: 'AG-002', agentName: 'Kitwe Plaza Agent', location: 'Oxford St, Kitwe', region: 'Copperbelt', floatBalance: 3200, floatTarget: 15000, lastRebalanced: '6h ago', status: 'Near Stockout', transactionsToday: 28, liquidityScore: 21, minThreshold: 4000, currentFloat: 3200, depletionRate: '800 K/hr', timeToStockout: '4 hrs', isDormant: false, lastCashCheck: 1500, lastStockCheck: '09:45 AM' },
  { agentId: 'AG-003', agentName: 'Ndola Central MoMo', location: 'President Ave', region: 'Copperbelt', floatBalance: 800, floatTarget: 12000, lastRebalanced: '1d ago', status: 'Stockout', transactionsToday: 5, liquidityScore: 7, minThreshold: 3000, currentFloat: 800, depletionRate: '150 K/hr', timeToStockout: '0 hrs', isDormant: false, lastCashCheck: 200, lastStockCheck: 'Yesterday' },
  { agentId: 'AG-004', agentName: 'Kabwe Retail Hub', location: 'Independence Ave', region: 'Central', floatBalance: 22000, floatTarget: 18000, lastRebalanced: '1h ago', status: 'Healthy', transactionsToday: 61, liquidityScore: 97, minThreshold: 5000, currentFloat: 22000, depletionRate: '400 K/hr', timeToStockout: '55 hrs', isDormant: false, lastCashCheck: 18000, lastStockCheck: '11:00 AM' },
  { agentId: 'AG-005', agentName: 'Livingstone Gateway', location: 'Mosi-oa-Tunya Rd', region: 'Southern', floatBalance: 6800, floatTarget: 15000, lastRebalanced: '4h ago', status: 'Near Stockout', transactionsToday: 14, liquidityScore: 45, minThreshold: 4000, currentFloat: 6800, depletionRate: '300 K/hr', timeToStockout: '22 hrs', isDormant: false, lastCashCheck: 5400, lastStockCheck: '10:30 AM' },
  { agentId: 'AG-006', agentName: 'Chipata East Agent', location: 'Great East Rd', region: 'Eastern', floatBalance: 14200, floatTarget: 14000, lastRebalanced: '3h ago', status: 'Healthy', transactionsToday: 33, liquidityScore: 86, minThreshold: 3500, currentFloat: 14200, depletionRate: '250 K/hr', timeToStockout: '56 hrs', isDormant: false, lastCashCheck: 11000, lastStockCheck: '09:00 AM' },
  { agentId: 'AG-007', agentName: 'Kasama North Retail', location: 'Mbala Rd, Kasama', region: 'Northern', floatBalance: 0, floatTarget: 10000, lastRebalanced: '2d ago', status: 'Dormant', transactionsToday: 0, liquidityScore: 0, minThreshold: 3000, currentFloat: 0, depletionRate: '0 K/hr', timeToStockout: 'N/A', isDormant: true, lastCashCheck: 0, lastStockCheck: '2d ago' },
  { agentId: 'AG-008', agentName: 'Mansa Central MoMo', location: 'Chitambo St, Mansa', region: 'Luapula', floatBalance: 9800, floatTarget: 12000, lastRebalanced: '5h ago', status: 'Healthy', transactionsToday: 19, liquidityScore: 72, minThreshold: 3000, currentFloat: 9800, depletionRate: '200 K/hr', timeToStockout: '49 hrs', isDormant: false, lastCashCheck: 8500, lastStockCheck: '11:15 AM' },
];

// ─── SYSTEM USERS (IT Admin) ──────────────────────────────────────

export const SYSTEM_USERS: SystemUser[] = [
  { id: 'ASE-20241', name: 'Mwape Banda', email: 'mwape.banda@zamtel.zm', role: 'ASE', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 08:12', deviceImei: '355678901234567', addedBy: 'TL-10032', addedDate: '2026-01-10' },
  { id: 'ASE-20242', name: 'Chisomo Kunda', email: 'chisomo.kunda@zamtel.zm', role: 'ASE', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 07:55', deviceImei: '355678901234568', addedBy: 'TL-10032', addedDate: '2026-01-10' },
  { id: 'ASE-20243', name: 'Priya Nambwe', email: 'priya.nambwe@zamtel.zm', role: 'ASE', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 09:02', deviceImei: '355678901234569', addedBy: 'TL-10032', addedDate: '2026-01-15' },
  { id: 'ASE-20244', name: 'Tiza Mwale', email: 'tiza.mwale@zamtel.zm', role: 'ASE', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 08:40', deviceImei: '355678901234570', addedBy: 'TL-10032', addedDate: '2026-02-01' },
  { id: 'ASE-20245', name: 'Brian Nkosi', email: 'brian.nkosi@zamtel.zm', role: 'ASE', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 10:20', deviceImei: '355678901234571', addedBy: 'TL-10032', addedDate: '2026-02-01' },
  { id: 'TL-10032', name: 'Brian Phiri', email: 'brian.phiri@zamtel.zm', role: 'TL', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 07:00', addedBy: 'TDR-30041', addedDate: '2025-11-01' },
  { id: 'TL-10033', name: 'Angela Musonda', email: 'angela.musonda@zamtel.zm', role: 'TL', region: 'Lusaka', territory: 'Lusaka Central', geoFenceAssigned: true, status: 'Active', lastLogin: '2026-04-01 06:45', addedBy: 'TDR-30041', addedDate: '2025-11-01' },
  { id: 'TDR-30041', name: 'Sarah Mwale', email: 'sarah.mwale@zamtel.zm', role: 'TDR', region: 'Lusaka', territory: 'Lusaka East', geoFenceAssigned: false, status: 'Active', lastLogin: '2026-04-01 06:30', addedBy: 'ADMIN-00001', addedDate: '2025-10-01' },
  { id: 'ZBM-50004', name: 'Executive Director', email: 'exec.dir@zamtel.zm', role: 'ZBM', region: 'National', territory: 'Zambia South', geoFenceAssigned: false, status: 'Active', lastLogin: '2026-04-01 06:00', addedBy: 'ADMIN-00001', addedDate: '2025-09-01' },
  { id: 'REB-70012', name: 'John Rebalancer', email: 'john.r@zamtel.zm', role: 'REBALANCER', region: 'Lusaka', territory: 'Lusaka CBD', geoFenceAssigned: false, status: 'Active', lastLogin: '2026-04-01 07:15', addedBy: 'ADMIN-00001', addedDate: '2025-10-15' },
  { id: 'ADMIN-00001', name: 'System Admin', email: 'admin@zamtel.zm', role: 'ADMIN', region: 'National', territory: 'Global', geoFenceAssigned: false, status: 'Active', lastLogin: '2026-04-01 06:00', addedBy: 'SYSTEM', addedDate: '2025-01-01' },
];

// ─── AUDIT LOG ────────────────────────────────────────────────────

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'AUD-001', timestamp: '2026-04-01 10:42', userId: 'ASE-20245', userName: 'Brian Nkosi', role: 'ASE', action: 'Geo-fence Violation', target: 'Cairo Road Mall', details: '3.2km outside assigned zone', severity: 'Critical' },
  { id: 'AUD-002', timestamp: '2026-04-01 10:38', userId: 'ASE-20244', userName: 'Tiza Mwale', role: 'ASE', action: 'Route Deviation', target: 'Copperbelt MoMo', details: '28% off planned route', severity: 'Warning' },
  { id: 'AUD-003', timestamp: '2026-04-01 10:15', userId: 'ASE-20243', userName: 'Priya Nambwe', role: 'ASE', action: 'Missed Visit', target: 'Kabwe Retail Hub', details: 'No check-in within planned window', severity: 'Warning' },
  { id: 'AUD-004', timestamp: '2026-04-01 09:00', userId: 'TL-10032', userName: 'Brian Phiri', role: 'TL', action: 'Target Assigned', target: 'ASE-20241', details: 'Daily targets set: 10 visits, 20 SIMs', severity: 'Info' },
  { id: 'AUD-005', timestamp: '2026-04-01 08:30', userId: 'TDR-30041', userName: 'Sarah Mwale', role: 'TDR', action: 'Team Target Distributed', target: 'TL-10032, TL-10033', details: 'Monthly GA: 700 split across 2 TLs', severity: 'Info' },
  { id: 'AUD-006', timestamp: '2026-04-01 08:00', userId: 'ZBM-50004', userName: 'Exec. Director', role: 'ZBM', action: 'Zone Target Set', target: 'Zambia South Zone', details: 'April targets configured: 5000 GA', severity: 'Info' },
];

// ─── SYSTEM DEVICES (IT Admin — Device Management) ────────────────

export interface SystemDevice {
  imei: string;
  model: string;
  assignedTo: string;
  userId: string;
  status: 'Active' | 'Inactive' | 'Wiped';
  connectivity: 'Online' | 'Offline';
  batteryLevel: number;
  appVersion: string;
  lastActive: string;
}

export const SYSTEM_DEVICES: SystemDevice[] = [
  { imei: '355678901234567', model: 'Samsung Galaxy A14', assignedTo: 'Mwape Banda', userId: 'ASE-20241', status: 'Active', connectivity: 'Online', batteryLevel: 72, appVersion: '2.4.1', lastActive: '10:45 AM' },
  { imei: '355678901234568', model: 'Tecno Spark 10', assignedTo: 'Chisomo Kunda', userId: 'ASE-20242', status: 'Active', connectivity: 'Online', batteryLevel: 54, appVersion: '2.4.1', lastActive: '11:15 AM' },
  { imei: '355678901234569', model: 'Nokia G21', assignedTo: 'Priya Nambwe', userId: 'ASE-20243', status: 'Active', connectivity: 'Online', batteryLevel: 31, appVersion: '2.4.0', lastActive: '10:15 AM' },
  { imei: '355678901234570', model: 'Itel A58', assignedTo: 'Tiza Mwale', userId: 'ASE-20244', status: 'Active', connectivity: 'Offline', batteryLevel: 12, appVersion: '2.3.8', lastActive: '10:38 AM' },
  { imei: '355678901234571', model: 'Samsung Galaxy A04e', assignedTo: 'Brian Nkosi', userId: 'ASE-20245', status: 'Active', connectivity: 'Online', batteryLevel: 89, appVersion: '2.4.1', lastActive: '10:42 AM' },
  { imei: '355678901234572', model: 'Tecno Pop 7', assignedTo: 'Brian Phiri', userId: 'TL-10032', status: 'Active', connectivity: 'Online', batteryLevel: 65, appVersion: '2.4.1', lastActive: '07:00 AM' },
];
