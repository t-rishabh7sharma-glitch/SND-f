import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

export type BoDrillStatus = 'healthy' | 'degraded' | 'critical' | 'neutral';

type BoDrillDownPanelProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Wider drawer for dense dashboards */
  widthClassName?: string;
  status?: BoDrillStatus;
  /** Optional icon in header (e.g. service icon) */
  headerIcon?: React.ReactNode;
  /** Sticky footer (actions) */
  footer?: React.ReactNode;
};

const STATUS_STYLES: Record<BoDrillStatus, { chip: string; bar: string; label: string }> = {
  healthy: {
    chip: 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30',
    bar: 'from-emerald-400 to-emerald-600',
    label: 'Healthy',
  },
  degraded: {
    chip: 'bg-amber-500/20 text-amber-100 border border-amber-400/35',
    bar: 'from-amber-400 to-amber-600',
    label: 'Degraded',
  },
  critical: {
    chip: 'bg-red-500/20 text-red-100 border border-red-400/35',
    bar: 'from-red-400 to-red-600',
    label: 'Critical',
  },
  neutral: {
    chip: 'bg-white/10 text-white/90 border border-white/20',
    bar: 'from-bo-primary to-cyan-400',
    label: 'Info',
  },
};

export default function BoDrillDownPanel({
  open,
  title,
  subtitle,
  onClose,
  children,
  widthClassName = 'max-w-xl',
  status = 'neutral',
  headerIcon,
  footer,
}: BoDrillDownPanelProps) {
  const st = STATUS_STYLES[status];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className={`fixed right-0 top-0 z-[70] flex h-full w-full ${widthClassName} flex-col border-l border-black/10 bg-[#f8fafc] shadow-[-12px_0_40px_rgba(0,41,112,0.12)]`}
          >
            <div className="relative shrink-0 overflow-hidden bg-bo-secondary text-white">
              <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${st.bar} opacity-90`} />
              <div className="flex items-start gap-4 px-6 pb-6 pt-6">
                {headerIcon && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-bo-primary ring-1 ring-white/20">
                    {headerIcon}
                  </div>
                )}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${st.chip}`}>{st.label}</span>
                    {subtitle && <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">{subtitle}</span>}
                  </div>
                  <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight">{title}</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">{children}</div>
              {footer && <div className="shrink-0 border-t border-black/5 bg-white px-5 py-4 sm:px-6">{footer}</div>}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Section title inside drill panels */
export function BoDrillSection({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-bo-muted">{title}</h3>
      {action}
    </div>
  );
}

/** Metric tile grid */
export function BoDrillMetricGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>;
}

export function BoDrillMetric({
  label,
  value,
  hint,
  variant = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  variant?: 'default' | 'highlight';
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        variant === 'highlight' ? 'border-bo-primary/25 bg-gradient-to-br from-bo-primary/8 to-white' : 'border-black/5 bg-white shadow-sm'
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-bo-muted">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-bo-secondary">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] text-bo-muted">{hint}</p>}
    </div>
  );
}

/** Simple CSS bar sparkline */
export function BoDrillMiniBars({ values, accentClassName = 'bg-bo-primary' }: { values: number[]; accentClassName?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-14 items-end gap-1 rounded-xl border border-black/5 bg-white px-3 pb-2 pt-3 shadow-sm">
      {values.map((v, i) => (
        <div
          key={i}
          className={`min-w-[6px] flex-1 rounded-sm transition-all ${accentClassName}`}
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, opacity: 0.35 + (v / max) * 0.65 }}
        />
      ))}
    </div>
  );
}
