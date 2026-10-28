import { useCallback, useRef } from 'react';
import { REWARD_POINTS } from '../config/constants';
import { ActivityCard } from '../features/home/data/home.data';
import useRewardsContext from '../app/contexts/rewards/useRewards';

const comboLabels = ['Super Combo!', 'On Fire!', 'Unstoppable!', 'Superstar!'];

// star rewards for a single activity session: answers, combos and the finish bonus
const useActivityRewards = (data: ActivityCard) => {
  const { addStars, addTrophy } = useRewardsContext();
  const streakRef = useRef(0);
  const completedRef = useRef(false);

  const rewardCorrect = useCallback(
    (amount: number = REWARD_POINTS.CORRECT) => {
      streakRef.current += 1;
      const isCombo = streakRef.current % REWARD_POINTS.COMBO_EVERY === 0;
      if (isCombo) {
        const label =
          comboLabels[Math.floor(Math.random() * comboLabels.length)];
        addStars(amount + REWARD_POINTS.COMBO_BONUS, label);
      } else {
        addStars(amount);
      }
    },
    [addStars],
  );

  const rewardWrong = useCallback(() => {
    streakRef.current = 0;
  }, []);

  const rewardComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (data.navigate) {
      addTrophy(data.navigate.toLowerCase());
    }
    addStars(REWARD_POINTS.ACTIVITY_COMPLETE, 'Activity Complete!');
  }, [addStars, addTrophy, data.navigate]);

  return { rewardCorrect, rewardWrong, rewardComplete, addStars };
};

export default useActivityRewards;
