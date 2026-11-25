import React, { useMemo } from 'react';
import Animated, {
  LinearTransition,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

interface Props {
  animatedKey: string | number;
  isNext?: boolean;
  style?: any;
  children: React.ReactNode;
}

const AnimatedSwitcher: React.FC<Props> = ({
  animatedKey,
  isNext = true,
  children,
  style,
}) => {
  // Creating fresh layout transitions on every render makes Reanimated
  // re-measure and re-animate the view each time tracing state updates.
  const { entering, exiting, layout } = useMemo(
    () => ({
      entering: isNext
        ? SlideInRight.springify().damping(18).stiffness(180)
        : SlideInLeft.springify().damping(18).stiffness(180),
      exiting: isNext
        ? SlideOutLeft.springify().damping(18).stiffness(180)
        : SlideOutRight.springify().damping(18).stiffness(180),
      layout: LinearTransition.springify(),
    }),
    [isNext],
  );

  return (
    <Animated.View
      key={animatedKey}
      entering={entering}
      exiting={exiting}
      layout={layout}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedSwitcher;
