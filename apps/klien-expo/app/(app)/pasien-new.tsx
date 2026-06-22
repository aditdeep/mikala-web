import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

export default function PasienNewScreen() {
  const { colors } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<any>({
    nama_lengkap: '', nik: '', tanggal_lahir: '', jenis_kelamin: 'L',
    golongan_darah: '', alamat: '', riwayat_penyakit: '',
    alergi: '', obat_rutin: '', catatan_khusus: '',
    kontak_darurat_nama: '', kontak_darurat_phone: '', kontak_darurat_relasi: 'keluarga',
  });

  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.nama_lengkap || !form.tanggal_lahir || !form.alamat) {
      setError('Nama, tanggal lahir, dan alamat wajib diisi'); return;
    }
    setSaving(true); setError('');
    try {
      await api.post('/klien/pasien', form);
      Alert.alert('Berhasil', 'Pasien berhasil ditambahkan', [
        { text: 'OK', onPress: () => router.replace('/(app)/pasien') },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan pasien');
    } finally { setSaving(false); }
  };

  const Label = ({ children }: any) => (
    <Text style={{ color: colors.text2, fontSize: 12, fontWeight: '500', marginBottom: 6 }}>{children}</Text>
  );

  const Input = ({ field, placeholder, keyboard, multiline }: any) => (
    <TextInput
      defaultValue={form[field]}
      onChangeText={(v) => set(field, v)}
      placeholder={placeholder}
      placeholderTextColor={colors.text3}
      keyboardType={keyboard || 'default'}
      multiline={multiline}
      style={{ backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: colors.text, fontSize: 14, minHeight: multiline ? 60 : undefined, textAlignVertical: multiline ? 'top' : 'center' }}
    />
  );

  const Chips = ({ field, options }: any) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map(([val, lbl]: any) => (
        <TouchableOpacity key={val} onPress={() => set(field, val)}
          style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, backgroundColor: form[field] === val ? 'rgba(16,185,129,0.15)' : colors.glass, borderWidth: 1, borderColor: form[field] === val ? '#10b981' : colors.glassBorder }}>
          <Text style={{ color: form[field] === val ? '#10b981' : colors.text3, fontWeight: '600', fontSize: 13 }}>{lbl}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Tambah Pasien</Text>
            <Text style={{ color: colors.text3, fontSize: 13 }}>Data pasien yang akan dirawat</Text>
          </View>
        </View>

        {!!error && (
          <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Data Pasien */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, gap: 14, marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', color: '#10b981', fontSize: 13 }}>Data Pasien</Text>

          <View><Label>Nama Lengkap *</Label><Input field="nama_lengkap" placeholder="Nama lengkap pasien" /></View>

          <View><Label>Tanggal Lahir * (YYYY-MM-DD)</Label><Input field="tanggal_lahir" placeholder="1990-01-31" /></View>

          <View><Label>Jenis Kelamin *</Label><Chips field="jenis_kelamin" options={[['L', 'Laki-laki'], ['P', 'Perempuan']]} /></View>

          <View><Label>Golongan Darah</Label><Chips field="golongan_darah" options={[['A', 'A'], ['B', 'B'], ['AB', 'AB'], ['O', 'O']]} /></View>

          <View><Label>NIK</Label><Input field="nik" placeholder="16 digit NIK" keyboard="number-pad" /></View>

          <View><Label>Alamat *</Label><Input field="alamat" placeholder="Alamat lengkap pasien" /></View>

          <View><Label>Riwayat Penyakit</Label><Input field="riwayat_penyakit" placeholder="Penyakit yang pernah diderita" multiline /></View>

          <View><Label>Alergi</Label><Input field="alergi" placeholder="Alergi obat, makanan, dll" /></View>

          <View><Label>Obat Rutin</Label><Input field="obat_rutin" placeholder="Obat yang rutin dikonsumsi" /></View>

          <View><Label>Catatan Khusus</Label><Input field="catatan_khusus" placeholder="Kebutuhan khusus lainnya" multiline /></View>
        </View>

        {/* Kontak Darurat */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, gap: 14, marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', color: '#10b981', fontSize: 13 }}>Kontak Darurat</Text>

          <View><Label>Nama Kontak Darurat</Label><Input field="kontak_darurat_nama" placeholder="Nama keluarga/wali" /></View>

          <View><Label>Nomor HP</Label><Input field="kontak_darurat_phone" placeholder="08xxxxxxxxxx" keyboard="phone-pad" /></View>

          <View><Label>Relasi</Label><Chips field="kontak_darurat_relasi" options={[['keluarga', 'Keluarga'], ['suami_istri', 'Suami/Istri'], ['anak', 'Anak'], ['orang_tua', 'Orang Tua'], ['lainnya', 'Lainnya']]} /></View>
        </View>

        {/* Submit */}
        <TouchableOpacity onPress={handleSubmit} disabled={saving} activeOpacity={0.85} style={{ borderRadius: 16, overflow: 'hidden' }}>
          <LinearGradient colors={['#10b981', '#059669']} style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{saving ? 'Menyimpan...' : 'Simpan Pasien'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
