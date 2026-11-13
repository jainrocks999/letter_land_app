import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOutUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useToast from '../../app/contexts/toast/useToast';
import { ToastType } from '../../app/contexts/toast/types';

const TOAST_DURATION = 2400;

const Toast = () => {
  const { toast } = useToast();
  const insets = useSafeAreaInsets();
  const [visibleToast, setVisibleToast] = useState<ToastType | null>(null);

  useEffect(() => {
    if (!toast) return;
    setVisibleToast(toast);
    const timer = setTimeout(() => setVisibleToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

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
          {visibleToast.icon && (
            <Text style={styles.icon}>{visibleToast.icon}</Text>
          )}
          <Text style={styles.message}>{visibleToast.message}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default Toast;

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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '86%',
    backgroundColor: '#ffffff',
    borderColor: '#9e9e9e',
    borderWidth: 2,
    borderBottomWidth: 7,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  icon: {
    fontSize: 22,
  },
  message: {
    flexShrink: 1,
    fontFamily: 'Fredoka-Bold',
    fontSize: 15,
    color: '#555555',
  },
});
