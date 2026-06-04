import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../lib/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../lib/api';

function TabIcon({ name, color, label, focused, badge }: any) {
  return (
    <View style={{ alignItems:'center', paddingTop:6 }}>
      <View style={{ position:'relative' }}>
        <Ionicons name={name} size={23} color={color}/>
        {badge > 0 && (
          <View style={{ position:'absolute', top:-4, right:-8, backgroundColor:'#ef4444', borderRadius:99, minWidth:16, height:16, alignItems:'center', justifyContent:'center', paddingHorizontal:3 }}>
            <Text style={{ color:'white', fontSize:9, fontWeight:'800' }}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ color, fontSize:10, marginTop:3, fontWeight: focused?'700':'400', letterSpacing:-0.2 }}>{label}</Text>
      {focused && (
        <View style={{ width:18, height:2.5, borderRadius:99, backgroundColor:color, marginTop:3 }}/>
      )}
    </View>
  );
}

export default function AppLayout() {
  const { isDark, colors } = useTheme();
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

  const TAB_HEIGHT = 58 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_HEIGHT,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={{
            position:'absolute', inset:0,
            backgroundColor: isDark ? 'rgba(15,12,26,0.85)' : 'rgba(255,255,255,0.85)',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            ...(Platform.OS === 'ios' ? {} : {
              shadowColor: '#000',
              shadowOffset: { width:0, height:-2 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 12,
              elevation: 20,
            }),
          }}>
            {Platform.OS === 'ios' && (
              <BlurView
                intensity={isDark ? 80 : 60}
                tint={isDark ? 'dark' : 'light'}
                style={{ position:'absolute', inset:0 }}
              />
            )}
          </View>
        ),
      }}>
      <Tabs.Screen name="index"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'home':'home-outline'} color={color} label="Home" focused={focused}/> }}/>
      <Tabs.Screen name="jobs"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'briefcase':'briefcase-outline'} color={color} label="Jobs" focused={focused}/> }}/>
      <Tabs.Screen name="pelatihan"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'book':'book-outline'} color={color} label="Pelatihan" focused={focused}/> }}/>
      <Tabs.Screen name="gaji"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'wallet':'wallet-outline'} color={color} label="Gaji" focused={focused}/> }}/>
      <Tabs.Screen name="profile"
        options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'person':'person-outline'} color={color} label="Profile" focused={focused}/> }}/>
      {/* Hidden screen — tidak tampil di tab bar */}
      <Tabs.Screen name="notifikasi" options={{ href: null }}/>
    </Tabs>
  );
}
