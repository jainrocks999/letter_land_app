import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { ActivityCard } from '../../home/data/home.data';
import { ROUTES } from '../../../app/navigation/routeNames';
import { StackNavigationProps } from '../../../types/navigation.types';
import StarCounterStatic from '../../../components/starCounter/StarCounterStatic';

interface TopBarReadProps {
  data: ActivityCard;
  storyTitle: {
    title?: string;
    subText?: string;
  };
}

const TopBarRead: React.FC<TopBarReadProps> = ({ data, storyTitle }) => {
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.STORYTELLINGLIST>>();

  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome6 name="xmark" iconStyle="solid" size={30} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.titleText}>
          {storyTitle.title ?? 'Story Time'}
        </Text>
        {!!storyTitle.subText && (
          <Text style={[styles.secondryText, { color: data.darkColor }]}>
            {storyTitle.subText}
          </Text>
        )}
      </View>
      <StarCounterStatic />
    </View>
  );
};

export default TopBarRead;

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 22,
    color: '#1a105f',
  },
  secondryText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
  },
});
