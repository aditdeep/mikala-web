import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Check } from 'lucide-react';

export default function LayananPage() {
  const services = [
    {
      title: 'Home Care Harian',
      description: 'Perawatan rutin untuk aktivitas sehari-hari',
      features: [
        'Bantuan mandi dan berpakaian',
        'Monitoring vital signs',
        'Pemberian obat',
        'Pendampingan aktivitas',
      ],
      price: 'Mulai dari Rp 500.000/hari',
    },
    {
      title: 'Home Care Live-in',
      description: 'Perawat tinggal 24 jam di lokasi',
      features: [
        'Perawatan intensif 24 jam',
        'Monitoring kesehatan berkelanjutan',
        'Siaga darurat medis',
        'Laporan harian ke keluarga',
      ],
      price: 'Mulai dari Rp 3.000.000/minggu',
    },
    {
      title: 'Medical Check-up',
      description: 'Pemeriksaan kesehatan di rumah',
      features: [
        'Pemeriksaan tekanan darah',
        'Cek gula darah',
        'Pengambilan sampel lab',
        'Konsultasi dokter',
      ],
      price: 'Mulai dari Rp 300.000',
    },
    {
      title: 'Rehabilitasi Fisik',
      description: 'Terapi dan rehabilitasi pasca operasi',
      features: [
        'Fisioterapi profesional',
        'Program latihan terstruktur',
        'Evaluasi progress berkala',
        'Konsultasi rehabilitasi medis',
      ],
      price: 'Mulai dari Rp 400.000/sesi',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">Layanan Kami</h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Pilihan layanan kesehatan profesional yang disesuaikan dengan kebutuhan Anda dan keluarga
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t">
                  <p className="text-lg font-semibold text-blue-600">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
