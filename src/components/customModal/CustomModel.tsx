import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  characterImage: any;
}

const SuccessModal = ({
  visible,
  onClose,
  characterImage,
}: SuccessModalProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Image
          source={characterImage}
          style={styles.character}
          resizeMode="contain"
        />

        <Text style={styles.title}>🎉 Amazing!</Text>

        <Text style={styles.message}>
          You matched all the letters correctly!
        </Text>

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
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
    fontSize: 32,
    marginBottom: 12,
    fontFamily: 'Fredoka-Bold',
    color: '#1a105f',
  },

  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Fredoka-Medium',
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 25,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
