import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { ActivityCard } from '../../home/data/home.data';

interface StoryCardProps {
  data: ActivityCard;
}

const StoryCard = ({ data }: StoryCardProps) => {
  return (
    <TouchableOpacity style={[styles.storyCard, { borderColor: data.lightColor }]}>
      <View style={{ backgroundColor: 'red', height: 140 }} />
      <View style={{ padding: 10 }}>
        <Text style={[styles.bannerTitle, { fontSize: 18 }]}>Sam the Cat</Text>
        <Text style={[styles.secondryText, { color: data.darkColor }]}>
          cat · hat · mat
        </Text>
        <View style={styles.starRow}>
          <FontAwesome6
            name="star"
            iconStyle="regular"
            color={`${data.midColor}99`}
            style={styles.starSize}
          />
          <FontAwesome6
            name="star"
            iconStyle="regular"
            color={`${data.midColor}99`}
            style={styles.starSize}
          />
          <FontAwesome6
            name="star"
            iconStyle="regular"
            color={`${data.midColor}99`}
            style={styles.starSize}
          />
        </View>
      </View>
      <Text style={[styles.cardTagText, { color: data.midColor }]}>
        short a
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
  secondryText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#faf4f2',
  },
  storyCard: {
    width: '48%',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderBottomWidth: 6,
    overflow: 'hidden',
  },
  cardTagText: {
    position: 'absolute',
    backgroundColor: '#ffff',
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignSelf: 'flex-start',
    margin: 10,
  },
  starRow: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 5,
  },
  starSize: {
    fontSize: 15,
  },
});
