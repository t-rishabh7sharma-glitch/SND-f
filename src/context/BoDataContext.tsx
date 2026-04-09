import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AseStatus, Exception } from '../types';
import { MOCK_ASE_STATUSES, MOCK_EXCEPTIONS } from '../data/fieldMocks';

type Toast = { message: string; type: 'success' | 'error' } | null;

type BoDataContextValue = {
  aseStatuses: AseStatus[];
  setAseStatuses: React.Dispatch<React.SetStateAction<AseStatus[]>>;
  exceptions: Exception[];
  setExceptions: React.Dispatch<React.SetStateAction<Exception[]>>;
  missedVisitLogs: { outletName: string; aseName: string; reason: string; notes: string; time: string }[];
  setMissedVisitLogs: React.Dispatch<React.SetStateAction<{ outletName: string; aseName: string; reason: string; notes: string; time: string }[]>>;
  selectedAseForValidation: AseStatus | null;
  setSelectedAseForValidation: (a: AseStatus | null) => void;
  handleExceptionAction: (id: string, action: string) => void;
  toast: Toast;
  setToast: React.Dispatch<React.SetStateAction<Toast>>;
};

const BoDataContext = createContext<BoDataContextValue | null>(null);

export function BoDataProvider({ children }: { children: React.ReactNode }) {
  const [aseStatuses, setAseStatuses] = useState<AseStatus[]>(MOCK_ASE_STATUSES);
  const [exceptions, setExceptions] = useState<Exception[]>(MOCK_EXCEPTIONS);
  const [missedVisitLogs, setMissedVisitLogs] = useState<
    { outletName: string; aseName: string; reason: string; notes: string; time: string }[]
  >([
    { outletName: 'Kabwe Retail Hub', aseName: 'Priya Nambwe', reason: 'Outlet Closed', notes: 'Shutters down, called agent no answer.', time: '10:15 AM' },
    { outletName: 'Mansa Central MoMo', aseName: 'Tiza Mwale', reason: 'Agent Unavailable', notes: 'Agent travelling. Will reschedule tomorrow.', time: '11:30 AM' },
  ]);
  const [selectedAseForValidation, setSelectedAseForValidation] = useState<AseStatus | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const handleExceptionAction = useCallback((id: string, action: string) => {
    setToast({ message: `Exception ${id} ${action.toLowerCase()}ed.`, type: 'success' });
    setExceptions((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      aseStatuses,
      setAseStatuses,
      exceptions,
      setExceptions,
      missedVisitLogs,
      setMissedVisitLogs,
      selectedAseForValidation,
      setSelectedAseForValidation,
      handleExceptionAction,
      toast,
      setToast,
    }),
    [aseStatuses, exceptions, missedVisitLogs, selectedAseForValidation, handleExceptionAction, toast],
  );

  return <BoDataContext.Provider value={value}>{children}</BoDataContext.Provider>;
}

export function useBoData() {
  const ctx = useContext(BoDataContext);
  if (!ctx) throw new Error('useBoData must be used within BoDataProvider');
  return ctx;
}
