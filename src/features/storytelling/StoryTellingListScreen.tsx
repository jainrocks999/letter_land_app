import { Image, View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StackNavigationProps,
  StackRouteProps,
} from '../../types/navigation.types';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import { styles } from './StoryTelling.styles';
import ActionButton from '../../components/customButton/ActionButton';
import LevelTopheader from './components/LevelTopheader';
import ProgressBar from '../../components/progressBar/ProgressBar';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { FlatList } from 'react-native-gesture-handler';
import StoryCard from './components/StoryCard';
import {
  STORY_LEVELS,
  StoryLevel,
  getStoriesByLevel,
  getStoryLevelInfo,
} from './data/storytelling.data';

const StoryTellingListScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.STORYTELLINGLIST>>();
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.STORYTELLINGLIST>>();
  const { data } = route.params;
  const [activeLevel, setActiveLevel] = useState<StoryLevel>(1);

  const levelInfo = getStoryLevelInfo(activeLevel);
  const levelStories = getStoriesByLevel(activeLevel);
  const featuredStory = levelStories[0];

  const openStory = (storyId: string) =>
    navigation.navigate(ROUTES.STORYTELLINGREAD, { data, storyId });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: `${data.lightColor}33` }]}
      contentContainerStyle={styles.scrollContainer}
    >
      <CustomTopbar data={data} />
      <ScreenHeadingSection
        heading="Story Time"
        subText="Read, sound out and spell with Buddy!"
      />
      <View>
        <LevelTopheader
          data={data}
          levels={STORY_LEVELS}
          activeLevel={activeLevel}
          onSelectLevel={setActiveLevel}
        />
      </View>
      {featuredStory && (
        <View
          style={[
            styles.banner,
            {
              borderColor: data.darkColor,
              backgroundColor: `${data.darkColor}4d`,
            },
          ]}
        >
          <Image
            source={featuredStory.banner}
            resizeMode="cover"
            style={[styles.bannerImage, { backgroundColor: data.lightColor }]}
          />
          <View style={styles.bannerContent}>
            <Text
              style={[
                styles.tagText,
                { backgroundColor: data.lightColor, color: data.darkColor },
              ]}
            >
              Keep reading
            </Text>

            <Text numberOfLines={1} style={styles.bannerTitle}>
              {featuredStory.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.secondryText, { color: data.darkColor }]}
            >
              Sound: {featuredStory.sound}
            </Text>
            <ProgressBar progress={0} bgColor="#ffffffcc" />
          </View>

          <ActionButton
            bottomBorderWidth={5}
            radius={50}
            backgroundColor={data.darkColor}
            bottomBorderColor={'#a43726'}
            onPress={() => {
              openStory(featuredStory?.id);
            }}
          >
            <FontAwesome6
              name="play"
              iconStyle="solid"
              size={16}
              color={'#a43726'}
            />
          </ActionButton>
        </View>
      )}
      <View style={styles.levelHeaderRow}>
        <Text style={[styles.bannerTitle, { color: data.darkColor }]}>
          {`${levelInfo.label} · ${levelInfo.subtitle}`}
        </Text>
        <Text style={[styles.secondryText, styles.storiesCounter]}>
          {`${levelStories.length} ${
            levelStories.length === 1 ? 'story' : 'stories'
          }`}
        </Text>
      </View>

      <FlatList
        data={levelStories}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.storyColumnWrapper}
        contentContainerStyle={styles.storyListContent}
        renderItem={({ item }) => (
          <StoryCard
            data={data}
            story={item}
            onPress={() => openStory(item.id)}
          />
        )}
      />
    </ScrollView>
  );
};

export default StoryTellingListScreen;
