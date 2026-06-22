import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

const TIPE_LABEL: any = {
  homecare_harian: 'Homecare Harian', homecare_live_in: 'Homecare Live In',
  medical_checkup: 'Medical Checkup', konsultasi: 'Konsultasi',
  fisioterapi: 'Fisioterapi', perawatan_luka: 'Perawatan Luka',
  vaksinasi: 'Vaksinasi', lainnya: 'Lainnya',
};
const STATUS_LABEL: any = { active: 'Aktif', confirmed: 'Dikonfirmasi', pending: 'Menunggu', in_progress: 'Berlangsung', completed: 'Selesai', cancelled: 'Dibatalkan' };

export default function LayananScreen() {
  const { colors } = useTheme();
  const [layanan, setLayanan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/klien/layanan').catch(() => null);
      const d = res?.data?.data;
      setLayanan(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    } catch { setLayanan([]); }
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const filtered = layanan.filter(l =>
    l.tipe_layanan?.toLowerCase().includes(search.toLowerCase()) ||
    l.catatan?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => s === 'active' || s === 'confirmed' ? '#10b981' : s === 'completed' ? '#3b82f6' : s === 'cancelled' ? '#ef4444' : '#f59e0b';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10b981" />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Layanan</Text>
            <Text style={{ fontSize: 13, color: colors.text3, marginTop: 2 }}>{layanan.length} layanan</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(app)/layanan-new')} style={{ width: 42, height: 42, borderRadius: 14, overflow: 'hidden' }}>
            <LinearGradient colors={['#10b981', '#059669']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="add" size={22} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}>
          <Ionicons name="search" size={18} color={colors.text3} />
          <TextInput placeholder="Cari layanan..." placeholderTextColor={colors.text3} value={search} onChangeText={setSearch} style={{ flex: 1, color: colors.text, fontSize: 14 }} />
        </View>

        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}><ActivityIndicator size="large" color="#10b981" /></View>
        ) : filtered.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filtered.map((s) => (
              <TouchableOpacity key={s.id} onPress={() => router.push(`/(app)/layanan/${s.id}`)} activeOpacity={0.8}
                style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <LinearGradient colors={['#10b981', '#059669']} style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="pulse" size={20} color="white" />
                  </LinearGradient>
                  <View style={{ backgroundColor: `${statusColor(s.status)}26`, borderWidth: 1, borderColor: `${statusColor(s.status)}4d`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: statusColor(s.status), fontSize: 11, fontWeight: '600' }}>{STATUS_LABEL[s.status] || s.status}</Text>
                  </View>
                </View>
                <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text, marginBottom: 6 }}>{TIPE_LABEL[s.tipe_layanan] || s.tipe_layanan}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  {s.pasien?.nama_lengkap ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Ionicons name="person-outline" size={12} color={colors.text3} />
                      <Text style={{ fontSize: 12, color: colors.text3 }}>{s.pasien.nama_lengkap}</Text>
                    </View>
                  ) : null}
                  {s.tanggal_mulai ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Ionicons name="calendar-outline" size={12} color={colors.text3} />
                      <Text style={{ fontSize: 12, color: colors.text3 }}>{new Date(s.tanggal_mulai).toLocaleDateString('id-ID')}</Text>
                    </View>
                  ) : null}
                </View>
                {s.mitra?.user?.name ? (
                  <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.glassBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: colors.text3 }}>Mitra: <Text style={{ color: colors.text, fontWeight: '600' }}>{s.mitra.user.name}</Text></Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.text3} />
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="pulse" size={36} color="#10b981" style={{ opacity: 0.5 }} />
            </View>
            <Text style={{ fontWeight: '600', fontSize: 15, color: colors.text }}>Belum ada layanan</Text>
            <Text style={{ fontSize: 13, color: colors.text3, marginTop: 4, marginBottom: 16 }}>Mulai pesan layanan perawatan</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/layanan-new')} style={{ borderRadius: 14, overflow: 'hidden' }}>
              <LinearGradient colors={['#10b981', '#059669']} style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Buat Layanan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
