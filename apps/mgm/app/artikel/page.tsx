export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Navbar from '../(components)/Navbar';
import Footer from '../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const GREEN = '#0e92b3';
const PINK = '#9c488b';
const PER_PAGE = 5;

const CATEGORIES = ['Artikel Kesehatan', 'Berita Perusahaan', 'Tips Kesehatan', 'Tokoh Kesehatan', 'Pengembangan Diri'];

async function getArtikel(page = 1, search = '', kategori = '') {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const qs = new URLSearchParams({ per_page: String(PER_PAGE), page: String(page) });
    if (search) qs.set('search', search);
    if (kategori) qs.set('kategori', kategori);
    const res = await fetch(`${API}/cms/artikel?${qs.toString()}`, { next: { revalidate: (search || kategori) ? 0 : 1800 } });
    const data = await res.json();
    const d = data.data;
    if (d?.data) return { items: d.data, total: d.total || 0, lastPage: d.last_page || 1, currentPage: d.current_page || 1 };
    if (Array.isArray(d)) return { items: d, total: d.length, lastPage: 1, currentPage: 1 };
    return { items: [], total: 0, lastPage: 1, currentPage: 1 };
  } catch { return { items: [], total: 0, lastPage: 1, currentPage: 1 }; }
}

// Bangun daftar halaman dengan elipsis, mis: 1 ... 4 5 [6] 7 8 ... 12
function buildPageList(current: number, last: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const add = (p: number) => { if (!pages.includes(p)) pages.push(p); };
  add(1);
  for (let p = current - 1; p <= current + 1; p++) if (p > 1 && p < last) add(p);
  add(last);
  const sorted = pages.filter(p => typeof p === 'number').sort((a: any, b: any) => a - b) as number[];
  const result: (number | '...')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
    result.push(sorted[i]);
  }
  return result;
}

function buildLink(page: number, search: string, kategori: string) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  if (search) qs.set('q', search);
  if (kategori) qs.set('kategori', kategori);
  return `/artikel?${qs.toString()}`;
}

export default async function ArtikelPage({ searchParams }: { searchParams: { page?: string; q?: string; kategori?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.q || '';
  const kategori = searchParams.kategori || '';
  const { items: artikel, total, lastPage, currentPage } = await getArtikel(page, search, kategori);

  const pageList = buildPageList(currentPage, lastPage);

  return (
    <div style={{ minHeight:'100vh', background:'#eef8fa' }}>
      <Navbar active="/artikel" />

      {/* ═══ BANNER MAJALAH ═══ */}
      <div style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, padding:'clamp(36px,7vw,60px) 20px clamp(20px,4vw,32px)', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(24px,4.5vw,38px)', fontWeight:800, color:'white', margin:'0 0 4px', letterSpacing:'1px' }}>MAJALAH</h1>
        <p style={{ fontSize:'clamp(13px,2vw,17px)', color:'rgba(255,255,255,0.85)', fontStyle:'italic', margin:0 }}>Mikala Global Magazine</p>
      </div>

      {/* ═══ TAB KATEGORI (gaya folder explorer) ═══ */}
      <div style={{ background:'white', borderBottom:`1px solid ${GREEN}15`, position:'sticky', top:0, zIndex:10 }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto', display:'flex', overflowX:'auto', gap:'4px', padding:'0 16px' }} className="majalah-tabs">
          <Link href={buildLink(1, search, '')} style={{
            padding:'14px 18px', fontSize:'13px', fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0,
            color: !kategori ? GREEN : '#6b7280',
            borderBottom: !kategori ? `3px solid ${GREEN}` : '3px solid transparent',
          }}>Semuanya</Link>
          {CATEGORIES.map(c => (
            <Link key={c} href={buildLink(1, search, c)} style={{
              padding:'14px 18px', fontSize:'13px', fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0,
              color: kategori === c ? GREEN : '#6b7280',
              borderBottom: kategori === c ? `3px solid ${GREEN}` : '3px solid transparent',
            }}>{c}</Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'clamp(28px,5vw,48px) 16px' }}>
        {search && (
          <p style={{ color:'#6b7280', fontSize:'14px', margin:'0 0 20px' }}>
            {total > 0 ? `${total} hasil untuk "${search}"` : `Tidak ada hasil untuk "${search}"`}
          </p>
        )}

        {artikel.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>Belum ada artikel di kategori ini</div>
        ) : (
          <>
            <div style={{ display:'flex', flexDirection:'column', gap:'18px', marginBottom:'40px' }}>
              {artikel.map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{
                    display:'grid', gridTemplateColumns:'clamp(120px,26vw,190px) 1fr', gap:'0',
                    background:'rgba(255,255,255,0.95)', borderRadius:'18px', overflow:'hidden',
                    boxShadow:'0 4px 18px rgba(0,0,0,0.06)', border:`1px solid ${GREEN}12`,
                  }} className="majalah-row">
                    <div style={{ position:'relative', minHeight:'120px' }}>
                      {a.thumbnail
                        ? <img src={a.thumbnail} alt={a.judul} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                        : <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${GREEN}20, ${PINK}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>📰</div>
                      }
                    </div>
                    <div style={{ padding:'clamp(14px,2.5vw,22px)', display:'flex', flexDirection:'column', justifyContent:'center', minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
                        <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'8px', padding:'2px 9px', fontSize:'10.5px', fontWeight:700 }}>{a.kategori||'Artikel'}</span>
                        <span style={{ color:'#9ca3af', fontSize:'11px' }}>
                          {(a.published_at||a.created_at) ? new Date(a.published_at||a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}
                        </span>
                      </div>
                      <h3 style={{ fontSize:'clamp(14px,2vw,17px)', fontWeight:800, color:'#1a2e25', margin:'0 0 6px', lineHeight:1.4 }}>{a.judul}</h3>
                      <p style={{ fontSize:'12.5px', color:'#6b7280', margin:'0 0 8px', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{(a.excerpt||'').slice(0,140)}</p>
                      <span style={{ color:GREEN, fontSize:'12.5px', fontWeight:700 }}>Baca Selengkapnya →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination gaya "< Sebelumnya ... 4 5 6 ... Selanjutnya >" */}
            {lastPage > 1 && (
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                {currentPage > 1 && (
                  <Link href={buildLink(currentPage-1, search, kategori)}
                    style={{ padding:'8px 14px', background:'white', border:`1px solid ${GREEN}30`, borderRadius:'10px', color:GREEN, fontWeight:600, fontSize:'13px', textDecoration:'none' }}>
                    ← Sebelumnya
                  </Link>
                )}
                {pageList.map((p, idx) => p === '...' ? (
                  <span key={`dots-${idx}`} style={{ padding:'0 4px', color:'#9ca3af', fontSize:'13px' }}>...</span>
                ) : (
                  <Link key={p} href={buildLink(p, search, kategori)}
                    style={{ width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', fontSize:'13px', fontWeight:600, textDecoration:'none',
                      background: p===currentPage ? `linear-gradient(135deg, ${GREEN}, ${PINK})` : 'white',
                      color: p===currentPage ? 'white' : '#374151',
                      border: p===currentPage ? 'none' : `1px solid ${GREEN}20`,
                    }}>
                    {p}
                  </Link>
                ))}
                {currentPage < lastPage && (
                  <Link href={buildLink(currentPage+1, search, kategori)}
                    style={{ padding:'8px 14px', background:'white', border:`1px solid ${GREEN}30`, borderRadius:'10px', color:GREEN, fontWeight:600, fontSize:'13px', textDecoration:'none' }}>
                    Selanjutnya →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />

      <style>{`
        .majalah-tabs::-webkit-scrollbar { height: 4px; }
        @media (max-width: 560px) {
          .majalah-row { grid-template-columns: 100px 1fr !important; }
        }
      `}</style>
    </div>
  );
}
