import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { useRoute } from '@react-navigation/native';
import { styles } from './Searching.styles';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import { generateQuestions } from '../../utils/searchingHelper';
import { SearchQuestionType } from '../../types/search.types';
import FeedingChallenge from './components/challenge/FeedingChallenge';
import FindingChallenge from './components/challenge/FindingChallenge';
import { searchingConstants } from '../../config/constants';
import MatchChallenge from './components/challenge/MatchingChallenge';
import TTSEventService from '../../services/ttsEvents.service';
import TTSService from '../../services/tts.service';

const SearchingScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.SEARCHING>>();
  const { data } = route.params;
  const [questions] = useState<SearchQuestionType[]>(() => generateQuestions());
  const { ACTIVITY } = searchingConstants;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [questionAsk, setQuestionAsk] = useState<string>('');

  const { MONSTER, FIND, MATCH } = searchingConstants.ACTIVITY;

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
  }, []);

  useEffect(() => {
    const text = getQuestionText(currentQues);
    if (!text) return;
    setQuestionAsk(text);
    TTSService.speak(text);
  }, [currentQues]);

  const getQuestionText = (question: SearchQuestionType): string => {
    const letter = question.target.letter;
    switch (question.activity) {
      case MONSTER: {
        const texts = [
          `I'm hungry! Feed me the letter ${letter}!`,
          `Can you find the letter ${letter} for me? I'm hungry!`,
          `I'm so hungry! Can you feed me the letter ${letter}?`,
        ];
        return texts[Math.floor(Math.random() * texts.length)];
      }
      case FIND:
        return `Find the small letter of ${letter} ?`;
      case MATCH:
        return `Can you find ${letter} and put it in the right spot?`;

      default:
        return 'Find the Letter';
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
          {currentQues?.activity === ACTIVITY.MONSTER
            ? `Coco is looking for the letter ${currentQues?.target.letter}! Can you help?`
            : `Find the Letter "${currentQues?.target.letter}" and Make Coco Happy!`}
        </Text>
      </View>
      {currentQues?.activity === ACTIVITY.MONSTER && (
        <FeedingChallenge
          colors={data}
          currentQuest={currentQues}
          onCorrectAnswer={handleCorrectAnswer}
          isSpeaking={isSpeaking}
          questionAsk={questionAsk}
          handlePlay={handlePlay}
        />
      )}
      {currentQues?.activity === ACTIVITY.FIND && (
        <FindingChallenge
          colors={data}
          currentQuest={currentQues}
          onCorrectAnswer={handleCorrectAnswer}
          isSpeaking={isSpeaking}
          questionAsk={questionAsk}
          handlePlay={handlePlay}
        />
      )}
      {currentQues?.activity === ACTIVITY.MATCH && (
        <MatchChallenge
          colors={data}
          currentQuest={currentQues}
          onCorrectAnswer={handleCorrectAnswer}
          isSpeaking={isSpeaking}
          questionAsk={questionAsk}
          handlePlay={handlePlay}
        />
      )}
    </View>
  );
};

export default SearchingScreen;
