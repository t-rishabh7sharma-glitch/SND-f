import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, ArrowRightLeft, ShieldCheck, Fingerprint, 
  CheckCircle2, AlertTriangle, Clock, Smartphone, User,
  Building2, Zap, ShieldAlert
} from 'lucide-react';

interface SecureTransferProps {
  onAction: (message: string) => void;
}

const SecureTransfer: React.FC<SecureTransferProps> = ({ onAction }) => {
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState<'Agent-Topup' | 'Wholesale-Allocation' | 'Cash-Collection'>('Agent-Topup');
  const [biometricStatus, setBiometricStatus] = useState<'Pending' | 'Verified'>('Pending');

  const handleAuthorize = () => {
    if (biometricStatus !== 'Verified' && parseInt(amount) > 10000) {
      onAction('Biometric verification failed. Dual-factor PIN required.');
      return;
    }
    const msg = transferType === 'Wholesale-Allocation' 
      ? `Wholesale Float of K ${amount} allocated from Master Agent to Rebalancer wallet.`
      : `Transfer of K ${amount} authorized for Chanda Mobile Money.`;
    onAction(msg);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-display font-extrabold text-primary tracking-tight">Secure Transfer Engine</h1>
          <p className="text-on-surface-variant text-sm font-medium">B2B Wholesale & Secondary Distribution (FR24, FR39)</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Crypto-Signed Session Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-8 space-y-8">
            {/* Transfer Mode Switcher */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction Purpose</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Wholesale-Allocation', label: 'Wholesale (B2B)', sub: 'Master Agent → You', icon: <Building2 /> },
                  { id: 'Agent-Topup', label: 'Agent Top-up', sub: 'You → Retail Agent', icon: <Wallet /> },
                  { id: 'Cash-Collection', label: 'Cash Pickup', sub: 'Physical Liquidity', icon: <ArrowRightLeft /> },
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setTransferType(t.id as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 text-center ${
                      transferType === t.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-black/5 bg-surface-container-low hover:border-black/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${transferType === t.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                      {React.cloneElement(t.icon as any, { size: 20 })}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${transferType === t.id ? 'text-primary' : 'text-on-surface'}`}>{t.label}</div>
                      <div className="text-[9px] font-semibold text-on-surface-variant">{t.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient / Source Info */}
            <div className="p-5 bg-surface-container-low rounded-2xl border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {transferType === 'Wholesale-Allocation' ? <Building2 size={24} /> : <User size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {transferType === 'Wholesale-Allocation' ? 'Source Master Agent' : 'Recipient Retail Agent'}
                  </p>
                  <p className="text-lg font-bold text-on-surface">
                    {transferType === 'Wholesale-Allocation' ? 'Zamtel Regional Warehouse' : 'Chanda Mobile Money'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Current Balance</p>
                <p className="text-sm font-extrabold text-on-surface">K 42,500.00</p>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Enter Amount (ZMW)</label>
                <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest">Limit: K 50,000 / Day</span>
              </div>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold text-2xl group-hover:scale-110 transition-transform font-display">K</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-8 py-6 bg-surface-container-lowest border-2 border-black/5 rounded-[2rem] text-4xl font-extrabold font-display focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-black/5"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['500', '2500', '10000', '25000'].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="py-3 bg-surface-container rounded-2xl text-xs font-bold text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all border border-black/5"
                  >
                    + K {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Step */}
            <div className={`p-6 rounded-[2rem] flex items-center justify-between transition-all ${
              biometricStatus === 'Verified' ? 'bg-rag-green/10 border-rag-green/20' : 'bg-rag-amber-bg border-rag-amber/20'
            } border`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${biometricStatus === 'Verified' ? 'bg-rag-green text-white' : 'bg-primary/10 text-primary'}`}>
                  {biometricStatus === 'Verified' ? <CheckCircle2 size={32} /> : <Fingerprint size={32} />}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Dual-Factor Confirmation</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Verify presence of agent recipient via biometric scan.</p>
                </div>
              </div>
              <button 
                onClick={() => setBiometricStatus('Verified')}
                disabled={biometricStatus === 'Verified'}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all ${
                  biometricStatus === 'Verified' ? 'bg-rag-green text-white cursor-default' : 'bg-primary text-white hover:scale-105 active:scale-95'
                }`}
              >
                {biometricStatus === 'Verified' ? 'Identity Verified' : 'Scan Fingerprint'}
              </button>
            </div>

            <button 
              onClick={handleAuthorize}
              disabled={!amount}
              className={`w-full py-5 rounded-[2rem] font-display font-extrabold text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${
                !amount ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50' : 
                transferType === 'Cash-Collection' ? 'bg-rag-green text-white hover:bg-green-700' : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              <Zap size={24} className="fill-white" />
              Authorize Secure Transfer
            </button>
          </div>
        </div>

        {/* Validation Sidebar */}
        <div className="space-y-6">
          <div className="card-base p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Validation Status</h3>
            <div className="space-y-4">
              {[
                { label: 'GPS Geofence', status: 'In Range', pass: true },
                { label: 'Network Integrity', status: 'Secured (SSL/VPN)', pass: true },
                { label: 'Agent KYB Status', status: 'Fully Active', pass: true },
                { label: 'Liquidity Check', status: 'Within Limits', pass: true },
              ].map((v, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-surface-container-low rounded-2xl border border-black/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{v.label}</span>
                    {v.pass ? <CheckCircle2 size={14} className="text-rag-green" /> : <Clock size={14} className="text-rag-amber" />}
                  </div>
                  <div className="text-xs font-bold text-on-surface">{v.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-rag-red-bg rounded-3xl border border-rag-red/20 space-y-3">
            <div className="flex items-center gap-2 text-rag-red">
              <ShieldAlert size={20} />
              <h4 className="font-bold text-sm">Security Regulation</h4>
            </div>
            <p className="text-[11px] text-rag-red/80 font-medium leading-relaxed">
              Transactions exceeding K 25,000 for secondary distribution (B2C) undergo multi-nodal audit and require digital signature from ZBM level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureTransfer;
