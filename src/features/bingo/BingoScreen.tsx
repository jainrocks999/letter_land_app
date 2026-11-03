import { View, Text, FlatList, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { styles } from './Bingo.styles';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackRouteProps } from '../../types/navigation.types';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import CustomButton from '../../components/customButton/CustomButton';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import LottieAnimation from '../../components/LottieAnimation/LottieAnimation';
import SuccessModal from '../../components/customModal/CustomModel';
import TTSService from '../../services/tts.service';
import TTSEventService from '../../services/ttsEvents.service';
import MusicService from '../../services/music.service';
import useActivityRewards from '../../hooks/useActivityRewards';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import { ActivitiesKey } from '../../services/mmkv.service';
import { praiseMessages, tryAgainMessages } from '../../utils/helperData';
import BingoCell from './components/BingoCell';
import {
  BINGO_ROUNDS,
  createBingoRound,
  findBingoLine,
  getBingoRoundConfig,
} from './data/bingo.data';

const pickRandom = (messages: string[]) =>
  messages[Math.floor(Math.random() * messages.length)];

const BingoScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.BINGO>>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { data } = route.params;
  const { updateProgress } = useActivityProContext();
  const {
    rewardCorrect,
    rewardWrong,
    rewardComplete,
    startNewRound,
    addStars,
  } = useActivityRewards(data);

  const [roundData, setRoundData] = useState(() => createBingoRound(0));
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [bingoLine, setBingoLine] = useState<number[]>([]);
  const [isBingo, setIsBingo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingBingoRef = useRef<number[] | null>(null);

  const { board, calls } = roundData;
  const currentTarget = calls[currentIndex];
  const roundConfig = getBingoRoundConfig(round);
  const canAdvance = isBingo || isCorrect === true;
  const isLastRound = round === BINGO_ROUNDS - 1;
  const screenProgress = isBingo
    ? Math.round(((round + 1) / BINGO_ROUNDS) * 100)
    : Math.round(
        ((round + foundLetters.length / calls.length) / BINGO_ROUNDS) * 100,
      );
  const statusText = isBingo
    ? 'BINGO!'
    : isCorrect === true
    ? 'Great!'
    : isCorrect === false
    ? 'Try again'
    : `Round ${round + 1}/${BINGO_ROUNDS}`;
  const statusColor = isCorrect === false ? '#C0392B' : '#277630';

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const removeListeners = TTSEventService.addListeners({
      onStart: () => setIsSpeaking(true),
      onFinish: () => setIsSpeaking(false),
      onCancel: () => setIsSpeaking(false),
    });
    TTSService.setSpeechRate(0.4);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      removeListeners();
      TTSService.stop();
    };
  }, []);

  // Buddy calls a new letter every time the target changes
  useEffect(() => {
    if (isBingo || showSuccessModal) return;
    const target = calls[currentIndex];
    if (!target) return;
    const intro =
      currentIndex === 0 ? `Round ${round + 1}. ` : '';
    TTSService.speak(`${intro} find the letter ${target}!`);
  }, [calls, currentIndex, round, roundConfig, isBingo, showSuccessModal]);

  const startRound = (nextRound: number) => {
    clearTimer();
    pendingBingoRef.current = null;
    setRoundData(createBingoRound(nextRound));
    setRound(nextRound);
    setCurrentIndex(0);
    setFoundLetters([]);
    setSelectedLetter(null);
    setIsCorrect(null);
    setWrongLetter(null);
    setBingoLine([]);
    setIsBingo(false);
    setShowSuccessModal(false);
  };

  const handleBingo = (line: number[]) => {
    clearTimer();
    pendingBingoRef.current = null;
    setBingoLine(line);
    setIsBingo(true);
    setIsCorrect(true);
    addStars(3, 'BINGO!');
    MusicService.playEffect('getReward');
    TTSService.stop();
    TTSService.speak('Bingo! You completed a line!');

    const finalRound = round === BINGO_ROUNDS - 1;
    if (finalRound) {
      // save the completion right away in case the kid leaves during the party
      rewardComplete();
    }

    timerRef.current = setTimeout(() => {
      if (!finalRound) {
        startRound(round + 1);
      } else {
        setShowSuccessModal(true);
        TTSService.stop();
        TTSService.speak('Amazing! You got Bingo in every round!');
      }
    }, 2600);
  };

  const advanceCall = (found: string[] = foundLetters) => {
    clearTimer();
    setIsCorrect(null);
    setSelectedLetter(null);
    setWrongLetter(null);
    if (currentIndex < calls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleBingo(findBingoLine(found, board) ?? []);
    }
  };

  const handleLetterPress = (letter: string) => {
    if (isBingo || isCorrect !== null || showSuccessModal) return;
    if (foundLetters.includes(letter)) return;

    if (letter !== currentTarget) {
      setSelectedLetter(letter);
      setIsCorrect(false);
      setWrongLetter(letter);
      rewardWrong();
      TTSService.speak(pickRandom(tryAgainMessages));

      clearTimer();
      timerRef.current = setTimeout(() => {
        setIsCorrect(null);
        setSelectedLetter(null);
        setWrongLetter(null);
      }, 1300);
      return;
    }

    const nextFound = [...foundLetters, letter];
    const line = findBingoLine(nextFound, board);
    setFoundLetters(nextFound);
    setSelectedLetter(letter);
    setIsCorrect(true);
    rewardCorrect();
    TTSService.speak(
      `${pickRandom(praiseMessages)} You found the letter ${letter}!`,
    );

    clearTimer();
    if (line) {
      pendingBingoRef.current = line;
      timerRef.current = setTimeout(() => handleBingo(line), 700);
    } else {
      timerRef.current = setTimeout(() => advanceCall(nextFound), 3000);
    }
  };

  const handleNext = () => {
    if (showSuccessModal) return;

    if (pendingBingoRef.current) {
      const line = pendingBingoRef.current;
      pendingBingoRef.current = null;
      handleBingo(line);
      return;
    }

    if (isBingo) {
      clearTimer();
      if (isLastRound) {
        rewardComplete();
        setShowSuccessModal(true);
        TTSService.stop();
        TTSService.speak('Amazing! You got Bingo in every round!');
      } else {
        startRound(round + 1);
      }
      return;
    }

    if (isCorrect === true) {
      advanceCall();
    }
  };

  const handleHearAgain = () => {
    if (isBingo || showSuccessModal || !currentTarget) return;
    TTSService.speak(`Buddy says, find the letter ${currentTarget}!`);
  };

  const handleRestart = () => {
    startNewRound();
    startRound(0);
  };

  const handleClose = () => {
    updateProgress({
      key: data.navigate?.toLowerCase() as ActivitiesKey,
      progress: screenProgress,
    });
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: `${data.lightColor}33` }]}
    >
      <CustomTopbar data={data} progress={screenProgress} />
      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Listen to Buddy and find the letter!"
      />
      <View
        style={[
          styles.askingCard,
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.darkColor}1A`,
          },
        ]}
      >
        <CharacterFeedback
          colors={data}
          selectedOption={selectedLetter}
          isCorrect={isCorrect}
          styles={styles.characterFeeback}
          isSpeaking={isSpeaking}
          imgTop={25}
        />
        <View style={styles.askingCopy}>
          <View
            style={[
              styles.difficultyBadge,
              {
                borderColor: data.darkColor,
                backgroundColor: `${data.darkColor}1A`,
              },
            ]}
          >
            <Text style={[styles.difficultyText, { color: data.darkColor }]}>
              {`${roundConfig.label} · ${roundConfig.calls} letters`}
            </Text>
          </View>
          <Text style={[styles.cardText, { color: data.darkColor }]}>
            Buddy says, find…
          </Text>
          <Text style={[styles.cardText, styles.askingLetterLabel]}>
            the letter
          </Text>
        </View>
        <Animated.Text
          key={`${round}-${currentTarget}`}
          entering={BounceIn.springify().damping(9)}
          style={[styles.letterText, styles.smallLetterCard]}
        >
          {currentTarget}
        </Animated.Text>
      </View>
      <View style={styles.calledRow}>
        <Text style={[styles.cardText, styles.calledLabel]}>Called:</Text>
        <View style={styles.calledList}>
          {foundLetters.slice(-6).map(letter => (
            <Animated.Text
              key={`${round}-${letter}`}
              entering={ZoomIn.springify()}
              style={[
                styles.letterCalledText,
                {
                  color: data.midColor,
                  borderColor: `${data.midColor}A1`,
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
          {foundLetters.length === 0 && (
            <Text style={styles.calledEmptyText}>Find the first letter!</Text>
          )}
        </View>
        <Animated.Text
          key={statusText}
          entering={FadeIn.duration(180)}
          style={[styles.statusText, { color: statusColor }]}
        >
          {statusText}
        </Animated.Text>
      </View>
      <View style={styles.boardCard}>
        <Animated.View
          key={`board-${round}`}
          entering={FadeInDown.duration(320)}
          style={{padding:10}}
        >
          <FlatList
            data={board}
            keyExtractor={item => item.id}
            numColumns={4}
            scrollEnabled={false}
            columnWrapperStyle={styles.bingoColumnWrapper}
            contentContainerStyle={styles.bingoListContent}
            extraData={`${foundLetters.join('')}-${bingoLine.join(',')}-${
              wrongLetter ?? ''
            }-${isBingo}-${isCorrect}-${showSuccessModal}`}
            renderItem={({ item, index }) => (
              <BingoCell
                letter={item.letter}
                marked={foundLetters.includes(item.letter)}
                isInBingoLine={bingoLine.includes(index)}
                isWrong={wrongLetter === item.letter}
                disabled={
                  isBingo ||
                  isCorrect !== null ||
                  showSuccessModal ||
                  foundLetters.includes(item.letter)
                }
                onPress={handleLetterPress}
              />
            )}
          />
        </Animated.View>
      </View>
      <View style={styles.footerRow}>
        <CustomButton
          width={'48%'}
          paddingBottom={9}
          btnRadius={15}
          padding={12}
          bottomBorderColor={'#d84e16'}
          colors={['#ff7b38', '#ff6425']}
          onPress={handleHearAgain}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Hear again</Text>
            <FontAwesome6
              name={'volume-high'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.hearAgainIcon}
            />
          </View>
        </CustomButton>
        <CustomButton
          width={'48%'}
          paddingBottom={9}
          btnRadius={15}
          padding={12}
          bottomBorderColor={canAdvance ? '#0d8f3e' : '#b3b3b3'}
          colors={canAdvance ? ['#35c46b', '#1ca952'] : ['#d9d9d9', '#c4c4c4']}
          onPress={handleNext}
          disabled={!canAdvance}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {isBingo ? (isLastRound ? 'Finish' : 'Next Round') : 'Next'}
            </Text>
            <FontAwesome6
              name={isBingo ? 'star' : 'chevron-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
      </View>

      {isBingo && (
        <Animated.View
          pointerEvents="none"
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(200)}
          style={styles.bingoOverlay}
        >
          <View style={styles.confettiLayer}>
            <LottieAnimation
              animation={require('../../assets/animations/Confetti.json')}
              size={width}
              loop={false}
            />
          </View>
          <Animated.Text
            entering={BounceIn.springify().damping(8)}
            style={styles.bingoTitle}
          >
            BINGO!
          </Animated.Text>
          <Animated.Text
            entering={ZoomIn.delay(180)}
            style={styles.bingoSubtitle}
          >
            You found a whole line!
          </Animated.Text>
        </Animated.View>
      )}

      <SuccessModal
        visible={showSuccessModal}
        title="🎉 BINGO Champion!"
        message={`Wonderful! You got Bingo in all ${BINGO_ROUNDS} rounds!`}
        onRestart={handleRestart}
        onClose={handleClose}
        characterImage={require('../../assets/images/character/yay.gif')}
      />
    </View>
  );
};

export default BingoScreen;
