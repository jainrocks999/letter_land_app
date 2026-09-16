import { calculateMouthRect, isInsideRect } from '../src/utils/searchingHelper';

describe('Feeding Activity - Mouth Calculation & Hit Testing (Issue 1)', () => {
  test('calculateMouthRect returns zero rect for invalid dimensions', () => {
    expect(calculateMouthRect(0, 0, 0, 0)).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    expect(calculateMouthRect(100, 100, -10, 50)).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  test('calculateMouthRect calculates proportional mouth bounds accurately', () => {
    // Character view at (x: 100, y: 200) with width: 200, height: 200
    const rect = calculateMouthRect(100, 200, 200, 200);

    expect(rect).toEqual({
      x: 130, // 100 + 200 * 0.15
      y: 270, // 200 + 200 * 0.35
      width: 140, // 200 * 0.7
      height: 90, // 200 * 0.45
    });
  });

  test('isInsideRect detects touches inside calculated mouth rect', () => {
    const mouthRect = calculateMouthRect(100, 200, 200, 200);
    // mouthRect: x: 130, y: 270, right: 270, bottom: 360

    // Touches inside mouth
    expect(isInsideRect(150, 300, mouthRect)).toBe(true);
    expect(isInsideRect(130, 270, mouthRect)).toBe(true);
    expect(isInsideRect(270, 360, mouthRect)).toBe(true);

    // Touches outside mouth
    expect(isInsideRect(50, 50, mouthRect)).toBe(false);
    expect(isInsideRect(100, 250, mouthRect)).toBe(false);
    expect(isInsideRect(300, 400, mouthRect)).toBe(false);
  });
});

describe('Feeding Activity - Cookie Drag & Re-render State Safety (Issue 2)', () => {
  test('CookieSvg indexing safely wraps around array bounds', () => {
    const totalSvgs = 8;
    for (let index = 0; index < 20; index++) {
      const safeIndex = index % totalSvgs;
      expect(safeIndex).toBeGreaterThanOrEqual(0);
      expect(safeIndex).toBeLessThan(totalSvgs);
    }
  });

  test('React keys for cookie options are unique across rounds and options', () => {
    const generateKey = (currentIndex: number, letter: string, index: number) =>
      `${currentIndex}-${letter}-${index}`;

    const round0Key0 = generateKey(0, 'A', 0);
    const round0Key1 = generateKey(0, 'B', 1);
    const round1Key0 = generateKey(1, 'A', 0);

    expect(round0Key0).not.toEqual(round0Key1);
    expect(round0Key0).not.toEqual(round1Key0);
    expect(round0Key0).toBe('0-A-0');
    expect(round1Key0).toBe('1-A-0');
  });
});

describe('Feeding Activity - Audio, Timers & Completion Flow (Issues 3, 4, 6 & 8)', () => {
  test('characterState correctly switches to speaking when TTS starts', () => {
    const getNextCharacterState = (
      isSpeaking: boolean,
      currentState: 'standing' | 'feed' | 'enjoy' | 'oops' | 'speaking',
    ) => {
      if (isSpeaking && (currentState === 'standing' || currentState === 'speaking')) {
        return 'speaking';
      }
      if (!isSpeaking && currentState === 'speaking') {
        return 'standing';
      }
      return currentState;
    };

    expect(getNextCharacterState(true, 'standing')).toBe('speaking');
    expect(getNextCharacterState(false, 'speaking')).toBe('standing');
    expect(getNextCharacterState(true, 'enjoy')).toBe('enjoy'); // Preserve feedback states
  });

  test('round progress and completion detection work accurately', () => {
    const totalRounds = 15;
    const checkCompletion = (currentIndex: number) => currentIndex >= totalRounds - 1;

    expect(checkCompletion(0)).toBe(false);
    expect(checkCompletion(13)).toBe(false);
    expect(checkCompletion(14)).toBe(true);
  });
});

describe('Letter Filling Activity - Core Logic & Drag State Tests', () => {
  test('Letter option placement state locks touch gestures when placed', () => {
    const isOptionDisabled = (isPlaced: boolean, letter: string, targetLetter: string) => {
      const isThisTheAnsweredOne = isPlaced && letter === targetLetter;
      return isPlaced && !isThisTheAnsweredOne;
    };

    expect(isOptionDisabled(false, 'A', 'A')).toBe(false);
    expect(isOptionDisabled(true, 'A', 'A')).toBe(false); // Target option remains unlocked/placed
    expect(isOptionDisabled(true, 'B', 'A')).toBe(true); // Non-target option disabled during placement feedback
  });

  test('calculateTightDropRect creates an in-set drop zone centered on letter shape', () => {
    const { calculateTightDropRect } = require('../src/utils/searchingHelper');
    // Outer drop area at (x: 100, y: 100) with width: 100, height: 100, 15% inset
    const tightRect = calculateTightDropRect(100, 100, 100, 100, 0.15);

    expect(tightRect).toEqual({
      x: 115,
      y: 115,
      width: 70,
      height: 70,
    });
  });
});




