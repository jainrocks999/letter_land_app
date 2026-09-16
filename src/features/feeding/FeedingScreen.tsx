import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { useRoute } from '@react-navigation/native';
import { styles } from './Feeding.styles';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import { generateQuestionsUpgrade } from '../../utils/searchingHelper';
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

const FeedingScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.SEARCHING>>();
  const { data } = route.params;
  const [questions] = useState<SearchQuestionType[]>(() =>
    generateQuestionsUpgrade(true),
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [questionAsk, setQuestionAsk] = useState<string>('');

  const [characterState, setCharacterState] = useState<
    'standing' | 'feed' | 'enjoy' | 'oops'
  >('standing');
  const [mouthRect, setMouthRect] = useState<RectType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const mouthRef = useRef<View>(null);
  const isResolvingRef = useRef(false);

  const currentQues = questions[currentIndex];
  const screenProgress = Math.round(
    ((currentIndex + 1) / questions.length) * 100,
  );
  useEffect(() => {
    TTSEventService.addListeners({
      onStart: () => setIsSpeaking(true),
      onFinish: () => setIsSpeaking(false),
      onCancel: () => setIsSpeaking(false),
    });
    TTSService.setSpeechRate(0.4);

    const id = setTimeout(() => {
      mouthRef.current?.measureInWindow((x, y) => {
        setMouthRect({ x: x + 0, y: y + 80, width: 150, height: 80 });
      });
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const text = getQuestionText(currentQues);
    if (!text) return;
    setQuestionAsk(text);
    TTSService.speak(text);
  }, [currentQues]);

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
    if (letter === currentQues.target.letter) {
      setCharacterState('enjoy');
      TTSService.speak(
        feedingPraiseMessages[
          Math.floor(Math.random() * feedingPraiseMessages.length)
        ],
      );
      setTimeout(() => {
        setCharacterState('standing');
        isResolvingRef.current = false;
        handleCorrectAnswer();
      }, 5000);
    } else {
      setCharacterState('oops');
      TTSService.speak(
        feedingTryAgainMessages[
          Math.floor(Math.random() * feedingTryAgainMessages.length)
        ],
      );
      setTimeout(() => {
        setCharacterState('standing');
        isResolvingRef.current = false;
      }, 3500);
    }
  };

  const handleCorrectAnswer = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      console.log('All questions completed');
    }
  };

  const handlePlay = () => {
    if (!isSpeaking) {
      TTSService.speak(questionAsk);
    }
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
          {`Coco is looking for the letter ${currentQues?.target.letter}! Can you help?`}
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
        <View ref={mouthRef}>
          <AnimatedCharacter state={characterState} />
        </View>
        <View style={styles.optionsContainer}>
          <BackerySVG width={'100%'} height={'100%'} />
          {currentQues.options.map((option, index) => (
            <DraggableLetter
              index={index}
              key={option.data.letter}
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
    </View>
  );
};

export default FeedingScreen;
