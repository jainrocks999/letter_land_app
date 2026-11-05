import { ImageSourcePropType } from 'react-native';

export type StoryLevel = 1 | 2 | 3;

export type StoryActivityType = 'spell' | 'build' | 'question' | 'find';

export interface StoryActivity {
  type: StoryActivityType;
  prompt: string;
  answer: string;
  options?: string[];
}

export interface StoryPage {
  image: ImageSourcePropType;
  text: string;
  activity: StoryActivity;
}

export interface Story {
  id: string;
  level: StoryLevel;
  title: string;
  sound: string;
  words: string[];
  banner: ImageSourcePropType;
  rewardStars: number;
  pages: StoryPage[];
}

export interface StoryLevelInfo {
  level: StoryLevel;
  label: string;
  subtitle: string;
  rewardStars: number;
}

export const STORY_LEVELS: StoryLevelInfo[] = [
  {
    level: 1,
    label: 'Level 1',
    subtitle: '3-letter words',
    rewardStars: 15,
  },
  {
    level: 2,
    label: 'Level 2',
    subtitle: '4-letter words',
    rewardStars: 15,
  },
  {
    level: 3,
    label: 'Level 3',
    subtitle: 'Short sentences',
    rewardStars: 20,
  },
];

export const STORY_ACTIVITY_LABELS: Record<StoryActivityType, string> = {
  spell: 'Spell it',
  build: 'Build the sentence',
  question: 'Picture question',
  find: 'Find the word',
};

const storyPage = (
  image: ImageSourcePropType,
  text: string,
  type: StoryActivityType,
  prompt: string,
  answer: string,
  options?: string[],
): StoryPage => ({
  image,
  text,
  activity: { type, prompt, answer, options },
});

export const storyData: Story[] = [
  // ---------------------------------------------------------------- Level 1
  {
    id: 'sam-the-cat',
    level: 1,
    title: 'Sam the Cat',
    sound: 'short a',
    words: ['Sam', 'cat', 'has', 'hat', 'mat', 'rat', 'sat', 'nap'],
    banner: require('../../../assets/stories/story_1/banner.webp'),
    rewardStars: 15,
    pages: [
      storyPage(
        require('../../../assets/stories/story_1/page_1.webp'),
        'Sam is a cat.',
        'spell',
        'c _ t',
        'a',
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_2.webp'),
        'Sam has a hat.',
        'spell',
        'h _ t',
        'a',
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_3.webp'),
        'The hat is on a mat.',
        'spell',
        'm _ t',
        'a',
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_4.webp'),
        'A rat sat on the hat!',
        'spell',
        'r _ t',
        'a',
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_5.webp'),
        'Sam and the rat nap.',
        'spell',
        'n _ p',
        'a',
      ),
    ],
  },
  {
    id: 'pig-in-the-mud',
    level: 1,
    title: 'Pig in the Mud',
    sound: 'short i',
    words: ['big', 'pig', 'sits', 'dig', 'pit', 'in', 'it', 'win'],
    banner: require('../../../assets/stories/story_2/banner.webp'),
    rewardStars: 15,
    pages: [
      storyPage(
        require('../../../assets/stories/story_2/page_1.webp'),
        'A big pig sits.',
        'spell',
        'b _ g',
        'i',
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_2.webp'),
        'The pig can dig.',
        'spell',
        'd _ g',
        'i',
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_3.webp'),
        'The pig digs a pit.',
        'spell',
        'p _ t',
        'i',
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_4.webp'),
        'The pig sits in the mud.',
        'spell',
        's _ t',
        'i',
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_5.webp'),
        'Pig is in it. Big win!',
        'spell',
        'w _ n',
        'i',
      ),
    ],
  },
  {
    id: 'ten-red-hens',
    level: 1,
    title: 'Ten Red Hens',
    sound: 'short e',
    words: ['ten', 'red', 'hens', 'get', 'wet', 'bed', 'pen', 'yes', 'rest'],
    banner: require('../../../assets/stories/story_3/banner.webp'),
    rewardStars: 15,
    pages: [
      storyPage(
        require('../../../assets/stories/story_3/page_1.webp'),
        'Ten red hens.',
        'spell',
        't _ n',
        'e',
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_2.webp'),
        'The hens get wet.',
        'spell',
        'w _ t',
        'e',
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_3.webp'),
        'A hen sits on a bed.',
        'spell',
        'b _ d',
        'e',
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_4.webp'),
        'Ten hens get in the pen.',
        'spell',
        'p _ n',
        'e',
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_5.webp'),
        'Yes! The hens rest in the pen.',
        'spell',
        'y _ s',
        'e',
      ),
    ],
  },
  {
    id: 'dog-on-a-log',
    level: 1,
    title: 'Dog on a Log',
    sound: 'short o',
    words: ['dog', 'log', 'hop', 'top', 'on', 'got', 'off', 'stop', 'rocks'],
    banner: require('../../../assets/stories/story_4/banner.webp'),
    rewardStars: 15,
    pages: [
      storyPage(
        require('../../../assets/stories/story_4/page_1.webp'),
        'A dog is on a log.',
        'spell',
        'd _ g',
        'o',
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_2.webp'),
        'The dog can hop.',
        'spell',
        'h _ p',
        'o',
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_3.webp'),
        'Hop, hop! The dog is on top.',
        'spell',
        't _ p',
        'o',
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_4.webp'),
        'Oh no! The log rocks.',
        'spell',
        'l _ g',
        'o',
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_5.webp'),
        'The dog got off. Stop, log!',
        'spell',
        'g _ t',
        'o',
      ),
    ],
  },

  // ---------------------------------------------------------------- Level 2
  {
    id: 'frog-can-jump',
    level: 2,
    title: 'Frog Can Jump',
    sound: 'fr, fl, cr, mp, nd',
    words: ['frog', 'pond', 'jump', 'lands', 'flat', 'rock', 'crab', 'back'],
    banner: require('../../../assets/stories/story_5/banner.webp'),
    rewardStars: 15,
    pages: [
      storyPage(
        require('../../../assets/stories/story_5/page_1.webp'),
        'Frog is in the pond.',
        'spell',
        '_ _ og',
        'fr',
        ['fr', 'fl', 'dr'],
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_2.webp'),
        'Frog can jump up.',
        'spell',
        'ju _ _',
        'mp',
        ['mp', 'nd', 'st'],
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_3.webp'),
        'He lands on a flat rock.',
        'spell',
        '_ _ at',
        'fl',
        ['fl', 'cr', 'st'],
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_4.webp'),
        'Glub! A crab is in the pond.',
        'spell',
        '_ _ ab',
        'cr',
        ['cr', 'fr', 'gl'],
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_5.webp'),
        'Frog jumps back in the pond.',
        'spell',
        'po _ _',
        'nd',
        ['nd', 'mp', 'ck'],
      ),
    ],
  },
  {
    id: 'duck-gets-wet',
    level: 2,
    title: 'Duck Gets Wet',
    sound: 'ck, st, pl, gl',
    words: [
      'duck',
      'rock',
      'pecks',
      'stick',
      'must',
      'jumps',
      'plop',
      'quack',
      'glad',
    ],
    banner: require('../../../assets/stories/story_6/banner.webp'),
    rewardStars: 15,
    pages: [
      storyPage(
        require('../../../assets/stories/story_6/page_1.webp'),
        'Duck is on a rock.',
        'spell',
        'ro _ _',
        'ck',
        ['ck', 'st', 'nd'],
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_2.webp'),
        'Duck pecks at a stick.',
        'spell',
        'sti _ _',
        'ck',
        ['ck', 'mp', 'st'],
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_3.webp'),
        'The sun is hot. Duck must get wet.',
        'spell',
        'mu _ _',
        'st',
        ['st', 'ck', 'nd'],
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_4.webp'),
        'Duck jumps in. Plop!',
        'spell',
        '_ _ op',
        'pl',
        ['pl', 'fl', 'st'],
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_5.webp'),
        'Quack, quack! Duck is wet and glad.',
        'spell',
        '_ _ ad',
        'gl',
        ['gl', 'pl', 'cr'],
      ),
    ],
  },

  // ---------------------------------------------------------------- Level 3
  {
    id: 'kate-and-the-kite',
    level: 3,
    title: 'Kate and the Kite',
    sound: 'magic e',
    words: ['Kate', 'kite', 'ride', 'Mike', 'take', 'home'],
    banner: require('../../../assets/stories/story_7/banner.webp'),
    rewardStars: 20,
    pages: [
      storyPage(
        require('../../../assets/stories/story_7/page_1.webp'),
        'Kate has a kite.',
        'spell',
        'kit + e',
        'kite',
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_2.webp'),
        'The kite is red. It can ride on the wind!',
        'build',
        'Build the sentence',
        'The kite is red.',
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_3.webp'),
        'Oh no! The kite is in a tree.',
        'question',
        'Where is the kite?',
        'tree',
        ['bed', 'tree', 'box'],
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_4.webp'),
        'Kate and Mike take it home.',
        'question',
        'Which word sounds like take?',
        'cake',
        ['cat', 'kit', 'cake'],
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_5.webp'),
        'Kate has the kite. She is so happy!',
        'build',
        'Build the sentence',
        'She is so happy!',
      ),
    ],
  },
  {
    id: 'the-big-ship',
    level: 3,
    title: 'The Big Ship',
    sound: 'sh',
    words: ['ship', 'fish', 'splash', 'shh', 'shell', 'wish'],
    banner: require('../../../assets/stories/story_8/banner.webp'),
    rewardStars: 20,
    pages: [
      storyPage(
        require('../../../assets/stories/story_8/page_1.webp'),
        'Look! The big ship is at the dock.',
        'find',
        'Find the sh word',
        'ship',
        ['chip', 'ship', 'slip'],
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_2.webp'),
        'A man on the ship has a fish.',
        'build',
        'Build the sentence',
        'A man has a fish.',
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_3.webp'),
        'Splash! The fish jumps in.',
        'question',
        'Where did the fish go?',
        'water',
        ['water', 'ship', 'shop'],
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_4.webp'),
        'Shh! The fish is in a shell.',
        'question',
        'Which word sounds like fish?',
        'dish',
        ['fist', 'dish', 'fan'],
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_5.webp'),
        'The ship sets off. Wish me luck!',
        'build',
        'Build the sentence',
        'The ship sets off.',
      ),
    ],
  },
  {
    id: 'chip-the-chick',
    level: 3,
    title: 'Chip the Chick',
    sound: 'ch',
    words: ['Chip', 'chick', 'chomp', 'bench', 'munch', 'lunch', 'such'],
    banner: require('../../../assets/stories/story_9/banner.webp'),
    rewardStars: 20,
    pages: [
      storyPage(
        require('../../../assets/stories/story_9/page_1.webp'),
        'Chip is a chick.',
        'find',
        'Find the ch word',
        'chick',
        ['kick', 'chick', 'shed'],
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_2.webp'),
        'Chip can peck and chomp.',
        'build',
        'Build the sentence',
        'Chip can peck.',
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_3.webp'),
        'Chip sits on a bench.',
        'question',
        'Where does Chip sit?',
        'bench',
        ['bed', 'bench', 'box'],
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_4.webp'),
        'Munch, munch! Chip has lunch.',
        'question',
        'Which word sounds like munch?',
        'bunch',
        ['bench', 'bunch', 'bun'],
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_5.webp'),
        'Chip is full. Such a big lunch!',
        'build',
        'Build the sentence',
        'Chip is full.',
      ),
    ],
  },
  {
    id: 'mike-rides-a-bike',
    level: 3,
    title: 'Mike Rides a Bike',
    sound: 'magic e',
    words: ['Mike', 'bike', 'rides', 'lake', 'stone', 'fine', 'home', 'ride'],
    banner: require('../../../assets/stories/story_10/banner.webp'),
    rewardStars: 20,
    pages: [
      storyPage(
        require('../../../assets/stories/story_10/page_1.webp'),
        'Mike has a bike.',
        'spell',
        'rid + e',
        'ride',
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_2.webp'),
        'Mike rides to the lake.',
        'build',
        'Build the sentence',
        'Mike rides to the lake.',
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_3.webp'),
        'Oh no! The bike hits a stone.',
        'question',
        'What did the bike hit?',
        'stone',
        ['tree', 'stone', 'cake'],
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_4.webp'),
        'Mike is fine. He rides home.',
        'question',
        'Which word sounds like bike?',
        'like',
        ['bake', 'like', 'bit'],
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_5.webp'),
        'Mike and his bike. What a fine ride!',
        'build',
        'Build the sentence',
        'What a fine ride!',
      ),
    ],
  },
];

export const getStoriesByLevel = (level: StoryLevel): Story[] =>
  storyData.filter(story => story.level === level);

export const getStoryLevelInfo = (level: StoryLevel): StoryLevelInfo =>
  STORY_LEVELS.find(info => info.level === level) ?? STORY_LEVELS[0];

export const getStoryById = (id: string): Story | undefined =>
  storyData.find(story => story.id === id);
