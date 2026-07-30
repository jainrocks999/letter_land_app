import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ROUTES } from '../../app/navigation/routeNames';
import { StackRouteProps } from '../../types/navigation';
import { useRoute } from '@react-navigation/native';
import { ActivityCard } from '../home/data/home.data';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { alphabetData, LetterCardType } from './data/learning.data';
import CustomButton from '../../components/customButton/CustomButton';
import { wp } from '../../utils/Responsive';
import { styles } from './Learning.styles';
import TTSService from '../../services/tts.service';
import TTSEventService from '../../services/ttsEvents.service';
import CharacterSection from '../../components/characterAnimation/CharacterSection';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import AnimatedSwitcher from '../../components/animatedSwitcher/AnimatedSwitcher';
const LearningScreen: React.FC = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.LEARNING>>();
  const { data } = route.params;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean>(true);
  const [isSpeaking, setSpeaking] = useState<boolean>(false);

  const current = alphabetData[currentIndex];
  const progress = Math.round(((currentIndex + 1) / alphabetData.length) * 100);
  useEffect(() => {
    TTSEventService.addListeners({
      onStart: () => setSpeaking(true),
      onFinish: () => setSpeaking(false),
      onCancel: () => setSpeaking(false),
    });
  }, []);

  useEffect(() => {
    TTSService.speak(`${current.letter} is for ${current.word}`);
  }, [current]);

  const handleNext = () => {
    if (currentIndex < alphabetData.length - 1) {
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

  const handlePlay = () => {
    TTSService.speak(`${current.letter} is for ${current.word}`);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${data.lightColor}33`,
          justifyContent: 'space-between',
        },
      ]}
    >
      <CustomTopbar data={data} progress={progress} />

      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Learn letters with Coco! - tap, listen, and repeat!"
      />

      <AnimatedSwitcher animatedKey={currentIndex} isNext={isNext}>
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(150)}
          style={[
            {
              borderColor: data.darkColor,
              backgroundColor: `${data.lightColor}66`,
            },
            styles.lettersCard,
          ]}
        >
          <View style={[{ paddingHorizontal: 15 }, styles.rowSpacebetween]}>
            <View style={styles.rowCenter}>
              <Text style={styles.letterText}>{current.letter}</Text>
              <Text
                style={[
                  styles.letterText,
                  { fontSize: 110, bottom: -10, left: -10 },
                ]}
              >
                {current.letter.toLowerCase()}
              </Text>
            </View>
            <Text style={styles.emojiContainer}>{current.emoji}</Text>
          </View>

          <View style={[{ paddingHorizontal: 15 }, styles.rowSpacebetween]}>
            <Text style={styles.wordText}>
              {`${current.letter} is for ${current.word}`}
            </Text>

            <TouchableOpacity
              style={[{ backgroundColor: data.darkColor }, styles.playBtn]}
              onPress={handlePlay}
            >
              <View
                style={[
                  styles.rowCenter,
                  styles.btnWrapper,
                  { backgroundColor: data.lightColor },
                ]}
              >
                <FontAwesome6
                  name={isSpeaking ? 'volume-high' : 'play'}
                  iconStyle="solid"
                  size={18}
                  color={data.midColor}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </AnimatedSwitcher>

      <View
        style={[
          styles.charecterSection,
          styles.rowSpacebetween,
          { borderColor: data.darkColor },
        ]}
      >
        <View style={{ gap: 10, flex: 1 }}>
          <View style={[styles.rowCenter, styles.actionStatusSection]}>
            <FontAwesome6
              name="circle"
              iconStyle="solid"
              size={8}
              color="#e85216"
            />
            <Text style={[styles.subText, { color: '#e85216', fontSize: 10 }]}>
              Coco is {isSpeaking ? 'Speaking' : 'Listing'}...
            </Text>
          </View>
          <View style={styles.wordContainer}>
            <Text
              style={[
                styles.letterText,
                { fontSize: 30, color: data.darkColor },
              ]}
            >
              {current.word}
            </Text>
          </View>
        </View>
        <CharacterSection isSpeaking={isSpeaking} />
      </View>

      <View style={styles.letterSliderSection}>
        <Text style={[styles.subText, styles.letterSliderTitleText]}>
          Pick an Alphabets
        </Text>
        <AlphabetsLetterSlider
          data={data}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setIsNext={setIsNext}
        />
      </View>

      <View style={[styles.rowSpacebetween, { marginBottom: 10 }]}>
        <CustomButton
          width={wp(45)}
          bottomBorderColor="#d84d16ce"
          colors={['#e8b59e', '#e8b59e']}
          onPress={handlePrev}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <View style={styles.rowCenter}>
            <FontAwesome6
              name="chevron-left"
              iconStyle="solid"
              size={20}
              color="#d84d16ce"
              style={[{ backgroundColor: '#d84d1645' }, styles.btnIcon]}
            />
            <Text style={[{ color: '#d84d16ad' }, styles.btnText]}>
              Previous
            </Text>
          </View>
        </CustomButton>

        <CustomButton
          width={wp(45)}
          bottomBorderColor="#d84e16"
          colors={['#ff7b38', '#ff6425']}
          onPress={handleNext}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <View style={styles.rowCenter}>
            <Text style={[{ color: '#fff' }, styles.btnText]}>Next</Text>
            <FontAwesome6
              name="chevron-right"
              iconStyle="solid"
              size={20}
              color="#fff"
              style={[{ backgroundColor: '#ffffff66' }, styles.btnIcon]}
            />
          </View>
        </CustomButton>
      </View>
    </View>
  );
};

export default LearningScreen;

interface AlphabetsLetterSlider {
  data: ActivityCard;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setIsNext: (isNext: boolean) => void;
}

const AlphabetsLetterSlider: React.FC<AlphabetsLetterSlider> = ({
  data,
  currentIndex,
  setCurrentIndex,
  setIsNext,
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: currentIndex,
      animated: true,
      viewOffset: 0.5,
    });
  }, [currentIndex]);

  const handleOnPress = (index: number) => {
    if (currentIndex !== index) {
      setCurrentIndex(index);
      setIsNext(index > currentIndex);
    }
  };

  const renderItem: ListRenderItem<LetterCardType> = ({ item, index }) => {
    const isActive: boolean = currentIndex === index;
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: `${data.midColor}${isActive ? '80' : '66'}`,
            borderColor: isActive ? data.midColor : 'transparent',
            marginLeft: index === 0 ? 10 : 0,
            marginRight: index === alphabetData.length - 1 ? 10 : 0,
          },
          styles.lettersListItem,
          styles.rowCenter,
        ]}
        onPress={() => handleOnPress(index)}
      >
        <Text
          style={[styles.letterText, { color: data.midColor, fontSize: 25 }]}
        >
          {item.letter}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={alphabetData}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.lettersList}
      scrollEventThrottle={16}
      renderItem={renderItem}
    />
  );
};
