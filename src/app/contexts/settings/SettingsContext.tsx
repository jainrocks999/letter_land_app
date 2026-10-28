import { createContext } from 'react';
import { settingsType } from './types';

export const SettingsContext = createContext<settingsType | null>(null);
