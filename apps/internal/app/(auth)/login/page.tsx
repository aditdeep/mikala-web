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
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg)' }}>
      {/* Left Panel */}
      <div style={{ flex:1, background:'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', right:'-10%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }}/>
        <div style={{ position:'absolute', bottom:'-5%', left:'-5%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)' }}/>
        <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:'320px' }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'22px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 8px 32px rgba(124,58,237,0.5)' }}>
            <LayoutDashboard size={30} color="white" />
          </div>
          <h1 style={{ color:'white', fontSize:'28px', fontWeight:800, marginBottom:'12px' }}>Mikala Internal</h1>
          <p style={{ color:'rgba(167,139,250,0.7)', fontSize:'15px', lineHeight:1.6 }}>Platform manajemen operasional Mikala Global Medika & Akademi</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'40px' }}>
            {['Rekrutmen & HR', 'Finance & Payroll', 'Customer Care', 'Marketing'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'12px', padding:'12px 16px' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'linear-gradient(135deg, #7c3aed, #ec4899)', flexShrink:0 }}/>
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'13px' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width:'480px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px', background:'var(--bg)' }}>
        <div style={{ width:'100%', maxWidth:'380px' }}>
          <h2 style={{ fontSize:'24px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Selamat Datang</h2>
          <p style={{ color:'var(--text3)', fontSize:'14px', marginBottom:'32px' }}>Masuk ke platform internal Anda</p>

          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', color:'#ef4444', fontSize:'14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ color:'var(--text2)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@mikala.com" required style={{ width:'100%', padding:'13px 14px 13px 42px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', color:'var(--text)', fontSize:'14px', outline:'none' }} />
              </div>
            </div>
            <div>
              <label style={{ color:'var(--text2)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ width:'100%', padding:'13px 42px 13px 42px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', color:'var(--text)', fontSize:'14px', outline:'none' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ marginTop:'8px', padding:'14px', background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'14px', color:'white', fontSize:'15px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow:'0 4px 20px rgba(124,58,237,0.4)' }}>
              {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
            </button>
          </form>
          <p style={{ color:'var(--text3)', fontSize:'12px', textAlign:'center', marginTop:'24px' }}>© 2026 Mikala Global Medika</p>
        </div>
      </div>
    </div>
  );
}
