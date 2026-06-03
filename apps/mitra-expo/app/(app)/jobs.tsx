import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../lib/theme';
import api from '../../lib/api';

const STATUS_COLOR: any = {
  available: Colors.success, confirmed: Colors.primary,
  in_progress: Colors.warning, completed: '#94a3b8', cancelled: Colors.error,
};
const STATUS_LABEL: any = {
  available: 'Tersedia', confirmed: 'Dikonfirmasi',
  in_progress: 'Berlangsung', completed: 'Selesai', cancelled: 'Dibatalkan',
};

export default function JobsScreen() {
  const [jobs, setJobs]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter]     = useState('all');

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get('/mitra/jobs');
      setJobs(res.data.data || []);
    } catch (e) { console.log('Jobs error:', e); }
    setLoading(false); setRefreshing(false);
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    try {
      await api.patch(`/mitra/jobs/${id}/status`, { status });
      Alert.alert('✅ Berhasil', `Status job berhasil diubah ke ${STATUS_LABEL[status]}`);
      loadJobs(); setSelected(null);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Gagal mengubah status');
    }
    setUpdating(false);
  };

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  if (loading) return <View style={{flex:1,backgroundColor:Colors.dark,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color={Colors.primary}/></View>;

  // Detail modal
  if (selected) return (
    <View style={{flex:1,backgroundColor:Colors.dark}}>
      <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{padding:20,paddingTop:56}}>
        <TouchableOpacity onPress={()=>setSelected(null)} style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:20}}>
          <Ionicons name="arrow-back" size={20} color="rgba(167,139,250,0.7)"/>
          <Text style={{color:'rgba(167,139,250,0.7)',fontSize:14}}>Kembali</Text>
        </TouchableOpacity>
        <Text style={{color:'white',fontSize:20,fontWeight:'800'}}>{selected.title||selected.layanan_nama||'Detail Job'}</Text>
        <View style={{marginTop:8,flexDirection:'row',alignItems:'center',gap:8}}>
          <View style={{backgroundColor:`${STATUS_COLOR[selected.status]}20`,borderRadius:8,paddingHorizontal:10,paddingVertical:4,borderWidth:1,borderColor:`${STATUS_COLOR[selected.status]}40`}}>
            <Text style={{color:STATUS_COLOR[selected.status],fontSize:12,fontWeight:'600'}}>{STATUS_LABEL[selected.status]}</Text>
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={{flex:1,padding:20}}>
        {[
          ['👤 Klien', selected.klien_nama||selected.klien?.name||'-'],
          ['📍 Alamat', selected.alamat||selected.klien_alamat||'-'],
          ['📅 Tanggal', selected.tanggal_mulai ? new Date(selected.tanggal_mulai).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '-'],
          ['⏱ Durasi', selected.durasi ? `${selected.durasi} hari` : '-'],
          ['💰 Harga', selected.harga ? `Rp ${Number(selected.harga).toLocaleString('id-ID')}` : '-'],
          ['📋 Catatan', selected.catatan||selected.notes||'-'],
        ].map(([label, val]) => (
          <View key={String(label)} style={{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:'rgba(255,255,255,0.08)'}}>
            <Text style={{color:'rgba(255,255,255,0.4)',fontSize:11,marginBottom:4}}>{label}</Text>
            <Text style={{color:'white',fontSize:14,fontWeight:'500'}}>{String(val)}</Text>
          </View>
        ))}

        {/* Action buttons */}
        <View style={{gap:10,marginTop:8}}>
          {selected.status === 'confirmed' && (
            <TouchableOpacity onPress={()=>Alert.alert('Mulai Job','Konfirmasi mulai job ini?',[{text:'Batal',style:'cancel'},{text:'Mulai',onPress:()=>updateStatus(selected.id,'in_progress')}])} disabled={updating}>
              <LinearGradient colors={['#0ea5e9','#0284c7']} style={{padding:14,borderRadius:14,alignItems:'center'}}>
                {updating?<ActivityIndicator color="white"/>:<Text style={{color:'white',fontWeight:'700'}}>▶ Mulai Job</Text>}
              </LinearGradient>
            </TouchableOpacity>
          )}
          {selected.status === 'in_progress' && (
            <TouchableOpacity onPress={()=>Alert.alert('Selesaikan Job','Konfirmasi job ini sudah selesai?',[{text:'Batal',style:'cancel'},{text:'Selesai',onPress:()=>updateStatus(selected.id,'completed')}])} disabled={updating}>
              <LinearGradient colors={['#10b981','#059669']} style={{padding:14,borderRadius:14,alignItems:'center'}}>
                {updating?<ActivityIndicator color="white"/>:<Text style={{color:'white',fontWeight:'700'}}>✅ Tandai Selesai</Text>}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );

  return (
    <View style={{flex:1,backgroundColor:Colors.dark}}>
      <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{padding:20,paddingTop:56,paddingBottom:16}}>
        <Text style={{color:'white',fontSize:22,fontWeight:'800'}}>Jobs</Text>
        <Text style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:2}}>{jobs.length} total job</Text>
      </LinearGradient>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal:16,paddingVertical:12,maxHeight:56}}>
        {[['all','Semua'],['available','Tersedia'],['confirmed','Dikonfirmasi'],['in_progress','Berlangsung'],['completed','Selesai']].map(([key,label])=>(
          <TouchableOpacity key={key} onPress={()=>setFilter(key)}
            style={{paddingHorizontal:14,paddingVertical:7,borderRadius:20,marginRight:8,backgroundColor:filter===key?Colors.primary:'rgba(255,255,255,0.07)',borderWidth:1,borderColor:filter===key?Colors.primary:'rgba(255,255,255,0.1)'}}>
            <Text style={{color:filter===key?'white':'rgba(255,255,255,0.5)',fontSize:12,fontWeight:'600'}}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{flex:1,padding:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadJobs();}} tintColor={Colors.primary}/>}>
        {filtered.length === 0 ? (
          <View style={{alignItems:'center',padding:48}}>
            <Ionicons name="briefcase-outline" size={48} color="rgba(255,255,255,0.1)"/>
            <Text style={{color:'rgba(255,255,255,0.4)',fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada job</Text>
          </View>
        ) : filtered.map(job => (
          <TouchableOpacity key={job.id} onPress={()=>setSelected(job)} activeOpacity={0.8}
            style={{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:16,padding:16,marginBottom:12,borderWidth:1,borderColor:'rgba(255,255,255,0.08)'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
              <View style={{flex:1,marginRight:12}}>
                <Text style={{color:'white',fontSize:15,fontWeight:'700',marginBottom:4}}>{job.title||job.layanan_nama||`Job #${job.id}`}</Text>
                <Text style={{color:'rgba(255,255,255,0.5)',fontSize:12,marginBottom:8}}>👤 {job.klien_nama||job.klien?.name||'-'}</Text>
                <View style={{flexDirection:'row',gap:12}}>
                  {job.tanggal_mulai && <Text style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>📅 {new Date(job.tanggal_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</Text>}
                  {job.harga && <Text style={{color:Colors.success,fontSize:11,fontWeight:'600'}}>💰 Rp {Number(job.harga).toLocaleString('id-ID')}</Text>}
                </View>
              </View>
              <View style={{backgroundColor:`${STATUS_COLOR[job.status]||Colors.warning}20`,borderRadius:8,paddingHorizontal:9,paddingVertical:4,borderWidth:1,borderColor:`${STATUS_COLOR[job.status]||Colors.warning}35`}}>
                <Text style={{color:STATUS_COLOR[job.status]||Colors.warning,fontSize:11,fontWeight:'700'}}>{STATUS_LABEL[job.status]||job.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
