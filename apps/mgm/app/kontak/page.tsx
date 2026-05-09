'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input, Button, Alert } from '@mikala/ui';
import { apiClient } from '@mikala/lib';

export default function KontakPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await apiClient.post('/public/leads', {
        name,
        email,
        phone,
        message,
        source: 'mgm_website',
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim pesan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">Hubungi Kami</h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Kami siap membantu Anda. Isi form di bawah ini dan tim kami akan segera menghubungi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {success && (
                <Alert variant="success" className="mb-4">
                  Terima kasih! Kami akan segera menghubungi Anda.
                </Alert>
              )}

              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Nomor Telepon"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Alamat</h3>
                    <p className="text-gray-600">
                      Jl. Contoh No. 123<br />
                      Jakarta Selatan 12345<br />
                      Indonesia
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">info@mikala.id</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Telepon</h3>
                    <p className="text-gray-600">+62 812 3456 7890</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Jam Operasional</h3>
                    <p className="text-gray-600">
                      Senin - Jumat: 08:00 - 17:00<br />
                      Sabtu: 08:00 - 13:00<br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
