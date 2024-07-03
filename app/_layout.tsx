import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform,ScrollView, SafeAreaView, StatusBar, View } from 'react-native';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={{ ...DefaultTheme }}>
         <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="todoIndex" />
              <Stack.Screen name="category/[id]" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
        </SafeAreaView>
      </PaperProvider>
  );
}
