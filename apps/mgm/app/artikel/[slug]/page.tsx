import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../(components)/Navbar';
import Footer from '../../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

async function getArtikel(slug: string) {
  try {
    const res = await fetch(`${API}/cms/artikel/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
}

async function getRelated() {
  try {
    const res = await fetch(`${API}/cms/artikel?per_page=4`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const d = data.data;
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const [artikel, related] = await Promise.all([getArtikel(params.slug), getRelated()]);
  if (!artikel) notFound();

  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>
      <Navbar active="/artikel" />
      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'40px 20px' }}>
        <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'24px', fontSize:'13px', color:'#9ca3af' }}>
          <Link href="/" style={{ color:GREEN, textDecoration:'none' }}>Beranda</Link>
          <span>/</span>
          <Link href="/artikel" style={{ color:GREEN, textDecoration:'none' }}>Artikel</Link>
          <span>/</span>
          <span style={{ color:'#374151' }}>{artikel.judul?.slice(0,40)}...</span>
        </div>
        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'12px', padding:'4px 12px', fontSize:'12px', fontWeight:600 }}>{artikel.kategori||'Artikel'}</span>
          <span style={{ color:'#9ca3af', fontSize:'13px' }}>{artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : ''}</span>
        </div>
        <h1 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#1a2e25', lineHeight:1.2, margin:'0 0 24px' }}>{artikel.judul}</h1>
        {artikel.thumbnail && (
          <div style={{ borderRadius:'20px', overflow:'hidden', marginBottom:'36px', boxShadow:'0 8px 30px rgba(0,0,0,0.1)' }}>
            <img src={artikel.thumbnail} alt={artikel.judul} style={{ width:'100%', maxHeight:'460px', objectFit:'cover' }} />
          </div>
        )}
        <div style={{ fontSize:'17px', lineHeight:1.9, color:'#374151' }}
          dangerouslySetInnerHTML={{ __html: artikel.konten || artikel.excerpt || '' }} />
        <div style={{ marginTop:'48px', paddingTop:'28px', borderTop:`2px solid ${GREEN}20` }}>
          <p style={{ fontWeight:600, color:'#1a2e25', marginBottom:'12px' }}>Bagikan:</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {[
              { label:'💬 WhatsApp', color:'#25d366', href:`https://wa.me/?text=${encodeURIComponent(artikel.judul+' https://mikalaglobalmedika.com/artikel/'+artikel.slug)}` },
              { label:'📘 Facebook', color:'#1877f2', href:`https://www.facebook.com/sharer/sharer.php?u=https://mikalaglobalmedika.com/artikel/${artikel.slug}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{ background:s.color, color:'white', padding:'8px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div style={{ background:'white', padding:'48px 20px' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <h2 style={{ fontSize:'24px', fontWeight:800, color:'#1a2e25', marginBottom:'24px' }}>Artikel Lainnya</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'20px' }}>
              {related.filter((r:any) => r.slug !== params.slug).slice(0,3).map((a:any, i:number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'#f8fffe', borderRadius:'16px', overflow:'hidden', border:'1px solid rgba(45,122,94,0.1)' }}>
                    {a.thumbnail && <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'150px', objectFit:'cover' }} />}
                    <div style={{ padding:'14px' }}>
                      <h4 style={{ fontSize:'14px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px', lineHeight:1.4 }}>{a.judul}</h4>
                      <span style={{ color:GREEN, fontSize:'12px', fontWeight:600 }}>Baca →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
