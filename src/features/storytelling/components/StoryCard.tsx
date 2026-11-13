import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ActivityCard } from '../../home/data/home.data';
import { Story } from '../data/storytelling.data';
import ProgressBar from '../../../components/progressBar/ProgressBar';

interface StoryCardProps {
  data: ActivityCard;
  story: Story;
  progress?: number;
  onPress?: () => void;
}

const StoryCard = ({ data, story, progress = 0, onPress }: StoryCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.storyCard, { borderColor: data.lightColor }]}
    >
      <Image
        source={story.banner}
        resizeMode="cover"
        style={[styles.cardImage, { backgroundColor: data.lightColor }]}
      />
      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={[styles.bannerTitle, styles.cardTitle]}>
          {story.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.secondryText, { color: data.darkColor }]}
        >
          {story.words.slice(0, 3).join(' · ')}
        </Text>
        <View style={styles.cardProgress}>
          <ProgressBar progress={progress} bgColor={`${data.lightColor}99`} />
        </View>
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.cardTagText,
          { color: data.midColor, backgroundColor: data.lightColor },
        ]}
      >
        {story.sound}
      </Text>
    </TouchableOpacity>
  );
};

export default StoryCard;

const styles = StyleSheet.create({
  bannerTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#1a105f',
  },
  cardTitle: {
    fontSize: 18,
  },
  secondryText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
  },
  storyCard: {
    width: '48%',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderBottomWidth: 6,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardBody: {
    padding: 10,
  },
  cardTagText: {
    position: 'absolute',
    maxWidth: '82%',
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 13,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
    margin: 8,
  },
  cardProgress: {
    paddingVertical: 5,
  },
});
