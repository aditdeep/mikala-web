import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

const TIPE_LAYANAN = [
  ['homecare_harian', 'Homecare Harian'], ['homecare_live_in', 'Homecare Live In'],
  ['medical_checkup', 'Medical Checkup'], ['konsultasi', 'Konsultasi'],
  ['fisioterapi', 'Fisioterapi'], ['perawatan_luka', 'Perawatan Luka'],
  ['vaksinasi', 'Vaksinasi'], ['lainnya', 'Lainnya'],
];

export default function LayananNewScreen() {
  const { colors } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pasienList, setPasienList] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    service_type: 'homecare_harian',
    pasien_id: '',
    tanggal_mulai: '',
    catatan: '',
  });

  useEffect(() => {
    api.get('/klien/pasien')
      .then((r) => { const d = r.data?.data; setPasienList(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []); })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.pasien_id) { setError('Pilih pasien terlebih dahulu'); return; }
    if (!form.tanggal_mulai) { setError('Tanggal mulai wajib diisi'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/klien/layanan', form);
      Alert.alert('Berhasil', 'Permintaan layanan terkirim', [
        { text: 'OK', onPress: () => router.replace('/(app)/layanan') },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat permintaan layanan');
    } finally { setSaving(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Minta Layanan</Text>
            <Text style={{ color: colors.text3, fontSize: 13 }}>Ajukan permintaan layanan baru</Text>
          </View>
        </View>

        {!!error && (
          <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {pasienList.length === 0 && (
          <View style={{ backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#f59e0b', fontSize: 13 }}>Belum ada pasien terdaftar. Tambah pasien dulu di menu Pasien.</Text>
          </View>
        )}

        {/* Tipe Layanan */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, marginBottom: 14 }}>
          <Text style={{ color: colors.text2, fontSize: 12, fontWeight: '500', marginBottom: 10 }}>Tipe Layanan *</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TIPE_LAYANAN.map(([val, lbl]) => (
              <TouchableOpacity key={val} onPress={() => set('service_type', val)}
                style={{ paddingVertical: 9, paddingHorizontal: 13, borderRadius: 10, backgroundColor: form.service_type === val ? 'rgba(16,185,129,0.15)' : (colors.bg2 || colors.glass), borderWidth: 1, borderColor: form.service_type === val ? '#10b981' : colors.glassBorder }}>
                <Text style={{ color: form.service_type === val ? '#10b981' : colors.text3, fontWeight: '600', fontSize: 12 }}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pilih Pasien */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, marginBottom: 14 }}>
          <Text style={{ color: colors.text2, fontSize: 12, fontWeight: '500', marginBottom: 10 }}>Pilih Pasien *</Text>
          {pasienList.length > 0 ? (
            <View style={{ gap: 8 }}>
              {pasienList.map((p) => (
                <TouchableOpacity key={p.id} onPress={() => set('pasien_id', String(p.id))}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: String(form.pasien_id) === String(p.id) ? 'rgba(16,185,129,0.12)' : (colors.bg2 || colors.glass), borderWidth: 1, borderColor: String(form.pasien_id) === String(p.id) ? '#10b981' : colors.glassBorder }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: String(form.pasien_id) === String(p.id) ? '#10b981' : colors.text3, alignItems: 'center', justifyContent: 'center' }}>
                    {String(form.pasien_id) === String(p.id) && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' }} />}
                  </View>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>{p.nama_lengkap}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ color: colors.text3, fontSize: 13 }}>Belum ada pasien</Text>
          )}
        </View>

        {/* Tanggal + Catatan */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, gap: 14, marginBottom: 14 }}>
          <View>
            <Text style={{ color: colors.text2, fontSize: 12, fontWeight: '500', marginBottom: 6 }}>Tanggal Mulai * (YYYY-MM-DD)</Text>
            <TextInput defaultValue={form.tanggal_mulai} onChangeText={(v) => set('tanggal_mulai', v)} placeholder="2026-07-01" placeholderTextColor={colors.text3}
              style={{ backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: colors.text, fontSize: 14 }} />
          </View>
          <View>
            <Text style={{ color: colors.text2, fontSize: 12, fontWeight: '500', marginBottom: 6 }}>Catatan</Text>
            <TextInput defaultValue={form.catatan} onChangeText={(v) => set('catatan', v)} placeholder="Kebutuhan/permintaan khusus" placeholderTextColor={colors.text3} multiline
              style={{ backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: colors.text, fontSize: 14, minHeight: 70, textAlignVertical: 'top' }} />
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity onPress={handleSubmit} disabled={saving || pasienList.length === 0} activeOpacity={0.85} style={{ borderRadius: 16, overflow: 'hidden', opacity: pasienList.length === 0 ? 0.5 : 1 }}>
          <LinearGradient colors={['#10b981', '#059669']} style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{saving ? 'Mengirim...' : 'Kirim Permintaan'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
