'use client';
import { useState, useEffect } from 'react';
import { Bell, LogOut, Sun, Moon, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { useTheme } from '@/components/ThemeProvider';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => { setUser(authService.getUser()); }, []);

  const handleLogout = async () => { await authService.logout(); router.push('/login'); };
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'U';

  return (
    <header style={{ background:'var(--glass)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid var(--glass-border)', padding:'0 16px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, gap:'12px' }}>
      {/* Hamburger - mobile only */}
      <button onClick={onMenuClick} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'var(--glass)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }} className="lg:hidden">
        <Menu size={18} style={{ color:'var(--text2)' }} />
      </button>

      {/* Search */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', padding:'8px 14px', flex:1, maxWidth:'280px' }}>
        <Search size={15} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari..." style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
        <button onClick={toggle} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'var(--glass)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          {theme === 'dark' ? <Sun size={15} style={{ color:'#fbbf24' }} /> : <Moon size={15} style={{ color:'var(--purple-light)' }} />}
        </button>
        <button style={{ width:'36px', height:'36px', borderRadius:'10px', background:'var(--glass)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>
          <Bell size={15} style={{ color:'var(--text2)' }} />
          <span style={{ position:'absolute', top:'7px', right:'7px', width:'7px', height:'7px', borderRadius:'50%', background:'#ef4444', border:'1.5px solid var(--bg)' }}/>
        </button>
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowDropdown(!showDropdown)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'5px 10px 5px 5px', borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--glass-border)', cursor:'pointer' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'11px', fontWeight:700 }}>{initials}</div>
            <span style={{ fontSize:'13px', fontWeight:500, color:'var(--text)' }} className="hidden sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
          </button>
          {showDropdown && (
            <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:'160px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', overflow:'hidden', zIndex:100 }}>
              <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'12px 14px', background:'transparent', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'13px', fontWeight:500 }}>
                <LogOut size={14} />Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
