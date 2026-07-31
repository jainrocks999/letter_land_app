import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ProgressBar from '../progressBar/ProgressBar';
import { ActivityCard } from '../../features/home/data/home.data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProps } from '../../types/navigation';
import { ROUTES } from '../../app/navigation/routeNames';
import { ActivitiesKey } from '../../services/mmkv.service';
import { STORAGE_KEYS } from '../../config/constants';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';

interface CustomTopbarProps {
  data: ActivityCard;
  progress: number;
}

const CustomTopbar: React.FC<CustomTopbarProps> = ({ data, progress }) => {
  const { updateProgress } = useActivityProContext();
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.LEARNING>>();
  const handleGoback = () => {
    updateProgress({
      // key: STORAGE_KEYS.PERFORMANCE.LEARNING as ActivitiesKey,
      key: data.navigate?.toLowerCase() as ActivitiesKey,
      progress: progress,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={handleGoback}>
        <FontAwesome6 name="xmark" iconStyle="solid" size={30} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <ProgressBar progress={progress} bgColor="#ffffffcc" />
      </View>
      <View
        style={[
          styles.badgeContainer,
          { backgroundColor: data.lightColor, borderColor: data.darkColor },
        ]}
      >
        <Text style={styles.badgeIcon}>{data.icon}</Text>
      </View>
    </View>
  );
};

export default CustomTopbar;

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // gap: 10,
    gap: 20,
    paddingTop: 10,
  },
  badgeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 10,
  },
  badgeIcon: { fontSize: 18 },
});
