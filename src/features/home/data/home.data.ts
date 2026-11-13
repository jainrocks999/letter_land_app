import { ImageSourcePropType } from 'react-native';
import { ROUTES } from '../../../app/navigation/routeNames';

type ActivityRoutes =
  | typeof ROUTES.LEARNING
  | typeof ROUTES.TRACING
  | typeof ROUTES.FEEDING
  | typeof ROUTES.SEARCHING
  | typeof ROUTES.MATCHING
  | typeof ROUTES.FILLING
  | typeof ROUTES.SPELLING
  | typeof ROUTES.BINGO
  | typeof ROUTES.STORYTELLINGLIST;

export interface Castle {
  id: string;
  image: ImageSourcePropType;
  title: string;
  topSkyCol: string;
  bottomSkyCol: string;
  innerCard: ActivityCard;
}

export interface ActivityCard {
  icon: string;
  cardTitle: string;
  shortDes: string;
  tag: string;
  darkColor: string;
  midColor: string;
  lightColor: string;
  navigate?: ActivityRoutes;
  isLocked?: boolean;
  // stickers the kid must have collected to unlock this activity/level
  requiredStickers?: number;
}
export const activityData: Castle[] = [
  {
    id: '1',
    image: require('../../../assets/images/castles/level_1.webp'),
    title: 'Learning',
    topSkyCol: '#4a90e2',
    bottomSkyCol: '#d8ecff',
    innerCard: {
      icon: '🔠',
      cardTitle: 'Learn Alphabets',
      shortDes:
        'Swipe through giant letters from A to Z and learn the alphabet!',
      tag: 'Start Learning',
      requiredStickers: 0,
      darkColor: '#a94a7e',
      midColor: '#926ea9',
      lightColor: '#d0b9d7',
      navigate: ROUTES.LEARNING,
    },
  },
  {
    id: '2',
    image: require('../../../assets/images/castles/level_2.webp'),
    title: 'Tracing',
    topSkyCol: '#7b61ff',
    bottomSkyCol: '#e6d9ff',
    innerCard: {
      icon: '✏️',
      cardTitle: 'Letter Tracing',
      shortDes: 'Draw each letter with your finger and master the alphabet!',
      tag: "Let's Trace",
      requiredStickers: 1,
      darkColor: '#b63b35',
      midColor: '#8e1a11',
      lightColor: '#ca4841',
      navigate: ROUTES.TRACING,
    },
  },
  {
    id: '3',
    image: require('../../../assets/images/castles/level_3.webp'),
    title: 'Feeding',
    topSkyCol: '#00b894',
    bottomSkyCol: '#c8f7e5',
    innerCard: {
      icon: '🍪',
      cardTitle: 'Feed the Letter',
      shortDes:
        'Find the correct letter and feed it to the hungry character coco!',
      tag: 'Feed It',
      requiredStickers: 3,
      darkColor: '#c09e74',
      midColor: '#3d3a45',
      lightColor: '#dbc68d',
      navigate: ROUTES.FEEDING,
    },
  },
  {
    id: '4',
    image: require('../../../assets/images/castles/level_4.webp'),
    title: 'Matching',
    topSkyCol: '#ff8a00',
    bottomSkyCol: '#ffe0b2',
    innerCard: {
      icon: '🔠',
      cardTitle: 'Match Letters',
      shortDes:
        'Match uppercase letters with their lowercase friends and master the alphabet.',
      tag: 'Start Matching',
      requiredStickers: 4,
      darkColor: '#e0a2b6',
      midColor: '#8c662e',
      lightColor: '#eec2d8',
      navigate: ROUTES.MATCHING,
    },
  },
  {
    id: '5',
    image: require('../../../assets/images/castles/level_5.webp'),
    title: 'Searching',
    topSkyCol: '#2c3e90',
    bottomSkyCol: '#6dd5fa',
    innerCard: {
      icon: '🔍',
      cardTitle: 'Find the Letter',
      shortDes: 'Find the correct letter and improve your letter recognition!',
      tag: "Let's find",
      requiredStickers: 5,
      darkColor: '#9e6b38',
      midColor: '#d8493a',
      lightColor: '#eba75e',
      navigate: ROUTES.SEARCHING,
    },
  },
  {
    id: '6',
    image: require('../../../assets/images/castles/level_6.webp'),
    title: 'Filling',
    topSkyCol: '#43c6ac',
    bottomSkyCol: '#f8ffae',
    innerCard: {
      icon: '🖍',
      cardTitle: 'Letter Fill',
      shortDes:
        'Fill the letter shape with the correct letter and improve your letter recognition!',
      tag: 'Fill It',
      requiredStickers: 6,
      darkColor: '#a59aaa',
      midColor: '#d87b76',
      lightColor: '#eedeec',
      navigate: ROUTES.FILLING,
    },
  },
  {
    id: '7',
    image: require('../../../assets/images/castles/level_7.webp'),
    title: 'Spelling',
    topSkyCol: '#ff6b6b',
    bottomSkyCol: '#ffe66d',
    innerCard: {
      icon: '🗣',
      cardTitle: 'Spell Words',
      shortDes:
        'Put letters in the correct order to spell words and improve your spelling skills.',
      tag: 'Spell Words',
      requiredStickers: 7,
      darkColor: '#6a7da0',
      midColor: '#5a4940',
      lightColor: '#e6d7b7',
      navigate: ROUTES.SPELLING,
    },
  },
  {
    id: '8',
    image: require('../../../assets/images/castles/level_8.webp'),
    title: 'Bingo',
    topSkyCol: '#8e44ad',
    bottomSkyCol: '#eedcff',
    innerCard: {
      icon: '🔤',
      cardTitle: 'Letter Bingo',
      shortDes:
        'Play an exciting bingo game by finding and matching the correct letters.',
      tag: 'Bingo',
      requiredStickers: 8,
      darkColor: '#75a5a7',
      midColor: '#5386b1',
      lightColor: '#9ad7d7',
      navigate: ROUTES.BINGO,
    },
  },
  {
    id: '9',
    image: require('../../../assets/images/castles/level_9.webp'),
    title: 'Storytellinglist',
    topSkyCol: '#3f87f5',
    bottomSkyCol: '#b6e3ff',
    innerCard: {
      icon: '📖',
      cardTitle: 'Read Stories',
      shortDes:
        'Read fun stories aloud and improve your reading and pronunciation skills.',
        tag: 'Start Reading',
      requiredStickers: 10,
      darkColor: '#cd4a35',
      midColor: '#ceb200',
      lightColor: '#efdfc6',
      navigate:ROUTES.STORYTELLINGLIST
    },
  },
];

// stickers needed to open an activity/level
export const getRequiredStickers = (card: ActivityCard): number =>
  card.requiredStickers ?? 0;

// a level opens once the kid has collected enough stickers. Sticker counts only
// ever grow, so a level never re-locks after it has been opened.
export const isActivityLocked = (
  card: ActivityCard,
  collectedStickers: number,
): boolean =>
  Boolean(
    card.isLocked ||
      !card.navigate ||
      collectedStickers < getRequiredStickers(card),
  );

export const getStickersToUnlock = (
  card: ActivityCard,
  collectedStickers: number,
): number => Math.max(getRequiredStickers(card) - collectedStickers, 0);

// the sky fades to these greys while the active level is still locked
export const LOCKED_SKY_COLORS: [string, string] = ['#9ca3af', '#e5e7eb'];
