import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import api from './api';

// Handler — tampilkan notifikasi saat app foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // SDK 54: shouldShowAlert sudah deprecated -> pakai shouldShowBanner/shouldShowList
    shouldShowBanner: true,
    shouldShowList:   true,
    shouldPlaySound:  true,
    shouldSetBadge:   true,
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
        name: 'Mikala Klien',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7c3aed',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('jobs', {
        name: 'Layanan',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });

      await Notifications.setNotificationChannelAsync('gaji', {
        name: 'Tagihan & Pembayaran',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#f59e0b',
      });
    }

    // Dapatkan Expo Push Token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
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

/**
 * Bersihkan notif di bar notifikasi HP + nol-kan badge angka di ikon app. Dipanggil tiap app
 * dibuka / kembali ke depan. Di Android angka badge mengikuti jumlah notif yg masih ada di bar,
 * jadi tanpa ini badge tetap muncul walau app sudah dibuka. Isi notif tetap ada di layar
 * Notifikasi dalam app (tersimpan di server).
 */
export async function clearAppBadge() {
  try { await Notifications.dismissAllNotificationsAsync(); } catch {}
  try { await Notifications.setBadgeCountAsync(0); } catch {}
}

/**
 * Buka layar yg sesuai isi notif (dipakai saat notif HP di-tap & item di layar Notifikasi).
 * Notif Deal (related_type cc_lead) -> detail layanan; tagihan/refund -> Tagihan.
 */
export function bukaNotif(data: any, keDaftarNotif = true) {
  const type = data?.type;
  const relType = data?.related_type;
  const relId = data?.related_id;
  if (['invoice', 'tagihan', 'billing', 'refund', 'payment'].includes(type)) {
    router.push('/(app)/tagihan');
  } else if ((relType === 'cc_lead' || relType === 'lead') && relId) {
    router.push(`/(app)/layanan/${relId}`);
  } else if (['layanan', 'order'].includes(type)) {
    router.push('/(app)/layanan');
  } else if (type === 'pasien') {
    router.push('/(app)/pasien');
  } else if (keDaftarNotif) {
    router.push('/(app)/notifikasi');
  }
}

/**
 * Notif yg di-tap waktu app tertutup total (cold start) tidak lewat listener -> ambil manual
 * sekali saat app siap. Dicatat id-nya supaya tidak dibuka ulang tiap app dibuka.
 */
let terakhirDibuka: string | null = null;
export async function bukaNotifColdStart() {
  try {
    const res = await Notifications.getLastNotificationResponseAsync();
    const id = res?.notification?.request?.identifier;
    if (!res || !id || id === terakhirDibuka) return;
    terakhirDibuka = id;
    bukaNotif(res.notification.request.content.data);
  } catch {}
}
