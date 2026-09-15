import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { colorData, SearchQuestionType } from '../../../../types/search.types';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import SadEmojiAnimation from '../../../../components/characterAnimation/SadEmojiAnimation';
import { praiseMessages, tryAgainMessages } from '../../../../utils/helperData';
import TTSService from '../../../../services/tts.service';
import CharacterFeedback from '../../../../components/characterAnimation/CharacterFeedback';

interface Props {
  colors: colorData;
  currentQuest: SearchQuestionType;
  onCorrectAnswer: () => void;
  isSpeaking: boolean;
  questionAsk: string;
  handlePlay: () => void;
}

const FindingChallenge = ({
  colors,
  currentQuest,
  onCorrectAnswer,
  isSpeaking,
  questionAsk,
  handlePlay,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOnPress = (letter: string) => {
    setSelectedOption(letter);
    if (letter === currentQuest.target.letter.toLowerCase()) {
      TTSService.speak(
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)],
      );
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedOption(null);
        onCorrectAnswer();
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
  return (
    <View style={styles.container}>
      <CharacterFeedback
        colors={colors}
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
            borderColor: colors.darkColor,
          },
        ]}
      >
        <FontAwesome6
          name={isSpeaking ? 'volume-high' : 'play'}
          iconStyle="solid"
          size={18}
          color={colors.darkColor}
        />
      </Pressable>
      <Text style={[styles.questionText, { color: colors.darkColor }]}>
        {questionAsk}
      </Text>

      <View style={styles.optionsContianer}>
        {currentQuest.options.map((option, index) => {
          const optionText = option.data.letter.toLowerCase();
          const isSelected = selectedOption === optionText;

          return (
            <Pressable
              key={index.toString()}
              onPress={() => {
                handleOnPress(optionText);
              }}
              style={({ pressed }) => [
                styles.optionBtn,
                {
                  opacity: pressed ? 0.6 : 1,
                  borderColor: !isSelected
                    ? colors.darkColor
                    : isCorrect
                    ? '#0d7024'
                    : '#bbbaba',
                  backgroundColor: !isSelected
                    ? `${colors.lightColor}66`
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
                      ? colors.darkColor
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
  );
};

export default FindingChallenge;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 10,
    height: '62%',
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 25,
    marginHorizontal: 35,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  playBtn: {
    borderWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 25,
    elevation: 5,
    backgroundColor: '#fff',
    top: -20,
  },
  optionsContianer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
    gap: 25,
    marginVertical: 'auto',
  },
  optionBtn: {
    borderWidth: 3,
    height: 70,
    width: '35%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTxt: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 30,
  },
});
