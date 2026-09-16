import { ActivityCard } from '../../features/home/data/home.data';
import { ROUTES } from './routeNames';

export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.LEARNING]: { data: ActivityCard };
  [ROUTES.TRACING]: { data: ActivityCard };
  [ROUTES.FEEDING]: { data: ActivityCard };
  [ROUTES.SEARCHING]: { data: ActivityCard };
  [ROUTES.MATCHING]: { data: ActivityCard };
  [ROUTES.FILLING]: { data: ActivityCard };
};
