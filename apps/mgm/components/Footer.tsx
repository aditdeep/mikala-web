import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mikala MGM</h3>
            <p className="text-gray-400">
              Layanan perawatan kesehatan profesional di rumah Anda
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/layanan" className="hover:text-white">Home Care</Link></li>
              <li><Link href="/layanan" className="hover:text-white">Medical Check-up</Link></li>
              <li><Link href="/layanan" className="hover:text-white">Rehabilitasi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/tentang" className="hover:text-white">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="hover:text-white">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@mikala.id</li>
              <li>Phone: +62 812 3456 7890</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Mikala Garda Medika. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
