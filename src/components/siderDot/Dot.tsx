import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { wp } from '../../utils/responsive';
import { StyleSheet } from 'react-native';

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
}

const Dot: React.FC<DotProps> = ({ index, scrollX }) => {
  const dotWp = wp(100);

  const animatedStyle = useAnimatedStyle(() => {
    const inputeRage = [
      (index - 1) * dotWp,
      index * dotWp,
      (index + 1) * dotWp,
    ];
    const width = interpolate(
      scrollX.value,
      inputeRage,
      [16, 28, 16],
      Extrapolation.CLAMP,
    );
    const backgroundColor = interpolateColor(scrollX.value, inputeRage, [
      '#fff',
      '#ffe8e0',
      '#fff',
    ]);
    const borderColor = interpolateColor(scrollX.value, inputeRage, [
      '#9e9e9e',
      '#ff7b38',
      '#9e9e9e',
    ]);
    return {
      width,
      backgroundColor,
      borderColor,
    };
  });

  return <Animated.View key={index} style={[styles.dot, animatedStyle]} />;
};

export default Dot;

const styles = StyleSheet.create({
  dot: {
    height: 16,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1.5,
  },
});
