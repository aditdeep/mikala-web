import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../lib/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!email) { setError('Masukkan email Anda'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={['#0f0c29','#302b63','#24243e']} style={{ flex:1 }}>
      <ScrollView contentContainerStyle={{ flexGrow:1, padding:24, justifyContent:'center' }}>
        <TouchableOpacity onPress={()=>router.back()} style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:32 }}>
          <Ionicons name="arrow-back" size={20} color="rgba(167,139,250,0.7)"/>
          <Text style={{ color:'rgba(167,139,250,0.7)', fontSize:14 }}>Kembali</Text>
        </TouchableOpacity>
        <Text style={{ color:'white', fontSize:24, fontWeight:'800', marginBottom:8 }}>Lupa Password</Text>
        <Text style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginBottom:24 }}>Masukkan email untuk reset password</Text>

        {!sent ? (
          <View style={{ backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:24, padding:24 }}>
            {!!error && <View style={{ backgroundColor:'rgba(239,68,68,0.1)', borderRadius:10, padding:12, marginBottom:14 }}><Text style={{ color:'#f87171', fontSize:13 }}>{error}</Text></View>}
            <Text style={{ color:'rgba(167,139,250,0.8)', fontSize:13, marginBottom:8 }}>Email</Text>
            <View style={{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:14, marginBottom:16 }}>
              <Ionicons name="mail-outline" size={17} color="rgba(167,139,250,0.6)" style={{ position:'absolute', left:14 }}/>
              <TextInput value={email} onChangeText={setEmail} placeholder="email@contoh.com" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="email-address" autoCapitalize="none" style={{ flex:1, color:'white', fontSize:14, paddingVertical:13, paddingLeft:42, paddingRight:14 }}/>
            </View>
            <TouchableOpacity onPress={handleSubmit} disabled={loading}>
              <LinearGradient colors={['#7c3aed','#4f46e5']} style={{ padding:14, borderRadius:14, alignItems:'center' }}>
                {loading ? <ActivityIndicator color="white"/> : <Text style={{ color:'white', fontSize:15, fontWeight:'700' }}>Kirim Reset Link</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:24, padding:24, alignItems:'center' }}>
            <Ionicons name="checkmark-circle" size={56} color="#10b981" style={{ marginBottom:16 }}/>
            <Text style={{ color:'white', fontSize:18, fontWeight:'700', marginBottom:8 }}>Link Terkirim!</Text>
            <Text style={{ color:'rgba(255,255,255,0.6)', fontSize:14, textAlign:'center', marginBottom:20 }}>Cek email Anda untuk instruksi reset password.</Text>
            <TouchableOpacity onPress={()=>router.replace('/(auth)/login')} style={{ backgroundColor:'rgba(124,58,237,0.2)', borderRadius:14, padding:14, width:'100%', alignItems:'center' }}>
              <Text style={{ color:'#a78bfa', fontWeight:'700' }}>Kembali ke Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
