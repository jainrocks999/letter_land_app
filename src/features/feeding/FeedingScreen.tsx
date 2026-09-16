import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './Feeding.styles';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import {
  calculateMouthRect,
  generateQuestionsUpgrade,
} from '../../utils/searchingHelper';
import { RectType, SearchQuestionType } from '../../types/search.types';
import TTSEventService from '../../services/ttsEvents.service';
import TTSService from '../../services/tts.service';
import ActionButton from '../../components/customButton/ActionButton';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6/static';
import {
  feedingPraiseMessages,
  feedingTryAgainMessages,
} from '../../utils/helperData';
import DraggableLetter from './components/DraggableCookieLetter';
import AnimatedCharacter from './components/AnimatedCharacter';
import BackerySVG from './components/svgs/BackerySvg';
import SuccessModal from '../../components/customModal/CustomModel';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import { ActivitiesKey } from '../../services/mmkv.service';

const FeedingScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.FEEDING>>();
  const navigation = useNavigation();
  const { data } = route.params;
  const { updateProgress } = useActivityProContext();

  const [questions] = useState<SearchQuestionType[]>(() =>
    generateQuestionsUpgrade(true),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [questionAsk, setQuestionAsk] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [characterState, setCharacterState] = useState<
    'standing' | 'feed' | 'enjoy' | 'oops' | 'speaking'
  >('standing');
  const [mouthRect, setMouthRect] = useState<RectType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const mouthRef = useRef<View>(null);
  const isResolvingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQues = questions[currentIndex];
  const screenProgress = Math.round(
    ((currentIndex + 1) / questions.length) * 100,
  );

  const updateMouthRect = () => {
    mouthRef.current?.measureInWindow((x, y, width, height) => {
      setMouthRect(calculateMouthRect(x, y, width, height));
    });
  };

  useEffect(() => {
    const removeListeners = TTSEventService.addListeners({
      onStart: () => setIsSpeaking(true),
      onFinish: () => setIsSpeaking(false),
      onCancel: () => setIsSpeaking(false),
    });
    TTSService.setSpeechRate(0.4);

    const id = setTimeout(updateMouthRect, 100);
    return () => {
      clearTimeout(id);
      if (timerRef.current) clearTimeout(timerRef.current);
      removeListeners();
      TTSService.stop();
    };
  }, []);

  useEffect(() => {
    if (
      isSpeaking &&
      (characterState === 'standing' || characterState === 'speaking')
    ) {
      setCharacterState('speaking');
    } else if (!isSpeaking && characterState === 'speaking') {
      setCharacterState('standing');
    }
  }, [isSpeaking, characterState]);

  useEffect(() => {
    if (!currentQues || isCompleted) return;
    const text = getQuestionText(currentQues);
    if (!text) return;
    setQuestionAsk(text);
    TTSService.speak(text);
  }, [currentQues, isCompleted]);

  const getQuestionText = (question: SearchQuestionType): string => {
    const letter = question.target.letter;
    const texts = [
      `I'm hungry! Feed me the letter ${letter}!`,
      `Can you find the letter ${letter} for me? I'm hungry!`,
      `I'm so hungry! Can you feed me the letter ${letter}?`,
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const handleHoverChange = (isHovering: boolean) => {
    if (isResolvingRef.current) return;
    setCharacterState(isHovering ? 'feed' : 'standing');
  };

  const handleDrop = (letter: string) => {
    isResolvingRef.current = true;
    TTSService.stop();
    if (letter === currentQues.target.letter) {
      setCharacterState('enjoy');
      const praise =
        feedingPraiseMessages[
          Math.floor(Math.random() * feedingPraiseMessages.length)
        ];
      TTSService.speak(praise);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCharacterState('standing');
        isResolvingRef.current = false;
        handleCorrectAnswer();
        // }, 5000);
      }, 2200);
    } else {
      setCharacterState('oops');
      const tryAgain =
        feedingTryAgainMessages[
          Math.floor(Math.random() * feedingTryAgainMessages.length)
        ];
      TTSService.speak(tryAgain);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCharacterState('standing');
        isResolvingRef.current = false;
        // }, 3500);
      }, 1800);
    }
  };

  const handleCorrectAnswer = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      setShowSuccessModal(true);
      TTSService.stop();
      TTSService.speak('Great job! You fed Coco all the correct letters!');
    }
  };

  const handlePlay = () => {
    if (!isSpeaking) {
      TTSService.speak(questionAsk);
    }
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    isResolvingRef.current = false;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: `${data.lightColor}22` }]}
    >
      <CustomTopbar data={data} progress={screenProgress} />
      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Pick the correct letter and feed it to Coco! Learn your letters while helping Coco enjoy a tasty treat!"
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
            ? 'Congratulations! Coco is full and happy!'
            : `Coco is looking for the letter ${currentQues?.target.letter}! Can you help?`}
        </Text>
      </View>
      <View style={[styles.playArea, { borderColor: data.midColor }]}>
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
        <Text style={[styles.questionText, { color: data.darkColor }]}>
          {questionAsk}
        </Text>
        <View ref={mouthRef} onLayout={updateMouthRect}>
          <AnimatedCharacter state={characterState} />
        </View>
        <View style={styles.optionsContainer}>
          <BackerySVG width={'100%'} height={'100%'} />
          {currentQues.options.map((option, index) => (
            <DraggableLetter
              index={index}
              key={`${currentIndex}-${option.data.letter}-${index}`}
              data={option}
              mouthRect={mouthRect}
              onDrop={handleDrop}
              targetLetter={currentQues.target.letter}
              onHoverChange={handleHoverChange}
              colors={data}
            />
          ))}
        </View>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="🎉 Yummy! All Fed!"
        message="Great job! You fed Coco all the correct letter cookies!"
        onRestart={handleRestart}
        onClose={() => {
          updateProgress({
            key: data.navigate?.toLowerCase() as ActivitiesKey,
            progress: screenProgress,
          });
          setShowSuccessModal(false);
          navigation.goBack();
        }}
        characterImage={require('../../assets/images/character/yummy.gif')}
      />
    </View>
  );
};

export default FeedingScreen;
