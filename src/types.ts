export type UserRole = 'REBALANCER' | 'ZBM' | 'TDR' | 'TL' | 'ASE' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  territory?: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  category: 'Mobile Money' | 'Retail' | 'Agent';
  distance: string;
  status: 'Planned' | 'Visited' | 'Missed' | 'Next';
  lat: number;
  lng: number;
}

export interface VisitData {
  outletId: string;
  checkInTime: string;
  checkOutTime?: string;
  purpose: string[];
  simsRegistered: number;
  agentsRecruited?: number;
  activationsLogged?: number;
  // Agent Recruitment details
  agentName?: string;
  agentPhone?: string;
  agentLocation?: string;
  // Prospecting (FR23)
  customerType?: 'Individual' | 'Retailer' | 'SME' | 'Corporate';
  productPitched?: string;
  interestLevel?: 'Low' | 'Medium' | 'High';
  followUpDate?: string;
  contactDetails?: string;
  newProspects?: number;
  // Stock Management
  stockLevel?: 'Adequate' | 'Low' | 'Out of Stock';
  stockNotes?: string;
  // Execution & Compliance (FR18, FR8)
  floatAmount: number;
  cashAdequate: boolean;
  brandingCompliant: 'Yes' | 'No' | 'Partial';
  pricingCompliant: boolean;
  photoCaptured: boolean;
  manualLocation: boolean;
  competitors: string[];
  competitorOffers?: string;
  riskFlags?: string[];
  serviceIssues?: string;
  customerFeedback?: string;
  photoUrl?: string;
  notes: string;
  gpsCoordinates?: { lat: number; lng: number };
  reasonForMissedVisit?: string;
}

export interface AseStatus {
  id: string;
  name: string;
  progress: number; // 0-100
  status: 'Active' | 'Offline' | 'Completed';
  lastCheckIn?: string;
  currentOutlet?: string;
  exceptions: number;
  simsToday?: number;
  visitsToday?: number;
  visitsTarget?: number;
  simsTarget?: number;
}

export interface Exception {
  id: string;
  aseId: string;
  aseName: string;
  type: 'Geo-fence Violation' | 'Route Deviation' | 'Offline Entry' | 'Missed Visit';
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  outletName?: string;
}

// Re-export from kpiStore for convenience
export type {
  KpiTarget,
  ZoneTargets,
  TerritoryTargets,
  TeamTargets,
  AseTargets,
  AgentFloat,
  SystemUser,
  SystemDevice,
  AuditEntry,
} from './data/kpiStore';
