import {
  Image,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ROUTES } from '../../app/navigation/routeNames';
import {
  StackNavigationProps,
  StackRouteProps,
} from '../../types/navigation.types';
import { getStoryById } from './data/storytelling.data';
import { styles } from './StoryTelling.styles';
import TopBarRead from './components/TopBarRead';
import StoryExercise from './components/StoryExercise';
import ProgressBar from '../../components/progressBar/ProgressBar';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../components/customButton/ActionButton';
import SuccessModal from '../../components/customModal/CustomModel';
import TTSService from '../../services/tts.service';
import TTSEventService from '../../services/ttsEvents.service';

interface SpokenRange {
  start: number;
  end: number;
}

interface WordToken {
  word: string;
  start: number;
  end: number;
}
const splitWords = (text: string): WordToken[] => {
  const tokens: WordToken[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return tokens;
};

// keeps punctuation out of the sound-out letters, e.g. "cat." -> "c + a + t"
const getWordLetterList = (word: string): string[] =>
  word.replace(/[^A-Za-z0-9']/g, '').split('');

const getWordLetters = (word: string): string => {
  const letters = getWordLetterList(word);
  return letters.length ? letters.join(' + ') : word;
};

interface StoryWordProps {
  token: WordToken;
  color: string;
  isSpoken: boolean;
  highlightStyle: StyleProp<TextStyle>;
}

// every spoken word gets a tiny bounce so the child can follow along
const StoryWord = ({
  token,
  color,
  isSpoken,
  highlightStyle,
}: StoryWordProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isSpoken ? 1.12 : 1, {
      damping: 8,
      stiffness: 160,
    });
  }, [isSpoken, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text
      accessibilityRole="button"
      accessibilityLabel={`${token.word}. Tap to hear it.`}
      style={[
        styles.bannerTitle,
        styles.readPageText,
        styles.readWord,
        { color },
        isSpoken && highlightStyle,
        animatedStyle,
      ]}
    >
      {token.word}
    </Animated.Text>
  );
};

const StoryTellingReadScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.STORYTELLINGREAD>>();
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.STORYTELLINGREAD>>();
  const insets = useSafeAreaInsets();
  const { data, storyId } = route.params;
  const story = getStoryById(storyId);

  const totalPages = story?.pages.length ?? 0;
  const [pageIndex, setPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenRange, setSpokenRange] = useState<SpokenRange | null>(null);
  const [activeWord, setActiveWord] = useState<WordToken | null>(null);
  const [showExercise, setShowExercise] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentPage = story?.pages[pageIndex];
  const currentActivity = currentPage?.activity;
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex >= totalPages - 1;
  const progress = totalPages
    ? Math.round(((pageIndex + 1) / totalPages) * 100)
    : 0;
  const pageWords = useMemo(
    () => (currentPage ? splitWords(currentPage.text) : []),
    [currentPage],
  );

  useEffect(() => {
    const removeListeners = TTSEventService.addListeners({
      onStart: () => {
        setIsSpeaking(true);
        setSpokenRange(null);
      },
      onFinish: () => {
        setIsSpeaking(false);
        setSpokenRange(null);
      },
      onCancel: () => {
        setIsSpeaking(false);
        setSpokenRange(null);
      },
      onProgress: (start, end) => setSpokenRange({ start, end }),
    });
    TTSService.setSpeechRate(0.35);

    return () => {
      removeListeners();
      TTSService.stop();
    };
  }, []);

  useEffect(() => {
    setSpokenRange(null);
    setActiveWord(null);
    if (!currentPage) return;
    const timer = setTimeout(() => TTSService.speak(currentPage.text), 300);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const highlightStyle = useMemo(
    () => [
      styles.readSpokenHighlight,
      { backgroundColor: data.lightColor, color: data.darkColor },
    ],
    [data.lightColor, data.darkColor],
  );

  const goToPreviousPage = () => {
    if (isFirstPage) return;
    TTSService.stop();
    setShowExercise(false);
    setPageIndex(index => Math.max(index - 1, 0));
  };

  const openExercise = () => {
    TTSService.stop();
    setActiveWord(null);
    setShowExercise(true);
  };

  const goToNextPage = () => {
    // a final page with no question is finished with the Next button
    if (!currentActivity) {
      TTSService.stop();
      setActiveWord(null);
      if (isLastPage) {
        setShowCelebration(true);
        return;
      }
      setPageIndex(index => Math.min(index + 1, totalPages - 1));
      return;
    }
    // every Next asks for the exercise again before moving on
    openExercise();
  };

  const closeExercise = () => {
    TTSService.stop();
    setShowExercise(false);
  };

  const handleExerciseNext = () => {
    TTSService.stop();
    setShowExercise(false);
    setActiveWord(null);
    // passing the final page's exercise completes this story
    if (isLastPage) {
      setShowCelebration(true);
      return;
    }
    setPageIndex(index => Math.min(index + 1, totalPages - 1));
  };

  const handleExercisePrevious = () => {
    if (isFirstPage) return;
    TTSService.stop();
    setShowExercise(false);
    setPageIndex(index => Math.max(index - 1, 0));
  };

  const readPageAloud = () => {
    if (!currentPage) return;
    setActiveWord(null);
    TTSService.speak(currentPage.text);
  };

  // word cards read the letters first, then the completed word: "s, a, m. Sam."
  const handleWordCardPress = (token: WordToken) => {
    if (showExercise) return;
    setActiveWord(token);
    const letters = getWordLetterList(token.word);
    const cleanWord = letters.join('');
    if (!letters.length) {
      TTSService.speak(token.word);
      return;
    }
    TTSService.speak(`${letters.join(', ')}. ${cleanWord}.`);
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    navigation.goBack();
  };

  const restartStory = () => {
    TTSService.stop();
    setShowCelebration(false);
    setShowExercise(false);
    setActiveWord(null);
    setSpokenRange(null);
    setPageIndex(0);
  };

  return (
    <View
      style={[
        styles.readContainer,
        { backgroundColor: `${data.lightColor}33` },
      ]}
    >
      <View style={styles.readHeader}>
        <TopBarRead
          data={data}
          storyTitle={{
            title: story?.title,
            subText: story
              ? `Level ${story.level} · ${story.sound}`
              : undefined,
          }}
        />
        <View style={styles.readProgressRow}>
          <View style={styles.flexOne}>
            <ProgressBar progress={progress} bgColor="#ffffffcc" />
          </View>
          <Text
            style={[
              { backgroundColor: data.darkColor },
              styles.secondryText,
              styles.pageCount,
            ]}
          >
            {`page ${pageIndex + 1} of ${totalPages}`}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.flexOne}
        contentContainerStyle={styles.readContent}
        showsVerticalScrollIndicator={false}
      >
        {story && currentPage ? (
          <>
            <Animated.View
              key={`page-${pageIndex}`}
              entering={FadeIn.duration(180)}
              style={[
                styles.readInfoCard,
                styles.readCoverCard,
                { borderColor: data.darkColor },
              ]}
            >
              <Image
                source={currentPage.image}
                resizeMode="cover"
                style={styles.readCover}
              />

              <View style={styles.storyReadCard}>
                <View style={styles.buddyRow}>
                  <CharacterFeedback
                    colors={data}
                    selectedOption={null}
                    isCorrect={null}
                    isSpeaking={isSpeaking}
                    imgTop={8}
                    styles={styles.characterImage}
                  />
                  <View style={[styles.flexRow, styles.buddyStatusText,{borderColor:data.midColor}]}>
                    <FontAwesome6
                      name="circle"
                      iconStyle="solid"
                      size={12}
                      color={data.midColor}
                    />
                    <Text
                      style={[styles.secondryText, { color: data.midColor }]}
                    >
                      Tap play and listen
                    </Text>
                  </View>
                </View>
                <View style={styles.readPageTextRow}>
                  {pageWords.map(token => {
                    const isSpoken =
                      !showExercise &&
                      (activeWord
                        ? activeWord.start === token.start
                        : !!spokenRange &&
                          spokenRange.start < token.end &&
                          spokenRange.end > token.start);
                    return (
                      <StoryWord
                        key={token.start}
                        token={token}
                        color={data.darkColor}
                        isSpoken={isSpoken}
                        highlightStyle={highlightStyle}
                      />
                    );
                  })}
                </View>
              </View>
            </Animated.View>
            <View
              style={[
                styles.readInfoCard,
                styles.wordHelperCard,
                { borderColor: data.darkColor },
              ]}
            >
              <View style={styles.wordCardRow}>
                {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.wordCardRow}
              > */}
                {pageWords.map(token => {
                  const isActive = activeWord?.start === token.start;
                  return (
                    <TouchableOpacity
                      key={`helper-${token.start}`}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`${token.word}. Tap to hear it.`}
                      onPress={() => handleWordCardPress(token)}
                      style={[
                        styles.wordCard,
                        isActive && {
                          backgroundColor: `${data.lightColor}66`,
                        },
                        {
                          borderColor: isActive
                            ? data.darkColor
                            : data.midColor,
                        },
                      ]}
                    >
                      <View style={styles.wordCardTitleRow}>
                        <Text
                          style={[
                            styles.bannerTitle,
                            { color: data.darkColor },
                          ]}
                        >
                          {token.word.replace(/[^A-Za-z0-9']/g, '')}
                        </Text>
                        <FontAwesome6
                          name="volume-high"
                          iconStyle="solid"
                          size={14}
                          color={isActive ? data.darkColor : data.midColor}
                          style={styles.wordCardSpeaker}
                        />
                      </View>
                      <Text
                        style={[styles.secondryText, { color: data.midColor }]}
                      >
                        {getWordLetters(token.word)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {/* </ScrollView> */}
              </View>
              <Text
                style={[
                  styles.secondryText,
                  styles.readHintText,
                  styles.wordHelperHint,
                ]}
              >
                {activeWord
                  ? `You tapped "${activeWord.word.replace(
                      /[^A-Za-z0-9']/g,
                      '',
                    )}". Tap another word card to hear its letters too.`
                  : 'Tap a word card to hear its letters, then the word.'}
              </Text>
            </View>
          </>
        ) : (
          <Text style={[styles.bannerTitle, { color: data.darkColor }]}>
            Story not found
          </Text>
        )}
      </ScrollView>

      {story &&
        currentPage &&
        (showExercise && currentActivity ? (
          <View
            style={[
              styles.exerciseFooter,
              { paddingBottom: insets.bottom + 14 },
            ]}
          >
            <StoryExercise
              key={`exercise-${story.id}-${pageIndex}`}
              activity={currentActivity}
              colors={data}
              isLastPage={isLastPage}
              onClose={closeExercise}
              onNext={handleExerciseNext}
              onPrevious={handleExercisePrevious}
              previousEnabled={!isFirstPage}
            />
          </View>
        ) : (
          <View
            style={[styles.readFooter, { paddingBottom: insets.bottom + 14 }]}
          >
            <ActionButton
              bottomBorderWidth={8}
              radius={50}
              backgroundColor={data.darkColor}
              bottomBorderColor={'#a43726'}
              onPress={goToPreviousPage}
              styles={isFirstPage ? styles.navButtonDisabled : undefined}
            >
              <FontAwesome6
                name="chevron-left"
                iconStyle="solid"
                size={20}
                color={'#ffff'}
              />
            </ActionButton>

            <ActionButton
              bottomBorderWidth={8}
              radius={50}
              backgroundColor={'#ff6a26'}
              bottomBorderColor={'#c9460d'}
              onPress={readPageAloud}
              styles={styles.playButton}
            >
              <FontAwesome6
                name="play"
                iconStyle="solid"
                size={20}
                color={'#ffff'}
              />
            </ActionButton>
            <ActionButton
              bottomBorderWidth={8}
              radius={50}
              backgroundColor={data.darkColor}
              bottomBorderColor={'#a43726'}
              onPress={goToNextPage}
            >
              <FontAwesome6
                name="chevron-right"
                iconStyle="solid"
                size={20}
                color={'#ffff'}
              />
            </ActionButton>
          </View>
        ))}

      {story && (
        <SuccessModal
          visible={showCelebration}
          title="🎉 Story Complete!"
          message={`Amazing reading! You finished "${story.title}".`}
          closeBtnText="Stories List"
          restartBtnText="Read Again"
          onRestart={restartStory}
          onClose={closeCelebration}
          characterImage={require('../../assets/images/character/yay.gif')}
        />
      )}
    </View>
  );
};

export default StoryTellingReadScreen;
