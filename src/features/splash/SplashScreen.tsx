import { View, Text, Image, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { styles } from './Splash.styles';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../app/navigation/routeNames';
import { StackNavigationProps } from '../../types/navigation';
import StorageService from '../../services/mmkv.service';
import { STORAGE_KEYS } from '../../config/constants';

const SplashScreen = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const animation = useRef(new Animated.Value(0)).current;

  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.SPLASH>>();

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Float +Rotate
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setTimeout(() => {
      if (StorageService.getIsOnBorading(STORAGE_KEYS.IS_ONBORDING)) {
        navigation.replace(ROUTES.HOME);
      } else {
        navigation.replace(ROUTES.ONBOARDING);
      }
    }, 3000);
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-0.86deg', '0.86deg'],
  });
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/splash.png')}
        style={[
          styles.imgSection,
          { opacity, transform: [{ translateY }, { rotate }] },
        ]}
      />
    </View>
  );
};

export default SplashScreen;
