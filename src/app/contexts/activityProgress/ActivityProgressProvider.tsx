import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StorageService, {
  UserActivitiesType,
} from '../../../services/mmkv.service';
import {
  DEFAULT_ACTIVITIES_PRPOGRESS,
  STORAGE_KEYS,
} from '../../../config/constants';
import { ActivityProgressContext } from './ActivityProgressContext';
import { updateProgressProp } from './types';

interface Props {
  children: React.ReactNode;
}

export const ActivityProProvider = ({ children }: Props) => {
  const [progressData, setProgressData] = useState<UserActivitiesType>(
    DEFAULT_ACTIVITIES_PRPOGRESS,
  );

  const getProgress = useCallback(() => {
    const data = StorageService.getUserPerformance(
      STORAGE_KEYS.USER_PERFORMANCE,
    );
    setProgressData(data);
  }, []);

  const updateProgress = useCallback(
    ({ key, progress }: updateProgressProp) => {
      StorageService.setUserPerformance(
        STORAGE_KEYS.USER_PERFORMANCE,
        key,
        progress,
      );
      const updatedData = StorageService.getUserPerformance(
        STORAGE_KEYS.USER_PERFORMANCE,
      );
      setProgressData({
        ...updatedData,
        [key]: progress,
      });
    },
    [],
  );

  const resetProgress = useCallback(() => {
    StorageService.removeItem(STORAGE_KEYS.USER_PERFORMANCE);
    setProgressData(DEFAULT_ACTIVITIES_PRPOGRESS);
  }, []);

  useEffect(() => {
    getProgress();
  }, [getProgress]);

  const value = useMemo(
    () => ({
      progressData,
      getProgress,
      updateProgress,
      resetProgress,
    }),
    [progressData, getProgress, updateProgress, resetProgress],
  );

  return (
    <ActivityProgressContext.Provider value={value}>
      {children}
    </ActivityProgressContext.Provider>
  );
};
