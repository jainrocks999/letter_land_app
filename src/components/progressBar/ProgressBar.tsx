import { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { rf } from '../../utils/responsive';

const ProgressBar = ({
  progress,
  bgColor,
}: {
  progress: number;
  bgColor?: string;
}) => {
  const fill = useSharedValue(0);
  const trackWidth = useSharedValue(0);
  const isFocused = useIsFocused();

  // Progress often changes while this screen is hidden under another one (Home
  // updates as the kid leaves an activity), so the bar fills once its screen is
  // back on top, where the kid can see it.
  useEffect(() => {
    if (!isFocused) return;
    fill.value = withTiming(Math.max(0, Math.min(progress / 100, 1)), {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, isFocused, fill]);

  const handleLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  // The fill is always full width and slides in from the left. Animating `width`
  // instead got reset to 0 on iOS whenever the card re-rendered, so the bar only
  // showed the saved progress after an app restart.
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: trackWidth.value > 0 ? 1 : 0,
    transform: [{ translateX: (fill.value - 1) * trackWidth.value }],
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[styles.container, { backgroundColor: bgColor || '#e7e7e7' }]}
    >
      <Animated.View style={[styles.fill, animatedStyle]}>
        <LinearGradient
          colors={['#8BE15A', '#49C92C']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: rf(15),
    borderRadius: 20,
    overflow: 'hidden',
  },
  fill: { ...StyleSheet.absoluteFill },
  gradient: { flex: 1, borderRadius: 20 },
});
