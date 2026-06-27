export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const PER_PAGE = 12;

async function getArtikel(page = 1) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/cms/artikel?per_page=${PER_PAGE}&page=${page}`, { next: { revalidate: 1800 } });
    const data = await res.json();
    const d = data.data;
    if (d?.data) return { items: d.data, total: d.total || 0, lastPage: d.last_page || 1, currentPage: d.current_page || 1 };
    if (Array.isArray(d)) return { items: d, total: d.length, lastPage: 1, currentPage: 1 };
    return { items: [], total: 0, lastPage: 1, currentPage: 1 };
  } catch { return { items: [], total: 0, lastPage: 1, currentPage: 1 }; }
}

export default async function ArtikelPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const { items: artikel, total, lastPage, currentPage } = await getArtikel(page);

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/artikel" />

      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(40px,8vw,70px) 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px,5vw,42px)', fontWeight:800, color:'white', margin:'0 0 10px' }}>Artikel & Blog</h1>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'clamp(13px,2vw,16px)', margin:0 }}>
          {total > 0 ? `${total} artikel tersedia` : 'Tips kesehatan, informasi medis, dan cerita inspiratif'}
        </p>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'clamp(32px,6vw,60px) 16px' }}>
        {artikel.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>Belum ada artikel</div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap:'20px', marginBottom:'48px' }}>
              {artikel.map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(10px)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid rgba(45,122,94,0.08)', height:'100%', display:'flex', flexDirection:'column' }}>
                    <div style={{ height:'190px', overflow:'hidden', flexShrink:0, position:'relative' }}>
                      {a.thumbnail
                        ? <img src={a.thumbnail} alt={a.judul} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>📰</div>
                      }
                      <div style={{ position:'absolute', top:'10px', left:'10px' }}>
                        <span style={{ background:'rgba(45,122,94,0.88)', backdropFilter:'blur(8px)', color:'white', borderRadius:'10px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{a.kategori||'Artikel'}</span>
                      </div>
                    </div>
                    <div style={{ padding:'16px 18px 18px', display:'flex', flexDirection:'column', flex:1 }}>
                      <p style={{ color:'#9ca3af', fontSize:'11px', margin:'0 0 6px' }}>
                        {a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}
                      </p>
                      <h3 style={{ fontSize:'15px', fontWeight:700, color:'#1a2e25', margin:'0 0 8px', lineHeight:1.4, flex:1 }}>{a.judul}</h3>
                      <p style={{ fontSize:'12px', color:'#6b7280', margin:'0 0 12px', lineHeight:1.5 }}>{(a.excerpt||'').slice(0,100)}...</p>
                      <span style={{ color:GREEN, fontSize:'13px', fontWeight:600 }}>Baca Selengkapnya →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                {currentPage > 1 && (
                  <Link href={`/artikel?page=${currentPage-1}`}
                    style={{ padding:'8px 16px', background:'rgba(255,255,255,0.9)', border:`1px solid ${GREEN}30`, borderRadius:'10px', color:GREEN, fontWeight:600, fontSize:'13px', textDecoration:'none' }}>
                    ← Prev
                  </Link>
                )}
                {pages.map(p => (
                  <Link key={p} href={`/artikel?page=${p}`}
                    style={{ width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', fontSize:'13px', fontWeight:600, textDecoration:'none',
                      background: p===currentPage ? `linear-gradient(135deg, ${GREEN}, ${PINK})` : 'rgba(255,255,255,0.9)',
                      color: p===currentPage ? 'white' : '#374151',
                      border: p===currentPage ? 'none' : `1px solid ${GREEN}20`,
                    }}>
                    {p}
                  </Link>
                ))}
                {currentPage < lastPage && (
                  <Link href={`/artikel?page=${currentPage+1}`}
                    style={{ padding:'8px 16px', background:'rgba(255,255,255,0.9)', border:`1px solid ${GREEN}30`, borderRadius:'10px', color:GREEN, fontWeight:600, fontSize:'13px', textDecoration:'none' }}>
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
