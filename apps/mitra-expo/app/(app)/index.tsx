import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../lib/theme';
import api from '../../lib/api';
import { authService } from '../../lib/auth';

export default function HomeScreen() {
  const [user, setUser]       = useState<any>(null);
  const [rekrutmen, setRekrutmen] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const u = await authService.getUser();
      setUser(u);
      const r = await api.get('/mitra/status-rekrutmen').catch(()=>null);
      setRekrutmen(r?.data?.data);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  const statusColor: any = { pending:Colors.warning, verified:Colors.success, rejected:Colors.error };
  const statusLabel: any = { pending:'Menunggu Verifikasi', verified:'Terverifikasi ✓', rejected:'Ditolak' };

  if (loading) return <View style={{flex:1,backgroundColor:Colors.dark,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color={Colors.primary}/></View>;

  return (
    <ScrollView style={{flex:1,backgroundColor:Colors.dark}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadData();}} tintColor={Colors.primary}/>}>
      <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{padding:20,paddingTop:56}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <View>
            <Text style={{color:'white',fontSize:22,fontWeight:'800'}}>Halo, {user?.name?.split(' ')[0]||'Mitra'} 👋</Text>
            <Text style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:2}}>Selamat datang di Mikala Mitra</Text>
          </View>
          <TouchableOpacity onPress={()=>router.push('/(app)/profile')} style={{width:44,height:44,borderRadius:14,backgroundColor:'rgba(124,58,237,0.2)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(124,58,237,0.3)'}}>
            <Text style={{color:Colors.primary,fontSize:18,fontWeight:'700'}}>{user?.name?.[0]?.toUpperCase()||'M'}</Text>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={{backgroundColor:'rgba(255,255,255,0.06)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:16,padding:16}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{color:'rgba(255,255,255,0.5)',fontSize:12}}>Status Rekrutmen</Text>
            <View style={{backgroundColor:`${statusColor[rekrutmen?.status_rekrutmen]||Colors.warning}20`,borderWidth:1,borderColor:`${statusColor[rekrutmen?.status_rekrutmen]||Colors.warning}40`,borderRadius:8,paddingHorizontal:10,paddingVertical:4}}>
              <Text style={{color:statusColor[rekrutmen?.status_rekrutmen]||Colors.warning,fontSize:12,fontWeight:'600'}}>{statusLabel[rekrutmen?.status_rekrutmen]||'Pending'}</Text>
            </View>
          </View>
          {rekrutmen?.status_rekrutmen==='verified' && (
            <View style={{flexDirection:'row',gap:20,marginTop:12}}>
              <View>
                <Text style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>Rate per Job</Text>
                <Text style={{color:Colors.success,fontWeight:'700',fontSize:15}}>Rp {Number(rekrutmen?.price_rate||0).toLocaleString('id-ID')}</Text>
              </View>
              <View>
                <Text style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>Payment</Text>
                <Text style={{color:'rgba(255,255,255,0.7)',fontWeight:'600',fontSize:14,textTransform:'capitalize'}}>{rekrutmen?.payment_type||'-'}</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Quick Menu */}
      <View style={{padding:20}}>
        <Text style={{color:'white',fontSize:16,fontWeight:'700',marginBottom:14}}>Menu Cepat</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
          {[
            {icon:'briefcase-outline',label:'Jobs',color:'#7c3aed',route:'/(app)/jobs'},
            {icon:'book-outline',label:'Pelatihan',color:'#0ea5e9',route:'/(app)/pelatihan'},
            {icon:'wallet-outline',label:'Gaji',color:'#10b981',route:'/(app)/gaji'},
            {icon:'calendar-outline',label:'Jadwal',color:'#f59e0b',route:'/(app)/gaji'},
          ].map(item=>(
            <TouchableOpacity key={item.label} onPress={()=>router.push(item.route as any)}
              style={{flex:1,minWidth:'45%',alignItems:'center',backgroundColor:'rgba(255,255,255,0.06)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:16,padding:16}} activeOpacity={0.7}>
              <View style={{width:44,height:44,borderRadius:12,backgroundColor:`${item.color}20`,alignItems:'center',justifyContent:'center',marginBottom:8}}>
                <Ionicons name={item.icon as any} size={22} color={item.color}/>
              </View>
              <Text style={{color:'rgba(255,255,255,0.7)',fontSize:12,fontWeight:'500'}}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{height:100}}/>
    </ScrollView>
  );
}
