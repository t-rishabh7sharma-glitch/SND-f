import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw, Smartphone, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const AseWallet: React.FC = () => {
  const transactions = [
    { id: 1, type: 'credit', label: 'EOD Settlement', amount: 'K2,450.00', date: 'Yesterday' },
    { id: 2, type: 'debit', label: 'Outlet Load-up', amount: 'K1,200.00', date: 'Today, 10:45' },
    { id: 3, type: 'credit', label: 'Zamtel Float Refresh', amount: 'K5,000.00', date: 'Today, 08:00' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Wallet Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <Wallet size={120} />
        </div>
        
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Active Wallet Balance</p>
              <h2 className="text-4xl font-display font-black pr-16 mt-1">K3,250.75</h2>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl">
              <RefreshCw size={20} className="hover:rotate-180 transition-transform cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Available Float</p>
              <p className="text-lg font-black mt-0.5">K2,100.00</p>
            </div>
            <div>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Commission Earned</p>
              <p className="text-lg font-black mt-0.5 text-rag-green">K150.25</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Transaction History</h3>
          <button className="text-[10px] font-bold text-primary uppercase">View More</button>
        </div>
        
        <div className="space-y-3">
          {transactions.map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white rounded-2xl border border-black/5 flex justify-between items-center hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${t.type === 'credit' ? 'bg-rag-green/10 text-rag-green' : 'bg-primary/10 text-primary'}`}>
                  {t.type === 'credit' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-tight">{t.label}</div>
                  <div className="text-[9px] font-bold text-on-surface-variant/40 mt-0.5">{t.date}</div>
                </div>
              </div>
              <div className={`text-sm font-black ${t.type === 'credit' ? 'text-rag-green' : 'text-primary'}`}>
                {t.type === 'credit' ? '+' : '-'}{t.amount}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pb-8">
        <button className="py-4 bg-surface-container rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-low transition-all">
          Withdraw Funds
        </button>
        <button className="py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark shadow-xl hover:scale-105 transition-all">
          Float Refresh
        </button>
      </div>
    </div>
  );
};

export default AseWallet;
