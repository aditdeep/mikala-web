import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

// Tugas = penempatan mitra dari Deal Customer Care (cc_leads). Status diatur CC dari panel
// internal (Tandai Deal = berjalan, Stop = selesai), jadi mitra cuma lihat, tidak mengubah.
const STATUS_COLOR: any = { in_progress: '#10b981', completed: '#94a3b8' };
const STATUS_LABEL: any = { in_progress: 'Berjalan', completed: 'Selesai' };

const rupiah = (n: any) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const tgl = (d?: string | null, long = false) => d
  ? new Date(d).toLocaleDateString('id-ID', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' })
  : '-';
const toWa = (phone?: string | null) => {
  let p = String(phone || '').replace(/\D/g, '');
  if (p.startsWith('0')) p = '62' + p.slice(1);
  else if (p.startsWith('8')) p = '62' + p;
  return p;
};

export default function JobsScreen() {
  const { isDark, colors } = useTheme();
  const [jobs, setJobs]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter]     = useState('all');

  const grad: [string, string] = isDark ? ['#1a0f2e','#0f0f1a'] : ['#ede9fe','#f8f9fa'];

  useEffect(() => { loadJobs(); }, []);
  useFocusEffect(useCallback(() => { loadJobs(); }, []));

  const loadJobs = async () => {
    try {
      const res = await api.get('/mitra/jobs');
      setJobs(res.data.data || []);
    } catch (e) { console.log('Jobs error:', e); }
    setLoading(false); setRefreshing(false);
  };

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  if (loading) return <View style={{flex:1,backgroundColor:colors.bg,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color={colors.primary}/></View>;

  // Detail
  if (selected) {
    const p = selected.pasien || {};
    const pj = selected.klien || {};
    const alamat = selected.alamat_layanan || p.alamat;
    return (
      <View style={{flex:1,backgroundColor:colors.bg}}>
        <LinearGradient colors={grad} style={{padding:20,paddingTop:56}}>
          <TouchableOpacity onPress={()=>setSelected(null)} style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:20}}>
            <Ionicons name="arrow-back" size={20} color={colors.primary}/>
            <Text style={{color:colors.primary,fontSize:14}}>Kembali</Text>
          </TouchableOpacity>
          <Text style={{color:colors.text,fontSize:20,fontWeight:'800'}}>{p.nama_lengkap || 'Detail Tugas'}</Text>
          <Text style={{color:colors.text3,fontSize:13,marginTop:4}}>{selected.tipe_layanan}{selected.kode_order ? ` · ${selected.kode_order}` : ''}</Text>
          <View style={{marginTop:10,flexDirection:'row'}}>
            <View style={{backgroundColor:`${STATUS_COLOR[selected.status]}20`,borderRadius:8,paddingHorizontal:10,paddingVertical:4,borderWidth:1,borderColor:`${STATUS_COLOR[selected.status]}40`}}>
              <Text style={{color:STATUS_COLOR[selected.status],fontSize:12,fontWeight:'600'}}>{STATUS_LABEL[selected.status] || selected.status}</Text>
            </View>
          </View>
        </LinearGradient>
        <ScrollView style={{flex:1,padding:20}}>
          {/* Aksi cepat */}
          <View style={{flexDirection:'row',gap:10,marginBottom:14}}>
            {!!pj.phone && (
              <TouchableOpacity onPress={()=>Linking.openURL(`https://wa.me/${toWa(pj.phone)}`)} activeOpacity={0.8}
                style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,backgroundColor:'#25D366',borderRadius:12,padding:12}}>
                <Ionicons name="logo-whatsapp" size={16} color="white"/>
                <Text style={{color:'white',fontWeight:'700',fontSize:13}}>WA PJ</Text>
              </TouchableOpacity>
            )}
            {!!pj.phone && (
              <TouchableOpacity onPress={()=>Linking.openURL(`tel:${String(pj.phone).replace(/[^\d+]/g,'')}`)} activeOpacity={0.8}
                style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,backgroundColor:colors.glass,borderWidth:1,borderColor:colors.glassBorder,borderRadius:12,padding:12}}>
                <Ionicons name="call-outline" size={16} color={colors.text}/>
                <Text style={{color:colors.text,fontWeight:'700',fontSize:13}}>Telepon</Text>
              </TouchableOpacity>
            )}
            {!!alamat && (
              <TouchableOpacity onPress={()=>Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`)} activeOpacity={0.8}
                style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,backgroundColor:colors.glass,borderWidth:1,borderColor:colors.glassBorder,borderRadius:12,padding:12}}>
                <Ionicons name="map-outline" size={16} color={colors.text}/>
                <Text style={{color:colors.text,fontWeight:'700',fontSize:13}}>Peta</Text>
              </TouchableOpacity>
            )}
          </View>

          {[
            ['🧑‍🦽 Pasien', p.nama_lengkap || '-'],
            ['🎂 Tanggal Lahir', p.tanggal_lahir ? tgl(p.tanggal_lahir) : '-'],
            ['📍 Alamat', alamat || '-'],
            ['🩺 Diagnosa', [p.riwayat_penyakit, p.deskripsi_diagnosa].filter((v, i, a) => v && a.indexOf(v) === i).join(' — ') || '-'],
            ['🦽 Mobilisasi', p.mobilisasi || '-'],
            ['💊 Alat Medis', p.alat_medis || '-'],
            ['👤 Penanggung Jawab', pj.nama_lengkap ? `${pj.nama_lengkap}${pj.hubungan_dengan_pasien ? ` (${pj.hubungan_dengan_pasien})` : ''}` : '-'],
            ['📞 Kontak PJ', pj.phone || '-'],
            ['🧾 Jasa Disetujui', selected.deskripsi_layanan || '-'],
            ['📅 Mulai', tgl(selected.tanggal_mulai, true)],
            ...(selected.tanggal_selesai ? [['🏁 Selesai', tgl(selected.tanggal_selesai, true)]] : []),
            ['💼 Gaji / Bulan', selected.gaji_bulanan ? rupiah(selected.gaji_bulanan) : '-'],
            ['📆 Hari Berjalan', selected.total_hari != null ? `${selected.total_hari} hari` : '-'],
            ['💰 Estimasi Pendapatan', selected.estimasi_earning != null ? rupiah(selected.estimasi_earning) : '-'],
            ['📋 Catatan', selected.catatan || '-'],
          ].map(([label, val]) => (
            <View key={String(label)} style={{backgroundColor:colors.glass,borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:colors.glassBorder}}>
              <Text style={{color:colors.text3,fontSize:11,marginBottom:4}}>{label}</Text>
              <Text style={{color:colors.text,fontSize:14,fontWeight:'500'}}>{String(val)}</Text>
            </View>
          ))}
          <Text style={{color:colors.text3,fontSize:11,lineHeight:16,marginTop:4}}>
            Estimasi pendapatan dihitung kasar dari gaji/bulan. Angka resmi ada di menu Gaji setelah payroll diproses Finance. Perubahan jadwal/penempatan hubungi tim Customer Care.
          </Text>
          <View style={{height:120}}/>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{flex:1,backgroundColor:colors.bg}}>
      <LinearGradient colors={grad} style={{padding:20,paddingTop:56,paddingBottom:16}}>
        <Text style={{color:colors.text,fontSize:22,fontWeight:'800'}}>Tugas</Text>
        <Text style={{color:colors.text3,fontSize:13,marginTop:2}}>{jobs.filter(j=>j.status==='in_progress').length} penempatan berjalan · {jobs.length} total</Text>
      </LinearGradient>

      {/* Filter */}
      <View style={{flexDirection:'row',paddingHorizontal:16,paddingVertical:12}}>
        {[['all','Semua'],['in_progress','Berjalan'],['completed','Selesai']].map(([key,label])=>(
          <TouchableOpacity key={key} onPress={()=>setFilter(key)}
            style={{paddingHorizontal:14,paddingVertical:7,borderRadius:20,marginRight:8,backgroundColor:filter===key?colors.primary:colors.glass,borderWidth:1,borderColor:filter===key?colors.primary:colors.glassBorder}}>
            <Text style={{color:filter===key?'white':colors.text3,fontSize:12,fontWeight:'600'}}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{flex:1,paddingHorizontal:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadJobs();}} tintColor={colors.primary}/>}>
        {filtered.length === 0 ? (
          <View style={{alignItems:'center',padding:48}}>
            <Ionicons name="briefcase-outline" size={48} color={colors.text3}/>
            <Text style={{color:colors.text3,fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada tugas</Text>
            <Text style={{color:colors.text3,fontSize:12,marginTop:6,textAlign:'center'}}>Penempatan dari tim Customer Care akan muncul di sini.</Text>
          </View>
        ) : filtered.map(job => (
          <TouchableOpacity key={job.id} onPress={()=>setSelected(job)} activeOpacity={0.8}
            style={{backgroundColor:colors.glass,borderRadius:16,padding:16,marginBottom:12,borderWidth:1,borderColor:colors.glassBorder}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
              <View style={{flex:1,marginRight:12}}>
                <Text style={{color:colors.text,fontSize:15,fontWeight:'700',marginBottom:4}}>{job.pasien?.nama_lengkap || `Tugas #${job.id}`}</Text>
                <Text style={{color:colors.text3,fontSize:12,marginBottom:8}}>{job.tipe_layanan}</Text>
                <View style={{flexDirection:'row',gap:12,flexWrap:'wrap'}}>
                  {job.tanggal_mulai && <Text style={{color:colors.text3,fontSize:11}}>📅 {tgl(job.tanggal_mulai)}</Text>}
                  {job.gaji_bulanan ? <Text style={{color:colors.success,fontSize:11,fontWeight:'600'}}>💰 {rupiah(job.gaji_bulanan)}/bln</Text> : null}
                </View>
              </View>
              <View style={{backgroundColor:`${STATUS_COLOR[job.status]||'#f59e0b'}20`,borderRadius:8,paddingHorizontal:9,paddingVertical:4,borderWidth:1,borderColor:`${STATUS_COLOR[job.status]||'#f59e0b'}35`}}>
                <Text style={{color:STATUS_COLOR[job.status]||'#f59e0b',fontSize:11,fontWeight:'700'}}>{STATUS_LABEL[job.status]||job.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height:120}}/>
      </ScrollView>
    </View>
  );
}
