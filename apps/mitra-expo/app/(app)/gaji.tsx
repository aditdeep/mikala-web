import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert, TextInput, Modal, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';

const TABS = ['Payroll','Kredit','Kasbon','Fee'] as const;
type Tab = typeof TABS[number];

export default function GajiScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [tab, setTab]           = useState<Tab>('Payroll');
  const [payroll, setPayroll]   = useState<any[]>([]);
  const [kredit, setKredit]     = useState<any>(null);
  const [kasbon, setKasbon]     = useState<any[]>([]);
  const [fee, setFee]           = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  // Kasbon form
  const [showKasbonForm, setShowKasbonForm] = useState(false);
  const [kasbonJumlah, setKasbonJumlah]     = useState('');
  const [kasbonKeperluan, setKasbonKeperluan] = useState('');
  const [submitting, setSubmitting]           = useState(false);

  useEffect(() => { loadAll(); }, []);
  useFocusEffect(useCallback(() => { loadAll(); }, []));

  const loadAll = async () => {
    try {
      const [p, k, kb, f] = await Promise.all([
        api.get('/mitra/payroll').catch(()=>null),
        api.get('/mitra/kredit-pelatihan').catch(()=>null),
        api.get('/mitra/kasbon').catch(()=>null),
        api.get('/mitra/fee-saya').catch(()=>null),
      ]);
      setPayroll(p?.data?.data || []);
      setKredit(k?.data?.data || null);
      setKasbon(kb?.data?.data || []);
      setFee(f?.data?.data || f?.data || null);
    } catch {}
    setLoading(false); setRefreshing(false);
  };

  const submitKasbon = async () => {
    if (!kasbonJumlah || Number(kasbonJumlah) < 10000) {
      Alert.alert('Error', 'Jumlah kasbon minimal Rp 10.000'); return;
    }
    if (!kasbonKeperluan) { Alert.alert('Error', 'Keperluan wajib diisi'); return; }
    setSubmitting(true);
    try {
      await api.post('/mitra/kasbon', { jumlah: Number(kasbonJumlah), keperluan: kasbonKeperluan });
      Alert.alert('✅ Berhasil', 'Pengajuan kasbon berhasil dikirim. Menunggu persetujuan Finance.');
      setShowKasbonForm(false); setKasbonJumlah(''); setKasbonKeperluan('');
      loadAll();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Gagal mengajukan kasbon');
    }
    setSubmitting(false);
  };

  const statusColor: any = { pending:Colors.warning, paid:Colors.success, approved:Colors.success, rejected:Colors.error, proses:Colors.primary, active:'#0ea5e9', lunas:Colors.success };
  const statusLabel: any = { pending:'Menunggu', paid:'Dibayar ✓', approved:'Disetujui ✓', rejected:'Ditolak', proses:'Diproses', active:'Aktif', lunas:'Lunas ✓' };

  if (loading) return (
    <View style={{flex:1,backgroundColor:colors.bg,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  );

  // Payroll detail screen
  if (selectedPayroll) return (
    <View style={{flex:1,backgroundColor:colors.bg}}>
      <LinearGradient colors={isDark?['#1a0f2e','#0f0f1a']:['#f0eeff','#f8f9fa']} style={{padding:20,paddingTop:56}}>
        <TouchableOpacity onPress={()=>setSelectedPayroll(null)} style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:20}}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary}/>
          <Text style={{color:Colors.primary,fontSize:14,fontWeight:'600'}}>Kembali</Text>
        </TouchableOpacity>
        <Text style={{color:colors.text,fontSize:20,fontWeight:'800'}}>Detail Payroll</Text>
      </LinearGradient>
      <ScrollView style={{padding:20}}>
        <View style={{backgroundColor:`${Colors.primary}15`,borderRadius:20,padding:24,alignItems:'center',marginBottom:20,borderWidth:1,borderColor:`${Colors.primary}25`}}>
          <Text style={{color:colors.text2,fontSize:13,marginBottom:8}}>Total Gaji Bersih</Text>
          <Text style={{color:colors.text,fontSize:36,fontWeight:'800'}}>Rp {Number(selectedPayroll.total||selectedPayroll.gaji_bersih||0).toLocaleString('id-ID')}</Text>
          <View style={{marginTop:10,backgroundColor:`${statusColor[selectedPayroll.status]||Colors.warning}20`,borderRadius:10,paddingHorizontal:14,paddingVertical:6}}>
            <Text style={{color:statusColor[selectedPayroll.status]||Colors.warning,fontWeight:'700'}}>{statusLabel[selectedPayroll.status]||selectedPayroll.status}</Text>
          </View>
        </View>
        {[
          ['📅 Periode', selectedPayroll.periode||selectedPayroll.bulan||'-'],
          ['📋 Jumlah Job', String(selectedPayroll.jumlah_job||'-')],
          ['💵 Gaji Kotor', selectedPayroll.gaji_kotor?`Rp ${Number(selectedPayroll.gaji_kotor).toLocaleString('id-ID')}`:'-'],
          ['✂️ Potongan', `Rp ${Number(selectedPayroll.potongan||0).toLocaleString('id-ID')}`],
          ['🏦 Bank', selectedPayroll.bank_name||'-'],
          ['💳 Nomor Rekening', selectedPayroll.bank_account||'-'],
        ].map(([label,val])=>(
          <View key={String(label)} style={{backgroundColor:colors.card,borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:colors.glassBorder,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{color:colors.text2,fontSize:13}}>{label}</Text>
            <Text style={{color:colors.text,fontSize:13,fontWeight:'600',maxWidth:'55%',textAlign:'right'}}>{String(val)}</Text>
          </View>
        ))}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );

  return (
    <View style={{flex:1,backgroundColor:colors.bg}}>
      <LinearGradient colors={isDark?['#1a0f2e','#0f0f1a']:['#f0eeff','#f8f9fa']} style={{padding:20,paddingTop:56,paddingBottom:16}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View>
            <Text style={{color:colors.text,fontSize:22,fontWeight:'800'}}>Gaji & Keuangan</Text>
            <Text style={{color:colors.text3,fontSize:13,marginTop:2}}>Payroll, kredit, kasbon & fee</Text>
          </View>
          {tab === 'Kasbon' && (
            <TouchableOpacity onPress={()=>setShowKasbonForm(true)}
              style={{backgroundColor:Colors.primary,borderRadius:12,paddingHorizontal:14,paddingVertical:9,flexDirection:'row',alignItems:'center',gap:6}}>
              <Ionicons name="add" size={16} color="white"/>
              <Text style={{color:'white',fontWeight:'700',fontSize:13}}>Ajukan</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Card Cuti */}
      <TouchableOpacity onPress={() => router.push('/cuti')}
        style={{
          marginHorizontal:16, marginTop:12, marginBottom:4,
          backgroundColor:`${Colors.primary}15`,
          borderRadius:14, padding:14,
          flexDirection:'row', alignItems:'center', gap:12,
          borderWidth:1, borderColor:`${Colors.primary}30`,
        }}>
        <View style={{ width:42, height:42, borderRadius:12, backgroundColor:`${Colors.primary}30`, justifyContent:'center', alignItems:'center' }}>
          <Ionicons name="calendar-outline" size={22} color={Colors.primary}/>
        </View>
        <View style={{ flex:1 }}>
          <Text style={{ color:colors.text, fontSize:14, fontWeight:'700' }}>Ajukan Cuti</Text>
          <Text style={{ color:colors.text3, fontSize:11, marginTop:2 }}>Lihat quota & history pengajuan cuti</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.text3}/>
      </TouchableOpacity>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal:16,paddingVertical:10,maxHeight:52}}>
        {TABS.map(t=>(
          <TouchableOpacity key={t} onPress={()=>setTab(t)}
            style={{paddingHorizontal:16,paddingVertical:8,borderRadius:20,marginRight:8,
              backgroundColor:tab===t?Colors.primary:colors.card,
              borderWidth:1,borderColor:tab===t?Colors.primary:colors.glassBorder}}>
            <Text style={{color:tab===t?'white':colors.text2,fontSize:13,fontWeight:'600'}}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{flex:1,padding:16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadAll();}} tintColor={Colors.primary}/>}>

        {/* PAYROLL */}
        {tab === 'Payroll' && (
          payroll.length === 0 ? (
            <View style={{alignItems:'center',padding:48}}>
              <Ionicons name="wallet-outline" size={48} color={colors.text3}/>
              <Text style={{color:colors.text2,fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada data payroll</Text>
            </View>
          ) : payroll.map(p=>(
            <TouchableOpacity key={p.id} onPress={()=>setSelectedPayroll(p)} activeOpacity={0.8}
              style={{backgroundColor:colors.card,borderRadius:16,padding:16,marginBottom:12,borderWidth:1,borderColor:colors.glassBorder}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text style={{color:colors.text,fontSize:15,fontWeight:'700'}}>Periode {p.periode||p.bulan||`#${p.id}`}</Text>
                  <Text style={{color:Colors.success,fontSize:18,fontWeight:'800',marginTop:4}}>Rp {Number(p.total||p.gaji_bersih||0).toLocaleString('id-ID')}</Text>
                  {p.jumlah_job && <Text style={{color:colors.text3,fontSize:12,marginTop:3}}>{p.jumlah_job} job</Text>}
                </View>
                <View style={{alignItems:'flex-end',gap:8}}>
                  <View style={{backgroundColor:`${statusColor[p.status]||Colors.warning}20`,borderRadius:8,paddingHorizontal:10,paddingVertical:4}}>
                    <Text style={{color:statusColor[p.status]||Colors.warning,fontSize:11,fontWeight:'700'}}>{statusLabel[p.status]||p.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.text3}/>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* KREDIT PELATIHAN */}
        {tab === 'Kredit' && (
          !kredit ? (
            <View style={{alignItems:'center',padding:48}}>
              <Ionicons name="card-outline" size={48} color={colors.text3}/>
              <Text style={{color:colors.text2,fontSize:16,fontWeight:'600',marginTop:12}}>Tidak ada kredit pelatihan</Text>
              <Text style={{color:colors.text3,fontSize:13,marginTop:6,textAlign:'center'}}>Kamu menggunakan metode pembayaran Cash</Text>
            </View>
          ) : (
            <View>
              <LinearGradient
                colors={kredit.status==='lunas'?['#10b981','#059669']:['#ec4899','#be185d']}
                style={{borderRadius:20,padding:24,marginBottom:16}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <Text style={{color:'rgba(255,255,255,0.8)',fontSize:13}}>Status Kredit</Text>
                  <View style={{backgroundColor:'rgba(255,255,255,0.2)',borderRadius:99,paddingHorizontal:12,paddingVertical:4}}>
                    <Text style={{color:'white',fontSize:12,fontWeight:'600'}}>{statusLabel[kredit.status]||kredit.status}</Text>
                  </View>
                </View>
                <Text style={{color:'white',fontSize:32,fontWeight:'800'}}>Rp {Number(kredit.sisa_tagihan||0).toLocaleString('id-ID')}</Text>
                <Text style={{color:'rgba(255,255,255,0.7)',fontSize:12,marginBottom:12}}>Sisa tagihan</Text>
                <View style={{backgroundColor:'rgba(255,255,255,0.2)',borderRadius:99,height:6}}>
                  <View style={{height:'100%',backgroundColor:'white',borderRadius:99,
                    width:`${Math.min(((kredit.total_terbayar||0)/(kredit.total_biaya||1))*100,100)}%`}}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:6}}>
                  <Text style={{color:'rgba(255,255,255,0.7)',fontSize:11}}>Terbayar: Rp {Number(kredit.total_terbayar||0).toLocaleString('id-ID')}</Text>
                  <Text style={{color:'rgba(255,255,255,0.7)',fontSize:11}}>Total: Rp {Number(kredit.total_biaya||0).toLocaleString('id-ID')}</Text>
                </View>
              </LinearGradient>

              {/* Riwayat potongan */}
              {(kredit.potongan||[]).length > 0 && (
                <View>
                  <Text style={{color:colors.text,fontWeight:'700',fontSize:15,marginBottom:10}}>Riwayat Potongan</Text>
                  {(kredit.potongan||[]).map((p:any,i:number)=>(
                    <View key={i} style={{backgroundColor:colors.card,borderRadius:14,padding:14,marginBottom:8,borderWidth:1,borderColor:colors.glassBorder,flexDirection:'row',justifyContent:'space-between'}}>
                      <View>
                        <Text style={{color:colors.text,fontSize:13,fontWeight:'600'}}>Job #{p.order?.kode_order||p.order_id}</Text>
                        <Text style={{color:colors.text3,fontSize:11,marginTop:2}}>{p.order?.created_at?new Date(p.order.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):''}</Text>
                      </View>
                      <Text style={{color:Colors.error,fontSize:14,fontWeight:'700'}}>-Rp {Number(p.jumlah||0).toLocaleString('id-ID')}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        )}

        {/* KASBON */}
        {tab === 'Kasbon' && (
          <View>
            <View style={{backgroundColor:`${Colors.warning}10`,borderRadius:14,padding:14,marginBottom:16,flexDirection:'row',gap:10,borderWidth:1,borderColor:`${Colors.warning}25`}}>
              <Ionicons name="information-circle" size={18} color={Colors.warning}/>
              <Text style={{color:Colors.warning,fontSize:12,flex:1,lineHeight:18}}>Kasbon akan diproses oleh divisi Finance. Maksimal pencairan sesuai kebijakan perusahaan.</Text>
            </View>

            {kasbon.length === 0 ? (
              <View style={{alignItems:'center',padding:48}}>
                <Ionicons name="cash-outline" size={48} color={colors.text3}/>
                <Text style={{color:colors.text2,fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada kasbon</Text>
                <TouchableOpacity onPress={()=>setShowKasbonForm(true)}
                  style={{marginTop:16,backgroundColor:Colors.primary,borderRadius:12,paddingHorizontal:20,paddingVertical:11}}>
                  <Text style={{color:'white',fontWeight:'700'}}>+ Ajukan Kasbon</Text>
                </TouchableOpacity>
              </View>
            ) : kasbon.map(k=>(
              <View key={k.id} style={{backgroundColor:colors.card,borderRadius:16,padding:16,marginBottom:12,borderWidth:1,borderColor:colors.glassBorder}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <View style={{flex:1,marginRight:12}}>
                    <Text style={{color:colors.text,fontSize:16,fontWeight:'800'}}>Rp {Number(k.jumlah).toLocaleString('id-ID')}</Text>
                    <Text style={{color:colors.text2,fontSize:13,marginTop:4}}>{k.keperluan}</Text>
                    <Text style={{color:colors.text3,fontSize:11,marginTop:4}}>
                      {k.created_at?new Date(k.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):''}
                    </Text>
                    {k.catatan && <Text style={{color:Colors.warning,fontSize:12,marginTop:4}}>📝 {k.catatan}</Text>}
                  </View>
                  <View style={{backgroundColor:`${statusColor[k.status]||Colors.warning}20`,borderRadius:8,paddingHorizontal:10,paddingVertical:4}}>
                    <Text style={{color:statusColor[k.status]||Colors.warning,fontSize:11,fontWeight:'700'}}>{statusLabel[k.status]||k.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* FEE REFERRAL */}
        {tab === 'Fee' && (() => {
          const feeReferrer = fee?.fee_referrer || [];
          const myFee = fee?.referral;
          const totalFee = feeReferrer.reduce((sum:number, f:any) => sum + Number(f.fee_amount||0), 0);
          const totalPaid = feeReferrer.filter((f:any)=>f.fee_status==='paid').reduce((sum:number,f:any)=>sum+Number(f.fee_amount||0),0);
          const totalPending = feeReferrer.filter((f:any)=>f.fee_status==='pending').reduce((sum:number,f:any)=>sum+Number(f.fee_amount||0),0);

          return feeReferrer.length === 0 ? (
            <View style={{alignItems:'center',padding:48}}>
              <Ionicons name="people-outline" size={48} color={colors.text3}/>
              <Text style={{color:colors.text2,fontSize:16,fontWeight:'600',marginTop:12}}>Belum ada fee referral</Text>
              <Text style={{color:colors.text3,fontSize:13,marginTop:6,textAlign:'center'}}>Fee akan muncul ketika mitra yang Anda referensikan bergabung</Text>
            </View>
          ) : (
            <View>
              <LinearGradient colors={['#7c3aed','#4f46e5']} style={{borderRadius:20,padding:24,marginBottom:16,alignItems:'center'}}>
                <Text style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>Total Fee Referral</Text>
                <Text style={{color:'white',fontSize:36,fontWeight:'800',marginTop:4}}>
                  Rp {totalFee.toLocaleString('id-ID')}
                </Text>
                <View style={{flexDirection:'row',gap:24,marginTop:16}}>
                  <View style={{alignItems:'center'}}>
                    <Text style={{color:'rgba(255,255,255,0.6)',fontSize:11}}>Terbayar</Text>
                    <Text style={{color:Colors.success,fontSize:16,fontWeight:'700',marginTop:2}}>Rp {totalPaid.toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={{width:1,backgroundColor:'rgba(255,255,255,0.2)'}}/>
                  <View style={{alignItems:'center'}}>
                    <Text style={{color:'rgba(255,255,255,0.6)',fontSize:11}}>Pending</Text>
                    <Text style={{color:Colors.warning,fontSize:16,fontWeight:'700',marginTop:2}}>Rp {totalPending.toLocaleString('id-ID')}</Text>
                  </View>
                </View>
              </LinearGradient>

              {feeReferrer.map((f:any,i:number)=>(
                <View key={f.id||i} style={{backgroundColor:colors.card,borderRadius:16,padding:16,marginBottom:10,borderWidth:1,borderColor:colors.glassBorder}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <View style={{flex:1}}>
                      <Text style={{color:colors.text,fontSize:14,fontWeight:'600'}}>{f.mitra?.nama_lengkap||`Mitra #${f.mitra_id}`}</Text>
                      <Text style={{color:colors.text3,fontSize:12,marginTop:3}}>{f.created_at?new Date(f.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):''}</Text>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                      <Text style={{color:Colors.success,fontSize:15,fontWeight:'700'}}>+Rp {Number(f.fee_amount||0).toLocaleString('id-ID')}</Text>
                      <View style={{marginTop:4,backgroundColor:`${statusColor[f.fee_status]||Colors.warning}20`,borderRadius:6,paddingHorizontal:8,paddingVertical:3}}>
                        <Text style={{color:statusColor[f.fee_status]||Colors.warning,fontSize:11,fontWeight:'600'}}>{statusLabel[f.fee_status]||f.fee_status||'Pending'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })()}

        <View style={{height:100}}/>
      </ScrollView>

      {/* Modal Kasbon Form */}
      <Modal visible={showKasbonForm} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'flex-end'}}>
          <View style={{backgroundColor:isDark?'#1a1a2e':'white',borderTopLeftRadius:28,borderTopRightRadius:28,padding:24,paddingBottom:40}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <Text style={{color:colors.text,fontSize:18,fontWeight:'800'}}>Ajukan Kasbon</Text>
              <TouchableOpacity onPress={()=>setShowKasbonForm(false)}
                style={{backgroundColor:colors.glass,borderRadius:10,padding:8}}>
                <Ionicons name="close" size={18} color={colors.text2}/>
              </TouchableOpacity>
            </View>

            <Text style={{color:colors.text2,fontSize:12,marginBottom:6}}>Jumlah Kasbon (Rp)</Text>
            <TextInput value={kasbonJumlah} onChangeText={setKasbonJumlah}
              placeholder="Contoh: 500000" placeholderTextColor={colors.text3}
              keyboardType="number-pad"
              style={{backgroundColor:colors.input,borderWidth:1,borderColor:colors.inputBorder,borderRadius:12,padding:13,color:colors.text,fontSize:14,marginBottom:14}}/>

            <Text style={{color:colors.text2,fontSize:12,marginBottom:6}}>Keperluan</Text>
            <TextInput value={kasbonKeperluan} onChangeText={setKasbonKeperluan}
              placeholder="Jelaskan keperluan kasbon..." placeholderTextColor={colors.text3}
              multiline numberOfLines={3}
              style={{backgroundColor:colors.input,borderWidth:1,borderColor:colors.inputBorder,borderRadius:12,padding:13,color:colors.text,fontSize:14,marginBottom:20,minHeight:80,textAlignVertical:'top'}}/>

            <TouchableOpacity onPress={submitKasbon} disabled={submitting} activeOpacity={0.8}>
              <LinearGradient colors={['#7c3aed','#4f46e5']} style={{padding:15,borderRadius:14,alignItems:'center'}}>
                {submitting?<ActivityIndicator color="white"/>:<Text style={{color:'white',fontSize:15,fontWeight:'700'}}>Kirim Pengajuan</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
