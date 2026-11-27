import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { APP_UPDATE_CONFIG } from '../config/appUpdate';

type AppStoreLookupResponse = {
  resultCount: number;
  results: Array<{
    version?: string;
    trackViewUrl?: string;
  }>;
};

const compareVersions = (current: string, latest: string): number => {
  const a = current.split('.').map(n => parseInt(n, 10) || 0);
  const b = latest.split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left < right) return -1;
    if (left > right) return 1;
  }
  return 0;
};

export type AppStoreUpdateInfo = {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion?: string;
  storeUrl: string;
};

export const checkAppStoreUpdate = async (): Promise<AppStoreUpdateInfo> => {
  const currentVersion = DeviceInfo.getVersion();
  const fallback: AppStoreUpdateInfo = {
    updateAvailable: false,
    currentVersion,
    storeUrl: APP_UPDATE_CONFIG.IOS_APP_STORE_URL,
  };

  if (Platform.OS !== 'ios') return fallback;

  try {
    const { IOS_BUNDLE_ID, LOOKUP_COUNTRY } = APP_UPDATE_CONFIG;
    const url = `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}&country=${LOOKUP_COUNTRY}`;
    const res = await fetch(url);
    if (!res.ok) return fallback;

    const data = (await res.json()) as AppStoreLookupResponse;
    const result = data.results?.[0];
    const latestVersion = result?.version;

    if (!latestVersion) return fallback;

    return {
      updateAvailable: compareVersions(currentVersion, latestVersion) < 0,
      currentVersion,
      latestVersion,
      storeUrl: result.trackViewUrl || APP_UPDATE_CONFIG.IOS_APP_STORE_URL,
    };
  } catch {
    return fallback;
  }
};

export const openAppStore = async (storeUrl: string) => {
  try {
    const supported = await Linking.canOpenURL(storeUrl);
    if (supported) {
      await Linking.openURL(storeUrl);
      return;
    }
  } catch {
    // fallback below
  }

  await Linking.openURL(APP_UPDATE_CONFIG.IOS_APP_STORE_URL);
};
