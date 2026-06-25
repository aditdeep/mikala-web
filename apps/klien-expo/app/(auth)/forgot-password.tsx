import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import api from '../../lib/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) { setError('Masukkan email Anda'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan, coba lagi');
    } finally { setLoading(false); }
  };

  return (
    <LinearGradient colors={['#0a1f1a', '#0d2818', '#0a1f1a']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 56, left: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' }}>
              <Ionicons name="lock-closed-outline" size={30} color="#10b981" />
            </View>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>Lupa Password</Text>
            <Text style={{ color: 'rgba(110,231,183,0.8)', fontSize: 13, marginTop: 6, textAlign: 'center' }}>
              Masukkan email untuk menerima instruksi reset password
            </Text>
          </View>

          {!result ? (
            <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }}>
              {!!error && (
                <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
                  <Text style={{ color: '#fca5a5', fontSize: 13 }}>{error}</Text>
                </View>
              )}

              <Text style={{ color: 'rgba(110,231,183,0.8)', fontSize: 13, fontWeight: '500', marginBottom: 8 }}>Email</Text>
              <View style={{ position: 'relative', marginBottom: 20 }}>
                <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: 15, zIndex: 1 }} />
                <TextInput
                  value={email} onChangeText={setEmail}
                  placeholder="nama@email.com" placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                  style={{ width: '100%', padding: 13, paddingLeft: 42, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, color: 'white', fontSize: 14 }}
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85} style={{ borderRadius: 14, overflow: 'hidden' }}>
                <LinearGradient colors={loading ? ['rgba(16,185,129,0.5)', 'rgba(5,150,105,0.5)'] : ['#10b981', '#059669']} style={{ padding: 15, alignItems: 'center' }}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Kirim Instruksi Reset</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, alignItems: 'center' }}>
                <Text style={{ color: 'rgba(110,231,183,0.7)', fontSize: 13 }}>Kembali ke Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24, alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              </View>
              <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>
                {result.email_sent ? 'Email Terkirim!' : 'Permintaan Diterima'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>
                {result.email_sent
                  ? 'Silakan cek inbox email Anda untuk instruksi reset password. Cek juga folder spam.'
                  : 'Email tidak terkirim otomatis. Gunakan WhatsApp di bawah untuk bantuan reset password.'}
              </Text>

              {result.wa_url && (
                <TouchableOpacity onPress={() => Linking.openURL(result.wa_url)} activeOpacity={0.85}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#25D366', borderRadius: 14, padding: 14, width: '100%', marginBottom: 12 }}>
                  <Ionicons name="logo-whatsapp" size={20} color="white" />
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Hubungi CS via WhatsApp</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={{ marginTop: 4 }}>
                <Text style={{ color: 'rgba(110,231,183,0.8)', fontSize: 13, fontWeight: '600' }}>Kembali ke Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
