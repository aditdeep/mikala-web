'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, Wallet, User, BookOpen } from 'lucide-react';

const navItems = [
  { icon: Home,     label: 'Home',      href: '/' },
  { icon: Briefcase,label: 'Jobs',      href: '/jobs' },
  { icon: BookOpen, label: 'Pelatihan', href: '/pelatihan' },
  { icon: Wallet,   label: 'Gaji',      href: '/kontrol-gaji' },
  { icon: User,     label: 'Profile',   href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{
      background: 'var(--glass)', backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid var(--glass-border)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <button key={href} onClick={() => router.push(href)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200"
              style={{ color: isActive ? 'var(--purple-light)' : 'var(--text-muted)' }}>
              <div className="p-1.5 rounded-xl transition-all duration-200" style={{
                background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}>
                <Icon size={19} />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
