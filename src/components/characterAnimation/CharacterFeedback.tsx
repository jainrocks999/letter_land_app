import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import { colorData } from '../../types/search.types';

interface Props {
  colors: colorData;
  selectedOption: string | null;
  isCorrect: boolean | null;
  isSpeaking: boolean;
  styles?: StyleProp<ViewStyle>;
  imgTop?: number;
}

const CharacterFeedback = ({
  colors,
  selectedOption,
  isCorrect,
  styles: customStyle,
  isSpeaking,
  imgTop,
}: Props) => {
  return (
    <View
      style={[
        styles.imgContainer,
        { borderColor: colors.darkColor },
        customStyle,
      ]}
    >
      <Animated.Image
        source={
          !selectedOption
            ? isSpeaking
              ? require('../../assets/images/character/speaking.gif')
              : require('../../assets/images/character/standing.gif')
            : isCorrect
            ? require('../../assets/images/character/yay.gif')
            : require('../../assets/images/character/opps.gif')
        }
        style={{ width: '90%', height: '100%', top: imgTop || 35 }}
      />

      {isCorrect && (
        <View style={styles.successSelection}>
          <LottieAnimation
            animation={require('../../assets/animations/success.json')}
            size={200}
            loop={true}
          />
        </View>
      )}
    </View>
  );
};

export default CharacterFeedback;

const styles = StyleSheet.create({
  imgContainer: {
    height: 180,
    width: 180,
    borderWidth: 3,
    borderRadius: '50%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  successSelection: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});
