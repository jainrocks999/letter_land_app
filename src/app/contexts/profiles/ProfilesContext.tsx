import { createContext } from 'react';
import { profilesType } from './types';

export const ProfilesContext = createContext<profilesType | null>(null);
