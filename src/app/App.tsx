import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { useEffect } from 'react';
import TTSService from '../services/tts.service';
import AppProviders from './providers/AppProviders';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  useEffect(() => {
    TTSService.init();
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
