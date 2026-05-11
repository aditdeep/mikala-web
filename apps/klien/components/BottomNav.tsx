'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, Users, FileText, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Briefcase, label: 'Layanan', href: '/layanan' },
  { icon: Users, label: 'Pasien', href: '/pasien' },
  { icon: FileText, label: 'Tagihan', href: '/tagihan' },
  { icon: User, label: 'Profil', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{
      background: 'var(--glass)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid var(--glass-border)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200"
              style={{ color: isActive ? 'var(--green)' : 'var(--text-muted)' }}
            >
              <div className="p-1.5 rounded-xl transition-all duration-200" style={{
                background: isActive ? 'rgba(16,185,129,0.15)' : 'transparent',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}>
                <Icon size={19} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
