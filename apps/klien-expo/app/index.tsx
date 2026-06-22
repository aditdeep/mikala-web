import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../lib/auth';

export default function Index() {
  useEffect(() => {
    authService.isAuthenticated().then(ok => {
      router.replace(ok ? '/(app)' : '/(auth)/login');
    });
  }, []);
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f0f1a' }}>
      <ActivityIndicator size="large" color="#10b981"/>
    </View>
  );
}
