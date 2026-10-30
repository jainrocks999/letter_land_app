import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../features/splash/SplashScreen';
import OnBoardingScreen from '../../features/onBoarding/OnBoardingScreen';
import HomeScreen from '../../features/home/HomeScreen';
import CreateProfileScreen from '../../features/createProfile/CreateProfileScreen';
import LearningScreen from '../../features/learning/LearningScreen';
import { RootStackParamList } from './types';
import { ROUTES } from './routeNames';
import TracingScreen from '../../features/tracing/TracingScreen';
import SearchingScreen from '../../features/searching/SearchingScreen';
import MatchingScreen from '../../features/matching/MatchingScreen';
import FeedingScreen from '../../features/feeding/FeedingScreen';
import FillingLetterScreen from '../../features/filling/FillingLetterScreen';
import RewardsScreen from '../../features/rewards/RewardsScreen';
import ParentDashboardScreen from '../../features/parentDashboard/ParentDashboardScreen';
import MusicService from '../../services/music.service';
import SpellWordsScreen from '../../features/spellWords/SpellWordsScreen';

const ACTIVITY_ROUTES: string[] = [
  ROUTES.LEARNING,
  ROUTES.TRACING,
  ROUTES.FEEDING,
  ROUTES.SEARCHING,
  ROUTES.MATCHING,
  ROUTES.FILLING,
  ROUTES.SPELLING,
];

const RootNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const syncMusicTrack = () => {
    const routeName = navigationRef.getCurrentRoute()?.name;
    MusicService.setTrack(
      routeName && ACTIVITY_ROUTES.includes(routeName) ? 'activity' : 'home',
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={syncMusicTrack}
      onStateChange={syncMusicTrack}
    >
      <Stack.Navigator
        initialRouteName={ROUTES.SPLASH}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Stack.Screen name={ROUTES.ONBOARDING} component={OnBoardingScreen} />
        <Stack.Screen
          name={ROUTES.CREATE_PROFILE}
          component={CreateProfileScreen}
        />
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.LEARNING} component={LearningScreen} />
        <Stack.Screen name={ROUTES.TRACING} component={TracingScreen} />
        <Stack.Screen name={ROUTES.FEEDING} component={FeedingScreen} />
        <Stack.Screen name={ROUTES.SEARCHING} component={SearchingScreen} />
        <Stack.Screen name={ROUTES.MATCHING} component={MatchingScreen} />
        <Stack.Screen name={ROUTES.FILLING} component={FillingLetterScreen} />
        <Stack.Screen name={ROUTES.SPELLING} component={SpellWordsScreen} />
        <Stack.Screen name={ROUTES.REWARDS} component={RewardsScreen} />
        <Stack.Screen
          name={ROUTES.PARENT_DASHBOARD}
          component={ParentDashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
