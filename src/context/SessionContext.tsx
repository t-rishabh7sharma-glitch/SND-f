import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { User, UserRole } from '../types';

type SessionContextValue = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, setUser, logout }), [user, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

/** URL prefix for back-office routes by role (RBAC navigation is code-defined). */
export function getBoPrefix(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return 'admin';
    case 'TL':
      return 'tl';
    case 'TDR':
      return 'tdr';
    case 'ZBM':
      return 'zbm';
    case 'REBALANCER':
      return 'reb';
    default:
      return 'admin';
  }
}

export function buildUserFromLoginId(loginId: string): User {
  const id = loginId.trim().toUpperCase();
  const commonFields = {
    region: 'Central Region',
    territory: 'Metro North',
  };

  if (id.startsWith('TL')) {
    return {
      id: 'TL-10032',
      name: 'Brian Phiri',
      email: 'brian.phiri@example.com',
      role: 'TL',
      ...commonFields,
      territory: 'Metro East',
    };
  }
  if (id.startsWith('TDR')) {
    return {
      id: 'TDR-30041',
      name: 'Sarah Mwale',
      email: 'sarah.mwale@example.com',
      role: 'TDR',
      ...commonFields,
      territory: 'Metro East',
    };
  }
  if (id.startsWith('ZBM')) {
    return {
      id: 'ZBM-50004',
      name: 'Executive Director',
      email: 'exec.dir@example.com',
      role: 'ZBM',
      ...commonFields,
      territory: 'South Zone',
    };
  }
  if (id.startsWith('REB')) {
    return {
      id: 'REB-70012',
      name: 'John Rebalancer',
      email: 'john.r@example.com',
      role: 'REBALANCER',
      ...commonFields,
      territory: 'CBD',
    };
  }
  if (id.startsWith('ADMIN')) {
    return {
      id: 'ADMIN-00001',
      name: 'System Admin',
      email: 'admin@example.com',
      role: 'ADMIN',
      ...commonFields,
      territory: 'Global',
    };
  }
  if (id.startsWith('ASE')) {
    return {
      id: 'ASE-20241',
      name: 'Mwape Banda',
      email: 'mwape.banda@example.com',
      role: 'ASE',
      ...commonFields,
    };
  }
  return {
    id: 'ASE-20241',
    name: 'Mwape Banda',
    email: 'mwape.banda@example.com',
    role: 'ASE',
    ...commonFields,
  };
}
