import { searchingConstants } from '../config/constants';
import { alphabetData } from '../features/learning/data/learning.data';
import Cookie1Svg from '../features/searching/components/svgs/Cookie1Svg';
import Cookie2Svg from '../features/searching/components/svgs/Cookie2Svg';
import Cookie3Svg from '../features/searching/components/svgs/Cookie3Svg';
import Cookie4Svg from '../features/searching/components/svgs/Cookie4Svg';
import Cookie5Svg from '../features/searching/components/svgs/Cookie5Svg';
import Cookie6Svg from '../features/searching/components/svgs/Cookie6Svg';
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
      activityPool[index]===activity.MONSTER ? POSITIONS : MATCH_POSITIONS 
    );
    // const randomPositions=shuffle(MATCH_POSITIONS)
    const wrongOptions = shuffle(
      alphabetData.filter(item => item.letter !== target.letter),
    ).slice(0, activityPool[index] !== activity.FIND ? 5 : 3);

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

export const POSITIONS = [
  { x: 85, y: 65 },
  { x: 132, y: 25 },
  { x: 193, y: 25 },
  { x: 132, y: 110 },
  { x: 193, y: 110 },
  { x: 240, y: 65 },
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
