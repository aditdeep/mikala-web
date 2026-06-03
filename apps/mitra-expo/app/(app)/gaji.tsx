import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../lib/theme';
import api from '../../lib/api';

const TAB = ['Payroll','Fee Referral'] as const;

export default function GajiScreen() {
  const [tab, setTab]           = useState<'Payroll'|'Fee Referral'>('Payroll');
  const [payroll, setPayroll]   = useState<any[]>([]);
  const [fee, setFee]           = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [p, f] = await Promise.all([
        api.get('/mitra/payroll').catch(()=>null),
        api.get('/mitra/fee-saya').catch(()=>null),
      ]);
      setPayroll(p?.data?.data || []);
      setFee(f?.data?.data || f?.data || null);
    } catch (e) { console.log('Gaji error:', e); }
    setLoading(false); setRefreshing(false);
  };

  const statusColor: any = { pending:Colors.warning, paid:Colors.success, cancelled:Colors.error, proses:Colors.primary };
  const statusLabel: any = { pending:'Menunggu', paid:'Dibayar ✓', cancelled:'Dibatalkan', proses:'Diproses' };

  if (loading) return <View style={{flex:1,backgroundColor:Colors.dark,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color={Colors.primary}/></View>;

  // Payroll detail
  if (selectedPayroll) return (
    <View style={{flex:1,backgroundColor:Colors.dark}}>
      <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{padding:20,paddingTop:56}}>
        <TouchableOpacity onPress={()=>setSelectedPayroll(null)} style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:20}}>
          <Ionicons name="arrow-back" size={20} color="rgba(167,139,250,0.7)"/>
          <Text style={{color:'rgba(167,139,250,0.7)',fontSize:14}}>Kembali</Text>
        </TouchableOpacity>
        <Text style={{color:'white',fontSize:20,fontWeight:'800'}}>Detail Payroll</Text>
        <Text style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:4}}>Periode: {selectedPayroll.periode||selectedPayroll.bulan||'-'}</Text>
      </LinearGradient>
      <ScrollView style={{padding:20}}>
        <View style={{backgroundColor:'rgba(124,58,237,0.1)',borderRadius:20,padding:24,alignItems:'center',marginBottom:20,borderWidth:1,borderColor:'rgba(124,58,237,0.2)'}}>
          <Text style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:8}}>Total Gaji</Text>
          <Text style={{color:'white',fontSize:36,fontWeight:'800'}}>Rp {Number(selectedPayroll.total||selectedPayroll.gaji_bersih||0).toLocaleString('id-ID')}</Text>
          <View style={{marginTop:10,backgroundColor:`${statusColor[selectedPayroll.status]}20`,borderRadius:10,paddingHorizontal:14,paddingVertical:6,borderWidth:1,borderColor:`${statusColor[selectedPayroll.status]}40`}}>
            <Text style={{color:statusColor[selectedPayroll.status],fontWeight:'700'}}>{statusLabel[selectedPayroll.status]||selectedPayroll.status}</Text>
          </View>
        </View>
        {[
          ['📋 Jumlah Job', selectedPayroll.jumlah_job||'-'],
          ['💵 Gaji Kotor', selectedPayroll.gaji_kotor ? `Rp ${Number(selectedPayroll.gaji_kotor).toLocaleString('id-ID')}` : '-'],
          ['✂️ Potongan', selectedPayroll.potongan ? `Rp ${Number(selectedPayroll.potongan).toLocaleString('id-ID')}` : 'Rp 0'],
          ['🏦 Bank', selectedPayroll.bank_name||'-'],
          ['💳 Rekening', selectedPayroll.bank_account||'-'],
          ['📅 Tanggal Bayar', selectedPayroll.tanggal_bayar ? new Date(selectedPayroll.tanggal_bayar).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : '-'],
        ].map(([label,val])=>(
          <View key={String(label)} style={{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:'rgba(255,255,255,0.08)',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>{label}</Text>
            <Text style={{color:'white',fontSize:13,fontWeight:'600'}}>{String(val)}</Text>
          </View>
        ))}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );

  return (
    <View style={{flex:1,backgroundColor:Colors.dark}}>
      <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{padding:20,paddingTop:56,paddingBottom:16}}>
        <Text style={{color:'white',fontSize:22,fontWeight:'800'}}>Gaji & Fee</Text>
        <Text style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:2}}>Riwayat pembayaran Anda</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={{flexDirection:'row',padding:16,gap:8}}>
        {TAB.map(t=>(
          <TouchableOpacity key={t} onPress={()=>setTab(t)}
            style={{flex:1,padding:11,borderRadius:12,alignItems:'center',backgroundColor:tab===t?Colors.primary:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:tab===t?Colors.primary:'rgba(255,255,255,0.1)'}}>
            <Text style={{color:tab===t?'white':'rgba(255,255,255,0.5)',fontSize:13,fontWeight:'600'}}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{flex:1,padding:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadAll();}} tintColor={Colors.primary}/>}>

        {tab === 'Payroll' && (
          payroll.length === 0 ? (
            <View style={{alignItems:'center',padding:48}}>
              <Ionicons name="wallet-outline" size={48} color="rgba(255,255,255,0.1)"/>
              <Text style={{color:'rgba(255,255,255,0.4)',fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada data payroll</Text>
            </View>
          ) : payroll.map(p=>(
            <TouchableOpacity key={p.id} onPress={()=>setSelectedPayroll(p)} activeOpacity={0.8}
              style={{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:16,padding:16,marginBottom:12,borderWidth:1,borderColor:'rgba(255,255,255,0.08)'}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text style={{color:'white',fontSize:15,fontWeight:'700'}}>Periode {p.periode||p.bulan||`#${p.id}`}</Text>
                  <Text style={{color:Colors.success,fontSize:18,fontWeight:'800',marginTop:4}}>Rp {Number(p.total||p.gaji_bersih||0).toLocaleString('id-ID')}</Text>
                  <Text style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:4}}>{p.jumlah_job ? `${p.jumlah_job} job` : ''}</Text>
                </View>
                <View style={{alignItems:'flex-end',gap:8}}>
                  <View style={{backgroundColor:`${statusColor[p.status]}20`,borderRadius:8,paddingHorizontal:10,paddingVertical:4,borderWidth:1,borderColor:`${statusColor[p.status]}40`}}>
                    <Text style={{color:statusColor[p.status],fontSize:11,fontWeight:'700'}}>{statusLabel[p.status]||p.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)"/>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {tab === 'Fee Referral' && (
          !fee ? (
            <View style={{alignItems:'center',padding:48}}>
              <Ionicons name="people-outline" size={48} color="rgba(255,255,255,0.1)"/>
              <Text style={{color:'rgba(255,255,255,0.4)',fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada data fee referral</Text>
            </View>
          ) : (
            <View>
              {/* Summary card */}
              <LinearGradient colors={['#7c3aed','#4f46e5']} style={{borderRadius:20,padding:24,marginBottom:16,alignItems:'center'}}>
                <Text style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>Total Fee Referral</Text>
                <Text style={{color:'white',fontSize:36,fontWeight:'800',marginTop:4}}>
                  Rp {Number(fee.total_fee||fee.total||0).toLocaleString('id-ID')}
                </Text>
                <View style={{flexDirection:'row',gap:24,marginTop:16}}>
                  <View style={{alignItems:'center'}}>
                    <Text style={{color:'rgba(255,255,255,0.6)',fontSize:11}}>Terbayar</Text>
                    <Text style={{color:Colors.success,fontSize:16,fontWeight:'700',marginTop:2}}>Rp {Number(fee.total_dibayar||0).toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={{width:1,backgroundColor:'rgba(255,255,255,0.2)'}}/>
                  <View style={{alignItems:'center'}}>
                    <Text style={{color:'rgba(255,255,255,0.6)',fontSize:11}}>Pending</Text>
                    <Text style={{color:Colors.warning,fontSize:16,fontWeight:'700',marginTop:2}}>Rp {Number(fee.total_pending||0).toLocaleString('id-ID')}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Fee logs */}
              {(fee.logs||fee.data||[]).map((f:any,i:number)=>(
                <View key={f.id||i} style={{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:16,padding:16,marginBottom:10,borderWidth:1,borderColor:'rgba(255,255,255,0.08)'}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <View style={{flex:1}}>
                      <Text style={{color:'white',fontSize:14,fontWeight:'600'}}>{f.nama_mitra||f.mitra_nama||`Referral #${f.id}`}</Text>
                      <Text style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:3}}>{f.created_at ? new Date(f.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}</Text>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                      <Text style={{color:Colors.success,fontSize:15,fontWeight:'700'}}>+Rp {Number(f.jumlah||f.amount||0).toLocaleString('id-ID')}</Text>
                      <View style={{marginTop:4,backgroundColor:`${statusColor[f.status]||Colors.warning}20`,borderRadius:6,paddingHorizontal:8,paddingVertical:3}}>
                        <Text style={{color:statusColor[f.status]||Colors.warning,fontSize:11,fontWeight:'600'}}>{statusLabel[f.status]||f.status||'Pending'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )
        )}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
