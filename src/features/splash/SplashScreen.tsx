import { View } from 'react-native';
import React, { useEffect } from 'react';
import { styles } from './Splash.styles';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../app/navigation/routeNames';
import { StackNavigationProps } from '../../types/navigation.types';
import StorageService from '../../services/mmkv.service';
import { STORAGE_KEYS } from '../../config/constants';
import Video from 'react-native-video';

const SplashScreen = () => {
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.SPLASH>>();

  const handleVideoEnd = () => {
    if (StorageService.getIsOnBorading(STORAGE_KEYS.IS_ONBORDING)) {
      navigation.replace(ROUTES.HOME);
    } else {
      navigation.replace(ROUTES.ONBOARDING);
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (StorageService.getIsOnBorading(STORAGE_KEYS.IS_ONBORDING)) {
  //       navigation.replace(ROUTES.HOME);
  //     } else {
  //       navigation.replace(ROUTES.ONBOARDING);
  //     }
  //   }, 3000);
  // }, []);

  return (
    <View style={styles.container}>
      <Video
        resizeMode="stretch"
        source={require('../../assets/video/splash.mp4')}
        style={{
          width: '100%',
          height: '100%',
        }}
        onEnd={handleVideoEnd}
        onError={err => {
          console.log('splash video error:', err);
          handleVideoEnd();
        }}
      />
    </View>
  );
};

export default SplashScreen;
