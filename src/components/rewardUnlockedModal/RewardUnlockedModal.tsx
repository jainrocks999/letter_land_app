import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import CustomButton from '../customButton/CustomButton';
import TTSService from '../../services/tts.service';

const RewardUnlockedModal = () => {
  const { unlockedQueue, dismissUnlocked } = useRewardsContext();
  const sticker = unlockedQueue[0];
  const wiggle = useSharedValue(0);

  useEffect(() => {
    if (!sticker) return;
    TTSService.speak(
      `Wow! You have enough stars for the ${sticker.name} sticker! Collect it in the Treasure Room!`,
    );
    wiggle.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 250 }),
        withTiming(8, { duration: 250 }),
      ),
      -1,
      true,
    );
  }, [sticker, wiggle]);

  const wiggleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wiggle.value}deg` }],
  }));

  if (!sticker) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Animated.View
        key={sticker.id}
        entering={BounceIn.duration(700)}
        style={[styles.card, { borderColor: sticker.darkColor }]}
      >
        <View pointerEvents="none" style={styles.confetti}>
          <LottieAnimation
            animation={require('../../assets/animations/Confetti.json')}
            size={420}
            loop={false}
          />
        </View>
        <Text style={styles.ribbon}>🎁 Sticker Ready!</Text>
        <LinearGradient
          colors={[sticker.color, '#ffffff']}
          style={[styles.stickerCircle, { borderColor: sticker.darkColor }]}
        >
          <Animated.Text style={[styles.emoji, wiggleStyle]}>
            {sticker.emoji}
          </Animated.Text>
        </LinearGradient>
        <Text style={[styles.title, { color: sticker.darkColor }]}>
          {sticker.name}
        </Text>
        <Text style={styles.message}>
          You have {sticker.cost} stars! Tap it in the Treasure Room to put it
          in your sticker book.
        </Text>
        <CustomButton
          width={'70%'}
          bottomBorderColor="#0d8f3e"
          colors={['#35c46b', '#1ca952']}
          onPress={dismissUnlocked}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <Text style={styles.buttonText}>Yay! 🎉</Text>
        </CustomButton>
      </Animated.View>
    </View>
  );
};

export default RewardUnlockedModal;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10001,
    elevation: 10001,
  },
  card: {
    width: '82%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 3,
    borderBottomWidth: 10,
    padding: 25,
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    top: -60,
    zIndex: 1,
  },
  ribbon: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#ff6425',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: -45,
    marginBottom: 15,
  },
  stickerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 85 },
  title: {
    fontSize: 28,
    marginTop: 12,
    fontFamily: 'Fredoka-Bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Fredoka-Medium',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    flex: 1,
    textAlign: 'center',
  },
});
