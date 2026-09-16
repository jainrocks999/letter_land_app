import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { useRoute } from '@react-navigation/native';
import { styles } from './Searching.styles';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import { generateQuestionsUpgrade } from '../../utils/searchingHelper';
import { SearchQuestionType } from '../../types/search.types';
import TTSEventService from '../../services/ttsEvents.service';
import TTSService from '../../services/tts.service';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import SadEmojiAnimation from '../../components/characterAnimation/SadEmojiAnimation';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6/static';
import { praiseMessages, tryAgainMessages } from '../../utils/helperData';

const SearchingScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.SEARCHING>>();
  const { data } = route.params;
  const [questions] = useState<SearchQuestionType[]>(() =>
    generateQuestionsUpgrade(false, 3),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [questionAsk, setQuestionAsk] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
    const texts = [
      `Find the small letter of ${letter}.`,
      `Can you find the lowercase letter of ${letter}?`,
      `Which one is the small letter of ${letter}?`,
      `Pick the small letter that matches ${letter}.`,
      `Can you spot the lowercase ${letter}?`,
      `Find the lowercase version of ${letter}!`,
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const handleOnPress = (letter: string) => {
    setSelectedOption(letter);
    if (letter === currentQues.target.letter.toLowerCase()) {
      TTSService.speak(
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)],
      );
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedOption(null);
        handleCorrectAnswer();
      }, 2000);
    } else {
      TTSService.speak(
        tryAgainMessages[Math.floor(Math.random() * praiseMessages.length)],
      );
      setIsCorrect(false);
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 3000);
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
          {`Find "${currentQues?.target.letter}" and make Coco smile!`}
        </Text>
      </View>
      <View style={styles.playArea}>
        <CharacterFeedback
          colors={data}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          isSpeaking={isSpeaking}
        />
        {isCorrect === false && <SadEmojiAnimation />}
        <Pressable
          onPress={handlePlay}
          style={({ pressed }) => [
            styles.playBtn,
            {
              opacity: pressed ? 0.6 : 1,
              borderColor: data.darkColor,
            },
          ]}
        >
          <FontAwesome6
            name={isSpeaking ? 'volume-high' : 'play'}
            iconStyle="solid"
            size={18}
            color={data.darkColor}
          />
        </Pressable>
        <Text style={[styles.questionText, { color: data.darkColor }]}>
          {questionAsk}
        </Text>
        <View style={styles.optionsContianer}>
          {currentQues.options.map((option, index) => {
            const optionText = option.data.letter.toLowerCase();
            const isSelected = selectedOption === optionText;

            return (
              <Pressable
                key={index.toString()}
                disabled={isCorrect !== null}
                onPress={() => {
                  handleOnPress(optionText);
                }}
                style={({ pressed }) => [
                  styles.optionBtn,
                  {
                    opacity: pressed ? 0.6 : 1,
                    borderColor: !isSelected
                      ? data.darkColor
                      : isCorrect
                      ? '#0d7024'
                      : '#bbbaba',
                    backgroundColor: !isSelected
                      ? `${data.lightColor}66`
                      : isCorrect
                      ? '#28a745'
                      : '#e7e5e5',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionTxt,
                    {
                      color: !isSelected
                        ? data.darkColor
                        : isCorrect
                        ? '#0d7024'
                        : '#bbbaba',
                    },
                  ]}
                >
                  {optionText}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default SearchingScreen;
