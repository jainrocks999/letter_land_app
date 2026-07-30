import { StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { wp } from '../../utils/Responsive';
import LinearGradient from 'react-native-linear-gradient';

interface AnimatedGradientProps {
  index: number;
  scrollX: SharedValue<number>;
  colors: [string, string];
}

const ITEM_WIDTH = wp(85);

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  index,
  scrollX,
  colors,
}) => {
  const inputRange = [
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
    (index + 1) * ITEM_WIDTH,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientSection}
      />
    </Animated.View>
  );
};

export default AnimatedGradient;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientSection: {
    width: '100%',
    height: '100%',
  },
});
