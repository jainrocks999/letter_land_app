import {
  Image,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRoute } from '@react-navigation/native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { svgPathProperties } from 'svg-path-properties';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { StackRouteProps } from '../../types/navigation';
import { ROUTES } from '../../app/navigation/routeNames';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import CustomButton from '../../components/customButton/CustomButton';
import { wp } from '../../utils/Responsive';
import { traceLetters } from './data/letters.data';
import { styles } from './Tracing.styles';
import ActionButton from '../../components/customButton/ActionButton';
import AnimatedSwitcher from '../../components/animatedSwitcher/AnimatedSwitcher';

const VIEW_BOX_WIDTH = 240;
const VIEW_BOX_HEIGHT = 260;
const HIT_RADIUS = 32;
const PROGRESS_LOOKAHEAD = 74;
const COMPLETE_RATIO = 0.94;

type Point = {
  x: number;
  y: number;
};

type Bounds = {
  width: number;
  height: number;
};

type NearestPathPoint = Point & {
  distance: number;
  length: number;
};

const TracingScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.TRACING>>();
  const { data } = route.params;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean>(true);
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



  // activeStrokeIndex
  const activeStrokeIndexRef = useRef<number>(0);
  const tracedLengthRef = useRef<number>(0);
  const trailPathRef = useRef<string>('');
  const strokeTrailsRef = useRef<string[]>([]);
  const isTracingRef = useRef<boolean>(false);
  const isCompleteRef = useRef<boolean>(false);

  const current = traceLetters[currentIndex];
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

  const screenProgress = Math.round(
    ((currentIndex + 1) / traceLetters.length) * 100,
  );

  const guidePoints = useMemo(
    () =>
      currentStroke.checkpoints.map(ratio =>
        pathMeasure.getPointAtLength(totalLength * ratio),
      ),
    [currentStroke.checkpoints, pathMeasure, totalLength],
  );

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.16, { duration: 520 }),
        withTiming(1, { duration: 520 }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  // const startDotStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: pulse.value }],
  // }));

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
    setStatusText('Touch the first dot.');
    setIsTracing(false);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    resetTrace();
  }, [currentIndex, resetTrace]);

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasBounds({ width, height });
  };

  const toViewBoxPoint = useCallback(
    (x: number, y: number): Point => {
      const scale = Math.min(
        canvasBounds.width / VIEW_BOX_WIDTH,
        canvasBounds.height / VIEW_BOX_HEIGHT,
      );
      const drawnWidth = VIEW_BOX_WIDTH * scale;
      const drawnHeight = VIEW_BOX_HEIGHT * scale;
      const offsetX = (canvasBounds.width - drawnWidth) / 2;
      const offsetY = (canvasBounds.height - drawnHeight) / 2;

      return {
        x: (x - offsetX) / scale,
        y: (y - offsetY) / scale,
      };
    },
    [canvasBounds.height, canvasBounds.width],
  );

  const getNearestPathPoint = useCallback(
    (point: Point, currentLength: number): NearestPathPoint => {
      const sampleCount = 96;
      let bestLength = 0;
      let bestPoint = pathMeasure.getPointAtLength(0);
      let bestDistance = Number.MAX_VALUE;

      const SEARCH_BEHIND = 20;
      const SEARCH_AHEAD = 35;

      const start = Math.max(0, currentLength - SEARCH_BEHIND);

      const end = Math.min(totalLength, currentLength + SEARCH_AHEAD);

      for (let length = start; length <= end; length += 2) {
        const sample = pathMeasure.getPointAtLength(length);

        const distance = Math.hypot(sample.x - point.x, sample.y - point.y);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestLength = length;
          bestPoint = sample;
        }
      }

      const refineStep = totalLength / sampleCount / 6;
      for (let offset = -6; offset <= 6; offset += 1) {
        const length = Math.max(
          0,
          Math.min(totalLength, bestLength + offset * refineStep),
        );
        const sample = pathMeasure.getPointAtLength(length);
        const distance = Math.hypot(sample.x - point.x, sample.y - point.y);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestLength = length;
          bestPoint = sample;
        }
      }

      return {
        ...bestPoint,
        distance: bestDistance,
        length: bestLength,
      };
    },
    [pathMeasure, totalLength],
  );

  const syncProgress = useCallback(
    (nextLength: number, nextTrailPath: string) => {
      const clampedLength = Math.min(totalLength, Math.max(0, nextLength));
      const nextCheckpointIndex = currentStroke.checkpoints.findIndex(
        ratio => clampedLength < totalLength * ratio - 10,
      );
      const visibleCheckpointIndex =
        nextCheckpointIndex === -1
          ? currentStroke.checkpoints.length
          : nextCheckpointIndex;
      const nextStrokeTrails = [...strokeTrailsRef.current];
      const strokeIndex = activeStrokeIndexRef.current;
      const strokeComplete = clampedLength / totalLength >= COMPLETE_RATIO;
      const letterComplete =
        strokeComplete && strokeIndex >= current.strokes.length - 1;

      nextStrokeTrails[strokeIndex] = nextTrailPath;

      strokeTrailsRef.current = nextStrokeTrails;
      setStrokeTrails(nextStrokeTrails);

      if (letterComplete) {
        tracedLengthRef.current = clampedLength;
        trailPathRef.current = nextTrailPath;
        isCompleteRef.current = true;
        setTracedLength(clampedLength);
        setCheckpointIndex(visibleCheckpointIndex);
        setIsComplete(true);
        setStatusText(`Amazing! ${current.letter} is complete.`);
        return;
      }

      if (strokeComplete) {
        const nextStrokeIndex = strokeIndex + 1;

        activeStrokeIndexRef.current = nextStrokeIndex;
        tracedLengthRef.current = 0;
        trailPathRef.current = '';
        isTracingRef.current = false;

        setActiveStrokeIndex(nextStrokeIndex);
        setTracedLength(0);
        setCheckpointIndex(0);
        setIsTracing(false);
        setStatusText(`Great! Now trace stroke ${nextStrokeIndex + 1}.`);

        return;
      }

      tracedLengthRef.current = clampedLength;
      trailPathRef.current = nextTrailPath;
      setTracedLength(clampedLength);
      setCheckpointIndex(visibleCheckpointIndex);
      setStatusText('Keep tracing!');
    },
    [
      current.letter,
      current.strokes.length,
      currentStroke.checkpoints,
      totalLength,
    ],
  );

  const handleTraceStart = useCallback(
    (x: number, y: number) => {
      if (isCompleteRef.current) {
        return;
      }

      const point = toViewBoxPoint(x, y);
      const nearest = getNearestPathPoint(point, tracedLengthRef.current);
      const currentLength = tracedLengthRef.current;
      const startsNearCurrentProgress =
        currentLength < 8
          ? nearest.length < PROGRESS_LOOKAHEAD
          : nearest.length >= currentLength - HIT_RADIUS &&
            nearest.length <= currentLength + PROGRESS_LOOKAHEAD;

      if (nearest.distance > HIT_RADIUS || !startsNearCurrentProgress) {
        setStatusText('Start on the glowing dot.');
        return;
      }

      const nextTrailPath = trailPathRef.current
        ? `${trailPathRef.current} M${nearest.x.toFixed(1)} ${nearest.y.toFixed(
            1,
          )}`
        : `M${nearest.x.toFixed(1)} ${nearest.y.toFixed(1)}`;
      isTracingRef.current = true;
      setIsTracing(true);
      syncProgress(Math.max(currentLength, nearest.length), nextTrailPath);
    },
    [getNearestPathPoint, syncProgress, toViewBoxPoint],
  );
  const MAX_FORWARD_DISTANCE = 25;

  const handleTraceMove = useCallback(
    (x: number, y: number) => {
      if (!isTracingRef.current || isCompleteRef.current) {
        return;
      }

      const point = toViewBoxPoint(x, y);
      const nearest = getNearestPathPoint(point, tracedLengthRef.current);
      const currentLength = tracedLengthRef.current;

      if (nearest.distance > HIT_RADIUS) {
        setStatusText('Stay on the letter path.');
        return;
      }

      if (nearest.length < currentLength - HIT_RADIUS) {
        setStatusText('Move forward along the path.');
        return;
      }

      if (nearest.length > currentLength + PROGRESS_LOOKAHEAD) {
        setStatusText('Slow down and follow the dots.');
        return;
      }

      if (
        currentLength > 0 &&
        nearest.length > currentLength + MAX_FORWARD_DISTANCE
      ) {
        setStatusText('Continue on the current stroke.');
        return;
      }

      const nextTrailPath = `${trailPathRef.current} L${nearest.x.toFixed(
        1,
      )} ${nearest.y.toFixed(1)}`;
      syncProgress(Math.max(currentLength, nearest.length), nextTrailPath);
    },
    [getNearestPathPoint, syncProgress, toViewBoxPoint],
  );

  const handleTraceEnd = useCallback(() => {
    isTracingRef.current = false;
    setIsTracing(false);

    if (isCompleteRef.current) {
      return;
    }

    setStatusText(
      tracedLengthRef.current > 0
        ? 'Lift and continue from the current dot.'
        : 'Touch the first dot.',
    );
  }, []);

  const panGesture = usePanGesture({
    minDistance: 0,
    runOnJS: true,
    onBegin: ({ x, y }) => handleTraceStart(x, y),
    onUpdate: ({ x, y }) => handleTraceMove(x, y),
    onFinalize: () => handleTraceEnd(),
  });

  const handleNext = () => {
    if (currentIndex < traceLetters.length - 1) {
      setIsNext(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsNext(false);
      setCurrentIndex(prev => prev - 1);
    }
  };
  console.log(current.hint2?.[currentIndex], 'venom');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${data.lightColor}22`,
        },
      ]}
    >
      <CustomTopbar data={data} progress={screenProgress} />

      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Trace each letter with Coco! Tap, follow, and practice your writing!"
      />

      <View
        style={[
          styles.infoSection,
          styles.tracingProgressSection,
          { borderColor: data.darkColor },
        ]}
      >
        <View style={[styles.tracingProgress]}>
          <Text
            style={[
              styles.statusText,
              styles.traceProgessText,
              { color: data.darkColor },
            ]}
          >
            stroke: {strokeTrails.length}/{current.strokes.length}
          </Text>
        </View>

        <View style={styles.tracingProgress}>
          <Text
            style={[
              styles.statusText,
              styles.traceProgessText,
              { color: data.darkColor },
            ]}
          >
            {isComplete ? '100' : Math.round(letterProgress * 100)}%
          </Text>
        </View>
      </View>

      <AnimatedSwitcher
        animatedKey={current.letter}
        isNext={isNext}
        style={styles.traceSection}
      >
        <GestureDetector gesture={panGesture}>
          <View
            style={[
              styles.traceCard,
              {
                borderColor: isComplete ? '#28a745' : data.darkColor,
                backgroundColor: '#fffdf8',
              },
            ]}
            onLayout={handleCanvasLayout}
          >
            <Svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
            >
              <Rect
                x={12}
                y={14}
                width={VIEW_BOX_WIDTH - 24}
                height={VIEW_BOX_HEIGHT - 28}
                rx={18}
                fill={`${data.lightColor}2B`}
              />
              <G opacity={0.48}>
                <Path
                  d="M30 80 H210 M30 132 H210 M30 184 H210"
                  stroke={data.midColor}
                  strokeWidth={2}
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                />
              </G>
              {current.strokes.map((strokeItem, index) => (
                <Path
                  key={`${current.letter}-guide-bg-${index}`}
                  d={strokeItem.path}
                  stroke={`${data.midColor}34`}
                  strokeWidth={44}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {current.strokes.map((strokeItem, index) => (
                <Path
                  key={`${current.letter}-guide-inner-${index}`}
                  d={strokeItem.path}
                  stroke="#fff"
                  strokeWidth={28}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {current.strokes.map((strokeItem, index) => (
                <Path
                  key={`${current.letter}-guide-dash-${index}`}
                  d={strokeItem.path}
                  stroke={`${data.darkColor}42`}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 14"
                  fill="none"
                />
              ))}
              {current.strokes.map((strokeItem, index) => {
                if (index >= activeStrokeIndex && !isComplete) {
                  return null;
                }

                return (
                  <Path
                    key={`${current.letter}-completed-${index}`}
                    d={strokeItem.path}
                    stroke={isComplete ? '#28a745' : '#ff8a2b'}
                    strokeWidth={30}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                );
              })}
              {!isComplete ? (
                <Path
                  d={currentStroke.path}
                  stroke="#ff8a2b"
                  // stroke={data.darkColor}
                  strokeWidth={30}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray={`${totalLength} ${totalLength}`}
                  strokeDashoffset={Math.max(totalLength - tracedLength, 0)}
                />
              ) : null}
              {strokeTrails.map((trailPath, index) =>
                trailPath.length > 0 ? (
                  <Path
                    key={`${current.letter}-trail-${index}`}
                    d={trailPath}
                    stroke={isComplete ? '#fff' : '#ffe76a'}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity={isComplete ? 0.3 : 0.5}
                  />
                ) : null,
              )}
              {guidePoints.map((point, index) => {
                const isDone = index < checkpointIndex;
                const isCurrent = index === checkpointIndex && !isComplete;

                return !isComplete ? (
                  <G key={`${current.letter}-${index}`}>
                    {!isDone && (
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={isCurrent ? 13 : 9}
                        fill={isDone || isComplete ? '#28a745' : '#fff'}
                        stroke={isCurrent ? '#ff8a2b' : data.darkColor}
                        strokeWidth={isCurrent ? 5 : 3}
                      />
                    )}
                    {isCurrent ? (
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={24}
                        fill="#ff8a2b"
                        opacity={0.16}
                      />
                    ) : null}
                  </G>
                ) : null;
              })}
            </Svg>

            {/* <Animated.View style={[styles.startBadge, startDotStyle]}>
              <Text style={styles.startBadgeText}>
                {isComplete ? 'Done' : isTracing ? 'Trace' : 'Start'}
              </Text>
            </Animated.View> */}
          </View>
        </GestureDetector>
      </AnimatedSwitcher>

      <View
        style={[
          styles.infoSection,
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.lightColor}33`,
          },
        ]}
      >
        <View style={styles.letterPill}>
          <Text style={[styles.letterPillText, { color: data.darkColor }]}>
            {current.letter}
          </Text>
        </View>
        <View style={[styles.feedbackCopy, { alignItems: 'center' }]}>
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={[styles.hintText, { textAlign: 'center' }]}>
            {current.hint}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.hintText,
              styles.characterMsg,
              {
                color: data.darkColor,
              },
            ]}
          >
            {current.hint2?.[activeStrokeIndex]}
          </Text>
          <Image
            source={
              isComplete
                ? require('../../assets/images/character/great.png')
                : require('../../assets/images/character/standing.png')
            }
            style={styles.characterImage}
          />
        </View>
      </View>

      <View style={styles.actionRow}>
        <ActionButton
          bottomBorderWidth={8}
          radius={18}
          backgroundColor="#e8b59e"
          bottomBorderColor="#d84d16ce"
          onPress={handlePrev}
        >
          <FontAwesome6
            name="chevron-left"
            iconStyle="solid"
            size={20}
            color="#d84d16ce"
          />
        </ActionButton>
        {/* {for testing only } */}
        <TouchableOpacity onPress={handleNext}>
          <Text>pass</Text>
        </TouchableOpacity>
        <CustomButton
          width={wp(40)}
          bottomBorderColor={isComplete ? '#0d8f3e' : '#d84e16'}
          colors={isComplete ? ['#35c46b', '#1ca952'] : ['#ff7b38', '#ff6425']}
          onPress={isComplete ? handleNext : resetTrace}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {isComplete ? 'Next' : 'Retry'}
            </Text>
            <FontAwesome6
              name={isComplete ? 'chevron-right' : 'rotate-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
      </View>
    </View>
  );
};

export default TracingScreen;
