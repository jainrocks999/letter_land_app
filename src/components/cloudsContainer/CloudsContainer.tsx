import { View } from 'react-native';
import { styles } from './CloudsContainer.styles';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React from 'react';

interface CloudsContainerProps {
  scrollX: SharedValue<number>;
}

const CloudsContainer: React.FC<CloudsContainerProps> = ({ scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [0, 1000],
      [0, -1000 * 0.05],
      Extrapolation.EXTEND,
    );
    return { transform: [{ translateX }] };
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        source={require('../../assets/images/clouds/cloud_mid.png')}
        style={[styles.clouds, styles.cloud1, animatedStyle]}
      />
      <Animated.Image
        source={require('../../assets/images/clouds/cloud_sm.png')}
        style={[styles.clouds, styles.cloud2, animatedStyle]}
      />

      <Animated.Image
        source={require('../../assets/images/clouds/cloud_mid.png')}
        style={[styles.clouds, styles.cloud7, animatedStyle]}
      />
      <Animated.Image
        source={require('../../assets/images/clouds/cloud_lg.png')}
        style={[styles.clouds, styles.cloud3, animatedStyle]}
      />
      <Animated.Image
        source={require('../../assets/images/clouds/cloud_sm.png')}
        style={[styles.clouds, styles.cloud4, animatedStyle]}
      />
      <Animated.Image
        source={require('../../assets/images/clouds/cloud_mid.png')}
        style={[styles.clouds, styles.cloud5, animatedStyle]}
      />
      <Animated.Image
        source={require('../../assets/images/clouds/cloud_lg.png')}
        style={[styles.clouds, styles.cloud6, animatedStyle]}
      />
    </View>
  );
};

export default CloudsContainer;
