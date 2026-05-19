'use client';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function RegisterSuccessPage() {
  const router = useRouter();
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center',
    }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <CheckCircle2 size={40} style={{ color: '#10b981' }} />
      </div>
      <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>
        Pendaftaran Berhasil! 🎉
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', maxWidth: '320px', lineHeight: '1.7', marginBottom: '28px' }}>
        Data Anda sudah diterima. Tim Rekrutmen Mikala akan menghubungi Anda dalam 1-3 hari kerja untuk proses verifikasi.
      </p>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', maxWidth: '320px', width: '100%' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px' }}>Proses selanjutnya:</p>
        {['Tim rekrutmen review dokumen', 'Jadwal interview akan dikirim', 'Verifikasi & aktivasi akun'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{s}</p>
          </div>
        ))}
      </div>
      <button onClick={() => router.push('/auth/login')} style={{
        padding: '13px 32px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700,
        fontSize: '14px', cursor: 'pointer',
      }}>
        Masuk ke Akun
      </button>
    </div>
  );
}
