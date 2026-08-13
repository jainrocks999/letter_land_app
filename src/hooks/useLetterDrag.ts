import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LetterOptionWithPosType, RectType } from '../types/search.types';
import { runOnJS } from 'react-native-worklets';
import { isInsideRect } from '../utils/searchingHelper';

interface useLetterDragProps {
  data: LetterOptionWithPosType;
  rectShap: RectType;
  targetLetter: string;
  onHoverChange: (isHovering: boolean) => void;
  onDrop: (letter: string, dropX: number, dropY: number) => void;
}

const useLetterDrag = ({
  data,
  rectShap,
  targetLetter,
  onHoverChange,
  onDrop,
}: useLetterDragProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const wasInside = useSharedValue(false);
  const scale = useSharedValue(1);
  const isLocked = useSharedValue(false);

  const origin = useSharedValue({ x: 0, y: 0, width: 0, height: 0 }); // NEW: letter's own resting screen position

  const setOrigin = (x: number, y: number, width: number, height: number) => {
    // NEW
    origin.value = { x, y, width, height };
  };

  const handleUpdate = (
    translationX: number,
    translationY: number,
    absoluteX: number,
    absoluteY: number,
  ) => {
    'worklet';
    translateX.value = translationX;
    translateY.value = translationY;

    const inside = isInsideRect(absoluteX, absoluteY, rectShap);
    if (inside !== wasInside.value) {
      wasInside.value = inside;
      runOnJS(onHoverChange)(inside);
    }
  };

  const handleFinalize = (absoluteX: number, absoluteY: number) => {
    'worklet';
    const dropX = absoluteX;
    const dropY = absoluteY;

    const inside = isInsideRect(dropX, dropY, rectShap);

    const correct = inside && data.data.letter === targetLetter;

    if (wasInside.value) {
      wasInside.value = false;
      runOnJS(onHoverChange)(false);
    }
    if (correct) {
      translateX.value = withTiming(translateX.value + (rectShap.x - dropX), {
        duration: 250,
      });
      translateY.value = withTiming(translateY.value + (rectShap.y - dropY), {
        duration: 250,
      });

      opacity.value = withTiming(0, { duration: 250 }, finished => {
        if (finished) runOnJS(onDrop)(data.data.letter, dropX, dropY);
      });
    } else {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);

      if (inside) {
        runOnJS(onDrop)(data.data.letter, dropX, dropY);
      }
    }
  };

  const handleUpdateNormal = (
    translationX: number,
    translationY: number,
    absoluteX: number,
    absoluteY: number,
  ) => {
    'worklet';
    if (isLocked.value) return;
    translateX.value = translationX;
    translateY.value = translationY;
    scale.value = 1.08;

    const inside = isInsideRect(absoluteX, absoluteY, rectShap);
    if (inside !== wasInside.value) {
      wasInside.value = inside;
      runOnJS(onHoverChange)(inside);
    }
  };

  const handleFinalizeNormal = (absoluteX: number, absoluteY: number) => {
    'worklet';
    if (isLocked.value) return;

    const dropX = absoluteX;
    const dropY = absoluteY;

    const inside = isInsideRect(dropX, dropY, rectShap);
    const correct = inside && data.data.letter === targetLetter;

    if (wasInside.value) {
      wasInside.value = false;
      runOnJS(onHoverChange)(false);
    }
    if (correct) {
      isLocked.value = true;

      const tileCenterX = origin.value.x + origin.value.width / 2;
      const tileCenterY = origin.value.y + origin.value.height / 2;
      const targetCenterX = rectShap.x + rectShap.width / 2;
      const targetCenterY = rectShap.y + rectShap.height / 2;

      const finalTranslateX = targetCenterX - tileCenterX;
      const finalTranslateY = targetCenterY - tileCenterY;
      
      translateX.value = withTiming(finalTranslateX, { duration: 280 });
      translateY.value = withTiming(
        finalTranslateY,
        { duration: 280 },
        finished => {
          if (finished) {
            runOnJS(onDrop)(data.data.letter, dropX, dropY);
          }
        },
      );
      scale.value = withSequence(
        withTiming(1.25, { duration: 120 }),
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
    } else {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      if (inside) {
        runOnJS(onDrop)(data.data.letter, dropX, dropY);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: data.x,
    top: data.y,
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  return {
    translateX,
    translateY,
    opacity,
    wasInside,
    scale,
    isLocked,
    handleUpdate,
    handleFinalize,
    handleUpdateNormal,
    handleFinalizeNormal,
    animatedStyle,
    setOrigin,
  };
};

export default useLetterDrag;
