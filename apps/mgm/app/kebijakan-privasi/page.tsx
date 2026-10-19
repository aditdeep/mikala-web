import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LEGAL_ALAMAT, LEGAL_EMAIL, LEGAL_WA, LEGAL_WA_LABEL } from '../(components)/LegalPage';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Mikala Global Medika',
  description: 'Kebijakan privasi PT. Mikala Global Medika untuk situs mikalaglobalmedika.com serta aplikasi Mikala Klien dan Mikala Mitra.',
  alternates: { canonical: 'https://mikalaglobalmedika.com/kebijakan-privasi' },
};

// Halaman publik yg dipakai sbg "Privacy Policy URL" di Google Play (apps Mikala Klien & Mitra).
export default function KebijakanPrivasiPage() {
  return (
    <LegalPage
      judul="Kebijakan Privasi"
      ringkas="Bagaimana PT. Mikala Global Medika mengumpulkan, menggunakan, dan melindungi data pribadi Anda."
      diperbarui="19 Oktober 2026"
      bagian={[
        {
          judul: 'Data yang Kami Kumpulkan',
          isi: (<>
            <p><strong>Klien / penanggung jawab pasien:</strong> nama, nomor HP/WhatsApp, email (opsional), alamat, hubungan dengan pasien, dan nomor identitas untuk keperluan kontrak.</p>
            <p><strong>Pasien:</strong> nama, tanggal lahir, jenis kelamin, alamat layanan, serta data kesehatan seperti kondisi atau diagnosis, riwayat penyakit, alergi, obat rutin, alat medis yang digunakan, dan kontak darurat.</p>
            <p><strong>Mitra (tenaga kesehatan):</strong> data identitas (nama, NIK, tempat dan tanggal lahir, alamat, agama, status pernikahan), foto, dokumen (KTP, CV, sertifikat), pendidikan dan pengalaman, tinggi dan berat badan, riwayat vaksin, rekening bank, serta data penugasan, gaji, cuti, dan kasbon.</p>
            <p><strong>Data teknis:</strong> token notifikasi perangkat (untuk mengirim notifikasi), catatan akses ke server (alamat IP dan waktu akses), dan foto yang Anda unggah melalui kamera atau galeri.</p>
            <p>Aplikasi kami <strong>tidak</strong> mengakses lokasi GPS, daftar kontak, maupun mikrofon perangkat Anda. Izin kamera dan galeri hanya digunakan saat Anda memilih untuk mengunggah foto.</p>
          </>),
        },
        {
          judul: 'Tujuan Penggunaan Data',
          isi: (<ul>
            <li>Membuat dan mengelola akun serta memverifikasi identitas pengguna.</li>
            <li>Menerima permintaan layanan dan mencocokkan pasien dengan Mitra yang sesuai.</li>
            <li>Menyusun kontrak, tagihan, pembayaran, serta penggajian Mitra.</li>
            <li>Mengirim informasi terkait layanan melalui notifikasi aplikasi, WhatsApp, atau email.</li>
            <li>Menjaga keamanan layanan, menangani keluhan, dan meningkatkan kualitas pelayanan.</li>
            <li>Memenuhi kewajiban hukum, administrasi, dan perpajakan.</li>
          </ul>),
        },
        {
          judul: 'Data Kesehatan Pasien',
          isi: (<p>Data kesehatan termasuk data pribadi yang bersifat spesifik menurut Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Data ini hanya digunakan untuk keperluan perawatan, hanya dibagikan kepada Mitra yang ditugaskan merawat pasien sebatas yang diperlukan, dan tidak digunakan untuk tujuan pemasaran. Klien yang mendaftarkan data pasien menyatakan memiliki hak atau persetujuan untuk memberikan data tersebut.</p>),
        },
        {
          judul: 'Pembagian Data kepada Pihak Lain',
          isi: (<>
            <p>Kami <strong>tidak menjual</strong> data pribadi Anda dan tidak menampilkan iklan di aplikasi. Data hanya dibagikan kepada:</p>
            <ul>
              <li><strong>Mitra yang ditugaskan</strong>, untuk menjalankan layanan perawatan. Klien dapat melihat nama dan foto Mitra yang bertugas.</li>
              <li><strong>Penyedia layanan teknologi</strong> yang membantu operasional kami, seperti server dan basis data, penyimpanan foto, layanan notifikasi aplikasi (Expo dan Google Firebase Cloud Messaging), serta layanan email. Mereka hanya memproses data sesuai keperluan layanan.</li>
              <li><strong>Instansi berwenang</strong>, apabila diwajibkan oleh peraturan perundang-undangan.</li>
            </ul>
          </>),
        },
        {
          judul: 'Keamanan Data',
          isi: (<p>Data dikirim melalui koneksi terenkripsi (HTTPS). Password dan PIN disimpan dalam bentuk terenkripsi (hash) sehingga tidak dapat dibaca, termasuk oleh tim kami. Akses data di sistem internal dibatasi sesuai peran dan kebutuhan pekerjaan. Jaga kerahasiaan PIN atau password akun Anda dan jangan membagikannya kepada siapa pun.</p>),
        },
        {
          judul: 'Penyimpanan dan Penghapusan Data',
          isi: (<p>Data disimpan selama akun Anda aktif dan selama diperlukan untuk tujuan di atas. Jika Anda meminta penghapusan akun, data akun dan data pribadi Anda akan dihapus atau dianonimkan, kecuali data yang wajib kami simpan sesuai peraturan perundang-undangan, seperti kontrak, tagihan, bukti pembayaran, dan data penggajian. Cara mengajukan penghapusan akun dijelaskan di halaman <Link href="/hapus-akun">Hapus Akun</Link>.</p>),
        },
        {
          judul: 'Hak Anda',
          isi: (<>
            <p>Sesuai Undang-Undang Pelindungan Data Pribadi, Anda berhak:</p>
            <ul>
              <li>mengakses dan memperoleh salinan data pribadi Anda;</li>
              <li>memperbaiki data yang tidak akurat (sebagian dapat diubah langsung di menu Profil aplikasi);</li>
              <li>meminta penghapusan data dan akun Anda;</li>
              <li>menarik persetujuan pemrosesan data, dengan konsekuensi layanan tertentu tidak dapat lagi diberikan.</li>
            </ul>
            <p>Permintaan dapat diajukan melalui kontak di bagian akhir halaman ini dan akan kami tanggapi paling lambat 3 x 24 jam hari kerja.</p>
          </>),
        },
        {
          judul: 'Pengguna di Bawah Umur',
          isi: (<p>Akun aplikasi Mikala Klien dan Mikala Mitra hanya ditujukan bagi pengguna berusia 18 tahun ke atas. Data pasien anak (misalnya untuk layanan babysitter) didaftarkan oleh orang tua atau wali yang bertanggung jawab.</p>),
        },
        {
          judul: 'Perubahan Kebijakan',
          isi: (<p>Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan penting akan diberitahukan melalui aplikasi atau situs ini. Tanggal pembaruan terakhir tercantum di bagian atas halaman.</p>),
        },
        {
          judul: 'Kontak',
          isi: (<>
            <p>PT. Mikala Global Medika<br />{LEGAL_ALAMAT}</p>
            <p>WhatsApp: <a href={`https://wa.me/${LEGAL_WA}`} target="_blank" rel="noreferrer">{LEGAL_WA_LABEL}</a><br />
              Email: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a></p>
          </>),
        },
      ]}
    >
      <p style={{ margin: '0 0 8px' }}>PT. Mikala Global Medika (&quot;MGM&quot;, &quot;kami&quot;) menghargai privasi Anda. Kebijakan ini berlaku untuk situs <strong>mikalaglobalmedika.com</strong> serta aplikasi <strong>Mikala Klien</strong> dan <strong>Mikala Mitra</strong> (Android dan versi web). Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan data sesuai kebijakan ini.</p>
    </LegalPage>
  );
}
