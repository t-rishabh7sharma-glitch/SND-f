import { Navigate, Route, useNavigate } from 'react-router-dom';
import { getBoPrefix, useSession } from '../context/SessionContext';
import BoSuperAdminDashboard from './pages/BoSuperAdminDashboard';
import BoHierarchyPage from './pages/BoHierarchyPage';
import BoTerritoryPage from './pages/BoTerritoryPage';
import BoKpiEnginePage from './pages/BoKpiEnginePage';
import BoTargetsPage from './pages/BoTargetsPage';
import BoIncentivesPage from './pages/BoIncentivesPage';
import UserManagement from '../components/admin/UserManagement';
import RolePermissions from '../components/admin/RolePermissions';
import InventoryManagement from '../components/admin/InventoryManagement';
import TlDashboard from '../components/tl/TlDashboard';
import LiveMap from '../components/tl/LiveMap';
import ExceptionReview from '../components/tl/ExceptionReview';
import VisitValidation from '../components/tl/VisitValidation';
import TeamKpis from '../components/tl/TeamKpis';
import TeamReports from '../components/tl/TeamReports';
import DailySignoff from '../components/tl/DailySignoff';
import TerritoryCommand from '../components/tdr/TerritoryCommand';
import TeamOversight from '../components/tdr/TeamOversight';
import ReportingEngine from '../components/tdr/ReportingEngine';
import ZonalOverview from '../components/zbm/ZonalOverview';
import KpiAnalytics from '../components/zbm/KpiAnalytics';
import ExecutiveReports from '../components/zbm/ExecutiveReports';
import RebalancerDashboard from '../components/rebalancer/RebalancerDashboard';
import AgentLiquidity from '../components/rebalancer/AgentLiquidity';
import AgentAudit from '../components/rebalancer/AgentAudit';
import SecureTransfer from '../components/rebalancer/SecureTransfer';
import RebalancerReports from '../components/rebalancer/RebalancerReports';
import { useBoData } from '../context/BoDataContext';
import { motion } from 'motion/react';
import { MOCK_VISIT_VALIDATION } from '../data/fieldMocks';
import React, { useEffect } from 'react';

function BoIndexRedirect() {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/bo/${getBoPrefix(user.role)}/dashboard`} replace />;
}

function TlDashboardPage() {
  const { aseStatuses, missedVisitLogs, setSelectedAseForValidation } = useBoData();
  const navigate = useNavigate();
  const { user } = useSession();
  const prefix = getBoPrefix(user!.role);
  return (
    <TlDashboard
      aseStatuses={aseStatuses}
      onSelectAse={(ase) => {
        setSelectedAseForValidation(ase);
        navigate(`/bo/${prefix}/validation`);
      }}
      onSignOff={() => navigate(`/bo/${prefix}/signoff`)}
      missedVisitLogs={missedVisitLogs}
    />
  );
}

function TlVisitValidationPage() {
  const { selectedAseForValidation, setSelectedAseForValidation, aseStatuses, setToast } = useBoData();
  const navigate = useNavigate();
  const { user } = useSession();
  const prefix = getBoPrefix(user!.role);

  if (selectedAseForValidation) {
    return (
      <VisitValidation
        visit={{ ...MOCK_VISIT_VALIDATION, aseName: selectedAseForValidation.name }}
        onApprove={() => {
          setToast({ message: `Visit for ${selectedAseForValidation.name} approved.`, type: 'success' });
          setSelectedAseForValidation(null);
          navigate(`/bo/${prefix}/dashboard`);
        }}
        onFlag={() => {
          setToast({ message: `Visit for ${selectedAseForValidation.name} flagged.`, type: 'error' });
          setSelectedAseForValidation(null);
          navigate(`/bo/${prefix}/dashboard`);
        }}
      />
    );
  }

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-black lg:text-3xl">Visit validation</h1>
        <p className="text-sm text-bo-muted">Select an ASE to review their field execution</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aseStatuses.map((ase) => (
          <motion.div
            key={ase.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedAseForValidation(ase)}
            className="bo-card cursor-pointer p-6 transition hover:border-bo-primary/30"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bo-primary/15 text-sm font-bold text-bo-secondary">
                {ase.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="font-bold text-black transition-colors group-hover:text-bo-primary">{ase.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-bo-muted">{ase.id}</div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-black/5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-bo-muted">Pending review</span>
              <span className="text-xs font-bold text-bo-primary">1 visit</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TlSignoffPage() {
  const { exceptions, setToast } = useBoData();
  const { logout } = useSession();
  const navigate = useNavigate();

  const onSignOff = () => {
    setToast({ message: 'Daily sign-off submitted.', type: 'success' });
    setTimeout(() => {
      logout();
      navigate('/login', { replace: true });
    }, 2000);
  };

  return <DailySignoff onSignOff={onSignOff} pendingExceptions={exceptions.length} />;
}

function withToast<P extends { onAction: (msg: string) => void }>(Component: React.ComponentType<P>) {
  return function Wrapped(props: Omit<P, 'onAction'>) {
    const { setToast } = useBoData();
    return <Component {...(props as P)} onAction={(msg) => setToast({ message: msg, type: 'success' })} />;
  };
}

const TerritoryCommandT = withToast(TerritoryCommand);
const TeamOversightT = withToast(TeamOversight);
const ReportingEngineT = withToast(ReportingEngine);
const ZonalOverviewT = withToast(ZonalOverview);
const KpiAnalyticsT = withToast(KpiAnalytics);
const ExecutiveReportsT = withToast(ExecutiveReports);
const RebalancerDashboardT = withToast(RebalancerDashboard);
const AgentLiquidityT = withToast(AgentLiquidity);
const AgentAuditT = withToast(AgentAudit);
const SecureTransferT = withToast(SecureTransfer);
const RebalancerReportsT = withToast(RebalancerReports);
const TeamReportsT = withToast(TeamReports);

function AdminUsersPage() {
  const { setToast } = useBoData();
  return (
    <div className="max-w-7xl">
      <UserManagement variant="bo" onAction={(msg) => setToast({ message: msg, type: 'success' })} />
    </div>
  );
}

function AdminRolesPage() {
  const { setToast } = useBoData();
  return (
    <div className="max-w-7xl">
      <RolePermissions variant="bo" onAction={(msg) => setToast({ message: msg, type: 'success' })} />
    </div>
  );
}

function AdminInventoryPage() {
  return <InventoryManagement />;
}

function TlMapBridge() {
  const { aseStatuses } = useBoData();
  return <LiveMap aseStatuses={aseStatuses} />;
}

function TlExceptionsBridge() {
  const { exceptions, handleExceptionAction } = useBoData();
  return <ExceptionReview exceptions={exceptions} onAction={handleExceptionAction} />;
}

/** Auto-hide BO toasts */
export function BoToastEffect() {
  const { toast, setToast } = useBoData();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast, setToast]);
  return null;
}

export const boChildRouteElements = (
  <>
    <Route index element={<BoIndexRedirect />} />

    <Route path="admin/dashboard" element={<BoSuperAdminDashboard />} />
    <Route path="admin/hierarchy" element={<BoHierarchyPage />} />
    <Route path="admin/territory" element={<BoTerritoryPage />} />
    <Route path="admin/users" element={<AdminUsersPage />} />
    <Route path="admin/roles" element={<AdminRolesPage />} />
    <Route path="admin/kpis" element={<BoKpiEnginePage />} />
    <Route path="admin/targets" element={<BoTargetsPage />} />
    <Route path="admin/incentives" element={<BoIncentivesPage />} />
    <Route path="admin/inventory" element={<AdminInventoryPage />} />

    <Route path="tl/dashboard" element={<TlDashboardPage />} />
    <Route path="tl/map" element={<TlMapBridge />} />
    <Route
      path="tl/exceptions"
      element={
        <TlExceptionsBridge />
      }
    />
    <Route path="tl/validation" element={<TlVisitValidationPage />} />
    <Route
      path="tl/kpis"
      element={
        <div className="bo-shell max-w-7xl">
          <TeamKpis />
        </div>
      }
    />
    <Route path="tl/reports" element={<TeamReportsT />} />
    <Route path="tl/signoff" element={<TlSignoffPage />} />

    <Route path="tdr/dashboard" element={<TerritoryCommandT />} />
    <Route path="tdr/operations" element={<TeamOversightT />} />
    <Route path="tdr/reports" element={<ReportingEngineT />} />

    <Route path="zbm/dashboard" element={<ZonalOverviewT />} />
    <Route path="zbm/analytics" element={<KpiAnalyticsT />} />
    <Route path="zbm/reports" element={<ExecutiveReportsT />} />

    <Route path="reb/dashboard" element={<RebalancerDashboardT />} />
    <Route path="reb/liquidity" element={<AgentLiquidityT />} />
    <Route path="reb/audit" element={<AgentAuditT />} />
    <Route path="reb/transfer" element={<SecureTransferT />} />
    <Route path="reb/reports" element={<RebalancerReportsT />} />
  </>
);
