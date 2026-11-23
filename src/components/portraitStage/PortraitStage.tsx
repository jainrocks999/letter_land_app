import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { getStageTransform, usePortraitStage } from '../../utils/orientation';

/**
 * Keeps the app's portrait UI intact when an iPad is rotated to landscape.
 *
 * Portrait: renders edge-to-edge exactly as before.
 * Landscape: renders the same UI at the device's portrait size, scales it down
 * to fit the screen height, centres it, and fills both sides with black.
 */
const PortraitStage = ({ children }: PropsWithChildren) => {
  const {
    isLandscape,
    contentWidth,
    contentHeight,
    offsetX,
    offsetY,
    scale,
  } = usePortraitStage();

  return (
    <View
      style={[styles.root, isLandscape ? styles.landscape : styles.portrait]}
    >
      <View
        style={[
          styles.content,
          {
            left: offsetX,
            top: offsetY,
            width: contentWidth,
            height: contentHeight,
            transform: getStageTransform(scale, isLandscape),
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  landscape: { backgroundColor: '#000' },
  portrait: { backgroundColor: '#fff' },
  content: {
    position: 'absolute',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});

export default PortraitStage;
