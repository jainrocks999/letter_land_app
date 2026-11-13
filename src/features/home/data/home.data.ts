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
      darkColor: '#b63b35',
      midColor: '#8e1a11',
      lightColor: '#ca4841',
      navigate: ROUTES.TRACING,
    },
  },
  {
    id: '3',
    image: require('../../../assets/images/castles/level_3.webp'),
    // title: 'Searching',
    title: 'Feeding',
    topSkyCol: '#00b894',
    bottomSkyCol: '#c8f7e5',
    innerCard: {
      // icon: '🔍',
      icon: '🍪',
      // cardTitle: 'Find the Letter',
      cardTitle: 'Feed the Letter',
      // shortDes: 'Find the correct letter and improve your letter recognition!',
      shortDes:
        'Find the correct letter and feed it to the hungry character coco!',
      // tag: "Let's find",
      tag: 'Feed It',
      darkColor: '#c09e74',
      midColor: '#3d3a45',
      lightColor: '#dbc68d',
      // navigate: ROUTES.SEARCHING,
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
      darkColor: '#e0a2b6',
      midColor: '#8c662e',
      lightColor: '#eec2d8',
      navigate: ROUTES.MATCHING,
    },
  },
  {
    id: '5',
    image: require('../../../assets/images/castles/level_5.webp'),
    // title: 'Choosing',
    title: 'Searching',
    topSkyCol: '#2c3e90',
    bottomSkyCol: '#6dd5fa',
    innerCard: {
      // icon: '🧩',
      icon: '🔍',
      // cardTitle: 'Complete Letter',
      cardTitle: 'Find the Letter',
      // shortDes:
      //   'Choose the missing piece to complete each letter and improve letter recognition.',
      shortDes: 'Find the correct letter and improve your letter recognition!',
      // tag: 'Complete It',
      tag: "Let's find",
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
      darkColor: '#6a7da0',
      midColor: '#5a4940',
      lightColor: '#e6d7b7',
      navigate: ROUTES.SPELLING,
    },
  },
  {
    id: '8',
    image: require('../../../assets/images/castles/level_8.webp'),
    // image: require('../../../assets/images/castles/level_8_lock.webp'),
    title: 'Bingo',
    topSkyCol: '#8e44ad',
    bottomSkyCol: '#eedcff',
    // topSkyCol: '#9CA3AF',
    // bottomSkyCol: '#E5E7EB',
    innerCard: {
      icon: '🔤',
      cardTitle: 'Letter Bingo',
      shortDes:
        'Play an exciting bingo game by finding and matching the correct letters.',
      tag: 'Bingo',
      darkColor: '#75a5a7',
      midColor: '#5386b1',
      lightColor: '#9ad7d7',
      // isLocked: true,
      navigate: ROUTES.BINGO,
    },
  },
  {
    id: '9',
    image: require('../../../assets/images/castles/level_9.webp'),
    // image: require('../../../assets/images/castles/level_9_lock.webp'),
    title: 'Storytellinglist',
    topSkyCol: '#3f87f5',
    bottomSkyCol: '#b6e3ff',
    // topSkyCol: '#9CA3AF',
    // bottomSkyCol: '#E5E7EB',
    innerCard: {
      icon: '📖',
      cardTitle: 'Read Stories',
      shortDes:
        'Read fun stories aloud and improve your reading and pronunciation skills.',
        tag: 'Start Reading',
      darkColor: '#cd4a35',
      midColor: '#ceb200',
      lightColor: '#efdfc6',
      // isLocked: true,
      navigate:ROUTES.STORYTELLINGLIST
    },
  },
];
