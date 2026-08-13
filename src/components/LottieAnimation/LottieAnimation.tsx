import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

interface Props {
  animation: any;
  loop?: boolean;
  autoPlay?: boolean;
  size?: number;
  style?:any;
}

const LottieAnimation = ({
  animation,
  loop = false,
  autoPlay = true,
  size = 200,
style,
}: Props) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay) {
      animationRef.current?.play();
    }
  }, [autoPlay]);

  return (
    // <View>
    //   <Text>LottieAnimation</Text>
    // </View>
    <LottieView
      ref={animationRef}
      source={animation}
      autoPlay={autoPlay}
      loop={loop}
      style={[
        {
          width: size ?? '100%',
          height: size ?? '100%',
        },
        style,
      ]}
    />
  );
};

export default LottieAnimation;
