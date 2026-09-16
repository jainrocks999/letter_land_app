import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './FillingLetter.styles';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import {
  calculateTightDropRect,
  generateQuestionsUpgrade,
} from '../../utils/searchingHelper';
import { RectType, SearchQuestionType } from '../../types/search.types';
import TTSEventService from '../../services/ttsEvents.service';
import TTSService from '../../services/tts.service';
import ActionButton from '../../components/customButton/ActionButton';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6/static';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import Svg, { Text as SvgText } from 'react-native-svg';
import { praiseMessages, tryAgainMessages } from '../../utils/helperData';
import DraggableLetter from './components/DraggableLetter';
import SuccessModal from '../../components/customModal/CustomModel';
import { ActivitiesKey } from '../../services/mmkv.service';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';

const FillingLetterScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.FILLING>>();
  const navigation = useNavigation();
  const { data } = route.params;
  const { updateProgress } = useActivityProContext();

  const [questions] = useState<SearchQuestionType[]>(() =>
    generateQuestionsUpgrade(false, 5),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [questionAsk, setQuestionAsk] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [shapRect, setShapRect] = useState<RectType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const targetRef = useRef<View>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQues = questions[currentIndex];
  const screenProgress = Math.round(
    ((currentIndex + 1) / questions.length) * 100,
  );

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

  useEffect(() => {
    if (!currentQues || isCompleted) return;
    const text = getQuestionText(currentQues);
    if (!text) return;
    setQuestionAsk(text);
    TTSService.stop();
    TTSService.speak(text);
  }, [currentQues, isCompleted]);

  const getQuestionText = (question: SearchQuestionType): string => {
    const letter = question.target.letter;
    const texts = [
      `Can you find ${letter} and put it in the right spot?`,
      `Find ${letter} and place it where it belongs!`,
      `Can you pick ${letter} and put it in the correct place?`,
      `Where is ${letter}? Put it in the right spot!`,
      `Find the letter ${letter} and place it correctly!`,
      `Can you spot ${letter} and place it in the right spot?`,
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const handleTargetLayout = () => {
    requestAnimationFrame(() => {
      targetRef.current?.measureInWindow((x, y, width, height) => {
        setShapRect(calculateTightDropRect(x, y, width, height, 0.15));
      });
    });
  };

  const handleLetterDrop = (letter: string) => {
    if (isPlaced) return;
    setSelectedOption(letter);
    TTSService.stop();

    if (letter === currentQues.target.letter) {
      TTSService.speak(
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)],
      );
      setIsPlaced(true);
      setIsCorrect(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsCorrect(null);
        setSelectedOption(null);
        setIsPlaced(false);
        handleCorrectAnswer();
      }, 2000);
    } else {
      TTSService.speak(
        tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)],
      );
      setIsCorrect(false);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        setIsPlaced(false);
      }, 1500);
    }
  };

  const handleCorrectAnswer = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      setShowSuccessModal(true);
      TTSService.stop();
      TTSService.speak('Great job! You filled all the missing letters!');
    }
  };

  const handlePlay = () => {
    if (!isSpeaking) {
      TTSService.stop();
      TTSService.speak(questionAsk);
    }
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsPlaced(false);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: `${data.lightColor}22` }]}
    >
      <CustomTopbar data={data} progress={screenProgress} />
      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Search for the correct letter with Coco! Tap and improve your letter recognition!"
      />

      <View
        style={[
          styles.challengeInfoContainer,
          {
            backgroundColor: `${data.darkColor}33`,
            borderColor: data.darkColor,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            { backgroundColor: data.midColor, color: data.lightColor },
          ]}
        >
          {currentQues?.activity} Challenge
        </Text>
        <Text style={[styles.normalHeadingText, { color: data.midColor }]}>
          {isCompleted
            ? 'Congratulations! You completed all the letter fill rounds!'
            : `Find the Letter "${currentQues?.target.letter}" and Make Coco Happy!`}
        </Text>
      </View>

      <View style={[styles.playAear, { borderColor: data.midColor }]}>
        {!isCompleted ? (
          <>
            <ActionButton
              bottomBorderWidth={5}
              radius={50}
              backgroundColor={data.lightColor || data.midColor}
              bottomBorderColor={data.darkColor}
              onPress={handlePlay}
              styles={styles.speakBtn}
            >
              <FontAwesome6
                name={isSpeaking ? 'volume-high' : 'play'}
                iconStyle="solid"
                size={18}
                color={data.midColor}
              />
            </ActionButton>
            <Text style={styles.questionText}>{questionAsk}</Text>

            <View
              style={[
                styles.targetLetterContainer,
                { borderColor: data.darkColor },
              ]}
            >
              <CharacterFeedback
                colors={data}
                selectedOption={selectedOption}
                isCorrect={isCorrect}
                styles={styles.characterFeeback}
                isSpeaking={isSpeaking}
                imgTop={25}
              />
              <View style={styles.letterEmojiSection}>
                <View
                  ref={targetRef}
                  onLayout={handleTargetLayout}
                  style={styles.dropArea}
                >
                  <Svg
                    width="100%"
                    height="100%"
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
                  >
                    <SvgText
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      alignmentBaseline="central"
                      fontFamily="Fredoka-Bold"
                      fontSize={105}
                      fill={
                        isCorrect == null
                          ? '#e7e7e7'
                          : isCorrect == true
                          ? // ? '#e7e7e7c2'
                            '#4caf4fca'
                          : '#f14d47c9'
                      }
                      stroke={
                        isCorrect == null
                          ? '#9a9a9a'
                          : isCorrect == true
                          ? '#4CAF50'
                          : '#f14d47'
                      }
                      strokeWidth={isPlaced ? 8 : 6}
                      strokeLinejoin="round"
                    >
                      {currentQues?.target.letter}
                    </SvgText>
                  </Svg>
                </View>
                <Text style={styles.emoji}>{currentQues?.target.emoji}</Text>
              </View>
            </View>
            <View
              style={[
                styles.optionsContainer,
                { backgroundColor: `${data.darkColor}33` },
              ]}
            >
              {currentQues?.options.map((option, index) => {
                const isThisTheAnsweredOne =
                  isPlaced && option.data.letter === currentQues.target.letter;

                return (
                  <DraggableLetter
                    colors={data}
                    index={index}
                    key={`${currentIndex}-${option.data.letter}-${index}`}
                    data={option}
                    mouthRect={shapRect}
                    targetLetter={currentQues.target.letter}
                    onDrop={handleLetterDrop}
                    onHoverChange={() => {}}
                    disabled={isPlaced && !isThisTheAnsweredOne}
                  />
                );
              })}
            </View>
          </>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Fredoka-Bold',
                color: data.darkColor,
                textAlign: 'center',
              }}
            >
              🎉 You Filled All Letters! 🎉
            </Text>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <ActionButton
                bottomBorderWidth={5}
                radius={20}
                backgroundColor={data.midColor}
                bottomBorderColor={data.darkColor}
                onPress={handleRestart}
                styles={{ paddingHorizontal: 20, paddingVertical: 10 }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 16,
                  }}
                >
                  Play Again
                </Text>
              </ActionButton>
              <ActionButton
                bottomBorderWidth={5}
                radius={20}
                backgroundColor={data.darkColor}
                bottomBorderColor="#000"
                onPress={() => navigation.goBack()}
                styles={{ paddingHorizontal: 20, paddingVertical: 10 }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 16,
                  }}
                >
                  Home
                </Text>
              </ActionButton>
            </View>
          </View>
        )}
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="🎉 Letter Filled!"
        message="Awesome job! You filled all the missing letter slots correctly!"
        onRestart={handleRestart}
        onClose={() => {
          updateProgress({
            key: data.navigate?.toLowerCase() as ActivitiesKey,
            progress: screenProgress,
          });
          setShowSuccessModal(false);
          navigation.goBack();
        }}
        characterImage={require('../../assets/images/character/yay.gif')}
      />
    </View>
  );
};

export default FillingLetterScreen;
