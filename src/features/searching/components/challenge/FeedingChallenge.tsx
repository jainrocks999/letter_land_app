import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AnimatedCharacter from '../AnimatedCharacter';
import DraggableLetter from '../DraggableCookieLetter';
import {
  colorData,
  RectType,
  SearchQuestionType,
} from '../../../../types/search.types';
import BackerySVG from '../svgs/BackerySvg';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../../../components/customButton/ActionButton';
import TTSService from '../../../../services/tts.service';
import { feedingPraiseMessages, feedingTryAgainMessages } from '../../../../utils/helperData';

interface Props {
  colors: colorData;
  currentQuest: SearchQuestionType;
  onCorrectAnswer: () => void;
  isSpeaking: boolean;
  questionAsk: string;
  handlePlay: () => void;
}

const FeedingChallenge = ({
  colors,
  currentQuest,
  onCorrectAnswer,
  isSpeaking,
  questionAsk,
  handlePlay,
}: Props) => {
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

  useEffect(() => {
    const id = setTimeout(() => {
      mouthRef.current?.measureInWindow((x, y) => {
        setMouthRect({ x: x + 55, y: y + 40, width: 55, height: 55 });
      });
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const handleHoverChange = (isHovering: boolean) => {
    if (isResolvingRef.current) return;
    setCharacterState(isHovering ? 'feed' : 'standing');
  };
  const handleDrop = (letter: string) => {
    isResolvingRef.current = true;
    if (letter === currentQuest.target.letter) {
      setCharacterState('enjoy');
      TTSService.speak(feedingPraiseMessages[Math.floor(Math.random()* feedingPraiseMessages.length)]);
      setTimeout(() => {
        setCharacterState('standing');
        isResolvingRef.current = false;
        onCorrectAnswer();
      }, 1200);
    } else {
      setCharacterState('oops');
      TTSService.speak(feedingTryAgainMessages[Math.floor(Math.random()* feedingTryAgainMessages.length)]);
      setTimeout(() => {
        setCharacterState('standing');
        isResolvingRef.current = false;
      }, 1200);
    }
  };

  return (
    <View style={[styles.container, { borderColor: colors.midColor }]}>
      <ActionButton
        bottomBorderWidth={6}
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
      <Text style={[styles.questionText, { color: colors.darkColor }]}>
        {questionAsk}
      </Text>
      <View ref={mouthRef}>
        <AnimatedCharacter state={characterState} />
      </View>
      <View style={styles.optionsContainer}>
        <BackerySVG width={'100%'} height={'100%'} />
        {currentQuest.options.map((option, index) => (
          <DraggableLetter
            index={index}
            key={option.data.letter}
            data={option}
            mouthRect={mouthRect}
            onDrop={handleDrop}
            targetLetter={currentQuest.target.letter}
            onHoverChange={handleHoverChange}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
};

export default FeedingChallenge;

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
    paddingLeft: 20,
    fontFamily: 'Fredoka-Bold',
    fontSize: 23,
    // marginHorizontal: 35,
    // textAlign: 'center',
    letterSpacing: 0.8,
    // fontSize: 20,
    width: '85%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  optionsContainer: {
    width: '100%',
    height: '50%',
    marginTop: 25,
  },
  speakBtn: {
    height: '9%',
    width: '11%',
    position: 'absolute',
    right: 10,
    top: 10,
  },
});


