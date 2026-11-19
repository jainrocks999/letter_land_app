import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../../components/customButton/ActionButton';
import { ActivityCard } from '../../home/data/home.data';
import { StoryLevel, StoryLevelInfo } from '../data/storytelling.data';
import { rf } from '../../../utils/responsive';

interface LevelTopheaderProps {
  data: ActivityCard;
  levels: StoryLevelInfo[];
  activeLevel: StoryLevel;
  onSelectLevel: (level: StoryLevel) => void;
  unlockedLevels: StoryLevel[];
}

const LevelTopheader = ({
  data,
  levels,
  activeLevel,
  onSelectLevel,
  unlockedLevels,
}: LevelTopheaderProps) => {
  const renderItem = ({ item }: { item: StoryLevelInfo }) => {
    const isUnlocked = unlockedLevels.includes(item.level);
    const isActive = item.level === activeLevel && isUnlocked;
    const textColor = isActive
      ? data.lightColor
      : isUnlocked
      ? `${data.midColor}99`
      : '#9e9e9e';

    return (
      <ActionButton
        bottomBorderWidth={0}
        radius={50}
        backgroundColor={
          isActive
            ? data.darkColor
            : isUnlocked
            ? `${data.lightColor}4D`
            : '#e0e0e0'
        }
        bottomBorderColor={`${data.midColor}00`}
        onPress={() => {
          if (isUnlocked) onSelectLevel(item.level);
        }}
        styles={[styles.itemButton, { borderColor: data.lightColor }]}
      >
        <View style={styles.itemContent}>
          {!isUnlocked && (
            <FontAwesome6
              name="lock"
              iconStyle="solid"
              size={rf(12)}
              color={textColor}
            />
          )}
          <Text style={[styles.listText, { color: textColor }]}>
            {item.label}
          </Text>
        </View>
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
    gap: rf(10),
    height: rf(45),
  },
  itemButton: {
    borderWidth: rf(2.5),
    height: '100%',
    width: rf(108),
    borderRadius: rf(50),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rf(6),
  },
  listText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(15),
  },
});
