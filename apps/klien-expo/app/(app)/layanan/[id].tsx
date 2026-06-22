import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../lib/ThemeContext';
import api from '../../../lib/api';

const TIPE_MAP: any = {
  homecare_harian: 'Homecare Harian', homecare_live_in: 'Homecare Live In',
  medical_checkup: 'Medical Checkup', konsultasi: 'Konsultasi',
  fisioterapi: 'Fisioterapi', perawatan_luka: 'Perawatan Luka',
  vaksinasi: 'Vaksinasi', lainnya: 'Lainnya',
};
const STATUS_MAP: any = {
  pending: { label: 'Menunggu Konfirmasi', color: '#f59e0b' },
  confirmed: { label: 'Dikonfirmasi', color: '#3b82f6' },
  active: { label: 'Sedang Berjalan', color: '#10b981' },
  in_progress: { label: 'Sedang Berjalan', color: '#10b981' },
  completed: { label: 'Selesai', color: '#6b7280' },
  cancelled: { label: 'Dibatalkan', color: '#ef4444' },
};

export default function DetailLayanan() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [layanan, setLayanan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const r = await api.get(`/klien/layanan/${id}`).catch(() => null);
      setLayanan(r?.data?.data || null);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleFeedback = async () => {
    setSubmitting(true);
    try {
      await api.post(`/klien/layanan/${id}/feedback`, { rating, catatan: feedback });
      setShowFeedback(false);
      Alert.alert('Berhasil', 'Feedback berhasil dikirim!');
      load();
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal kirim feedback');
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}><ActivityIndicator size="large" color="#10b981" /></View>;
  }
  if (!layanan) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, padding: 20 }}>
        <Text style={{ color: colors.text3 }}>Data layanan tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 10 }}>
          <Text style={{ color: colors.text2 }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const st = STATUS_MAP[layanan.status] || STATUS_MAP.pending;
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  const Row = ({ icon, label, value }: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.glassBorder }}>
      <Ionicons name={icon} size={16} color="#10b981" style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text3, fontSize: 11 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500', marginTop: 2 }}>{value || '-'}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 60 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Detail Layanan</Text>
        </View>

        {/* Status Card */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 12 }}>
          <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="pulse" size={26} color="#10b981" />
          </View>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text, marginBottom: 6 }}>{TIPE_MAP[layanan.tipe_layanan] || layanan.tipe_layanan}</Text>
          <View style={{ backgroundColor: `${st.color}26`, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 5 }}>
            <Text style={{ color: st.color, fontSize: 12, fontWeight: '600' }}>{st.label}</Text>
          </View>
          {layanan.order_number ? <Text style={{ color: colors.text3, fontSize: 12, marginTop: 8 }}>#{layanan.order_number}</Text> : null}
        </View>

        {/* Info */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text, marginBottom: 8 }}>Informasi Layanan</Text>
          <Row icon="person-outline" label="Pasien" value={layanan.pasien?.nama_lengkap} />
          <Row icon="calendar-outline" label="Tanggal Mulai" value={fmtDate(layanan.tanggal_mulai)} />
          {layanan.tanggal_selesai ? <Row icon="calendar-outline" label="Tanggal Selesai" value={fmtDate(layanan.tanggal_selesai)} /> : null}
          {layanan.mitra?.user?.name ? <Row icon="medkit-outline" label="Mitra" value={layanan.mitra.user.name} /> : null}
          {layanan.total ? <Row icon="cash-outline" label="Total" value={`Rp ${Number(layanan.total).toLocaleString('id-ID')}`} /> : null}
          {layanan.catatan ? <Row icon="document-text-outline" label="Catatan" value={layanan.catatan} /> : null}
        </View>

        {/* Feedback (kalau completed) */}
        {layanan.status === 'completed' && (
          <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20 }}>
            {!showFeedback ? (
              <TouchableOpacity onPress={() => setShowFeedback(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Ionicons name="star-outline" size={18} color="#f59e0b" />
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>Beri Rating & Feedback</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text, marginBottom: 12 }}>Beri Rating</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity key={n} onPress={() => setRating(n)}>
                      <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={32} color="#f59e0b" />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  value={feedback} onChangeText={setFeedback}
                  placeholder="Tulis feedback Anda..." placeholderTextColor={colors.text3} multiline
                  style={{ backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 12, padding: 12, color: colors.text, fontSize: 14, minHeight: 70, textAlignVertical: 'top', marginBottom: 12 }}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => setShowFeedback(false)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center' }}>
                    <Text style={{ color: colors.text3, fontWeight: '600' }}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleFeedback} disabled={submitting} style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
                    <LinearGradient colors={['#10b981', '#059669']} style={{ paddingVertical: 12, alignItems: 'center' }}>
                      <Text style={{ color: 'white', fontWeight: '700' }}>{submitting ? '...' : 'Kirim'}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
