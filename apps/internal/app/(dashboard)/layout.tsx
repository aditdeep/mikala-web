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
    {/* dashboard-shell/-col/-main: dikasih className (bukan cuma inline style) supaya bisa
        di-reset khusus di @media print (globals.css) -- tanpa ini, height:100vh + overflow:hidden
        di sini bikin konten yg lebih panjang dari 1 layar (CV multi-halaman, dsb) ke-crop pas
        print/save-as-PDF, gak pernah lanjut ke halaman 2. Sidebar & Header dikasih .no-print
        biar ilang total (display:none) pas print, gak sekadar invisible (yg masih makan tempat). */}
    <div className="dashboard-shell" style={{ display:'flex', height:'100vh', width:'100%', overflow:'hidden', background:'var(--bg)', position:'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:40 }}
          className="lg:hidden no-print"
        />
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:block no-print" style={{ flexShrink:0, height:'100vh' }}>
        <Sidebar />
      </div>

      {/* Sidebar mobile - slide in */}
      <div style={{ position:'fixed', top:0, left: sidebarOpen ? '0' : '-260px', zIndex:50, height:'100vh', transition:'left 0.3s ease' }} className="lg:hidden no-print">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="dashboard-col" style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div className="no-print"><Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} /></div>
        <main className="dashboard-main" style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'16px' }}>
          {children}
        </main>
      </div>
    </div>
    </RealtimeNotifProvider>
  );
}
