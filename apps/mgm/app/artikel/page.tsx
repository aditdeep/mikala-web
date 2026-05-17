import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';

async function getArtikel() {
  try {
    const res = await fetch(`${API}/cms/artikel?per_page=100`, { next: { revalidate: 1800 } });
    const data = await res.json();
    const d = data.data;
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

export default async function ArtikelPage() {
  const artikel = await getArtikel();
  return (
    <div style={{ minHeight:'100vh', background:'#f8fffe' }}>
      <Navbar active="/artikel" />
      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'60px 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(28px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 12px' }}>Artikel & Blog</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', margin:0 }}>Tips kesehatan, informasi medis, dan cerita inspiratif</p>
      </div>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'60px 20px' }}>
        {artikel.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>Belum ada artikel</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'24px' }}>
            {artikel.map((a: any, i: number) => (
              <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                <div style={{ background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid rgba(45,122,94,0.08)', height:'100%' }}>
                  <div style={{ height:'200px', overflow:'hidden' }}>
                    {a.thumbnail ? <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}22, ${PINK}22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>📰</div>}
                  </div>
                  <div style={{ padding:'20px' }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'10px', alignItems:'center' }}>
                      <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'12px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{a.kategori||'Artikel'}</span>
                      <span style={{ color:'#9ca3af', fontSize:'12px' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                    </div>
                    <h3 style={{ fontSize:'16px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px', lineHeight:1.4 }}>{a.judul}</h3>
                    <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.6, margin:'0 0 12px' }}>{(a.excerpt||'').slice(0,120)}...</p>
                    <span style={{ color:GREEN, fontSize:'13px', fontWeight:600 }}>Baca →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
