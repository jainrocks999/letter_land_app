import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ProgressBar from '../progressBar/ProgressBar';
import { ActivityCard } from '../../features/home/data/home.data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import { ActivitiesKey } from '../../services/mmkv.service';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import StarCounterStatic from '../starCounter/StarCounterStatic';
import { rf } from '../../utils/responsive';

interface CustomTopbarProps {
  data: ActivityCard;
  progress?: number;
}

const CustomTopbar: React.FC<CustomTopbarProps> = ({ data, progress }) => {
  const { updateProgress } = useActivityProContext();
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.LEARNING>>();
  const handleGoback = () => {
    // console.log(data.navigate?.toLowerCase(), progress);
    updateProgress({
      key: data.navigate?.toLowerCase() as ActivitiesKey,
      progress: progress ?? 0,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={handleGoback} hitSlop={8}>
        <FontAwesome6 name="xmark" iconStyle="solid" size={rf(30)} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        {progress != null && (
          <ProgressBar progress={progress} bgColor="#ffffffcc" />
        )}
      </View>
      <StarCounterStatic />
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
    gap: rf(12),
    paddingTop: rf(10),
  },
  badgeContainer: {
    paddingVertical: rf(10),
    paddingHorizontal: rf(15),
    borderWidth: 1,
    borderBottomWidth: rf(7),
    borderRadius: rf(10),
  },
  badgeIcon: { fontSize: rf(18) },
});
