import { LayoutChangeEvent } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { svgPathProperties } from 'svg-path-properties';
import { getNearestPathPoint, toViewBoxPoint } from '../utils/tracingHelper';
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
  const [tracedLength, setTracedLength] = useState<number>(0);
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

  const strokeLengths = useMemo(
    () =>
      current.strokes.map(strokeItem =>
        new svgPathProperties(strokeItem.path).getTotalLength(),
      ),
    [current.strokes],
  );

  const totalLetterLength = strokeLengths.reduce(
    (sum, length) => sum + length,
    0,
  );

  const completedStrokeLength = strokeLengths
    .slice(0, activeStrokeIndex)
    .reduce((sum, length) => sum + length, 0);

  const letterProgress =
    totalLetterLength > 0
      ? (completedStrokeLength + tracedLength) / totalLetterLength
      : 0;

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
      setStatusText(text);
    },
    [onStatusChange],
  );

  const syncProgress = useCallback(
    (nextLength: number, nearestPoint: Point) => {
      if(isCompleteRef.current){
        return;
      }
      tracedLengthRef.current = nextLength;
      setTracedLength(nextLength);

      trailPathRef.current +=
        trailPathRef.current.length === 0
          ? `M ${nearestPoint.x} ${nearestPoint.y}`
          : ` L ${nearestPoint.x} ${nearestPoint.y}`;

      const updatedTrails = [...strokeTrailsRef.current];
      updatedTrails[activeStrokeIndexRef.current] = trailPathRef.current;

      strokeTrailsRef.current = updatedTrails;
      setStrokeTrails(updatedTrails);

      const nextCheckpoint = currentStroke.checkpoints.findIndex(
        checkpoint => nextLength < totalLength * checkpoint,
      );
     
      setCheckpointIndex(
        nextCheckpoint === -1
          ? currentStroke.checkpoints.length
          : nextCheckpoint,
      );

      if (nextLength < totalLength * 0.96) {
        return;
      }
      
      

      if (activeStrokeIndexRef.current < current.strokes.length - 1) {
        const nextStroke = activeStrokeIndexRef.current + 1;

        activeStrokeIndexRef.current = nextStroke;

        setActiveStrokeIndex(nextStroke);

        tracedLengthRef.current = 0;
        setTracedLength(0);
        trailPathRef.current = '';
        setCheckpointIndex(0);
      
        updateStatus(`${
          praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
        } Now trace stroke ${nextStroke + 1}.`);
        onStrokeComplete?.(activeStrokeIndexRef.current);
         onSpeak?.(`${
          praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
        } ${current.hint2?.[nextStroke ]}.`);
        return;
      }

      isCompleteRef.current = true;

      setIsComplete(true);

      let completeText=`${
          praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
        } ${current.letter} is complete.`

      updateStatus(completeText);

      onSpeak?.(completeText);
     
      onLetterComplete?.();
    },
    [
      current,
      currentStroke,
      totalLength,
      onLetterComplete,
      onStrokeComplete,
      onSpeak,
      updateStatus,
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
        pathMeasure,
        totalLength,
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
    },
    [canvasBounds, pathMeasure, totalLength, syncProgress, updateStatus],
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
        pathMeasure,
        totalLength,
      );
      if (nearest.distance > HIT_RADIUS) {
        updateStatus('Stay on the letter path.')
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
    [canvasBounds, pathMeasure, totalLength, syncProgress],
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
  }, [updateStatus]);

  const resetTrace = useCallback(() => {
    activeStrokeIndexRef.current = 0;
    tracedLengthRef.current = 0;
    trailPathRef.current = '';
    strokeTrailsRef.current = [];
    isTracingRef.current = false;
    isCompleteRef.current = false;

    setActiveStrokeIndex(0);
    setTracedLength(0);
    setStrokeTrails([]);
    setCheckpointIndex(0);
    setIsTracing(false);
    setIsComplete(false);

    updateStatus('Touch the first dot.');
  }, [updateStatus]);

  React.useEffect(() => {
    resetTrace();
  }, [current.letter, resetTrace]);

  return {
    currentStroke,
    guidePoints,
    totalLength,
    letterProgress,
    canvasBounds,
    setCanvasBounds,
    activeStrokeIndex,
    setActiveStrokeIndex,
    tracedLength,
    setTracedLength,
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

    syncProgress,
    handleTraceStart,
    handleTraceMove,
    handleTraceEnd,
    resetTrace,
  };
};

export default useLetterTracing;
