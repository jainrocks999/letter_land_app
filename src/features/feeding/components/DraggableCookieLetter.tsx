import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useRef } from 'react';
import {
  colorData,
  LetterOptionWithPosType,
  RectType,
} from '../../../types/search.types';
import Animated from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { CookieSvg } from '../../../utils/searchingHelper';
import useLetterDrag from '../../../hooks/useLetterDrag';
import { isTablet, rf } from '../../../utils/responsive';

const VIEW_BOX_WIDTH = 1024;
const VIEW_BOX_HEIGHT = 765;

// The cookie positions in `searchingHelper` are authored in phone pixels for
// this options box. Used to map them onto larger (tablet) layouts.
const DESIGN_WIDTH = 345;
const DESIGN_HEIGHT = 227;

interface Props {
  data: LetterOptionWithPosType;
  index: number;
  targetLetter: string;
  mouthRect: RectType;
  onDrop: (letter: string, dropX: number, dropY: number) => void;
  onHoverChange: (isHovering: boolean) => void;
  colors: colorData;
  traySize: { width: number; height: number };
}

const DraggableCookie: React.FC<Props> = ({
  data,
  index,
  onDrop,
  mouthRect,
  targetLetter,
  onHoverChange,
  colors,
  traySize,
}) => {
  const tileRef = useRef<View>(null);

  // The bakery is drawn with the SVG default "xMidYMid meet", so reproduce that
  // same fit transform here and place the cookie relative to the artwork. This
  // keeps every cookie on the tray at any screen size.
  const { width: trayWidth, height: trayHeight } = traySize;
  const divisor = isTablet() ? 2.4 : 2;
  const artScale =
    trayWidth > 0 && trayHeight > 0
      ? Math.min(trayWidth / VIEW_BOX_WIDTH, trayHeight / VIEW_BOX_HEIGHT)
      : 0;
  const artWidth = VIEW_BOX_WIDTH * artScale;
  const artHeight = VIEW_BOX_HEIGHT * artScale;
  const artOffsetX = (trayWidth - artWidth) / divisor;
  const artOffsetY = (trayHeight - artHeight) / 2;

  
  const useArtLayout = isTablet() && artScale > 0;

  const position = useMemo(() => {
    if (!useArtLayout) {
      return { x: data.x, y: data.y };
    }
    return {
      x: artOffsetX + (data.x / DESIGN_WIDTH) * artWidth,
      y: artOffsetY + (data.y / DESIGN_HEIGHT) * artHeight,
    };
  }, [
    data.x,
    data.y,
    useArtLayout,
    artOffsetX,
    artOffsetY,
    artWidth,
    artHeight,
  ]);

  const scaledData = useMemo(
    () => ({ ...data, ...position }),
    [data, position],
  );

  const tileScale = useArtLayout ? artWidth / DESIGN_WIDTH : 1;
  const tileSize = rf(isTablet()? 50 : 66) * tileScale;

  const drag = useLetterDrag({
    data: scaledData,
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
        style={[
          styles.dragableContainer,
          { width: tileSize, height: tileSize },
          drag.animatedStyle,
        ]}
      >
        <Cookie width={'100%'} height={'100%'} />
        <Text
          style={[
            styles.LetterText,
            { color: colors.midColor, fontSize: rf(36) * tileScale },
          ]}
        >
          {data.data.letter}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableCookie;

const styles = StyleSheet.create({
  dragableContainer: {
    width: rf(66),
    height: rf(66),
    justifyContent: 'center',
    alignItems: 'center',
  },
  LetterText: {
    fontSize: rf(36),
    fontFamily: 'Fredoka-Bold',
    color: '#333',
    position: 'absolute',
  },
});
