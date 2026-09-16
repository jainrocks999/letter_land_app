import { View, Text, Image, Pressable } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StackNavigationProps,
  StackRouteProps,
} from '../../types/navigation.types';
import { styles } from './Matching.styles';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import DraggableLetterMatched from './components/DraggableLetters';
import EmojiTarget from './components/Emoji';
import MatchingLine from './components/MatchingLine';
import { useLetterMatchPair } from '../../hooks/useLetterMatchPair';
import TTSService from '../../services/tts.service';
import { praiseMessages, tryAgainMessages } from '../../utils/helperData';
import TTSEventService from '../../services/ttsEvents.service';
import SuccessModal from '../../components/customModal/CustomModel';
import { ActivitiesKey } from '../../services/mmkv.service';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';

const MatchingScreen: React.FC = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.MATCHING>>();
  const { data } = route.params;
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.MATCHING>>();
  const { updateProgress } = useActivityProContext();

  const [instruction, setInstruction] = useState<string>('');
  const [isSpeaking, setSpeaking] = useState<boolean>(false);

  const matching = useLetterMatchPair({ data });

  useEffect(() => {
    TTSService.setSpeechRate(0.55);
    TTSEventService.addListeners({
      onStart: () => setSpeaking(true),
      onFinish: () => setSpeaking(false),
      onCancel: () => setSpeaking(false),
    });
    let message = handleInstruction(
      matching.currentPairs[matching?.matchedLetters.length]?.letter,
    );
    handleSpeak(
      `Hi, little friend! I’m Coco! Let’s play a fun letter game! Look at the letter, then find the picture of that. Ready? Let’s go! ${message}`,
    );
    setInstruction(message);
  }, []);

  useEffect(() => {
    const { isCorrect } = matching.roundStatus;
    const matchedCount = matching.matchedLetters.length;

    if (isCorrect === null) return;

    const currentLetter = matching.currentPairs[matchedCount]?.letter;
    if (isCorrect === false) {
      TTSService.setSpeechRate(0.25);

      const message =
        tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)];
      handleSpeak(message);
      return;
    }
    const textToSpeak = handleInstruction(currentLetter);
    // console.log(textToSpeak);
    setInstruction(textToSpeak);

    if (isCorrect === true) {
      const praise =
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)];

      handleSpeak(`${praise} ${textToSpeak}`);
    }
  }, [matching.roundStatus.isCorrect, matching.matchedLetters.length]);

  const handleSpeak = useCallback((text: string) => {
    TTSService.speak(text);
  }, []);

  const handleInstruction = (currentLetter: string | undefined) => {
    if (!currentLetter) {
      return '';
    }
    return `${
      matching.matchedLetters.length === 0
        ? `Round ${matching.currentRound + 1} `
        : 'Now '
    }match the letter ${currentLetter} to its picture.`;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: `${data.darkColor}33` }]}
    >
      <CustomTopbar
        data={data}
        progress={Math.round(
          ((matching.currentRound * 5 + matching.matchedLetters.length) /
            (matching.rounds.length * 5)) *
            100,
        )}
      />
      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Match letters to pictures with Coco! Find the picture that starts with each letter."
      />

      <View
        style={[
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.darkColor}66`,
          },
          styles.actInfoSection,
        ]}
      >
        <View style={styles.rowWithSpace}>
          <View style={styles.infoSection}>
            <View style={styles.rowSection}>
              <Text
                style={[
                  styles.indicatorText,
                  {
                    color: data.midColor,
                    backgroundColor: `${data.darkColor}77`,
                    borderColor: data.darkColor,
                  },
                ]}
              >
                Round {matching.currentRound + 1}/{matching.rounds.length}
              </Text>
              <Text
                style={[
                  styles.indicatorText,
                  {
                    color: data.midColor,
                    backgroundColor: `${data.darkColor}77`,
                    borderColor: data.darkColor,
                  },
                ]}
              >
                Progress {matching.matchedLetters.length}/5
              </Text>
            </View>

            <View style={styles.rowSection}>
              {matching.currentPairs[matching?.matchedLetters.length]
                ?.letter && (
                <View style={styles.questionTextContainer}>
                  {matching.currentPairs && (
                    <Text
                      style={[styles.questionText, { color: data.darkColor }]}
                    >
                      {matching.currentPairs[matching?.matchedLetters.length]
                        ?.letter || ''}
                    </Text>
                  )}
                </View>
              )}
              <View style={styles.instructionTextContainer}>
                <Text style={styles.instructionText}>
                  {instruction || ` Round ${matching.currentRound + 1}`}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => {
              handleSpeak(instruction);
            }}
          >
            <Image
              source={
                matching.roundStatus.isCorrect === null
                  ? matching.roundStatus.isCorrect === null && isSpeaking
                    ? require('../../assets/images/character/speaking.gif')
                    : require('../../assets/images/character/standing.gif')
                  : matching.roundStatus.isCorrect
                  ? require('../../assets/images/character/great.gif')
                  : require('../../assets/images/character/opps.gif')
              }
              style={styles.cocoImage}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.matchingPairContainer,
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.lightColor}`,
          },
        ]}
      >
        {matching.matchedConnections?.map(connection => (
          <MatchingLine
            key={connection.letter}
            start={connection.start}
            end={connection.end}
            color="#22c55e"
            thickness={12}
          />
        ))}

        {matching.activeLine && (
          <MatchingLine
            start={matching.activeLine.start}
            end={matching.activeLine.end}
            color={matching.activeLine.color}
            thickness={12}
          />
        )}

        <View
          onLayout={e => {
            const { x, y } = e.nativeEvent.layout;
            matching.letterColumnRef.current = { x, y };
            matching.updateAllLetterPositions(x, y);
          }}
        >
          {matching.currentPairs?.map(item => {
            const isMatched = matching.matchedLetters.includes(item.letter);
            return (
              <View
                key={item.letter}
                onLayout={e => {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  matching.handleLetterLayout(item.letter, {
                    x,
                    y,
                    width,
                    height,
                  });
                }}
                style={{ marginVertical: 8 }}
              >
                <DraggableLetterMatched
                  item={item}
                  disabled={isMatched}
                  isMatched={isMatched}
                  data={data}
                  startPoint={
                    matching.letterPositions[item.letter]
                      ? matching.getCenter(
                          matching.letterPositions[item.letter],
                        )
                      : undefined
                  }
                  onDragStart={matching.handleDragStart}
                  onDragMove={matching.handleDragMove}
                  onDragEnd={matching.handleDragEnd}
                />
              </View>
            );
          })}
        </View>
        <View
          onLayout={e => {
            const { x, y } = e.nativeEvent.layout;

            matching.emojiColumnRef.current = { x, y };
            matching.updateAllEmojiPositions(x, y);
          }}
          style={styles.emojiColumnSection}
        >
          {matching.emojis?.map(item => {
            const isMatched = matching.matchedLetters.includes(item.letter);

            return (
              <EmojiTarget
                key={item.letter}
                item={item}
                disabled={isMatched}
                isMatched={isMatched}
                data={data}
                onLayoutPosition={matching.handleEmojiLayout}
              />
            );
          })}
        </View>
      </View>

      <SuccessModal
        visible={matching.showSuccessModal}
        title="🎉 Perfect Match!"
        message="Fantastic! You matched all the letter pairs correctly!"
        onRestart={matching.restartGame}
        onClose={() => {
          updateProgress({
            key: data.navigate?.toLowerCase() as ActivitiesKey,
            progress: Math.round(
              ((matching.currentRound * 5 + matching.matchedLetters.length) /
                (matching.rounds.length * 5)) *
                100,
            ),
          });
          matching.setShowSuccessModal(false);
          navigation.goBack();
        }}
        characterImage={require('../../assets/images/character/yay.gif')}
      />
    </View>
  );
};

export default MatchingScreen;
