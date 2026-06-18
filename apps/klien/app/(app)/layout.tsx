'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { BottomNav } from '@/components/BottomNav';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import RealtimeNotifProvider from '@/components/RealtimeNotifProvider';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="p-2 rounded-xl transition-all duration-200"
      style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
      {theme === 'dark'
        ? <Sun size={18} style={{ color: '#fbbf24' }} />
        : <Moon size={18} style={{ color: 'var(--green)' }} />}
    </button>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!authService.isAuthenticated()) router.push('/auth/login');
  }, [router]);

  return (
    <RealtimeNotifProvider>
    <div className="min-h-screen pb-20 max-w-lg mx-auto relative">
      <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
      {children}
      <BottomNav />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }}/>
        <div style={{ position:'absolute', bottom:'10%', left:'-15%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)' }}/>
      </div>
    </div>
    </RealtimeNotifProvider>
  );
}