import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { storage } from '../services/mmkv.service';
import { APP_UPDATE_CONFIG, AppUpdateType } from '../config/appUpdate';
import {
  checkAppStoreUpdate,
  openAppStore,
} from '../services/appStoreUpdate.service';

const LAST_OPTIONAL_PROMPT_KEY = 'ios_last_optional_update_prompt_ms';

export const useIosAppUpdate = () => {
  const [visible, setVisible] = useState(false);
  const [storeUrl, setStoreUrl] = useState(APP_UPDATE_CONFIG.IOS_APP_STORE_URL);
  const checkingRef = useRef(false);

  const check = useCallback(async () => {
    if (Platform.OS !== 'ios' || checkingRef.current) return;
    checkingRef.current = true;

    try {
      const info = await checkAppStoreUpdate();
      if (!info.updateAvailable) {
        setVisible(false);
        return;
      }

      setStoreUrl(info.storeUrl);

      if (APP_UPDATE_CONFIG.UPDATE_TYPE === AppUpdateType.FORCE) {
        setVisible(true);
        return;
      }

       const lastPrompt = Number(
        storage.getNumber(LAST_OPTIONAL_PROMPT_KEY) ?? 0,
      );
      const now = Date.now();
      if (now - lastPrompt < APP_UPDATE_CONFIG.OPTIONAL_PROMPT_INTERVAL_MS) {
        return;
      }

      storage.set(LAST_OPTIONAL_PROMPT_KEY, now);
      setVisible(true);
    } finally {
      checkingRef.current = false;
    }
  }, []);

  useEffect(() => {
    check();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') check();
    });
    return () => sub.remove();
  }, [check]);

  const onUpdate = useCallback(() => {
    openAppStore(storeUrl);
  }, [storeUrl]);

  const onLater = useCallback(() => {
    if (APP_UPDATE_CONFIG.UPDATE_TYPE === AppUpdateType.FORCE) return;
    setVisible(false);
  }, []);

  return {
    visible,
    type: APP_UPDATE_CONFIG.UPDATE_TYPE,
    onUpdate,
    onLater,
  };
};
