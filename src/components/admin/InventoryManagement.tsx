import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Smartphone,
  Usb,
  Shirt,
  FileKey,
  Cloud,
  QrCode,
  ChevronRight,
  Plus,
  Minus,
  X,
} from 'lucide-react';

type InvCategory = 'physical' | 'digital';

type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: InvCategory;
  subtype: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  unit: string;
  actionable: string;
};

const INITIAL: InventoryItem[] = [
  { id: 'inv-1', sku: 'SIM-5G-STD', name: '5G SIM kit (blank)', category: 'physical', subtype: 'SIM / UICC', onHand: 4200, reserved: 180, reorderPoint: 800, unit: 'pcs', actionable: 'Allocate to TL van stock' },
  { id: 'inv-2', sku: 'SIM-MOMO', name: 'MoMo onboarding sleeve', category: 'physical', subtype: 'Merch', onHand: 1200, reserved: 40, reorderPoint: 200, unit: 'pcs', actionable: 'Ship to outlet branding pack' },
  { id: 'inv-3', sku: 'DEV-ANDROID', name: 'Field handset (managed)', category: 'physical', subtype: 'Device', onHand: 85, reserved: 12, reorderPoint: 20, unit: 'devices', actionable: 'Assign / RMA via MDM' },
  { id: 'inv-4', sku: 'POS-ROLL', name: 'Thermal paper rolls', category: 'physical', subtype: 'Consumable', onHand: 600, reserved: 0, reorderPoint: 100, unit: 'boxes', actionable: 'Restock agent bundle' },
  { id: 'inv-5', sku: 'UNI-TSHIRT', name: 'Field uniform (vest)', category: 'physical', subtype: 'Uniform', onHand: 340, reserved: 25, reorderPoint: 60, unit: 'pcs', actionable: 'Issue to new ASE' },
  { id: 'inv-6', sku: 'LIC-MDM', name: 'MDM seat (annual)', category: 'digital', subtype: 'License', onHand: 500, reserved: 88, reorderPoint: 50, unit: 'seats', actionable: 'Provision / reclaim seat' },
  { id: 'inv-7', sku: 'API-BUNDLE', name: 'Partner API quota pack', category: 'digital', subtype: 'API', onHand: 12, reserved: 2, reorderPoint: 3, unit: 'packs', actionable: 'Increase throttle for territory' },
  { id: 'inv-8', sku: 'VOUCH-DATA', name: 'Digital airtime voucher pool', category: 'digital', subtype: 'Voucher', onHand: 250000, reserved: 12000, reorderPoint: 50000, unit: 'ZMW equiv', actionable: 'Sweep / top-up pool' },
  { id: 'inv-9', sku: 'QR-STAND', name: 'QR payment standee', category: 'physical', subtype: 'Merch', onHand: 90, reserved: 5, reorderPoint: 20, unit: 'pcs', actionable: 'Deploy to high-traffic outlet' },
];

const iconFor = (i: InventoryItem) => {
  if (i.category === 'digital') {
    if (i.subtype === 'License') return FileKey;
    if (i.subtype === 'API') return Cloud;
    return QrCode;
  }
  if (i.subtype.includes('SIM')) return Smartphone;
  if (i.subtype === 'Device') return Usb;
  if (i.subtype === 'Uniform') return Shirt;
  if (i.subtype === 'Consumable') return Package;
  return Package;
};

const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL);
  const [filter, setFilter] = useState<'all' | InvCategory>('all');
  const [detail, setDetail] = useState<InventoryItem | null>(null);

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  const adjust = (id: string, delta: number) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, onHand: Math.max(0, x.onHand + delta) } : x)));
  };

  return (
    <div className="bo-shell max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-bo-secondary lg:text-3xl">Inventory management</h1>
          <p className="mt-1 text-sm text-bo-muted">Physical and digital stock with actionable operations (prototype state).</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'physical', 'digital'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                filter === f ? 'bg-bo-secondary text-white' : 'border border-black/10 bg-white text-bo-muted hover:bg-bo-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const Icon = iconFor(item);
          const low = item.onHand <= item.reorderPoint;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setDetail(item)}
              className="bo-card group w-full p-5 text-left transition hover:border-bo-primary/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bo-primary/15 text-bo-secondary">
                  <Icon size={22} className="text-bo-primary" />
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                    item.category === 'digital' ? 'bg-violet-100 text-violet-800' : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <p className="mt-3 font-mono text-[10px] font-bold text-bo-muted">{item.sku}</p>
              <h3 className="mt-1 font-bold text-black">{item.name}</h3>
              <p className="mt-2 line-clamp-2 text-xs text-bo-muted">{item.actionable}</p>
              <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-bo-muted">On hand</p>
                  <p className={`text-lg font-bold ${low ? 'text-amber-700' : 'text-bo-secondary'}`}>
                    {item.onHand.toLocaleString()} <span className="text-xs font-semibold text-bo-muted">{item.unit}</span>
                  </p>
                </div>
                <ChevronRight size={18} className="text-bo-primary opacity-0 transition group-hover:opacity-100" />
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {detail && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/35"
              onClick={() => setDetail(null)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-black/5 bg-bo-secondary px-5 py-4 text-white">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/70">{detail.sku}</p>
                  <h2 className="text-lg font-bold">{detail.name}</h2>
                </div>
                <button type="button" onClick={() => setDetail(null)} className="rounded-lg p-2 hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase text-bo-muted">Action</p>
                  <p className="mt-1 font-semibold text-black">{detail.actionable}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-black/5 bg-bo-surface p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-bo-muted">On hand</p>
                    <p className="text-xl font-bold text-bo-secondary">{detail.onHand.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-bo-muted">Reserved</p>
                    <p className="text-xl font-bold text-bo-muted">{detail.reserved.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase text-bo-muted">Reorder at</p>
                    <p className="font-bold text-amber-800">{detail.reorderPoint.toLocaleString()} {detail.unit}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase text-bo-muted">Adjust stock (demo)</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => adjust(detail.id, -10)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/10 py-3 font-bold hover:bg-bo-surface"
                    >
                      <Minus size={18} /> -10
                    </button>
                    <button
                      type="button"
                      onClick={() => adjust(detail.id, 10)}
                      className="btn-bo-primary flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-bold"
                    >
                      <Plus size={18} /> +10
                    </button>
                  </div>
                </div>
                <p className="text-xs text-bo-muted">
                  Production: tie adjustments to <code className="rounded bg-bo-surface px-1">POST /inventory/movements</code> with reason codes and approval for high-value digital pools.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagement;
