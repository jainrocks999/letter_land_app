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
import {
  activityData,
  getActivityProgressKey,
} from '../../../features/home/data/home.data';

interface Props {
  children: React.ReactNode;
}

export const ActivityProProvider = ({ children }: Props) => {
  const { activeProfileId } = useProfilesContext();
  const progressKey = getProfileKey(
    STORAGE_KEYS.USER_PERFORMANCE,
    activeProfileId,
  );
  const characterKey = getProfileKey(
    STORAGE_KEYS.CHARACTER_LEVEL,
    activeProfileId,
  );
  const [progressData, setProgressData] = useState<UserActivitiesType>(
    DEFAULT_ACTIVITIES_PRPOGRESS,
  );
  const [characterIndex, setCharacterIndex] = useState(-1);

  const getProgress = useCallback(() => {
    const data = StorageService.getUserPerformance(progressKey);
    setProgressData(data);
    const storedLevel = StorageService.getCharacterLevel(characterKey);
    setCharacterIndex(
      storedLevel
        ? activityData.findIndex(
            level => getActivityProgressKey(level) === storedLevel,
          )
        : -1,
    );
  }, [progressKey, characterKey]);

  const updateProgress = useCallback(
    ({ key, progress }: updateProgressProp) => {
      // Buddy the home character follows the level the kid just played. Finishing
      // a level sends him on to the next one, otherwise he stays on it (even
      // when replaying a level that was already complete).
      const playedIndex = activityData.findIndex(
        level => getActivityProgressKey(level) === key,
      );
      if (playedIndex !== -1) {
        const nextIndex =
          progress >= 100 && playedIndex + 1 < activityData.length
            ? playedIndex + 1
            : playedIndex;
        StorageService.setCharacterLevel(
          characterKey,
          getActivityProgressKey(activityData[nextIndex]),
        );
        setCharacterIndex(nextIndex);
      }

      // progress only moves forward: replaying a level from the start must not
      // lower the best progress the kid has already reached on it
      const current = StorageService.getUserPerformance(progressKey)[key] ?? 0;
      if (progress <= current) return;
      StorageService.setUserPerformance(progressKey, key, progress);
      setProgressData(StorageService.getUserPerformance(progressKey));
    },
    [progressKey, characterKey],
  );

  const resetProgress = useCallback(() => {
    StorageService.removeItem(progressKey);
    StorageService.removeItem(characterKey);
    setProgressData(DEFAULT_ACTIVITIES_PRPOGRESS);
    setCharacterIndex(-1);
  }, [progressKey, characterKey]);

  useEffect(() => {
    getProgress();
  }, [getProgress]);

  const value = useMemo(
    () => ({
      progressData,
      characterIndex,
      getProgress,
      updateProgress,
      resetProgress,
    }),
    [progressData, characterIndex, getProgress, updateProgress, resetProgress],
  );

  return (
    <ActivityProgressContext.Provider value={value}>
      {children}
    </ActivityProgressContext.Provider>
  );
};
