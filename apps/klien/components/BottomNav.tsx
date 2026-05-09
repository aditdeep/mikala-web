'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, Users, FileText, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Briefcase, label: 'Layanan', href: '/layanan' },
    { icon: Users, label: 'Pasien', href: '/pasien' },
    { icon: FileText, label: 'Tagihan', href: '/tagihan' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
