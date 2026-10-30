import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { colorData } from '../../../types/search.types';
import { SlotRectType } from './DraggableTile';

interface LetterSlotProps {
  index: number;
  letter: string;
  size: number;
  isFilled: boolean;
  colors: colorData;
  onMeasure: (index: number, rect: SlotRectType) => void;
}

// a letter's "home": shows a faint guide letter until the right tile lands in it
const LetterSlot: React.FC<LetterSlotProps> = ({
  index,
  letter,
  size,
  isFilled,
  colors,
  onMeasure,
}) => {
  const viewRef = useRef<View>(null);

  const handleLayout = () => {
    requestAnimationFrame(() => {
      viewRef.current?.measureInWindow((x, y, width, height) => {
        onMeasure(index, { x, y, width, height, letter });
      });
    });
  };

  return (
    <View
      ref={viewRef}
      onLayout={handleLayout}
      style={[
        styles.slot,
        { width: size, height: size * 1.15 },
        isFilled
          ? {
              backgroundColor: colors.lightColor,
              borderColor: colors.darkColor,
            }
          : styles.emptySlot,
      ]}
    >
      {isFilled ? (
        <Animated.Text
          entering={ZoomIn.springify().damping(8)}
          style={[
            styles.letter,
            { fontSize: size * 0.62, color: colors.midColor },
          ]}
        >
          {letter}
        </Animated.Text>
      ) : (
        <Text style={[styles.letter, styles.ghost, { fontSize: size * 0.62 }]}>
          {letter}
        </Text>
      )}
    </View>
  );
};

export default LetterSlot;

const styles = StyleSheet.create({
  slot: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 14,
  },
  emptySlot: {
    backgroundColor: '#f7f3ec',
    borderColor: '#d8cfc0',
    borderStyle: 'dashed',
  },
  letter: { fontFamily: 'Fredoka-Bold' },
  ghost: { color: '#ddd3c2' },
});
