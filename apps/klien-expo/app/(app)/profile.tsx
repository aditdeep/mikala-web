import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';
import { authService } from '../../lib/auth';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      const u = await authService.getUser();
      setUser(u);
      const r = await api.get('/klien/profile').catch(() => null);
      const data = r?.data?.data;
      setProfile(data);
      const klien = data?.klien || data || {};
      setForm({
        phone: u?.phone || klien?.phone || '',
        phone_secondary: klien?.phone_secondary || '',
        alamat: klien?.alamat || '',
        kota: klien?.kota || '',
        provinsi: klien?.provinsi || '',
        bank_name: klien?.bank_name || '',
        bank_account: klien?.bank_account || '',
        bank_account_name: klien?.bank_account_name || '',
      });
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { loadProfile(); }, []);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await api.patch('/klien/profile', form);
      await loadProfile();
      setEditing(false);
      Alert.alert('Berhasil', 'Profil berhasil diperbarui');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: async () => {
        await authService.logout();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  const klien = profile?.klien || profile || {};
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'K';

  const Field = ({ label, icon, value, editable, onChangeText, iconColor = '#10b981', iconBg = 'rgba(16,185,129,0.1)' }: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={15} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text3, fontSize: 11 }}>{label}</Text>
        {editable && editing ? (
          <TextInput
            defaultValue={value}
            onChangeText={onChangeText}
            placeholderTextColor={colors.text3}
            style={{ color: colors.text, fontSize: 13, fontWeight: '500', borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 3, backgroundColor: colors.bg2 || colors.glass }}
          />
        ) : (
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500', marginTop: 2 }}>{value || '-'}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadProfile(); }} tintColor="#10b981" />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Profil</Text>
          {!editing ? (
            <TouchableOpacity onPress={() => setEditing(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)' }}>
              <Ionicons name="create-outline" size={14} color="#10b981" />
              <Text style={{ color: '#10b981', fontSize: 13, fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => { setEditing(false); loadProfile(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder }}>
                <Ionicons name="close" size={14} color={colors.text3} />
                <Text style={{ color: colors.text3, fontSize: 13 }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={saving} style={{ borderRadius: 12, overflow: 'hidden' }}>
                <LinearGradient colors={['#10b981', '#059669']} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 12 }}>
                  <Ionicons name="checkmark" size={14} color="white" />
                  <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>{saving ? '...' : 'Simpan'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!!error && (
          <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
            <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        <LinearGradient colors={['#10b981', '#059669', '#0d9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 24, alignItems: 'center', overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: 'white' }}>{initials}</Text>
          </View>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>{user?.name}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>{user?.email}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 }}>
            <Ionicons name="person" size={12} color="white" />
            <Text style={{ color: 'white', fontSize: 11, fontWeight: '500', textTransform: 'capitalize' }}>{klien?.tipe || 'individu'}</Text>
          </View>
        </LinearGradient>

        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.glassBorder }}>
            <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text }}>Informasi Pribadi</Text>
          </View>
          <View style={{ padding: 16 }}>
            <Field label="Nama Lengkap" icon="person-outline" value={klien?.nama_lengkap || user?.name} editable={false} />
            <Field label="Email" icon="mail-outline" value={user?.email} editable={false} />
            <Field label="Nomor HP" icon="call-outline" value={form.phone} editable onChangeText={(v: string) => form.phone = v} />
            <Field label="HP Lainnya" icon="call-outline" value={form.phone_secondary} editable onChangeText={(v: string) => form.phone_secondary = v} />
            <Field label="Alamat" icon="location-outline" value={form.alamat} editable onChangeText={(v: string) => form.alamat = v} />
            <Field label="Kota" icon="home-outline" value={form.kota} editable onChangeText={(v: string) => form.kota = v} />
            <Field label="Provinsi" icon="map-outline" value={form.provinsi} editable onChangeText={(v: string) => form.provinsi = v} />
          </View>
        </View>

        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.glassBorder }}>
            <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text }}>Info Pembayaran</Text>
          </View>
          <View style={{ padding: 16 }}>
            <Field label="Nama Bank" icon="card-outline" value={form.bank_name} editable iconColor="#10b981" iconBg="rgba(16,185,129,0.1)" onChangeText={(v: string) => form.bank_name = v} />
            <Field label="No. Rekening" icon="card-outline" value={form.bank_account} editable iconColor="#10b981" iconBg="rgba(16,185,129,0.1)" onChangeText={(v: string) => form.bank_account = v} />
            <Field label="Nama Rekening" icon="person-outline" value={form.bank_account_name} editable iconColor="#10b981" iconBg="rgba(16,185,129,0.1)" onChangeText={(v: string) => form.bank_account_name = v} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total Pasien', value: klien?.total_pasien || 0 },
            { label: 'Total Order', value: klien?.total_orders || 0 },
            { label: 'Total Tagihan', value: `Rp ${(Number(klien?.total_tagihan) || 0).toLocaleString('id-ID')}` },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 14, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text }} numberOfLines={1}>{s.value}</Text>
              <Text style={{ color: colors.text3, fontSize: 10, marginTop: 2, textAlign: 'center' }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Link Legal */}
        <TouchableOpacity onPress={() => router.push('/(app)/syarat-ketentuan')} activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 14, padding: 15, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="document-text-outline" size={18} color={colors.text2} />
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Syarat & Ketentuan</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text3} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(app)/privacy-policy')} activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 14, padding: 15, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.text2} />
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Kebijakan Privasi</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text3} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', borderRadius: 16, padding: 16 }}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
