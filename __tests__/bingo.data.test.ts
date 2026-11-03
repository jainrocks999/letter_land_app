import {
  BINGO_LINES,
  BINGO_ROUND_CONFIG,
  BINGO_ROUNDS,
  BINGO_SIZE,
  createBingoBoard,
  createBingoRound,
  findBingoLine,
  getBingoRoundConfig,
} from '../src/features/bingo/data/bingo.data';

describe('Letter Bingo - round generation', () => {
  test('creates a 4x4 board of unique letters', () => {
    const board = createBingoBoard();

    expect(board).toHaveLength(BINGO_SIZE * BINGO_SIZE);
    expect(new Set(board.map(cell => cell.letter)).size).toBe(
      BINGO_SIZE * BINGO_SIZE,
    );
  });

  test('plays five rounds', () => {
    expect(BINGO_ROUNDS).toBe(5);
    expect(BINGO_ROUND_CONFIG).toHaveLength(BINGO_ROUNDS);
  });

  test('every round asks for more letters than the one before it', () => {
    BINGO_ROUND_CONFIG.forEach((config, index) => {
      if (index === 0) return;
      expect(config.calls).toBeGreaterThan(BINGO_ROUND_CONFIG[index - 1].calls);
    });
  });

  test('each round calls exactly its configured amount of unique letters', () => {
    BINGO_ROUND_CONFIG.forEach((config, roundIndex) => {
      for (let i = 0; i < 25; i++) {
        const { board, calls } = createBingoRound(roundIndex);
        const boardLetters = board.map(cell => cell.letter);

        expect(calls).toHaveLength(config.calls);
        expect(new Set(calls).size).toBe(config.calls);
        calls.forEach(letter => expect(boardLetters).toContain(letter));
      }
    });
  });

  test('every round only completes its bingo line on the last call', () => {
    BINGO_ROUND_CONFIG.forEach((_, roundIndex) => {
      for (let i = 0; i < 25; i++) {
        const { board, calls } = createBingoRound(roundIndex);

        expect(findBingoLine(calls, board)).not.toBeNull();
        expect(findBingoLine(calls.slice(0, -1), board)).toBeNull();
      }
    });
  });

  test('clamps unknown round indexes to a valid difficulty', () => {
    expect(getBingoRoundConfig(-3)).toEqual(BINGO_ROUND_CONFIG[0]);
    expect(getBingoRoundConfig(99)).toEqual(
      BINGO_ROUND_CONFIG[BINGO_ROUND_CONFIG.length - 1],
    );
  });
});

describe('Letter Bingo - line detection', () => {
  const board = createBingoBoard();

  test('does not report a line for an empty board', () => {
    expect(findBingoLine([], board)).toBeNull();
  });

  test('detects each row, column and diagonal', () => {
    BINGO_LINES.forEach(line => {
      const letters = line.map(index => board[index].letter);

      expect(findBingoLine(letters, board)).toEqual(line);
    });
  });
});
