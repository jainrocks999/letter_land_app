import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';
import { colorData } from '../../../types/search.types';
import { SpellTileType } from '../data/spellWords.data';

export interface SlotRectType {
  x: number;
  y: number;
  width: number;
  height: number;
  letter: string;
}

interface DraggableTileProps {
  tile: SpellTileType;
  size: number;
  colors: colorData;
  slotRects: SharedValue<(SlotRectType | null)[]>;
  filledSlots: SharedValue<boolean[]>;
  isPlaced: boolean;
  disabled?: boolean;
  onPlaced: (tileId: string, slotIndex: number) => void;
  onMissed: () => void;
}

// extra room around each slot so small fingers don't have to be pixel perfect
const DROP_PADDING = 14;

const DraggableTile: React.FC<DraggableTileProps> = ({
  tile,
  size,
  colors,
  slotRects,
  filledSlots,
  isPlaced,
  disabled = false,
  onPlaced,
  onMissed,
}) => {
  const viewRef = useRef<View>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const isLocked = useSharedValue(false);
  const origin = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!isPlaced) {
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 1;
      isLocked.value = false;
    }
  }, [isPlaced, translateX, translateY, scale, opacity, isLocked]);

  const handleLayout = () => {
    requestAnimationFrame(() => {
      viewRef.current?.measureInWindow((x, y, width, height) => {
        origin.value = { x, y, width, height };
      });
    });
  };

  const findSlot = (x: number, y: number) => {
    'worklet';
    const rects = slotRects.value;
    // only the current word's slots; longer earlier words may leave extra entries behind
    const slotCount = filledSlots.value.length;
    for (let i = 0; i < slotCount; i++) {
      const rect = rects[i];
      if (
        rect &&
        x >= rect.x - DROP_PADDING &&
        x <= rect.x + rect.width + DROP_PADDING &&
        y >= rect.y - DROP_PADDING &&
        y <= rect.y + rect.height + DROP_PADDING
      ) {
        return i;
      }
    }
    return -1;
  };

  const panGesture = usePanGesture({
    enabled: !disabled && !isPlaced,
    onUpdate: e => {
      if (isLocked.value) return;
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      scale.value = withTiming(1.12, { duration: 100 });
    },
    onFinalize: e => {
      if (isLocked.value) return;
      const slotIndex = findSlot(e.absoluteX, e.absoluteY);
      const slot = slotIndex >= 0 ? slotRects.value[slotIndex] : null;
      const isEmpty = slot !== null && !filledSlots.value[slotIndex];

      if (slot && isEmpty && slot.letter === tile.letter) {
        // claim the slot right away so a second matching tile can't land in it too
        isLocked.value = true;
        filledSlots.value = filledSlots.value.map((filled, index) =>
          index === slotIndex ? true : filled,
        );
        const startX = origin.value.x + origin.value.width / 2;
        const startY = origin.value.y + origin.value.height / 2;
        translateX.value = withTiming(slot.x + slot.width / 2 - startX, {
          duration: 220,
        });
        translateY.value = withTiming(
          slot.y + slot.height / 2 - startY,
          { duration: 220 },
          finished => {
            if (finished) {
              opacity.value = 0;
              runOnJS(onPlaced)(tile.id, slotIndex);
            }
          },
        );
        scale.value = withSequence(
          withTiming(1.2, { duration: 110 }),
          withSpring(1, { damping: 10, stiffness: 200 }),
        );
        return;
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      if (isEmpty) {
        runOnJS(onMissed)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: translateX.value !== 0 || translateY.value !== 0 ? 100 : 1,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={viewRef}
        onLayout={handleLayout}
        style={[
          styles.tile,
          {
            width: size,
            height: size * 1.15,
            backgroundColor: colors.lightColor,
            borderColor: colors.darkColor,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.letter,
            { fontSize: size * 0.62, color: colors.midColor },
          ]}
        >
          {tile.letter}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableTile;

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 14,
  },
  letter: { fontFamily: 'Fredoka-Bold' },
});
