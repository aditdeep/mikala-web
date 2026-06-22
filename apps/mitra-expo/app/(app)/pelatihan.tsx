import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../lib/theme';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

const KAT_COLOR: any = { 'Dasar': '#7c3aed', 'PHC': '#0ea5e9' };
const KAT_EMOJI: any = { 'Dasar': '📚', 'PHC': '🏥' };

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Ionicons key={i} name="star" size={size} color="#fbbf24"/>);
    } else if (i - 0.5 <= rating) {
      stars.push(<Ionicons key={i} name="star-half" size={size} color="#fbbf24"/>);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={size} color="rgba(255,255,255,0.2)"/>);
    }
  }
  return <View style={{ flexDirection:'row', gap:2 }}>{stars}</View>;
}

export default function PelatihanScreen() {
  const { colors, isDark } = useTheme();
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['Dasar','PHC']);
  const [showSertifikat, setShowSertifikat] = useState(false);

  useEffect(() => { loadData(); }, []);
  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    try {
      const res = await api.get('/mitra/pelatihan-saya');
      setData(res.data);
    } catch (e) { console.log('Pelatihan error:', e); }
    setLoading(false); setRefreshing(false);
  };

  if (loading) return (
    <View style={{flex:1,backgroundColor:colors.bg,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" color="#7c3aed"/>
    </View>
  );

  const total       = data?.total || 0;
  const selesai     = data?.selesai || 0;
  const persen      = data?.persen || 0;
  const nilaiRata   = data?.nilai_rata || 0;
  const statusLulus = data?.status_lulus || 'training';
  const sertifikat  = data?.sertifikat;
  const byKat       = data?.by_kategori || [];

  const isLulus = statusLulus === 'lulus';
  const isFailed = statusLulus === 'tidak_lulus';

  return (
    <View style={{flex:1,backgroundColor:colors.bg}}>
      <LinearGradient colors={isDark?['#1a0f2e','#0f0f1a']:['#f0eeff','#f8f9fa']}
        style={{padding:20,paddingTop:56,paddingBottom:24}}>
        <Text style={{color:colors.text,fontSize:22,fontWeight:'800'}}>Pelatihan</Text>
        <Text style={{color:colors.text3,fontSize:13,marginTop:2}}>Progress training Anda</Text>

        {/* Progress overall + Rating */}
        <View style={{backgroundColor:colors.card,borderRadius:16,padding:16,marginTop:16,borderWidth:1,borderColor:colors.glassBorder}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <View>
              <Text style={{color:colors.text,fontWeight:'700',fontSize:14}}>Progress Keseluruhan</Text>
              <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}>
                <StarRating rating={nilaiRata} size={13}/>
                <Text style={{color:'#fbbf24',fontWeight:'700',fontSize:13}}>{nilaiRata.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={{color:'#7c3aed',fontWeight:'800',fontSize:18}}>{persen}%</Text>
          </View>
          <View style={{backgroundColor:'rgba(255,255,255,0.1)',borderRadius:99,height:8,overflow:'hidden'}}>
            <LinearGradient colors={['#7c3aed','#4f46e5']} style={{width:`${persen}%`,height:'100%'}}/>
          </View>
          <Text style={{color:colors.text3,fontSize:11,marginTop:8}}>{selesai} / {total} materi selesai</Text>
        </View>

        {/* Status Lulus */}
        {isLulus && (
          <TouchableOpacity onPress={()=>setShowSertifikat(true)}
            style={{marginTop:12,backgroundColor:'rgba(16,185,129,0.15)',borderWidth:1,borderColor:'rgba(16,185,129,0.4)',borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',gap:12}}>
            <View style={{width:42,height:42,borderRadius:13,backgroundColor:'rgba(16,185,129,0.2)',alignItems:'center',justifyContent:'center'}}>
              <Ionicons name="trophy" size={22} color="#10b981"/>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:'#10b981',fontWeight:'800',fontSize:15}}>🎉 LULUS Training!</Text>
              <Text style={{color:colors.text2,fontSize:12,marginTop:2}}>
                {sertifikat ? `Sertifikat: ${sertifikat.nomor_sertifikat}` : 'Menunggu penerbitan sertifikat'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#10b981"/>
          </TouchableOpacity>
        )}

        {isFailed && (
          <View style={{marginTop:12,backgroundColor:'rgba(239,68,68,0.12)',borderWidth:1,borderColor:'rgba(239,68,68,0.3)',borderRadius:14,padding:12,flexDirection:'row',gap:10,alignItems:'center'}}>
            <Ionicons name="alert-circle" size={18} color="#ef4444"/>
            <Text style={{color:'#ef4444',fontSize:12,flex:1}}>Rata-rata nilai belum mencapai 4.5. Silakan ikuti re-training.</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={{flex:1,padding:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadData();}} tintColor="#7c3aed"/>}>

        {/* Card 2 kategori (Dasar + PHC) seperti PWA */}
        {byKat.length > 0 && (
          <View style={{flexDirection:'row',gap:10,marginBottom:14}}>
            {byKat.map((k:any) => (
              <View key={k.kategori} style={{flex:1,backgroundColor:colors.card,borderWidth:1,borderColor:colors.glassBorder,borderRadius:14,padding:14}}>
                <Text style={{fontSize:13,marginBottom:2,color:colors.text}}>
                  {KAT_EMOJI[k.kategori]||'📖'} <Text style={{color:KAT_COLOR[k.kategori]||colors.text,fontWeight:'700'}}>{k.kategori}</Text>
                </Text>
                <Text style={{fontSize:20,fontWeight:'800',color:colors.text}}>{k.persen}%</Text>
                <Text style={{fontSize:11,color:colors.text3}}>{k.selesai}/{k.total} materi</Text>
                {k.rating_rata > 0 && (
                  <View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:6}}>
                    <StarRating rating={k.rating_rata} size={10}/>
                    <Text style={{color:'#fbbf24',fontSize:11,fontWeight:'700'}}>{k.rating_rata.toFixed(1)}</Text>
                  </View>
                )}
                <View style={{height:4,backgroundColor:'rgba(255,255,255,0.08)',borderRadius:99,marginTop:8,overflow:'hidden'}}>
                  <View style={{height:'100%',backgroundColor:KAT_COLOR[k.kategori]||'#7c3aed',width:`${k.persen}%`}}/>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Detail per kategori (collapsible) */}
        {byKat.map((kat:any) => {
          const isOpen = expanded.includes(kat.kategori);
          const items  = kat.materi || [];

          return (
            <View key={kat.kategori} style={{backgroundColor:colors.card,borderRadius:16,marginBottom:12,borderWidth:1,borderColor:colors.glassBorder,overflow:'hidden'}}>
              <TouchableOpacity onPress={()=>setExpanded(prev=>prev.includes(kat.kategori)?prev.filter(k=>k!==kat.kategori):[...prev,kat.kategori])}
                activeOpacity={0.8}
                style={{padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:10}}>
                  <Text style={{fontSize:14}}>{KAT_EMOJI[kat.kategori]||'📖'}</Text>
                  <Text style={{color:KAT_COLOR[kat.kategori]||colors.text,fontSize:13,fontWeight:'700'}}>Materi {kat.kategori}</Text>
                  <View style={{backgroundColor:colors.glass,borderRadius:99,paddingHorizontal:8,paddingVertical:2}}>
                    <Text style={{color:colors.text3,fontSize:11,fontWeight:'600'}}>{kat.selesai}/{kat.total}</Text>
                  </View>
                </View>
                <Ionicons name={isOpen?'chevron-up':'chevron-down'} size={16} color={colors.text3}/>
              </TouchableOpacity>

              {isOpen && items.map((m:any, i:number) => (
                <View key={m.id||i} style={{
                  flexDirection:'row', gap:10, padding:12, paddingTop:10,
                  borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.04)',
                  backgroundColor: m.checked ? 'rgba(16,185,129,0.04)' : 'transparent',
                  alignItems:'flex-start',
                }}>
                  {m.checked
                    ? <Ionicons name="checkmark-circle" size={16} color="#10b981" style={{marginTop:2}}/>
                    : <Ionicons name="ellipse-outline" size={16} color={colors.text3} style={{marginTop:2,opacity:0.4}}/>
                  }
                  <View style={{flex:1}}>
                    <Text style={{fontSize:12,color:m.checked?colors.text:colors.text3,lineHeight:18}}>
                      <Text style={{color:colors.text3,fontSize:10}}>{m.kode} </Text>
                      {m.nama}
                    </Text>
                    {m.checked && (
                      <View>
                        <Text style={{fontSize:10,color:'#10b981',marginTop:3}}>
                          ✓ {m.tanggal_dapat ? new Date(m.tanggal_dapat).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : '-'}
                          {m.pengajar && <Text style={{color:colors.text3}}> · {m.pengajar}</Text>}
                        </Text>
                        {m.rating > 0 && (
                          <View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:3}}>
                            <StarRating rating={m.rating} size={10}/>
                            <Text style={{color:'#fbbf24',fontSize:10,fontWeight:'700'}}>{Number(m.rating).toFixed(1)}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <View style={{height:120}}/>
      </ScrollView>

      {/* Modal Sertifikat */}
      <Modal visible={showSertifikat} animationType="fade" transparent>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center',padding:20}}>
          <View style={{backgroundColor:isDark?'#1a1a2e':'white',borderRadius:24,padding:24,width:'100%',maxWidth:400,alignItems:'center'}}>
            <View style={{width:72,height:72,borderRadius:20,backgroundColor:'rgba(16,185,129,0.15)',alignItems:'center',justifyContent:'center',marginBottom:16}}>
              <Ionicons name="trophy" size={40} color="#10b981"/>
            </View>
            <Text style={{color:colors.text,fontSize:22,fontWeight:'800',textAlign:'center'}}>🎉 Selamat Lulus!</Text>
            <Text style={{color:colors.text2,fontSize:14,textAlign:'center',marginTop:6}}>Anda telah menyelesaikan training</Text>
            <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:14,backgroundColor:'rgba(251,191,36,0.1)',borderRadius:12,paddingHorizontal:14,paddingVertical:8}}>
              <StarRating rating={nilaiRata} size={16}/>
              <Text style={{color:'#fbbf24',fontSize:16,fontWeight:'800'}}>{nilaiRata.toFixed(2)}/5.0</Text>
            </View>
            {sertifikat ? (
              <View style={{marginTop:20,width:'100%'}}>
                <View style={{backgroundColor:colors.glass,borderRadius:12,padding:14,marginBottom:12}}>
                  <Text style={{color:colors.text3,fontSize:11}}>Nomor Sertifikat</Text>
                  <Text style={{color:colors.text,fontSize:13,fontWeight:'700',marginTop:3}}>{sertifikat.nomor_sertifikat}</Text>
                </View>
                <View style={{backgroundColor:colors.glass,borderRadius:12,padding:14}}>
                  <Text style={{color:colors.text3,fontSize:11}}>Tanggal Terbit</Text>
                  <Text style={{color:colors.text,fontSize:13,fontWeight:'700',marginTop:3}}>
                    {new Date(sertifikat.tanggal_terbit).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{marginTop:16,backgroundColor:'rgba(245,158,11,0.1)',borderRadius:12,padding:14}}>
                <Text style={{color:'#f59e0b',fontSize:12,textAlign:'center'}}>⏳ Sertifikat sedang diproses oleh Training Center</Text>
              </View>
            )}
            <TouchableOpacity onPress={()=>setShowSertifikat(false)} style={{marginTop:20,backgroundColor:'#7c3aed',borderRadius:14,paddingHorizontal:32,paddingVertical:12}}>
              <Text style={{color:'white',fontWeight:'700',fontSize:14}}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
