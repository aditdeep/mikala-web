import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Plus, Check, X, Clock, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import apiClient from '../../lib/api';

export default function CutiScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [data, setData] = useState<any>({ data: [], stats: { max_per_bulan: 2, terpakai_bulanan: 0, sisa_bulanan: 2 } });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [alasan, setAlasan] = useState('');

  const fetchCuti = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/mitra/cuti');
      setData(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCuti(); }, []);

  const handleSubmit = async () => {
    if (!tanggalMulai || !tanggalSelesai || !alasan.trim()) {
      Alert.alert('Error', 'Lengkapi semua data cuti'); return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/mitra/cuti', { tanggal_mulai: tanggalMulai, tanggal_selesai: tanggalSelesai, alasan });
      Alert.alert('Berhasil', 'Pengajuan cuti dikirim, menunggu persetujuan');
      setShowForm(false);
      setTanggalMulai(''); setTanggalSelesai(''); setAlasan('');
      fetchCuti();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'gagal');
    }
    setSubmitting(false);
  };

  const getBadge = (s: string) => {
    const map: any = {
      pending:  { bg:'rgba(245,158,11,0.15)', color:'#f59e0b', label:'Pending', Icon: Clock },
      approved: { bg:'rgba(16,185,129,0.15)', color:'#10b981', label:'Disetujui', Icon: Check },
      rejected: { bg:'rgba(239,68,68,0.15)',  color:'#ef4444', label:'Ditolak', Icon: X },
    };
    return map[s] || map.pending;
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: colors.glass }]}>
          <ArrowLeft size={18} color={colors.text}/>
        </TouchableOpacity>
        <View style={{ flex:1, marginLeft:12 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>📅 Cuti</Text>
          <Text style={[styles.headerSub, { color: colors.text3 }]}>Ajukan & history cuti</Text>
        </View>
        <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addBtn}>
          <Plus size={14} color="white"/>
          <Text style={styles.addBtnText}>Ajukan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:80 }}>
        {/* Stats Quota */}
        <View style={[styles.quotaCard, { borderColor: 'rgba(124,58,237,0.3)' }]}>
          <Text style={[styles.quotaLabel, { color: colors.text3 }]}>Quota Cuti Bulan Ini</Text>
          <View style={{ flexDirection:'row', alignItems:'baseline', gap:6, marginTop:4 }}>
            <Text style={styles.quotaNumber}>{data.stats.sisa_bulanan}</Text>
            <Text style={[styles.quotaTotal, { color: colors.text3 }]}>/ {data.stats.max_per_bulan} hari tersisa</Text>
          </View>
          <Text style={[styles.quotaUsed, { color: colors.text3 }]}>
            Sudah digunakan: <Text style={{ color: colors.text, fontWeight:'700' }}>{data.stats.terpakai_bulanan} hari</Text>
          </Text>
        </View>

        {/* History */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 History Pengajuan</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#a78bfa" style={{ marginTop:20 }}/>
        ) : data.data.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={32} color={colors.text3} style={{ opacity:0.3 }}/>
            <Text style={[styles.emptyText, { color: colors.text3 }]}>Belum ada pengajuan cuti</Text>
          </View>
        ) : (
          data.data.map((c: any) => {
            const b = getBadge(c.status);
            return (
              <View key={c.id} style={[styles.cutiCard, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <View style={{ flex:1 }}>
                    <Text style={[styles.cutiDate, { color: colors.text }]}>
                      {new Date(c.tanggal_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'short'})} – {new Date(c.tanggal_selesai).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                    </Text>
                    <Text style={[styles.cutiHari, { color: colors.text3 }]}>{c.jumlah_hari} hari</Text>
                    <Text style={[styles.cutiAlasan, { color: colors.text2 }]}>{c.alasan}</Text>
                    {c.catatan_admin && (
                      <Text style={[styles.cutiCatatan, { color: colors.text3, backgroundColor: colors.bg }]}>💬 {c.catatan_admin}</Text>
                    )}
                  </View>
                  <View style={[styles.badge, { backgroundColor: b.bg }]}>
                    <b.Icon size={10} color={b.color}/>
                    <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal Form Ajukan */}
      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.bg }]}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>📝 Ajukan Cuti</Text>
              <TouchableOpacity onPress={() => setShowForm(false)} style={[styles.closeBtn, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                <X size={16} color={colors.text}/>
              </TouchableOpacity>
            </View>

            <View style={styles.quotaInfo}>
              <Text style={{ fontSize:12, color:'#f59e0b', fontWeight:'600' }}>⏳ Sisa quota bulan ini: {data.stats.sisa_bulanan} hari</Text>
              <Text style={{ fontSize:11, color: colors.text3, marginTop:2 }}>Max {data.stats.max_per_bulan} hari per bulan</Text>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text3 }]}>Tanggal Mulai *</Text>
            <TextInput value={tanggalMulai} onChangeText={setTanggalMulai} placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text3}
              style={[styles.input, { backgroundColor: colors.glass, borderColor: colors.border, color: colors.text }]}/>

            <Text style={[styles.fieldLabel, { color: colors.text3 }]}>Tanggal Selesai *</Text>
            <TextInput value={tanggalSelesai} onChangeText={setTanggalSelesai} placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text3}
              style={[styles.input, { backgroundColor: colors.glass, borderColor: colors.border, color: colors.text }]}/>

            <Text style={[styles.fieldLabel, { color: colors.text3 }]}>Alasan Cuti *</Text>
            <TextInput value={alasan} onChangeText={setAlasan} placeholder="Contoh: Acara keluarga"
              placeholderTextColor={colors.text3} multiline
              style={[styles.input, { backgroundColor: colors.glass, borderColor: colors.border, color: colors.text, minHeight:70, textAlignVertical:'top' }]}/>

            <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={[styles.submitBtn, submitting && { backgroundColor:'#666' }]}>
              <Text style={styles.submitBtnText}>{submitting ? '⏳ Mengirim...' : '📤 Kirim Pengajuan'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection:'row', alignItems:'center', padding:14, borderBottomWidth:1 },
  headerBtn: { width:34, height:34, borderRadius:10, justifyContent:'center', alignItems:'center' },
  headerTitle: { fontSize:18, fontWeight:'800' },
  headerSub: { fontSize:11, marginTop:1 },
  addBtn: { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'#7c3aed', borderRadius:10, paddingVertical:7, paddingHorizontal:12 },
  addBtnText: { color:'white', fontSize:12, fontWeight:'700' },
  quotaCard: { backgroundColor:'rgba(124,58,237,0.12)', borderRadius:14, padding:14, marginBottom:18, borderWidth:1 },
  quotaLabel: { fontSize:11 },
  quotaNumber: { fontSize:30, fontWeight:'800', color:'#a78bfa' },
  quotaTotal: { fontSize:13 },
  quotaUsed: { fontSize:11, marginTop:4 },
  sectionTitle: { fontSize:13, fontWeight:'700', marginBottom:10 },
  emptyState: { alignItems:'center', padding:40, gap:8 },
  emptyText: { fontSize:13 },
  cutiCard: { borderRadius:12, padding:12, marginBottom:8, borderWidth:1 },
  cutiDate: { fontSize:13, fontWeight:'700' },
  cutiHari: { fontSize:11, marginTop:2 },
  cutiAlasan: { fontSize:11, marginTop:6 },
  cutiCatatan: { fontSize:10, marginTop:6, fontStyle:'italic', padding:6, borderRadius:6 },
  badge: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:9, paddingVertical:3, borderRadius:8 },
  badgeText: { fontSize:11, fontWeight:'700' },
  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.75)', justifyContent:'flex-end' },
  modalContent: { borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, maxHeight:'85%' },
  modalTitle: { fontSize:16, fontWeight:'800' },
  closeBtn: { width:30, height:30, borderRadius:8, borderWidth:1, justifyContent:'center', alignItems:'center' },
  quotaInfo: { backgroundColor:'rgba(245,158,11,0.08)', borderColor:'rgba(245,158,11,0.25)', borderWidth:1, borderRadius:10, padding:10, marginBottom:14 },
  fieldLabel: { fontSize:12, fontWeight:'600', marginBottom:4, marginTop:4 },
  input: { borderWidth:1, borderRadius:10, padding:10, fontSize:13, marginBottom:10 },
  submitBtn: { backgroundColor:'#7c3aed', borderRadius:12, padding:13, alignItems:'center', marginTop:8 },
  submitBtnText: { color:'white', fontWeight:'700', fontSize:13 },
});
