import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import {
  colorData,
  RectType,
  SearchQuestionType,
} from '../../../../types/search.types';
import CharacterFeedback from '../../../../components/characterAnimation/CharacterFeedback';
import DraggableLetter from '../DraggableLetter';
import Svg, { Text as SvgText } from 'react-native-svg';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../../../components/customButton/ActionButton';
import { praiseMessages, tryAgainMessages } from '../../../../utils/helperData';
import TTSService from '../../../../services/tts.service';

interface Props {
  colors: colorData;
  currentQuest: SearchQuestionType;
  onCorrectAnswer: () => void;
  isSpeaking: boolean;
  questionAsk: string;
  handlePlay: () => void;
}
const MatchChallenge = ({
  colors,
  currentQuest,
  onCorrectAnswer,
  isSpeaking,
  questionAsk,
  handlePlay,
}: Props) => {
  const [isPlaced, setIsPlaced] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mouthRect, setMouthRect] = useState<RectType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const targetRef = useRef<View>(null);

  const handleTargetLayout = () => {
    requestAnimationFrame(() => {
      targetRef.current?.measureInWindow((x, y, width, height) => {
        setMouthRect({ x, y, width, height });
      });
    });
  };

  const handleLetterDrop = (letter: string) => {
    if (isPlaced) return;
    setSelectedOption(letter);
    if (letter === currentQuest.target.letter) {
      TTSService.speak(
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)],
      );
      setIsPlaced(true);
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedOption(null);
        setIsPlaced(false);
        onCorrectAnswer();
      }, 2000);
    } else {
      TTSService.speak(
        tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)],
      );
      setIsCorrect(false);
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        setIsPlaced(false);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <ActionButton
        bottomBorderWidth={5}
        radius={50}
        backgroundColor={colors.lightColor || colors.midColor}
        bottomBorderColor={colors.darkColor}
        onPress={handlePlay}
        styles={styles.speakBtn}
      >
        <FontAwesome6
          name={isSpeaking ? 'volume-high' : 'play'}
          // name={'play'}
          iconStyle="solid"
          size={18}
          color={colors.midColor}
        />
      </ActionButton>
      <Text style={styles.questionText}>
        {/* Can you find {currentQuest.target.letter} and put it in the right spot? */}
        {questionAsk}
      </Text>
      <View
        style={[
          styles.targetLetterContainer,
          { borderColor: colors.darkColor },
        ]}
      >
        <CharacterFeedback
          colors={colors}
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
                    ? '#e7e7e7c2'
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
                {currentQuest.target.letter}
              </SvgText>
            </Svg>
          </View>
          <Text style={styles.emoji}>{currentQuest.target.emoji}</Text>
        </View>
      </View>

      <View
        style={[
          styles.optionsContainer,
          { backgroundColor: `${colors.darkColor}33` },
        ]}
      >
        {currentQuest.options.map((option, index) => {
          const isThisTheAnsweredOne =
            isPlaced && option.data.letter === currentQuest.target.letter;

          return (
            <DraggableLetter
              colors={colors}
              index={index}
              key={option.data.letter}
              data={option}
              mouthRect={mouthRect}
              targetLetter={currentQuest.target.letter}
              onDrop={handleLetterDrop}
              onHoverChange={() => {}}
              disabled={isPlaced && !isThisTheAnsweredOne}
            />
          );
        })}
      </View>
    </View>
  );
};

export default MatchChallenge;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 10,
    height: '62%',
    justifyContent: 'space-around',
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    // marginRight: 45,
    width: '85%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    letterSpacing: 0.8,
  },
  letterShap: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 100,
    lineHeight: 100,
  },
  speakBtn: {
    height: '10%',
    width: '13%',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  targetLetterContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderBottomWidth: 7,
  },
  characterFeeback: {
    height: '100%',
    width: '37%',
    alignSelf: 'center',
    marginTop: 0,
  },
  letterEmojiSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '50%',
  },
  dropArea: {
    width: '62%',
    height: '70%',
  },
  emoji: {
    fontSize: 100,
    lineHeight: 120,
    right: 55,
  },
  optionsContainer: {
    width: '100%',
    height: '50%',
    padding: 10,
    borderRadius: 20,
  },
});
