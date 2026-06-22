import { useEffect, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../lib/ThemeContext';
import { registerPushNotifications, setupNotificationListeners } from '../lib/notifications';
import { authService } from '../lib/auth';

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { isDark } = useTheme();
  const notifListener = useRef<any>(null);

  useEffect(() => {
    SplashScreen.hideAsync();

    const initPush = async () => {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) { await registerPushNotifications(); }
    };
    initPush();

    const cleanup = setupNotificationListeners(
      (notification) => {},
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.type === 'layanan' || data?.type === 'order') {
          router.push('/(app)/layanan');
        } else if (data?.type === 'tagihan' || data?.type === 'billing') {
          router.push('/(app)/tagihan');
        } else if (data?.type === 'pasien') {
          router.push('/(app)/pasien');
        }
      }
    );
    return cleanup;
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#0f0f1a' : '#f8f9fa'}/>
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#0f0f1a' : '#f8f9fa' },
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }}/>
        <Stack.Screen name="(app)"  options={{ animation: 'fade' }}/>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppStack/>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
