'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { BottomNav } from '@/components/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
