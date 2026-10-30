import React, { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import ProgressBar from '../../components/progressBar/ProgressBar';
import TTSService from '../../services/tts.service';
import { REWARD_POINTS } from '../../config/constants';
import { StickerType, stickersData, trophiesData } from './data/rewards.data';
import { styles } from './Rewards.styles';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import CustomButton from '../../components/customButton/CustomButton';
import { activityData } from '../home/data/home.data';
import { StackNavigationProps } from '../../types/navigation.types';
import { ROUTES } from '../../app/navigation/routeNames';
import StickerSlot, { SlotRect, StickerStatus } from './components/StickerSlot';
import CollectStickerOverlay from './components/CollectStickerOverlay';
import MusicService from '../../services/music.service';

interface CollectingState {
  sticker: StickerType;
  target: SlotRect;
  overlaySize: { width: number; height: number };
}

const RewardsScreen = () => {
  const navigation =
    useNavigation<StackNavigationProps<typeof ROUTES.REWARDS>>();
  const { rewards, collectSticker } = useRewardsContext();
  const containerRef = useRef<View>(null);
  const [collecting, setCollecting] = useState<CollectingState | null>(null);
  const [landedId, setLandedId] = useState<string | null>(null);

  // cheapest sticker that is still missing from the book
  const nextSticker = stickersData.find(
    sticker => !rewards.unlockedStickers.includes(sticker.id),
  );
  const nextProgress = nextSticker
    ? (rewards.stars / nextSticker.cost) * 100
    : 100;
  const canCollectNext = !!nextSticker && rewards.stars >= nextSticker.cost;

  const getStickerStatus = (sticker: StickerType): StickerStatus => {
    if (rewards.unlockedStickers.includes(sticker.id)) return 'collected';
    return rewards.stars >= sticker.cost ? 'ready' : 'locked';
  };

  const handleStickerPress = (
    sticker: StickerType,
    status: StickerStatus,
    rect: SlotRect,
  ) => {
    if (status === 'locked') {
      // TTSService.speak(
      //   `You need ${sticker.cost - rewards.stars} more stars for the ${
      //     sticker.name
      //   }. Keep playing!`,
      // );
      return;
    }
    containerRef.current?.measureInWindow((x, y, width, height) => {
      if (!collectSticker(sticker.id)) return;
      setLandedId(null);
      MusicService.playEffect('getReward');
      setCollecting({
        sticker,
        target: { ...rect, x: rect.x - x, y: rect.y - y },
        overlaySize: { width, height },
      });
      // TTSService.speak(`Yay! You collected the ${sticker.name} sticker!`);
    });
  };

  const handleStickerLanded = () => {
    setLandedId(collecting?.sticker.id ?? null);
    setCollecting(null);
  };

  const handleTrophyPress = (trophyId: string, title: string) => {
    // if (rewards.trophies.includes(trophyId)) {
    //   TTSService.speak(`Hooray! You won the ${title} trophy!`);
    //   return;
    // }
    const card = activityData.find(
      castle => castle.innerCard.navigate?.toLowerCase() === trophyId,
    )?.innerCard;
    if (card?.navigate) {
      navigation.navigate(card.navigate, { data: card });
    }
  };

  const earnTips = [
    {
      icon: (
        <FontAwesome6
          name="circle-check"
          size={24}
          color="#22C55E"
          iconStyle="regular"
        />
      ),
      text: 'Right answer',
      points: REWARD_POINTS.CORRECT,
    },
    {
      icon: (
        <FontAwesome6 name="fire" iconStyle="solid" size={24} color="#FF6A22" />
      ),
      text: `${REWARD_POINTS.COMBO_EVERY} in a row`,
      points: REWARD_POINTS.COMBO_BONUS,
    },
    {
      icon: (
        <FontAwesome6
          name="flag"
          size={24}
          color="#A8487E"
          iconStyle="regular"
        />
      ),
      text: 'Finish',
      points: REWARD_POINTS.ACTIVITY_COMPLETE,
    },
  ] as const;

  return (
    <View ref={containerRef} collapsable={false} style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="xmark" iconStyle="solid" size={30} />
        </TouchableOpacity>

        {/* <StarCounter /> */}
        <View
          style={{
            backgroundColor: '#F6E7C8',
            padding: 10,
            borderColor: '#c08a25',
            borderWidth: 2,
            borderBottomWidth: 8,
            borderRadius: 12,
            marginVertical: 6,
          }}
        >
          <FontAwesome6
            name="trophy"
            iconStyle="solid"
            size={22}
            color={'#c08a25'}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeadingSection
          heading="Treasure Room"
          subText="Collect stars with bubby! Learn, play, and unlock fun rewards!"
        />

        <View style={styles.heroCard}>
          <View style={styles.flexRow}>
            <View style={[styles.cardBadgets, styles.flexRow]}>
              <FontAwesome6
                name="star"
                iconStyle="solid"
                size={15}
                color={'#c08a25'}
              />
              <Text style={styles.tipText}>{rewards.stars} Stars</Text>
            </View>
            <View style={styles.cardBadgets}>
              <Text style={styles.tipText}>
                Sticker ({rewards.unlockedStickers.length}/{stickersData.length}
                )
              </Text>
            </View>
          </View>
          <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
            <View style={styles.starContainer}>
              <Text style={[styles.heroStar, { alignSelf: 'center' }]}>⭐</Text>
            </View>
            <Text style={[styles.heroSubText, styles.heroMessage]}>
              {!nextSticker
                ? 'You collected every sticker! You are a superstar!'
                : canCollectNext
                ? `You have enough stars! Tap ${nextSticker.name} in your sticker book!`
                : `${nextSticker.cost - rewards.stars} more stars for ${
                    nextSticker.name
                  }!`}
            </Text>
            <View style={[styles.heroCircle, styles.heroNextSticker]}>
              <Text
                style={[styles.heroNextEmoji, !canCollectNext && styles.faded]}
              >
                {nextSticker?.emoji ?? '🏆'}
              </Text>
            </View>
          </View>
          <ProgressBar progress={nextProgress} bgColor="#ffffffcc" />
        </View>

        <View style={styles.whiteCard}>
          <Text
            style={[
              styles.secondryText,
              { textAlign: 'center', paddingBottom: 15 },
            ]}
          >
            How to earn stars
          </Text>
          <View style={styles.flexRow}>
            {earnTips.map(tip => (
              <View key={tip.text} style={styles.tipChip}>
                {tip.icon}
                <Text style={styles.tipText}>{tip.text}</Text>
                <Text style={styles.pointsText}>+{tip.points}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>🏆 My Trophies</Text>
        <View
          style={[
            styles.flexRowSpeaceBtwn,
            { paddingHorizontal: 12, rowGap: 10 },
          ]}
        >
          {trophiesData.map(activity => {
            const isEarned = rewards.trophies.includes(activity.id);
            return (
              <TouchableOpacity
                key={activity.id}
                activeOpacity={0.8}
                onPress={() => handleTrophyPress(activity.id, activity.title)}
                style={[
                  styles.trophyCard,
                  {
                    backgroundColor: `${activity.lightColor}66`,
                    borderColor: activity.midColor,
                  },
                ]}
              >
                {!isEarned && (
                  <View style={styles.trophiesLockIcon}>
                    <FontAwesome6
                      name="lock"
                      iconStyle="solid"
                      size={14}
                      color={activity.darkColor}
                    />
                  </View>
                )}
                <Text style={{ fontSize: 22 }}>{activity.icon}</Text>
                <Text
                  style={[
                    styles.pointsText,
                    { color: activity.darkColor, fontSize: 14 },
                  ]}
                >
                  {activity.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.flexRowSpeaceBtwn}>
          <Text style={styles.sectionTitle}>📒 Sticker Book</Text>
          <Text style={[styles.tipText, styles.stickerBugetText]}>
            {rewards.unlockedStickers.length}/{stickersData.length}
          </Text>
        </View>

        <View
          style={[
            styles.whiteCard,
            styles.flexRowSpeaceBtwn,
            { rowGap: 10, marginBottom: 20 },
          ]}
        >
          {stickersData.map(sticker => (
            <StickerSlot
              key={sticker.id}
              sticker={sticker}
              status={getStickerStatus(sticker)}
              isFlying={collecting?.sticker.id === sticker.id}
              justLanded={landedId === sticker.id}
              disabled={!!collecting}
              onPress={handleStickerPress}
            />
          ))}
        </View>
        <CustomButton
          width={'auto'}
          bottomBorderColor={'#d84e16'}
          colors={['#ff7b38', '#ff6425']}
          onPress={() => navigation.goBack()}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>{'Keep playing'}</Text>
            <FontAwesome6
              name={'chevron-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
      </ScrollView>

      {collecting && (
        <CollectStickerOverlay
          key={collecting.sticker.id}
          sticker={collecting.sticker}
          target={collecting.target}
          overlaySize={collecting.overlaySize}
          onLanded={handleStickerLanded}
        />
      )}
    </View>
  );
};

export default RewardsScreen;
