import { createContext } from 'react';
import { toastType } from './types';

export const ToastContext = createContext<toastType | null>(null);
