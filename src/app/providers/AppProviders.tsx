import { PropsWithChildren } from 'react';
import {
  ActivityProProvider,
  ProfilesProvider,
  RewardsProvider,
  SettingsProvider,
  ToastProvider,
} from '../contexts';

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <ProfilesProvider>
          <ActivityProProvider>
            <RewardsProvider>{children}</RewardsProvider>
          </ActivityProProvider>
        </ProfilesProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

export default AppProviders;
