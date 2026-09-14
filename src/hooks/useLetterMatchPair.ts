import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityCard } from '../features/home/data/home.data';
import { LetterCardType } from '../features/learning/data/learning.data';
import { Point } from '../types/tracing.types';
import { createRounds, shuffleArray } from '../utils/matchingHelper';
import { Alert } from 'react-native';

type ItemPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MatchedConnectionType = {
  letter: string;
  start: Point;
  end: Point;
};

type ActiveLine = {
  letter: string;
  start: Point;
  end: Point;
  color: string;
};

type RoundStatus = {
  isCorrect: boolean | null;
  isFinished: boolean;
  round: number;
};

export const useLetterMatchPair = ({ data }: { data: ActivityCard }) => {
  const [rounds, setRounds] = useState<LetterCardType[][]>(createRounds());
  // const [rounds, setRounds] = useState<LetterCardType[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  
  const [emojis, setEmojis] = useState<LetterCardType[]>(
    shuffleArray(rounds[0]),
  );
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>({
    isCorrect: null,
    isFinished: false,
    round: 1,
  });
  const [matchedConnections, setMatchedConnections] = useState<
    MatchedConnectionType[]
  >([]);

  const [activeLine, setActiveLine] = useState<ActiveLine | null>(null);

  const [letterPositions, setLetterPositions] = useState<
    Record<string, ItemPosition>
  >({});
  const [emojiPositions, setEmojiPositions] = useState<
    Record<string, ItemPosition>
  >({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const letterColumnRef = useRef({ x: 0, y: 0 });
  const emojiColumnRef = useRef({ x: 0, y: 0 });

  const letterRawPositionsRef = useRef<Record<string, ItemPosition>>({});
  const emojiRawPositionsRef = useRef<Record<string, ItemPosition>>({});

  // useEffect(() => {
  //   const generatedRounds = createRounds();

  //   setRounds(generatedRounds);

  //   if (generatedRounds.length > 0) {
  //     setEmojis(shuffleArray(generatedRounds[0]));
  //   }
  // }, []);

  const getCenter = useCallback((position: ItemPosition): Point => {
    return {
      x: position.x + position.width / 2,
      y: position.y + position.height / 2,
    };
  }, []);

  const handleLetterLayout = useCallback(
    (letter: string, position: ItemPosition) => {
      letterRawPositionsRef.current[letter] = position;
      const column = letterColumnRef.current;

      setLetterPositions(prev => ({
        ...prev,
        [letter]: {
          ...position,
          x: position.x + column.x,
          y: position.y + column.y,
        },
      }));
    },
    [],
  );

  const handleEmojiLayout = useCallback(
    (letter: string, position: ItemPosition) => {
      emojiRawPositionsRef.current[letter] = position;
      const column = emojiColumnRef.current;

      setEmojiPositions(prev => ({
        ...prev,
        [letter]: {
          ...position,
          x: position.x + column.x,
          y: position.y + column.y,
        },
      }));
    },
    [],
  );

  const updateAllLetterPositions = useCallback(
    (columnX: number, columnY: number) => {
      // new
      letterColumnRef.current = {
        x: columnX,
        y: columnY,
      };

      const rawPositions = letterRawPositionsRef.current;
      const updatePositions: Record<string, ItemPosition> = {};

      Object.keys(rawPositions).forEach(letter => {
        const position = rawPositions[letter];

        updatePositions[letter] = {
          ...position,
          x: position.x + columnX,
          y: position.y + columnY,
        };
      });
      setLetterPositions(updatePositions);
    },
    [],
  );

  const updateAllEmojiPositions = useCallback(
    (columnX: number, columnY: number) => {
      emojiColumnRef.current = {
        x: columnX,
        y: columnY,
      };

      const rawPositions = emojiRawPositionsRef.current;
      const updatePositions: Record<string, ItemPosition> = {};

      Object.keys(rawPositions).forEach(letter => {
        const position = rawPositions[letter];

        updatePositions[letter] = {
          ...position,
          x: position.x + columnX,
          y: position.y + columnY,
        };
      });
      setEmojiPositions(updatePositions);
    },
    [],
  );

  const handleDragStart = useCallback(
    (letter: string, start: Point) => {
      setActiveLine({
        letter,
        start,
        end: start,
        color: data.darkColor,
      });
    },
    [data.darkColor],
  );

  const handleDragMove = useCallback((letter: string, point: Point) => {
    setActiveLine(prev => {
      if (!prev || prev.letter !== letter) {
        return prev;
      }
      return {
        ...prev,
        end: point,
      };
    });
  }, []);

  const findTargetAtPoint = useCallback(
    (point: Point): string | null => {
      for (const item of emojis) {
        const position = emojiPositions[item.letter];

        if (!position) {
          continue;
        }

        const padding = 15;

        const isInside =
          point.x >= position.x - padding &&
          point.x <= position.x + position.width + padding &&
          point.y >= position.y - padding &&
          point.y <= position.y + position.height + padding;
        if (isInside) {
          return item.letter;
        }
      }
      return null;
    },
    [emojis, emojiPositions],
  );

  const handleDragEnd = useCallback(
    (letter: string, point: Point) => {
      const targetLetter = findTargetAtPoint(point);
      const letterPosition = letterPositions[letter];

      if (!letterPosition || !targetLetter) {
        setActiveLine(null);
        return;
      }

      const targetPosition = emojiPositions[targetLetter];

      if (!targetPosition) {
        setActiveLine(null);
        return;
      }

      const start = getCenter(letterPosition);
      const end = getCenter(targetPosition);

      if (letter === targetLetter) {
        const connection: MatchedConnectionType = {
          letter,
          start,
          end,
        };
        setRoundStatus(prev => ({
          ...prev,
          isCorrect: true,
        }));
        setMatchedConnections(prev => {
          if (prev.some(item => item.letter === letter)) {
            return prev;
          }

          return [...prev, connection];
        });

        setMatchedLetters(prev => {
          if (prev.includes(letter)) {
            return prev;
          }
          return [...prev, letter];
        });

        // setActiveLine(null);
        setTimeout(() => {
          setRoundStatus(prev => ({
            ...prev,
            isCorrect: null,
          }));
          setActiveLine(null);
        }, 800);

        return;
      }
      setActiveLine({
        letter,
        start,
        end,
        color: '#EF4444',
      });
      setRoundStatus(prev => ({
        ...prev,
        isCorrect: false,
      }));
      setTimeout(() => {
        setRoundStatus(prev => ({
          ...prev,
          isCorrect: null,
        }));
        setActiveLine(null);
      }, 800);

      // Show alert
      // setTimeout(() => {
      //   Alert.alert(
      //     'Try Again! 😊',
      //     `The letter ${letter} does not match this picture.`,
      //   );
      // }, 400);
    },
    [emojiPositions, findTargetAtPoint, getCenter, letterPositions],
  );

  const resetRoundState = useCallback(() => {
    setMatchedLetters([]);
    setMatchedConnections([]);
    setActiveLine(null);

    setLetterPositions({});
    setEmojiPositions({});

    letterRawPositionsRef.current = {};
    emojiRawPositionsRef.current = {};
  }, []);

  const handleRoundComplete = useCallback(() => {
    if (currentRound < rounds.length - 1) {
      const nextRound = currentRound + 1;
      resetRoundState();
      setCurrentRound(nextRound);
      setEmojis(shuffleArray(rounds[nextRound]));
    } else {
      // {
      //   /* 🎉 Amazing! You matched them all!*/
      // }
      // Alert.alert('🎉 Amazing!', 'You matched all the letters correctly!');
      setShowSuccessModal(true);
    }
  }, [currentRound, rounds, resetRoundState]);

  useEffect(() => {
    if (matchedLetters.length !== 5) {
      return;
    }
    const timer = setTimeout(() => {
      handleRoundComplete();
    }, 800);
    return () => {
      clearTimeout(timer);
    };
  }, [matchedLetters.length, handleRoundComplete]);

  const currentPairs = rounds[currentRound];
  const isLastRound = rounds.length > 0 && currentRound === rounds.length - 1;

  const isRoundComplete = matchedLetters.length === 5;

  return {
    // round
    rounds,
    currentRound,
    currentPairs,
    emojis,
    isLastRound,
    isRoundComplete,

    // matching
    matchedLetters,
    matchedConnections,
    activeLine,

    // positions
    letterPositions,
    emojiPositions,

    // column refs
    letterColumnRef,
    emojiColumnRef,

    // speak
    roundStatus,

    // modal
    showSuccessModal,
    setShowSuccessModal,

    // layout handlers
    handleLetterLayout,
    handleEmojiLayout,
    updateAllLetterPositions,
    updateAllEmojiPositions,

    // drag handlers
    handleDragStart,
    handleDragMove,
    handleDragEnd,

    // round controls
    handleRoundComplete,
    resetRoundState,

    // utility
    getCenter,
    findTargetAtPoint,
  };
};
