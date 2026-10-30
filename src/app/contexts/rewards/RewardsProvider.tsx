import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import StorageService, {
  DEFAULT_REWARDS,
  UserRewardsType,
} from '../../../services/mmkv.service';
import { STORAGE_KEYS } from '../../../config/constants';
import {
  StickerType,
  stickersData,
} from '../../../features/rewards/data/rewards.data';
import { RewardsContext } from './RewardsContext';
import { PointsToastType } from './types';
import PointsToast from '../../../components/pointsToast/PointsToast';
import useProfilesContext from '../profiles/useProfiles';
import { getProfileKey } from '../../../services/profile.service';

// players from before run tracking already finished their trophy activities once
const getActivityRuns = (rewards: UserRewardsType, activityId: string) =>
  Math.max(
    rewards.activityRuns[activityId] ?? 0,
    rewards.trophies.includes(activityId) ? 1 : 0,
  );

interface Props {
  children: React.ReactNode;
}

export const RewardsProvider = ({ children }: Props) => {
  const { activeProfileId } = useProfilesContext();
  const rewardsKey = getProfileKey(STORAGE_KEYS.REWARDS, activeProfileId);
  const rewardsKeyRef = useRef(rewardsKey);
  // ref is the source of truth so callbacks fired from timers never read stale data
  const rewardsRef = useRef<UserRewardsType>(
    StorageService.getRewards(rewardsKey),
  );
  const [rewards, setRewards] = useState<UserRewardsType>(rewardsRef.current);
  const [pointsToast, setPointsToast] = useState<PointsToastType | null>(null);
  const [unlockedQueue, setUnlockedQueue] = useState<StickerType[]>([]);

  const saveRewards = (updated: UserRewardsType) => {
    rewardsRef.current = updated;
    StorageService.setRewards(rewardsKeyRef.current, updated);
    setRewards(updated);
  };

  // load the other kid's stars when the parent switches profiles
  useEffect(() => {
    if (rewardsKeyRef.current === rewardsKey) return;
    rewardsKeyRef.current = rewardsKey;
    rewardsRef.current = StorageService.getRewards(rewardsKey);
    setRewards(rewardsRef.current);
    setUnlockedQueue([]);
    setPointsToast(null);
  }, [rewardsKey]);

  const addStars = useCallback((amount: number, label?: string) => {
    if (amount <= 0) return;
    const current = rewardsRef.current;
    const stars = current.stars + amount;

    // stickers the kid can afford for the first time with these stars
    const readyStickers = stickersData.filter(
      sticker =>
        sticker.cost > current.stars &&
        sticker.cost <= stars &&
        !current.unlockedStickers.includes(sticker.id),
    );

    saveRewards({
      ...current,
      stars,
      totalEarned: current.totalEarned + amount,
    });

    setPointsToast({ id: Date.now(), amount, label });
    if (readyStickers.length) {
      setUnlockedQueue(prev => [...prev, ...readyStickers]);
    }
  }, []);

  const collectSticker = useCallback((stickerId: string) => {
    const current = rewardsRef.current;
    const sticker = stickersData.find(item => item.id === stickerId);
    if (
      !sticker ||
      current.unlockedStickers.includes(stickerId) ||
      current.stars < sticker.cost
    ) {
      return false;
    }
    saveRewards({
      ...current,
      stars: current.stars - sticker.cost,
      unlockedStickers: [...current.unlockedStickers, stickerId],
    });
    return true;
  }, []);

  const addTrophy = useCallback((trophyId: string) => {
    const current = rewardsRef.current;
    if (current.trophies.includes(trophyId)) return;
    saveRewards({ ...current, trophies: [...current.trophies, trophyId] });
  }, []);

  // first finish pays full stars, every replay pays half of the run before it
  const getRewardMultiplier = useCallback((activityId: string) => {
    return Math.pow(0.5, getActivityRuns(rewardsRef.current, activityId));
  }, []);

  const completeActivityRun = useCallback((activityId: string) => {
    const current = rewardsRef.current;
    saveRewards({
      ...current,
      activityRuns: {
        ...current.activityRuns,
        [activityId]: getActivityRuns(current, activityId) + 1,
      },
    });
  }, []);

  const resetRewards = useCallback(() => {
    saveRewards(DEFAULT_REWARDS);
    setUnlockedQueue([]);
    setPointsToast(null);
  }, []);

  const dismissUnlocked = useCallback(() => {
    setUnlockedQueue(prev => prev.slice(1));
  }, []);

  const value = useMemo(
    () => ({
      rewards,
      pointsToast,
      unlockedQueue,
      addStars,
      addTrophy,
      getRewardMultiplier,
      completeActivityRun,
      collectSticker,
      resetRewards,
      dismissUnlocked,
    }),
    [
      rewards,
      pointsToast,
      unlockedQueue,
      addStars,
      addTrophy,
      getRewardMultiplier,
      completeActivityRun,
      collectSticker,
      resetRewards,
      dismissUnlocked,
    ],
  );

  return (
    <RewardsContext.Provider value={value}>
      {children}
      <PointsToast />
    </RewardsContext.Provider>
  );
};
