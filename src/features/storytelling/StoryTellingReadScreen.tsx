import {
  Image,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ROUTES } from '../../app/navigation/routeNames';
import { StackRouteProps } from '../../types/navigation.types';
import { getStoryById } from './data/storytelling.data';
import { styles } from './StoryTelling.styles';
import TopBarRead from './components/TopBarRead';
import ProgressBar from '../../components/progressBar/ProgressBar';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../components/customButton/ActionButton';
import TTSService from '../../services/tts.service';
import TTSEventService from '../../services/ttsEvents.service';

interface SpokenRange {
  start: number;
  end: number;
}

// // only the word being spoken right now is highlighted
// const renderSpokenText = (
//   text: string,
//   range: SpokenRange | null,
//   highlightStyle: StyleProp<TextStyle>,
// ) => {
//   if (
//     !range ||
//     range.start < 0 ||
//     range.end > text.length ||
//     range.start >= range.end
//   ) {
//     return text;
//   }
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

  //   return (
  //     <>
  //       {text.slice(0, range.start)}
  //       <Text style={highlightStyle}>{text.slice(range.start, range.end)}</Text>
  //       {text.slice(range.end)}
  //     </>
  //   );
  return tokens;
};

const StoryTellingReadScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.STORYTELLINGREAD>>();
  const insets = useSafeAreaInsets();
  const { data, storyId } = route.params;
  const story = getStoryById(storyId);

  const totalPages = story?.pages.length ?? 0;
  const [pageIndex, setPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenRange, setSpokenRange] = useState<SpokenRange | null>(null);

  const currentPage = story?.pages[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex >= totalPages - 1;
  const progress = totalPages
    ? Math.round(((pageIndex + 1) / totalPages) * 100)
    : 0;

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
    setPageIndex(index => Math.max(index - 1, 0));
  };

  const goToNextPage = () => {
    if (isLastPage) return;
    TTSService.stop();
    setPageIndex(index => Math.min(index + 1, totalPages - 1));
  };

  const readPageAloud = () => {
    if (!currentPage) return;
    TTSService.speak(currentPage.text);
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
                <View style={[styles.flexRow, styles.buddyStatusText]}>
                  <FontAwesome6
                    name="circle"
                    iconStyle="solid"
                    size={12}
                    color={data.midColor}
                  />
                  <Text style={[styles.secondryText, { color: data.midColor }]}>
                    Tap play and listen
                  </Text>
                </View>
              </View>
              {/* <Text
                style={[
                  styles.bannerTitle,
                  styles.readPageText,
                  { color: data.darkColor },
                ]}
              >
                {renderSpokenText(
                  currentPage.text,
                  spokenRange,
                  highlightStyle,
                )}
              </Text> */}
               <View style={styles.readPageTextRow}>
                {splitWords(currentPage.text).map(token => {
                  const isSpoken =
                    !!spokenRange &&
                    spokenRange.start < token.end &&
                    spokenRange.end > token.start;

                  return (
                    <Text
                      key={token.start}
                      style={[
                        styles.bannerTitle,
                        styles.readPageText,
                        styles.readWord,
                        { color: data.darkColor },
                        isSpoken && highlightStyle,
                      ]}
                    >
                      {token.word}
                    </Text>
                  );
                })}
              </View>
              <Text style={[styles.secondryText, styles.readHintText]}>
                Tap a word to sound it out.
              </Text>
            </View>
          </Animated.View>
        ) : (
          <Text style={[styles.bannerTitle, { color: data.darkColor }]}>
            Story not found
          </Text>
        )}
      </ScrollView>

      {story && currentPage && (
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
            styles={isLastPage ? styles.navButtonDisabled : undefined}
          >
            <FontAwesome6
              name="chevron-right"
              iconStyle="solid"
              size={20}
              color={'#ffff'}
            />
          </ActionButton>
        </View>
      )}
    </View>
  );
};

export default StoryTellingReadScreen;
