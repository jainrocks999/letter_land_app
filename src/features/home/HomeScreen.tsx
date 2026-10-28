import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import CloudsContainer from '../../components/cloudsContainer/CloudsContainer';
import CastleCarousel from '../../components/castleCarousel/CastleCarousel';
import { activityData } from './data/home.data';
import AnimatedGradient from '../../components/animatedGradient/AnimatedGradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import StarCounter from '../../components/starCounter/StarCounter';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import SettingsModal from '../../components/settingsModal/SettingsModal';

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const scrollX = useSharedValue(0);
  const navigation = useNavigation<StackNavigationProps<typeof ROUTES.HOME>>();

  return (
    <View style={{ flex: 1 }}>
      {activityData.map((castle, index) => (
        <AnimatedGradient
          key={castle.id ?? index}
          index={index}
          scrollX={scrollX}
          colors={[castle.topSkyCol, castle.bottomSkyCol]}
        />
      ))}
      <View style={styles.rewardsRow}>
        <StarCounter
          size="large"
          data={activityData[currentIndex]}
          onPress={() => navigation.navigate(ROUTES.REWARDS)}
        />
      </View>
      <TouchableOpacity
        style={styles.settingsBtn}
        onPress={() => setShowSettings(true)}
      >
        <FontAwesome6 name="gear" iconStyle="solid" size={23} color="#fff" />
      </TouchableOpacity>
      <CloudsContainer scrollX={scrollX} />

      <CastleCarousel
        data={activityData}
        // currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        scrollX={scrollX}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  rewardsRow: {
    top: 15,
    left: 15,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  treasureBtn: {
    backgroundColor: '#ff7b38',
    padding: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: 7,
    borderColor: '#d84e16',
  },
  treasureIcon: { fontSize: 22 },
  settingsBtn: {
    top: 15,
    right: 15,
    backgroundColor: '#54c507',
    padding: 13,
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: 7,
    borderColor: '#429509',
    zIndex: 1,
  },
});
