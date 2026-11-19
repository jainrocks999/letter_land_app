import { Text, TouchableOpacity, View } from 'react-native';
import { hp, rf } from '../../utils/responsive';
import {
  ActivityCard,
  Castle,
  getActivityProgressKey,
  getCharacterLevel,
  getRequiredStickers,
  getStickersToUnlock,
  isActivityLocked,
} from '../../features/home/data/home.data';
import { styles } from './CastleCarousel.styles';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ProgressBar from '../progressBar/ProgressBar';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import useToast from '../../app/contexts/toast/useToast';
import TTSService from '../../services/tts.service';
import {
  HOME_ITEM_SIDE_PADDING,
  HOME_ITEM_WIDTH,
} from '../../features/home/home.layout';

interface props {
  data: Castle[];
  onIndexChange: (index: number) => void;
  scrollX: SharedValue<number>;
}

const ITEM_WIDTH = HOME_ITEM_WIDTH;

// page i is centred at a scroll offset of i * ITEM_WIDTH (the carousel's
// side padding centers page 0 at offset 0), so the nearest page flips at 50%
const getPageIndex = (offsetX: number) => Math.round(offsetX / ITEM_WIDTH);

interface CarouselItemProps {
  item: Castle;
  index: number;
  scrollX: SharedValue<number>;
  progress: number;
  // true when Buddy the character is standing on this level
  showCharacter: boolean;
  // true when Buddy is sad (the level ahead is still locked)
  characterSad: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  item,
  index,
  scrollX,
  progress,
  showCharacter,
  characterSad,
}) => {
  const navigation = useNavigation<StackNavigationProps<typeof ROUTES.HOME>>();
  const { rewards } = useRewardsContext();
  const { showToast } = useToast();

  const inputRange = [
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
    (index + 1) * ITEM_WIDTH,
  ];

  const offsetY = hp(20);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [offsetY, 0, offsetY],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }] };
  });

  const activityCardData: ActivityCard = item.innerCard;
  const collectedStickers = rewards.unlockedStickers.length;
  const requiredStickers = getRequiredStickers(activityCardData);
  // locked until the kid has collected enough stickers in the sticker book
  const isLocked = isActivityLocked(activityCardData, collectedStickers);

  return (
    <View style={styles.pageContainer}>
      {/* activityCard */}
      <View
        style={[
          styles.activityCard,
          { borderColor: isLocked ? '#9e9e9e' : activityCardData.darkColor },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isLocked
                ? '#e5e5e5'
                : activityCardData.lightColor,
              borderColor: isLocked ? '#9e9e9e' : activityCardData.darkColor,
            },
          ]}
        >
          <Text style={[styles.icon, isLocked && { opacity: 0.5 }]}>
            {activityCardData.icon}
          </Text>
        </View>
        <View style={styles.contentSection}>
          <Text
            style={[
              styles.cardTitleText,
              { color: isLocked ? '#555555' : activityCardData.darkColor },
            ]}
          >
            {activityCardData.cardTitle}
          </Text>
          <Text style={styles.descText}>{activityCardData.shortDes}</Text>
          <ProgressBar progress={isLocked ? 0 : progress} />
          <Text
            style={[
              styles.tagText,
              {
                backgroundColor: isLocked
                  ? '#e5e5e5'
                  : activityCardData.lightColor,
                color: isLocked ? '#777777' : activityCardData.midColor,
              },
            ]}
          >
            {isLocked
              ? `Need ${requiredStickers} ${
                  requiredStickers === 1 ? 'sticker' : 'stickers'
                }`
              : activityCardData.tag}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.cardBtnContainer,
            {
              backgroundColor: isLocked
                ? '#888888'
                : activityCardData.darkColor,
              borderColor: isLocked ? '#cccccc' : activityCardData.lightColor,
            },
          ]}
          onPress={() => {
            const navigate = item.innerCard.navigate;
            if (!navigate) return;
            if (isLocked) {
              const remaining = getStickersToUnlock(
                activityCardData,
                collectedStickers,
              );
              const stickerWord = remaining === 1 ? 'sticker' : 'stickers';
              const message = `Collect ${remaining} more ${stickerWord} to unlock ${activityCardData.cardTitle}`;
              showToast(message, '🔒');
              TTSService.speak(message);
              return;
            }
            navigation.navigate(navigate, { data: activityCardData });
          }}
        >
          <FontAwesome6
            name={isLocked ? 'lock' : 'play'}
            iconStyle="solid"
            size={rf(18)}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.singlePage}>
        <View style={styles.singlePageContent}>
          <View
            style={[
              styles.castleWrapper,
              isLocked ? styles.lockedImage : undefined
            ]}
          >
            <View>
              <Animated.Image
                source={item.image}
                style={[styles.imgContainer, animatedStyle]}
              />
            </View>
            {showCharacter && (
              <Animated.Image
                source={
                  characterSad
                    ? require('../../assets/images/character/sad.gif')
                    : require('../../assets/images/character/standing.gif')
                }
                style={[styles.characterImage, animatedStyle]}
              />
            )}
          </View>
          <View style={styles.bottomPlatform} />
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>{item.title}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const CastleCarousel: React.FC<props> = ({ data, onIndexChange, scrollX }) => {
  const { progressData, characterIndex } = useActivityProContext();
  const { rewards } = useRewardsContext();
  const collectedStickers = rewards.unlockedStickers.length;
  const lastReportedIndex = useSharedValue(0);
  // level Buddy stands on: the last level the kid played, or the first
  // unfinished level before they have played anything. He looks sad while the
  // level he is waiting on is still locked.
  const resolvedIndex =
    characterIndex >= 0 && characterIndex < data.length
      ? characterIndex
      : getCharacterLevel(data, progressData, collectedStickers).index;
  const characterSad = isActivityLocked(
    data[resolvedIndex].innerCard,
    collectedStickers,
  );
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      // report the nearest page as soon as it changes (at the 50% point),
      // instead of waiting for momentum to end — keeps the star counter live
      const index = Math.round(event.contentOffset.x / ITEM_WIDTH);
      if (index !== lastReportedIndex.value) {
        lastReportedIndex.value = index;
        runOnJS(onIndexChange)(index);
      }
    },
  });
  return (
    <Animated.FlatList
      data={data}
      horizontal
      bounces={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      decelerationRate="fast"
      snapToInterval={ITEM_WIDTH}
      snapToAlignment="start"
      disableIntervalMomentum
      contentContainerStyle={{
        paddingHorizontal: HOME_ITEM_SIDE_PADDING,
      }}
      onScroll={scrollHandler}
      onMomentumScrollEnd={event => {
        // final sync in case a snap lands slightly differently
        onIndexChange(getPageIndex(event.nativeEvent.contentOffset.x));
      }}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const itemProgressData = progressData[getActivityProgressKey(item)];
        return (
          <CarouselItem
            item={item}
            index={index}
            scrollX={scrollX}
            progress={itemProgressData ?? 0}
            showCharacter={index === resolvedIndex}
            characterSad={characterSad}
          />
        );
      }}
    />
  );
};

export default CastleCarousel;
