import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';
import { authService } from '../../lib/auth';

export default function Beranda() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [userName, setUserName] = useState('Klien');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread] = useState(0);

  const loadData = async () => {
    try {
      const u = await authService.getUser();
      setUserName(u?.name?.split(' ')[0] || 'Klien');
      const h = new Date().getHours();
      setGreeting(h < 12 ? 'Selamat Pagi' : h < 17 ? 'Selamat Siang' : 'Selamat Malam');
      const res = await api.get('/klien/dashboard').catch(() => null);
      setStats(res?.data?.data || null);
      const n = await api.get('/notifikasi/unread-count').catch(() => null);
      setUnread(n?.data?.unread_count ?? n?.data?.data?.unread_count ?? 0);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);
  useFocusEffect(useCallback(() => { loadData(); }, []));

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <LinearGradient colors={isDark ? ['#0a1f1a', '#0f0f1a'] : ['#d1fae5', '#f8f9fa']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        {/* Header gradient */}
        <LinearGradient colors={['#10b981', '#059669', '#0d9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 24, overflow: 'hidden', marginBottom: 20 }}>
          {/* Top row: greeting kiri, ikon kanan */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>{greeting} 👋</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '800' }}>{userName}!</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={() => router.push('/(app)/notifikasi')}
                style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Ionicons name="notifications-outline" size={18} color="white" />
                {unread > 0 && (
                  <View style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#059669' }}>
                    <Text style={{ color: 'white', fontSize: 9, fontWeight: '800' }}>{unread > 9 ? '9+' : unread}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleTheme}
                style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(app)/profile')}
                style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{userName?.[0]?.toUpperCase() || 'K'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Kelola layanan perawatan Anda</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start' }}>
            <Ionicons name="pulse" size={14} color="white" />
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>{stats?.active_services || 0} layanan aktif</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20, alignItems: 'stretch' }}>
          <TouchableOpacity onPress={() => router.push('/(app)/layanan-new')} activeOpacity={0.85}
            style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}>
            <LinearGradient colors={['#10b981', '#059669']} style={{ flex: 1, padding: 18, minHeight: 130 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Ionicons name="add" size={20} color="white" />
              </View>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Layanan Baru</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>Pesan layanan perawatan</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(app)/pasien-new')} activeOpacity={0.85}
            style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}>
            <LinearGradient colors={['#0d9488', '#0f766e']} style={{ flex: 1, padding: 18, minHeight: 130 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Ionicons name="person-add" size={20} color="white" />
              </View>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Tambah Pasien</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>Daftarkan pasien baru</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 1, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 18 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Ionicons name="time-outline" size={20} color="#f59e0b" />
            </View>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 24 }}>{stats?.active_services || 0}</Text>
            <Text style={{ color: colors.text3, fontSize: 12, marginTop: 2 }}>Layanan Aktif</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 18 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Ionicons name="people-outline" size={20} color="#10b981" />
            </View>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 24 }}>{stats?.total_patients || 0}</Text>
            <Text style={{ color: colors.text3, fontSize: 12, marginTop: 2 }}>Total Pasien</Text>
          </View>
        </View>

        {/* Recent Services */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 24, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 }}>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 16 }}>Layanan Terkini</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/layanan')} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={{ color: '#10b981', fontSize: 12, fontWeight: '600' }}>Lihat Semua</Text>
              <Ionicons name="chevron-forward" size={14} color="#10b981" />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
            {stats?.recent_services?.length > 0 ? stats.recent_services.map((s: any) => (
              <View key={s.id} style={{ backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="pulse" size={18} color="#10b981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }} numberOfLines={1}>{s.service_type || s.tipe_layanan || 'Layanan'}</Text>
                    <Text style={{ color: colors.text3, fontSize: 12, marginTop: 2 }} numberOfLines={1}>{s.patient_name || s.pasien?.nama_lengkap || '-'}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '600' }}>{s.status}</Text>
                </View>
              </View>
            )) : (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Ionicons name="document-text-outline" size={36} color={colors.text3} style={{ opacity: 0.4, marginBottom: 12 }} />
                <Text style={{ color: colors.text3, fontSize: 14 }}>Belum ada layanan terkini</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
