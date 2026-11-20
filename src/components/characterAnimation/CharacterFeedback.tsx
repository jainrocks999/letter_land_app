import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import { colorData } from '../../types/search.types';
import { isTablet, rf } from '../../utils/responsive';

interface Props {
  colors: colorData;
  selectedOption: string | null;
  isCorrect: boolean | null;
  isSpeaking: boolean;
  styles?: StyleProp<ViewStyle>;
  imgTop?: number;
}
const tablet = isTablet();

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
        style={{ width: '90%', height: '100%', top: imgTop ?? rf(tablet? 28: 35) }}
      />
      {isCorrect && (
        <View style={styles.successSelection}>
          <LottieAnimation
            animation={require('../../assets/animations/success.json')}
            size={rf(200)}
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
    height: rf(180),
    width: rf(180),
    borderWidth: 3,
    borderRadius: rf(999),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: rf(20),
  },
  successSelection: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});
