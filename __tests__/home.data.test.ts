import {
  activityData,
  getCharacterLevel,
  getRequiredStickers,
  getStickersToUnlock,
  isActivityLocked,
} from '../src/features/home/data/home.data';
import { UserActivitiesType } from '../src/services/mmkv.service';

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

describe('Home - character current level', () => {
  const progress = (values: Record<string, number>): UserActivitiesType =>
    values as UserActivitiesType;

  test('waits on the first level before anything is played', () => {
    expect(getCharacterLevel(activityData, progress({}), 0)).toEqual({
      index: 0,
      isSad: false,
    });
  });

  test('stands on a level that is only partly done', () => {
    expect(
      getCharacterLevel(activityData, progress({ learning: 70 }), 0),
    ).toEqual({ index: 0, isSad: false });
  });

  test('moves to the next level once the current one is finished', () => {
    // level 2 needs 1 sticker, so it is already unlocked here
    expect(
      getCharacterLevel(activityData, progress({ learning: 100 }), 1),
    ).toEqual({ index: 1, isSad: false });
  });

  test('waits on the locked next level with a sad face', () => {
    // level 2 needs 1 sticker, none collected yet
    expect(
      getCharacterLevel(activityData, progress({ learning: 100 }), 0),
    ).toEqual({ index: 1, isSad: true });
  });

  test('keeps the character on the level being replayed', () => {
    const data = progress({ learning: 100, tracing: 40 });
    expect(getCharacterLevel(activityData, data, 3)).toEqual({
      index: 1,
      isSad: false,
    });
  });

  test('rests happy on the last level when everything is complete', () => {
    const allDone = progress({
      learning: 100,
      tracing: 100,
      feeding: 100,
      matching: 100,
      searching: 100,
      filling: 100,
      spelling: 100,
      bingo: 100,
      storytellinglist: 100,
    });
    expect(getCharacterLevel(activityData, allDone, 10)).toEqual({
      index: activityData.length - 1,
      isSad: false,
    });
  });
});
