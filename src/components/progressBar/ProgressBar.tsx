import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ProgressBar = ({
  progress,
  bgColor,
}: {
  progress: number;
  bgColor?: string;
}) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(progress / 100, 1)), {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));
  return (
    <View style={[styles.container, { backgroundColor: bgColor || '#e7e7e7' }]}>
      <Animated.View style={[styles.progressContainer, animatedStyle]}>
        <LinearGradient
          colors={['#8BE15A', '#49C92C']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.progress}
        />
      </Animated.View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressContainer: { height: '100%' },
  progress: { flex: 1, borderRadius: 20 },
});
