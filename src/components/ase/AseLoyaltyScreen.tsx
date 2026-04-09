import React from 'react';
import { ChevronRight, Coins, Gift, Sparkles } from 'lucide-react';
import { FIELD_THEME, field } from './fieldAppTheme';

const TOTAL_POINTS = 1240;
const TIER_PROGRESS_PCT = 68;
const NEXT_TIER_AT = 2000;

const POINTS_TO_CLAIM = [
  {
    id: 'c1',
    points: 150,
    title: 'Complete 3 planned visits',
    expires: '2 days left to claim',
  },
  {
    id: 'c2',
    points: 80,
    title: 'SIM activation streak (5 days)',
    expires: 'Ends Sunday',
  },
  {
    id: 'c3',
    points: 200,
    title: 'Float audit — all outlets green',
    expires: 'Claim by 15 Apr 2026',
  },
];

const REDEEM_OFFERS = [
  { id: 'r1', title: 'Airtime bundle', detail: 'K50 voucher for any Zamtel number', cost: 400 },
  { id: 'r2', title: 'Branded kit', detail: 'T-shirt + lanyard — pick up at depot', cost: 600 },
  { id: 'r3', title: 'Data pack', detail: '5GB valid 30 days', cost: 350 },
  { id: 'r4', title: 'Training credit', detail: 'Online certification course access', cost: 500 },
];

type Props = {
  setToast: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>;
};

export default function AseLoyaltyScreen({ setToast }: Props) {
  const redeemRef = React.useRef<HTMLDivElement>(null);

  const scrollToRedeem = () => {
    redeemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="box-border flex min-h-0 min-w-0 w-full max-w-[100vw] flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 pb-4 pt-3 [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))]"
      style={{ backgroundColor: FIELD_THEME.bg }}
    >
      <div className="w-full min-w-0">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: FIELD_THEME.textMuted }}>
          Rewards
        </p>

        <section
          className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5"
          style={{ background: field.cardGradient, boxShadow: field.shadowElevated }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.06]" />
          <div className="relative px-4 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">Loyalty balance</p>
            <p className="mt-1 text-[clamp(1.75rem,9vw,2.125rem)] font-bold leading-none tracking-tight text-white tabular-nums">
              {TOTAL_POINTS.toLocaleString()}
              <span className="ml-1.5 inline text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold text-white/70 sm:ml-2">
                points
              </span>
            </p>
            <p className="mt-2 text-[clamp(0.75rem,3vw,0.8125rem)] leading-snug text-white/80">
              Silver tier · earn on visits & eligible activities
            </p>
            <div className="mt-4 h-1.5 max-w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full" style={{ width: `${TIER_PROGRESS_PCT}%`, backgroundColor: FIELD_THEME.focus }} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/50">
              <span>
                {TIER_PROGRESS_PCT}% to Gold ({NEXT_TIER_AT.toLocaleString()} pts)
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90">Synced</span>
            </div>
            <button
              type="button"
              onClick={scrollToRedeem}
              className="mt-4 text-[13px] font-semibold text-white/90 underline-offset-2 transition hover:text-white"
            >
              Redeem rewards ›
            </button>
          </div>
        </section>
      </div>

      {/* Points to claim */}
      <section className="mt-5 w-full min-w-0">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: FIELD_THEME.text }}>
            Points to claim
          </h2>
          <button
            type="button"
            className="text-[11px] font-semibold"
            style={{ color: FIELD_THEME.primary }}
            onClick={() => setToast({ message: 'Browse all earn opportunities in the next app update.', type: 'success' })}
          >
            More ways to earn ›
          </button>
        </div>
        <div
          className="space-y-2 rounded-2xl border bg-white p-3 shadow-sm"
          style={{ borderColor: FIELD_THEME.border, boxShadow: field.shadowCard }}
        >
          {POINTS_TO_CLAIM.map((row) => (
            <div
              key={row.id}
              className="flex items-stretch gap-3 rounded-xl border bg-slate-50/50 px-3 py-3"
              style={{ borderColor: FIELD_THEME.border }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Coins size={20} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold" style={{ color: FIELD_THEME.text }}>
                  {row.points} pts · {row.title}
                </div>
                <p className="mt-0.5 text-[11px]" style={{ color: FIELD_THEME.textMuted }}>
                  {row.expires}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 self-center rounded-lg border-2 px-2.5 py-1.5 text-[11px] font-bold transition hover:bg-slate-100"
                style={{ borderColor: FIELD_THEME.primary, color: FIELD_THEME.primary }}
                onClick={() => setToast({ message: `Claim queued: ${row.points} pts`, type: 'success' })}
              >
                Claim
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Redeem your points */}
      <section ref={redeemRef} className="mt-5 w-full min-w-0 scroll-mt-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: FIELD_THEME.text }}>
            Redeem your points
          </h2>
          <button
            type="button"
            className="text-[11px] font-semibold"
            style={{ color: FIELD_THEME.primary }}
            onClick={() => setToast({ message: 'Your coupons will appear here after redemption.', type: 'success' })}
          >
            My rewards ›
          </button>
        </div>
        <div className="-mx-1 flex min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REDEEM_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="w-[min(260px,calc(100vw-2.5rem))] max-w-[85vw] shrink-0 rounded-2xl border bg-white p-4 shadow-sm"
              style={{ borderColor: FIELD_THEME.border }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${FIELD_THEME.primary}18`, color: FIELD_THEME.primary }}
              >
                <Gift size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-3 text-[15px] font-bold" style={{ color: FIELD_THEME.text }}>
                {offer.title}
              </h3>
              <p className="mt-1 text-[12px] leading-snug" style={{ color: FIELD_THEME.textMuted }}>
                {offer.detail}
              </p>
              <p className="mt-3 flex items-center gap-1 text-sm font-bold tabular-nums" style={{ color: FIELD_THEME.text }}>
                <Sparkles size={14} className="text-amber-500" />
                {offer.cost.toLocaleString()} pts
              </p>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border-2 py-2.5 text-[13px] font-bold transition hover:bg-slate-50"
                style={{ borderColor: FIELD_THEME.primary, color: FIELD_THEME.primary }}
                onClick={() =>
                  offer.cost > TOTAL_POINTS
                    ? setToast({ message: 'Not enough points for this reward.', type: 'error' })
                    : setToast({ message: `Redemption requested: ${offer.title}`, type: 'success' })
                }
              >
                Redeem
                <ChevronRight size={16} className="opacity-70" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 mb-2 text-center text-[10px]" style={{ color: FIELD_THEME.textMuted }}>
        Points are illustrative for demo.
      </p>
    </div>
  );
}
