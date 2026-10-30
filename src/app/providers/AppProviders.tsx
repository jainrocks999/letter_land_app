import { PropsWithChildren } from 'react';
import {
  ActivityProProvider,
  ProfilesProvider,
  RewardsProvider,
  SettingsProvider,
} from '../contexts';

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <SettingsProvider>
      <ProfilesProvider>
        <ActivityProProvider>
          <RewardsProvider>{children}</RewardsProvider>
        </ActivityProProvider>
      </ProfilesProvider>
    </SettingsProvider>
  );
};

export default AppProviders;
