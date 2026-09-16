import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import { colorData, LetterOptionWithPosType, RectType } from '../../../types/search.types';
import Animated from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { CookieSvg } from '../../../utils/searchingHelper';
import useLetterDrag from '../../../hooks/useLetterDrag';

interface Props {
  data: LetterOptionWithPosType;
  index: number;
  targetLetter: string;
  mouthRect: RectType;
  onDrop: (letter: string, dropX: number, dropY: number) => void;
  onHoverChange: (isHovering: boolean) => void;
  colors: colorData;
}

const DraggableCookie: React.FC<Props> = ({
  data,
  index,
  onDrop,
  mouthRect,
  targetLetter,
  onHoverChange,
  colors,
}) => {
  const tileRef = useRef<View>(null);

  const drag = useLetterDrag({
    data,
    rectShap: mouthRect,
    targetLetter,
    onHoverChange,
    onDrop,
  });

  const handleLayout = () => {
    tileRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        drag.setOrigin(x, y, width, height);
      }
    });
  };

  const panGesture = usePanGesture({
    onUpdate: e =>
      drag.handleUpdateNormal(
        e.translationX,
        e.translationY,
        e.absoluteX,
        e.absoluteY,
      ),
    onFinalize: e => {
      drag.handleFinalizeNormal(e.absoluteX, e.absoluteY);
    },
  });

  const Cookie = CookieSvg[index % CookieSvg.length];
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={tileRef}
        onLayout={handleLayout}
        style={[styles.dragableContainer, drag.animatedStyle]}
      >
        <Cookie width={'100%'} height={'100%'} />
        <Text style={[styles.LetterText, { color: colors.midColor }]}>
          {data.data.letter}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};


export default DraggableCookie;

const styles = StyleSheet.create({
  dragableContainer: {
    width: 66,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LetterText: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#333',
    position: 'absolute',
  },
});
