import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

// Handler — tampilkan notifikasi saat app foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

/**
 * Register device untuk push notification
 * Simpan Expo Push Token ke backend
 */
export async function registerPushNotifications(): Promise<string | null> {
  try {
    // Cek apakah ini real device (bukan simulator)
    if (!Device.isDevice) {
      console.log('Push notification hanya di real device');
      return null;
    }

    // Minta izin
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied');
      return null;
    }

    // Setup Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Mikala Mitra',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7c3aed',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('jobs', {
        name: 'Job Baru',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });

      await Notifications.setNotificationChannelAsync('gaji', {
        name: 'Gaji & Pembayaran',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#f59e0b',
      });
    }

    // Dapatkan Expo Push Token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: undefined, // akan otomatis dari app.json
    });
    const token = tokenData.data;
    console.log('Expo Push Token:', token);

    // Kirim token ke backend
    await api.post('/push-token', { expo_token: token });
    console.log('✓ Push token saved to backend');

    return token;
  } catch (error) {
    console.log('Push notification setup error:', error);
    return null;
  }
}

/**
 * Setup listener untuk notifikasi yang diterima
 */
export function setupNotificationListeners(
  onReceive?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void,
) {
  // Notifikasi diterima saat app foreground
  const receiveSub = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
    onReceive?.(notification);
  });

  // User tap notifikasi
  const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification tapped:', response);
    onResponse?.(response);
  });

  return () => {
    receiveSub.remove();
    responseSub.remove();
  };
}
