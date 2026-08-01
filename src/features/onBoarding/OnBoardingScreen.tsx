import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  onBoardingSlidesData,
  OnBoardingSlideType,
} from './data/onBoarding.data';
import LinearGradient from 'react-native-linear-gradient';
import { wp } from '../../utils/responsive';
import CustomButton from '../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import StorageService from '../../services/mmkv.service';
import { STORAGE_KEYS } from '../../config/constants';
import { styles } from './OnBoarding.styles';
import Dot from '../../components/siderDot/Dot';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const OnBoardingScreen = () => {
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.ONBOARDING>>();

  const flatListRef = useRef<Animated.FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem: ListRenderItem<OnBoardingSlideType> = ({ item, index }) => {
    return (
      <LinearGradient
        colors={[item.topColor, item.bottomColor]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.singleSlide}
      >
        <View style={styles.slideCard}>
          <View style={styles.badgeSection}>
            <Text style={styles.badgeIconSection}>{item.badgeIcon}</Text>
            <Text style={styles.badgeText}>{item.badgeText.toUpperCase()}</Text>
          </View>
          <View style={styles.cardImgContainer}>
            <Image source={item.image} style={styles.cardImg} />
          </View>
          <Text style={styles.cardTitleText}>{item.title}</Text>
          <Text style={styles.cardDescriptionText}>{item.description}</Text>
        </View>
      </LinearGradient>
    );
  };

  const handleNext = (): void => {
    if (currentIndex < onBoardingSlidesData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      StorageService.setIsOnBoarding(STORAGE_KEYS.IS_ONBORDING, true);
      navigation.replace(ROUTES.HOME);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        ref={flatListRef}
        data={onBoardingSlidesData}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / wp(100));
          setCurrentIndex(index);
        }}
        renderItem={renderItem}
      />
      <View style={styles.dotContainer}>
        {onBoardingSlidesData.map((item, index) => (
          <Dot key={item.id} index={index} scrollX={scrollX} />
        ))}
      </View>
      {currentIndex !== 2 && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => {
            StorageService.setIsOnBoarding(STORAGE_KEYS.IS_ONBORDING, true),
              navigation.replace(ROUTES.HOME);
          }}
        >
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>
      )}

      <View style={styles.actionNextBtn}>
        <CustomButton
          width={wp(90)}
          colors={['#ff7b38', '#ff6425']}
          bottomBorderColor="#d84e16"
          onPress={handleNext}
        >
          <Text style={styles.btnText}>
            {currentIndex == 2 ? 'Start Adventure' : 'Next'}
          </Text>
          <FontAwesome6
            name="caret-right"
            iconStyle="solid"
            size={23}
            color="#fff"
            style={styles.btnIcon}
          />
        </CustomButton>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
