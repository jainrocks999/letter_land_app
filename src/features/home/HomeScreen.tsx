import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import CloudsContainer from '../../components/cloudsContainer/CloudsContainer';
import CastleCarousel from '../../components/castleCarousel/CastleCarousel';
import { activityData, isActivityLocked, LOCKED_SKY_COLORS } from './data/home.data';
import AnimatedGradient from '../../components/animatedGradient/AnimatedGradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import StarCounter from '../../components/starCounter/StarCounter';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import SettingsModal from '../../components/settingsModal/SettingsModal';
import ProfileSwitcherModal from '../../components/profileSwitcher/ProfileSwitcherModal';
import useProfilesContext from '../../app/contexts/profiles/useProfiles';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import { isTablet, rf } from '../../utils/responsive';

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const { activeProfile } = useProfilesContext();
  const { rewards } = useRewardsContext();
  const scrollX = useSharedValue(0);
  const navigation = useNavigation<StackNavigationProps<typeof ROUTES.HOME>>();
  const collectedStickers = rewards.unlockedStickers.length;

  return (
    <View style={{ flex: 1 }}>
      {activityData.map((castle, index) => (
        <AnimatedGradient
          key={castle.id ?? index}
          index={index}
          scrollX={scrollX}
          colors={
            isActivityLocked(castle.innerCard, collectedStickers)
              ? LOCKED_SKY_COLORS
              : [castle.topSkyCol, castle.bottomSkyCol]
          }
        />
      ))}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={[
              styles.profileBtn,
              { backgroundColor: `${activeProfile.color}CC` },
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
          <FontAwesome6
            name="gear"
            iconStyle="solid"
            size={rf(23)}
            color="#fff"
          />
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
    paddingHorizontal: isTablet() ? rf(24) : rf(10),
    paddingVertical: isTablet() ? rf(16) : rf(10),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rf(10),
  },
  treasureBtn: {
    backgroundColor: '#ff7b38',
    padding: rf(8),
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: rf(7),
    borderColor: '#d84e16',
  },
  treasureIcon: { fontSize: rf(22) },
  profileBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: rf(7),
    borderColor: '#00000033',
    paddingVertical: isTablet() ? rf(8) : rf(5),
    paddingHorizontal: isTablet() ? rf(12) : rf(8),
  },
  profileEmoji: { fontSize: rf(26) },
  settingsBtn: {
    backgroundColor: '#54c507',
    padding: rf(13),
    borderRadius: 999,
    borderWidth: 2,
    borderBottomWidth: rf(7),
    borderColor: '#429509',
  },
});
