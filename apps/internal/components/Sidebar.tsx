'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@mikala/lib';
import { Home, Users, GraduationCap, Headphones, DollarSign, TrendingUp, Settings, ChevronRight, X, LogOut } from 'lucide-react';

const ALL_MENU = [
  { icon: Home,        label: 'Dashboard',     href: '/',              roles: ['manajemen','rekrutmen','training_center','customer_care','finance','marketing'] },
  { icon: Users,       label: 'Rekrutmen',     href: '/rekrutmen',     roles: ['manajemen','rekrutmen'] },
  { icon: GraduationCap, label: 'Training',    href: '/training',      roles: ['manajemen','training_center'] },
  { icon: Headphones,  label: 'Customer Care', href: '/customer-care', roles: ['manajemen','customer_care'] },
  { icon: DollarSign,  label: 'Finance',       href: '/finance',       roles: ['manajemen','finance'] },
  { icon: TrendingUp,  label: 'Marketing',     href: '/marketing',     roles: ['manajemen','marketing'] },
  { icon: Settings,    label: 'Settings',      href: '/settings',      roles: ['manajemen'] },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const role = user?.role || '';
  const menuItems = ALL_MENU.filter(item => item.roles.includes(role));
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'M';

  const roleLabel: Record<string, string> = {
    manajemen: 'Manajemen',
    rekrutmen: 'Rekrutmen',
    training_center: 'Training Center',
    customer_care: 'Customer Care',
    finance: 'Finance',
    marketing: 'Marketing',
  };

  const navigate = (href: string) => {
    router.push(href);
    onClose?.();
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <aside style={{
      width: '240px', height: '100vh',
      background: 'var(--bg2)',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      overflowY: 'auto', transition: 'background 0.3s',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div>
            <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png" alt="Mikala" style={{ height:'36px', objectFit:'contain' }} />
            <p style={{ color:'var(--text3)', fontSize:'11px', marginTop:'2px' }}>Internal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:'4px', display:'flex', alignItems:'center' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* User info */}
      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'13px', fontWeight:700, color:'var(--purple-light)' }}>
          {initials}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ color:'var(--text)', fontWeight:600, fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name || '-'}</p>
          <p style={{ color:'var(--purple-light)', fontSize:'11px', marginTop:'1px', textTransform:'capitalize' }}>{roleLabel[role] || role}</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:'2px' }}>
        <p style={{ color:'var(--text3)', fontSize:'10px', fontWeight:600, letterSpacing:'1px', padding:'8px 8px 4px', textTransform:'uppercase' }}>Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <button key={item.href} onClick={() => navigate(item.href)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px', border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent', cursor:'pointer', textAlign:'left', transition:'all 0.15s', background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))' : 'transparent', color: isActive ? 'var(--purple-light)' : 'var(--text2)' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent' }}>
                <Icon size={16} />
              </div>
              <span style={{ fontSize:'13px', fontWeight: isActive ? 600 : 400, flex:1 }}>{item.label}</span>
              {isActive && <ChevronRight size={14} style={{ opacity:0.6 }} />}
            </button>
          );
        })}
      </nav>

      {/* Logout + Footer */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid var(--border)' }}>
        <button onClick={handleLogout}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px', border:'1px solid rgba(239,68,68,0.2)', cursor:'pointer', background:'rgba(239,68,68,0.06)', color:'#ef4444' }}>
          <div style={{ width:'30px', height:'30px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <LogOut size={16} />
          </div>
          <span style={{ fontSize:'13px', fontWeight:500 }}>Keluar</span>
        </button>
        <p style={{ color:'var(--text3)', fontSize:'11px', textAlign:'center', marginTop:'10px' }}>v1.0.0 · © 2026 Mikala</p>
      </div>
    </aside>
  );
}
