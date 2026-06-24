'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router  = useRouter();
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<any>(null);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Masukkan email'); return; }
    setLoading(true); setError('');
    try {
      const res: any = await apiClient.post('/auth/forgot-password', { email });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally { setLoading(false); }
  };

  const bg = 'linear-gradient(135deg,#0a1f1a,#0d2818,#0a1f1a)';
  const inp: React.CSSProperties = {
    width:'100%', padding:'13px 14px 13px 42px',
    background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'14px', color:'white', fontSize:'14px',
    outline:'none', boxSizing:'border-box' as const,
  };

  return (
    <div style={{ minHeight:'100vh', background:bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png" alt="Mikala" style={{ height:'36px', marginBottom:'8px' }}/>
          <h1 style={{ color:'white', fontSize:'22px', fontWeight:800 }}>Lupa Password</h1>
          <p style={{ color:'rgba(16,185,129,0.7)', fontSize:'13px', marginTop:'4px' }}>
            Masukkan email untuk menerima instruksi reset
          </p>
        </div>

        <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'28px' }}>
          {!result ? (
            <>
              {error && (
                <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px', color:'#f87171', fontSize:'13px' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div>
                  <label style={{ color:'rgba(16,185,129,0.8)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Email</label>
                  <div style={{ position:'relative' }}>
                    <Mail size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(16,185,129,0.6)' }}/>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@contoh.com" required style={inp}/>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  padding:'14px', background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#10b981,#059669)',
                  border:'none', borderRadius:'14px', color:'white', fontSize:'14px',
                  fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Mengirim...' : 'Kirim Instruksi Reset'}
                </button>
              </form>
            </>
          ) : (
            /* ── Hasil berhasil ── */
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <CheckCircle2 size={32} style={{ color:'#10b981' }}/>
              </div>
              <h3 style={{ color:'white', fontSize:'17px', fontWeight:700, marginBottom:'8px' }}>Instruksi Terkirim!</h3>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', lineHeight:'1.6', marginBottom:'20px' }}>
                {result.email_sent
                  ? `Link reset password telah dikirim ke ${email}. Cek inbox atau folder spam.`
                  : `Email gagal terkirim. Gunakan WhatsApp di bawah untuk bantuan reset.`}
              </p>

              {/* Email info */}
              {result.email_sent && (
                <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'12px', padding:'12px', marginBottom:'12px', fontSize:'12px', color:'rgba(255,255,255,0.6)', textAlign:'left' }}>
                  📧 Link berlaku <strong style={{ color:'white' }}>60 menit</strong>. Cek folder spam jika tidak ada di inbox.
                </div>
              )}

              {/* WA Button — selalu tampil sebagai alternatif */}
              {result.wa_url && (
                <div style={{ marginBottom:'12px' }}>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', textAlign:'center', marginBottom:'8px' }}>
                    — atau —
                  </p>
                  <a href={result.wa_url} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', padding:'13px', background:'rgba(37,211,102,0.15)', border:'2px solid rgba(37,211,102,0.4)', borderRadius:'14px', color:'#25d366', fontSize:'14px', fontWeight:700, textDecoration:'none', boxSizing:'border-box' as const }}>
                    <span style={{ fontSize:'20px' }}>💬</span>
                    <span>Hubungi CS via WhatsApp</span>
                  </a>
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', textAlign:'center', marginTop:'6px' }}>
                    Respon cepat di jam kerja 08.00–21.00 WIB
                  </p>
                </div>
              )}

              <button onClick={() => router.push('/auth/login')}
                style={{ width:'100%', padding:'12px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'14px', color:'white', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>
                Kembali ke Login
              </button>
            </div>
          )}
        </div>

        {!result && (
          <button onClick={() => router.push('/auth/login')}
            style={{ display:'flex', alignItems:'center', gap:'6px', margin:'20px auto 0', background:'none', border:'none', color:'rgba(16,185,129,0.6)', fontSize:'13px', cursor:'pointer' }}>
            <ArrowLeft size={14}/> Kembali ke Login
          </button>
        )}
      </div>
    </div>
  );
}
