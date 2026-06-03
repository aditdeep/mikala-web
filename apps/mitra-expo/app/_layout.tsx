import { useEffect, useRef } from 'react';
import { AppState, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../lib/ThemeContext';
import { registerPushNotifications, setupNotificationListeners } from '../lib/notifications';
import { authService } from '../lib/auth';

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { isDark } = useTheme();
  const notifListener = useRef<any>(null);

  useEffect(() => {
    // Hide splash
    SplashScreen.hideAsync();

    // Register push notification setelah user login
    const initPush = async () => {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        await registerPushNotifications();
      }
    };
    initPush();

    // Setup listeners
    const cleanup = setupNotificationListeners(
      // Saat terima notifikasi (foreground)
      (notification) => {
        const { title, body } = notification.request.content;
        // Optional: tampilkan custom alert
      },
      // Saat user tap notifikasi
      (response) => {
        const data = response.notification.request.content.data;
        // Navigate berdasarkan type notifikasi
        if (data?.type === 'job') {
          router.push('/(app)/jobs');
        } else if (data?.type === 'gaji' || data?.type === 'payroll') {
          router.push('/(app)/gaji');
        } else if (data?.type === 'pelatihan') {
          router.push('/(app)/pelatihan');
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
