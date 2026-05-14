'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) router.push('/login');
  }, [router]);

  // Tutup sidebar kalau resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>

      {/* Desktop sidebar - static */}
      <div style={{
        display: 'none',
        width: '240px',
        flexShrink: 0,
        height: '100vh',
      }} className="lg-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar - overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            width: '240px',
            zIndex: 50,
          }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
