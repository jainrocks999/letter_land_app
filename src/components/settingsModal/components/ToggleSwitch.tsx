import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { rf } from '../../../utils/responsive';

interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const TRACK_WIDTH = rf(62);
const KNOB_SIZE = rf(26);
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - rf(8);

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange }) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 14 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#d6d6d6', '#35c46b'],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#b5b5b5', '#0d8f3e'],
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * KNOB_TRAVEL }],
  }));

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
};

export default ToggleSwitch;

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: KNOB_SIZE + rf(12),
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: rf(5),
    padding: rf(3),
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#fff',
  },
});
