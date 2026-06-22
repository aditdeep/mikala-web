import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

export default function PasienScreen() {
  const { colors } = useTheme();
  const [pasien, setPasien] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/klien/pasien').catch(() => null);
      const d = res?.data?.data;
      setPasien(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    } catch { setPasien([]); }
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const filtered = pasien.filter(p =>
    p.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    p.riwayat_penyakit?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'P';
  const umur = (tgl: string) => tgl ? new Date().getFullYear() - new Date(tgl).getFullYear() : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10b981" />}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Pasien</Text>
            <Text style={{ fontSize: 13, color: colors.text3, marginTop: 2 }}>{pasien.length} pasien terdaftar</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(app)/pasien-new')} style={{ width: 42, height: 42, borderRadius: 14, overflow: 'hidden' }}>
            <LinearGradient colors={['#10b981', '#059669']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="add" size={22} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}>
          <Ionicons name="search" size={18} color={colors.text3} />
          <TextInput
            placeholder="Cari pasien..."
            placeholderTextColor={colors.text3}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: colors.text, fontSize: 14 }}
          />
        </View>

        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : filtered.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filtered.map((p) => (
              <TouchableOpacity key={p.id} onPress={() => router.push(`/(app)/pasien/${p.id}`)} activeOpacity={0.8}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 16 }}>
                <LinearGradient colors={['#10b981', '#059669']} style={{ width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{initials(p.nama_lengkap)}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text }} numberOfLines={1}>{p.nama_lengkap}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 3 }}>
                    {umur(p.tanggal_lahir) !== null && <Text style={{ fontSize: 12, color: colors.text3 }}>{umur(p.tanggal_lahir)} tahun</Text>}
                    {p.riwayat_penyakit ? (
                      <View style={{ backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 11, color: '#10b981' }} numberOfLines={1}>{p.riwayat_penyakit}</Text>
                      </View>
                    ) : null}
                  </View>
                  {(p.kontak_darurat_phone || p.alamat) ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 }}>
                      {p.kontak_darurat_phone ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Ionicons name="call-outline" size={11} color={colors.text3} />
                          <Text style={{ fontSize: 11, color: colors.text3 }}>{p.kontak_darurat_phone}</Text>
                        </View>
                      ) : null}
                      {p.alamat ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 }}>
                          <Ionicons name="location-outline" size={11} color={colors.text3} />
                          <Text style={{ fontSize: 11, color: colors.text3 }} numberOfLines={1}>{p.alamat}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.text3} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="people" size={36} color="#10b981" style={{ opacity: 0.5 }} />
            </View>
            <Text style={{ fontWeight: '600', fontSize: 15, color: colors.text }}>Belum ada pasien</Text>
            <Text style={{ fontSize: 13, color: colors.text3, marginTop: 4, marginBottom: 16 }}>Daftarkan pasien pertama Anda</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/pasien-new')} style={{ borderRadius: 14, overflow: 'hidden' }}>
              <LinearGradient colors={['#10b981', '#059669']} style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Tambah Pasien</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
