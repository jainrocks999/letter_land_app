import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StorageService, {
  UserSettingsType,
} from '../../../services/mmkv.service';
import {
  STORAGE_KEYS,
  VOICE_SPEED_MULTIPLIER,
} from '../../../config/constants';
import TTSService from '../../../services/tts.service';
import { SettingsContext } from './SettingsContext';

interface Props {
  children: React.ReactNode;
}

export const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState<UserSettingsType>(() =>
    StorageService.getSettings(STORAGE_KEYS.SETTINGS),
  );

  // keep the voice in sync with the saved settings
  useEffect(() => {
    TTSService.setMuted(!settings.voiceOn);
    TTSService.setRateMultiplier(VOICE_SPEED_MULTIPLIER[settings.voiceSpeed]);
  }, [settings.voiceOn, settings.voiceSpeed]);

  const updateSettings = useCallback((changes: Partial<UserSettingsType>) => {
    setSettings(prev => {
      const updated = { ...prev, ...changes };
      StorageService.setSettings(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
