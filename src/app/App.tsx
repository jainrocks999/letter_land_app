import { AppState, StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { useEffect } from 'react';
import TTSService from '../services/tts.service';
import AppProviders from './providers/AppProviders';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MusicService from '../services/music.service';

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
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <AppProviders>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <RootNavigator />
          </SafeAreaView>
        </AppProviders>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
