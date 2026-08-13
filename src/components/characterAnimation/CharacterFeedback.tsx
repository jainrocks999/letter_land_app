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
}

const CharacterFeedback = ({
  colors,
  selectedOption,
  isCorrect,
  styles: customStyle,
  isSpeaking,
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
              ? require('../../assets/images/character/speaking.png')
              : require('../../assets/images/character/standing.png')
            : isCorrect
            ? require('../../assets/images/character/yay.png')
            : require('../../assets/images/character/opps.png')
        }
        style={{ width: '90%', height: '100%', top: 35 }}
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
    height: 150,
    width: 150,
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
