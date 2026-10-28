import { activityData } from '../../home/data/home.data';

export interface StickerType {
  id: string;
  emoji: string;
  name: string;
  cost: number;
  color: string;
  darkColor: string;
}

export interface TrophyType {
  id: string;
  icon: string;
  title: string;
  lightColor: string;
  midColor: string;
  darkColor: string;
}

// stickers unlock automatically once the kid has earned enough stars in total
export const stickersData: StickerType[] = [
  {
    id: 'chick',
    emoji: '🐣',
    name: 'Baby Chick',
    cost: 10,
    color: '#fff3b0',
    darkColor: '#e0a000',
  },
  {
    id: 'puppy',
    emoji: '🐶',
    name: 'Puppy Pal',
    cost: 30,
    color: '#ffe0b2',
    darkColor: '#ff8a00',
  },
  {
    id: 'butterfly',
    emoji: '🦋',
    name: 'Butterfly',
    cost: 60,
    color: '#d8ecff',
    darkColor: '#4a90e2',
  },
  {
    id: 'panda',
    emoji: '🐼',
    name: 'Panda Hug',
    cost: 100,
    color: '#e6d9ff',
    darkColor: '#7b61ff',
  },
  {
    id: 'rocket',
    emoji: '🚀',
    name: 'Space Rocket',
    cost: 150,
    color: '#c8f7e5',
    darkColor: '#00b894',
  },
  {
    id: 'unicorn',
    emoji: '🦄',
    name: 'Unicorn',
    cost: 220,
    color: '#eec2d8',
    darkColor: '#a94a7e',
  },
  {
    id: 'dino',
    emoji: '🦖',
    name: 'Dino Roar',
    cost: 300,
    color: '#f8ffae',
    darkColor: '#43c6ac',
  },
  {
    id: 'rainbow',
    emoji: '🌈',
    name: 'Rainbow',
    cost: 400,
    color: '#ffd6d4',
    darkColor: '#d8493a',
  },
  {
    id: 'dragon',
    emoji: '🐉',
    name: 'Tiny Dragon',
    cost: 520,
    color: '#b6f0c2',
    darkColor: '#1ca952',
  },
  {
    id: 'wizard',
    emoji: '🧙',
    name: 'Letter Wizard',
    cost: 650,
    color: '#d0b9d7',
    darkColor: '#926ea9',
  },
  {
    id: 'crown',
    emoji: '👑',
    name: 'Letter King',
    cost: 800,
    color: '#ffe9a8',
    darkColor: '#c08a00',
  },
  {
    id: 'champion',
    emoji: '🏆',
    name: 'Alphabet Champ',
    cost: 1000,
    color: '#6dd5fa',
    darkColor: '#2c3e90',
  },
];

// one trophy for finishing each playable castle
export const trophiesData: TrophyType[] = activityData
  .filter(castle => castle.innerCard.navigate && !castle.innerCard.isLocked)
  .map(castle => ({
    id: castle.innerCard.navigate!.toLowerCase(),
    icon: castle.innerCard.icon,
    title: castle.title,
    lightColor: castle.innerCard.lightColor,
    midColor: castle.innerCard.midColor,
    darkColor: castle.innerCard.darkColor,
  }));

export const getNextSticker = (totalEarned: number) =>
  stickersData.find(sticker => sticker.cost > totalEarned);
