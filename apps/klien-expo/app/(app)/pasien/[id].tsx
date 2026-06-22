import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../lib/ThemeContext';
import api from '../../../lib/api';

export default function DetailPasien() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [pasien, setPasien] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');

  const fetchPasien = async () => {
    try {
      const r = await api.get('/klien/pasien').catch(() => null);
      const d = r?.data?.data;
      const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
      const found = list.find((p: any) => String(p.id) === String(id));
      setPasien(found || null);
      if (found) setForm({
        golongan_darah: found.golongan_darah || '',
        riwayat_penyakit: found.riwayat_penyakit || '',
        alergi: found.alergi || '',
        obat_rutin: found.obat_rutin || '',
        catatan_khusus: found.catatan_khusus || '',
        kontak_darurat_nama: found.kontak_darurat_nama || '',
        kontak_darurat_phone: found.kontak_darurat_phone || '',
        kontak_darurat_relasi: found.kontak_darurat_relasi || '',
      });
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPasien(); }, [id]);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await api.patch('/klien/pasien/' + id, form);
      await fetchPasien();
      setEditing(false);
      Alert.alert('Berhasil', 'Data pasien diperbarui');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}><ActivityIndicator size="large" color="#10b981" /></View>;
  }
  if (!pasien) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, padding: 20 }}>
        <Text style={{ color: colors.text3 }}>Data tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 10 }}>
          <Text style={{ color: colors.text2 }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const usia = pasien.tanggal_lahir ? new Date().getFullYear() - new Date(pasien.tanggal_lahir).getFullYear() : null;
  const tglLahir = pasien.tanggal_lahir ? new Date(pasien.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
  const initials = pasien.nama_lengkap?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'P';

  const Row = ({ icon, label, value, color = '#10b981' }: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
      <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: `${color}1a`, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text3, fontSize: 11 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500', marginTop: 2 }}>{value || '-'}</Text>
      </View>
    </View>
  );

  const EditRow = ({ label, field, multiline }: any) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: colors.text3, fontSize: 11, marginBottom: 6 }}>{label}</Text>
      <TextInput
        defaultValue={form[field]}
        onChangeText={(v) => form[field] = v}
        placeholderTextColor={colors.text3}
        multiline={multiline}
        style={{ backgroundColor: colors.bg2 || colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: colors.text, fontSize: 13, minHeight: multiline ? 56 : undefined, textAlignVertical: multiline ? 'top' : 'center' }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 60 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="arrow-back" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Detail Pasien</Text>
          </View>
          {!editing ? (
            <TouchableOpacity onPress={() => setEditing(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)' }}>
              <Ionicons name="create-outline" size={14} color="#10b981" />
              <Text style={{ color: '#10b981', fontSize: 13, fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => { setEditing(false); fetchPasien(); }} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder }}>
                <Text style={{ color: colors.text3, fontSize: 13 }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={saving} style={{ borderRadius: 12, overflow: 'hidden' }}>
                <LinearGradient colors={['#10b981', '#059669']} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                  <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>{saving ? '...' : 'Simpan'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!!error && (
          <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Avatar */}
        <LinearGradient colors={['#10b981', '#059669', '#0d9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 24, alignItems: 'center', overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: 'white' }}>{initials}</Text>
          </View>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>{pasien.nama_lengkap}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 }}>
            {usia !== null ? `${usia} tahun` : ''}{pasien.jenis_kelamin ? ` • ${pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}` : ''}{pasien.golongan_darah ? ` • Gol. ${pasien.golongan_darah}` : ''}
          </Text>
        </LinearGradient>

        {/* Data Diri (readonly) */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text, marginBottom: 16 }}>Data Diri</Text>
          <Row icon="calendar-outline" label="Tanggal Lahir" value={tglLahir} />
          <Row icon="card-outline" label="NIK" value={pasien.nik} />
          <Row icon="location-outline" label="Alamat" value={pasien.alamat} />
        </View>

        {/* Data Medis (editable) */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text, marginBottom: 16 }}>Data Medis</Text>
          {editing ? (
            <>
              <EditRow label="Golongan Darah" field="golongan_darah" />
              <EditRow label="Riwayat Penyakit" field="riwayat_penyakit" multiline />
              <EditRow label="Alergi" field="alergi" />
              <EditRow label="Obat Rutin" field="obat_rutin" />
              <EditRow label="Catatan Khusus" field="catatan_khusus" multiline />
            </>
          ) : (
            <>
              <Row icon="water-outline" label="Golongan Darah" value={pasien.golongan_darah} color="#ef4444" />
              <Row icon="medical-outline" label="Riwayat Penyakit" value={pasien.riwayat_penyakit} color="#f59e0b" />
              <Row icon="alert-circle-outline" label="Alergi" value={pasien.alergi} color="#f59e0b" />
              <Row icon="fitness-outline" label="Obat Rutin" value={pasien.obat_rutin} />
              <Row icon="document-text-outline" label="Catatan Khusus" value={pasien.catatan_khusus} />
            </>
          )}
        </View>

        {/* Kontak Darurat (editable) */}
        <View style={{ backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 20, padding: 20 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text, marginBottom: 16 }}>Kontak Darurat</Text>
          {editing ? (
            <>
              <EditRow label="Nama" field="kontak_darurat_nama" />
              <EditRow label="Nomor HP" field="kontak_darurat_phone" />
              <EditRow label="Relasi" field="kontak_darurat_relasi" />
            </>
          ) : (
            <>
              <Row icon="person-outline" label="Nama" value={pasien.kontak_darurat_nama} color="#10b981" />
              <Row icon="call-outline" label="Nomor HP" value={pasien.kontak_darurat_phone} color="#10b981" />
              <Row icon="people-outline" label="Relasi" value={pasien.kontak_darurat_relasi} color="#10b981" />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
