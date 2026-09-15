import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { StackRouteProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import CustomButton from '../../components/customButton/CustomButton';
import { wp } from '../../utils/responsive';
import { traceLetters } from './data/letters.data';
import { styles } from './Tracing.styles';
import ActionButton from '../../components/customButton/ActionButton';
import AnimatedSwitcher from '../../components/animatedSwitcher/AnimatedSwitcher';
import TTSService from '../../services/tts.service';
import TracingGestureHandler from './components/tracing/TracingGestureHandler';
import TracingCanvas from './components/tracing/TracingCanvas';
import useLetterTracing from '../../hooks/useLetterTracing';
import { tracingConstants } from '../../config/constants';
import TTSEventService from '../../services/ttsEvents.service';

const { VIEW_BOX_WIDTH, VIEW_BOX_HEIGHT } = tracingConstants;

const TracingScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.TRACING>>();
  const { data } = route.params;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setSpeaking] = useState<boolean>(false);
  const [isNext, setIsNext] = useState<boolean>(true);

  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(-10);

  const current = traceLetters[currentIndex];

  const handleStrokeComplete = useCallback((index: number) => {
    showHitBubble();
  }, []);

  const handleSpeak = useCallback((text: string) => {
    TTSService.speak(text);
  }, []);

  const tracing = useLetterTracing({
    current,
    onStrokeComplete: strokeIndex => {
      handleStrokeComplete(strokeIndex);
    },
    onSpeak: text => {
      handleSpeak(text);
    },
  });

  const screenProgress = Math.round(
    ((currentIndex + 1) / traceLetters.length) * 100,
  );

  const bubbleStyle = useAnimatedStyle(() => {
    return {
      opacity: bubbleOpacity.value,
      transform: [
        {
          translateY: bubbleTranslateY.value,
        },
      ],
    };
  });

  useEffect(() => {
    TTSEventService.addListeners({
      onStart: () => setSpeaking(true),
      onFinish: () => setSpeaking(false),
      onCancel: () => setSpeaking(false),
    });
  }, []);

  useEffect(() => {
    handleStrokeComplete(0);
    handleSpeak(`${current.hint2?.[0]}`);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < traceLetters.length - 1) {
      setIsNext(true);
      setCurrentIndex(prev => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsNext(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const showHitBubble = useCallback(() => {
    setTimeout(() => {
      bubbleOpacity.value = withTiming(1, { duration: 300 });
      bubbleTranslateY.value = withTiming(0, { duration: 300 });

      setTimeout(() => {
        bubbleOpacity.value = withTiming(0, { duration: 300 });
        bubbleTranslateY.value = withTiming(-10, { duration: 300 });
      }, 3000);
    }, 500);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${data.lightColor}22`,
        },
      ]}
    >
      <CustomTopbar data={data} progress={screenProgress} />

      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Trace each letter with Coco! Tap, follow, and practice your writing!"
      />

      <View
        style={[
          styles.infoSection,
          styles.tracingProgressSection,
          { borderColor: data.darkColor },
        ]}
      >
        <View style={[styles.tracingProgress]}>
          <Text
            style={[
              styles.statusText,
              styles.traceProgessText,
              { color: data.darkColor },
            ]}
          >
            stroke: {tracing.strokeTrails.length}/{current.strokes.length}
          </Text>
        </View>

        <View style={styles.tracingProgress}>
          <Text
            style={[
              styles.statusText,
              styles.traceProgessText,
              { color: data.darkColor },
            ]}
          >
            {tracing.isComplete
              ? '100'
              : Math.round(tracing.letterProgress * 100)}
            %
          </Text>
        </View>
      </View>

      <AnimatedSwitcher
        animatedKey={current.letter}
        isNext={isNext}
        style={styles.traceSection}
      >
        <TracingGestureHandler
          enabled={!tracing.isComplete}
          onTraceStart={tracing.handleTraceStart}
          onTraceMove={tracing.handleTraceMove}
          onTraceEnd={tracing.handleTraceEnd}
        >
          <TracingCanvas
            current={current}
            isComplete={tracing.isComplete}
            data={data}
            viewBoxWidth={VIEW_BOX_WIDTH}
            viewBoxHeight={VIEW_BOX_HEIGHT}
            activeStrokeIndex={tracing.activeStrokeIndex}
            checkpointIndex={tracing.checkpointIndex}
            currentStroke={tracing.currentStroke}
            totalLength={tracing.totalLength}
            tracedLength={tracing.tracedLength}
            strokeTrails={tracing.strokeTrails}
            guidePoints={tracing.guidePoints}
            onLayout={tracing.handleCanvasLayout}
          />
        </TracingGestureHandler>
      </AnimatedSwitcher>
      <View
        style={[
          styles.infoSection,
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.lightColor}33`,
          },
        ]}
      >
        <View style={styles.letterPill}>
          <Text style={[styles.letterPillText, { color: data.darkColor }]}>
            {current.letter}
          </Text>
        </View>
        <View style={[styles.feedbackCopy, { alignItems: 'center' }]}>
          <Text style={styles.statusText}>{tracing.statusText}</Text>
          <Text style={[styles.hintText, { textAlign: 'center' }]}>
            {current.hint}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            showHitBubble();
            handleSpeak(`${current.hint2?.[tracing.activeStrokeIndex]}`);
          }}
        >
          <Animated.View style={bubbleStyle}>
            <Text
              style={[
                styles.hintText,
                styles.characterMsg,
                {
                  color: data.darkColor,
                },
              ]}
            >
              {current.hint2?.[tracing.activeStrokeIndex]}
            </Text>
          </Animated.View>
          <Image
            source={
              tracing.isComplete
                ? require('../../assets/images/character/great.gif')
                : isSpeaking
                ? require('../../assets/images/character/speaking.gif')
                : require('../../assets/images/character/standing.gif')
            }
            style={styles.characterImage}
          />
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <ActionButton
          bottomBorderWidth={8}
          radius={18}
          backgroundColor="#e8b59e"
          bottomBorderColor="#d84d16ce"
          onPress={handlePrev}
        >
          <FontAwesome6
            name="chevron-left"
            iconStyle="solid"
            size={20}
            color="#d84d16ce"
          />
        </ActionButton>
        {/* {for testing only } */}
        {/* <TouchableOpacity onPress={handleNext}>
          <Text>pass</Text>
        </TouchableOpacity> */}
        <CustomButton
          width={wp(40)}
          bottomBorderColor={tracing.isComplete ? '#0d8f3e' : '#d84e16'}
          colors={
            tracing.isComplete ? ['#35c46b', '#1ca952'] : ['#ff7b38', '#ff6425']
          }
          onPress={tracing.isComplete ? handleNext : tracing.resetTrace}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {tracing.isComplete ? 'Next' : 'Retry'}
            </Text>
            <FontAwesome6
              name={tracing.isComplete ? 'chevron-right' : 'rotate-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
      </View>
    </View>
  );
};

export default TracingScreen;
