'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Headphones, 
  DollarSign, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Rekrutmen', href: '/rekrutmen' },
    { icon: GraduationCap, label: 'Training', href: '/training' },
    { icon: Headphones, label: 'Customer Care', href: '/customer-care' },
    { icon: DollarSign, label: 'Finance', href: '/finance' },
    { icon: TrendingUp, label: 'Marketing', href: '/marketing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400">Mikala Internal</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive 
                  ? 'bg-gray-800 border-l-4 border-blue-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
