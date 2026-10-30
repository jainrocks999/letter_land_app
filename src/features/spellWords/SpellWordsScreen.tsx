import { View, Text, Image, useWindowDimensions } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { styles } from './SpellWords.styles';
import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import ActionButton from '../../components/customButton/ActionButton';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import SuccessModal from '../../components/customModal/CustomModel';
import TTSService from '../../services/tts.service';
import TTSEventService from '../../services/ttsEvents.service';
import useActivityRewards from '../../hooks/useActivityRewards';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import { ActivitiesKey } from '../../services/mmkv.service';
import { praiseMessages, tryAgainMessages } from '../../utils/helperData';
import {
  generateSpellRound,
  scrambleWord,
  SpellTileType,
  SpellWordType,
} from './data/spellWords.data';
import LetterSlot from './components/LetterSlot';
import DraggableTile, { SlotRectType } from './components/DraggableTile';
import CustomButton from '../../components/customButton/CustomButton';

type Feedback = 'none' | 'oops' | 'yay';

const SLOT_GAP = 8;
const MAX_TILE_SIZE = 62;
const OOPS_DURATION = 1300;

const characterImages = {
  speaking: require('../../assets/images/character/speaking.gif'),
  standing: require('../../assets/images/character/standing.gif'),
  oops: require('../../assets/images/character/opps.gif'),
  yay: require('../../assets/images/character/yay.gif'),
};

const pickRandom = (messages: string[]) =>
  messages[Math.floor(Math.random() * messages.length)];

const SpellWordsScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.SPELLING>>();
  const navigation = useNavigation();
  const { data } = route.params;
  const { width } = useWindowDimensions();
  const { updateProgress } = useActivityProContext();
  const { rewardCorrect, rewardWrong, rewardComplete, startNewRound } =
    useActivityRewards(data);

  const [words, setWords] = useState<SpellWordType[]>(generateSpellRound);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tiles, setTiles] = useState<SpellTileType[]>(() =>
    scrambleWord(words[0].word),
  );
  const [filled, setFilled] = useState<boolean[]>(() =>
    words[0].word.split('').map(() => false),
  );
  const [placedTileIds, setPlacedTileIds] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // drop targets are read on the UI thread while a tile is being dragged
  const slotRects = useSharedValue<(SlotRectType | null)[]>([]);

  const filledSlots = useSharedValue<boolean[]>(() =>
    words[0].word.split('').map(() => false),
  );
  // gesture callbacks can outlive a render, so the round state they need lives in refs
  const filledRef = useRef<boolean[]>(filled);
  const wordDoneRef = useRef(false);
  const solvedWordsRef = useRef<Set<number>>(new Set());
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = words[currentIndex];
  const letters = current.word.split('');
  const isWordDone = filled.length > 0 && filled.every(Boolean);
  const canReplay = placedTileIds.length > 0 && !isWordDone;
  const canGoPrev = currentIndex > 0;
  const screenProgress = Math.round((solvedCount / words.length) * 100);
  const tileSize = Math.min(
    MAX_TILE_SIZE,
    (width - 30 - 30 - SLOT_GAP * (letters.length - 1)) / letters.length,
  );

  const speakSpelling = useCallback(
    (prefix = '') => {
      TTSService.stop();
      TTSService.speak(
        `${prefix}${current.word}. ${letters.join(', ')}. ${current.word}!`,
      );
    },
    [current.word],
  );

  useEffect(() => {
    const removeListeners = TTSEventService.addListeners({
      onStart: () => setIsSpeaking(true),
      onFinish: () => setIsSpeaking(false),
      onCancel: () => setIsSpeaking(false),
    });
    TTSService.setSpeechRate(0.45);
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      removeListeners();
      TTSService.stop();
    };
  }, []);

  useEffect(() => {
    TTSService.stop();
    TTSService.speak(`Let's spell ${current.word}!`);
  }, [current]);

  // reading a shared value back on the JS thread can miss writes still on their way
  // to the UI thread, so slot positions are collected here and copied over whole
  const slotRectsRef = useRef<(SlotRectType | null)[]>([]);
  const handleSlotMeasure = useCallback(
    (index: number, rect: SlotRectType) => {
      slotRectsRef.current[index] = rect;
      slotRects.value = [...slotRectsRef.current];
    },
    [slotRects],
  );

  const showFeedback = (type: Feedback, duration?: number) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedback(type);
    if (duration) {
      feedbackTimerRef.current = setTimeout(
        () => setFeedback('none'),
        duration,
      );
    }
  };

  const resetBoardForWord = useCallback(
    (word: string) => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      const empty = word.split('').map(() => false);
      filledRef.current = empty;
      wordDoneRef.current = false;
      setTiles(scrambleWord(word));
      setFilled(empty);
      setPlacedTileIds([]);
      setFeedback('none');
      filledSlots.value = empty;
    },
    [filledSlots],
  );

  const handleWordComplete = () => {
    if (wordDoneRef.current) return;
    wordDoneRef.current = true;
    rewardCorrect();
    // setSolvedCount(prev => prev + 1);
    if (!solvedWordsRef.current.has(currentIndex)) {
      solvedWordsRef.current.add(currentIndex);
      setSolvedCount(solvedWordsRef.current.size);
    }
    showFeedback('yay');
    speakSpelling();
    TTSService.speak(pickRandom(praiseMessages));
  };

  const handleTilePlaced = (tileId: string, slotIndex: number) => {
    const updated = filledRef.current.map((value, index) =>
      index === slotIndex ? true : value,
    );
    filledRef.current = updated;
    setFilled(updated);
    setPlacedTileIds(prev => [...prev, tileId]);

    if (updated.every(Boolean)) {
      handleWordComplete();
    } else {
      TTSService.stop();
      TTSService.speak(current.word[slotIndex]);
    }
  };

  const handleTileMissed = () => {
    rewardWrong();
    showFeedback('oops', OOPS_DURATION);
    TTSService.stop();
    TTSService.speak(pickRandom(tryAgainMessages));
  };

  const handleNext = () => {
    if (!isWordDone) return;
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1;
      resetBoardForWord(words[nextIndex].word);
      setCurrentIndex(nextIndex);
    } else {
      rewardComplete();
      setShowSuccessModal(true);
      TTSService.stop();
      TTSService.speak('Amazing! You spelled all the words!');
    }
  };

  const handlePrev = () => {
    if (!canGoPrev) return;
    const prevIndex = currentIndex - 1;
    resetBoardForWord(words[prevIndex].word);
    setCurrentIndex(prevIndex);
  };

  const handleReplay = () => {
    if (!canReplay) return;
    resetBoardForWord(current.word);
    TTSService.stop();
    TTSService.speak(`Let's spell ${current.word}!`);
  };

  const handleRestart = () => {
    startNewRound();
    const round = generateSpellRound();
    setShowSuccessModal(false);
    solvedWordsRef.current = new Set();
    setSolvedCount(0);
    setWords(round);
    resetBoardForWord(round[0].word);
    setCurrentIndex(0);
  };

  const characterImage =
    feedback === 'yay'
      ? characterImages.yay
      : feedback === 'oops'
      ? characterImages.oops
      : isSpeaking
      ? characterImages.speaking
      : characterImages.standing;

  const hintText = isWordDone
    ? `You spelled ${current.word}!`
    : feedback === 'oops'
    ? 'Try another home!'
    : 'Drag each letter home.';

  return (
    <View
      style={[styles.container, { backgroundColor: `${data.lightColor}33` }]}
    >
      <CustomTopbar data={data} progress={screenProgress} />
      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Put every letter back in its home!"
      />

      <View
        style={[
          styles.rowSpacebetween,
          styles.card,
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.lightColor}33`,
          },
        ]}
      >
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{current.emoji}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.rowSpacebetween}>
            <Text style={[styles.letterText, { color: data.midColor }]}>
              {current.word}
            </Text>
            <ActionButton
              bottomBorderWidth={5}
              radius={50}
              backgroundColor={data.lightColor || data.midColor}
              bottomBorderColor={data.midColor}
              onPress={() => !isSpeaking && speakSpelling()}
              styles={styles.speakBtn}
            >
              <FontAwesome6
                name={isSpeaking ? 'volume-high' : 'play'}
                iconStyle="solid"
                size={16}
                color={data.midColor}
              />
            </ActionButton>
          </View>
          <View style={[styles.rowSpacebetween, styles.hintRow]}>
            <View style={[styles.rowSpacebetween, styles.hintPill]}>
              <FontAwesome6
                name={'circle'}
                iconStyle="solid"
                size={10}
                color={'#e8541a'}
              />
              <Text style={styles.hintText}>{hintText}</Text>
            </View>
            <Image
              source={characterImage}
              fadeDuration={0}
              style={styles.character}
            />
          </View>
        </View>
      </View>

      <View style={[styles.playArea, { borderColor: data.midColor }]}>
        <View style={{width:'100%',gap:15}}>
        <Text style={[styles.roundBadge, { backgroundColor: data.midColor }]}>
          Word {currentIndex + 1} of {words.length}
        </Text>
        <View style={styles.dashborder}/>
        </View>
          <View style={[styles.slotsRow, { gap: SLOT_GAP }]}>
            {letters.map((letter, index) => (
              <LetterSlot
                key={`${current.word}-${index}`}
                index={index}
                letter={letter}
                size={tileSize}
                isFilled={!!filled[index]}
                colors={data}
                onMeasure={handleSlotMeasure}
              />
            ))}
          </View>

        <View
          style={[
            styles.tilesTray,
            {
              gap: SLOT_GAP,
              backgroundColor: `${data.darkColor}22`,
              borderColor: `${data.darkColor}80`,
            },
          ]}
        >
          {tiles.map(tile => (
            <DraggableTile
              key={tile.id}
              tile={tile}
              size={tileSize}
              colors={data}
              slotRects={slotRects}
              filledSlots={filledSlots}
              isPlaced={placedTileIds.includes(tile.id)}
              disabled={isWordDone}
              onPlaced={handleTilePlaced}
              onMissed={handleTileMissed}
            />
          ))}
        </View>
      </View>
      <View style={[styles.rowSpacebetween,{marginBottom: 15,}]}>
        <ActionButton
          bottomBorderWidth={8}
          radius={18}
          backgroundColor={canGoPrev ? '#e8b59e' : '#d9d9d9'}
          bottomBorderColor={canGoPrev ? '#d84d16ce' : '#b3b3b3'}
          onPress={() => {
            if (!canGoPrev) return;
            handlePrev();
          }}
        >
          <FontAwesome6
            name="chevron-left"
            iconStyle="solid"
            size={20}
            color={canGoPrev ? '#d84d16ce' : '#8e8e8e'}
          />
        </ActionButton>
        <CustomButton
          width={'40%'}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
          bottomBorderColor={canReplay ? '#d84e16' : '#b3b3b3'}
          colors={canReplay ? ['#ff7b38', '#ff6425'] : ['#d9d9d9', '#c4c4c4']}
          onPress={handleReplay}
          disabled={!canReplay}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Replay</Text>
            <FontAwesome6
              name={'rotate-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
        <CustomButton
          width={'40%'}
          paddingBottom={9}
          btnRadius={15}
          padding={12}
          bottomBorderColor={isWordDone ? '#0d8f3e' : '#b3b3b3'}
          colors={isWordDone ? ['#35c46b', '#1ca952'] : ['#d9d9d9', '#c4c4c4']}
          onPress={handleNext}
          disabled={!isWordDone}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Next</Text>
            <FontAwesome6
              name={'chevron-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="🎉 Super Speller!"
        message="Wonderful! You spelled every word correctly!"
        onRestart={handleRestart}
        onClose={() => {
          updateProgress({
            key: data.navigate?.toLowerCase() as ActivitiesKey,
            progress: screenProgress,
          });
          setShowSuccessModal(false);
          navigation.goBack();
        }}
        characterImage={characterImages.yay}
      />
    </View>
  );
};

export default SpellWordsScreen;
