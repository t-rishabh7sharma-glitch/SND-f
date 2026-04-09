import type { AseStatus, Exception, Outlet, VisitData } from '../types';

export const MOCK_OUTLETS: Outlet[] = [
  { id: 'ZM-101', name: 'Lusaka Central Agent', address: 'Cairo Road, Lusaka', category: 'Agent', distance: '48m', status: 'Next', lat: -15.4167, lng: 28.2833 },
  { id: 'ZM-102', name: 'Kabwe Retail Hub', address: 'Independence Ave, Kabwe', category: 'Retail', distance: '1.2km', status: 'Planned', lat: -14.4469, lng: 28.4464 },
  { id: 'ZM-103', name: 'Copperbelt MoMo', address: 'President Ave, Ndola', category: 'Mobile Money', distance: '2.5km', status: 'Planned', lat: -12.9608, lng: 28.6366 },
  { id: 'ZM-104', name: 'Kitwe Plaza Shop', address: 'Oxford St, Kitwe', category: 'Retail', distance: '3.1km', status: 'Planned', lat: -12.8167, lng: 28.2 },
  { id: 'ZM-105', name: 'Livingstone Gateway', address: 'Mosi-oa-Tunya Rd', category: 'Agent', distance: '4.5km', status: 'Planned', lat: -17.85, lng: 25.85 },
  { id: 'ZM-106', name: 'Chipata East Agent', address: 'Great East Rd, Chipata', category: 'Agent', distance: '5.2km', status: 'Planned', lat: -13.6333, lng: 32.65 },
  { id: 'ZM-107', name: 'Kasama North Retail', address: 'Mbala Rd, Kasama', category: 'Retail', distance: '6.1km', status: 'Planned', lat: -10.2128, lng: 31.1808 },
  { id: 'ZM-108', name: 'Mansa Central', address: 'Chitambo St, Mansa', category: 'Mobile Money', distance: '7.3km', status: 'Planned', lat: -11.1997, lng: 28.8943 },
];

export const MOCK_ASE_STATUSES: AseStatus[] = [
  { id: 'ASE-20241', name: 'Mwape Banda', progress: 85, status: 'Active', lastCheckIn: '10:45 AM', currentOutlet: 'Lusaka Central Agent', exceptions: 0, visitsToday: 8, visitsTarget: 10, simsToday: 21, simsTarget: 20 },
  { id: 'ASE-20242', name: 'Chisomo Kunda', progress: 65, status: 'Active', lastCheckIn: '11:15 AM', currentOutlet: 'Bright Cash Agent', exceptions: 0, visitsToday: 7, visitsTarget: 10, simsToday: 14, simsTarget: 20 },
  { id: 'ASE-20243', name: 'Priya Nambwe', progress: 45, status: 'Active', lastCheckIn: '10:15 AM', currentOutlet: 'Kabwe Retail Hub', exceptions: 1, visitsToday: 5, visitsTarget: 10, simsToday: 9, simsTarget: 20 },
  { id: 'ASE-20244', name: 'Tiza Mwale', progress: 30, status: 'Active', lastCheckIn: '10:38 AM', currentOutlet: 'Copperbelt MoMo', exceptions: 1, visitsToday: 3, visitsTarget: 10, simsToday: 6, simsTarget: 20 },
  { id: 'ASE-20245', name: 'Brian Nkosi', progress: 20, status: 'Active', lastCheckIn: '10:42 AM', currentOutlet: 'Cairo Road Mall', exceptions: 1, visitsToday: 2, visitsTarget: 10, simsToday: 4, simsTarget: 20 },
  { id: 'ASE-20246', name: 'Lweendo Phiri', progress: 100, status: 'Completed', lastCheckIn: '04:30 PM', exceptions: 0, visitsToday: 10, visitsTarget: 10, simsToday: 25, simsTarget: 20 },
  { id: 'ASE-20247', name: 'Namukolo Siame', progress: 0, status: 'Offline', exceptions: 0, visitsToday: 0, visitsTarget: 10, simsToday: 0, simsTarget: 20 },
  { id: 'ASE-20248', name: 'Chanda Mutale', progress: 0, status: 'Offline', exceptions: 0, visitsToday: 0, visitsTarget: 10, simsToday: 0, simsTarget: 20 },
];

export const MOCK_EXCEPTIONS: Exception[] = [
  { id: 'EX-1', aseId: 'ASE-20245', aseName: 'Brian Nkosi', type: 'Geo-fence Violation', severity: 'High', timestamp: '10:42 AM', details: '3.2km outside assigned territory at Cairo Road Mall', status: 'Pending', outletName: 'Cairo Road Mall' },
  { id: 'EX-2', aseId: 'ASE-20244', aseName: 'Tiza Mwale', type: 'Route Deviation', severity: 'Medium', timestamp: '10:38 AM', details: '28% off planned route near Copperbelt MoMo', status: 'Pending', outletName: 'Copperbelt MoMo' },
  { id: 'EX-3', aseId: 'ASE-20243', aseName: 'Priya Nambwe', type: 'Missed Visit', severity: 'Low', timestamp: '10:15 AM', details: 'No check-in at Kabwe Retail Hub within planned window', status: 'Pending', outletName: 'Kabwe Retail Hub' },
];

export const MOCK_VISIT_VALIDATION: VisitData & { aseName: string; outlet: Outlet } = {
  outletId: 'ZM-101',
  aseName: 'Mwape Banda',
  outlet: MOCK_OUTLETS[0],
  checkInTime: '10:45:12 AM',
  purpose: ['Float & cash check', 'SIM registrations', 'Prospecting'],
  simsRegistered: 3,
  floatAmount: 1250,
  cashAdequate: true,
  brandingCompliant: 'Yes',
  pricingCompliant: true,
  photoCaptured: true,
  manualLocation: false,
  competitors: ['MTN', 'Airtel'],
  productPitched: 'MoMo Agent Account',
  customerType: 'Retailer',
  interestLevel: 'High',
  contactDetails: '0977123456',
  notes: 'Agent is performing well. Branding is visible and float is adequate. Pitched MoMo Agent account to nearby retailer.',
};
