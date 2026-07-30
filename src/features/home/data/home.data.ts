import { ImageSourcePropType } from 'react-native';
import { ROUTES } from '../../../app/navigation/routeNames';

type ActivityRoutes = typeof ROUTES.LEARNING | typeof ROUTES.TRACING;

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
}

export const activityData: Castle[] = [
  {
    id: '1',
    image: require('../../../assets/images/castles/level_1.png'),
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
    image: require('../../../assets/images/castles/level_2.png'),
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
    image: require('../../../assets/images/castles/level_3.png'),
    title: 'Searching',
    topSkyCol: '#00b894',
    bottomSkyCol: '#c8f7e5',
    innerCard: {
      icon: '🔍',
      cardTitle: 'Find the Letter',
      shortDes: 'Find the correct letter and improve your letter recognition!',
      tag: "Let's Trace",
      darkColor: '#c09e74',
      midColor: '#3d3a45',
      lightColor: '#dbc68d',
    },
  },
  {
    id: '4',
    image: require('../../../assets/images/castles/level_4.png'),
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
    },
  },
  {
    id: '5',
    image: require('../../../assets/images/castles/level_5.png'),
    title: 'Choosing',
    topSkyCol: '#2c3e90',
    bottomSkyCol: '#6dd5fa',
    innerCard: {
      icon: '🧩',
      cardTitle: 'Complete Letter',
      shortDes:
        'Choose the missing piece to complete each letter and improve letter recognition.',
      tag: 'Complete It',
      darkColor: '#9e6b38',
      midColor: '#d8493a',
      lightColor: '#eba75e',
    },
  },
  {
    id: '6',
    image: require('../../../assets/images/castles/level_6.png'),
    title: 'Filling',
    topSkyCol: '#43c6ac',
    bottomSkyCol: '#f8ffae',
    innerCard: {
      icon: '🖍',
      cardTitle: 'Letter Fill',
      shortDes:
        'Fill in the missing letter to complete simple words and build vocabulary.',
      tag: 'Fill the Gap',
      darkColor: '#a59aaa',
      midColor: '#d87b76',
      lightColor: '#eedeec',
    },
  },
  {
    id: '7',
    image: require('../../../assets/images/castles/level_7.png'),
    title: 'Building',
    topSkyCol: '#ff6b6b',
    bottomSkyCol: '#ffe66d',
    innerCard: {
      icon: '🔤',
      cardTitle: 'Build Words',
      shortDes:
        'Arrange letters in the correct order to build fun and easy words.',
      tag: 'Build Words',
      darkColor: '#6a7da0',
      midColor: '#5a4940',
      lightColor: '#e6d7b7',
    },
  },
  {
    id: '8',
    image: require('../../../assets/images/castles/level_8.png'),
    title: 'Matching 2.0',
    topSkyCol: '#8e44ad',
    bottomSkyCol: '#eedcff',
    innerCard: {
      icon: '🖼️',
      cardTitle: 'Match Words',
      shortDes:
        'Match each word with the correct picture and learn new vocabulary.',
      tag: 'Start Matching',
      darkColor: '#75a5a7',
      midColor: '#5386b1',
      lightColor: '#9ad7d7',
    },
  },
  {
    id: '9',
    image: require('../../../assets/images/castles/level_9.png'),
    title: 'Reading',
    topSkyCol: '#3f87f5',
    bottomSkyCol: '#b6e3ff',
    innerCard: {
      icon: '📖',
      cardTitle: 'Read Words',
      shortDes:
        'Read simple words aloud to improve reading confidence and pronunciation.',
      tag: 'Start Reading',
      darkColor: '#cd4a35',
      midColor: '#ceb200',
      lightColor: '#efdfc6',
    },
  },
];
