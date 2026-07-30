import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/navigation/types';
import { RouteProp } from '@react-navigation/native';

export type StackNavigationProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type StackRouteProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
