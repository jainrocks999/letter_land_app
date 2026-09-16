import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import CustomButton from '../customButton/CustomButton';
import { wp } from '../../utils/responsive';

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
              padding={12}
              paddingBottom={9}
              btnRadius={15}
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
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    elevation: 20,
  },

  character: {
    width: 180,
    height: 180,
  },

  title: {
    fontSize: 28,
    marginBottom: 12,
    fontFamily: 'Fredoka-Bold',
    color: '#1a105f',
    textAlign: 'center',
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Fredoka-Medium',
    marginBottom: 25,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    flex: 1,
    textAlign: 'center',
  },
});
