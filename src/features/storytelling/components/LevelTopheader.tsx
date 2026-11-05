import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ActionButton from '../../../components/customButton/ActionButton';
import { ActivityCard } from '../../home/data/home.data';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface LevelTopheaderProps {
  data: ActivityCard;
}

const LevelTopheader = ({ data }: LevelTopheaderProps) => {
  const renderItem = ({ item }: { item: (typeof LevelData)[0] }) => (
    <ActionButton
      bottomBorderWidth={0}
      radius={50}
      backgroundColor={ item.active?data.darkColor:`${data.lightColor}4D`}
      bottomBorderColor={`${data.midColor}00`}
      onPress={() => {
        if (item.isLock) return;
      }}
      styles={[styles.itemButton, { borderColor: data.lightColor }]}
    >
      {item.isLock && (
        <FontAwesome6
          name="lock"
          iconStyle="solid"
          size={16}
          color={`${data.midColor}99`}
        />
      )}
      <Text style={[styles.listText, { color: item.active?data.lightColor:`${data.midColor}99` }]}>
        {item.lable}
      </Text>
    </ActionButton>
  );

  return (
    <FlatList
      data={LevelData}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.listContainer]}
      renderItem={renderItem}
    />
  );
};

export default LevelTopheader;

const LevelData = [
  { lable: 'Level 1', isLock: false,active:true},
  { lable: 'Level 2', isLock: false,active:false },
  { lable: 'Level 3', isLock: true,active:false},
];

const styles = StyleSheet.create({
  listContainer: {
    gap: 10,
    height: 45,
  },
  itemButton: {
    borderWidth: 2.5,
    height: '100%',
    width: 108,
  },
  listText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 15,
  },
});
