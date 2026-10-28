import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Castle } from '../../features/home/data/home.data';

interface StarCounterProps {
  onPress?: () => void;
  size?: 'small' | 'large';
  data?: Castle;
}

const DEFAULT_BG_COLOR = '#ffd84d';
const DEFAULT_BORDER_COLOR = '#e09b00';
const COLOR_DURATION = 500;

const StarCounter: React.FC<StarCounterProps> = ({
  onPress,
  size = 'small',
  data,
}) => {
  const { rewards } = useRewardsContext();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const prevStars = useRef(rewards.stars);

  const cardColors = data?.innerCard;
  const targetBg = cardColors ? `${cardColors.lightColor}99` : DEFAULT_BG_COLOR;
  const targetBorder = cardColors?.darkColor ?? DEFAULT_BORDER_COLOR;
  const bgColor = useSharedValue(targetBg);
  const borderColor = useSharedValue(targetBorder);

  // fade to the new castle colors instead of jumping when the carousel changes
  useEffect(() => {
    bgColor.value = withTiming(targetBg, { duration: COLOR_DURATION });
    borderColor.value = withTiming(targetBorder, { duration: COLOR_DURATION });
  }, [targetBg, targetBorder, bgColor, borderColor]);

  const colorStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
    borderColor: borderColor.value,
  }));

  useEffect(() => {
    if (rewards.stars > prevStars.current) {
      scale.value = withSequence(
        withTiming(1.35, { duration: 150 }),
        withSpring(1, { damping: 4 }),
      );
      rotate.value = withSequence(
        withTiming(-15, { duration: 100 }),
        withTiming(15, { duration: 100 }),
        withSpring(0, { damping: 5 }),
      );
    }
    prevStars.current = rewards.stars;
  }, [rewards.stars, scale, rotate]);

  const isLarge = size === 'large';

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <Animated.View
        style={[styles.pill, isLarge && styles.pillLarge, colorStyle]}
      >
        <FontAwesome6 name="star" iconStyle="solid" size={20} color="#f5df00" />
        <Text style={[styles.count, isLarge && styles.countLarge]}>
          {rewards.stars}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default StarCounter;

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillLarge: { paddingVertical: 8, paddingHorizontal: 16, gap: 6 },
  star: { fontSize: 16 },
  starLarge: { fontSize: 22 },
  count: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 16,
    color: '#ffffff',
    minWidth: 18,
    textAlign: 'center',
  },
  countLarge: { fontSize: 20 },
});
