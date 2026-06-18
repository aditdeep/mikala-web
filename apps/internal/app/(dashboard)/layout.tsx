'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import RealtimeNotifProvider from '@/components/RealtimeNotifProvider';

const ROLE_HOME: Record<string, string> = {
  manajemen:      '/',
  rekrutmen:      '/rekrutmen',
  training_center:'/training',
  customer_care:  '/customer-care',
  finance:        '/finance',
  marketing:      '/marketing',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <RealtimeNotifProvider>
    <div style={{ display:'flex', height:'100vh', width:'100%', overflow:'hidden', background:'var(--bg)', position:'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:40 }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:block" style={{ flexShrink:0, height:'100vh' }}>
        <Sidebar />
      </div>

      {/* Sidebar mobile - slide in */}
      <div style={{ position:'fixed', top:0, left: sidebarOpen ? '0' : '-260px', zIndex:50, height:'100vh', transition:'left 0.3s ease' }} className="lg:hidden">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'16px' }}>
          {children}
        </main>
      </div>
    </div>
    </RealtimeNotifProvider>
  );
}
