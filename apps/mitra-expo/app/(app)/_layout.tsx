'use client';import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({ name, color, label, focused }: any) {
  return (
    <View style={{ alignItems:'center', paddingTop:8 }}>
      <Ionicons name={name} size={22} color={color}/>
      <Text style={{ color, fontSize:10, marginTop:3, fontWeight:focused?'700':'400' }}>{label}</Text>
      {focused && <View style={{ width:4, height:4, borderRadius:2, backgroundColor:'#7c3aed', marginTop:2 }}/>}
    </View>
  );
}

export default function AppLayout() {
  const { isDark, colors } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/mitra/notifikasi');
        setUnreadCount(res.data?.unread_count || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // poll setiap 30 detik
    return () => clearInterval(interval);
  }, []);
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position:'absolute',
        backgroundColor: isDark ? 'rgba(15,15,26,0.97)' : 'rgba(255,255,255,0.97)',
        borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        borderTopWidth:1, height: 60 + insets.bottom, paddingBottom: insets.bottom + 4,
      },
      tabBarActiveTintColor: '#7c3aed',
      tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index"     options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'home':'home-outline'} color={color} label="Home" focused={focused}/> }}/>
      <Tabs.Screen name="jobs"      options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'briefcase':'briefcase-outline'} color={color} label="Jobs" focused={focused}/> }}/>
      <Tabs.Screen name="pelatihan" options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'book':'book-outline'} color={color} label="Pelatihan" focused={focused}/> }}/>
      <Tabs.Screen name="gaji"      options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'wallet':'wallet-outline'} color={color} label="Gaji" focused={focused}/> }}/>
      <Tabs.Screen name="profile"   options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'person':'person-outline'} color={color} label="Profile" focused={focused}/> }}/>
    </Tabs>
  );
}
