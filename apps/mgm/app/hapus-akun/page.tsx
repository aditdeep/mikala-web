import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LEGAL_EMAIL, LEGAL_WA, LEGAL_WA_LABEL } from '../(components)/LegalPage';
import FormHapusAkun from './FormHapusAkun';

export const metadata: Metadata = {
  title: 'Hapus Akun | Mikala Global Medika',
  description: 'Cara meminta penghapusan akun dan data pribadi aplikasi Mikala Klien dan Mikala Mitra dari PT. Mikala Global Medika.',
  alternates: { canonical: 'https://mikalaglobalmedika.com/hapus-akun' },
};

// Halaman publik yg dipakai sbg "Delete account URL" di Google Play (wajib utk apps yg punya akun).
export default function HapusAkunPage() {
  return (
    <LegalPage
      judul="Hapus Akun"
      ringkas="Cara meminta penghapusan akun dan data pribadi aplikasi Mikala Klien dan Mikala Mitra."
      diperbarui="19 Oktober 2026"
      bagian={[
        {
          judul: 'Cara Mengajukan',
          isi: (<>
            <ol>
              <li>Isi formulir di atas, lalu kirim melalui WhatsApp ke <a href={`https://wa.me/${LEGAL_WA}`} target="_blank" rel="noreferrer">{LEGAL_WA_LABEL}</a> atau melalui email ke <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.</li>
              <li>Tim kami memverifikasi bahwa permintaan berasal dari pemilik akun, dengan menghubungi nomor HP atau email yang terdaftar.</li>
              <li>Setelah terverifikasi, akun dinonaktifkan dan data diproses sesuai ketentuan di bawah, paling lambat 14 hari kerja.</li>
              <li>Kami mengirim konfirmasi setelah penghapusan selesai.</li>
            </ol>
            <p>Jika Anda masih memiliki layanan yang sedang berjalan, tagihan yang belum lunas, atau penugasan aktif (khusus Mitra), hal tersebut perlu diselesaikan terlebih dahulu.</p>
          </>),
        },
        {
          judul: 'Data yang Dihapus',
          isi: (<ul>
            <li>Akun login (nomor HP atau email dan PIN/password).</li>
            <li>Data profil: nama, alamat, foto, dan dokumen yang diunggah (KTP, CV, sertifikat).</li>
            <li>Data pasien yang didaftarkan melalui aplikasi, beserta riwayat kesehatannya.</li>
            <li>Token notifikasi perangkat dan riwayat notifikasi.</li>
          </ul>),
        },
        {
          judul: 'Data yang Tetap Disimpan',
          isi: (<p>Sebagian data wajib kami simpan untuk memenuhi kewajiban hukum, akuntansi, dan perpajakan: kontrak layanan, tagihan dan bukti pembayaran, serta data penggajian Mitra. Data ini disimpan hingga 10 tahun sesuai ketentuan perpajakan, hanya diakses untuk keperluan tersebut, lalu dihapus. Data lain yang tidak lagi diperlukan dihapus atau dianonimkan sehingga tidak dapat dikaitkan lagi dengan Anda.</p>),
        },
        {
          judul: 'Menghapus Sebagian Data Saja',
          isi: (<p>Jika Anda hanya ingin menghapus atau memperbaiki data tertentu tanpa menutup akun, sebutkan data tersebut di kolom alasan pada formulir. Data profil juga dapat diperbarui langsung melalui menu Profil di aplikasi. Penjelasan lengkap tentang pengelolaan data ada di <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>.</p>),
        },
      ]}
    >
      <p style={{ margin: '0 0 18px' }}>Pengguna aplikasi <strong>Mikala Klien</strong> dan <strong>Mikala Mitra</strong> dari PT. Mikala Global Medika dapat meminta akun beserta data pribadinya dihapus kapan saja, tanpa biaya, melalui formulir berikut.</p>
      <FormHapusAkun wa={LEGAL_WA} email={LEGAL_EMAIL} />
    </LegalPage>
  );
}
