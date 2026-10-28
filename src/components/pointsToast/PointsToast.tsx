import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOutUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import useSettingsContext from '../../app/contexts/settings/useSettings';
import { PointsToastType } from '../../app/contexts/rewards/types';

const TOAST_DURATION = 1600;

const PointsToast = () => {
  const { pointsToast } = useRewardsContext();
  const { settings } = useSettingsContext();
  const insets = useSafeAreaInsets();
  // read through a ref so switching popups back on doesn't replay the last toast
  const starPopupsRef = useRef(settings.starPopups);
  starPopupsRef.current = settings.starPopups;
  const [visibleToast, setVisibleToast] = useState<PointsToastType | null>(
    null,
  );

  useEffect(() => {
    if (!pointsToast || !starPopupsRef.current) return;
    setVisibleToast(pointsToast);
    const timer = setTimeout(() => setVisibleToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [pointsToast]);

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { top: insets.top + 70 }]}
    >
      {visibleToast && (
        <Animated.View
          key={visibleToast.id}
          entering={ZoomIn.springify().damping(8)}
          exiting={FadeOutUp.duration(400)}
          style={styles.toast}
        >
          <Text style={styles.amount}>+{visibleToast.amount} ⭐</Text>
          {visibleToast.label && (
            <Text style={styles.label}>{visibleToast.label}</Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default PointsToast;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10000,
    elevation: 10000,
  },
  toast: {
    alignItems: 'center',
    backgroundColor: '#ffd84d',
    borderColor: '#e09b00',
    borderWidth: 2,
    borderBottomWidth: 7,
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  amount: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#7a4a00',
  },
  label: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#d84e16',
    marginTop: -2,
  },
});
