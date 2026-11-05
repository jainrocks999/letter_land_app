import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { ActivityCard } from '../../home/data/home.data';
import {
  getActivityOptions,
  STORY_ACTIVITY_LABELS,
  StoryPage,
} from '../data/storytelling.data';
import { styles } from '../StoryTelling.styles';
import TTSService from '../../../services/tts.service';

type ExerciseStatus = 'idle' | 'correct' | 'wrong';

interface BuildToken {
  id: string;
  word: string;
}

interface StoryExerciseProps {
  page: StoryPage;
  colors: ActivityCard;
  solved: boolean;
  onSolvedChange: (solved: boolean) => void;
}

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const StoryExercise = ({
  page,
  colors,
  solved,
  onSolvedChange,
}: StoryExerciseProps) => {
  const { activity } = page;
  const isBuild = activity.type === 'build';
  const options = useMemo(() => shuffle(getActivityOptions(activity)), [activity]);

  const buildTokens = useMemo<BuildToken[]>(
    () =>
      activity.answer
        .trim()
        .split(/\s+/)
        .map((word, index) => ({ id: `${index}-${word}`, word })),
    [activity.answer],
  );

  const [status, setStatus] = useState<ExerciseStatus>(
    solved ? 'correct' : 'idle',
  );
  const [selected, setSelected] = useState<string | null>(
    solved && !isBuild ? activity.answer : null,
  );
  const [picked, setPicked] = useState<BuildToken[]>(
    solved && isBuild ? buildTokens : [],
  );
  const [pool] = useState<BuildToken[]>(() => shuffle(buildTokens));
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const markWrong = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus('wrong');
    TTSService.speak('Try again!');
    resetTimer.current = setTimeout(() => setStatus('idle'), 1200);
  };

  const markCorrect = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus('correct');
    onSolvedChange(true);
    TTSService.speak(`Yes! ${activity.answer}! Great job!`);
  };

  const handleOptionPress = (option: string) => {
    if (status === 'correct') return;
    setSelected(option);
    if (normalize(option) === normalize(activity.answer)) {
      markCorrect();
    } else {
      markWrong();
    }
  };

  const remaining = pool.filter(
    token => !picked.some(pickedToken => pickedToken.id === token.id),
  );

  const handlePickWord = (token: BuildToken) => {
    if (status === 'correct') return;
    setStatus('idle');
    setPicked(previous => [...previous, token]);
  };

  const handleRemoveWord = (token: BuildToken) => {
    if (status === 'correct') return;
    setStatus('idle');
    setPicked(previous =>
      previous.filter(pickedToken => pickedToken.id !== token.id),
    );
  };

  const handleCheckBuild = () => {
    if (status === 'correct' || picked.length !== buildTokens.length) return;
    const attempt = picked.map(token => token.word).join(' ');
    if (normalize(attempt) === normalize(activity.answer)) {
      markCorrect();
    } else {
      markWrong();
    }
  };

  const statusMessage =
    status === 'correct'
      ? 'Great job! 🎉'
      : status === 'wrong'
      ? 'Try again, you can do it!'
      : isBuild
      ? 'Tap the words in the right order.'
      : 'Tap the correct answer.';

  const optionState = (option: string) => {
    if (status === 'correct') {
      return normalize(option) === normalize(activity.answer)
        ? 'correct'
        : 'disabled';
    }
    if (status === 'wrong' && option === selected) return 'wrong';
    return 'idle';
  };

  return (
    <View
      style={[
        styles.exerciseCard,
        {
          borderColor: colors.midColor,
          backgroundColor: `${colors.lightColor}33`,
        },
      ]}
    >
      <View style={styles.exerciseHeaderRow}>
        <Text style={[styles.exerciseBadge, { backgroundColor: colors.midColor }]}>
          {STORY_ACTIVITY_LABELS[activity.type]}
        </Text>
        <View style={styles.exerciseHeaderIcon}>
          <FontAwesome6
            name={status === 'correct' ? 'circle-check' : 'pen-to-square'}
            iconStyle="solid"
            size={16}
            color={status === 'correct' ? '#1ca952' : colors.midColor}
          />
        </View>
      </View>

      <Text style={[styles.exercisePrompt, { color: colors.darkColor }]}>
        {activity.prompt}
      </Text>

      {isBuild ? (
        <View style={styles.exerciseBuildArea}>
          <View
            style={[
              styles.exerciseBuildAnswer,
              {
                borderColor:
                  status === 'correct' ? '#1ca952' : `${colors.midColor}99`,
                backgroundColor:
                  status === 'correct' ? '#e7f7ef' : '#ffffff',
              },
            ]}
          >
            {picked.length ? (
              picked.map(token => (
                <TouchableOpacity
                  key={token.id}
                  disabled={status === 'correct'}
                  onPress={() => handleRemoveWord(token)}
                  style={[
                    styles.exerciseWordChip,
                    { borderColor: colors.midColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.exerciseWordChipText,
                      { color: colors.darkColor },
                    ]}
                  >
                    {token.word}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.exercisePlaceholder}>
                Your sentence appears here
              </Text>
            )}
          </View>

          {status !== 'correct' && (
            <View style={styles.exerciseWordPool}>
              {remaining.map(token => (
                <TouchableOpacity
                  key={token.id}
                  onPress={() => handlePickWord(token)}
                  style={[
                    styles.exerciseWordChip,
                    {
                      borderColor: colors.midColor,
                      backgroundColor: '#ffffff',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exerciseWordChipText,
                      { color: colors.darkColor },
                    ]}
                  >
                    {token.word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {status !== 'correct' && (
            <TouchableOpacity
              disabled={picked.length !== buildTokens.length}
              onPress={handleCheckBuild}
              style={[
                styles.exerciseCheckButton,
                {
                  backgroundColor:
                    picked.length === buildTokens.length
                      ? colors.darkColor
                      : '#cfcfcf',
                },
              ]}
            >
              <Text style={styles.exerciseCheckText}>Check</Text>
              <FontAwesome6
                name="check"
                iconStyle="solid"
                size={14}
                color="#ffffff"
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.exerciseOptionsRow}>
          {options.map(option => {
            const state = optionState(option);
            const isCorrect = state === 'correct';
            const isWrong = state === 'wrong';

            return (
              <TouchableOpacity
                key={option}
                disabled={state === 'disabled' || state === 'correct'}
                onPress={() => handleOptionPress(option)}
                style={[
                  styles.exerciseOption,
                  { borderColor: colors.midColor },
                  isCorrect && styles.exerciseOptionCorrect,
                  isWrong && styles.exerciseOptionWrong,
                  state === 'disabled' && styles.exerciseOptionDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.exerciseOptionText,
                    { color: colors.darkColor },
                    isCorrect && styles.exerciseOptionTextCorrect,
                    isWrong && styles.exerciseOptionTextWrong,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.exerciseStatusRow}>
        <FontAwesome6
          name={
            status === 'correct'
              ? 'circle-check'
              : status === 'wrong'
              ? 'circle-xmark'
              : 'lightbulb'
          }
          iconStyle="solid"
          size={14}
          color={
            status === 'correct'
              ? '#1ca952'
              : status === 'wrong'
              ? '#e0463f'
              : '#9e9e9e'
          }
        />
        <Text
          style={[
            styles.exerciseStatusText,
            status === 'correct' && styles.exerciseStatusCorrect,
            status === 'wrong' && styles.exerciseStatusWrong,
          ]}
        >
          {statusMessage}
        </Text>
      </View>
    </View>
  );
};

export default StoryExercise;
