import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

export default function NotifikasiScreen() {
  const { colors, isDark } = useTheme();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    try {
      const res = await api.get('/notifikasi');
      setNotifs(res.data?.data?.data || res.data?.data || []);
      setUnread(res.data?.unread_count || 0);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  const markRead = async (id: number) => {
    try {
      await api.patch(`/notifikasi/${id}/read`);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifikasi/mark-all-read');
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {}
  };

  const typeIcon: any = {
    layanan: 'pulse', order: 'pulse', tagihan: 'receipt', billing: 'receipt',
    pasien: 'people', general: 'notifications',
  };
  const typeColor: any = {
    layanan: '#10b981', order: '#10b981', tagihan: '#f59e0b', billing: '#f59e0b',
    pasien: '#0d9488', general: '#6b7280',
  };

  const fmtDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={isDark ? ['#0a1f1a', '#0f0f1a'] : ['#d1fae5', '#f8f9fa']}
        style={{ padding: 20, paddingTop: 56, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#10b981" />
            </TouchableOpacity>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>Notifikasi</Text>
            {unread > 0 && (
              <View style={{ backgroundColor: '#10b981', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{unread}</Text>
              </View>
            )}
          </View>
          {unread > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={{ color: '#10b981', fontSize: 13, fontWeight: '600' }}>Tandai semua</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNotifs(); }} tintColor="#10b981" />}
      >
        {notifs.length > 0 ? (
          <View style={{ gap: 10 }}>
            {notifs.map((n) => {
              const ic = typeIcon[n.type] || 'notifications';
              const col = typeColor[n.type] || '#6b7280';
              return (
                <TouchableOpacity key={n.id} onPress={() => !n.is_read && markRead(n.id)} activeOpacity={0.8}
                  style={{ flexDirection: 'row', gap: 12, backgroundColor: n.is_read ? colors.glass : `${col}14`, borderWidth: 1, borderColor: n.is_read ? colors.glassBorder : `${col}40`, borderRadius: 16, padding: 14 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${col}1a`, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={ic} size={18} color={col} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.text, fontSize: 14, fontWeight: n.is_read ? '500' : '700', flex: 1 }} numberOfLines={1}>{n.title || n.judul || 'Notifikasi'}</Text>
                      {!n.is_read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: col, marginLeft: 6 }} />}
                    </View>
                    <Text style={{ color: colors.text2, fontSize: 13, marginTop: 2 }} numberOfLines={2}>{n.message || n.pesan || n.body || ''}</Text>
                    <Text style={{ color: colors.text3, fontSize: 11, marginTop: 4 }}>{fmtDate(n.created_at)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="notifications-off-outline" size={36} color="#10b981" style={{ opacity: 0.5 }} />
            </View>
            <Text style={{ fontWeight: '600', fontSize: 15, color: colors.text }}>Belum ada notifikasi</Text>
            <Text style={{ fontSize: 13, color: colors.text3, marginTop: 4 }}>Notifikasi akan muncul di sini</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
