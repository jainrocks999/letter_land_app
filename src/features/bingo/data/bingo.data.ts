import { alphabetData } from '../../learning/data/learning.data';

export interface BingoCellType {
  id: string;
  letter: string;
}

export interface BingoRoundType {
  board: BingoCellType[];
  calls: string[];
}

export interface BingoRoundConfig {
  calls: number;
  label: string;
}

export const BINGO_SIZE = 4;

// every round asks for more letters than the one before it
export const BINGO_ROUND_CONFIG: BingoRoundConfig[] = [
  { calls: 6, label: 'Warm Up' },
  { calls: 7, label: 'Easy' },
  { calls: 8, label: 'Medium' },
  { calls: 9, label: 'Hard' },
  { calls: 10, label: 'Expert' },
];

export const BINGO_ROUNDS = BINGO_ROUND_CONFIG.length;

export const BINGO_LINES: number[][] = [
  // rows
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  // columns
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  // diagonals
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

export const shuffleLetters = <T>(items: T[]): T[] =>
  [...items].sort(() => Math.random() - 0.5);

export const findBingoLine = (
  markedLetters: string[],
  board: BingoCellType[],
): number[] | null => {
  const marked = new Set(markedLetters);
  return (
    BINGO_LINES.find(line =>
      line.every(index => marked.has(board[index].letter)),
    ) ?? null
  );
};

export const getBingoRoundConfig = (roundIndex: number): BingoRoundConfig =>
  BINGO_ROUND_CONFIG[
    Math.min(Math.max(roundIndex, 0), BINGO_ROUND_CONFIG.length - 1)
  ];

export const createBingoBoard = (): BingoCellType[] =>
  shuffleLetters(alphabetData)
    .slice(0, BINGO_SIZE * BINGO_SIZE)
    .map(({ letter }) => ({ id: letter, letter }));

// every round is guaranteed to contain a full row, column or diagonal.
// the last winning letter is saved for the final call, so each round really
// needs all of its calls before bingo can happen.
export const createBingoRound = (roundIndex = 0): BingoRoundType => {
  const config = getBingoRoundConfig(roundIndex);
  const board = createBingoBoard();
  const winningLine =
    BINGO_LINES[Math.floor(Math.random() * BINGO_LINES.length)];
  const lineLetters = shuffleLetters(
    winningLine.map(index => board[index].letter),
  );
  const [lastLetter, ...firstLineLetters] = lineLetters;
  const extrasNeeded = Math.max(config.calls - winningLine.length, 0);
  const winningSet = new Set(lineLetters);
  const candidates = shuffleLetters(
    board.filter(cell => !winningSet.has(cell.letter)).map(cell => cell.letter),
  );

  // pick only distractors that cannot finish another line early
  const earlyCalls = [...firstLineLetters];
  for (const candidate of candidates) {
    if (earlyCalls.length - firstLineLetters.length >= extrasNeeded) break;
    if (findBingoLine([...earlyCalls, candidate], board)) continue;
    earlyCalls.push(candidate);
  }

  // very unlikely, but never leave the round short of calls
  for (const candidate of candidates) {
    if (earlyCalls.length - firstLineLetters.length >= extrasNeeded) break;
    if (earlyCalls.includes(candidate)) continue;
    earlyCalls.push(candidate);
  }

  return {
    board,
    calls: [...shuffleLetters(earlyCalls), lastLetter],
  };
};
