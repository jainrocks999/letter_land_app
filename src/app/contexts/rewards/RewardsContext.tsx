import { createContext } from 'react';
import { rewardsType } from './types';

export const RewardsContext = createContext<rewardsType | null>(null);
