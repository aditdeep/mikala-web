import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../lib/api';

function TabIcon({ name, color, label, focused, badge }: any) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 64, height: 50 }}>
      <View style={{ position: 'relative' }}>
        <Ionicons name={name} size={focused ? 22 : 21} color={color} />
        {badge > 0 && (
          <View style={{ position: 'absolute', top: -5, right: -9, backgroundColor: '#ef4444', borderRadius: 99, minWidth: 15, height: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#0f0f1a' }}>
            <Text style={{ color: 'white', fontSize: 8, fontWeight: '800' }}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={{ fontSize: 9.5, fontWeight: focused ? '700' : '500', color, marginTop: 3, letterSpacing: 0.1 }}>
        {label}
      </Text>
    </View>
  );
}

export default function AppLayout() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/mitra/notifikasi');
        setUnread(res.data?.unread_count || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        sceneStyle: { backgroundColor: isDark ? '#0f0f1a' : '#f8f9fa' },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 40 : 60}
            tint={isDark ? 'dark' : 'light'}
            experimentalBlurMethod="dimezisBlurView"
            style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 24,
          right: 24,
          height: 68,
          borderRadius: 28,
          backgroundColor: isDark ? 'rgba(20,15,40,0.3)' : 'rgba(255,255,255,0.4)',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)',
          elevation: 20,
          shadowColor: '#7c3aed',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          paddingHorizontal: 6,
        },
        tabBarItemStyle: { height: 68, paddingTop: 14, paddingBottom: 8 },
      }}>
      <Tabs.Screen name="index"
        options={{ tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} label="Beranda" /> }} />
      <Tabs.Screen name="jobs"
        options={{ tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'briefcase' : 'briefcase-outline'} color={color} focused={focused} label="Tugas" /> }} />
      <Tabs.Screen name="pelatihan"
        options={{ tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'book' : 'book-outline'} color={color} focused={focused} label="Pelatihan" /> }} />
      <Tabs.Screen name="gaji"
        options={{ tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} focused={focused} label="Gaji" /> }} />
      <Tabs.Screen name="profile"
        options={{ tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} label="Profil" /> }} />
      <Tabs.Screen name="notifikasi" options={{ href: null }} />
      <Tabs.Screen name="cuti" options={{ href: null }} />
      <Tabs.Screen name="syarat-ketentuan" options={{ href: null }} />
      <Tabs.Screen name="privacy-policy" options={{ href: null }} />
    </Tabs>
  );
}
