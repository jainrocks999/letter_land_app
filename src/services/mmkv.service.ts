import { createMMKV } from 'react-native-mmkv';
import { DEFAULT_ACTIVITIES_PRPOGRESS } from '../config/constants';

export const storage = createMMKV();
export interface UserActivitiesType {
  learning?: number;
  trancing?: number;
  searching?: number;
  matching?: number;
  choosing?: number;
  filling?: number;
  building?: number;
  matching2?: number;
  reading?: number;
}
export type ActivitiesKey = keyof UserActivitiesType;

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
    } catch (error) {
      return DEFAULT_ACTIVITIES_PRPOGRESS;
    }
  },
};

export default StorageService;
