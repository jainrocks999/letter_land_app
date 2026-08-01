import { Text, TouchableOpacity, View } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { ActivityCard, Castle } from '../../features/home/data/home.data';
import { styles } from './CastleCarousel.styles';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ProgressBar from '../progressBar/ProgressBar';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { UserActivitiesType } from '../../services/mmkv.service';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';

interface props {
  data: Castle[];
  onIndexChange: (index: number) => void;
  scrollX: SharedValue<number>;
}

const ITEM_WIDTH = wp(85);

interface CarouselItemProps {
  item: Castle;
  index: number;
  scrollX: SharedValue<number>;
  progress: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  item,
  index,
  scrollX,
  progress,
}) => {
  const navigation = useNavigation<StackNavigationProps<typeof ROUTES.HOME>>();

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

  return (
    <View style={styles.pageContainer}>
      {/* activityCard */}
      <View
        style={[
          styles.activityCard,
          { borderColor: activityCardData.darkColor },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: activityCardData.lightColor,
              borderColor: activityCardData.darkColor,
            },
          ]}
        >
          <Text style={styles.icon}>{activityCardData.icon}</Text>
        </View>
        <View style={styles.contentSection}>
          <Text
            style={[
              styles.cardTitleText,
              { color: activityCardData.darkColor },
            ]}
          >
            {activityCardData.cardTitle}
          </Text>
          <Text style={styles.descText}>{activityCardData.shortDes}</Text>
          <ProgressBar progress={progress} />
          <Text
            style={[
              styles.tagText,
              {
                backgroundColor: activityCardData.lightColor,
                color: activityCardData.midColor,
              },
            ]}
          >
            {activityCardData.tag}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.cardBtnContainer,
            {
              backgroundColor: activityCardData.darkColor,
              borderColor: activityCardData.lightColor,
            },
          ]}
          onPress={() => {
            if (item.innerCard.navigate) {
              navigation.navigate(item.innerCard.navigate, {
                data: activityCardData,
              });
            }
          }}
        >
          <FontAwesome6 name="play" iconStyle="solid" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.singlePage}>
        <View style={styles.singlePageContent}>
          <Animated.Image
            source={item.image}
            style={[styles.imgContainer, animatedStyle]}
          />
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
  const { progressData } = useActivityProContext();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
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
        paddingHorizontal: wp(7.5),
      }}
      onScroll={scrollHandler}
      onMomentumScrollEnd={event => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / ITEM_WIDTH,
        );
        onIndexChange(index);
      }}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const itemProgressData =
          progressData[item.title.toLowerCase() as keyof UserActivitiesType];
        return (
          <CarouselItem
            item={item}
            index={index}
            scrollX={scrollX}
            progress={itemProgressData ?? 0}
          />
        );
      }}
    />
  );
};

export default CastleCarousel;
