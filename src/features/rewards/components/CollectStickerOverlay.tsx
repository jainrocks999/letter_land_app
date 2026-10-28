import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import LottieAnimation from '../../../components/LottieAnimation/LottieAnimation';
import { StickerType } from '../data/rewards.data';
import { SlotRect } from './StickerSlot';

const SHOW_DURATION = 1500;
const FLY_DURATION = 650;
const BIG_EMOJI_SIZE = 110;
const SLOT_EMOJI_SIZE = 30;
const SPARKLES = ['✨', '⭐', '✨', '🌟', '✨', '⭐', '✨', '🌟'];

interface CollectStickerOverlayProps {
  sticker: StickerType;
  // slot position relative to the overlay's top-left corner
  target: SlotRect;
  overlaySize: { width: number; height: number };
  onLanded: () => void;
}

// big sticker pops in the middle, spins with sparkles, then flies into its book slot
const CollectStickerOverlay: React.FC<CollectStickerOverlayProps> = ({
  sticker,
  target,
  overlaySize,
  onLanded,
}) => {
  const backdrop = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotate = useSharedValue(-180);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const raysRotate = useSharedValue(0);
  const raysOpacity = useSharedValue(0);

  useEffect(() => {
    const toX = target.x + target.width / 2 - overlaySize.width / 2;
    const toY = target.y + target.height / 2 - overlaySize.height / 2;
    const flyEasing = Easing.inOut(Easing.cubic);

    backdrop.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(SHOW_DURATION - 200, withTiming(0, { duration: FLY_DURATION })),
    );
    scale.value = withSequence(
      withTiming(1.15, { duration: 500, easing: Easing.out(Easing.back(3)) }),
      withDelay(
        SHOW_DURATION - 500,
        withTiming(SLOT_EMOJI_SIZE / BIG_EMOJI_SIZE, {
          duration: FLY_DURATION,
          easing: flyEasing,
        }),
      ),
    );
    rotate.value = withSequence(
      withTiming(0, { duration: 600, easing: Easing.out(Easing.back(2)) }),
      withDelay(
        SHOW_DURATION - 600,
        withTiming(360, { duration: FLY_DURATION, easing: flyEasing }),
      ),
    );
    translateX.value = withDelay(
      SHOW_DURATION,
      withTiming(toX, { duration: FLY_DURATION, easing: flyEasing }),
    );
    translateY.value = withDelay(
      SHOW_DURATION,
      withTiming(toY, { duration: FLY_DURATION, easing: flyEasing }),
    );
    raysRotate.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
    );
    raysOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(SHOW_DURATION - 300, withTiming(0, { duration: 250 })),
    );

    const timer = setTimeout(onLanded, SHOW_DURATION + FLY_DURATION);
    return () => clearTimeout(timer);
    // plays once per mount; the parent remounts the overlay for each sticker
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const stickerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const raysStyle = useAnimatedStyle(() => ({
    opacity: raysOpacity.value,
    transform: [{ rotate: `${raysRotate.value}deg` }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: raysOpacity.value,
  }));

  return (
    <View pointerEvents="auto" style={styles.overlay}>
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <Animated.View pointerEvents="none" style={[styles.rays, raysStyle]}>
        {SPARKLES.map((sparkle, index) => {
          const angle = (index / SPARKLES.length) * 2 * Math.PI;
          return (
            <Text
              key={index}
              style={[
                styles.sparkle,
                {
                  transform: [
                    { translateX: Math.cos(angle) * 120 },
                    { translateY: Math.sin(angle) * 120 },
                  ],
                },
              ]}
            >
              {sparkle}
            </Text>
          );
        })}
      </Animated.View>

      <View pointerEvents="none" style={styles.confetti}>
        <LottieAnimation
          animation={require('../../../assets/animations/Confetti.json')}
          size={overlaySize.width}
          loop={false}
        />
      </View>

      <Animated.View style={stickerStyle}>
        <LinearGradient
          colors={[sticker.color, '#ffffff']}
          style={[styles.stickerCircle, { borderColor: sticker.darkColor }]}
        >
          <Text style={styles.bigEmoji}>{sticker.emoji}</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.labelBox, labelStyle]}>
        <Animated.Text entering={BounceIn.delay(250)} style={styles.ribbon}>
          Sticker Collected!
        </Animated.Text>
        <Text style={[styles.name, { color: sticker.color }]}>
          {sticker.name}
        </Text>
      </Animated.View>
    </View>
  );
};

export default CollectStickerOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26, 16, 95, 0.6)',
  },
  rays: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: { position: 'absolute', fontSize: 28 },
  confetti: { position: 'absolute' },
  stickerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 5,
    borderBottomWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigEmoji: { fontSize: BIG_EMOJI_SIZE },
  labelBox: {
    position: 'absolute',
    alignItems: 'center',
    top: '68%',
  },
  ribbon: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: '#fff',
    backgroundColor: '#ff6425',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 999,
    overflow: 'hidden',
  },
  name: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 22,
    marginTop: 8,
  },
});
