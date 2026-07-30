import { PropsWithChildren } from 'react';
import { ActivityProProvider } from '../contexts';

const AppProviders = ({ children }: PropsWithChildren) => {
  return <ActivityProProvider>{children}</ActivityProProvider>;
};

export default AppProviders;
