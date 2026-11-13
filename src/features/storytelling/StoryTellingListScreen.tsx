import { Image, View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { ROUTES } from '../../app/navigation/routeNames';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StackNavigationProps,
  StackRouteProps,
} from '../../types/navigation.types';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
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
  storyData,
  getStoriesByLevel,
  getStoryLevelInfo,
} from './data/storytelling.data';

const StoryTellingListScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.STORYTELLINGLIST>>();
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.STORYTELLINGLIST>>();
  const { data } = route.params;
  const { rewards } = useRewardsContext();
  const [activeLevel, setActiveLevel] = useState<StoryLevel>(1);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);

  const levelInfo = getStoryLevelInfo(activeLevel);
  const levelStories = getStoriesByLevel(activeLevel);
  const isStoryComplete = (storyId: string) =>
    (rewards.activityRuns[`story-${storyId}`] ?? 0) > 0;
  // completed stories show a full bar, otherwise show how far the child got
  const getStoryProgress = (storyId: string) =>
    isStoryComplete(storyId)
      ? 100
      : Math.min(99, rewards.storyProgress?.[storyId] ?? 0);
  // topbar tracks the whole Story Time journey, not just the open level
  const overallProgress = storyData.length
    ? Math.round(
        storyData.reduce(
          (total, story) => total + getStoryProgress(story.id),
          0,
        ) / storyData.length,
      )
    : 0;
  const completedStories = levelStories.filter(story =>
    isStoryComplete(story.id),
  );
  const firstIncompleteStory = levelStories.find(
    story => !isStoryComplete(story.id),
  );
  const currentStoryIndex = levelStories.findIndex(
    story => story.id === currentStoryId,
  );
  const currentStory =
    currentStoryIndex >= 0 ? levelStories[currentStoryIndex] : undefined;
  // keep showing the story the child opened until it is finished
  let featuredStory = currentStory ?? firstIncompleteStory ?? levelStories[0];

  if (currentStory && isStoryComplete(currentStory.id) && levelStories.length) {
    // the current story is done, so feature the next unfinished story
    const nextStory = levelStories
      .slice(currentStoryIndex + 1)
      .find(story => !isStoryComplete(story.id));
    featuredStory =
      nextStory ??
      levelStories.find(story => !isStoryComplete(story.id)) ??
      levelStories[(currentStoryIndex + 1) % levelStories.length];
  }

  const allStoriesComplete =
    levelStories.length > 0 &&
    levelStories.every(story => isStoryComplete(story.id));
  const levelProgress = levelStories.length
    ? Math.round((completedStories.length / levelStories.length) * 100)
    : 0;
  const featuredTag = allStoriesComplete
    ? 'Read again'
    : currentStory && isStoryComplete(currentStory.id)
    ? 'Next story'
    : 'Keep reading';

  const openStory = (storyId: string) => {
    setCurrentStoryId(storyId);
    navigation.navigate(ROUTES.STORYTELLINGREAD, { data, storyId });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: `${data.lightColor}33` }]}
      contentContainerStyle={styles.scrollContainer}
    >
      <CustomTopbar data={data} progress={overallProgress} />
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
              {featuredTag}
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
            <ProgressBar progress={levelProgress} bgColor="#ffffffcc" />
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
            progress={getStoryProgress(item.id)}
            onPress={() => openStory(item.id)}
          />
        )}
      />
    </ScrollView>
  );
};

export default StoryTellingListScreen;
