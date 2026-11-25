import React, { useCallback, useMemo } from 'react';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';

interface Props {
  children: React.ReactNode;
  enabled?: boolean;

  onTraceStart: (x: number, y: number) => void;
  onTraceMove: (x: number, y: number) => void;
  onTraceEnd: () => void;
}

const TracingGestureHandler: React.FC<Props> = ({
  children,
  enabled = true,
  onTraceStart,
  onTraceMove,
  onTraceEnd,
}) => {
  // Stable callbacks + config so RNGH doesn't rebuild/reconfigure the native
  // gesture on every React render while the letter is being drawn.
  const handleBegin = useCallback(
    ({ x, y }: { x: number; y: number }) => onTraceStart(x, y),
    [onTraceStart],
  );
  const handleUpdate = useCallback(
    ({ x, y }: { x: number; y: number }) => onTraceMove(x, y),
    [onTraceMove],
  );
  const handleFinalize = useCallback(() => onTraceEnd(), [onTraceEnd]);

  const config = useMemo(
    () => ({
      enabled,
      minDistance: 0,
      // These callbacks are plain JS functions (they call React state setters
      // and shared values). RNGH v3 tries to turn callbacks into Reanimated
      // worklets unless Reanimated is explicitly disabled, which throws
      // "Passed handlers that are not worklets" on a fresh bundle.
      disableReanimated: true,
      runOnJS: true,
      onBegin: handleBegin,
      onUpdate: handleUpdate,
      onFinalize: handleFinalize,
    }),
    [enabled, handleBegin, handleUpdate, handleFinalize],
  );

  const panGesture = usePanGesture(config);

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default TracingGestureHandler;
