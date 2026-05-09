import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Tentang Mikala Garda Akademi</h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-gray-600 mb-6">
              Mikala Garda Akademi adalah lembaga pelatihan dan sertifikasi tenaga kesehatan yang fokus pada pengembangan home care professionals di Indonesia.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Visi</h2>
            <p className="text-gray-600 mb-6">
              Menjadi akademi pelatihan tenaga kesehatan home care terkemuka di Indonesia yang menghasilkan lulusan berkompeten dan siap kerja.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Misi</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Menyediakan program pelatihan berkualitas tinggi</li>
              <li>Memberikan sertifikasi resmi yang diakui industri</li>
              <li>Membantu lulusan mendapatkan pekerjaan yang layak</li>
              <li>Meningkatkan standar profesionalisme tenaga kesehatan home care</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Keunggulan Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Instruktur Berpengalaman</h3>
                <p className="text-gray-600">Diajar oleh profesional dengan pengalaman lapangan puluhan tahun</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Fasilitas Modern</h3>
                <p className="text-gray-600">Ruang praktik lengkap dengan peralatan medis standar</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Sertifikat Resmi</h3>
                <p className="text-gray-600">Sertifikasi yang diakui oleh industri dan pemerintah</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Job Placement</h3>
                <p className="text-gray-600">Jaringan mitra untuk penempatan kerja lulusan</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Alumni Kami</h2>
            <p className="text-gray-600 mb-6">
              Lebih dari 500+ alumni telah berhasil menyelesaikan program kami dan bekerja di berbagai institusi kesehatan, rumah sakit, dan layanan home care di seluruh Indonesia.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
