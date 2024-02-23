import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/components/Navigation';
import { useFonts } from 'expo-font';
import { UserProvider } from './src/context/user';
import { AppStateProvider } from './src/context/appState';

import {
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
} from '@expo-google-fonts/josefin-sans';

export default function App() {
  const [fontsLoaded] = useFonts({
    'JosefinLight': JosefinSans_300Light,
    'JosefinRegular': JosefinSans_400Regular,
    'JosefinMedium': JosefinSans_500Medium,
    'JosefinSemiBold': JosefinSans_600SemiBold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor="#fff"
        animated={true}
      />
      <NavigationContainer>
        <AppStateProvider>
          <UserProvider>
            <Navigation />
          </UserProvider>
        </AppStateProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

