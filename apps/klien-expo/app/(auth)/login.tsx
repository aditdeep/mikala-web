import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../lib/auth';
import { Colors } from '../../lib/theme';

const REGISTER_URL = 'https://mikala-web-klien.vercel.app/auth/register';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Email dan password wajib diisi'); return; }
    setLoading(true); setError('');
    try {
      await authService.login(email.trim().toLowerCase(), password);
      router.replace('/(app)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally { setLoading(false); }
  };

  const handleRegister = () => { Linking.openURL(REGISTER_URL); };

  return (
    <LinearGradient colors={['#0f0c29','#302b63','#24243e']} style={{ flex:1 }}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{ flex:1 }}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
          <View style={s.logoBox}>
            <Text style={s.logoText}>M</Text>
          </View>
          <Text style={s.title}>Mikala Klien</Text>
          <Text style={s.subtitle}>Masuk ke akun Anda</Text>

          <View style={s.card}>
            {!!error && (
              <View style={s.errBox}>
                <Ionicons name="alert-circle" size={15} color={Colors.error}/>
                <Text style={s.errText}>{error}</Text>
              </View>
            )}

            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={17} color="rgba(167,139,250,0.6)" style={s.icon}/>
              <TextInput value={email} onChangeText={setEmail}
                placeholder="nama@email.com" placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="email-address" autoCapitalize="none" style={s.input}/>
            </View>

            <Text style={[s.label,{marginTop:12}]}>Password</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={17} color="rgba(167,139,250,0.6)" style={s.icon}/>
              <TextInput value={password} onChangeText={setPassword}
                placeholder="••••••••" placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry={!showPass} style={[s.input,{paddingRight:44}]}/>
              <TouchableOpacity onPress={()=>setShowPass(!showPass)} style={s.eye}>
                <Ionicons name={showPass?'eye-off-outline':'eye-outline'} size={17} color="rgba(167,139,250,0.6)"/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={()=>router.push('/(auth)/forgot-password')}
              style={{alignSelf:'flex-end',marginTop:6,marginBottom:16}}>
              <Text style={{color:'rgba(167,139,250,0.6)',fontSize:12}}>Lupa password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
              <LinearGradient colors={loading?['rgba(124,58,237,0.5)','rgba(79,70,229,0.5)']:['#7c3aed','#4f46e5']}
                style={s.btn}>
                {loading ? <ActivityIndicator color="white" size="small"/> : <Text style={s.btnText}>Masuk</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={s.divider}>
              <View style={s.line}/>
              <Text style={s.divTxt}>atau</Text>
              <View style={s.line}/>
            </View>

            <TouchableOpacity onPress={handleRegister} style={s.regBtn} activeOpacity={0.8}>
              <Ionicons name="person-add-outline" size={16} color="#a78bfa"/>
              <Text style={s.regTxt}>Daftar sebagai Klien</Text>
            </TouchableOpacity>

            <Text style={s.regNote}>
              Pendaftaran dilakukan melalui website resmi Mikala Global Medika
            </Text>
          </View>
          <Text style={s.footer}>© 2026 Mikala Global Medika</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container:  { flexGrow:1, padding:20, justifyContent:'center', alignItems:'center' },
  logoBox:    { width:72, height:72, borderRadius:22, backgroundColor:'#7c3aed', alignItems:'center', justifyContent:'center', marginBottom:16, elevation:12 },
  logoText:   { color:'white', fontSize:28, fontWeight:'800' },
  title:      { color:'white', fontSize:26, fontWeight:'800' },
  subtitle:   { color:'rgba(167,139,250,0.8)', fontSize:14, marginTop:6, marginBottom:28 },
  card:       { backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:28, padding:24, width:'100%' },
  errBox:     { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'rgba(239,68,68,0.1)', borderRadius:10, padding:12, marginBottom:14 },
  errText:    { color:'#f87171', fontSize:13, flex:1 },
  label:      { color:'rgba(167,139,250,0.8)', fontSize:13, fontWeight:'500', marginBottom:8 },
  inputWrap:  { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:14, paddingHorizontal:12 },
  icon:       { marginRight:8 },
  input:      { flex:1, color:'white', fontSize:15, paddingVertical:13 },
  eye:        { position:'absolute', right:12, padding:4 },
  btn:        { borderRadius:14, padding:15, alignItems:'center', marginTop:4 },
  btnText:    { color:'white', fontSize:16, fontWeight:'700' },
  divider:    { flexDirection:'row', alignItems:'center', marginVertical:18 },
  line:       { flex:1, height:1, backgroundColor:'rgba(255,255,255,0.1)' },
  divTxt:     { color:'rgba(255,255,255,0.4)', fontSize:12, marginHorizontal:12 },
  regBtn:     { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:'rgba(167,139,250,0.1)', borderWidth:1, borderColor:'rgba(167,139,250,0.3)', borderRadius:14, padding:13 },
  regTxt:     { color:'#a78bfa', fontSize:14, fontWeight:'600' },
  regNote:    { color:'rgba(255,255,255,0.4)', fontSize:11, textAlign:'center', marginTop:12, lineHeight:16 },
  footer:     { color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:24 },
});
