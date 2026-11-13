import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import CustomButton from '../customButton/CustomButton';
import MusicService from '../../services/music.service';
import TTSService from '../../services/tts.service';
import { Castle } from '../../features/home/data/home.data';

interface LevelUnlockedModalProps {
  visible: boolean;
  level: Castle | null;
  onClose: () => void;
}

// celebration shown right after a collected sticker opens a new level
const LevelUnlockedModal = ({
  visible,
  level,
  onClose,
}: LevelUnlockedModalProps) => {
  useEffect(() => {
    if (!visible || !level) return;
    MusicService.playEffect('levelComplete');
    TTSService.speak(
      `Congratulations! You unlocked ${level.innerCard.cardTitle}!`,
    );
  }, [visible, level]);

  if (!visible || !level) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View pointerEvents="none" style={styles.lottie}>
          <LottieAnimation
            animation={require('../../assets/animations/success.json')}
            size={440}
            loop={false}
          />
        </View>

        <Text style={styles.ribbon}>🎉 Level Unlocked!</Text>

        <Image
          source={level.image}
          style={styles.castle}
          resizeMode="contain"
        />

        <Text style={styles.title}>{level.innerCard.cardTitle}</Text>
        <Text style={styles.message}>
          You collected enough stickers to open a new level. Let&apos;s play!
        </Text>

        <CustomButton
          width={'65%'}
          bottomBorderColor="#0d8f3e"
          colors={['#35c46b', '#1ca952']}
          onPress={onClose}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <Text style={styles.buttonText}>Yay!</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export default LevelUnlockedModal;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    width: '84%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 22,
    alignItems: 'center',
    elevation: 20,
  },
  lottie: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
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
    marginTop: 6,
    zIndex: 2,
  },
  castle: {
    width: 170,
    height: 170,
    marginTop: 8,
  },
  title: {
    fontSize: 26,
    marginBottom: 8,
    fontFamily: 'Fredoka-Bold',
    color: '#1a105f',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Fredoka-Medium',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    flex: 1,
    textAlign: 'center',
  },
});
