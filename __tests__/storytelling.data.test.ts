import {
  STORY_LEVELS,
  getStoriesByLevel,
  getStoryById,
  getStoryLevelInfo,
  storyData,
} from '../src/features/storytelling/data/storytelling.data';

describe('Story Time - story data', () => {
  test('has ten stories with unique ids', () => {
    expect(storyData).toHaveLength(10);
    expect(new Set(storyData.map(story => story.id)).size).toBe(10);
  });

  test('splits the stories across three levels', () => {
    expect(STORY_LEVELS).toHaveLength(3);
    expect(getStoriesByLevel(1)).toHaveLength(4);
    expect(getStoriesByLevel(2)).toHaveLength(2);
    expect(getStoriesByLevel(3)).toHaveLength(4);
    expect(
      getStoriesByLevel(1).length +
        getStoriesByLevel(2).length +
        getStoriesByLevel(3).length,
    ).toBe(storyData.length);
  });

  test('every story has five pages with text and an activity', () => {
    storyData.forEach(story => {
      expect(story.title.length).toBeGreaterThan(0);
      expect(story.banner).toBeTruthy();
      expect(story.pages).toHaveLength(5);

      story.pages.forEach(page => {
        expect(page.image).toBeTruthy();
        expect(page.text.length).toBeGreaterThan(0);
        expect(page.activity.prompt.length).toBeGreaterThan(0);
        expect(page.activity.answer.length).toBeGreaterThan(0);
      });
    });
  });

  test('every multiple-choice page includes its answer', () => {
    storyData.forEach(story => {
      story.pages.forEach(page => {
        if (page.activity.options) {
          expect(page.activity.options).toContain(page.activity.answer);
        }
      });
    });
  });

  test('level two spelling pages always offer blend choices', () => {
    getStoriesByLevel(2).forEach(story => {
      story.pages.forEach(page => {
        expect(page.activity.options).toHaveLength(3);
        expect(page.activity.options).toContain(page.activity.answer);
      });
    });
  });

  test('looks up levels and stories safely', () => {
    expect(getStoryById('sam-the-cat')?.level).toBe(1);
    expect(getStoryById('missing')).toBeUndefined();
    expect(getStoryLevelInfo(3).rewardStars).toBe(20);
  });
});
