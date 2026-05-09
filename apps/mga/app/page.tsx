import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GraduationCap, Award, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Wujudkan Karir di Bidang Kesehatan
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Mikala Garda Akademi menyediakan program pelatihan dan sertifikasi untuk menjadi tenaga kesehatan profesional
            </p>
            <Link
              href="/pendaftaran"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Bergabung dengan Kami?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 rounded-lg mb-4">
                <GraduationCap className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pelatihan Berkualitas</h3>
              <p className="text-gray-600">Kurikulum teruji dan instruktur berpengalaman</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 rounded-lg mb-4">
                <Award className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sertifikasi Resmi</h3>
              <p className="text-gray-600">Sertifikat yang diakui industri</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 rounded-lg mb-4">
                <Users className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Job Placement</h3>
              <p className="text-gray-600">Bantuan penempatan kerja setelah lulus</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 rounded-lg mb-4">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Karir Cerah</h3>
              <p className="text-gray-600">Prospek karir yang menjanjikan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Program Pelatihan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3">Pelatihan Dasar Home Care</h3>
              <p className="text-gray-600 mb-4">
                Program 2 minggu untuk mempelajari dasar-dasar perawatan kesehatan di rumah
              </p>
              <p className="font-semibold text-purple-600 mb-4">Durasi: 2 minggu</p>
              <Link href="/program" className="text-purple-600 font-medium hover:underline">
                Pelajari Lebih Lanjut →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3">Sertifikasi Profesional</h3>
              <p className="text-gray-600 mb-4">
                Program 1 bulan dengan sertifikasi resmi untuk tenaga kesehatan
              </p>
              <p className="font-semibold text-purple-600 mb-4">Durasi: 1 bulan</p>
              <Link href="/program" className="text-purple-600 font-medium hover:underline">
                Pelajari Lebih Lanjut →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3">Workshop Khusus</h3>
              <p className="text-gray-600 mb-4">
                Workshop intensif untuk topik-topik spesifik dalam perawatan kesehatan
              </p>
              <p className="font-semibold text-purple-600 mb-4">Durasi: 1-3 hari</p>
              <Link href="/program" className="text-purple-600 font-medium hover:underline">
                Pelajari Lebih Lanjut →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Mulai Karir Anda Hari Ini</h2>
          <p className="text-xl text-gray-600 mb-8">
            Bergabunglah dengan ratusan alumni kami yang telah berkarir sukses
          </p>
          <Link
            href="/pendaftaran"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Daftar Program Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
