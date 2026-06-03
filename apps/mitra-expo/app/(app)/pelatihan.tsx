import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../lib/theme';
import api from '../../lib/api';

export default function PelatihanScreen() {
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['Dasar']);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/mitra/pelatihan-saya');
      setData(res.data);
    } catch (e) { console.log('Pelatihan error:', e); }
    setLoading(false); setRefreshing(false);
  };

  const toggleKategori = (kat: string) => {
    setExpanded(prev => prev.includes(kat) ? prev.filter(k=>k!==kat) : [...prev,kat]);
  };

  if (loading) return (
    <View style={{flex:1,backgroundColor:Colors.dark,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  );

  const total   = data?.total || 0;
  const selesai = data?.selesai || 0;
  const persen  = data?.persen || 0;
  const byKat   = data?.by_kategori || [];

  return (
    <View style={{flex:1,backgroundColor:Colors.dark}}>
      <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{padding:20,paddingTop:56,paddingBottom:24}}>
        <Text style={{color:'white',fontSize:22,fontWeight:'800'}}>Pelatihan</Text>
        <Text style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:2}}>Progress materi training Anda</Text>

        <View style={{backgroundColor:'rgba(255,255,255,0.06)',borderRadius:16,padding:16,marginTop:16,borderWidth:1,borderColor:'rgba(255,255,255,0.1)'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
            <Text style={{color:'white',fontWeight:'700'}}>Progress Keseluruhan</Text>
            <Text style={{color:Colors.primary,fontWeight:'800',fontSize:16}}>{persen}%</Text>
          </View>
          <View style={{backgroundColor:'rgba(255,255,255,0.1)',borderRadius:99,height:8,overflow:'hidden'}}>
            <LinearGradient colors={['#7c3aed','#4f46e5']} style={{width:`${persen}%`,height:'100%',borderRadius:99}}/>
          </View>
          <Text style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:8}}>{selesai} / {total} materi selesai</Text>
        </View>
      </LinearGradient>

      <ScrollView style={{flex:1,padding:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadData();}} tintColor={Colors.primary}/>}>

        {byKat.length === 0 ? (
          <View style={{alignItems:'center',padding:48}}>
            <Ionicons name="book-outline" size={48} color="rgba(255,255,255,0.1)"/>
            <Text style={{color:'rgba(255,255,255,0.4)',fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada data pelatihan</Text>
          </View>
        ) : byKat.map((kat:any) => {
          const isOpen    = expanded.includes(kat.kategori);
          const katPersen = kat.persen || (kat.total > 0 ? Math.round((kat.selesai/kat.total)*100) : 0);
          const items     = kat.materi || [];

          return (
            <View key={kat.kategori} style={{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:16,marginBottom:12,borderWidth:1,borderColor:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
              <TouchableOpacity onPress={()=>toggleKategori(kat.kategori)} activeOpacity={0.8}
                style={{padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8}}>
                    <Text style={{color:'white',fontSize:15,fontWeight:'700'}}>{kat.kategori}</Text>
                    <View style={{backgroundColor:`${Colors.primary}20`,borderRadius:8,paddingHorizontal:8,paddingVertical:3}}>
                      <Text style={{color:Colors.primary,fontSize:11,fontWeight:'700'}}>{kat.selesai}/{kat.total}</Text>
                    </View>
                    <Text style={{color:katPersen===100?Colors.success:Colors.primary,fontSize:11,fontWeight:'700'}}>{katPersen}%</Text>
                  </View>
                  <View style={{backgroundColor:'rgba(255,255,255,0.1)',borderRadius:99,height:5,overflow:'hidden'}}>
                    <View style={{width:`${katPersen}%`,height:'100%',borderRadius:99,
                      backgroundColor:katPersen===100?Colors.success:Colors.primary}}/>
                  </View>
                </View>
                <Ionicons name={isOpen?'chevron-up':'chevron-down'} size={18} color="rgba(255,255,255,0.4)" style={{marginLeft:12}}/>
              </TouchableOpacity>

              {isOpen && items.map((m:any, i:number) => (
                <View key={m.id||i} style={{
                  flexDirection:'row', alignItems:'flex-start', gap:12,
                  padding:14, paddingTop:12,
                  borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.05)',
                  backgroundColor: m.checked ? 'rgba(16,185,129,0.03)' : 'transparent',
                }}>
                  {/* Checkbox */}
                  <View style={{
                    width:26, height:26, borderRadius:8, marginTop:1,
                    backgroundColor: m.checked ? `${Colors.success}20` : 'rgba(255,255,255,0.06)',
                    alignItems:'center', justifyContent:'center',
                    borderWidth:1, borderColor: m.checked ? `${Colors.success}50` : 'rgba(255,255,255,0.1)',
                    flexShrink:0,
                  }}>
                    {m.checked
                      ? <Ionicons name="checkmark" size={15} color={Colors.success}/>
                      : <Text style={{color:'rgba(255,255,255,0.25)',fontSize:10}}>{m.kode||i+1}</Text>
                    }
                  </View>

                  {/* Konten */}
                  <View style={{flex:1}}>
                    <Text style={{
                      color: m.checked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.9)',
                      fontSize:13, fontWeight:'500', lineHeight:18,
                      textDecorationLine: m.checked ? 'line-through' : 'none',
                    }}>
                      {m.kode ? `${m.kode}. ` : ''}{m.nama}
                    </Text>
                    {m.checked && (
                      <Text style={{color:'rgba(16,185,129,0.6)',fontSize:11,marginTop:3}}>
                        ✓ {m.tanggal_dapat ? new Date(m.tanggal_dapat).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}
                        {m.pengajar ? ` · ${m.pengajar}` : ''}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          );
        })}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
