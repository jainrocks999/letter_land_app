import React from 'react';
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
  const entering = isNext
    ? SlideInRight.springify().damping(18).stiffness(180)
    : SlideInLeft.springify().damping(18).stiffness(180);

  const exiting = isNext
    ? SlideOutLeft.springify().damping(18).stiffness(180)
    : SlideOutRight.springify().damping(18).stiffness(180);

  return (
    <Animated.View
      key={animatedKey}
      entering={entering}
      exiting={exiting}
      layout={LinearTransition.springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedSwitcher;


