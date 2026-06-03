import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

export default function NotifikasiScreen() {
  const { colors, isDark } = useTheme();
  const [notifs, setNotifs]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread]     = useState(0);

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    try {
      const res = await api.get('/mitra/notifikasi');
      setNotifs(res.data?.data?.data || res.data?.data || []);
      setUnread(res.data?.unread_count || 0);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  const markRead = async (id: number) => {
    try {
      await api.patch(`/mitra/notifikasi/${id}/read`);
      setNotifs(prev => prev.map(n => n.id === id ? {...n, is_read: true} : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.post('/mitra/notifikasi/read-all');
      setNotifs(prev => prev.map(n => ({...n, is_read: true})));
      setUnread(0);
    } catch {}
  };

  const typeIcon: any = {
    job: 'briefcase', gaji: 'wallet', pelatihan: 'book',
    rekrutmen: 'person-add', general: 'notifications',
  };
  const typeColor: any = {
    job: '#7c3aed', gaji: '#10b981', pelatihan: '#0ea5e9',
    rekrutmen: '#f59e0b', general: '#6b7280',
  };

  if (loading) return (
    <View style={{flex:1,backgroundColor:colors.bg,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" color="#7c3aed"/>
    </View>
  );

  return (
    <View style={{flex:1,backgroundColor:colors.bg}}>
      <LinearGradient colors={isDark?['#1a0f2e','#0f0f1a']:['#f0eeff','#f8f9fa']}
        style={{padding:20,paddingTop:56,paddingBottom:16}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
            <TouchableOpacity onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={22} color="#7c3aed"/>
            </TouchableOpacity>
            <Text style={{color:colors.text,fontSize:20,fontWeight:'800'}}>Notifikasi</Text>
            {unread > 0 && (
              <View style={{backgroundColor:'#7c3aed',borderRadius:99,paddingHorizontal:8,paddingVertical:2}}>
                <Text style={{color:'white',fontSize:11,fontWeight:'700'}}>{unread}</Text>
              </View>
            )}
          </View>
          {unread > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={{color:'#7c3aed',fontSize:13,fontWeight:'600'}}>Baca Semua</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={{flex:1,padding:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadNotifs();}} tintColor="#7c3aed"/>}>

        {notifs.length === 0 ? (
          <View style={{alignItems:'center',padding:48}}>
            <Ionicons name="notifications-outline" size={56} color={colors.text3}/>
            <Text style={{color:colors.text2,fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada notifikasi</Text>
          </View>
        ) : notifs.map(n => (
          <TouchableOpacity key={n.id} onPress={()=>markRead(n.id)} activeOpacity={0.8}
            style={{
              backgroundColor: n.is_read ? colors.card : isDark?'rgba(124,58,237,0.08)':'rgba(124,58,237,0.05)',
              borderRadius:16, padding:16, marginBottom:10,
              borderWidth:1,
              borderColor: n.is_read ? colors.glassBorder : 'rgba(124,58,237,0.2)',
              flexDirection:'row', gap:12, alignItems:'flex-start',
            }}>
            {/* Icon */}
            <View style={{
              width:42, height:42, borderRadius:13, alignItems:'center', justifyContent:'center',
              backgroundColor:`${typeColor[n.type]||'#6b7280'}15`,
              flexShrink:0,
            }}>
              <Ionicons name={(typeIcon[n.type]||'notifications') as any} size={20} color={typeColor[n.type]||'#6b7280'}/>
            </View>

            {/* Content */}
            <View style={{flex:1}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
                <Text style={{color:colors.text,fontSize:14,fontWeight:n.is_read?'500':'700',flex:1,marginRight:8}}>
                  {n.title}
                </Text>
                {!n.is_read && (
                  <View style={{width:8,height:8,borderRadius:4,backgroundColor:'#7c3aed',marginTop:4,flexShrink:0}}/>
                )}
              </View>
              <Text style={{color:colors.text2,fontSize:13,marginTop:3,lineHeight:18}}>{n.body}</Text>
              <Text style={{color:colors.text3,fontSize:11,marginTop:6}}>
                {n.created_at ? new Date(n.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
