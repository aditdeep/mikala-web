import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';
import { authService } from '../../lib/auth';

export default function HomeScreen() {
  const { isDark, colors, toggleTheme } = useTheme();
  const [user, setUser]       = useState<any>(null);
  const [rekrutmen, setRekrutmen] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const u = await authService.getUser();
      setUser(u);
      const r = await api.get('/mitra/status-rekrutmen').catch(()=>null);
      setRekrutmen(r?.data?.data);
      const n = await api.get('/mitra/notifikasi').catch(()=>null);
      setUnread(n?.data?.unread_count || 0);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  const fetchUnread = async () => {
    const n = await api.get('/mitra/notifikasi').catch(()=>null);
    setUnread(n?.data?.unread_count || 0);
  };

  useFocusEffect(useCallback(() => { fetchUnread(); }, []));

  const statusColor: any = { pending:colors.warning, verified:colors.success, rejected:colors.error };
  const statusLabel: any = { pending:'Menunggu Verifikasi', verified:'Terverifikasi ✓', rejected:'Ditolak' };

  if (loading) return <View style={{flex:1,backgroundColor:colors.bg,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color={colors.primary}/></View>;

  return (
    <ScrollView style={{flex:1,backgroundColor:colors.bg}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadData();}} tintColor={colors.primary}/>}>
      <LinearGradient colors={isDark ? ['#1a0f2e','#0f0f1a'] : ['#ede9fe','#f8f9fa']} style={{padding:20,paddingTop:56}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <View>
            <Text style={{color:colors.text,fontSize:22,fontWeight:'800'}}>Halo, {user?.name?.split(' ')[0]||'Mitra'} 👋</Text>
            <Text style={{color:colors.text3,fontSize:13,marginTop:2}}>Selamat datang di Mikala Mitra</Text>
          </View>
          <View style={{flexDirection:'row',gap:8,alignItems:'center'}}>
            <TouchableOpacity onPress={()=>router.push('/(app)/notifikasi')}
              style={{width:40,height:40,borderRadius:12,backgroundColor:colors.glass,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.glassBorder,position:'relative'}}>
              <Ionicons name="notifications-outline" size={18} color={colors.text2}/>
              {unread > 0 && (
                <View style={{ position:'absolute', top:-4, right:-4, minWidth:16, height:16, borderRadius:8, backgroundColor:'#ef4444', alignItems:'center', justifyContent:'center', paddingHorizontal:3, borderWidth:1.5, borderColor:colors.bg }}>
                  <Text style={{ color:'white', fontSize:9, fontWeight:'800' }}>{unread > 9 ? '9+' : unread}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={{width:40,height:40,borderRadius:12,backgroundColor:colors.glass,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.glassBorder}}>
              <Ionicons name={isDark?'sunny-outline':'moon-outline'} size={18} color={isDark?'#fbbf24':'#7c3aed'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('/(app)/profile')} style={{width:40,height:40,borderRadius:12,backgroundColor:'rgba(124,58,237,0.2)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(124,58,237,0.3)'}}>
            <Text style={{color:colors.primary,fontSize:18,fontWeight:'700'}}>{user?.name?.[0]?.toUpperCase()||'M'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Card */}
        <View style={{backgroundColor:colors.glass,borderWidth:1,borderColor:colors.glassBorder,borderRadius:16,padding:16}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{color:colors.text3,fontSize:12}}>Status Rekrutmen</Text>
            <View style={{backgroundColor:`${statusColor[rekrutmen?.status_rekrutmen]||colors.warning}20`,borderWidth:1,borderColor:`${statusColor[rekrutmen?.status_rekrutmen]||colors.warning}40`,borderRadius:8,paddingHorizontal:10,paddingVertical:4}}>
              <Text style={{color:statusColor[rekrutmen?.status_rekrutmen]||colors.warning,fontSize:12,fontWeight:'600'}}>{statusLabel[rekrutmen?.status_rekrutmen]||'Pending'}</Text>
            </View>
          </View>
          {rekrutmen?.status_rekrutmen==='verified' && (
            <View style={{flexDirection:'row',gap:20,marginTop:12}}>
              <View>
                <Text style={{color:colors.text3,fontSize:11}}>Rate per Job</Text>
                <Text style={{color:colors.success,fontWeight:'700',fontSize:15}}>Rp {Number(rekrutmen?.price_rate||0).toLocaleString('id-ID')}</Text>
              </View>
              <View>
                <Text style={{color:colors.text3,fontSize:11}}>Payment</Text>
                <Text style={{color:colors.text2,fontWeight:'600',fontSize:14,textTransform:'capitalize'}}>{rekrutmen?.payment_type||'-'}</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Quick Menu */}
      <View style={{padding:20}}>
        <Text style={{color:colors.text,fontSize:16,fontWeight:'700',marginBottom:14}}>Menu Cepat</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
          {[
            {icon:'briefcase-outline',label:'Jobs',color:'#7c3aed',route:'/(app)/jobs'},
            {icon:'book-outline',label:'Pelatihan',color:'#0ea5e9',route:'/(app)/pelatihan'},
            {icon:'wallet-outline',label:'Gaji',color:'#10b981',route:'/(app)/gaji'},
            {icon:'calendar-outline',label:'Jadwal',color:'#f59e0b',route:'/(app)/gaji'},
          ].map(item=>(
            <TouchableOpacity key={item.label} onPress={()=>router.push(item.route as any)}
              style={{flex:1,minWidth:'45%',alignItems:'center',backgroundColor:colors.glass,borderWidth:1,borderColor:colors.glassBorder,borderRadius:16,padding:16}} activeOpacity={0.7}>
              <View style={{width:44,height:44,borderRadius:12,backgroundColor:`${item.color}20`,alignItems:'center',justifyContent:'center',marginBottom:8}}>
                <Ionicons name={item.icon as any} size={22} color={item.color}/>
              </View>
              <Text style={{color:colors.text2,fontSize:12,fontWeight:'500'}}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{height:100}}/>
    </ScrollView>
  );
}
