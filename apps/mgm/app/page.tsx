import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Users, Clock, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Layanan Kesehatan Profesional di Rumah Anda
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Mikala Garda Medika menyediakan perawat dan tenaga kesehatan terlatih untuk membantu Anda dan keluarga
            </p>
            <Link
              href="/kontak"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Mulai Konsultasi
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih Kami?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-lg mb-4">
                <Heart className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Perawatan Profesional</h3>
              <p className="text-gray-600">Tenaga kesehatan terlatih dan bersertifikat</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-lg mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tim Berpengalaman</h3>
              <p className="text-gray-600">Lebih dari 100+ mitra profesional</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-lg mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Layanan 24/7</h3>
              <p className="text-gray-600">Siap melayani kapan saja Anda butuhkan</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-lg mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Terpercaya</h3>
              <p className="text-gray-600">Standar keamanan dan kualitas terjamin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Layanan Kami</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3">Home Care</h3>
              <p className="text-gray-600 mb-4">
                Perawatan harian untuk lansia, pasien pasca operasi, atau kondisi khusus
              </p>
              <Link href="/layanan" className="text-blue-600 font-medium hover:underline">
                Pelajari Lebih Lanjut →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3">Medical Check-up</h3>
              <p className="text-gray-600 mb-4">
                Pemeriksaan kesehatan rutin di rumah Anda
              </p>
              <Link href="/layanan" className="text-blue-600 font-medium hover:underline">
                Pelajari Lebih Lanjut →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3">Rehabilitasi</h3>
              <p className="text-gray-600 mb-4">
                Program rehabilitasi fisik dan terapi di rumah
              </p>
              <Link href="/layanan" className="text-blue-600 font-medium hover:underline">
                Pelajari Lebih Lanjut →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Hubungi kami sekarang untuk konsultasi gratis
          </p>
          <Link
            href="/kontak"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Hubungi Kami Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
