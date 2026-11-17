import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { hasReadySticker } from '../../features/rewards/data/rewards.data';
import { rf } from '../../utils/responsive';

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
  // red dot that hints there is a sticker waiting to be unlocked
  const showBadge = hasReadySticker(
    rewards.stars,
    rewards.unlockedStickers,
  );

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <Animated.View
        style={[styles.pill, isLarge && styles.pillLarge, colorStyle]}
      >
        <View style={styles.starIconWrapper}>
          <FontAwesome6
            name="star"
            iconStyle="solid"
            size={isLarge ? rf(24) : rf(20)}
            color="#f5df00"
          />
          {showBadge && (
            <View style={[styles.badge, { borderColor: targetBorder }]} />
          )}
        </View>
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
    gap: rf(4),
    borderWidth: 2,
    borderBottomWidth: rf(6),
    borderRadius: 999,
    paddingVertical: rf(4),
    paddingHorizontal: rf(10),
  },
  pillLarge: {
    paddingVertical: rf(8),
    paddingHorizontal: rf(16),
    gap: rf(6),
  },
  starIconWrapper: { position: 'relative' },
  count: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(16),
    color: '#ffffff',
    minWidth: rf(18),
    textAlign: 'center',
  },
  countLarge: { fontSize: rf(20) },
  badge: {
    position: 'absolute',
    top: -rf(8),
    right: rf(30),
    width: rf(16),
    height: rf(16),
    borderRadius: 999,
    backgroundColor: '#eee600',
    borderWidth: 2,
  },
});
