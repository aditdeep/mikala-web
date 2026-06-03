import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, RefreshControl, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Colors } from '../../lib/theme';
import api from '../../lib/api';
import { authService } from '../../lib/auth';

const CLOUDINARY_URL    = 'https://api.cloudinary.com/v1_1/djgtchmsx/image/upload';
const CLOUDINARY_PRESET = 'ml_default';

// Komponen Field yang stabil — tidak re-render parent saat ketik
const Field = ({ label, value, onChangeText, placeholder, secure, keyboard, multiline }: any) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput
      defaultValue={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.25)"
      style={[s.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
      secureTextEntry={secure}
      keyboardType={keyboard || 'default'}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      autoCorrect={false}
      autoCapitalize={secure ? 'none' : 'sentences'}
      blurOnSubmit={false}
    />
  </View>
);

export default function ProfileScreen() {
  const [user, setUser]       = useState<any>(null);
  const [mitra, setMitra]     = useState<any>(null);
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info'|'bank'|'password'>('info');
  const [fotoUrl, setFotoUrl] = useState('');

  // Gunakan ref untuk form — tidak trigger re-render saat ketik
  const form = {
    name:         { current: '' },
    phone:        { current: '' },
    alamat:       { current: '' },
    kota:         { current: '' },
    provinsi:     { current: '' },
    tglLahir:     { current: '' },
    jenisKelamin: { current: '' },
    pendidikan:   { current: '' },
    pengalaman:   { current: '' },
    bankName:     { current: '' },
    bankAcc:      { current: '' },
    bankAccName:  { current: '' },
    currentPass:  { current: '' },
    newPass:      { current: '' },
    confirmPass:  { current: '' },
  };

  // State hanya untuk jenis kelamin (karena pakai button toggle)
  const [jenisKelamin, setJenisKelamin] = useState('');
  // Key untuk reset form setelah load
  const [formKey, setFormKey] = useState(0);
  const [initialValues, setInitialValues] = useState<any>({});

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/mitra/profile');
      const { user: u, mitra: m, stats: st } = res.data.data;
      setUser(u); setMitra(m); setStats(st);
      setFotoUrl(m?.foto_url || '');
      setJenisKelamin(m?.jenis_kelamin || '');
      // Set initial values dan increment key untuk reset TextInput
      const vals = {
        name:         u?.name || '',
        phone:        u?.phone || '',
        alamat:       m?.alamat || '',
        kota:         m?.kota || '',
        provinsi:     m?.provinsi || '',
        tglLahir:     m?.tanggal_lahir?.split('T')[0] || '',
        pendidikan:   m?.pendidikan || '',
        pengalaman:   m?.pengalaman || '',
        bankName:     m?.bank_name || '',
        bankAcc:      m?.bank_account || '',
        bankAccName:  m?.bank_account_name || '',
        jenisKelamin: m?.jenis_kelamin || '',
      };
      setInitialValues(vals);
      // Set refs
      Object.entries(vals).forEach(([k,v]) => {
        if (form[k as keyof typeof form]) form[k as keyof typeof form].current = v as string;
      });
      setFormKey(prev => prev + 1);
    } catch (e) { console.log('Profile error:', e); }
    setLoading(false); setRefreshing(false);
  };

  const pickImage = () => {
    Alert.alert('Upload Foto', 'Pilih sumber foto', [
      { text: 'Kamera', onPress: openCamera },
      { text: 'Galeri', onPress: openGallery },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission', 'Izin kamera diperlukan'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1,1], quality: 0.7 });
    if (!result.canceled) uploadToCloudinary(result.assets[0].uri);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission', 'Izin galeri diperlukan'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.7, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) uploadToCloudinary(result.assets[0].uri);
  };

  const uploadToCloudinary = async (uri: string) => {
    setUploading(true);
    try {
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      const formData = new FormData();
      formData.append('file', { uri, name: filename, type } as any);
      formData.append('upload_preset', CLOUDINARY_PRESET);
      formData.append('folder', 'mikala/mitra');
      const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (data.secure_url) {
        setFotoUrl(data.secure_url);
        await api.patch('/mitra/profile', { foto_url: data.secure_url });
        Alert.alert('✅ Berhasil', 'Foto profil berhasil diupdate!');
      } else {
        Alert.alert('Error', data.error?.message || 'Gagal upload foto');
      }
    } catch (e: any) {
      Alert.alert('Error', 'Gagal upload: ' + e.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let payload: any = {};

      if (activeTab === 'password') {
        if (!form.currentPass.current) { Alert.alert('Error', 'Masukkan password saat ini'); setSaving(false); return; }
        if (form.newPass.current.length < 8) { Alert.alert('Error', 'Password baru minimal 8 karakter'); setSaving(false); return; }
        if (form.newPass.current !== form.confirmPass.current) { Alert.alert('Error', 'Konfirmasi password tidak cocok'); setSaving(false); return; }
        payload = {
          current_password:          form.currentPass.current,
          new_password:              form.newPass.current,
          new_password_confirmation: form.confirmPass.current,
        };
      } else {
        // Selalu kirim SEMUA field sekaligus — pakai initialValues sebagai fallback
        const tgl = form.tglLahir.current || initialValues.tglLahir || '';
        payload = {
          name:              form.name.current || initialValues.name || '',
          phone:             form.phone.current || initialValues.phone || '',
          alamat:            form.alamat.current !== '' ? form.alamat.current : (initialValues.alamat || ''),
          kota:              form.kota.current !== '' ? form.kota.current : (initialValues.kota || ''),
          provinsi:          form.provinsi.current !== '' ? form.provinsi.current : (initialValues.provinsi || ''),
          tanggal_lahir:     tgl || undefined,
          jenis_kelamin:     jenisKelamin || initialValues.jenisKelamin || undefined,
          pendidikan:        form.pendidikan.current !== '' ? form.pendidikan.current : (initialValues.pendidikan || ''),
          pengalaman:        form.pengalaman.current !== '' ? form.pengalaman.current : (initialValues.pengalaman || ''),
          bank_name:         form.bankName.current !== '' ? form.bankName.current : (initialValues.bankName || ''),
          bank_account:      form.bankAcc.current !== '' ? form.bankAcc.current : (initialValues.bankAcc || ''),
          bank_account_name: form.bankAccName.current !== '' ? form.bankAccName.current : (initialValues.bankAccName || ''),
        };
        // Hapus field undefined/null agar tidak override DB
        Object.keys(payload).forEach(k => {
          if (payload[k] === undefined || payload[k] === null) delete payload[k];
        });
      }

      const res = await api.patch('/mitra/profile', payload);
      if (res.data.success !== false) {
        Alert.alert('✅ Berhasil', 'Profil berhasil disimpan', [{ text: 'OK', onPress: loadProfile }]);
      } else {
        Alert.alert('Error', res.data.message || 'Gagal menyimpan');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal menyimpan profil');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: async () => {
        await authService.logout();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  if (loading) return (
    <View style={{ flex:1, backgroundColor:Colors.dark, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
      <ScrollView style={{ flex:1, backgroundColor:Colors.dark }} keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadProfile();}} tintColor={Colors.primary}/>}>

        {/* Header */}
        <LinearGradient colors={['#1a0f2e','#0f0f1a']} style={{ padding:20, paddingTop:56, alignItems:'center' }}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={{ marginBottom:16 }}>
            {fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={s.avatar}/>
            ) : (
              <View style={[s.avatar, { backgroundColor:'rgba(124,58,237,0.2)', alignItems:'center', justifyContent:'center' }]}>
                <Text style={{ color:Colors.primary, fontSize:40, fontWeight:'800' }}>{user?.name?.[0]?.toUpperCase()||'M'}</Text>
              </View>
            )}
            <View style={s.cameraBtn}>
              {uploading ? <ActivityIndicator size="small" color="white"/> : <Ionicons name="camera" size={14} color="white"/>}
            </View>
          </TouchableOpacity>
          <Text style={{ color:'white', fontSize:20, fontWeight:'800' }}>{user?.name||'-'}</Text>
          <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:3 }}>{user?.email}</Text>
          <View style={{ flexDirection:'row', gap:12, marginTop:20 }}>
            {[
              { label:'Total Jobs', val:stats?.total_orders||0, color:Colors.primary },
              { label:'Selesai',    val:stats?.completed_orders||0, color:Colors.success },
              { label:'Aktif',     val:stats?.active_orders||0, color:Colors.warning },
            ].map(st=>(
              <View key={st.label} style={{ flex:1, alignItems:'center', backgroundColor:'rgba(255,255,255,0.06)', borderRadius:14, padding:12 }}>
                <Text style={{ color:st.color, fontSize:22, fontWeight:'800' }}>{st.val}</Text>
                <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:11, marginTop:2 }}>{st.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={{ flexDirection:'row', padding:16, gap:8 }}>
          {([['info','👤 Info'],['bank','🏦 Bank'],['password','🔒 Password']] as const).map(([key,label])=>(
            <TouchableOpacity key={key} onPress={()=>setActiveTab(key)}
              style={{ flex:1, padding:10, borderRadius:12, alignItems:'center',
                backgroundColor: activeTab===key ? Colors.primary : 'rgba(255,255,255,0.05)',
                borderWidth:1, borderColor: activeTab===key ? Colors.primary : 'rgba(255,255,255,0.1)' }}>
              <Text style={{ color:activeTab===key?'white':'rgba(255,255,255,0.5)', fontSize:12, fontWeight:'600' }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding:16 }}>
          <View style={s.card} key={`${activeTab}-${formKey}`}>
            {activeTab === 'info' && <>
              <Text style={s.sectionTitle}>Informasi Pribadi</Text>
              <Field label="Nama Lengkap" value={initialValues.name} onChangeText={(v:string)=>form.name.current=v} placeholder="Nama lengkap"/>
              <Field label="Nomor HP" value={initialValues.phone} onChangeText={(v:string)=>form.phone.current=v} placeholder="08xx" keyboard="phone-pad"/>
              <Field label="Tanggal Lahir" value={initialValues.tglLahir} onChangeText={(v:string)=>form.tglLahir.current=v} placeholder="YYYY-MM-DD"/>
              <Text style={s.label}>Jenis Kelamin</Text>
              <View style={{ flexDirection:'row', gap:10, marginBottom:14 }}>
                {[['L','Laki-laki'],['P','Perempuan']].map(([val,lbl])=>(
                  <TouchableOpacity key={val} onPress={()=>setJenisKelamin(val)}
                    style={{ flex:1, padding:11, borderRadius:12, alignItems:'center',
                      backgroundColor: jenisKelamin===val?`${Colors.primary}25`:'rgba(255,255,255,0.05)',
                      borderWidth:1, borderColor: jenisKelamin===val?Colors.primary:'rgba(255,255,255,0.1)' }}>
                    <Text style={{ color:jenisKelamin===val?Colors.primary:'rgba(255,255,255,0.5)', fontWeight:'600', fontSize:13 }}>{lbl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Field label="Alamat" value={initialValues.alamat} onChangeText={(v:string)=>form.alamat.current=v} placeholder="Alamat lengkap"/>
              <Field label="Kota" value={initialValues.kota} onChangeText={(v:string)=>form.kota.current=v} placeholder="Kota"/>
              <Field label="Provinsi" value={initialValues.provinsi} onChangeText={(v:string)=>form.provinsi.current=v} placeholder="Provinsi"/>
              <Field label="Pendidikan" value={initialValues.pendidikan} onChangeText={(v:string)=>form.pendidikan.current=v} placeholder="D3/S1 Keperawatan..."/>
              <Field label="Pengalaman" value={initialValues.pengalaman} onChangeText={(v:string)=>form.pengalaman.current=v} placeholder="Pengalaman kerja..." multiline/>
            </>}

            {activeTab === 'bank' && <>
              <Text style={s.sectionTitle}>Informasi Bank</Text>
              <View style={{ backgroundColor:'rgba(245,158,11,0.1)', borderRadius:10, padding:12, marginBottom:16, flexDirection:'row', gap:8 }}>
                <Ionicons name="information-circle" size={16} color={Colors.warning}/>
                <Text style={{ color:Colors.warning, fontSize:12, flex:1 }}>Data rekening untuk pembayaran gaji dan kredit</Text>
              </View>
              <Field label="Nama Bank" value={initialValues.bankName} onChangeText={(v:string)=>form.bankName.current=v} placeholder="BCA / BRI / Mandiri..."/>
              <Field label="Nomor Rekening" value={initialValues.bankAcc} onChangeText={(v:string)=>form.bankAcc.current=v} placeholder="Nomor rekening" keyboard="number-pad"/>
              <Field label="Nama Pemilik Rekening" value={initialValues.bankAccName} onChangeText={(v:string)=>form.bankAccName.current=v} placeholder="Sesuai buku tabungan"/>
            </>}

            {activeTab === 'password' && <>
              <Text style={s.sectionTitle}>Ganti Password</Text>
              <Field label="Password Saat Ini" value="" onChangeText={(v:string)=>form.currentPass.current=v} placeholder="••••••••" secure/>
              <Field label="Password Baru" value="" onChangeText={(v:string)=>form.newPass.current=v} placeholder="Min. 8 karakter" secure/>
              <Field label="Konfirmasi Password Baru" value="" onChangeText={(v:string)=>form.confirmPass.current=v} placeholder="Ulangi password baru" secure/>
            </>}

            <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.8}>
              <LinearGradient colors={saving?['#4a3080','#3a2870']:['#7c3aed','#4f46e5']}
                style={{ padding:15, borderRadius:14, alignItems:'center', marginTop:8 }}>
                {saving ? <ActivityIndicator color="white"/> : <Text style={{ color:'white', fontSize:15, fontWeight:'700' }}>💾 Simpan Perubahan</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error}/>
            <Text style={{ color:Colors.error, fontSize:14, fontWeight:'700' }}>Keluar dari Akun</Text>
          </TouchableOpacity>
          <View style={{ height:100 }}/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  avatar:       { width:96, height:96, borderRadius:30, borderWidth:3, borderColor:'rgba(124,58,237,0.5)' },
  cameraBtn:    { position:'absolute', bottom:0, right:0, width:30, height:30, borderRadius:10, backgroundColor:Colors.primary, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'#0f0f1a' },
  card:         { backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:20, padding:20, marginBottom:16 },
  sectionTitle: { color:'white', fontSize:16, fontWeight:'700', marginBottom:16 },
  label:        { color:'rgba(167,139,250,0.8)', fontSize:12, fontWeight:'600', marginBottom:6 },
  input:        { backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:12, padding:13, color:'white', fontSize:14 },
  logoutBtn:    { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:'rgba(239,68,68,0.08)', borderWidth:1, borderColor:'rgba(239,68,68,0.25)', borderRadius:16, padding:16 },
});
