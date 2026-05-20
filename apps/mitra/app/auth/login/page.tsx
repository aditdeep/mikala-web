'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'20px', position:'relative', overflow:'hidden',
      background:'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a2e 100%)',
    }}>
      {/* Orbs */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'5%', left:'-10%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:'400px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{
            width:'72px', height:'72px', borderRadius:'22px', margin:'0 auto 16px',
            background:'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 8px 32px rgba(124,58,237,0.5)',
          }}>
            <span style={{ color:'white', fontSize:'28px', fontWeight:800 }}>M</span>
          </div>
          <h1 style={{ color:'white', fontSize:'26px', fontWeight:800, letterSpacing:'-0.5px' }}>Mikala Mitra</h1>
          <p style={{ color:'rgba(167,139,250,0.8)', fontSize:'14px', marginTop:'6px' }}>Masuk ke akun Anda</p>
        </div>

        {/* Card */}
        <div style={{
          background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:'28px', padding:'32px',
          boxShadow:'0 24px 64px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', color:'#f87171', fontSize:'14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ color:'rgba(167,139,250,0.8)', fontSize:'13px', fontWeight:500, display:'block', marginBottom:'8px' }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(167,139,250,0.6)' }}/>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required
                  style={{ width:'100%', padding:'13px 14px 13px 42px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box' as const }}/>
              </div>
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <label style={{ color:'rgba(167,139,250,0.8)', fontSize:'13px', fontWeight:500 }}>Password</label>
                <a href="/auth/forgot-password" style={{ color:'rgba(167,139,250,0.6)', fontSize:'12px', textDecoration:'none' }}>Lupa password?</a>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(167,139,250,0.6)' }}/>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ width:'100%', padding:'13px 42px 13px 42px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box' as const }}/>
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(167,139,250,0.6)', display:'flex' }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop:'8px', padding:'15px',
              background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border:'none', borderRadius:'14px', color:'white', fontSize:'15px', fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer', boxShadow:'0 4px 20px rgba(124,58,237,0.4)',
            }}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }}/>
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px' }}>atau</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }}/>
          </div>

          {/* Daftar button */}
          <a href="/auth/register" style={{
            display:'block', width:'100%', padding:'14px',
            background:'rgba(124,58,237,0.12)', border:'2px solid rgba(124,58,237,0.4)',
            borderRadius:'14px', color:'#a78bfa', fontSize:'14px', fontWeight:700,
            textAlign:'center', textDecoration:'none', boxSizing:'border-box' as const,
            transition:'all 0.2s',
          }}>
            🚀 Daftar sebagai Mitra
          </a>
        </div>

        <p style={{ color:'rgba(167,139,250,0.4)', fontSize:'12px', textAlign:'center', marginTop:'24px' }}>
          © 2026 Mikala Global Medika
        </p>
      </div>
    </div>
  );
}
