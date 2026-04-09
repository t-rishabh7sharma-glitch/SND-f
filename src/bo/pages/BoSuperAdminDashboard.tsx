import React, { useState } from 'react';
import {
  Activity,
  Database,
  Server,
  ShieldCheck,
  Wifi,
  ChevronRight,
  KeyRound,
  Users,
  FileText,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import BoPageHeader from '../components/BoPageHeader';
import BoDrillDownPanel, {
  BoDrillMetric,
  BoDrillMetricGrid,
  BoDrillMiniBars,
  BoDrillSection,
  type BoDrillStatus,
} from '../components/BoDrillDownPanel';

type ServiceRow = { name: string; status: string; tone: string; detail: string; drillStatus: BoDrillStatus };

type CardDrillContent = {
  title: string;
  status: BoDrillStatus;
  summary: string;
  metrics: { label: string; value: string; hint?: string; highlight?: boolean }[];
  bars: number[];
  checklist: string[];
  dependencies: string[];
  events: { time: string; text: string; tone: 'ok' | 'warn' | 'info' }[];
};

type ServiceDrillContent = {
  description: string;
  metrics: { label: string; value: string; hint?: string; highlight?: boolean }[];
  bars: number[];
  dependencies: string[];
  owners: { name: string; role: string }[];
  events: { time: string; text: string; tone: 'ok' | 'warn' | 'info' }[];
  runbookUrl?: string;
};

const CARD_DRILL: Record<string, CardDrillContent> = {
  'API availability': {
    title: 'API availability',
    status: 'healthy',
    summary: 'Synthetic probes every 60s from edge POPs; aggregates to this score.',
    metrics: [
      { label: 'Rolling 30d', value: '99.97%', hint: 'vs SLO 99.9%', highlight: true },
      { label: 'Incidents (30d)', value: '2', hint: 'both under 5m MTTR' },
      { label: 'Regions green', value: '3/3', hint: 'EU · APAC · local' },
      { label: 'P95 latency', value: '118ms', hint: 'read path' },
      { label: 'Error budget left', value: '41%', hint: 'monthly' },
      { label: 'Last deploy', value: '4d ago', hint: 'canary OK' },
    ],
    bars: [72, 88, 91, 85, 94, 97, 99, 100, 99, 98, 99, 97],
    checklist: ['PagerDuty if 5xx exceeds 1% for 5m', 'Status page auto-updates', 'Post-incident review template'],
    dependencies: ['Auth cluster', 'Edge CDN', 'Certificate issuer'],
    events: [
      { time: '09:12', text: 'Probe EU-West — 200 OK (42ms)', tone: 'ok' },
      { time: '08:40', text: 'Synthetic retry on /healthz (transient)', tone: 'info' },
      { time: 'Yesterday', text: 'SLO report exported to exec digest', tone: 'info' },
    ],
  },
  'Integration jobs': {
    title: 'Integration jobs',
    status: 'healthy',
    summary: 'Worker fleet processing HR, territory, and MDM sync with DLQ safeguards.',
    metrics: [
      { label: 'Active workers', value: '12', hint: '3 scaling', highlight: true },
      { label: 'Queued', value: '3', hint: 'normal backlog' },
      { label: 'Failed (24h)', value: '0', hint: 'DLQ empty' },
      { label: 'Throughput', value: '4.2k/h', hint: 'jobs completed' },
      { label: 'Oldest job', value: '2m', hint: 'within SLA' },
      { label: 'Schema ver', value: 'v18', hint: 'migrations aligned' },
    ],
    bars: [45, 52, 48, 61, 55, 70, 65, 58, 62, 55, 48, 44],
    checklist: ['Idempotent handlers', 'DLQ replay admin-only', 'Dead letter alerts to #integrations'],
    dependencies: ['Postgres primary', 'Redis queue', 'MDM vendor API'],
    events: [
      { time: '10:02', text: 'Territory delta batch — 1,204 rows applied', tone: 'ok' },
      { time: '09:15', text: 'HR feed checksum validated', tone: 'ok' },
      { time: 'Mon', text: 'Worker pool scaled +2 (scheduled)', tone: 'info' },
    ],
  },
  'Policy version': {
    title: 'RBAC policy bundle',
    status: 'neutral',
    summary: 'Immutable signed bundle distributed to BO and field gateways.',
    metrics: [
      { label: 'Deployed version', value: 'v2.4.1', hint: 'prod', highlight: true },
      { label: 'Staged', value: 'v2.5.0-rc1', hint: '10% canary' },
      { label: 'Signatures', value: 'Valid', hint: 'cosign + internal CA' },
      { label: 'Tenants updated', value: '48/48', hint: 'last 6h' },
      { label: 'Rollback target', value: 'v2.4.0', hint: 'one-click' },
      { label: 'Policy rules', value: '312', hint: 'compiled' },
    ],
    bars: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    checklist: ['Signed artifacts only', 'Canary before full push', 'Audit trail on override'],
    dependencies: ['Artifact registry', 'Config service', 'Edge agents'],
    events: [
      { time: '06:00', text: 'Nightly bundle diff — no drift', tone: 'ok' },
      { time: 'Tue', text: 'v2.4.1 promoted to all regions', tone: 'info' },
    ],
  },
  'Data sync lag': {
    title: 'Data sync lag',
    status: 'healthy',
    summary: 'Warehouse freshness for visits, float events, and accruals feeding BO analytics.',
    metrics: [
      { label: 'Current lag', value: '42s', hint: 'P95 pipeline', highlight: true },
      { label: 'SLO target', value: '< 2m', hint: 'P95' },
      { label: 'Backfill', value: 'Idle', hint: 'no active job' },
      { label: 'Rows / min', value: '18.4k', hint: 'ingest' },
      { label: 'DLQ events', value: '0', hint: '24h' },
      { label: 'Last full snapshot', value: 'Sun 02:00', hint: 'scheduled' },
    ],
    bars: [30, 28, 35, 40, 38, 42, 45, 40, 38, 35, 32, 28],
    checklist: ['Lag alert after 3m', 'Auto back-pressure on broker', 'Manual refresh = break-glass'],
    dependencies: ['Kafka / bus', 'Snowflake / WH', 'dbt transforms'],
    events: [
      { time: '10:18', text: 'Visit fact table — incremental OK', tone: 'ok' },
      { time: '09:55', text: 'Float stream watermark advanced', tone: 'ok' },
    ],
  },
};

const SERVICE_DRILL: Record<string, ServiceDrillContent & { status: BoDrillStatus }> = {
  'Auth & SSO bridge': {
    status: 'healthy',
    description: 'OIDC to corporate IdP; short-lived access tokens for BO console and field apps with refresh rotation.',
    metrics: [
      { label: 'P95 auth latency', value: '120ms', hint: 'token endpoint', highlight: true },
      { label: 'Success rate', value: '99.98%', hint: '24h' },
      { label: 'Active sessions', value: '1,284', hint: 'approx' },
      { label: 'Token TTL', value: '15m', hint: 'access' },
      { label: 'Failed logins', value: '12', hint: '24h · investigated' },
      { label: 'Cert expiry', value: '87d', hint: 'wildcard' },
    ],
    bars: [82, 78, 85, 88, 90, 87, 92, 91, 89, 93, 95, 94],
    dependencies: ['Corporate IdP', 'HSM / key vault', 'API gateway'],
    owners: [
      { name: 'Platform SRE', role: 'Primary on-call' },
      { name: 'Identity squad', role: 'App owner' },
    ],
    events: [
      { time: '10:22', text: 'JWKS rotation — zero failed validations', tone: 'ok' },
      { time: '08:10', text: 'Elevated login attempts — geo allowlist applied', tone: 'info' },
      { time: 'Mon', text: 'Pen-test remediation — cookie flags', tone: 'ok' },
    ],
  },
  'Provisioning API': {
    status: 'healthy',
    description: 'User lifecycle, territory assignment, and MDM profile pushes with optimistic locking.',
    metrics: [
      { label: 'Requests / h', value: '842', hint: 'steady' },
      { label: 'Error rate', value: '0.02%', hint: '24h', highlight: true },
      { label: 'p99 latency', value: '340ms', hint: 'write path' },
      { label: 'Pending approvals', value: '7', hint: 'workflow' },
      { label: 'Retries', value: '1.2%', hint: 'auto-retry' },
      { label: 'Version', value: 'api/3.2', hint: 'deployed' },
    ],
    bars: [70, 72, 68, 75, 80, 78, 82, 85, 83, 80, 78, 76],
    dependencies: ['Auth service', 'Postgres', 'MDM connector'],
    owners: [{ name: 'Core services', role: 'Owner' }],
    events: [
      { time: '09:48', text: 'Bulk territory patch — 56 users updated', tone: 'ok' },
      { time: '08:00', text: 'Rate limit tuned for batch job', tone: 'info' },
    ],
  },
  'KPI definition store': {
    status: 'degraded',
    description: 'Catalog backing the KPI engine; read path stable — writes paused during schema migration.',
    metrics: [
      { label: 'Read availability', value: '100%', hint: 'serving', highlight: true },
      { label: 'Write mode', value: 'RO', hint: 'migration' },
      { label: 'ETA', value: '~45m', hint: 'estimated' },
      { label: 'Definitions', value: '21', hint: 'published' },
      { label: 'Drafts', value: '3', hint: 'queued post-cutover' },
      { label: 'Consumers', value: '6', hint: 'dashboard apps' },
    ],
    bars: [95, 94, 92, 88, 70, 55, 48, 52, 58, 62, 65, 68],
    dependencies: ['Postgres', 'Config bus', 'BO KPI engine UI'],
    owners: [{ name: 'Data platform', role: 'Migration lead' }],
    events: [
      { time: '10:05', text: 'Migration step 3/5 — column backfill running', tone: 'warn' },
      { time: '09:30', text: 'Admin UI: save disabled banner shown', tone: 'info' },
    ],
  },
  'Territory registry': {
    status: 'healthy',
    description: 'Authoritative polygons, territory hierarchy, and geo keys for routing and geo-fence evaluation.',
    metrics: [
      { label: 'Polygons', value: '2,891', hint: 'active', highlight: true },
      { label: 'Replica lag', value: '180ms', hint: 'read replicas' },
      { label: 'Invalidations / h', value: '14', hint: 'CDN + edge' },
      { label: 'API QPS', value: '1.1k', hint: 'peak hour' },
      { label: 'Last topology change', value: '2d', hint: 'approved CR' },
      { label: 'Version hash', value: 'a3f9…c21', hint: 'registry' },
    ],
    bars: [88, 90, 89, 91, 92, 90, 93, 94, 93, 92, 94, 95],
    dependencies: ['PostGIS', 'Object storage', 'Geo CDN'],
    owners: [{ name: 'S&D ops tooling', role: 'Data steward' }],
    events: [
      { time: 'Yesterday', text: 'Route group ME-14 split — propagation complete', tone: 'ok' },
      { time: 'Mon', text: 'Snapshot export to analytics WH', tone: 'info' },
    ],
  },
};

function ServiceIcon({ name }: { name: string }) {
  if (name.includes('Auth')) return <KeyRound className="text-bo-primary" size={24} />;
  if (name.includes('Provisioning')) return <Users className="text-bo-primary" size={24} />;
  if (name.includes('KPI')) return <Activity className="text-bo-primary" size={24} />;
  if (name.includes('Territory')) return <Server className="text-bo-primary" size={24} />;
  return <Server className="text-bo-primary" size={24} />;
}

function eventDot(tone: 'ok' | 'warn' | 'info') {
  if (tone === 'ok') return 'bg-emerald-500';
  if (tone === 'warn') return 'bg-amber-500';
  return 'bg-bo-primary';
}

export default function BoSuperAdminDashboard() {
  const [cardKey, setCardKey] = useState<string | null>(null);
  const [serviceKey, setServiceKey] = useState<string | null>(null);

  const cards = [
    { key: 'API availability', label: 'API availability', value: '99.97%', sub: 'Last 30 days', icon: Wifi },
    { key: 'Integration jobs', label: 'Integration jobs', value: '12', sub: '3 queued · 0 failed', icon: Activity },
    { key: 'Policy version', label: 'Policy version', value: 'v2.4.1', sub: 'RBAC bundle deployed', icon: ShieldCheck },
    { key: 'Data sync lag', label: 'Data sync lag', value: '42s', sub: 'Within SLO', icon: Database },
  ];

  const services: ServiceRow[] = [
    { name: 'Auth & SSO bridge', status: 'Operational', tone: 'text-emerald-700 bg-emerald-50', detail: 'Latency P95 120ms', drillStatus: 'healthy' },
    { name: 'Provisioning API', status: 'Operational', tone: 'text-emerald-700 bg-emerald-50', detail: '0 errors / 1h', drillStatus: 'healthy' },
    { name: 'KPI definition store', status: 'Degraded', tone: 'text-amber-800 bg-amber-50', detail: 'Migration window', drillStatus: 'degraded' },
    { name: 'Territory registry', status: 'Operational', tone: 'text-emerald-700 bg-emerald-50', detail: 'Replicas healthy', drillStatus: 'healthy' },
  ];

  const drillCard = cardKey ? CARD_DRILL[cardKey] : null;
  const drillSvc = serviceKey ? SERVICE_DRILL[serviceKey] : null;

  const cardIcon = (k: string) => {
    const c = cards.find((x) => x.key === k);
    if (!c) return null;
    const I = c.icon;
    return <I size={24} />;
  };

  const drillFooter = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-bo-secondary shadow-sm transition hover:border-bo-primary/40 hover:bg-bo-surface min-w-[120px]"
      >
        <BookOpen size={14} className="text-bo-primary" />
        Runbook
      </button>
      <button
        type="button"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-bo-secondary shadow-sm transition hover:border-bo-primary/40 hover:bg-bo-surface min-w-[120px]"
      >
        <FileText size={14} className="text-bo-primary" />
        Logs
      </button>
      <button
        type="button"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-bo-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 min-w-[120px]"
      >
        <ExternalLink size={14} />
        Open monitor
      </button>
    </div>
  );

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <BoPageHeader title="Control center" breadcrumbs={['Back office', 'Dashboard']} />

      <p className="text-sm text-bo-muted">
        Platform health at a glance. Open any tile or service for structured metrics, trend strip, dependencies, and recent signals.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, label, value, sub, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setCardKey(key)}
            className="bo-card group w-full p-6 text-left transition hover:border-bo-primary/30 hover:shadow-lg"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-bo-primary/10 text-bo-secondary">
              <Icon size={20} className="text-bo-primary" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-bo-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold text-black">{value}</p>
            <p className="mt-1 text-xs text-bo-muted">{sub}</p>
            <ChevronRight size={16} className="mt-3 text-bo-primary opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <div className="bo-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Platform services</h2>
          <Server size={20} className="text-bo-primary" />
        </div>
        <ul className="divide-y divide-black/5">
          {services.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => setServiceKey(s.name)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:bg-bo-surface/60 first:pt-0"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-black">{s.name}</span>
                  <p className="text-xs text-bo-muted">{s.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${s.tone}`}>{s.status}</span>
                  <ChevronRight size={16} className="text-bo-primary" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <BoDrillDownPanel
        open={!!drillCard}
        onClose={() => setCardKey(null)}
        title={drillCard?.title ?? ''}
        subtitle="Control center"
        status={drillCard?.status ?? 'neutral'}
        headerIcon={cardKey ? cardIcon(cardKey) : null}
        footer={drillFooter}
        widthClassName="max-w-lg sm:max-w-xl"
      >
        {drillCard && (
          <div className="space-y-8">
            <p className="text-sm leading-relaxed text-black/80">{drillCard.summary}</p>

            <div>
              <BoDrillSection title="Key metrics" />
              <BoDrillMetricGrid>
                {drillCard.metrics.map((m) => (
                  <div key={m.label}>
                    <BoDrillMetric label={m.label} value={m.value} hint={m.hint} variant={m.highlight ? 'highlight' : 'default'} />
                  </div>
                ))}
              </BoDrillMetricGrid>
            </div>

            <div>
              <BoDrillSection title="12h trend (relative load)" />
              <BoDrillMiniBars values={drillCard.bars} />
            </div>

            <div>
              <BoDrillSection title="Operating checklist" />
              <ul className="space-y-2 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
                {drillCard.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-black/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bo-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <BoDrillSection title="Dependencies" />
              <div className="flex flex-wrap gap-2">
                {drillCard.dependencies.map((d) => (
                  <span key={d} className="rounded-lg border border-bo-primary/20 bg-bo-primary/5 px-3 py-1.5 text-xs font-semibold text-bo-secondary">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <BoDrillSection title="Recent signals" />
              <ul className="space-y-3">
                {drillCard.events.map((e, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${eventDot(e.tone)}`} />
                    <div>
                      <span className="font-mono text-[11px] font-bold text-bo-muted">{e.time}</span>
                      <p className="text-black/85">{e.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </BoDrillDownPanel>

      <BoDrillDownPanel
        open={!!drillSvc && !!serviceKey}
        onClose={() => setServiceKey(null)}
        title={serviceKey ?? ''}
        subtitle="Service health"
        status={drillSvc?.status ?? 'neutral'}
        headerIcon={serviceKey ? <ServiceIcon name={serviceKey} /> : null}
        footer={drillFooter}
        widthClassName="max-w-lg sm:max-w-xl"
      >
        {drillSvc && (
          <div className="space-y-8">
            <p className="text-sm leading-relaxed text-black/80">{drillSvc.description}</p>

            <div>
              <BoDrillSection title="Live indicators" />
              <BoDrillMetricGrid>
                {drillSvc.metrics.map((m) => (
                  <div key={m.label}>
                    <BoDrillMetric label={m.label} value={m.value} hint={m.hint} variant={m.highlight ? 'highlight' : 'default'} />
                  </div>
                ))}
              </BoDrillMetricGrid>
            </div>

            <div>
              <BoDrillSection title="Throughput (12h)" />
              <BoDrillMiniBars
                values={drillSvc.bars}
                accentClassName={drillSvc.status === 'degraded' ? 'bg-amber-500' : 'bg-bo-primary'}
              />
            </div>

            <div>
              <BoDrillSection title="Dependencies" />
              <div className="flex flex-wrap gap-2">
                {drillSvc.dependencies.map((d) => (
                  <span key={d} className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-bo-secondary shadow-sm">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <BoDrillSection title="Ownership" />
              <div className="grid gap-3 sm:grid-cols-2">
                {drillSvc.owners.map((o) => (
                  <div key={o.name} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-bo-primary/20 to-bo-secondary/10 text-sm font-bold text-bo-secondary">
                      {o.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-black">{o.name}</p>
                      <p className="text-xs text-bo-muted">{o.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <BoDrillSection title="Event timeline" />
              <ul className="relative space-y-0 border-l-2 border-bo-primary/15 pl-4">
                {drillSvc.events.map((e, i) => (
                  <li key={i} className="relative pb-5 pl-2 last:pb-0">
                    <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${eventDot(e.tone)}`} />
                    <span className="font-mono text-[11px] font-bold text-bo-muted">{e.time}</span>
                    <p className="text-sm text-black/85">{e.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </BoDrillDownPanel>
    </div>
  );
}
