import { LayoutChangeEvent } from 'react-native';
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { svgPathProperties } from 'svg-path-properties';
import {
  buildPathSamples,
  getNearestPathPoint,
  toViewBoxPoint,
} from '../utils/tracingHelper';
import { Bounds, Point, TraceLetter } from '../types/tracing.types';
import { tracingConstants } from '../config/constants';
import { praiseMessages } from '../utils/helperData';

interface useLetterTracingProp {
  current: TraceLetter;
  onLetterComplete?: () => void;
  onStrokeComplete?: (strokeIndex: number) => void;
  onStatusChange?: (status: string) => void;
  onSpeak?: (text: string) => void;
}

const { HIT_RADIUS, PROGRESS_LOOKAHEAD } =
  tracingConstants;

const useLetterTracing = ({
  current,
  onLetterComplete,
  onStrokeComplete,
  onStatusChange,
  onSpeak,
}: useLetterTracingProp) => {
  // states
  const [canvasBounds, setCanvasBounds] = useState<Bounds>({
    width: 1,
    height: 1,
  });
  const [activeStrokeIndex, setActiveStrokeIndex] = useState<number>(0);
  const [strokeTrails, setStrokeTrails] = useState<string[]>([]);
  const [checkpointIndex, setCheckpointIndex] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Touch the first dot.');
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // useRefs
  const activeStrokeIndexRef = useRef<number>(0);
  const tracedLengthRef = useRef<number>(0);
  const trailPathRef = useRef<string>('');
  const strokeTrailsRef = useRef<string[]>([]);
  const isTracingRef = useRef<boolean>(false);
  const isCompleteRef = useRef<boolean>(false);
  const lastTrailPointRef = useRef<Point | null>(null);
  const checkpointIndexRef = useRef<number>(0);
  const statusRef = useRef<string>('Touch the first dot.');

  // All per-move visuals live on the UI thread shared values. None of these
  // trigger a React render while the finger moves.
  const tracedLengthSv = useSharedValue(0);
  const activeTrailSv = useSharedValue('M-1000 -1000');
  const letterProgressSv = useSharedValue(0);
  // DerivedValue is a SharedValue at runtime; Animated.Text only types its
  // children as SharedValue<ReactNode>, hence the explicit cast.
  const progressTextSv = useDerivedValue(
    () => `${Math.round(letterProgressSv.value * 100)}%`,
  ) as unknown as SharedValue<ReactNode>;

  //   Derived data
  const currentStroke =
    current.strokes[activeStrokeIndex] ?? current.strokes[0];

  const pathMeasure = useMemo(
    () => new svgPathProperties(currentStroke.path),
    [currentStroke.path],
  );

  const totalLength = useMemo(
    () => pathMeasure.getTotalLength(),
    [pathMeasure],
  );

  // One-time sampling per stroke. All move events use this table instead of
  // calling the expensive curve arc-length math on every pointer update.
  const pathSamples = useMemo(
    () => buildPathSamples(pathMeasure, totalLength),
    [pathMeasure, totalLength],
  );

  const strokeLengths = useMemo(
    () =>
      current.strokes.map(strokeItem =>
        new svgPathProperties(strokeItem.path).getTotalLength(),
      ),
    [current.strokes],
  );

  // Prefix sums avoid allocating/filtering an array on every pointer move.
  const completedStrokeLengths = useMemo(() => {
    const sums = [0];
    for (let i = 0; i < strokeLengths.length; i += 1) {
      sums[i + 1] = sums[i] + strokeLengths[i];
    }
    return sums;
  }, [strokeLengths]);

  const totalLetterLength = completedStrokeLengths[strokeLengths.length] ?? 0;

  const guidePoints = useMemo(
    () =>
      currentStroke.checkpoints.map(ratio =>
        pathMeasure.getPointAtLength(totalLength * ratio),
      ),
    [currentStroke.checkpoints, pathMeasure, totalLength],
  );

  const handleCanvasLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasBounds({ width, height });
  }, []);

  const updateStatus = useCallback(
    (text: string) => {
      // Repeated "Stay on the letter path." messages on every move used to
      // trigger a React render each time.
      if (statusRef.current === text) {
        return;
      }
      statusRef.current = text;
      setStatusText(text);
      onStatusChange?.(text);
    },
    [onStatusChange],
  );

  const syncProgress = useCallback(
    (nextLength: number, nearestPoint: Point) => {
      if (isCompleteRef.current) {
        return;
      }

      tracedLengthRef.current = nextLength;
      // UI-thread updates: no React render per pointer event.
      tracedLengthSv.value = nextLength;

      const lastPoint = lastTrailPointRef.current;
      const pointMovedFarEnough =
        !lastPoint ||
        Math.hypot(nearestPoint.x - lastPoint.x, nearestPoint.y - lastPoint.y) >=
          2.0;

      if (pointMovedFarEnough) {
        trailPathRef.current +=
          trailPathRef.current.length === 0
            ? `M ${nearestPoint.x.toFixed(1)} ${nearestPoint.y.toFixed(1)}`
            : ` L ${nearestPoint.x.toFixed(1)} ${nearestPoint.y.toFixed(1)}`;
        lastTrailPointRef.current = nearestPoint;
        activeTrailSv.value = trailPathRef.current;
      }

      const nextCheckpoint = currentStroke.checkpoints.findIndex(
        checkpoint => nextLength < totalLength * checkpoint,
      );
      const computedCheckpoint =
        nextCheckpoint === -1
          ? currentStroke.checkpoints.length
          : nextCheckpoint;

      if (computedCheckpoint !== checkpointIndexRef.current) {
        checkpointIndexRef.current = computedCheckpoint;
        setCheckpointIndex(computedCheckpoint);
      }

      // Percentage text is a shared value too. Previously this called
      // setTracedLength on almost every pointer event (40 renders for 43
      // moves), which was the real source of the visible curve lag.
      const completedBefore =
        completedStrokeLengths[activeStrokeIndexRef.current] ?? 0;
      letterProgressSv.value =
        totalLetterLength > 0
          ? (completedBefore + nextLength) / totalLetterLength
          : 0;

      const strokeCompleting = nextLength >= totalLength * 0.96;
      if (!strokeCompleting) {
        return;
      }

      // Completed trails are static: publish them once per stroke.
      const updatedTrails = [...strokeTrailsRef.current];
      updatedTrails[activeStrokeIndexRef.current] = trailPathRef.current;
      strokeTrailsRef.current = updatedTrails;
      setStrokeTrails(updatedTrails);
      activeTrailSv.value = 'M-1000 -1000';

      if (activeStrokeIndexRef.current < current.strokes.length - 1) {
        const nextStroke = activeStrokeIndexRef.current + 1;

        activeStrokeIndexRef.current = nextStroke;
        setActiveStrokeIndex(nextStroke);

        tracedLengthRef.current = 0;
        tracedLengthSv.value = 0;
        letterProgressSv.value =
          totalLetterLength > 0
            ? (completedStrokeLengths[nextStroke] ?? 0) / totalLetterLength
            : 0;
        lastTrailPointRef.current = null;
        checkpointIndexRef.current = 0;
        trailPathRef.current = '';
        setCheckpointIndex(0);

        const praiseMsg =
          praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
        updateStatus(`${praiseMsg} Now trace stroke ${nextStroke + 1}.`);
        onStrokeComplete?.(activeStrokeIndexRef.current);
        onSpeak?.(`${praiseMsg} ${current.hint2?.[nextStroke]}.`);
        return;
      }

      isCompleteRef.current = true;
      setIsComplete(true);
      letterProgressSv.value = 1;

      const completeMsg = `${
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
      } ${current.letter} is complete.`;

      updateStatus(completeMsg);
      onSpeak?.(completeMsg);
      onLetterComplete?.();
    },
    [
      current,
      currentStroke,
      completedStrokeLengths,
      totalLetterLength,
      totalLength,
      onLetterComplete,
      onStrokeComplete,
      onSpeak,
      updateStatus,
      tracedLengthSv,
      activeTrailSv,
      letterProgressSv,
    ],
  );

  const handleTraceStart = useCallback(
    (x: number, y: number) => {
      if (isCompleteRef.current) {
        return;
      }

      const point = toViewBoxPoint(x, y, canvasBounds);
      const nearest = getNearestPathPoint(
        point,
        tracedLengthRef.current,
        pathSamples,
      );

      const currentLength = tracedLengthRef.current;
      const startsNearCurrentProgress =
        currentLength < 8
          ? nearest.length < tracingConstants.PROGRESS_LOOKAHEAD
          : nearest.length >= currentLength - tracingConstants.HIT_RADIUS &&
            nearest.length <=
              currentLength + tracingConstants.PROGRESS_LOOKAHEAD;
      if (nearest.distance > HIT_RADIUS || !startsNearCurrentProgress) {
        updateStatus(
          currentLength > 0
            ? 'Continue from where you stopped.'
            : 'Start on the glowing dot.',
        );
        return;
      }

      const nextTrailPath = trailPathRef.current
        ? `${trailPathRef.current} M${nearest.x.toFixed(1)} ${nearest.y.toFixed(
            1,
          )}`
        : `M${nearest.x.toFixed(1)} ${nearest.y.toFixed(1)}`;
      isTracingRef.current = true;
      setIsTracing(true);
      trailPathRef.current = nextTrailPath;
      lastTrailPointRef.current = nearest;
      activeTrailSv.value = nextTrailPath;
    },
    [canvasBounds, pathSamples, updateStatus, activeTrailSv],
  );

  const handleTraceMove = useCallback(
    (x: number, y: number) => {
      if (!isTracingRef.current) {
        return;
      }
      const point = toViewBoxPoint(x, y, canvasBounds);
      const nearest = getNearestPathPoint(
        point,
        tracedLengthRef.current,
        pathSamples,
      );
      if (nearest.distance > HIT_RADIUS) {
        updateStatus('Stay on the letter path.');
        return;
      }
      if (nearest.length < tracedLengthRef.current - 4) {
        return;
      }
      if (nearest.length > tracedLengthRef.current + PROGRESS_LOOKAHEAD) {
        updateStatus('Slow down and follow the dots.');
        return;
      }
      syncProgress(nearest.length, nearest);
    },
    [canvasBounds, pathSamples, syncProgress, updateStatus],
  );

  const handleTraceEnd = useCallback(() => {
    isTracingRef.current = false;
    setIsTracing(false);

    if (isCompleteRef.current) {
      return;
    }
    updateStatus(
      tracedLengthRef.current > 0
        ? 'Lift and continue from the current dot.'
        : 'Touch the first dot.',
    );
    trailPathRef.current = '';
    lastTrailPointRef.current = null;
    activeTrailSv.value = 'M-1000 -1000';
  }, [updateStatus, activeTrailSv]);

  const resetTrace = useCallback(() => {
    statusRef.current = 'Touch the first dot.';
    checkpointIndexRef.current = 0;
    tracedLengthSv.value = 0;
    letterProgressSv.value = 0;
    activeTrailSv.value = 'M-1000 -1000';

    activeStrokeIndexRef.current = 0;
    tracedLengthRef.current = 0;
    lastTrailPointRef.current = null;
    trailPathRef.current = '';
    strokeTrailsRef.current = [];
    isTracingRef.current = false;
    isCompleteRef.current = false;

    setActiveStrokeIndex(0);
    setStrokeTrails([]);
    setCheckpointIndex(0);
    setIsTracing(false);
    setIsComplete(false);

    updateStatus('Touch the first dot.');
  }, [updateStatus, tracedLengthSv, letterProgressSv, activeTrailSv]);

  React.useEffect(() => {
    resetTrace();
  }, [current.letter, resetTrace]);

  return {
    currentStroke,
    guidePoints,
    totalLength,
    progressTextSv,
    canvasBounds,
    setCanvasBounds,
    activeStrokeIndex,
    setActiveStrokeIndex,
    strokeTrails,
    setStrokeTrails,
    checkpointIndex,
    setCheckpointIndex,
    statusText,
    setStatusText,
    isTracing,
    setIsTracing,
    isComplete,
    setIsComplete,
    handleCanvasLayout,
    activeStrokeIndexRef,
    tracedLengthRef,
    trailPathRef,
    strokeTrailsRef,
    isTracingRef,
    isCompleteRef,
    tracedLengthSv,
    activeTrailSv,
    letterProgressSv,

    syncProgress,
    handleTraceStart,
    handleTraceMove,
    handleTraceEnd,
    resetTrace,
  };
};

export default useLetterTracing;
