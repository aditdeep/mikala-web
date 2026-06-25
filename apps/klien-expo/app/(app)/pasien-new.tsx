import { useState, useRef } from 'react';
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
  // Pakai ref biar ketik nggak trigger re-render (keyboard nggak turun)
  const form = useRef<any>({
    nama_lengkap: '', nik: '', tanggal_lahir: '', jenis_kelamin: 'L',
    golongan_darah: '', alamat: '', riwayat_penyakit: '',
    alergi: '', obat_rutin: '', catatan_khusus: '',
    kontak_darurat_nama: '', kontak_darurat_phone: '', kontak_darurat_relasi: 'keluarga',
  });
  // State HANYA untuk chips (yang perlu re-render visual)
  const [jenisKelamin, setJenisKelamin] = useState('L');
  const [golDarah, setGolDarah] = useState('');
  const [relasi, setRelasi] = useState('keluarga');

  const handleSubmit = async () => {
    const f = form.current;
    if (!f.nama_lengkap || !f.tanggal_lahir || !f.alamat) {
      setError('Nama, tanggal lahir, dan alamat wajib diisi'); return;
    }
    setSaving(true); setError('');
    try {
      await api.post('/klien/pasien', {
        ...f,
        jenis_kelamin: jenisKelamin,
        golongan_darah: golDarah,
        kontak_darurat_relasi: relasi,
      });
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

  const inputStyle = (multiline?: boolean) => ({
    backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: colors.text, fontSize: 14,
    minHeight: multiline ? 60 : undefined, textAlignVertical: (multiline ? 'top' : 'center') as any,
  });

  const Chips = ({ value, setValue, options }: any) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map(([val, lbl]: any) => (
        <TouchableOpacity key={val} onPress={() => setValue(val)}
          style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, backgroundColor: value === val ? 'rgba(16,185,129,0.15)' : colors.glass, borderWidth: 1, borderColor: value === val ? '#10b981' : colors.glassBorder }}>
          <Text style={{ color: value === val ? '#10b981' : colors.text3, fontWeight: '600', fontSize: 13 }}>{lbl}</Text>
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

          <View><Label>Nama Lengkap *</Label>
            <TextInput defaultValue={form.current.nama_lengkap} onChangeText={(v) => form.current.nama_lengkap = v} placeholder="Nama lengkap pasien" placeholderTextColor={colors.text3} style={inputStyle()} /></View>

          <View><Label>Tanggal Lahir * (YYYY-MM-DD)</Label>
            <TextInput defaultValue={form.current.tanggal_lahir} onChangeText={(v) => form.current.tanggal_lahir = v} placeholder="1990-01-31" placeholderTextColor={colors.text3} style={inputStyle()} /></View>

          <View><Label>Jenis Kelamin *</Label><Chips value={jenisKelamin} setValue={setJenisKelamin} options={[['L', 'Laki-laki'], ['P', 'Perempuan']]} /></View>

          <View><Label>Golongan Darah</Label><Chips value={golDarah} setValue={setGolDarah} options={[['A', 'A'], ['B', 'B'], ['AB', 'AB'], ['O', 'O']]} /></View>

          <View><Label>NIK</Label>
            <TextInput defaultValue={form.current.nik} onChangeText={(v) => form.current.nik = v} placeholder="16 digit NIK" placeholderTextColor={colors.text3} keyboardType="number-pad" style={inputStyle()} /></View>

          <View><Label>Alamat *</Label>
            <TextInput defaultValue={form.current.alamat} onChangeText={(v) => form.current.alamat = v} placeholder="Alamat lengkap pasien" placeholderTextColor={colors.text3} style={inputStyle()} /></View>

          <View><Label>Riwayat Penyakit</Label>
            <TextInput defaultValue={form.current.riwayat_penyakit} onChangeText={(v) => form.current.riwayat_penyakit = v} placeholder="Penyakit yang pernah diderita" placeholderTextColor={colors.text3} multiline style={inputStyle(true)} /></View>

          <View><Label>Alergi</Label>
            <TextInput defaultValue={form.current.alergi} onChangeText={(v) => form.current.alergi = v} placeholder="Alergi obat, makanan, dll" placeholderTextColor={colors.text3} style={inputStyle()} /></View>

          <View><Label>Obat Rutin</Label>
            <TextInput defaultValue={form.current.obat_rutin} onChangeText={(v) => form.current.obat_rutin = v} placeholder="Obat yang rutin dikonsumsi" placeholderTextColor={colors.text3} style={inputStyle()} /></View>

          <View><Label>Catatan Khusus</Label>
            <TextInput defaultValue={form.current.catatan_khusus} onChangeText={(v) => form.current.catatan_khusus = v} placeholder="Kebutuhan khusus lainnya" placeholderTextColor={colors.text3} multiline style={inputStyle(true)} /></View>
        </View>

        {/* Kontak Darurat */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, gap: 14, marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', color: '#10b981', fontSize: 13 }}>Kontak Darurat</Text>

          <View><Label>Nama Kontak Darurat</Label>
            <TextInput defaultValue={form.current.kontak_darurat_nama} onChangeText={(v) => form.current.kontak_darurat_nama = v} placeholder="Nama keluarga/wali" placeholderTextColor={colors.text3} style={inputStyle()} /></View>

          <View><Label>Nomor HP</Label>
            <TextInput defaultValue={form.current.kontak_darurat_phone} onChangeText={(v) => form.current.kontak_darurat_phone = v} placeholder="08xxxxxxxxxx" placeholderTextColor={colors.text3} keyboardType="phone-pad" style={inputStyle()} /></View>

          <View><Label>Relasi</Label><Chips value={relasi} setValue={setRelasi} options={[['keluarga', 'Keluarga'], ['suami_istri', 'Suami/Istri'], ['anak', 'Anak'], ['orang_tua', 'Orang Tua'], ['lainnya', 'Lainnya']]} /></View>
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
