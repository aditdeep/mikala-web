import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Tentang Mikala Garda Medika</h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-gray-600 mb-6">
              Mikala Garda Medika adalah platform layanan kesehatan yang menghubungkan keluarga dengan tenaga kesehatan profesional untuk perawatan di rumah.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Visi Kami</h2>
            <p className="text-gray-600 mb-6">
              Menjadi platform layanan kesehatan rumah terdepan di Indonesia yang memberikan akses mudah, cepat, dan terpercaya untuk perawatan berkualitas.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Misi Kami</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Menyediakan tenaga kesehatan profesional dan terlatih</li>
              <li>Memberikan layanan kesehatan berkualitas tinggi</li>
              <li>Memudahkan akses perawatan kesehatan di rumah</li>
              <li>Menciptakan ekosistem kesehatan yang berkelanjutan</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Nilai Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Profesional</h3>
                <p className="text-gray-600">Standar layanan tinggi dengan tenaga terlatih</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Terpercaya</h3>
                <p className="text-gray-600">Komitmen pada keamanan dan kualitas</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Peduli</h3>
                <p className="text-gray-600">Mengutamakan kesejahteraan pasien</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Inovatif</h3>
                <p className="text-gray-600">Menggunakan teknologi untuk kemudahan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
