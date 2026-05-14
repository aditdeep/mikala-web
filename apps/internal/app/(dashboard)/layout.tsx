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
      overflow: 'hidden',
      background: 'var(--bg)',
      position: 'relative',
      maxWidth: '100vw',
    }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar - desktop: static, mobile: overlay */}
      <div style={{
        flexShrink: 0,
        width: '240px',
        position: 'relative',
        zIndex: 50,
        // Mobile: slide in/out sebagai overlay
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        position: 'fixed' as any,
        top: 0, bottom: 0, left: 0,
        transition: 'transform 0.3s ease',
      }}
      className="lg:relative lg:translate-x-0 lg:transform-none"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content - tidak terpengaruh overlay */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        maxWidth: '100%',
      }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
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
