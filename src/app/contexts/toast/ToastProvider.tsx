import React, { useCallback, useMemo, useState } from 'react';
import Toast from '../../../components/toast/Toast';
import { ToastContext } from './ToastContext';
import { ToastType } from './types';

interface Props {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: Props) => {
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = useCallback((message: string, icon?: string) => {
    // a fresh id lets the same message replay even if it is already visible
    setToast({ id: Date.now(), message, icon });
  }, []);

  const value = useMemo(() => ({ toast, showToast }), [toast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};
