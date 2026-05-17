'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/');
    } else {
      router.replace('/auth/login');
    }
  }, [router]);
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'3px solid #7c3aed', borderTopColor:'transparent', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
