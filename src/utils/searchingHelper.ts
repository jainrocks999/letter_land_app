import { searchingConstants } from '../config/constants';
import Cookie1Svg from '../features/feeding/components/svgs/Cookie1Svg';
import Cookie2Svg from '../features/feeding/components/svgs/Cookie2Svg';
import Cookie3Svg from '../features/feeding/components/svgs/Cookie3Svg';
import Cookie4Svg from '../features/feeding/components/svgs/Cookie4Svg';
import Cookie5Svg from '../features/feeding/components/svgs/Cookie5Svg';
import Cookie6Svg from '../features/feeding/components/svgs/Cookie6Svg';
import Cookie7Svg from '../features/feeding/components/svgs/Cookie7Svg';
import Cookie8Svg from '../features/feeding/components/svgs/Cookie8Svg';
import { alphabetData } from '../features/learning/data/learning.data';
import { RectType, SearchQuestionType } from '../types/search.types';

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const activity = searchingConstants.ACTIVITY;

export const generateQuestions = (): SearchQuestionType[] => {
  const shuffledLetters = shuffle(alphabetData);
  const selectedQues = shuffledLetters.slice(
    0,
    searchingConstants.TOTAL_ROUNDS,
  );

  const activityPool = shuffle([
    activity.MONSTER,
    activity.MONSTER,
    activity.MONSTER,
    activity.MONSTER,
    activity.MONSTER,

    activity.FIND,
    activity.FIND,
    activity.FIND,
    activity.FIND,
    activity.FIND,

    activity.MATCH,
    activity.MATCH,
    activity.MATCH,
    activity.MATCH,
    activity.MATCH,
  ]);

  return selectedQues.map((target, index) => {
    const randomPositions = shuffle(
      activityPool[index] === activity.MONSTER ? POSITIONS : MATCH_POSITIONS,
    );
    // const randomPositions=shuffle(MATCH_POSITIONS)
    const wrongOptions = shuffle(
      alphabetData.filter(item => item.letter !== target.letter),
    ).slice(
      0,
      activityPool[index] === activity.MONSTER
        ? 7
        : activityPool[index] !== activity.FIND
        ? 5
        : 3,
    );

    const options = shuffle([target, ...wrongOptions]).map(
      (options, index) => ({ data: options, ...randomPositions[index] }),
    );
    return {
      id: index + 1,
      activity: activityPool[index],
      target,
      options,
    };
  });
};

export const generateQuestionsUpgrade = (
  isFeed?: boolean,
  option?: number,
): SearchQuestionType[] => {
  const shuffledLetters = shuffle(alphabetData);

  const selectedQues = shuffledLetters.slice(
    0,
    searchingConstants.TOTAL_ROUNDS,
  );

  return selectedQues.map((target, index) => {
    const randomPositions = shuffle(isFeed ? POSITIONS : MATCH_POSITIONS);

    const wrongOptions = shuffle(
      alphabetData.filter(item => item.letter !== target.letter),
    ).slice(0, option || 7);

    const options = shuffle([target, ...wrongOptions]).map(
      (option, optionIndex) => ({
        data: option,
        ...randomPositions[optionIndex],
      }),
    );

    return {
      id: index + 1,
      activity: activity.MONSTER,
      target,
      options,
    };
  });
};

export const POSITIONS = [
  { x: 55, y: 50 },
  { x: 55, y: 130 },
  { x: 125, y: 50 },
  { x: 125, y: 130 },
  { x: 190, y: 50 },
  { x: 190, y: 130 },
  { x: 255, y: 50 },
  { x: 255, y: 130 },
];
export const MATCH_POSITIONS = [
  { x: 50, y: 60 },
  { x: 50, y: 180 },
  { x: 175, y: 60 },
  { x: 175, y: 180 },
  { x: 300, y: 60 },
  { x: 300, y: 180 },
];
export const CookieSvg = shuffle([
  Cookie1Svg,
  Cookie2Svg,
  Cookie3Svg,
  Cookie4Svg,
  Cookie5Svg,
  Cookie6Svg,
  Cookie7Svg,
  Cookie8Svg,
]);

export const isInsideRect = (x: number, y: number, rect: RectType) => {
  'worklet';
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
};
