import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import ProfileSwitcherModal from '../../components/profileSwitcher/ProfileSwitcherModal';
import useProfilesContext from '../../app/contexts/profiles/useProfiles';

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const { activeProfile } = useProfilesContext();
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
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={[
              styles.profileBtn,
              { backgroundColor: `${activeProfile.color}CC`},
            ]}
            onPress={() => setShowProfiles(true)}
          >
            <Text style={styles.profileEmoji}>{activeProfile.avatar}</Text>
          </TouchableOpacity>
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
      </View>
      <CloudsContainer scrollX={scrollX} />

      <CastleCarousel
        data={activityData}
        onIndexChange={setCurrentIndex}
        scrollX={scrollX}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <ProfileSwitcherModal
        visible={showProfiles}
        onClose={() => setShowProfiles(false)}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
  profileBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: 7,
    borderColor: '#00000033',
    paddingVertical:5,
    paddingHorizontal:8,
  },
  profileEmoji: { fontSize: 26 },
  settingsBtn: {
    backgroundColor: '#54c507',
    padding: 13,
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: 7,
    borderColor: '#429509',
  },
});
