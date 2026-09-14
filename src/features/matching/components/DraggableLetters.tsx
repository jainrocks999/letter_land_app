import Animated, {useSharedValue} from 'react-native-reanimated';
import { LetterCardType } from '../../learning/data/learning.data';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';
import { StyleSheet, Text, View } from 'react-native';
import { Point } from '../../../types/tracing.types';
import { useEffect } from 'react';
import { ActivityCard } from '../../home/data/home.data';

interface Props {
  item: LetterCardType;
  disabled?: boolean;
  isMatched?: boolean;
  data: ActivityCard;
  startPoint?: Point;

  onDragStart: (letter: string, startPoint: Point) => void;
  onDragMove: (letter: string, point: Point) => void;
  onDragEnd: (letter: string, point: Point) => void;
}

const DraggableLetterMatched = ({
  item,
  disabled = false,
  isMatched = false,
  data,
  startPoint,
  onDragStart,
  onDragMove,
  onDragEnd,
}: Props) => {
  // const shakeX = useSharedValue(0);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);

  useEffect(() => {
    if (!startPoint) {
      return;
    }

    startX.value = startPoint.x;
    startY.value = startPoint.y;
  }, [startPoint?.x, startPoint?.y]);

  // useEffect(() => {
  //   if (isMatched) {
  //     shakeX.value = 0;
  //   }
  // }, [isMatched]);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateX: shakeX.value }],
  //   };
  // });

  // const shake = () => {
  //   shakeX.value = withSequence(
  //     withTiming(-8, { duration: 60 }),
  //     withTiming(8, { duration: 60 }),
  //     withTiming(-6, { duration: 60 }),
  //     withTiming(6, { duration: 60 }),
  //     withTiming(0, { duration: 60 }),
  //   );
  // };

  const panGesture = usePanGesture({
    enabled: !disabled && !!startPoint,
    onBegin: () => {
      const x = startX.value;
      const y = startY.value;

      currentX.value = x;
      currentY.value = y;

      runOnJS(onDragStart)(item.letter, { x, y });
    },
    onUpdate: e => {
      const x = startX.value + e.translationX;
      const y = startY.value + e.translationY;

      currentX.value = x;
      currentY.value = y;

      runOnJS(onDragMove)(item.letter, { x, y });
    },
    onFinalize: e => {
      const finalX = currentX.value;
      const finalY = currentY.value;

      runOnJS(onDragEnd)(item.letter, { x: finalX, y: finalY });
    },
  });
  
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          { alignSelf: 'center' },
          //  animatedStyle
        ]}
      >
        <View
          style={[
            styles.itemSection,
            {
              borderColor: isMatched ? '#22C55E' : `${data.midColor}66`,
              backgroundColor: isMatched ? '#DCFCE7' : data.darkColor,
              opacity: disabled ? 0.55 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.itemText,
              {
                color: isMatched ? '#16A34A' : '#e85216',
              },
            ]}
          >
            {item.letter}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableLetterMatched;

const styles = StyleSheet.create({
  itemSection: {
    width: 70,
    height: 70,
    borderWidth: 3,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 34,
  },
});
