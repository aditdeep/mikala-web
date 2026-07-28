export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';
import { slugify } from '@/lib/slug';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK = '#9c488b';

const TYPE_LABEL: Record<string, string> = { artikel: 'Majalah', layanan: 'Layanan', penunjang: 'Penunjang Kesehatan' };

function resultUrl(r: any) {
  if (r.type === 'artikel') return `/artikel/${r.slug}`;
  if (r.type === 'layanan') return `/layanan/${slugify(r.nama)}`;
  if (r.type === 'penunjang') return `/penunjang/${slugify(r.nama)}`;
  return '/';
}

async function getResults(q: string) {
  if (!q) return [];
  try {
    const res = await fetch(`${API}/cms/search?q=${encodeURIComponent(q)}`, { next: { revalidate: 0 } });
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch { return []; }
}

export default async function PencarianPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || '';
  const results = await getResults(q);

  return (
    <div style={{ minHeight:'100vh', background:'#eef8fa' }}>
      <Navbar active="" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(36px,7vw,60px) 20px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
          <h1 style={{ fontSize:'clamp(22px,4vw,34px)', fontWeight:800, color:'white', margin:'0 0 8px' }}>
            {q ? `Hasil untuk "${q}"` : 'Pencarian'}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px', margin:0 }}>
            {q ? `${results.length} hasil ditemukan di seluruh halaman Mikala Global Medika` : 'Ketik kata kunci di kolom pencarian untuk mulai mencari'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'clamp(28px,5vw,48px) 16px' }}>
        {q && results.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>Tidak ada hasil yang cocok dengan "{q}"</div>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {results.map((r: any, i: number) => (
            <Link key={i} href={resultUrl(r)} style={{ textDecoration:'none' }}>
              <div style={{
                display:'grid', gridTemplateColumns:'clamp(90px,20vw,120px) 1fr', gap:'0',
                background:'rgba(255,255,255,0.95)', borderRadius:'16px', overflow:'hidden',
                boxShadow:'0 4px 18px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}12`,
              }}>
                <div style={{ position:'relative', minHeight:'90px' }}>
                  {r.thumbnail ? (
                    <img src={r.thumbnail} alt={r.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px' }}>🔎</div>
                  )}
                </div>
                <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', justifyContent:'center', minWidth:0 }}>
                  <span style={{ display:'inline-block', background:`${GREEN}15`, color:GREEN, borderRadius:'8px', padding:'2px 9px', fontSize:'10.5px', fontWeight:700, marginBottom:'6px', alignSelf:'flex-start' }}>{TYPE_LABEL[r.type] || r.type}</span>
                  <h3 style={{ fontSize:'15px', fontWeight:800, color:'#1a2e25', margin:'0 0 6px', lineHeight:1.4 }}>{r.title}</h3>
                  {r.excerpt && <p style={{ fontSize:'12.5px', color:'#6b7280', margin:0, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{r.excerpt}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
