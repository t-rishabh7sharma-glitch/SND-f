import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertTriangle, Lock, Navigation, User } from 'lucide-react';
import { buildUserFromLoginId, getBoPrefix, useSession } from '../context/SessionContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useSession();
  const [loginId, setLoginId] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = buildUserFromLoginId(loginId);
    setUser(user);
    if (user.role === 'ASE') {
      navigate('/field', { replace: true });
      return;
    }
    const prefix = getBoPrefix(user.role);
    navigate(`/bo/${prefix}/dashboard`, { replace: true });
  };

  return (
    <div className="bo-shell min-h-screen bg-bo-surface flex items-center justify-center p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 lg:p-12 shadow-bo-card space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-bo-primary to-bo-secondary shadow-lg">
            <Navigation size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black leading-tight">Distribution CRM</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-bo-muted">Sales &amp; back office</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-bo-muted">Employee ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bo-muted" size={18} />
              <input
                required
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g., ASE-20241 or TL-10032 or ADMIN-00001"
                className="w-full rounded-lg border border-black/10 bg-bo-surface py-3.5 pl-12 pr-4 text-sm font-semibold text-black outline-none transition-all focus:border-bo-primary focus:ring-2 focus:ring-bo-primary/25"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-bo-muted">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bo-muted" size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-black/10 bg-bo-surface py-3.5 pl-12 pr-4 text-sm font-semibold text-black outline-none transition-all focus:border-bo-primary focus:ring-2 focus:ring-bo-primary/25"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-bo-primary w-full rounded-lg py-4 text-lg font-bold shadow-md transition hover:opacity-95"
          >
            Sign In
          </button>
          <p className="text-center text-[10px] font-semibold text-bo-muted">
            <AlertTriangle size={12} className="mr-1 inline text-amber-600" />
            Field roles: GPS and time tracking apply per policy. BO roles use this console only.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
