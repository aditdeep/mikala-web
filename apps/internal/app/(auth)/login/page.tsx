'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Eye, EyeOff, Lock, Mail, LayoutDashboard } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await authService.login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{
            width:'64px', height:'64px', borderRadius:'18px',
            background:'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 14px',
            boxShadow:'0 8px 24px rgba(124,58,237,0.4)',
          }}>
            <LayoutDashboard size={28} color="white" />
          </div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>Mikala Internal</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Platform manajemen operasional</p>
        </div>

        {/* Card */}
        <div style={{
          background:'var(--glass)',
          backdropFilter:'blur(20px)',
          border:'1px solid var(--glass-border)',
          borderRadius:'24px',
          padding:'28px',
          boxShadow:'var(--shadow)',
        }}>
          <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>Selamat Datang</h2>
          <p style={{ color:'var(--text3)', fontSize:'13px', marginBottom:'24px' }}>Masuk ke akun Anda</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'10px 14px', marginBottom:'16px', color:'#ef4444', fontSize:'13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@mikala.com" required
                  style={{ width:'100%', padding:'11px 12px 11px 38px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontSize:'13px', outline:'none' }}
                />
              </div>
            </div>
            <div>
              <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }} />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ width:'100%', padding:'11px 38px 11px 38px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontSize:'13px', outline:'none' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop:'6px', padding:'13px',
              background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border:'none', borderRadius:'12px', color:'white',
              fontSize:'14px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 4px 16px rgba(124,58,237,0.35)',
            }}>
              {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>

        <p style={{ color:'var(--text3)', fontSize:'11px', textAlign:'center', marginTop:'20px' }}>
          © 2026 Mikala Global Medika
        </p>
      </div>
    </div>
  );
}
