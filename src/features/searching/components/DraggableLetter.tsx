import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import {
  colorData,
  LetterOptionWithPosType,
  RectType,
} from '../../../types/search.types';
import Animated from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import useLetterDrag from '../../../hooks/useLetterDrag';

interface Props {
  colors: colorData;
  data: LetterOptionWithPosType;
  index: number;
  targetLetter: string;
  mouthRect: RectType;
  disabled?: boolean;
  onDrop: (letter: string, dropX: number, dropY: number) => void;
  onHoverChange: (isHovering: boolean) => void;
}

const DraggableLetter: React.FC<Props> = ({
  data,
  onDrop,
  mouthRect,
  targetLetter,
  onHoverChange,
  colors,
  disabled = false,
}) => {
  const drag = useLetterDrag({
    data,
    rectShap: mouthRect,
    targetLetter,
    onHoverChange,
    onDrop,
  });
  const viewRef = useRef<View>(null);
  const handleLayout = () => {
    requestAnimationFrame(() => {
      viewRef.current?.measureInWindow((x, y, width, height) => {
        drag.setOrigin(x, y, width, height);
      });
    });
  };
  const panGesture = usePanGesture({
    onUpdate: e => {
      if (disabled) {
        return;
      }
      drag.handleUpdateNormal(
        e.translationX,
        e.translationY,
        e.absoluteX,
        e.absoluteY,
      );
    },
    onFinalize: e => {
      if (disabled) {
        return;
      }
      drag.handleFinalizeNormal(e.absoluteX, e.absoluteY);
    },
  });

  //  const textColor=isCorrect == null
  //                     ? colors.darkColor
  //                     : isCorrect == true
  //                     ? '#4CAF50'
  //                     : 'red'

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.dragableContainer, drag.animatedStyle]}
        ref={viewRef}
        onLayout={handleLayout}
      >
        <Text style={[styles.LetterText, { color: colors.darkColor }]}>
          {data.data.letter}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableLetter;

const styles = StyleSheet.create({
  dragableContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  LetterText: {
    fontSize: 100,
    fontFamily: 'Fredoka-Bold',
    position: 'absolute',
    opacity: 0.8,
  },
});
