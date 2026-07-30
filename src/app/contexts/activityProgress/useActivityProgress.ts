import { useContext } from 'react';
import { ActivityProgressContext } from './ActivityProgressContext';

const useActivityProContext = () => {
  const context = useContext(ActivityProgressContext);
  if (!context) {
    throw new Error(
      'useActivityProContext must be used within ActivityProProvider',
    );
  }
  return context;
};

export default useActivityProContext;
