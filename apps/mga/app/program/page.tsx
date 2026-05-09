import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Check, Clock, Calendar } from 'lucide-react';

export default function ProgramPage() {
  const programs = [
    {
      title: 'Pelatihan Dasar Home Care',
      duration: '2 Minggu',
      schedule: 'Senin - Jumat, 09:00 - 15:00',
      price: 'Rp 2.500.000',
      features: [
        'Pengenalan dasar perawatan',
        'Vital signs monitoring',
        'Komunikasi efektif dengan pasien',
        'First aid & emergency response',
        'Praktik langsung dengan supervisor',
      ],
    },
    {
      title: 'Sertifikasi Profesional Home Care',
      duration: '1 Bulan',
      schedule: 'Senin - Jumat, 09:00 - 17:00',
      price: 'Rp 5.000.000',
      features: [
        'Materi pelatihan dasar lengkap',
        'Advanced care techniques',
        'Manajemen kasus pasien',
        'Etika profesional',
        'Praktik intensif di lapangan',
        'Ujian sertifikasi resmi',
        'Job placement assistance',
      ],
    },
    {
      title: 'Workshop Spesialisasi',
      duration: '1-3 Hari',
      schedule: 'Sabtu - Minggu',
      price: 'Mulai dari Rp 500.000',
      features: [
        'Topik spesifik (geriatri, stroke care, dll)',
        'Instruktur ahli di bidangnya',
        'Sesi praktik intensif',
        'Sertifikat kehadiran',
        'Networking dengan profesional',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">Program Pelatihan</h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Pilih program yang sesuai dengan tujuan karir Anda
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((program, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">{program.title}</h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={20} />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={20} />
                    <span>{program.schedule}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t">
                  <p className="text-2xl font-bold text-purple-600 mb-4">{program.price}</p>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Daftar Sekarang
                  </button>
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
