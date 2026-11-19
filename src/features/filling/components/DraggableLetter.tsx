import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useRef } from 'react';
import {
  colorData,
  LetterOptionWithPosType,
  RectType,
} from '../../../types/search.types';
import Animated from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import useLetterDrag from '../../../hooks/useLetterDrag';
import { isTablet, rf } from '../../../utils/responsive';

// Option positions are authored for a phone-sized options container.
const DESIGN_WIDTH = 345;
const DESIGN_HEIGHT = 227;

interface Props {
  colors: colorData;
  data: LetterOptionWithPosType;
  index: number;
  targetLetter: string;
  mouthRect: RectType;
  disabled?: boolean;
  onDrop: (letter: string, dropX: number, dropY: number) => void;
  onHoverChange: (isHovering: boolean) => void;
  containerSize: { width: number; height: number };
}
const tablet = isTablet();

const DraggableLetter: React.FC<Props> = ({
  data,
  onDrop,
  mouthRect,
  targetLetter,
  onHoverChange,
  colors,
  disabled = false,
  containerSize,
}) => {
  const { width: containerWidth, height: containerHeight } = containerSize;

  // Phones keep the authored positions; on tablets, map them proportionally
  // into the measured options container so letters stay inside the box.
  const useScaledLayout =
    tablet && containerWidth > 0 && containerHeight > 0;

  const position = useMemo(() => {
    if (!useScaledLayout) {
      return { x: data.x, y: data.y };
    }
    return {
      x: (data.x / DESIGN_WIDTH) * containerWidth,
      y: (data.y / DESIGN_HEIGHT) * containerHeight,
    };
  }, [data.x, data.y, useScaledLayout, containerWidth, containerHeight]);

  const scaledData = useMemo(
    () => ({ ...data, ...position }),
    [data, position],
  );

  const scale = useScaledLayout ? containerWidth / DESIGN_WIDTH : 1;
  const letterSize = rf(tablet? 50 : 100) * scale;

  const drag = useLetterDrag({
    data: scaledData,
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

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.dragableContainer, drag.animatedStyle]}
        ref={viewRef}
        onLayout={handleLayout}
      >
        <Text
          style={[
            styles.LetterText,
            { color: colors.darkColor, fontSize: letterSize },
          ]}
        >
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
    fontSize: rf(100),
    fontFamily: 'Fredoka-Bold',
    position: 'absolute',
    opacity: 0.8,
  },
});
