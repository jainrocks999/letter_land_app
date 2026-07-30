import { ImageSourcePropType } from 'react-native';

export interface OnBoardingSlideType {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
  topColor: string;
  bottomColor: string;
  badgeIcon: string;
  badgeText: string;
}

export const onBoardingSlidesData: OnBoardingSlideType[] = [
  {
    id: '1',
    image: require('../../../assets/images/onboarding/illustration1.png'),
    title: 'Welcome to Letter Land.',
    description:
      'Join your little learning buddy and explore magical castles filled with fun alphabet adventures.',
    topColor: '#7b61ff',
    bottomColor: '#e6d9ff',
    badgeIcon: '🏰',
    badgeText: '9 Magical Castles',
  },
  {
    id: '2',
    image: require('../../../assets/images/onboarding/illustration2.png'),
    title: 'One Castle, One Adventure',
    description: 'Unlock exciting castles as you learn letters',
    topColor: '#00b894',
    bottomColor: '#c8f7e5',
    badgeIcon: '✨',
    badgeText: 'Unlock Levels',
  },
  {
    id: '3',
    image: require('../../../assets/images/onboarding/illustration3.png'),
    title: "Let's Start Learning!",
    description:
      'Play fun activities, collect new skills, and become an alphabet champion!',
    topColor: '#ff6b6b',
    bottomColor: '#ffe66d',
    badgeIcon: '🎊',
    badgeText: 'Fun for Kids',
  },
];
