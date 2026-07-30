import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseHeight = 375;
const guidelineBaseWidth = 812;

export const wp = (percent: number) => (width * percent) / 100;

export const hp = (percent: number) => (height * percent) / 100;

export const rf = (size: number) => {
  const scale = Math.min(
    width / guidelineBaseWidth,
    height / guidelineBaseHeight,
  );

  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};
