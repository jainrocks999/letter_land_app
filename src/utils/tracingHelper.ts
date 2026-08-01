import { svgPathProperties } from 'svg-path-properties';
import { tracingConstants } from '../config/constants';
import { Bounds, NearestPathPoint, Point } from '../types/tracing.types';
// import SVGPathProperties from 'svg-path-properties/dist/types/svg-path-properties';

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

export const getNearestPathPoint = (
  point: Point,
  currentLength: number,
  pathMeasure: InstanceType<typeof svgPathProperties>,
  totalLength: number,
): NearestPathPoint => {
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
};
