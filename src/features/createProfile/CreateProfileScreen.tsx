import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useProfilesContext from '../../app/contexts/profiles/useProfiles';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import ProfileForm from '../../components/profileForm/ProfileForm';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import { NewProfileType } from '../../services/profile.service';
import TTSService from '../../services/tts.service';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';

// shown once after onboarding: the first kid must be named before playing
const CreateProfileScreen = () => {
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.CREATE_PROFILE>>();
  const { activeProfile, completeSetup } = useProfilesContext();
  const { rewards } = useRewardsContext();
  // players updating from before profiles already have stars on this kid
  const hasSavedProgress = rewards.totalEarned > 0;

  const handleCreate = (profile: NewProfileType) => {
    completeSetup(profile);
    TTSService.speak(`Welcome ${profile.name}! Let's start learning!`);
    navigation.replace(ROUTES.HOME);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.wave}>👋</Text>
          <ScreenHeadingSection
            heading="Who's learning?"
            subText={
              hasSavedProgress
                ? 'Your stars and stickers are safe! Just tell us who is playing.'
                : "Let's make a profile for your little learner."
            }
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.card}
        >
          <ProfileForm
            initial={{
              avatar: activeProfile.avatar,
              color: activeProfile.color,
            }}
            submitLabel="Let's play!"
            onSubmit={handleCreate}
          />
        </Animated.View>

        <Text style={styles.footnote}>
          Grown-ups can add more kids later from Settings → Parent Dashboard.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4eee2',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  wave: { fontSize: 44 },
  card: {
    backgroundColor: '#fbf4e4',
    borderColor: '#d9a441',
    borderWidth: 2,
    borderBottomWidth: 10,
    borderRadius: 30,
    padding: 20,
  },
  footnote: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 12,
    color: '#9e9e9e',
    textAlign: 'center',
  },
});
