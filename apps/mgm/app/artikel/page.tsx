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
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/artikel" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Artikel & Blog</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>Tips kesehatan, informasi medis, dan cerita inspiratif</p>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        {artikel.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>Belum ada artikel</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap:'20px' }}>
            {artikel.map((a: any, i: number) => (
              <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                <div style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(10px)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid rgba(45,122,94,0.08)', height:'100%', display:'flex', flexDirection:'column' }}>
                  <div style={{ height:'190px', overflow:'hidden', flexShrink:0 }}>
                    {a.thumbnail
                      ? <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>📰</div>
                    }
                  </div>
                  <div style={{ padding:'16px 18px 18px', display:'flex', flexDirection:'column', flex:1 }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'8px', alignItems:'center', flexWrap:'wrap' }}>
                      <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'10px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>{a.kategori||'Artikel'}</span>
                      <span style={{ color:'#9ca3af', fontSize:'11px' }}>
                        {a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}
                      </span>
                    </div>
                    <h3 style={{ fontSize:'15px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px', lineHeight:1.4, flex:1 }}>{a.judul}</h3>
                    <p style={{ fontSize:'12px', color:'#6b7280', margin:'0 0 12px', lineHeight:1.5 }}>{(a.excerpt||'').slice(0,100)}...</p>
                    <span style={{ color:GREEN, fontSize:'13px', fontWeight:600 }}>Baca Selengkapnya →</span>
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
