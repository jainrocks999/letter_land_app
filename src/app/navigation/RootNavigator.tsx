import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../features/splash/SplashScreen';
import OnBoardingScreen from '../../features/onBoarding/OnBoardingScreen';
import HomeScreen from '../../features/home/HomeScreen';
import LearningScreen from '../../features/learning/LearningScreen';
import { RootStackParamList } from './types';
import { ROUTES } from './routeNames';
import TracingScreen from '../../features/tracing/TracingScreen';
import SearchingScreen from '../../features/searching/SearchingScreen';
import MatchingScreen from '../../features/matching/MatchingScreen';
import FeedingScreen from '../../features/feeding/FeedingScreen';
import FillingLetterScreen from '../../features/filling/FillingLetterScreen';

const RootNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.SPLASH}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Stack.Screen name={ROUTES.ONBOARDING} component={OnBoardingScreen} />
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.LEARNING} component={LearningScreen} />
        <Stack.Screen name={ROUTES.TRACING} component={TracingScreen} />
        <Stack.Screen name={ROUTES.FEEDING} component={FeedingScreen} />
        <Stack.Screen name={ROUTES.SEARCHING} component={SearchingScreen} />
        <Stack.Screen name={ROUTES.MATCHING} component={MatchingScreen} />
        <Stack.Screen name={ROUTES.FILLING} component={FillingLetterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
