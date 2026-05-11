'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!authService.isAuthenticated()) router.push('/login'); }, [router]);

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)', position:'relative' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:40, display:'block' }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: sidebarOpen ? 0 : '-240px',
        top: 0, bottom: 0,
        zIndex: 50,
        transition: 'left 0.3s ease',
        width: '240px',
      }}
      className="lg:static lg:left-0 lg:translate-x-0"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex:1, overflowY:'auto', padding:'16px' }} className="lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
