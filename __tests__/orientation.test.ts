import {
  getPortraitStageLayout,
  getStageTransform,
} from '../src/utils/orientation';

describe('getPortraitStageLayout', () => {
  it('keeps portrait screens edge to edge', () => {
    const layout = getPortraitStageLayout(768, 1024);

    expect(layout.isLandscape).toBe(false);
    expect(layout.contentWidth).toBe(768);
    expect(layout.contentHeight).toBe(1024);
    expect(layout.scale).toBe(1);
    expect(layout.offsetX).toBe(0);
    expect(layout.offsetY).toBe(0);
  });

  it('centres a scaled portrait screen with black bars in landscape', () => {
    const layout = getPortraitStageLayout(1366, 1024);

    expect(layout.isLandscape).toBe(true);
    // Layout stays at the device's portrait bounds.
    expect(layout.contentWidth).toBe(1024);
    expect(layout.contentHeight).toBe(1366);
    expect(layout.scale).toBeCloseTo(1024 / 1366);

    // Visible frame keeps the device's portrait ratio (3:4 here) and fills
    // the landscape height.
    expect(layout.frameHeight).toBeCloseTo(1024);
    expect(layout.frameWidth).toBeCloseTo(768, 0);
    expect(layout.frameWidth / layout.frameHeight).toBeCloseTo(1024 / 1366);

    // Centred horizontally: equal black bars on both sides.
    expect(layout.offsetX).toBe(171);
    expect(layout.offsetX + layout.contentWidth / 2).toBe(1366 / 2);
    expect(layout.offsetY).toBe(-171);
  });

  it('keeps the transform style shape stable across rotation', () => {
    expect(getStageTransform(1, false)).toEqual([{ scale: 1 }]);
    expect(getStageTransform(0.75, true)).toEqual([{ scale: 0.75 }]);
  });

  it('uses the device portrait ratio on taller iPads', () => {
    const layout = getPortraitStageLayout(1194, 834);

    expect(layout.frameHeight).toBeCloseTo(834);
    expect(layout.frameWidth / layout.frameHeight).toBeCloseTo(834 / 1194);
    expect(layout.offsetX).toBe(180);
  });
});
