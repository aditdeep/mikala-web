import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, RefreshControl, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import api from '../../lib/api';
import { authService } from '../../lib/auth';

const CLOUDINARY_URL    = 'https://api.cloudinary.com/v1_1/djgtchmsx/image/upload';
const CLOUDINARY_PRESET = 'ml_default';

const makeStyles = (colors: any) => StyleSheet.create({
  avatar:       { width:96, height:96, borderRadius:30, borderWidth:3, borderColor:'rgba(124,58,237,0.5)' },
  cameraBtn:    { position:'absolute', bottom:0, right:0, width:30, height:30, borderRadius:10, backgroundColor:colors.primary, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:colors.bg },
  card:         { backgroundColor:colors.glass, borderWidth:1, borderColor:colors.glassBorder, borderRadius:20, padding:20, marginBottom:16 },
  sectionTitle: { color:colors.text, fontSize:16, fontWeight:'700', marginBottom:16 },
  label:        { color:colors.primary, fontSize:12, fontWeight:'600', marginBottom:6 },
  input:        { backgroundColor:colors.glass, borderWidth:1, borderColor:colors.glassBorder, borderRadius:12, padding:13, color:colors.text, fontSize:14 },
  logoutBtn:    { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:'rgba(239,68,68,0.08)', borderWidth:1, borderColor:'rgba(239,68,68,0.25)', borderRadius:16, padding:16 },
});

export default function ProfileScreen() {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);
  const grad: [string, string] = isDark ? ['#1a0f2e','#0f0f1a'] : ['#ede9fe','#f8f9fa'];

  // Field component (akses colors via closure)
  const Field = ({ label, value, onChangeText, placeholder, secure, keyboard, multiline, editable = true }: any) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        defaultValue={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text3}
        editable={editable}
        style={[s.input, multiline && { minHeight: 80, textAlignVertical: 'top' }, !editable && { opacity: 0.55, backgroundColor: colors.bg2 || colors.glass }]}
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

  const [user, setUser]       = useState<any>(null);
  const [mitra, setMitra]     = useState<any>(null);
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info'|'bank'|'password'>('info');
  const [editing, setEditing] = useState(false);
  const [fotoUrl, setFotoUrl] = useState('');

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

  const [jenisKelamin, setJenisKelamin] = useState('');
  const [formKey, setFormKey] = useState(0);
  const [initialValues, setInitialValues] = useState<any>({});

  useEffect(() => { loadProfile(); }, []);
  useFocusEffect(useCallback(() => { loadProfile(); }, []));

  const loadProfile = async () => {
    try {
      const res = await api.get('/mitra/profile');
      const { user: u, mitra: m, stats: st } = res.data.data;
      setUser(u); setMitra(m); setStats(st);
      setFotoUrl(m?.foto_url || '');
      setJenisKelamin(m?.jenis_kelamin || '');
      const vals = {
        name:         u?.name || '',
        phone:        u?.phone || '',
        alamat:       m?.alamat || '',
        kota:         m?.kota || '',
        provinsi:     m?.provinsi || '',
        tglLahir:     m?.tanggal_lahir?.split('T')[0] || '',
        pendidikan:   m?.pendidikan_terakhir || '',
        pengalaman:   m?.pengalaman || '',
        bankName:     m?.bank_name || '',
        bankAcc:      m?.bank_account || '',
        bankAccName:  m?.bank_account_name || '',
        jenisKelamin: m?.jenis_kelamin || '',
      };
      setInitialValues(vals);
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
        const tgl = form.tglLahir.current || initialValues.tglLahir || '';
        payload = {
          name:              form.name.current || initialValues.name || '',
          phone:             form.phone.current || initialValues.phone || '',
          alamat:            form.alamat.current !== '' ? form.alamat.current : (initialValues.alamat || ''),
          kota:              form.kota.current !== '' ? form.kota.current : (initialValues.kota || ''),
          provinsi:          form.provinsi.current !== '' ? form.provinsi.current : (initialValues.provinsi || ''),
          tanggal_lahir:     tgl || undefined,
          jenis_kelamin:     jenisKelamin || initialValues.jenisKelamin || undefined,
          pendidikan_terakhir: form.pendidikan.current !== '' ? form.pendidikan.current : (initialValues.pendidikan || ''),
          pengalaman:        form.pengalaman.current !== '' ? form.pengalaman.current : (initialValues.pengalaman || ''),
          bank_name:         form.bankName.current !== '' ? form.bankName.current : (initialValues.bankName || ''),
          bank_account:      form.bankAcc.current !== '' ? form.bankAcc.current : (initialValues.bankAcc || ''),
          bank_account_name: form.bankAccName.current !== '' ? form.bankAccName.current : (initialValues.bankAccName || ''),
        };
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
    <View style={{ flex:1, backgroundColor:colors.bg, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" color={colors.primary}/>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
      <ScrollView style={{ flex:1, backgroundColor:colors.bg }} keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);loadProfile();}} tintColor={colors.primary}/>}>

        {/* Header */}
        <LinearGradient colors={grad} style={{ padding:20, paddingTop:56, alignItems:'center' }}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={{ marginBottom:16 }}>
            {fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={s.avatar}/>
            ) : (
              <View style={[s.avatar, { backgroundColor:'rgba(124,58,237,0.2)', alignItems:'center', justifyContent:'center' }]}>
                <Text style={{ color:colors.primary, fontSize:40, fontWeight:'800' }}>{user?.name?.[0]?.toUpperCase()||'M'}</Text>
              </View>
            )}
            <View style={s.cameraBtn}>
              {uploading ? <ActivityIndicator size="small" color="white"/> : <Ionicons name="camera" size={14} color="white"/>}
            </View>
          </TouchableOpacity>
          <Text style={{ color:colors.text, fontSize:20, fontWeight:'800' }}>{user?.name||'-'}</Text>
          <Text style={{ color:colors.text3, fontSize:13, marginTop:3 }}>{user?.email}</Text>
          <View style={{ flexDirection:'row', gap:12, marginTop:20 }}>
            {[
              { label:'Total Jobs', val:stats?.total_orders||0, color:colors.primary },
              { label:'Selesai',    val:stats?.completed_orders||0, color:colors.success },
              { label:'Aktif',     val:stats?.active_orders||0, color:colors.warning },
            ].map(st=>(
              <View key={st.label} style={{ flex:1, alignItems:'center', backgroundColor:colors.glass, borderRadius:14, padding:12 }}>
                <Text style={{ color:st.color, fontSize:22, fontWeight:'800' }}>{st.val}</Text>
                <Text style={{ color:colors.text3, fontSize:11, marginTop:2 }}>{st.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={{ flexDirection:'row', padding:16, gap:8 }}>
          {([['info','👤 Info'],['bank','🏦 Bank'],['password','🔒 Password']] as const).map(([key,label])=>(
            <TouchableOpacity key={key} onPress={()=>setActiveTab(key)}
              style={{ flex:1, padding:10, borderRadius:12, alignItems:'center',
                backgroundColor: activeTab===key ? colors.primary : colors.glass,
                borderWidth:1, borderColor: activeTab===key ? colors.primary : colors.glassBorder }}>
              <Text style={{ color:activeTab===key?'white':colors.text3, fontSize:12, fontWeight:'600' }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding:16 }}>
          <View style={s.card} key={`${activeTab}-${formKey}`}>
            {activeTab === 'info' && <>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <Text style={[s.sectionTitle, { marginBottom:0 }]}>Informasi Pribadi</Text>
                {!editing ? (
                  <TouchableOpacity onPress={()=>setEditing(true)} style={{ flexDirection:'row', alignItems:'center', gap:5, paddingVertical:7, paddingHorizontal:13, borderRadius:10, backgroundColor:`${colors.primary}20`, borderWidth:1, borderColor:`${colors.primary}40` }}>
                    <Text style={{ color:colors.primary, fontSize:13, fontWeight:'700' }}>✏️ Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection:'row', gap:8 }}>
                    <TouchableOpacity onPress={()=>{ setEditing(false); setFormKey(k=>k+1); }} style={{ paddingVertical:7, paddingHorizontal:12, borderRadius:10, backgroundColor:colors.glass, borderWidth:1, borderColor:colors.glassBorder }}>
                      <Text style={{ color:colors.text3, fontSize:13, fontWeight:'600' }}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={saving} onPress={async()=>{ await handleSave(); setEditing(false); }} style={{ paddingVertical:7, paddingHorizontal:12, borderRadius:10, backgroundColor:colors.primary }}>
                      <Text style={{ color:'white', fontSize:13, fontWeight:'700' }}>{saving ? '...' : '💾 Simpan'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Field label="Nama Lengkap" value={initialValues.name} onChangeText={(v:string)=>form.name.current=v} placeholder="Nama lengkap" editable={editing}/>
              <Field label="Nomor HP" value={initialValues.phone} onChangeText={(v:string)=>form.phone.current=v} placeholder="08xx" keyboard="phone-pad" editable={editing}/>
              <Field label="Tanggal Lahir" value={initialValues.tglLahir} onChangeText={(v:string)=>form.tglLahir.current=v} placeholder="YYYY-MM-DD" editable={editing}/>
              <Text style={s.label}>Jenis Kelamin</Text>
              <View style={{ flexDirection:'row', gap:10, marginBottom:14 }}>
                {[['L','Laki-laki'],['P','Perempuan']].map(([val,lbl])=>(
                  <TouchableOpacity key={val} disabled={!editing} onPress={()=>setJenisKelamin(val)}
                    style={{ flex:1, padding:11, borderRadius:12, alignItems:'center',
                      backgroundColor: jenisKelamin===val?`${colors.primary}25`:colors.glass,
                      borderWidth:1, borderColor: jenisKelamin===val?colors.primary:colors.glassBorder }}>
                    <Text style={{ color:jenisKelamin===val?colors.primary:colors.text3, fontWeight:'600', fontSize:13 }}>{lbl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Field label="Alamat" value={initialValues.alamat} onChangeText={(v:string)=>form.alamat.current=v} placeholder="Alamat lengkap" editable={editing}/>
              <Field label="Kota" value={initialValues.kota} onChangeText={(v:string)=>form.kota.current=v} placeholder="Kota" editable={editing}/>
              <Field label="Provinsi" value={initialValues.provinsi} onChangeText={(v:string)=>form.provinsi.current=v} placeholder="Provinsi" editable={editing}/>
              <Field label="Pendidikan" value={initialValues.pendidikan} onChangeText={(v:string)=>form.pendidikan.current=v} placeholder="D3/S1 Keperawatan..." editable={editing}/>
              <Field label="Pengalaman" value={initialValues.pengalaman} onChangeText={(v:string)=>form.pengalaman.current=v} placeholder="Pengalaman kerja..." multiline editable={editing}/>
            </>}

            {activeTab === 'bank' && <>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <Text style={[s.sectionTitle, { marginBottom:0 }]}>Informasi Bank</Text>
                {!editing ? (
                  <TouchableOpacity onPress={()=>setEditing(true)} style={{ flexDirection:'row', alignItems:'center', gap:5, paddingVertical:7, paddingHorizontal:13, borderRadius:10, backgroundColor:`${colors.primary}20`, borderWidth:1, borderColor:`${colors.primary}40` }}>
                    <Text style={{ color:colors.primary, fontSize:13, fontWeight:'700' }}>✏️ Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection:'row', gap:8 }}>
                    <TouchableOpacity onPress={()=>{ setEditing(false); setFormKey(k=>k+1); }} style={{ paddingVertical:7, paddingHorizontal:12, borderRadius:10, backgroundColor:colors.glass, borderWidth:1, borderColor:colors.glassBorder }}>
                      <Text style={{ color:colors.text3, fontSize:13, fontWeight:'600' }}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={saving} onPress={async()=>{ await handleSave(); setEditing(false); }} style={{ paddingVertical:7, paddingHorizontal:12, borderRadius:10, backgroundColor:colors.primary }}>
                      <Text style={{ color:'white', fontSize:13, fontWeight:'700' }}>{saving ? '...' : '💾 Simpan'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={{ backgroundColor:'rgba(245,158,11,0.1)', borderRadius:10, padding:12, marginBottom:16, flexDirection:'row', gap:8 }}>
                <Ionicons name="information-circle" size={16} color={colors.warning}/>
                <Text style={{ color:colors.warning, fontSize:12, flex:1 }}>Data rekening untuk pembayaran gaji dan kredit</Text>
              </View>
              <Field label="Nama Bank" value={initialValues.bankName} onChangeText={(v:string)=>form.bankName.current=v} placeholder="BCA / BRI / Mandiri..." editable={editing}/>
              <Field label="Nomor Rekening" value={initialValues.bankAcc} onChangeText={(v:string)=>form.bankAcc.current=v} placeholder="Nomor rekening" keyboard="number-pad" editable={editing}/>
              <Field label="Nama Pemilik Rekening" value={initialValues.bankAccName} onChangeText={(v:string)=>form.bankAccName.current=v} placeholder="Sesuai buku tabungan" editable={editing}/>
            </>}

            {activeTab === 'password' && <>
              <Text style={s.sectionTitle}>Ganti Password</Text>
              <Field label="Password Saat Ini" value="" onChangeText={(v:string)=>form.currentPass.current=v} placeholder="••••••••" secure/>
              <Field label="Password Baru" value="" onChangeText={(v:string)=>form.newPass.current=v} placeholder="Min. 8 karakter" secure/>
              <Field label="Konfirmasi Password Baru" value="" onChangeText={(v:string)=>form.confirmPass.current=v} placeholder="Ulangi password baru" secure/>
            </>}

            {(activeTab === 'password' || editing) && (

              <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.8}>
              <LinearGradient colors={saving?['#4a3080','#3a2870']:['#7c3aed','#4f46e5']}
                style={{ padding:15, borderRadius:14, alignItems:'center', marginTop:8 }}>
                {saving ? <ActivityIndicator color="white"/> : <Text style={{ color:'white', fontSize:15, fontWeight:'700' }}>💾 Simpan Perubahan</Text>}
              </LinearGradient>
            </TouchableOpacity>

            )}
          </View>

          {/* Link Legal */}
          <TouchableOpacity onPress={()=>router.push('/(app)/syarat-ketentuan')} activeOpacity={0.7}
            style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:colors.glass, borderWidth:1, borderColor:colors.glassBorder, borderRadius:14, padding:15, marginBottom:10 }}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
              <Ionicons name="document-text-outline" size={18} color={colors.text2} />
              <Text style={{ color:colors.text, fontSize:14, fontWeight:'600' }}>Syarat & Ketentuan</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>router.push('/(app)/privacy-policy')} activeOpacity={0.7}
            style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:colors.glass, borderWidth:1, borderColor:colors.glassBorder, borderRadius:14, padding:15, marginBottom:16 }}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.text2} />
              <Text style={{ color:colors.text, fontSize:14, fontWeight:'600' }}>Kebijakan Privasi</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color={colors.error}/>
            <Text style={{ color:colors.error, fontSize:14, fontWeight:'700' }}>Keluar dari Akun</Text>
          </TouchableOpacity>
          <View style={{ height:100 }}/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
