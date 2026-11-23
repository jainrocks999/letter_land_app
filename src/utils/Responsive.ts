import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');

// Always use the device's portrait bounds. In landscape the whole UI is
// letterboxed (see utils/orientation.ts), so every wp()/hp()/rf() value must
// stay identical to what it would be in portrait — even if the app was
// launched while the iPad was rotated.
const width = Math.min(window.width, window.height);
const height = Math.max(window.width, window.height);

// Design reference: iPhone portrait (375 x 812)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Tablet reference width. Type/spacing grows with the screen but is capped so
// text stays readable instead of looking huge on 12.9" iPads.
const guidelineTabletWidth = 640;
const maxTabletScale = 1.4;

export const screenWidth = width;
export const screenHeight = height;

export const wp = (percent: number) => (width * percent) / 100;

export const hp = (percent: number) => (height * percent) / 100;

export const isTablet = () => {
  return Math.min(width, height) >= 600;
};

const getScale = () => {
  if (isTablet()) {
    return Math.min(width / guidelineTabletWidth, maxTabletScale);
  }

  return Math.min(width / guidelineBaseWidth, height / guidelineBaseHeight, 1);
};

const scale = getScale();

// Responsive font size / spacing. Use for font sizes, icon sizes, paddings and
// other small fixed values so they scale on both phones and tablets.
export const rf = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

export {
  useAppDimensions,
  usePortraitStage,
  useStageScale,
} from './orientation';
