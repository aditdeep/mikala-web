'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@mikala/lib';
import {
  Home, Users, GraduationCap, Headphones, DollarSign,
  TrendingUp, Settings, ChevronRight, ChevronDown, X, LogOut, Globe,
  Building2, UserCheck,
} from 'lucide-react';

// ── Menu config ────────────────────────────────────────────────────────────────
const ALL_MENU = [
  {
    icon: Home, label: 'Dashboard', href: '/',
    roles: ['manajemen','rekrutmen','training_center','customer_care','finance','marketing'],
  },
  {
    icon: Users, label: 'Rekrutmen', href: '/rekrutmen',
    roles: ['manajemen','rekrutmen'],
    children: [
      { icon: UserCheck, label: 'Data Mitra',  href: '/rekrutmen' },
      { icon: Building2, label: 'Lembaga',     href: '/rekrutmen/lembaga' },
    ],
  },
  {
    icon: GraduationCap, label: 'Training', href: '/training',
    roles: ['manajemen','training_center'],
  },
  {
    icon: Headphones, label: 'Customer Care', href: '/customer-care',
    roles: ['manajemen','customer_care'],
  },
  {
    icon: DollarSign, label: 'Finance', href: '/finance',
    roles: ['manajemen','finance'],
  },
  {
    icon: TrendingUp, label: 'Marketing', href: '/marketing',
    roles: ['manajemen','marketing'],
  },
  {
    icon: Settings, label: 'Settings', href: '/settings',
    roles: ['manajemen'],
  },
  {
    icon: Globe, label: 'Website MGM', href: '/website',
    roles: ['manajemen','marketing'],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user, setUser] = useState<any>(null);

  // Track expanded submenus
  const [expanded, setExpanded] = useState<string[]>(() => {
    // Auto-expand kalau sedang di salah satu child route
    return ['/rekrutmen']; // default expand rekrutmen
  });

  useEffect(() => {
    setUser(authService.getUser());
    // Auto-expand menu yang sedang aktif
    ALL_MENU.forEach(item => {
      if (item.children && item.children.some(c => pathname.startsWith(c.href))) {
        setExpanded(prev => prev.includes(item.href) ? prev : [...prev, item.href]);
      }
    });
  }, [pathname]);

  const role       = user?.role || '';
  const menuItems  = ALL_MENU.filter(item => item.roles.includes(role));
  const initials   = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'M';

  const roleLabel: Record<string, string> = {
    manajemen:      'Manajemen',
    rekrutmen:      'Rekrutmen',
    training_center:'Training Center',
    customer_care:  'Customer Care',
    finance:        'Finance',
    marketing:      'Marketing',
  };

  const navigate = (href: string) => {
    router.push(href);
    onClose?.();
  };

  const toggleExpand = (href: string) => {
    setExpanded(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname === href);

  const isParentActive = (item: typeof ALL_MENU[0]) => {
    if (!item.children) return isActive(item.href);
    return item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'));
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
      <div style={{ padding:'20px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div>
            <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png" alt="Mikala" style={{ height:'36px', objectFit:'contain' }}/>
            <p style={{ color:'var(--text3)', fontSize:'11px', marginTop:'2px' }}>Internal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:'4px', display:'flex' }}>
            <X size={18}/>
          </button>
        )}
      </div>

      {/* User info */}
      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'13px', fontWeight:700, color:'var(--purple-light)' }}>
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
          const Icon        = item.icon;
          const hasChildren = !!(item.children && item.children.length > 0);
          const parentActive= isParentActive(item);
          const isOpen      = expanded.includes(item.href);

          return (
            <div key={item.href}>
              {/* Parent menu item */}
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(item.href);
                  } else {
                    navigate(item.href);
                  }
                }}
                style={{
                  width:'100%', display:'flex', alignItems:'center', gap:'10px',
                  padding:'10px 12px', borderRadius:'12px', cursor:'pointer',
                  textAlign:'left', transition:'all 0.15s',
                  border: parentActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  background: parentActive ? 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1))' : 'transparent',
                  color: parentActive ? 'var(--purple-light)' : 'var(--text2)',
                }}>
                <div style={{ width:'30px', height:'30px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: parentActive ? 'rgba(124,58,237,0.15)' : 'transparent' }}>
                  <Icon size={16}/>
                </div>
                <span style={{ fontSize:'13px', fontWeight: parentActive ? 600 : 400, flex:1 }}>{item.label}</span>
                {hasChildren
                  ? (isOpen
                      ? <ChevronDown size={14} style={{ opacity:0.6, transition:'transform 0.2s' }}/>
                      : <ChevronRight size={14} style={{ opacity:0.6, transition:'transform 0.2s' }}/>)
                  : (parentActive && <ChevronRight size={14} style={{ opacity:0.6 }}/>)
                }
              </button>

              {/* Children submenu */}
              {hasChildren && isOpen && (
                <div style={{ marginLeft:'14px', marginTop:'2px', display:'flex', flexDirection:'column', gap:'2px', borderLeft:'2px solid rgba(124,58,237,0.2)', paddingLeft:'10px' }}>
                  {item.children!.map((child) => {
                    const ChildIcon    = child.icon;
                    const childActive  = pathname === child.href || pathname.startsWith(child.href + '/');
                    return (
                      <button key={child.href} onClick={() => navigate(child.href)}
                        style={{
                          width:'100%', display:'flex', alignItems:'center', gap:'8px',
                          padding:'8px 10px', borderRadius:'10px', cursor:'pointer',
                          textAlign:'left', transition:'all 0.15s',
                          border: childActive ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
                          background: childActive ? 'rgba(124,58,237,0.1)' : 'transparent',
                          color: childActive ? 'var(--purple-light)' : 'var(--text3)',
                        }}>
                        <div style={{ width:'26px', height:'26px', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: childActive ? 'rgba(124,58,237,0.15)' : 'transparent' }}>
                          <ChildIcon size={14}/>
                        </div>
                        <span style={{ fontSize:'12px', fontWeight: childActive ? 600 : 400 }}>{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout + Footer */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid var(--border)' }}>
        <button onClick={handleLogout}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px', border:'1px solid rgba(239,68,68,0.2)', cursor:'pointer', background:'rgba(239,68,68,0.06)', color:'#ef4444' }}>
          <div style={{ width:'30px', height:'30px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <LogOut size={16}/>
          </div>
          <span style={{ fontSize:'13px', fontWeight:500 }}>Keluar</span>
        </button>
        <p style={{ color:'var(--text3)', fontSize:'11px', textAlign:'center', marginTop:'10px' }}>v1.0.0 · © 2026 Mikala</p>
      </div>
    </aside>
  );
}
