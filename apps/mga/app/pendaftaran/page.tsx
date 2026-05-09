'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input, Button, Alert, Select } from '@mikala/ui';
import { apiClient } from '@mikala/lib';

export default function PendaftaranPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('');
  const [education, setEducation] = useState('');
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
      await apiClient.post('/public/mga-registration', {
        name,
        email,
        phone,
        program,
        education,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setProgram('');
      setEducation('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">Pendaftaran</h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Isi form di bawah ini untuk mendaftar program pelatihan
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {success && (
              <Alert variant="success" className="mb-6">
                Terima kasih! Pendaftaran Anda telah kami terima. Tim kami akan menghubungi Anda segera.
              </Alert>
            )}

            {error && (
              <Alert variant="error" className="mb-6">
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

              <Select
                label="Program yang Diminati"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                required
              >
                <option value="">Pilih Program</option>
                <option value="basic">Pelatihan Dasar Home Care</option>
                <option value="professional">Sertifikasi Profesional</option>
                <option value="workshop">Workshop Spesialisasi</option>
              </Select>

              <Select
                label="Pendidikan Terakhir"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
              >
                <option value="">Pilih Pendidikan</option>
                <option value="sma">SMA/SMK</option>
                <option value="d3">D3</option>
                <option value="s1">S1</option>
                <option value="other">Lainnya</option>
              </Select>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan / Pertanyaan (Opsional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Mengirim...' : 'Daftar Sekarang'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
