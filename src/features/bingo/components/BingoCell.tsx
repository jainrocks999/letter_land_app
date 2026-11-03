import { Text } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ActionButton from '../../../components/customButton/ActionButton';
import { styles } from '../Bingo.styles';

interface BingoCellProps {
  letter: string;
  marked: boolean;
  isInBingoLine: boolean;
  isWrong: boolean;
  disabled: boolean;
  onPress: (letter: string) => void;
}

const BingoCell: React.FC<BingoCellProps> = ({
  letter,
  marked,
  isInBingoLine,
  isWrong,
  disabled,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const starScale = useSharedValue(marked ? 1 : 0);

  useEffect(() => {
    if (marked) {
      scale.value = withSequence(
        withTiming(1.18, { duration: 110 }),
        withSpring(1, { damping: 7, stiffness: 240 }),
      );
      starScale.value = withSequence(
        withTiming(1.35, { duration: 120 }),
        withSpring(1, { damping: 6, stiffness: 220 }),
      );
    } else {
      scale.value = 1;
      starScale.value = 0;
    }
  }, [marked, scale, starScale]);

  useEffect(() => {
    if (isWrong) {
      shakeX.value = withSequence(
        withTiming(-9, { duration: 55 }),
        withTiming(9, { duration: 55 }),
        withTiming(-7, { duration: 55 }),
        withTiming(7, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    } else {
      shakeX.value = 0;
    }
  }, [isWrong, shakeX]);

  const cellStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: scale.value }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    opacity: starScale.value === 0 ? 0 : 1,
    transform: [
      { scale: starScale.value },
      { rotate: `${starScale.value * 16}deg` },
    ],
  }));

  const backgroundColor = isWrong
    ? '#FDE2E2'
    : marked
    ? isInBingoLine
      ? '#FFE7A3'
      : '#FCE2D1'
    : '#DCCDE6';
  const bottomBorderColor = isWrong
    ? '#E5484D'
    : marked
    ? isInBingoLine
      ? '#E7A400'
      : '#F58C62'
    : '#A986BC';
  const textColor = isWrong
    ? '#C0392B'
    : marked
    ? isInBingoLine
      ? '#8B4B12'
      : '#C8460E'
    : '#604080';

  return (
    <Animated.View
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[styles.bingoCell, cellStyle]}
    >
      <ActionButton
        bottomBorderWidth={5}
        radius={10}
        backgroundColor={backgroundColor}
        bottomBorderColor={bottomBorderColor}
        onPress={() => onPress(letter)}
        styles={styles.bingoCellButton}
      >
        <Text style={[styles.bingoCellText, { color: textColor }]}>
          {letter}
        </Text>
        {marked && (
          <Animated.Text style={[styles.bingoCellStar, starStyle]}>
            ★
          </Animated.Text>
        )}
      </ActionButton>
    </Animated.View>
  );
};

export default BingoCell;
