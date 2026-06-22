import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

const STATUS: any = {
  paid: { label: 'Lunas', color: '#10b981', icon: 'checkmark-circle' },
  overdue: { label: 'Jatuh Tempo', color: '#ef4444', icon: 'alert-circle' },
  unpaid: { label: 'Belum Bayar', color: '#f59e0b', icon: 'time' },
  partial: { label: 'Sebagian', color: '#3b82f6', icon: 'time' },
  pending: { label: 'Menunggu Verifikasi', color: '#f59e0b', icon: 'time' },
  cancelled: { label: 'Dibatalkan', color: '#ef4444', icon: 'close-circle' },
};

export default function TagihanScreen() {
  const { colors } = useTheme();
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get('/klien/tagihan').catch(() => null);
      const d = res?.data?.data;
      setTagihan(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    } catch { setTagihan([]); }
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const totalUnpaid = tagihan.filter(t => t.status !== 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);
  const totalPaid = tagihan.filter(t => t.status === 'paid').reduce((a, b) => a + (Number(b.total) || 0), 0);

  const handlePay = async (inv: any) => {
    setPaying(inv.id);
    try {
      const res: any = await api.post(`/klien/tagihan/${inv.id}/bayar`, { method: 'xendit' });
      const url = res.data?.data?.invoice_url;
      if (url) {
        Linking.openURL(url);
      } else {
        Alert.alert('Info', 'Link pembayaran tidak tersedia, hubungi admin.');
      }
    } catch {
      Alert.alert('Gagal', 'Gagal membuat link pembayaran. Coba lagi atau hubungi admin.');
    } finally { setPaying(null); }
  };

  const rp = (n: any) => `Rp ${(Number(n) || 0).toLocaleString('id-ID')}`;
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10b981" />}
      >
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16 }}>Tagihan</Text>

        {/* Summary */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <LinearGradient colors={['#f59e0b', '#d97706']} style={{ flex: 1, borderRadius: 18, padding: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 }}>Belum Dibayar</Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }} numberOfLines={1}>{rp(totalUnpaid)}</Text>
          </LinearGradient>
          <LinearGradient colors={['#10b981', '#059669']} style={{ flex: 1, borderRadius: 18, padding: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 }}>Sudah Dibayar</Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }} numberOfLines={1}>{rp(totalPaid)}</Text>
          </LinearGradient>
        </View>

        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}><ActivityIndicator size="large" color="#10b981" /></View>
        ) : tagihan.length > 0 ? (
          <View style={{ gap: 12 }}>
            {tagihan.map((t) => {
              const st = STATUS[t.status] || STATUS.unpaid;
              return (
                <View key={t.id} style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text }}>{t.invoice_number || t.tagihan_number || `Invoice #${t.id}`}</Text>
                      <Text style={{ fontSize: 12, color: colors.text3, marginTop: 2 }}>{t.keterangan || t.tipe_layanan || 'Layanan perawatan'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${st.color}26`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Ionicons name={st.icon} size={12} color={st.color} />
                      <Text style={{ color: st.color, fontSize: 11, fontWeight: '600' }}>{st.label}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.glassBorder }}>
                    <View>
                      <Text style={{ fontSize: 11, color: colors.text3 }}>Jatuh tempo: {fmtDate(t.due_date || t.jatuh_tempo)}</Text>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 2 }}>{rp(t.total)}</Text>
                    </View>
                    {t.status !== 'paid' && t.status !== 'cancelled' && (
                      <TouchableOpacity onPress={() => handlePay(t)} disabled={paying === t.id} style={{ borderRadius: 12, overflow: 'hidden' }}>
                        <LinearGradient colors={['#10b981', '#059669']} style={{ paddingVertical: 10, paddingHorizontal: 18 }}>
                          <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{paying === t.id ? '...' : 'Bayar'}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="receipt-outline" size={36} color="#10b981" style={{ opacity: 0.5 }} />
            </View>
            <Text style={{ fontWeight: '600', fontSize: 15, color: colors.text }}>Belum ada tagihan</Text>
            <Text style={{ fontSize: 13, color: colors.text3, marginTop: 4 }}>Tagihan akan muncul setelah layanan dibuat</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
