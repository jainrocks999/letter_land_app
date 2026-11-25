import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useRef } from 'react';
import {
  colorData,
  LetterOptionWithPosType,
  RectType,
} from '../../../types/search.types';
import Animated from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import useLetterDrag from '../../../hooks/useLetterDrag';
import { isTablet, rf, useStageScale } from '../../../utils/responsive';
import { useRemeasureOnStageChange } from '../../../utils/orientation';

interface Props {
  colors: colorData;
  data: LetterOptionWithPosType;
  index: number;
  totalOptions: number;
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
  index,
  totalOptions,
  onDrop,
  mouthRect,
  targetLetter,
  onHoverChange,
  colors,
  disabled = false,
  containerSize,
}) => {
  const { width: containerWidth, height: containerHeight } = containerSize;
  const stageScale = useStageScale();

  // Options are laid out on a grid that always fits the measured container.
  // The authored data.x/data.y values were tuned for one phone size and can
  // push the last column/row outside the box. iOS clips children at the
  // parent's bounds (Android doesn't), which made those letters disappear.
  const columns = totalOptions > 4 ? 3 : totalOptions > 2 ? 2 : 1;
  const rows = Math.max(1, Math.ceil(totalOptions / columns));
  const column = index % columns;
  const row = Math.floor(index / columns);

  const cellWidth = containerWidth / columns;
  const cellHeight = containerHeight / rows;

  const { position, tileWidth, tileHeight, fontSize } = useMemo(() => {
    const baseFontSize = rf(tablet ? 50 : Platform.OS === 'ios' ? 90 : 100);
    const size = Math.max(
      rf(26),
      Math.min(baseFontSize, (cellWidth * 0.82) / 1.1, (cellHeight * 0.82) / 1.2),
    );
    const width = size * 1.1;
    const height = size * 1.2;

    return {
      fontSize: size,
      tileWidth: width,
      tileHeight: height,
      position: {
        x: column * cellWidth + (cellWidth - width) / 2,
        y: row * cellHeight + (cellHeight - height) / 2,
      },
    };
  }, [cellWidth, cellHeight, column, row]);

  const scaledData = useMemo(() => ({ ...data, ...position }), [data, position]);

  const drag = useLetterDrag({
    data: scaledData,
    rectShap: mouthRect,
    targetLetter,
    onHoverChange,
    onDrop,
  });

  const {
    handleUpdateNormal,
    handleFinalizeNormal,
    setOrigin,
    animatedStyle,
  } = drag;

  const viewRef = useRef<View>(null);
  const handleLayout = () => {
    requestAnimationFrame(() => {
      viewRef.current?.measureInWindow((x, y, width, height) => {
        // drag.setOrigin(x, y, width, height);
        setOrigin(x, y, width, height);
      });
    });
  };
  useRemeasureOnStageChange(handleLayout);
  const panGesture = usePanGesture({
    onUpdate: e => {
      if (disabled) {
        return;
      }
      // drag.handleUpdateNormal(
      handleUpdateNormal(
        e.translationX / stageScale,
        e.translationY / stageScale,
        e.absoluteX,
        e.absoluteY,
      );
    },
    onFinalize: e => {
      if (disabled) {
        return;
      }
      // drag.handleFinalizeNormal(e.absoluteX, e.absoluteY);
      handleFinalizeNormal(e.absoluteX, e.absoluteY);
    },
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.dragableContainer,
          { width: tileWidth, height: tileHeight },
          // drag.animatedStyle,
          animatedStyle,
        ]}
        ref={viewRef}
        onLayout={handleLayout}
      >
        <Text style={[styles.LetterText, { color: colors.darkColor, fontSize }]}>
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
    fontFamily: 'Fredoka-Bold',
    textAlign: 'center',
    opacity: 0.8,
  },
});
