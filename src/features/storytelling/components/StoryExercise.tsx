import { Text, TouchableOpacity, View } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, {
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { ActivityCard } from '../../home/data/home.data';
import {
  getActivityOptions,
  STORY_ACTIVITY_LABELS,
  StoryActivity,
} from '../data/storytelling.data';
import { styles } from '../StoryTelling.styles';
import TTSService from '../../../services/tts.service';
import ActionButton from '../../../components/customButton/ActionButton';
import LottieAnimation from '../../../components/LottieAnimation/LottieAnimation';

type ExerciseStatus = 'idle' | 'correct' | 'wrong';
type OptionState = ExerciseStatus | 'disabled';

interface BuildToken {
  id: string;
  word: string;
}

interface StoryExerciseProps {
  activity: StoryActivity;
  colors: ActivityCard;
  isLastPage: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  previousEnabled: boolean;
}

interface ExerciseOptionProps {
  option: string;
  state: OptionState;
  colors: ActivityCard;
  emoji?: string;
  onPress: () => void;
  onSpeak: () => void;
}

const FEEL_EMOJI: Record<string, string> = {
  happy: '😊',
  surprised: '😲',
  sad: '😢',
  scared: '😨',
  sleepy: '😴',
  angry: '😠',
};

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

const ExerciseOption = ({
  option,
  state,
  colors,
  emoji,
  onPress,
  onSpeak,
}: ExerciseOptionProps) => {
  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);

  // a wrong tap shakes the card, a correct one gives a happy bounce
  useEffect(() => {
    if (state === 'wrong') {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-6, { duration: 55 }),
        withTiming(6, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    } else {
      shakeX.value = withTiming(0, { duration: 120 });
    }

    if (state === 'correct') {
      scale.value = withSequence(
        withTiming(1.12, { duration: 140 }),
        withSpring(1, { damping: 5 }),
      );
    } else {
      scale.value = withTiming(1, { duration: 120 });
    }
  }, [state, scale, shakeX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: scale.value }],
  }));

  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';

  return (
    <Animated.View
      style={[
        styles.exerciseOption,
        { borderColor: colors.midColor },
        isCorrect && styles.exerciseOptionCorrect,
        isWrong && styles.exerciseOptionWrong,
        state === 'disabled' && styles.exerciseOptionDisabled,
        animatedStyle,
      ]}
    >
      <View style={[styles.exerciseOptionContent,{justifyContent:"space-between"}]}>
        <TouchableOpacity
          accessibilityLabel={option}
          activeOpacity={0.75}
          disabled={state === 'disabled' || isCorrect}
          onPress={onPress}
          style={styles.exerciseOptionMain}
        >
          <Text
            style={[
              styles.exerciseOptionText,
              { color: colors.darkColor },
              isCorrect && styles.exerciseOptionTextCorrect,
              isWrong && styles.exerciseOptionTextWrong,
            ]}
          >
            {emoji ? `${emoji}  ${option}` : option}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`Hear ${option}`}
          hitSlop={8}
          disabled={state === 'disabled' || isCorrect}
          onPress={event => {
            event.stopPropagation();
            onSpeak();
          }}
          style={styles.exerciseOptionSpeaker}
        >
          <FontAwesome6
            name="volume-high"
            iconStyle="solid"
            size={13}
            color={isCorrect ? '#16794a' : colors.midColor}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const StoryExercise = ({
  activity,
  colors,
  isLastPage,
  onClose,
  onNext,
  onPrevious,
  previousEnabled,
}: StoryExerciseProps) => {
  const isBuild = activity.type === 'build';
  const isMagicE = activity.type === 'magic_e';
  const isTap = activity.type === 'tap';
  const isPictureQuestion = activity.type === 'picture_q';
  const options = useMemo(
    () => shuffle(getActivityOptions(activity)),
    [activity],
  );

  const buildTokens = useMemo<BuildToken[]>(
    () =>
      activity.answer
        .trim()
        .split(/\s+/)
        .map((word, index) => ({ id: `${index}-${word}`, word })),
    [activity.answer],
  );

  const [status, setStatus] = useState<ExerciseStatus>('idle');
  const [selected, setSelected] = useState<string | null>(null);
  const [picked, setPicked] = useState<BuildToken[]>([]);
  const [pool] = useState<BuildToken[]>(() => shuffle(buildTokens));
  const [showHint, setShowHint] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const magicButtonStyle = useMemo(
    () => ({
      backgroundColor: status === 'correct' ? '#1ca952' : colors.darkColor,
    }),
    [status, colors.darkColor],
  );

  const buildAnswerStateStyle = useMemo(
    () => ({
      borderColor: status === 'correct' ? '#1ca952' : `${colors.midColor}99`,
      backgroundColor: status === 'correct' ? '#e7f7ef' : '#ffffff',
    }),
    [status, colors.midColor],
  );

  const buildShake = useSharedValue(0);
  const buildScale = useSharedValue(1);

  useEffect(() => {
    if (!isBuild) return;

    if (status === 'wrong') {
      buildShake.value = withSequence(
        withTiming(-7, { duration: 55 }),
        withTiming(7, { duration: 55 }),
        withTiming(-5, { duration: 55 }),
        withTiming(5, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    } else {
      buildShake.value = withTiming(0, { duration: 120 });
    }

    if (status === 'correct') {
      buildScale.value = withSequence(
        withTiming(1.04, { duration: 140 }),
        withSpring(1, { damping: 5 }),
      );
    } else {
      buildScale.value = withTiming(1, { duration: 120 });
    }
  }, [status, isBuild, buildScale, buildShake]);

  const buildAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: buildShake.value }, { scale: buildScale.value }],
  }));

  // read the exercise out loud when it slides in
  const exerciseSpeech = useMemo(() => {
    if (activity.type === 'spell') {
      return `Spell it! ${activity.prompt.replace(/_/g, ' blank ')}`;
    }
    return activity.prompt;
  }, [activity]);

  useEffect(() => {
    const timer = setTimeout(() => TTSService.speak(exerciseSpeech), 320);
    return () => clearTimeout(timer);
  }, [exerciseSpeech]);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const speakPrompt = useCallback(
    () => TTSService.speak(exerciseSpeech),
    [exerciseSpeech],
  );

  const markWrong = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setShowHint(true);
    setStatus('wrong');
    TTSService.speak(
      activity.hint ? `Try again! ${activity.hint}` : 'Try again!',
    );
    resetTimer.current = setTimeout(() => setStatus('idle'), 1400);
  };

  const markCorrect = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setShowHint(false);
    setStatus('correct');
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

  const handleMagicPress = () => {
    if (status === 'correct') return;
    markCorrect();
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

  const statusMessage = useMemo(() => {
    if (status === 'correct') {
      return isLastPage
        ? 'Great job! You finished the story!'
        : 'Great job! Tap Next to turn the page.';
    }
    if (status === 'wrong') return 'Oops! Try again.';

    switch (activity.type) {
      case 'build':
        return 'Tap the words in order, then check.';
      case 'magic_e':
        return 'Tap +e to make the magic word.';
      case 'tap':
        return 'Look at the picture above and choose.';
      case 'predict':
        return 'What happens next? Make a guess!';
      case 'feel':
        return 'How does the character feel?';
      case 'count':
        return 'Count carefully, then choose.';
      case 'sound':
        return 'What sound does it make?';
      case 'rhyme':
        return 'Which word rhymes?';
      case 'find_sound':
        return 'Find the word with the right sound.';
      case 'picture_q':
        return 'Look at the picture and choose.';
      case 'fill':
        return 'Choose the word for the blank.';
      default:
        return 'Choose the missing letter or sound.';
    }
  }, [status, activity.type, isLastPage]);

  const canGoNext = status === 'correct';
  const magicBase =
    isMagicE && activity.answer.toLowerCase().endsWith('e')
      ? activity.answer.slice(0, -1)
      : activity.answer;

  const optionState = (option: string): OptionState => {
    if (status === 'correct') {
      return normalize(option) === normalize(activity.answer)
        ? 'correct'
        : 'disabled';
    }
    if (status === 'wrong' && option === selected) return 'wrong';
    return 'idle';
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(280)}
      style={[
        styles.exerciseCard,
        {
          borderColor: colors.midColor,
          backgroundColor: `${colors.lightColor}33`,
        },
      ]}
    >
      {status === 'correct' && (
        <Animated.View
          entering={ZoomIn.duration(220)}
          pointerEvents="none"
          style={styles.exerciseSuccessBurst}
        >
          <LottieAnimation
            animation={require('../../../assets/animations/Success celebration.json')}
            size={130}
            loop={false}
          />
        </Animated.View>
      )}

      <View style={styles.exerciseHeaderRow}>
        <Text
          numberOfLines={1}
          style={[styles.exerciseBadge, { backgroundColor: colors.midColor }]}
        >
          {STORY_ACTIVITY_LABELS[activity.type]}
        </Text>

        <View style={styles.exerciseHeaderActions}>
          <TouchableOpacity
            accessibilityLabel="Hear the question"
            onPress={speakPrompt}
            style={styles.exerciseSpeakerButton}
          >
            <FontAwesome6
              name="volume-high"
              iconStyle="solid"
              size={14}
              color={colors.midColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Close exercise"
            onPress={onClose}
            style={styles.exerciseCloseButton}
          >
            <FontAwesome6
              name="xmark"
              iconStyle="solid"
              size={18}
              color={colors.darkColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.exercisePrompt, { color: colors.darkColor }]}>
        {activity.prompt}
      </Text>

      {(isTap || isPictureQuestion) && (
        <View style={styles.exercisePictureHintRow}>
          <FontAwesome6
            name="image"
            iconStyle="solid"
            size={13}
            color={colors.midColor}
          />
          <Text
            style={[styles.exercisePictureHintText, { color: colors.midColor }]}
          >
            Look at the picture above!
          </Text>
        </View>
      )}

      {status === 'correct' && (
        <Animated.View
          entering={ZoomIn.duration(220)}
          style={styles.exerciseSuccessRow}
        >
          <FontAwesome6
            name="star"
            iconStyle="solid"
            size={16}
            color="#f5a623"
          />
          <Text style={styles.exerciseSuccessText}>Superstar! Great job!</Text>
          <FontAwesome6
            name="star"
            iconStyle="solid"
            size={16}
            color="#f5a623"
          />
        </Animated.View>
      )}

      {isMagicE ? (
        <View style={styles.exerciseMagicRow}>
          <View
            style={[styles.exerciseMagicWord, { borderColor: colors.midColor }]}
          >
            <Text
              style={[
                styles.exerciseMagicWordText,
                { color: colors.darkColor },
              ]}
            >
              {magicBase}
            </Text>
          </View>

          <Text style={[styles.exerciseMagicPlus, { color: colors.midColor }]}>
            +
          </Text>

          <TouchableOpacity
            accessibilityLabel="Add e"
            activeOpacity={0.8}
            disabled={status === 'correct'}
            onPress={handleMagicPress}
            style={[styles.exerciseMagicButton, magicButtonStyle]}
          >
            <Text style={styles.exerciseMagicButtonText}>e</Text>
          </TouchableOpacity>

          {status === 'correct' && (
            <Animated.View
              entering={ZoomIn.springify().damping(8)}
              style={styles.exerciseMagicResult}
            >
              <Text style={styles.exerciseMagicResultText}>
                {activity.answer}
              </Text>
            </Animated.View>
          )}
        </View>
      ) : isBuild ? (
        <View style={styles.exerciseBuildArea}>
          <Animated.View
            style={[
              styles.exerciseBuildAnswer,
              buildAnswerStateStyle,
              buildAnimatedStyle,
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
          </Animated.View>

          {status !== 'correct' && (
            <View style={styles.exerciseWordPool}>
              {remaining.map(token => (
                <TouchableOpacity
                  key={token.id}
                  onPress={() => handlePickWord(token)}
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
              ))}
            </View>
          )}

          {status !== 'correct' && (
            <TouchableOpacity
              disabled={picked.length !== buildTokens.length}
              onPress={handleCheckBuild}
              style={[
                styles.exerciseCheckButton,
                picked.length === buildTokens.length
                  ? { backgroundColor: colors.darkColor }
                  : styles.exerciseCheckButtonDisabled,
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
          {options.map(option => (
            <ExerciseOption
              key={option}
              option={option}
              state={optionState(option)}
              colors={colors}
              emoji={
                activity.type === 'feel'
                  ? FEEL_EMOJI[option.toLowerCase()]
                  : undefined
              }
              onPress={() => handleOptionPress(option)}
              onSpeak={() => TTSService.speak(option)}
            />
          ))}
        </View>
      )}

      {showHint && status !== 'correct' && activity.hint ? (
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={styles.exerciseHintRow}
        >
          <FontAwesome6
            name="lightbulb"
            iconStyle="solid"
            size={14}
            color="#f5a623"
          />
          <Text style={styles.exerciseHintText}>{activity.hint}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.exerciseFooterRow}>
        <ActionButton
          bottomBorderWidth={6}
          radius={50}
          backgroundColor={previousEnabled ? colors.darkColor : '#cfcfcf'}
          bottomBorderColor={previousEnabled ? '#a43726' : '#b3b3b3'}
          onPress={() => {
            if (previousEnabled) onPrevious();
          }}
          styles={[
            styles.exerciseNavButton,
            !previousEnabled && styles.navButtonDisabled,
          ]}
        >
          <FontAwesome6
            name="chevron-left"
            iconStyle="solid"
            size={18}
            color={'#ffffff'}
          />
        </ActionButton>

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

        <ActionButton
          bottomBorderWidth={6}
          radius={50}
          backgroundColor={canGoNext ? colors.darkColor : '#cfcfcf'}
          bottomBorderColor={canGoNext ? '#a43726' : '#b3b3b3'}
          onPress={() => {
            if (canGoNext) onNext();
          }}
          styles={[
            styles.exerciseNavButton,
            !canGoNext && styles.navButtonDisabled,
          ]}
        >
          <FontAwesome6
            name="chevron-right"
            iconStyle="solid"
            size={18}
            color={'#ffffff'}
          />
        </ActionButton>
      </View>
    </Animated.View>
  );
};

export default StoryExercise;
