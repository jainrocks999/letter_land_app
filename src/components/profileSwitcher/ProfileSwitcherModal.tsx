import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import useProfilesContext from '../../app/contexts/profiles/useProfiles';
import TTSService from '../../services/tts.service';
import ParentGate from '../settingsModal/components/ParentGate';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';

interface ProfileSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

// kids pick who is playing; adding or editing kids stays behind the parent gate
const ProfileSwitcherModal: React.FC<ProfileSwitcherModalProps> = ({
  visible,
  onClose,
}) => {
  const { profiles, activeProfileId, switchProfile } = useProfilesContext();
  const navigation = useNavigation<StackNavigationProps<typeof ROUTES.HOME>>();
  const [showGate, setShowGate] = useState(false);

  const handleClose = () => {
    setShowGate(false);
    onClose();
  };

  const handlePick = (profileId: string, name: string) => {
    if (profileId !== activeProfileId) {
      switchProfile(profileId);
      TTSService.speak(`Hi ${name}! Let's play!`);
    }
    handleClose();
  };

  const handleOpenDashboard = () => {
    handleClose();
    navigation.navigate(ROUTES.PARENT_DASHBOARD);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {showGate ? 'Parents' : "Who's playing?"}
            </Text>
            <TouchableOpacity onPress={handleClose} hitSlop={10}>
              <FontAwesome6
                name="xmark"
                iconStyle="solid"
                size={26}
                color="#1a105f"
              />
            </TouchableOpacity>
          </View>

          {showGate ? (
            <ParentGate
              message="Adding and editing kids is for grown-ups. Solve this to open the parent dashboard:"
              onConfirm={handleOpenDashboard}
              onCancel={() => setShowGate(false)}
            />
          ) : (
            <Animated.View entering={FadeIn.duration(250)}>
              <View style={styles.grid}>
                {profiles.map((profile, index) => {
                  const isActive = profile.id === activeProfileId;
                  return (
                    <Animated.View
                      key={profile.id}
                      entering={ZoomIn.delay(index * 60)
                        .springify()
                        .damping(12)}
                      style={styles.gridItem}
                    >
                      <TouchableOpacity
                        onPress={() => handlePick(profile.id, profile.name)}
                        style={[
                          styles.kid,
                          isActive && {
                            borderColor: profile.color,
                            backgroundColor: `${profile.color}22`,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.avatar,
                            { backgroundColor: profile.color },
                          ]}
                        >
                          <Text style={styles.avatarEmoji}>
                            {profile.avatar}
                          </Text>
                        </View>
                        <Text style={styles.name} numberOfLines={1}>
                          {profile.name}
                        </Text>
                        {isActive && (
                          <View
                            style={[
                              styles.check,
                              { backgroundColor: profile.color },
                            ]}
                          >
                            <FontAwesome6
                              name="check"
                              iconStyle="solid"
                              size={11}
                              color="#fff"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.parentBtn}
                onPress={() => setShowGate(true)}
              >
                <FontAwesome6
                  name="user-shield"
                  iconStyle="solid"
                  size={14}
                  color="#1a7cab"
                />
                <Text style={styles.parentText}>Add or manage kids</Text>
                <FontAwesome6
                  name="lock"
                  iconStyle="solid"
                  size={11}
                  color="#1a7cab"
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ProfileSwitcherModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: '#f4eee2',
    borderColor: '#d9a441',
    borderWidth: 2,
    borderBottomWidth: 10,
    borderRadius: 30,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#1a105f',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  gridItem: { width: '30%' },
  kid: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderColor: '#f3d27a',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: { fontSize: 34 },
  name: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 14,
    color: '#1a105f',
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    paddingVertical: 8,
  },
  parentText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#1a7cab',
    textDecorationLine: 'underline',
  },
});
