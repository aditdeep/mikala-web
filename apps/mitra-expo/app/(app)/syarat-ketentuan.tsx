import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';

export default function SyaratKetentuan() {
  const { colors, isDark } = useTheme();

  const Section = ({ no, title, children }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8 }}>{no}. {title}</Text>
      <Text style={{ color: colors.text2, fontSize: 13, lineHeight: 21 }}>{children}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.glassBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.glass, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.glassBorder }}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Syarat & Ketentuan</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={{ color: colors.text3, fontSize: 12, marginBottom: 20 }}>Terakhir diperbarui: Juni 2026</Text>

        <Text style={{ color: colors.text2, fontSize: 13, lineHeight: 21, marginBottom: 20 }}>
          Selamat datang di aplikasi Mitra Mikala Global Medika (MGM). Dengan mendaftar dan menggunakan aplikasi ini, Anda sebagai Mitra tenaga kesehatan menyetujui syarat dan ketentuan berikut.
        </Text>

        <Section no="1" title="Definisi">
          "MGM" merujuk pada Mikala Global Medika selaku penyelenggara platform. "Mitra" adalah tenaga kesehatan (caregiver, perawat, perawat senior, babysitter, atau profesi lain) yang terdaftar dan terverifikasi. "Klien" adalah pihak yang memesan layanan melalui platform.
        </Section>

        <Section no="2" title="Pendaftaran & Verifikasi">
          Mitra wajib memberikan data yang benar, lengkap, dan dapat dipertanggungjawabkan saat pendaftaran, termasuk dokumen identitas, sertifikasi, dan riwayat pengalaman. MGM berhak melakukan verifikasi, wawancara, dan pelatihan sebelum Mitra dinyatakan aktif. MGM dapat menolak atau menonaktifkan akun yang memberikan data palsu.
        </Section>

        <Section no="3" title="Penugasan & Pekerjaan">
          Penugasan diberikan berdasarkan ketersediaan, kualifikasi, dan lokasi Mitra. Mitra wajib menjalankan tugas secara profesional sesuai standar pelayanan kesehatan, menjaga etika, serta menghormati privasi dan martabat pasien. Mitra dapat menerima atau menolak penugasan sesuai ketentuan yang berlaku.
        </Section>

        <Section no="4" title="Tarif & Pembayaran">
          Penghasilan Mitra dihitung berdasarkan model gaji yang berlaku untuk jenis layanan: gaji harian (tarif per hari dikali jumlah hari kerja) untuk layanan harian, atau gaji bulanan (prorata sesuai hari kerja) untuk layanan kontrak/menetap. Besaran tarif ditentukan berdasarkan jabatan dan kesepakatan saat verifikasi. Pembayaran diproses melalui sistem payroll MGM sesuai periode yang ditetapkan, setelah dikurangi potongan yang berlaku (bila ada).
        </Section>

        <Section no="5" title="Kewajiban Mitra">
          Mitra wajib: (a) hadir tepat waktu dan menyelesaikan tugas sesuai kesepakatan; (b) menjaga kerahasiaan data pasien dan Klien; (c) tidak melakukan transaksi di luar platform untuk penugasan yang berasal dari MGM; (d) melaporkan kendala atau insiden secara jujur; (e) menjaga nama baik MGM.
        </Section>

        <Section no="6" title="Cuti & Ketidakhadiran">
          Pengajuan cuti dilakukan melalui aplikasi dan tunduk pada persetujuan MGM. Ketidakhadiran tanpa pemberitahuan dapat memengaruhi penilaian, penghasilan, dan kelangsungan kemitraan.
        </Section>

        <Section no="7" title="Sanksi & Pemutusan">
          MGM berhak memberikan peringatan, menangguhkan, atau memutus kemitraan apabila Mitra melanggar ketentuan, melakukan kelalaian yang membahayakan pasien, atau bertindak tidak profesional.
        </Section>

        <Section no="8" title="Perubahan Ketentuan">
          MGM dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi. Penggunaan aplikasi yang berkelanjutan dianggap sebagai persetujuan atas ketentuan terbaru.
        </Section>

        <Section no="9" title="Kontak">
          Untuk pertanyaan terkait syarat dan ketentuan, silakan hubungi tim MGM melalui kanal resmi yang tersedia di aplikasi.
        </Section>

        <Text style={{ color: colors.text3, fontSize: 12, lineHeight: 19, marginTop: 12, fontStyle: 'italic' }}>
          Dengan menggunakan aplikasi ini, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di atas.
        </Text>
      </ScrollView>
    </View>
  );
}
