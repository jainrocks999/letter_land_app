import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import React, { useEffect } from 'react';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import CustomButton from '../customButton/CustomButton';
import { isTablet, rf } from '../../utils/responsive';
import MusicService from '../../services/music.service';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onRestart?: () => void;
  characterImage: any;
  title?: string;
  message?: string;
  closeBtnText?: string;
  restartBtnText?: string;
}

const SuccessModal = ({
  visible,
  onClose,
  onRestart,
  characterImage,
  title = '🎉 Amazing!',
  message = 'You completed all the activities correctly!',
  closeBtnText = 'Home',
  restartBtnText = 'Play Again',
}: SuccessModalProps) => {
  useEffect(() => {
    if (visible) {
      MusicService.playEffect('levelComplete');
    }
  }, [visible]);

  if (!visible) {
    return null;
  }
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View pointerEvents="none" style={{ position: 'absolute', zIndex: 1 }}>
          <LottieAnimation
            animation={require('../../assets/animations/success.json')}
            size={500}
            loop={false}
          />
        </View>
        <Image
          source={characterImage}
          style={styles.character}
          resizeMode="contain"
        />
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonRow}>
          {onRestart && (
            <CustomButton
              width={'40%'}
              bottomBorderColor="#d84e16"
              colors={['#ff7b38', '#ff6425']}
              onPress={onRestart}
              padding={rf(12)}
              paddingBottom={rf(9)}
              btnRadius={rf(15)}
            >
              <Text style={[styles.buttonText]}>{restartBtnText}</Text>
            </CustomButton>
          )}
          <CustomButton
            width={'40%'}
            bottomBorderColor="#0d8f3e"
            colors={['#35c46b', '#1ca952']}
            onPress={onClose}
            padding={12}
            paddingBottom={9}
            btnRadius={15}
          >
            <Text style={styles.buttonText}>{closeBtnText}</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export default SuccessModal;

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
    width: '82%',
    maxWidth: isTablet() ? 480 : 380,
    backgroundColor: '#fff',
    borderRadius: rf(30),
    padding: rf(25),
    alignItems: 'center',
    elevation: 20,
  },

  character: {
    width: rf(180),
    height: rf(180),
  },

  title: {
    fontSize: rf(28),
    marginBottom: rf(12),
    fontFamily: 'Fredoka-Bold',
    color: '#1a105f',
    textAlign: 'center',
  },

  message: {
    fontSize: rf(16),
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Fredoka-Medium',
    marginBottom: rf(25),
  },

  buttonRow: {
    flexDirection: 'row',
    gap: rf(12),
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    paddingVertical:Platform.OS=='ios'? rf(12):0,
    color: '#fff',
    fontSize: rf(16),
    fontFamily: 'Fredoka-Bold',
    flex: 1,
    textAlign: 'center',
  },
});
