import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StickerType } from '../data/rewards.data';
import { styles as rewardStyles } from '../Rewards.styles';

export type StickerStatus = 'collected' | 'ready' | 'locked';

export interface SlotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StickerSlotProps {
  sticker: StickerType;
  status: StickerStatus;
  isFlying: boolean;
  justLanded: boolean;
  disabled: boolean;
  onPress: (
    sticker: StickerType,
    status: StickerStatus,
    rect: SlotRect,
  ) => void;
}

const StickerSlot: React.FC<StickerSlotProps> = ({
  sticker,
  status,
  isFlying,
  justLanded,
  disabled,
  onPress,
}) => {
  const slotRef = useRef<View>(null);
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const giftPulse = useSharedValue(1);

  // a sticker the kid can afford keeps pulsing to invite a tap
  useEffect(() => {
    if (status === 'ready') {
      giftPulse.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 450 }),
          withTiming(1, { duration: 450 }),
        ),
        -1,
      );
    } else {
      cancelAnimation(giftPulse);
      giftPulse.value = 1;
    }
  }, [status, giftPulse]);

  // pop when the flying sticker lands in its slot
  useEffect(() => {
    if (justLanded) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 140 }),
        withSpring(1, { damping: 4 }),
      );
    }
  }, [justLanded, scale]);

  const handlePress = () => {
    if (status === 'locked') {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    } else if (status === 'collected') {
      scale.value = withSequence(
        withTiming(1.15, { duration: 120 }),
        withSpring(1, { damping: 4 }),
      );
    }
    slotRef.current?.measureInWindow((x, y, width, height) => {
      onPress(sticker, status, { x, y, width, height });
    });
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const giftStyle = useAnimatedStyle(() => ({
    transform: [{ scale: giftPulse.value }],
  }));

  const isCollected = status === 'collected' && !isFlying;

  return (
    <Animated.View style={[styles.wrapper, cardStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={handlePress}
        style={[
          rewardStyles.trophyCard,
          styles.card,
          isCollected
            ? { backgroundColor: sticker.color, borderColor: sticker.darkColor }
            : status === 'ready'
            ? styles.readyCard
            : isFlying
            ? styles.emptyCard
            : styles.lockedCard,
        ]}
      >
        {!isCollected && !isFlying && (
          <Animated.View style={[styles.statusIcon, giftStyle]}>
            <FontAwesome6
              name={status === 'ready' ? 'gift' : 'lock'}
              iconStyle="solid"
              size={20}
              color={status === 'ready' ? '#f07a45' : 'gray'}
            />
          </Animated.View>
        )}
        <View ref={slotRef} collapsable={false}>
          <Text
            style={[
              styles.emoji,
              { backgroundColor: `${sticker.darkColor}80` },
              !isCollected && styles.emojiHidden,
              isFlying && styles.invisible,
            ]}
          >
            {sticker.emoji}
          </Text>
        </View>
        {isCollected ? (
          <Text
            numberOfLines={1}
            style={[styles.name, { color: sticker.darkColor }]}
          >
            {sticker.name}
          </Text>
        ) : (
          <Text
            style={[
              rewardStyles.pointsText,
              status === 'locked' && styles.lockedText,
            ]}
          >
            {sticker.cost} ⭐
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default StickerSlot;

const styles = StyleSheet.create({
  wrapper: { width: '32%' },
  card: { width: '100%' },
  readyCard: { backgroundColor: '#fdf1e9', borderColor: '#f07a45' },
  lockedCard: { backgroundColor: '#fbf4e4', borderColor: '#f3d27a' },
  emptyCard: {
    backgroundColor: '#fffaf0',
    borderColor: '#f3d27a',
    borderStyle: 'dashed',
  },
  statusIcon: { position: 'absolute', zIndex: 99, top: 28 },
  emoji: {
    padding: 5,
    borderRadius: 10,
    fontSize: 30,
    overflow: 'hidden',
  },
  emojiHidden: { opacity: 0.2 },
  invisible: { opacity: 0 },
  name: { fontFamily: 'Fredoka-Bold', fontSize: 12 },
  lockedText: { color: 'gray' },
});
