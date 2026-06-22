import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';

export default function PrivacyPolicy() {
  const { colors } = useTheme();

  const Section = ({ no, title, children }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8 }}>{no}. {title}</Text>
      <Text style={{ color: colors.text2, fontSize: 13, lineHeight: 21 }}>{children}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.glassBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.glass, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.glassBorder }}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Kebijakan Privasi</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={{ color: colors.text3, fontSize: 12, marginBottom: 20 }}>Terakhir diperbarui: Juni 2026</Text>

        <Text style={{ color: colors.text2, fontSize: 13, lineHeight: 21, marginBottom: 20 }}>
          Mikala Global Medika (MGM) menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Klien serta data pasien yang Anda daftarkan melalui aplikasi ini.
        </Text>

        <Section no="1" title="Data yang Kami Kumpulkan">
          Kami mengumpulkan data yang Anda berikan, meliputi: data akun Klien (nama, email, nomor telepon, alamat), data pasien (nama, tanggal lahir, jenis kelamin, riwayat kesehatan, alergi, kontak darurat), data pemesanan layanan, serta data pembayaran yang diperlukan untuk memproses tagihan.
        </Section>

        <Section no="2" title="Penggunaan Data">
          Data Anda digunakan untuk: mengelola akun dan pemesanan layanan; mencocokkan kebutuhan dengan Mitra yang sesuai; memproses tagihan dan pembayaran; berkomunikasi terkait layanan; meningkatkan kualitas pelayanan; serta memenuhi kewajiban hukum.
        </Section>

        <Section no="3" title="Data Pasien">
          Data pasien yang Anda daftarkan digunakan semata-mata untuk keperluan pelayanan perawatan. Data ini dibagikan kepada Mitra yang ditugaskan sebatas yang diperlukan untuk memberikan pelayanan yang aman dan tepat. Anda menjamin memiliki izin untuk membagikan data pasien tersebut.
        </Section>

        <Section no="4" title="Perlindungan Data">
          Kami menerapkan langkah keamanan teknis dan organisasi yang wajar untuk melindungi data dari akses, perubahan, atau penyalahgunaan yang tidak sah. Akses data dibatasi hanya kepada pihak yang berkepentingan dalam pelayanan.
        </Section>

        <Section no="5" title="Pembagian Data">
          Kami tidak menjual data pribadi Anda. Data dapat dibagikan kepada Mitra (untuk pelayanan), penyedia layanan pembayaran (untuk transaksi), atau pihak berwenang apabila diwajibkan oleh hukum. Pembagian dilakukan secara terbatas dan sesuai tujuan.
        </Section>

        <Section no="6" title="Penyimpanan Data">
          Data disimpan selama akun Anda aktif dan selama diperlukan untuk memenuhi tujuan layanan serta kewajiban hukum. Anda dapat mengajukan penghapusan data dengan ketentuan tertentu, kecuali data yang wajib disimpan untuk keperluan administrasi dan hukum.
        </Section>

        <Section no="7" title="Hak Anda">
          Anda berhak mengakses, memperbarui, dan meminta koreksi atas data pribadi Anda melalui aplikasi atau dengan menghubungi tim MGM. Anda juga berhak menarik persetujuan penggunaan data dengan konsekuensi tertentu terhadap layanan.
        </Section>

        <Section no="8" title="Perubahan Kebijakan">
          Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi, dan penggunaan yang berkelanjutan dianggap sebagai persetujuan atas kebijakan terbaru.
        </Section>

        <Section no="9" title="Kontak">
          Untuk pertanyaan atau permintaan terkait data pribadi Anda, silakan hubungi tim MGM melalui kanal resmi yang tersedia di aplikasi.
        </Section>

        <Text style={{ color: colors.text3, fontSize: 12, lineHeight: 19, marginTop: 12, fontStyle: 'italic' }}>
          Dengan menggunakan aplikasi ini, Anda menyetujui pengumpulan dan penggunaan data sesuai kebijakan privasi di atas.
        </Text>
      </ScrollView>
    </View>
  );
}
