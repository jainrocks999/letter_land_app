import {
  STORY_ACTIVITY_LABELS,
  STORY_LEVELS,
  getActivityOptions,
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

  test('every story has five pages with text', () => {
    storyData.forEach(story => {
      expect(story.title.length).toBeGreaterThan(0);
      expect(story.banner).toBeTruthy();
      expect(story.pages).toHaveLength(5);

      story.pages.forEach(page => {
        expect(page.image).toBeTruthy();
        expect(page.text.length).toBeGreaterThan(0);
      });
    });
  });

  test('uses the during-story exercises from the spec', () => {
    const firstStory = getStoryById('sam-the-cat');
    expect(firstStory?.pages.map(page => page.activity?.type)).toEqual([
      'spell',
      'tap',
      'predict',
      'feel',
      undefined,
    ]);

    const lastStory = getStoryById('mike-rides-a-bike');
    expect(lastStory?.pages.map(page => page.activity?.type)).toEqual([
      'magic_e',
      'build',
      'picture_q',
      'rhyme',
      'build',
    ]);
  });

  test('level 1 and 2 end after page four without a question', () => {
    [...getStoriesByLevel(1), ...getStoriesByLevel(2)].forEach(story => {
      story.pages.slice(0, 4).forEach(page => {
        expect(page.activity).toBeDefined();
      });
      expect(story.pages[4].activity).toBeUndefined();
    });
  });

  test('level 3 has an activity on every page', () => {
    getStoriesByLevel(3).forEach(story => {
      story.pages.forEach(page => {
        expect(page.activity).toBeDefined();
      });
    });
  });

  test('every activity has a prompt, answer and label', () => {
    storyData.forEach(story => {
      story.pages.forEach(page => {
        if (!page.activity) return;

        expect(page.activity.prompt.length).toBeGreaterThan(0);
        expect(page.activity.answer.length).toBeGreaterThan(0);
        expect(STORY_ACTIVITY_LABELS[page.activity.type]).toBeTruthy();
      });
    });
  });

  test('every activity except magic e includes a hint', () => {
    storyData.forEach(story => {
      story.pages.forEach(page => {
        if (!page.activity || page.activity.type === 'magic_e') return;
        expect(page.activity.hint?.length).toBeGreaterThan(0);
      });
    });
  });

  test('every option-based activity includes its answer', () => {
    storyData.forEach(story => {
      story.pages.forEach(page => {
        if (!page.activity) return;
        if (
          page.activity.type === 'build' ||
          page.activity.type === 'magic_e'
        ) {
          return;
        }

        const options = getActivityOptions(page.activity);
        expect(options.length).toBeGreaterThanOrEqual(2);
        expect(options.map(option => option.value)).toContain(
          page.activity.answer,
        );
      });
    });
  });

  test('looks up levels and stories safely', () => {
    expect(getStoryById('sam-the-cat')?.level).toBe(1);
    expect(getStoryById('missing')).toBeUndefined();
    expect(getStoryLevelInfo(3).rewardStars).toBe(20);
  });
});
