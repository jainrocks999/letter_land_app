import { useContext } from 'react';
import { ProfilesContext } from './ProfilesContext';

const useProfilesContext = () => {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error('useProfilesContext must be used within ProfilesProvider');
  }
  return context;
};

export default useProfilesContext;
