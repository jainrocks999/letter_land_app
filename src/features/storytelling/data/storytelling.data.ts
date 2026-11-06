import { ImageSourcePropType } from 'react-native';

export type StoryLevel = 1 | 2 | 3;

export type StoryActivityType =
  | 'spell'
  | 'tap'
  | 'predict'
  | 'fill'
  | 'feel'
  | 'count'
  | 'sound'
  | 'magic_e'
  | 'build'
  | 'find_sound'
  | 'rhyme'
  | 'picture_q';

export interface StoryActivity {
  type: StoryActivityType;
  prompt: string;
  answer: string;
  options?: string[];
  hint?: string;
}

export interface StoryPage {
  image: ImageSourcePropType;
  text: string;
  // Level 1 and 2 finish after page four, so page five has no quick question
  activity?: StoryActivity;
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
  spell: 'Quick question · Spell it',
  tap: 'Quick question · Find it',
  predict: 'Quick question · Guess it',
  fill: 'Quick question · Fill it',
  feel: 'Quick question · Feelings',
  count: 'Quick question · Count it',
  sound: 'Quick question · Sound it',
  magic_e: 'Activity · Magic e',
  build: 'Activity · Build it',
  find_sound: 'Activity · Find sound',
  rhyme: 'Activity · Rhyme time',
  picture_q: 'Activity · Picture Q',
};

const storyActivity = (
  type: StoryActivityType,
  prompt: string,
  answer: string,
  options?: string[],
  hint?: string,
): StoryActivity => ({
  type,
  prompt,
  answer,
  options,
  hint,
});

const storyPage = (
  image: ImageSourcePropType,
  text: string,
  activity?: StoryActivity,
): StoryPage => ({
  image,
  text,
  activity,
});

// every choice-based exercise exposes its options through one helper, so the
// reader does not need to know how a page stores them
export const getActivityOptions = (activity: StoryActivity): string[] =>
  activity.options ?? [];

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
        storyActivity(
          'spell',
          'Which letter is missing? c _ t',
          'a',
          ['o', 'a', 'i'],
          'Say cat slowly: c… a… t.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_2.webp'),
        'Sam has a hat.',
        storyActivity(
          'tap',
          'Tap the hat in the picture!',
          'hat',
          ['cat', 'hat', 'mat'],
          'Look for something blue!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_3.webp'),
        'The hat is on a mat.',
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_4.webp'),
        'A rat sat on the hat!',
        storyActivity(
          'predict',
          'Who will sit on the hat?',
          'a rat',
          ['a rat', 'a dog'],
          'Think of a word like cat and hat…',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_1/page_5.webp'),
        'Sam and the rat take a nap.',
        storyActivity(
          'feel',
          'What are Sam and the rat doing?',
          'sleeping',
          ['playing', 'sleeping', 'eating'],
          'Look at the picture carefully.',
        ),
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
        storyActivity(
          'spell',
          'Which letter is missing? b _ g',
          'i',
          ['a', 'i', 'o'],
          'Say big slowly: b… i… g.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_2.webp'),
        'The pig can dig.',
        storyActivity(
          'tap',
          "Tap the pig's curly tail!",
          'tail',
          ['tail', 'ear', 'nose'],
          'Look at the back of the pig!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_3.webp'),
        'The pig digs a pit.',
        storyActivity(
          'predict',
          'What will go in the pit?',
          'mud',
          ['mud', 'a ball'],
          'Look at the title of the story!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_4.webp'),
        'The pig sits in the mud.',
        storyActivity(
          'feel',
          'How does the pig feel in the mud?',
          'happy',
          ['happy', 'scared', 'sad'],
          "Look at the pig's big smile.",
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_2/page_5.webp'),
        'Pig is in it. Big win!',
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
        storyActivity(
          'spell',
          'Which letter is missing? t _ n',
          'e',
          ['a', 'e', 'o'],
          'Say ten slowly: t… e… n.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_2.webp'),
        'The hens get wet.',
        storyActivity(
          'tap',
          'Tap the rain cloud!',
          'cloud',
          ['cloud', 'sun', 'tree'],
          'Look up in the sky!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_3.webp'),
        'A hen sits on a bed.',
        storyActivity(
          'fill',
          'A hen sits on a ___.',
          'bed',
          ['bed', 'bag'],
          'Look at the picture. What is the hen on?',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_4.webp'),
        'Ten hens get in the pen.',
        storyActivity(
          'count',
          'How many hens get in the pen?',
          '10',
          ['5', '10', '2'],
          'Count them with your finger!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_3/page_5.webp'),
        'Yes! The hens rest in the pen.',
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
        storyActivity(
          'spell',
          'Which letter is missing? d _ g',
          'o',
          ['u', 'o', 'a'],
          'Say dog slowly: d… o… g.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_2.webp'),
        'The dog can hop.',
        storyActivity(
          'tap',
          'Tap the log!',
          'log',
          ['log', 'dog', 'rock'],
          'It is big, round and brown.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_3.webp'),
        'Hop, hop! The dog is on top.',
        storyActivity(
          'predict',
          'What will the log do?',
          'rock',
          ['rock', 'sleep'],
          'Logs can roll and wobble…',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_4.webp'),
        'Oh no! The log rocks.',
        storyActivity(
          'feel',
          'How does the dog feel?',
          'surprised',
          ['surprised', 'sleepy', 'sad'],
          "Look at the dog's big eyes.",
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_4/page_5.webp'),
        'The dog got off. Stop, log!',
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
        storyActivity(
          'spell',
          'Which sounds are missing? _ _ og',
          'fr',
          ['fr', 'fl', 'dr'],
          'Say frog slowly: fr… o… g.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_2.webp'),
        'Frog can jump up.',
        storyActivity(
          'tap',
          'Tap a lily pad!',
          'lily pad',
          ['lily pad', 'rock', 'log'],
          'It is round and green on the water.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_3.webp'),
        'He lands on a flat rock.',
        storyActivity(
          'predict',
          'Who is in the pond?',
          'a crab',
          ['a crab', 'a cat'],
          'It lives in water and has claws!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_4.webp'),
        'Glub! A crab is in the pond.',
        storyActivity(
          'feel',
          'How does Frog feel when he sees the crab?',
          'surprised',
          ['surprised', 'sleepy', 'sad'],
          "Look at Frog's eyes.",
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_5/page_5.webp'),
        'Frog jumps back in the pond.',
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
        storyActivity(
          'spell',
          'Which sounds are missing? ro _ _',
          'ck',
          ['ck', 'st', 'nd'],
          'Say rock slowly: r… o… ck.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_2.webp'),
        'Duck pecks at a stick.',
        storyActivity(
          'tap',
          'Tap the stick!',
          'stick',
          ['stick', 'rock', 'duck'],
          'It is thin and brown, near Duck.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_3.webp'),
        'The sun is hot. Duck must get wet.',
        storyActivity(
          'predict',
          'What will Duck do?',
          'jump in the pond',
          ['jump in the pond', 'go to bed'],
          'Duck is hot. What cools you down?',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_4.webp'),
        'Duck jumps in. Plop!',
        storyActivity(
          'sound',
          'What sound does a duck make?',
          'quack',
          ['quack', 'moo', 'woof'],
          'Listen to page 5!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_6/page_5.webp'),
        'Quack, quack! Duck is wet and glad.',
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
        storyActivity(
          'magic_e',
          'This says kit. Tap +e to make it kite!',
          'kite',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_2.webp'),
        'The kite is red. It can ride on the wind!',
        storyActivity(
          'build',
          'Build the sentence.',
          'The kite is red.',
          undefined,
          'Start with the word that has a big letter.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_3.webp'),
        'Oh no! The kite is in a tree.',
        storyActivity(
          'picture_q',
          'Where is the kite?',
          'tree',
          ['bed', 'tree', 'box'],
          'Look at the picture again!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_4.webp'),
        'Kate and Mike take it home.',
        storyActivity(
          'rhyme',
          'Which word sounds like take?',
          'cake',
          ['cat', 'kit', 'cake'],
          'Say take, then say each word.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_7/page_5.webp'),
        'Kate has the kite. She is so happy!',
        storyActivity(
          'build',
          'Build the sentence.',
          'She is so happy!',
          undefined,
          'Start with the word that has a big letter.',
        ),
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
        storyActivity(
          'find_sound',
          'Find the sh word.',
          'ship',
          ['chip', 'ship', 'slip'],
          'Listen for /sh/, like "shh".',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_2.webp'),
        'A man on the ship has a fish.',
        storyActivity(
          'build',
          'Build the sentence.',
          'A man has a fish.',
          undefined,
          'Start with the word that has a big letter.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_3.webp'),
        'Splash! The fish jumps in.',
        storyActivity(
          'picture_q',
          'Where did the fish go?',
          'water',
          ['water', 'ship', 'shop'],
          'Look at the splash!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_4.webp'),
        'Shh! The fish is in a shell.',
        storyActivity(
          'rhyme',
          'Which word sounds like fish?',
          'dish',
          ['fist', 'dish', 'fan'],
          'Say fish, then say each word.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_8/page_5.webp'),
        'The ship sets off. Wish me luck!',
        storyActivity(
          'build',
          'Build the sentence.',
          'The ship sets off.',
          undefined,
          'Start with the word that has a big letter.',
        ),
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
        storyActivity(
          'find_sound',
          'Find the ch word.',
          'chick',
          ['kick', 'chick', 'shed'],
          'Listen for /ch/, like a train: ch-ch!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_2.webp'),
        'Chip can peck and chomp.',
        storyActivity(
          'build',
          'Build the sentence.',
          'Chip can peck.',
          undefined,
          'Start with the word that has a big letter.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_3.webp'),
        'Chip sits on a bench.',
        storyActivity(
          'picture_q',
          'Where does Chip sit?',
          'bench',
          ['bed', 'bench', 'box'],
          'Look at the picture again!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_4.webp'),
        'Munch, munch! Chip has lunch.',
        storyActivity(
          'rhyme',
          'Which word sounds like munch?',
          'bunch',
          ['bench', 'bunch', 'bun'],
          'Say munch, then say each word.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_9/page_5.webp'),
        'Chip is full. Such a big lunch!',
        storyActivity(
          'build',
          'Build the sentence.',
          'Chip is full.',
          undefined,
          'Start with the word that has a big letter.',
        ),
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
        storyActivity(
          'magic_e',
          'This says rid. Tap +e to make it ride!',
          'ride',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_2.webp'),
        'Mike rides to the lake.',
        storyActivity(
          'build',
          'Build the sentence.',
          'Mike rides to the lake.',
          undefined,
          'Start with the word that has a big letter.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_3.webp'),
        'Oh no! The bike hits a stone.',
        storyActivity(
          'picture_q',
          'What did the bike hit?',
          'stone',
          ['tree', 'stone', 'cake'],
          'Look at the front wheel!',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_4.webp'),
        'Mike is fine. He rides home.',
        storyActivity(
          'rhyme',
          'Which word sounds like bike?',
          'like',
          ['bake', 'like', 'bit'],
          'Say bike, then say each word.',
        ),
      ),
      storyPage(
        require('../../../assets/stories/story_10/page_5.webp'),
        'Mike and his bike. What a fine ride!',
        storyActivity(
          'build',
          'Build the sentence.',
          'What a fine ride!',
          undefined,
          'Start with the word that has a big letter.',
        ),
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
