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
import useProfilesContext from '../profiles/useProfiles';
import { getProfileKey } from '../../../services/profile.service';

interface Props {
  children: React.ReactNode;
}

export const ActivityProProvider = ({ children }: Props) => {
  const { activeProfileId } = useProfilesContext();
  const progressKey = getProfileKey(
    STORAGE_KEYS.USER_PERFORMANCE,
    activeProfileId,
  );
  const [progressData, setProgressData] = useState<UserActivitiesType>(
    DEFAULT_ACTIVITIES_PRPOGRESS,
  );

  const getProgress = useCallback(() => {
    const data = StorageService.getUserPerformance(progressKey);
    setProgressData(data);
  }, [progressKey]);

  const updateProgress = useCallback(
    ({ key, progress }: updateProgressProp) => {
      StorageService.setUserPerformance(progressKey, key, progress);
      const updatedData = StorageService.getUserPerformance(progressKey);
      setProgressData({
        ...updatedData,
        [key]: progress,
      });
    },
    [progressKey],
  );

  const resetProgress = useCallback(() => {
    StorageService.removeItem(progressKey);
    setProgressData(DEFAULT_ACTIVITIES_PRPOGRESS);
  }, [progressKey]);

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
