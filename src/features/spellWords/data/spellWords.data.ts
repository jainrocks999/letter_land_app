export interface SpellWordType {
  word: string;
  emoji: string;
}

export interface SpellTileType {
  id: string;
  letter: string;
}

// short, picture-friendly words grouped by length so every round gets a little harder
export const spellWordsByLength: SpellWordType[][] = [
  [
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐶' },
    { word: 'SUN', emoji: '☀️' },
    { word: 'BUS', emoji: '🚌' },
    { word: 'PIG', emoji: '🐷' },
    { word: 'CUP', emoji: '☕' },
    { word: 'EGG', emoji: '🥚' },
    { word: 'FOX', emoji: '🦊' },
    { word: 'ANT', emoji: '🐜' },
    { word: 'BEE', emoji: '🐝' },
    { word: 'OWL', emoji: '🦉' },
    { word: 'COW', emoji: '🐮' },
    { word: 'KEY', emoji: '🔑' },
    { word: 'HAT', emoji: '👒' },
  ],
  [
    { word: 'FISH', emoji: '🐟' },
    { word: 'BALL', emoji: '⚽' },
    { word: 'CAKE', emoji: '🎂' },
    { word: 'FROG', emoji: '🐸' },
    { word: 'DUCK', emoji: '🦆' },
    { word: 'MOON', emoji: '🌙' },
    { word: 'STAR', emoji: '⭐' },
    { word: 'BOOK', emoji: '📖' },
    { word: 'TREE', emoji: '🌳' },
    { word: 'BEAR', emoji: '🐻' },
    { word: 'LION', emoji: '🦁' },
    { word: 'BIRD', emoji: '🐦' },
    { word: 'SHIP', emoji: '🚢' },
    { word: 'KITE', emoji: '🪁' },
    { word: 'CORN', emoji: '🌽' },
  ],
  [
    { word: 'APPLE', emoji: '🍎' },
    { word: 'HOUSE', emoji: '🏠' },
    { word: 'ZEBRA', emoji: '🦓' },
    { word: 'TIGER', emoji: '🐯' },
    { word: 'HORSE', emoji: '🐴' },
    { word: 'TRAIN', emoji: '🚆' },
    { word: 'PIZZA', emoji: '🍕' },
    { word: 'SNAKE', emoji: '🐍' },
    { word: 'MOUSE', emoji: '🐭' },
    { word: 'TRUCK', emoji: '🚚' },
    { word: 'WHALE', emoji: '🐳' },
    { word: 'ROBOT', emoji: '🤖' },
    { word: 'CHAIR', emoji: '🪑' },
  ],
];

export const WORDS_PER_LENGTH = 2;

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// a few words of each length, easiest first
export const generateSpellRound = (): SpellWordType[] =>
  spellWordsByLength.flatMap(words =>
    shuffle(words).slice(0, WORDS_PER_LENGTH),
  );

// the word's letters in a new order, never already spelled correctly
export const scrambleWord = (word: string): SpellTileType[] => {
  const tiles = word
    .split('')
    .map((letter, index) => ({ id: `${word}-${index}`, letter }));
  const hasDistinctLetters = new Set(word).size > 1;
  let scrambled = shuffle(tiles);
  while (
    hasDistinctLetters &&
    scrambled.map(tile => tile.letter).join('') === word
  ) {
    scrambled = shuffle(tiles);
  }
  return scrambled;
};
