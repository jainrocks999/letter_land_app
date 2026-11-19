import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ActivityCard } from '../../home/data/home.data';
import { Story } from '../data/storytelling.data';
import ProgressBar from '../../../components/progressBar/ProgressBar';
import { isTablet, rf } from '../../../utils/responsive';

interface StoryCardProps {
  data: ActivityCard;
  story: Story;
  progress?: number;
  onPress?: () => void;
}
const tablet = isTablet();

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
    fontSize: rf(20),
    color: '#1a105f',
  },
  cardTitle: {
    fontSize: rf(18),
  },
  secondryText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: rf(14),
  },
  storyCard: {
    width: '48%',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: rf(20),
    borderBottomWidth: rf(6),
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: rf(tablet ? 220 : 120),
  },
  cardBody: {
    padding: rf(10),
  },
  cardTagText: {
    position: 'absolute',
    maxWidth: '82%',
    fontFamily: 'Fredoka-SemiBold',
    fontSize: rf(13),
    paddingVertical: rf(2),
    paddingHorizontal: rf(8),
    borderRadius: rf(50),
    margin: rf(8),
  },
  cardProgress: {
    paddingVertical: rf(5),
  },
});
