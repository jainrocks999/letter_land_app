import {
  AppState,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { useEffect } from 'react';
import TTSService from '../services/tts.service';
import AppProviders from './providers/AppProviders';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MusicService from '../services/music.service';
import PortraitStage from '../components/portraitStage/PortraitStage';
import { usePortraitInsets } from '../utils/orientation';
import AppUpdateModal from '../components/appUpdateModal/AppUpdateModal';
import { useIosAppUpdate } from '../hooks/useIosAppUpdate';

const AppContent = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = usePortraitInsets();
  const iosUpdate = useIosAppUpdate();

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* Stage must wrap the providers so toasts/overlays stay inside the
          letterboxed portrait screen in landscape. */}
      <PortraitStage>
        <AppProviders>
          <View
            style={[
              styles.screen,
              {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
            ]}
          >
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <RootNavigator />
            <AppUpdateModal
              visible={iosUpdate.visible}
              type={iosUpdate.type}
              onUpdate={iosUpdate.onUpdate}
              onLater={iosUpdate.onLater}
            />
          </View>
        </AppProviders>
      </PortraitStage>
    </GestureHandlerRootView>
  );
};

function App() {
  useEffect(() => {
    TTSService.init();
    MusicService.init();

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        MusicService.play();
      } else {
        MusicService.stopEffects();
        MusicService.pause();
      }
    });

    return () => {
      sub.remove();
      MusicService.release();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  screen: { flex: 1, backgroundColor: '#fff' },
});

export default App;
