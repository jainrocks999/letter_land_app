import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import React from 'react';
import Animated, {
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import GuidePaths from './GuidePaths';
import {
  Point,
  TraceLetter,
  TraceStroke,
} from '../../../../types/tracing.types';
import { rf } from '../../../../utils/responsive';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  current: TraceLetter;
  isComplete: boolean;
  data: {
    darkColor: string;
    midColor: string;
    lightColor: string;
  };
  viewBoxWidth: number;
  viewBoxHeight: number;

  activeStrokeIndex: number;
  checkpointIndex: number;
  currentStroke: TraceStroke;

  totalLength: number;
  tracedLengthSv: SharedValue<number>;
  activeTrailSv: SharedValue<string>;

  strokeTrails: string[];
  guidePoints: Point[];

  onLayout: (e: LayoutChangeEvent) => void;
}

const TracingCanvas: React.FC<Props> = ({
  current,
  isComplete,
  data,
  viewBoxWidth,
  viewBoxHeight,
  activeStrokeIndex,
  currentStroke,
  totalLength,
  tracedLengthSv,
  activeTrailSv,
  strokeTrails,
  guidePoints,
  checkpointIndex,
  onLayout,
}) => {
  // These props are updated on the UI thread straight from the gesture
  // handlers. No React render happens while the finger moves.
  const activeStrokeProps = useAnimatedProps(() => ({
    strokeDashoffset: Math.max(totalLength - tracedLengthSv.value, 0),
  }));
  const activeTrailProps = useAnimatedProps(() => ({
    d: activeTrailSv.value,
  }));

  return (
    <View
      style={[
        styles.traceCard,
        {
          borderColor: isComplete ? '#28a745' : data.darkColor,
          backgroundColor: '#fffdf8',
        },
      ]}
      onLayout={onLayout}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        <Rect
          x={12}
          y={14}
          width={viewBoxWidth - 24}
          height={viewBoxHeight - 28}
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
        <GuidePaths
          strokes={current.strokes}
          guideColor={data.midColor}
          fillColor={'#fff'}
          outStrokeWidth={44}
          innerStrokeWidth={28}
          dashStrokeWidth={6}
        />

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
          <AnimatedPath
            d={currentStroke.path}
            stroke="#ff8a2b"
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={`${totalLength} ${totalLength}`}
            animatedProps={activeStrokeProps}
          />
        ) : null}
        {!isComplete ? (
          <AnimatedPath
            d="M-1000 -1000"
            stroke="#ffe76a"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.5}
            animatedProps={activeTrailProps}
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
    </View>
  );
};

export default React.memo(TracingCanvas);

const styles = StyleSheet.create({
  traceCard: {
    flex: 1,
    borderWidth: 1.5,
    borderBottomWidth: rf(7),
    borderRadius: rf(12),
    overflow: 'hidden',
    marginVertical: rf(10),
  },
});
