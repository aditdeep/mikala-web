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
    <button
      onClick={toggle}
      className="p-2 rounded-xl transition-all duration-200"
      style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
    >
      {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: 'var(--purple-light)' }} />}
    </button>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!authService.isAuthenticated()) router.push('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto relative">
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>
      <RealtimeNotifProvider>{children}</RealtimeNotifProvider>
      <BottomNav />
      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div style={{
          position:'absolute', top:'-20%', right:'-10%',
          width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }}/>
        <div style={{
          position:'absolute', bottom:'10%', left:'-15%',
          width:'350px', height:'350px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        }}/>
      </div>
    </div>
  );
}
