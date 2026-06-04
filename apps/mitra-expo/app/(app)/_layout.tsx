import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../lib/api';

function TabIcon({ name, color, label, focused, badge }: any) {
  return (
    <View style={{ alignItems:'center', paddingTop:4 }}>
      <View style={{ position:'relative' }}>
        <Ionicons name={name} size={22} color={color}/>
        {badge > 0 && (
          <View style={{ position:'absolute', top:-4, right:-8, backgroundColor:'#ef4444', borderRadius:99, minWidth:16, height:16, alignItems:'center', justifyContent:'center', paddingHorizontal:3 }}>
            <Text style={{ color:'white', fontSize:9, fontWeight:'800' }}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      {focused && (
        <View style={{ width:4, height:4, borderRadius:2, backgroundColor:color, marginTop:4 }}/>
      )}
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
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 32,
          right: 32,
          height: 62,
          borderRadius: 31,
          backgroundColor: isDark ? 'rgba(20,15,40,0.92)' : 'rgba(255,255,255,0.92)',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          elevation: 20,
          shadowColor: '#7c3aed',
          shadowOffset: { width:0, height:8 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          paddingHorizontal: 8,
        },
      }}>
      <Tabs.Screen name="index"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'home':'home-outline'} color={color} focused={focused}/> }}/>
      <Tabs.Screen name="jobs"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'briefcase':'briefcase-outline'} color={color} focused={focused}/> }}/>
      <Tabs.Screen name="pelatihan"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'book':'book-outline'} color={color} focused={focused}/> }}/>
      <Tabs.Screen name="gaji"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'wallet':'wallet-outline'} color={color} focused={focused}/> }}/>
      <Tabs.Screen name="profile"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'person':'person-outline'} color={color} focused={focused}/> }}/>
      <Tabs.Screen name="notifikasi" options={{ href: null }}/>
    </Tabs>
  );
}
