import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../lib/ThemeContext';
import { registerPushNotifications, setupNotificationListeners, clearAppBadge, bukaNotif, bukaNotifColdStart } from '../lib/notifications';
import { authService } from '../lib/auth';

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { isDark } = useTheme();
  const notifListener = useRef<any>(null);

  useEffect(() => {
    SplashScreen.hideAsync();

    const initPush = async () => {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        await registerPushNotifications();
        // tunggu layar (app) siap dulu baru navigasi ke tujuan notif
        setTimeout(() => { bukaNotifColdStart(); }, 1200);
      }
    };
    initPush();

    const cleanup = setupNotificationListeners(
      (notification) => {},
      (response) => { bukaNotif(response.notification.request.content.data); }
    );
    // Badge ikon app & notif di bar dibersihkan saat app dibuka / kembali ke depan
    clearAppBadge();
    const appStateSub = AppState.addEventListener('change', (st) => { if (st === 'active') clearAppBadge(); });

    return () => { cleanup(); appStateSub.remove(); };
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
