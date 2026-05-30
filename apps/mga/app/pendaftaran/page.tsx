'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PendaftaranPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('https://mikala-web-mitra.vercel.app/auth/register');
  }, []);
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <p style={{ color:'#666' }}>Mengalihkan ke halaman pendaftaran...</p>
    </div>
  );
}
