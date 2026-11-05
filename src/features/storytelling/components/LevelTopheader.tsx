import { FlatList, StyleSheet, Text } from 'react-native';
import React from 'react';
import ActionButton from '../../../components/customButton/ActionButton';
import { ActivityCard } from '../../home/data/home.data';
import { StoryLevel, StoryLevelInfo } from '../data/storytelling.data';

interface LevelTopheaderProps {
  data: ActivityCard;
  levels: StoryLevelInfo[];
  activeLevel: StoryLevel;
  onSelectLevel: (level: StoryLevel) => void;
}

const LevelTopheader = ({
  data,
  levels,
  activeLevel,
  onSelectLevel,
}: LevelTopheaderProps) => {
  const renderItem = ({ item }: { item: StoryLevelInfo }) => {
    const isActive = item.level === activeLevel;

    return (
      <ActionButton
        bottomBorderWidth={0}
        radius={50}
        backgroundColor={isActive ? data.darkColor : `${data.lightColor}4D`}
        bottomBorderColor={`${data.midColor}00`}
        onPress={() => onSelectLevel(item.level)}
        styles={[styles.itemButton, { borderColor: data.lightColor }]}
      >
        <Text
          style={[
            styles.listText,
            { color: isActive ? data.lightColor : `${data.midColor}99` },
          ]}
        >
          {item.label}
        </Text>
      </ActionButton>
    );
  };

  return (
    <FlatList
      data={levels}
      horizontal
      keyExtractor={item => item.level.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
    />
  );
};

export default LevelTopheader;

const styles = StyleSheet.create({
  listContainer: {
    gap: 10,
    height: 45,
  },
  itemButton: {
    borderWidth: 2.5,
    height: '100%',
    width: 108,
    borderRadius: 50,
  },
  listText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 15,
  },
});
