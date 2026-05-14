'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, GraduationCap, Headphones, DollarSign, TrendingUp, Settings, ChevronRight, X } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Rekrutmen', href: '/rekrutmen' },
  { icon: GraduationCap, label: 'Training', href: '/training' },
  { icon: Headphones, label: 'Customer Care', href: '/customer-care' },
  { icon: DollarSign, label: 'Finance', href: '/finance' },
  { icon: TrendingUp, label: 'Marketing', href: '/marketing' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    onClose?.();
  };

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      background: 'var(--bg2)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      overflowY: 'auto',
      transition: 'background 0.3s',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
          }}>
            <span style={{ color:'white', fontWeight:800, fontSize:'16px' }}>M</span>
          </div>
          <div>
            <p style={{ color:'var(--text)', fontWeight:700, fontSize:'14px', lineHeight:1 }}>Mikala</p>
            <p style={{ color:'var(--text3)', fontSize:'11px', marginTop:'2px' }}>Internal</p>
          </div>
        </div>
        {/* Close button - mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden"
            style={{
              background:'none', border:'none', cursor:'pointer',
              color:'var(--text3)', padding:'4px',
              display:'flex', alignItems:'center',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px', display:'flex', flexDirection:'column', gap:'2px' }}>
        <p style={{
          color:'var(--text3)', fontSize:'10px', fontWeight:600,
          letterSpacing:'1px', padding:'8px 8px 4px',
          textTransform:'uppercase',
        }}>Menu Utama</p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:'10px',
                padding:'10px 12px', borderRadius:'12px',
                border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                cursor:'pointer', textAlign:'left', transition:'all 0.15s',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))'
                  : 'transparent',
                color: isActive ? 'var(--purple-light)' : 'var(--text2)',
              }}
            >
              <div style={{
                width:'30px', height:'30px', borderRadius:'8px',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
                background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
              }}>
                <Icon size={16} />
              </div>
              <span style={{ fontSize:'13px', fontWeight: isActive ? 600 : 400, flex:1 }}>
                {item.label}
              </span>
              {isActive && <ChevronRight size={14} style={{ opacity:0.6 }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)' }}>
        <p style={{ color:'var(--text3)', fontSize:'11px', textAlign:'center' }}>
          v1.0.0 · © 2026 Mikala
        </p>
      </div>
    </aside>
  );
}
