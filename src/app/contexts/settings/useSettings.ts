import { useContext } from 'react';
import { SettingsContext } from './SettingsContext';

const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
};

export default useSettingsContext;
