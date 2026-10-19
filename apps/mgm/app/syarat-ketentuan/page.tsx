import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LEGAL_EMAIL, LEGAL_WA, LEGAL_WA_LABEL } from '../(components)/LegalPage';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Mikala Global Medika',
  description: 'Syarat dan ketentuan penggunaan aplikasi Mikala Klien dan Mikala Mitra dari PT. Mikala Global Medika.',
  alternates: { canonical: 'https://mikalaglobalmedika.com/syarat-ketentuan' },
};

// Isi diselaraskan dgn layar Syarat & Ketentuan di apps Mikala Klien & Mikala Mitra.
export default function SyaratKetentuanPage() {
  return (
    <LegalPage
      judul="Syarat & Ketentuan"
      ringkas="Ketentuan penggunaan aplikasi Mikala Klien dan Mikala Mitra."
      diperbarui="19 Oktober 2026"
      bagian={[
        {
          judul: 'Definisi',
          isi: (<p>&quot;MGM&quot; adalah PT. Mikala Global Medika selaku penyelenggara layanan. &quot;Klien&quot; adalah pengguna yang memesan layanan perawatan, termasuk penanggung jawab pasien. &quot;Pasien&quot; adalah individu yang menerima layanan perawatan. &quot;Mitra&quot; adalah tenaga kesehatan (caregiver, perawat, babysitter, atau profesi lain) yang terdaftar dan terverifikasi oleh MGM.</p>),
        },
        {
          judul: 'Akun',
          isi: (<p>Pengguna wajib memberikan data yang benar, lengkap, dan dapat dipertanggungjawabkan, serta menjaga kerahasiaan PIN atau password akun. Seluruh aktivitas di dalam akun menjadi tanggung jawab pemilik akun. MGM berhak menolak, menangguhkan, atau menonaktifkan akun yang memberikan data palsu atau menyalahgunakan layanan.</p>),
        },
        {
          judul: 'Ketentuan untuk Klien',
          isi: (<ul>
            <li><strong>Pemesanan:</strong> permintaan layanan diproses dan dikonfirmasi oleh tim Customer Care MGM sesuai ketersediaan Mitra. MGM berupaya mencocokkan Mitra dengan kebutuhan pasien, namun tidak menjamin ketersediaan pada waktu tertentu.</li>
            <li><strong>Data pasien:</strong> Klien bertanggung jawab atas kebenaran data pasien, termasuk riwayat kesehatan, alergi, dan kontak darurat, serta menjamin memiliki izin untuk mendaftarkannya.</li>
            <li><strong>Biaya dan pembayaran:</strong> biaya ditentukan berdasarkan jenis layanan, durasi, dan kontrak yang disepakati. Tagihan wajib dibayar sesuai tenggat melalui rekening resmi PT. Mikala Global Medika. Keterlambatan pembayaran dapat memengaruhi kelanjutan layanan.</li>
            <li><strong>Pembatalan:</strong> pembatalan mengikuti ketentuan kontrak. Pembatalan setelah layanan dikonfirmasi atau dimulai dapat dikenakan biaya.</li>
            <li><strong>Kewajiban Klien:</strong> menyediakan lingkungan yang aman dan layak bagi Mitra, memperlakukan Mitra dengan hormat, membayar tepat waktu, dan tidak melakukan transaksi di luar MGM untuk layanan yang berasal dari MGM.</li>
          </ul>),
        },
        {
          judul: 'Ketentuan untuk Mitra',
          isi: (<ul>
            <li><strong>Verifikasi:</strong> MGM berhak melakukan verifikasi dokumen, wawancara, dan pelatihan sebelum Mitra dinyatakan aktif.</li>
            <li><strong>Penugasan:</strong> penugasan diberikan berdasarkan ketersediaan, kualifikasi, dan lokasi. Mitra wajib bekerja secara profesional sesuai standar pelayanan kesehatan serta menghormati privasi dan martabat pasien.</li>
            <li><strong>Penghasilan:</strong> dihitung sesuai model gaji yang berlaku untuk jenis layanan (harian atau bulanan) dan dibayarkan melalui sistem penggajian MGM setelah dikurangi potongan yang berlaku, bila ada.</li>
            <li><strong>Kewajiban Mitra:</strong> hadir tepat waktu, menjaga kerahasiaan data pasien dan Klien, tidak melakukan transaksi di luar MGM untuk penugasan dari MGM, serta melaporkan kendala atau insiden secara jujur.</li>
            <li><strong>Cuti:</strong> diajukan melalui aplikasi dan memerlukan persetujuan MGM. Ketidakhadiran tanpa pemberitahuan dapat memengaruhi penilaian, penghasilan, dan kelangsungan kemitraan.</li>
            <li><strong>Sanksi:</strong> MGM berhak memberi peringatan, menangguhkan, atau memutus kemitraan apabila Mitra melanggar ketentuan atau melakukan kelalaian yang membahayakan pasien.</li>
          </ul>),
        },
        {
          judul: 'Batasan Tanggung Jawab',
          isi: (<p>MGM berupaya memberikan layanan terbaik melalui Mitra yang terverifikasi, namun tidak bertanggung jawab atas kejadian di luar kendali yang wajar. Keluhan terkait layanan dapat disampaikan melalui kanal resmi MGM untuk ditindaklanjuti.</p>),
        },
        {
          judul: 'Privasi',
          isi: (<p>Pengumpulan dan penggunaan data pribadi diatur dalam <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>. Permintaan penghapusan akun dapat diajukan melalui halaman <Link href="/hapus-akun">Hapus Akun</Link>.</p>),
        },
        {
          judul: 'Perubahan dan Kontak',
          isi: (<p>Syarat dan ketentuan ini dapat diperbarui sewaktu-waktu dan perubahannya diberitahukan melalui aplikasi. Penggunaan aplikasi yang berkelanjutan dianggap sebagai persetujuan atas ketentuan terbaru. Pertanyaan dapat disampaikan melalui WhatsApp <a href={`https://wa.me/${LEGAL_WA}`} target="_blank" rel="noreferrer">{LEGAL_WA_LABEL}</a> atau email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.</p>),
        },
      ]}
    />
  );
}
