import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../lib/theme';

function TabIcon({ name, color, label, focused }: any) {
  return (
    <View style={{ alignItems:'center', paddingTop:8 }}>
      <Ionicons name={name} size={22} color={color}/>
      <Text style={{ color, fontSize:10, marginTop:3, fontWeight: focused?'700':'400' }}>{label}</Text>
      {focused && <View style={{ width:4, height:4, borderRadius:2, backgroundColor:Colors.primary, marginTop:2 }}/>}
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { position:'absolute', backgroundColor:'rgba(15,15,26,0.97)', borderTopColor:'rgba(255,255,255,0.08)', borderTopWidth:1, height:70, paddingBottom:8 },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index"    options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'home':'home-outline'} color={color} label="Home" focused={focused}/> }}/>
      <Tabs.Screen name="jobs"     options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'briefcase':'briefcase-outline'} color={color} label="Jobs" focused={focused}/> }}/>
      <Tabs.Screen name="pelatihan"options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'book':'book-outline'} color={color} label="Pelatihan" focused={focused}/> }}/>
      <Tabs.Screen name="gaji"     options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'wallet':'wallet-outline'} color={color} label="Gaji" focused={focused}/> }}/>
      <Tabs.Screen name="profile"  options={{ tabBarIcon:({color,focused})=><TabIcon name={focused?'person':'person-outline'} color={color} label="Profile" focused={focused}/> }}/>
    </Tabs>
  );
}
