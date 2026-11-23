import { useWindowDimensions } from 'react-native';
import {
  EdgeInsets,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export interface PortraitStageLayout {
  isLandscape: boolean;
  /** Real window size reported by React Native. */
  windowWidth: number;
  windowHeight: number;
  /** Size the app UI is laid out at (always the device's portrait bounds). */
  contentWidth: number;
  contentHeight: number;
  /** Down-scale applied to the UI while the device is in landscape. */
  scale: number;
  /** Visible size of the scaled portrait screen. */
  frameWidth: number;
  frameHeight: number;
  /** Position of the unscaled content box (centred in the real window). */
  offsetX: number;
  offsetY: number;
}

/**
 * Works out how to fit the portrait UI inside the current window.
 *
 * In landscape the UI is still laid out at the device's portrait size, then
 * scaled down to fit the (shorter) landscape height and centred horizontally.
 * The leftover space on both sides is painted black by PortraitStage.
 */
export const getPortraitStageLayout = (
  windowWidth: number,
  windowHeight: number,
): PortraitStageLayout => {
  const isLandscape = windowWidth > windowHeight;

  // min/max are the device bounds in portrait, regardless of current rotation.
  const contentWidth = Math.min(windowWidth, windowHeight);
  const contentHeight = Math.max(windowWidth, windowHeight);

  // In landscape only the height can constrain the portrait screen.
  const scale = isLandscape ? windowHeight / contentHeight : 1;

  const frameWidth = contentWidth * scale;
  const frameHeight = contentHeight * scale;

  return {
    isLandscape,
    windowWidth,
    windowHeight,
    contentWidth,
    contentHeight,
    scale,
    frameWidth,
    frameHeight,
    // Centring the *unscaled* box also centres the scaled result, so no
    // transform-origin handling is needed.
    offsetX: (windowWidth - contentWidth) / 2,
    offsetY: (windowHeight - contentHeight) / 2,
  };
};

/**
 * Always return a transform array. Switching a view's transform between an
 * array and `undefined` during an orientation change can confuse RN's style
 * diffing; keeping the same shape with an identity scale is visually identical.
 */
export const getStageTransform = (scale: number, isLandscape: boolean) => [
  { scale: isLandscape ? scale : 1 },
];

export const usePortraitStage = (): PortraitStageLayout => {
  const { width, height } = useWindowDimensions();
  return getPortraitStageLayout(width, height);
};

/**
 * For screens that need pixel dimensions (canvas sizes, hit-test rects, ...).
 * Always returns portrait-oriented dimensions so their math matches the
 * letterboxed UI instead of the physical landscape window.
 */
export const useAppDimensions = () => {
  const { contentWidth, contentHeight, isLandscape } = usePortraitStage();
  return {
    width: contentWidth,
    height: contentHeight,
    isLandscape,
  };
};

/**
 * RNGH reports pan translation in physical window points. While the stage is
 * scaled down, divide by this value before applying it to a view inside the
 * stage so draggable items keep following the finger.
 */
export const useStageScale = () => usePortraitStage().scale;

/**
 * Converts the real (landscape) safe area insets into the insets the portrait
 * UI would have. Without this, a landscape iPad's left/right corner insets
 * would squeeze the letterboxed screen horizontally.
 */
export const usePortraitInsets = (): EdgeInsets => {
  const insets = useSafeAreaInsets();
  const { isLandscape } = usePortraitStage();

  if (!isLandscape) return insets;

  const cornerInset = Math.max(insets.left, insets.right);
  return {
    top: Math.max(insets.top, cornerInset),
    bottom: Math.max(insets.bottom, cornerInset),
    left: 0,
    right: 0,
  };
};
