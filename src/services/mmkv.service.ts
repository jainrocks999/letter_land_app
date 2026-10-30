import { createMMKV } from 'react-native-mmkv';
import {
  DEFAULT_ACTIVITIES_PRPOGRESS,
  VOICE_SPEED_MULTIPLIER,
} from '../config/constants';

export const storage = createMMKV();
export interface UserActivitiesType {
  learning?: number;
  trancing?: number;
  searching?: number;
  matching?: number;
  choosing?: number;
  feeding?: number;
  filling?: number;
  spelling?: number;
  building?: number;
  matching2?: number;
  reading?: number;
}
export type ActivitiesKey = keyof UserActivitiesType;

export interface UserRewardsType {
  stars: number;
  totalEarned: number;
  unlockedStickers: string[];
  trophies: string[];
  // how many times each activity was finished, used to halve replay stars
  activityRuns: Record<string, number>;
}

export type VoiceSpeedType = keyof typeof VOICE_SPEED_MULTIPLIER;

export interface UserSettingsType {
  voiceOn: boolean;
  voiceSpeed: VoiceSpeedType;
  starPopups: boolean;
  musicOn:boolean;
  // soundOn:boolean;
}

export const DEFAULT_SETTINGS: UserSettingsType = {
  voiceOn: true,
  voiceSpeed: 'normal',
  starPopups: true,
  musicOn:true,
  // soundOn:true,
};

export const DEFAULT_REWARDS: UserRewardsType = {
  stars: 0,
  totalEarned: 0,
  unlockedStickers: [],
  trophies: [],
  activityRuns: {},
};

const StorageService = {
  setIsOnBoarding: (key: string, value: boolean) => {
    storage.set(key, value);
  },
  setUserPerformance: (key: string, field: ActivitiesKey, value: number) => {
    const current = StorageService.getUserPerformance(key);
    const updated = {
      ...current,
      [field]: value,
    };
    storage.set(key, JSON.stringify(updated));
  },

  getIsOnBorading: (key: string): boolean => {
    return storage.getBoolean(key) ?? false;
  },

  getUserPerformance: (key: string): UserActivitiesType => {
    const data = storage.getString(key);

    if (!data) {
      return DEFAULT_ACTIVITIES_PRPOGRESS;
    }

    try {
      return JSON.parse(data) as UserActivitiesType;
    } catch {
      return DEFAULT_ACTIVITIES_PRPOGRESS;
    }
  },

  setSettings: (key: string, value: UserSettingsType) => {
    storage.set(key, JSON.stringify(value));
  },

  getSettings: (key: string): UserSettingsType => {
    const data = storage.getString(key);

    if (!data) {
      return DEFAULT_SETTINGS;
    }

    try {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(data) as UserSettingsType) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  removeItem: (key: string) => {
    storage.remove(key);
  },

  setRewards: (key: string, value: UserRewardsType) => {
    storage.set(key, JSON.stringify(value));
  },

  getRewards: (key: string): UserRewardsType => {
    const data = storage.getString(key);

    if (!data) {
      return DEFAULT_REWARDS;
    }

    try {
      return { ...DEFAULT_REWARDS, ...(JSON.parse(data) as UserRewardsType) };
    } catch {
      return DEFAULT_REWARDS;
    }
  },
};

export default StorageService;
