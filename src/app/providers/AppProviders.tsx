import { PropsWithChildren } from 'react';
import {
  ActivityProProvider,
  RewardsProvider,
  SettingsProvider,
} from '../contexts';

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <SettingsProvider>
      <ActivityProProvider>
        <RewardsProvider>{children}</RewardsProvider>
      </ActivityProProvider>
    </SettingsProvider>
  );
};

export default AppProviders;
