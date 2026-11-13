import {
  activityData,
  getRequiredStickers,
  getStickersToUnlock,
  isActivityLocked,
} from '../src/features/home/data/home.data';

describe('Home - activity level locking', () => {
  const activities = activityData.map(castle => castle.innerCard);

  test('every activity has a numeric sticker requirement', () => {
    activities.forEach(card => {
      expect(typeof getRequiredStickers(card)).toBe('number');
    });
  });

  test('the first activity is always unlocked', () => {
    expect(getRequiredStickers(activities[0])).toBe(0);
    expect(isActivityLocked(activities[0], 0)).toBe(false);
  });

  test('requirements grow with each level', () => {
    const requirements = activities.map(getRequiredStickers);
    expect(requirements).toEqual([...requirements].sort((a, b) => a - b));
  });

  test('a level stays locked until enough stickers are collected', () => {
    const second = activities[1];
    const needed = getRequiredStickers(second);
    expect(isActivityLocked(second, needed - 1)).toBe(true);
    expect(isActivityLocked(second, needed)).toBe(false);
  });

  test('collecting more stickers never relocks a level', () => {
    const third = activities[2];
    const needed = getRequiredStickers(third);
    expect(isActivityLocked(third, needed + 5)).toBe(false);
  });

  test('reports how many more stickers are needed', () => {
    const second = activities[1];
    const needed = getRequiredStickers(second);
    expect(getStickersToUnlock(second, 0)).toBe(needed);
    expect(getStickersToUnlock(second, needed + 2)).toBe(0);
  });
});
