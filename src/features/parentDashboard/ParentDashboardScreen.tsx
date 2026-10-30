import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, { FadeIn } from 'react-native-reanimated';
import useProfilesContext from '../../app/contexts/profiles/useProfiles';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import { MAX_PROFILES } from '../../config/constants';
import { NewProfileType, ProfileType } from '../../services/profile.service';
import TTSService from '../../services/tts.service';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import CustomButton from '../../components/customButton/CustomButton';
import { stickersData } from '../rewards/data/rewards.data';
import { formatDuration, getKidReport } from './data/dashboard.helpers';
import WeeklyChart from './components/WeeklyChart';
import ActivityReportCard from './components/ActivityReportCard';
import ProfileEditorModal from './components/ProfileEditorModal';
import { styles } from './ParentDashboard.styles';

type EditorState = { profile: ProfileType | null } | null;

const ParentDashboardScreen = () => {
  const navigation = useNavigation();
  const {
    profiles,
    activeProfileId,
    addProfile,
    updateProfile,
    removeProfile,
    switchProfile,
  } = useProfilesContext();
  // the active kid's live data, so the report refreshes right after they play
  const { rewards } = useRewardsContext();
  const { progressData } = useActivityProContext();
  const [selectedId, setSelectedId] = useState(activeProfileId);
  const [editor, setEditor] = useState<EditorState>(null);

  const selected =
    profiles.find(profile => profile.id === selectedId) ?? profiles[0];
  const isActive = selected.id === activeProfileId;

  const report = useMemo(
    () => getKidReport(selected.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected.id, rewards, progressData],
  );

  const summary = [
    {
      icon: '⭐',
      value: report.rewards.totalEarned,
      label: 'Stars earned',
    },
    {
      icon: '⏱',
      value: formatDuration(report.totalTime),
      label: 'Time played',
    },
    {
      icon: '🎯',
      value: report.accuracy === null ? '–' : `${report.accuracy}%`,
      label: 'Accuracy',
    },
    {
      icon: '🔥',
      value: `${report.activeDays}/7`,
      label: 'Days active',
    },
    {
      icon: '🏆',
      value: `${report.rewards.trophies.length}/${report.activities.length}`,
      label: 'Trophies',
    },
    {
      icon: '🐣',
      value: `${report.rewards.unlockedStickers.length}/${stickersData.length}`,
      label: 'Stickers',
    },
  ];

  const insights = [
    report.strongest && {
      icon: '💪',
      title: 'Strongest',
      text: `${report.strongest.card.cardTitle} · ${report.strongest.accuracy}% right`,
    },
    report.needsPractice && {
      icon: '🌱',
      title: 'Needs practice',
      text: `${report.needsPractice.card.cardTitle} · ${report.needsPractice.accuracy}% right`,
    },
    report.notTried.length > 0 && {
      icon: '🧭',
      title: 'Not tried yet',
      text: report.notTried.map(activity => activity.card.cardTitle).join(', '),
    },
  ].filter(Boolean) as { icon: string; title: string; text: string }[];

  const handleSaveProfile = (data: NewProfileType) => {
    if (editor?.profile) {
      updateProfile(editor.profile.id, data);
    } else {
      const created = addProfile(data);
      setSelectedId(created.id);
    }
    setEditor(null);
  };

  const handleSwitch = () => {
    switchProfile(selected.id);
    TTSService.speak(`Hi ${selected.name}! Let's play!`);
  };

  const handleDelete = () => {
    Alert.alert(
      `Delete ${selected.name}?`,
      `All of ${selected.name}'s stars, stickers, trophies and progress will be erased. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeProfile(selected.id);
            setSelectedId(
              profiles.find(profile => profile.id !== selected.id)?.id ??
                activeProfileId,
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="xmark" iconStyle="solid" size={30} />
        </TouchableOpacity>
        <View style={styles.lockBadge}>
          <FontAwesome6
            name="user-shield"
            iconStyle="solid"
            size={14}
            color="#1a7cab"
          />
          <Text style={styles.lockBadgeText}>Grown-ups</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeadingSection
          heading="Parent Dashboard"
          subText="Manage kid profiles and see how each one is learning."
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.profilesRow}
        >
          {profiles.map(profile => {
            const isSelected = profile.id === selected.id;
            return (
              <TouchableOpacity
                key={profile.id}
                onPress={() => setSelectedId(profile.id)}
                style={[
                  styles.profileChip,
                  isSelected && {
                    borderColor: profile.color,
                    backgroundColor: `${profile.color}22`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.profileAvatar,
                    { backgroundColor: profile.color },
                  ]}
                >
                  <Text style={styles.profileAvatarEmoji}>
                    {profile.avatar}
                  </Text>
                </View>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile.name}
                </Text>
                {profile.id === activeProfileId && (
                  <View style={styles.playingDot} />
                )}
              </TouchableOpacity>
            );
          })}
          {profiles.length < MAX_PROFILES && (
            <TouchableOpacity
              onPress={() => setEditor({ profile: null })}
              style={[styles.profileChip, styles.addChip]}
            >
              <View style={[styles.profileAvatar, styles.addAvatar]}>
                <FontAwesome6
                  name="plus"
                  iconStyle="solid"
                  size={22}
                  color="#8c662e"
                />
              </View>
              <Text style={styles.profileName}>Add kid</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <Animated.View
          key={selected.id}
          entering={FadeIn.duration(250)}
          style={styles.report}
        >
          <View style={[styles.kidCard, { borderColor: selected.color }]}>
            <View style={styles.kidHeader}>
              <View
                style={[styles.kidAvatar, { backgroundColor: selected.color }]}
              >
                <Text style={styles.kidAvatarEmoji}>{selected.avatar}</Text>
              </View>
              <View style={styles.kidInfo}>
                <Text style={styles.kidName}>{selected.name}</Text>
                <Text style={styles.kidSubText}>
                  {isActive
                    ? '🎮 Playing now'
                    : `${report.rewards.stars} stars to spend`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setEditor({ profile: selected })}
              >
                <FontAwesome6
                  name="pen"
                  iconStyle="solid"
                  size={15}
                  color="#1a105f"
                />
              </TouchableOpacity>
              {profiles.length > 1 && (
                <TouchableOpacity
                  style={[styles.iconBtn, styles.deleteBtn]}
                  onPress={handleDelete}
                >
                  <FontAwesome6
                    name="trash"
                    iconStyle="solid"
                    size={15}
                    color="#d8493a"
                  />
                </TouchableOpacity>
              )}
            </View>
            {!isActive && (
              <CustomButton
                width={'100%'}
                bottomBorderColor="#0d8f3e"
                colors={['#35c46b', '#1ca952']}
                onPress={handleSwitch}
                padding={10}
                paddingBottom={7}
                btnRadius={14}
              >
                <Text style={styles.switchText}>Play as {selected.name}</Text>
              </CustomButton>
            )}
          </View>

          <View style={styles.summaryGrid}>
            {summary.map(item => (
              <View key={item.label} style={styles.summaryTile}>
                <Text style={styles.summaryIcon}>{item.icon}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <WeeklyChart week={report.week} color={selected.color} />

          {insights.length > 0 && (
            <View style={styles.insightsCard}>
              {insights.map(insight => (
                <View key={insight.title} style={styles.insightRow}>
                  <Text style={styles.insightIcon}>{insight.icon}</Text>
                  <View style={styles.kidInfo}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightText}>{insight.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Activities</Text>
          {report.activities.map(activity => (
            <ActivityReportCard key={activity.id} activity={activity} />
          ))}
        </Animated.View>
      </ScrollView>

      <ProfileEditorModal
        visible={!!editor}
        profile={editor?.profile}
        onSave={handleSaveProfile}
        onClose={() => setEditor(null)}
      />
    </View>
  );
};

export default ParentDashboardScreen;
