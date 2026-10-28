import { useContext } from 'react';
import { RewardsContext } from './RewardsContext';

const useRewardsContext = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewardsContext must be used within RewardsProvider');
  }
  return context;
};

export default useRewardsContext;
