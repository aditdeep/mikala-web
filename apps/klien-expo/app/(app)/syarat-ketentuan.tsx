import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';

export default function SyaratKetentuan() {
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
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Syarat & Ketentuan</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={{ color: colors.text3, fontSize: 12, marginBottom: 20 }}>Terakhir diperbarui: Juni 2026</Text>

        <Text style={{ color: colors.text2, fontSize: 13, lineHeight: 21, marginBottom: 20 }}>
          Selamat datang di aplikasi Klien Mikala Global Medika (MGM). Dengan mendaftar dan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan berikut dalam memesan layanan tenaga kesehatan.
        </Text>

        <Section no="1" title="Definisi">
          "MGM" merujuk pada Mikala Global Medika selaku penyelenggara platform. "Klien" adalah pengguna yang memesan layanan perawatan melalui aplikasi. "Pasien" adalah individu yang menerima layanan perawatan. "Mitra" adalah tenaga kesehatan yang ditugaskan oleh MGM.
        </Section>

        <Section no="2" title="Pendaftaran Akun">
          Klien wajib memberikan data yang benar, lengkap, dan akurat saat pendaftaran. Anda bertanggung jawab menjaga kerahasiaan akun dan seluruh aktivitas yang terjadi di dalamnya. MGM berhak menolak atau menonaktifkan akun yang memberikan data palsu atau menyalahgunakan layanan.
        </Section>

        <Section no="3" title="Pemesanan Layanan">
          Klien dapat memesan layanan perawatan melalui aplikasi dengan memilih jenis layanan, pasien, dan jadwal yang diinginkan. Pemesanan akan diproses dan dikonfirmasi oleh MGM sesuai ketersediaan Mitra. MGM berupaya mencocokkan Mitra yang sesuai dengan kebutuhan, namun tidak menjamin ketersediaan pada waktu tertentu.
        </Section>

        <Section no="4" title="Data Pasien">
          Klien bertanggung jawab atas kebenaran data pasien yang didaftarkan, termasuk riwayat kesehatan, alergi, dan kontak darurat. Data yang akurat membantu Mitra memberikan pelayanan yang aman dan tepat. Klien menjamin memiliki izin untuk mendaftarkan data pasien tersebut.
        </Section>

        <Section no="5" title="Biaya & Pembayaran">
          Biaya layanan ditentukan berdasarkan jenis layanan, durasi, dan ketentuan yang berlaku. Tagihan akan diterbitkan melalui aplikasi dan wajib dibayar sesuai tenggat yang ditetapkan, melalui metode pembayaran yang tersedia. Keterlambatan pembayaran dapat memengaruhi kelanjutan layanan.
        </Section>

        <Section no="6" title="Pembatalan">
          Klien dapat mengajukan pembatalan layanan sesuai ketentuan yang berlaku. Pembatalan yang dilakukan setelah layanan dikonfirmasi atau dimulai dapat dikenakan biaya sesuai kebijakan MGM.
        </Section>

        <Section no="7" title="Kewajiban Klien">
          Klien wajib: (a) memberikan informasi yang benar; (b) menyediakan lingkungan yang aman dan layak bagi Mitra saat memberikan layanan; (c) memperlakukan Mitra dengan hormat dan profesional; (d) melakukan pembayaran tepat waktu; (e) tidak melakukan transaksi di luar platform untuk layanan yang berasal dari MGM.
        </Section>

        <Section no="8" title="Batasan Tanggung Jawab">
          MGM berupaya menyediakan layanan terbaik melalui Mitra yang terverifikasi. Namun MGM tidak bertanggung jawab atas kejadian di luar kendali yang wajar. Segala keluhan terkait layanan dapat disampaikan melalui kanal resmi untuk ditindaklanjuti.
        </Section>

        <Section no="9" title="Perubahan & Kontak">
          MGM dapat memperbarui syarat dan ketentuan ini sewaktu-waktu, dan perubahan diberitahukan melalui aplikasi. Untuk pertanyaan, silakan hubungi tim MGM melalui kanal resmi yang tersedia di aplikasi.
        </Section>

        <Text style={{ color: colors.text3, fontSize: 12, lineHeight: 19, marginTop: 12, fontStyle: 'italic' }}>
          Dengan menggunakan aplikasi ini, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di atas.
        </Text>
      </ScrollView>
    </View>
  );
}
