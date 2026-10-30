import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { REWARD_POINTS } from '../config/constants';
import { ActivityCard } from '../features/home/data/home.data';
import useRewardsContext from '../app/contexts/rewards/useRewards';
import useProfilesContext from '../app/contexts/profiles/useProfiles';
import StatsService from '../services/stats.service';

const comboLabels = ['Super Combo!', 'On Fire!', 'Unstoppable!', 'Superstar!'];
// an app left open on one screen shouldn't count as hours of practice
const MAX_SESSION_SECONDS = 30 * 60;

// star rewards for a single activity session: answers, combos and the finish bonus
// replays of a finished activity pay half of the run before it, never less than 1 star
const useActivityRewards = (data: ActivityCard) => {
  const {
    addStars: addRawStars,
    addTrophy,
    getRewardMultiplier,
    completeActivityRun,
  } = useRewardsContext();
  const { activeProfileId } = useProfilesContext();
  const activityId = (data.navigate ?? data.cardTitle).toLowerCase();
  const streakRef = useRef(0);
  const completedRef = useRef(false);
  const multiplierRef = useRef<number | null>(null);
  if (multiplierRef.current === null) {
    multiplierRef.current = getRewardMultiplier(activityId);
  }
  // fractions of a star left over from scaling, so small rewards still add up
  const carryRef = useRef(0);
  const roundEarnedRef = useRef(0);

  // parent dashboard stats: plays and time spent, paused while the app is in the background
  useEffect(() => {
    StatsService.recordPlay(activeProfileId, activityId);
    let startedAt = Date.now();
    const saveTime = () => {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      startedAt = Date.now();
      StatsService.recordTime(
        activeProfileId,
        activityId,
        Math.min(seconds, MAX_SESSION_SECONDS),
      );
    };
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        startedAt = Date.now();
      } else {
        saveTime();
      }
    });
    return () => {
      sub.remove();
      if (AppState.currentState === 'active') saveTime();
    };
  }, [activeProfileId, activityId]);

  const addStars = useCallback(
    (amount: number, label?: string) => {
      const scaled = amount * (multiplierRef.current ?? 1) + carryRef.current;
      const whole = Math.floor(scaled);
      carryRef.current = scaled - whole;
      roundEarnedRef.current += whole;
      addRawStars(whole, label);
      StatsService.recordStars(activeProfileId, activityId, whole);
    },
    [addRawStars, activeProfileId, activityId],
  );

  const rewardCorrect = useCallback(
    (amount: number = REWARD_POINTS.CORRECT) => {
      streakRef.current += 1;
      StatsService.recordAnswer(activeProfileId, activityId, true);
      const isCombo = streakRef.current % REWARD_POINTS.COMBO_EVERY === 0;
      if (isCombo) {
        const label =
          comboLabels[Math.floor(Math.random() * comboLabels.length)];
        addStars(amount + REWARD_POINTS.COMBO_BONUS, label);
      } else {
        addStars(amount);
      }
    },
    [addStars, activeProfileId, activityId],
  );

  const rewardWrong = useCallback(() => {
    streakRef.current = 0;
    StatsService.recordAnswer(activeProfileId, activityId, false);
  }, [activeProfileId, activityId]);

  const rewardComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (data.navigate) {
      addTrophy(activityId);
    }
    const scaled =
      REWARD_POINTS.ACTIVITY_COMPLETE * (multiplierRef.current ?? 1) +
      carryRef.current;
    let bonus = Math.floor(scaled);
    if (roundEarnedRef.current + bonus < 1) {
      bonus = 1;
    }
    carryRef.current = 0;
    roundEarnedRef.current += bonus;
    addRawStars(bonus, 'Activity Complete!');
    completeActivityRun(activityId);
    StatsService.recordStars(activeProfileId, activityId, bonus);
    StatsService.recordCompletion(activeProfileId, activityId);
  }, [
    addRawStars,
    addTrophy,
    completeActivityRun,
    activeProfileId,
    activityId,
    data.navigate,
  ]);

  // call when the kid taps "play again" without leaving the screen
  const startNewRound = useCallback(() => {
    if (!completedRef.current) return;
    completedRef.current = false;
    streakRef.current = 0;
    carryRef.current = 0;
    roundEarnedRef.current = 0;
    multiplierRef.current = getRewardMultiplier(activityId);
    StatsService.recordPlay(activeProfileId, activityId);
  }, [getRewardMultiplier, activeProfileId, activityId]);

  return {
    rewardCorrect,
    rewardWrong,
    rewardComplete,
    startNewRound,
    addStars,
  };
};

export default useActivityRewards;
