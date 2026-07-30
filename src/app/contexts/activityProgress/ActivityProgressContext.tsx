import { createContext } from 'react';
import { activityProgressType } from './types';

export const ActivityProgressContext =
  createContext<activityProgressType | null>(null);
