import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '../lib/ThemeContext';

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { isDark } = useTheme();
  useEffect(() => { SplashScreen.hideAsync(); }, []);
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#0f0f1a' : '#f8f9fa'}/>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: isDark ? '#0f0f1a' : '#f8f9fa' } }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(auth)"/>
        <Stack.Screen name="(app)"/>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStack/>
    </ThemeProvider>
  );
}
