import { svgPathProperties } from 'svg-path-properties';
import { tracingConstants } from '../config/constants';
import { Bounds, NearestPathPoint, Point } from '../types/tracing.types';

const { VIEW_BOX_WIDTH, VIEW_BOX_HEIGHT } = tracingConstants;

export const toViewBoxPoint = (
  x: number,
  y: number,
  canvasBounds: Bounds,
): Point => {
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
};

export interface PathSamples {
  points: Point[];
  lengths: number[];
  step: number;
}

/**
 * Sample a path ONCE per stroke and reuse it for every pointer event.
 *
 * `svgPathProperties.getPointAtLength()` is cheap for straight lines but very
 * expensive for cubic curves (binary search + arc-length integration on every
 * call). Round letters (B, C, D, G, O, ...) called it 50-60 times per move,
 * which is what made their drawing animation stutter on both platforms.
 */
export const buildPathSamples = (
  pathMeasure: InstanceType<typeof svgPathProperties>,
  totalLength: number,
  step = 2,
): PathSamples => {
  const count = Math.max(1, Math.ceil(totalLength / step));
  const points: Point[] = [];
  const lengths: number[] = [];

  for (let i = 0; i <= count; i += 1) {
    const length = Math.min(totalLength, (i * totalLength) / count);
    points.push(pathMeasure.getPointAtLength(length));
    lengths.push(length);
  }

  return { points, lengths, step: totalLength / count };
};

const projectOnSegment = (
  point: Point,
  start: Point,
  end: Point,
): { point: Point; t: number } => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return { point: start, t: 0 };
  }

  const rawT = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq;
  const t = Math.max(0, Math.min(1, rawT));

  return {
    point: { x: start.x + t * dx, y: start.y + t * dy },
    t,
  };
};

export const getNearestPathPoint = (
  point: Point,
  currentLength: number,
  samples: PathSamples,
): NearestPathPoint => {
  const { points, lengths, step } = samples;

  if (points.length === 0) {
    return { x: point.x, y: point.y, distance: 0, length: currentLength };
  }

  const SEARCH_BEHIND = 20;
  const SEARCH_AHEAD = 70;
  const startIndex = Math.max(
    0,
    Math.floor((currentLength - SEARCH_BEHIND) / step),
  );
  const endIndex = Math.min(
    points.length - 1,
    Math.ceil((currentLength + SEARCH_AHEAD) / step),
  );

  let bestIndex = startIndex;
  let bestDistanceSq = Number.MAX_VALUE;

  for (let i = startIndex; i <= endIndex; i += 1) {
    const dx = points[i].x - point.x;
    const dy = points[i].y - point.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq < bestDistanceSq) {
      bestDistanceSq = distanceSq;
      bestIndex = i;
    }
  }

  // Reaching the final sample must report the full path length. Without this,
  // a finger that stops exactly on the end can be stuck just short of 100%.
  if (bestIndex === points.length - 1) {
    const endPoint = points[points.length - 1];
    return {
      x: endPoint.x,
      y: endPoint.y,
      distance: Math.sqrt(bestDistanceSq),
      length: lengths[lengths.length - 1],
    };
  }

  // Refine against the two neighbouring segments using cheap linear
  // projection instead of more getPointAtLength() calls.
  let bestProjected = points[bestIndex];
  let bestT = 0;
  let bestSegmentIndex = bestIndex;
  bestDistanceSq = (bestProjected.x - point.x) ** 2 +
    (bestProjected.y - point.y) ** 2;

  const segmentStart = Math.max(0, bestIndex - 1);
  const segmentEnd = Math.min(points.length - 2, bestIndex);

  for (let i = segmentStart; i <= segmentEnd; i += 1) {
    const projected = projectOnSegment(point, points[i], points[i + 1]);
    const dx = projected.point.x - point.x;
    const dy = projected.point.y - point.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq < bestDistanceSq) {
      bestDistanceSq = distanceSq;
      bestProjected = projected.point;
      bestT = projected.t;
      bestSegmentIndex = i;
    }
  }

  const segmentLength = lengths[bestSegmentIndex + 1] - lengths[bestSegmentIndex];

  return {
    ...bestProjected,
    distance: Math.sqrt(bestDistanceSq),
    length: lengths[bestSegmentIndex] + segmentLength * bestT,
  };
};
