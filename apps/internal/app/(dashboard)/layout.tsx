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

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: 'var(--bg)',
      position: 'relative',
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '240px' : '0px',
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        height: '100vh',
      }}
      className="sidebar-wrapper"
      >
        <div style={{ width: '240px', height: '100%' }}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        transition: 'all 0.3s ease',
      }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
