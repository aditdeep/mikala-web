export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../(components)/Navbar';
import Footer from '../../(components)/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';
const GREEN = '#2d7a5e';
const PINK = '#d63a7a';
const WA = "https://wa.me/6281296998827";

function cleanContent(html: string): string {
  if (!html) return '';
  return html
    .replace(/\/in>/gi, '</i>')
    .replace(/<\/in>/gi, '</i>')
    .replace(/\bin\b(?=[^<]*<\/)/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
    .trim();
}

function addDropCap(html: string): string {
  if (!html) return '';
  return html.replace(
    /(<p[^>]*>)\s*([a-zA-Z])/,
    (_match: string, tag: string, letter: string) =>
      `${tag}<span style="float:left;font-size:3.8em;line-height:0.85;font-weight:900;color:#2d7a5e;margin:4px 10px 0 0;">${letter.toUpperCase()}</span>`
  );
}

async function getArtikel(slug: string) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/cms/artikel/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
}

async function getRelated(slug: string) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/cms/artikel?per_page=4`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const d = data.data;
    const all = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
    return all.filter((a: any) => a.slug !== slug).slice(0, 3);
  } catch { return []; }
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const [artikel, related] = await Promise.all([getArtikel(params.slug), getRelated(params.slug)]);
  if (!artikel) notFound();

  const kontenHtml = addDropCap(cleanContent(artikel.konten || `<p>${artikel.excerpt || ''}</p>`));

  return (
    <div style={{ minHeight:'100vh', background:'#f0faf5' }}>
      <Navbar active="/artikel" />

      <div style={{ maxWidth:'820px', margin:'0 auto', padding:'clamp(24px,5vw,48px) 16px' }}>
        <div style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'20px', fontSize:'12px', color:'#9ca3af', flexWrap:'wrap' }}>
          <Link href="/" style={{ color:GREEN, textDecoration:'none' }}>Beranda</Link>
          <span>/</span>
          <Link href="/artikel" style={{ color:GREEN, textDecoration:'none' }}>Artikel</Link>
          <span>/</span>
          <span style={{ color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'200px' }}>{artikel.judul}</span>
        </div>

        <div style={{ display:'flex', gap:'10px', marginBottom:'14px', alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ background:`${GREEN}15`, color:GREEN, borderRadius:'12px', padding:'4px 12px', fontSize:'12px', fontWeight:600 }}>{artikel.kategori||'Artikel'}</span>
          <span style={{ color:'#9ca3af', fontSize:'12px' }}>
            {artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : ''}
          </span>
        </div>

        <h1 style={{ fontSize:'clamp(22px,4vw,38px)', fontWeight:800, color:'#1a2e25', lineHeight:1.2, margin:'0 0 20px' }}>{artikel.judul}</h1>

        {artikel.thumbnail && (
          <div style={{ borderRadius:'16px', overflow:'hidden', marginBottom:'32px', boxShadow:'0 8px 30px rgba(0,0,0,0.1)' }}>
            <img src={artikel.thumbnail} alt={artikel.judul} style={{ width:'100%', maxHeight:'clamp(200px,50vw,440px)', objectFit:'cover' }} />
          </div>
        )}

        <div className="article-content" style={{ fontSize:'clamp(15px,2vw,17px)', lineHeight:1.9, color:'#374151' }}
          dangerouslySetInnerHTML={{ __html: kontenHtml }} />

        <div style={{ marginTop:'48px', paddingTop:'24px', borderTop:`2px solid ${GREEN}20` }}>
          <p style={{ fontWeight:600, color:'#1a2e25', marginBottom:'12px', fontSize:'14px' }}>Bagikan artikel ini:</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {[
              { label:'💬 WhatsApp', bg:'#25d366', href:`https://wa.me/?text=${encodeURIComponent(artikel.judul+' - https://mikalaglobalmedika.com/artikel/'+artikel.slug)}` },
              { label:'📘 Facebook', bg:'#1877f2', href:`https://www.facebook.com/sharer/sharer.php?u=https://mikalaglobalmedika.com/artikel/${artikel.slug}` },
              { label:'🐦 Twitter', bg:'#000', href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(artikel.judul)}&url=https://mikalaglobalmedika.com/artikel/${artikel.slug}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{ background:s.bg, color:'white', padding:'9px 18px', borderRadius:'20px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ marginTop:'40px', background:`linear-gradient(135deg, ${GREEN}10, ${PINK}10)`, borderRadius:'20px', padding:'28px', textAlign:'center', border:`1px solid ${GREEN}20` }}>
          <p style={{ fontWeight:700, color:'#1a2e25', fontSize:'18px', margin:'0 0 8px' }}>Butuh Layanan Homecare?</p>
          <p style={{ color:'#6b7280', margin:'0 0 20px', fontSize:'14px' }}>Konsultasi gratis dengan tim Mikala Global Medika</p>
          <a href={WA} target="_blank" rel="noreferrer"
            style={{ background:`linear-gradient(135deg, ${GREEN}, ${PINK})`, color:'white', padding:'12px 28px', borderRadius:'25px', fontSize:'14px', fontWeight:700, textDecoration:'none', display:'inline-block' }}>
            💬 Konsultasi Sekarang
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ background:'white', padding:'clamp(32px,6vw,56px) 16px' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <h2 style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:800, color:'#1a2e25', marginBottom:'24px' }}>Artikel Lainnya</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%,260px), 1fr))', gap:'16px' }}>
              {related.map((a: any, i: number) => (
                <Link key={i} href={`/artikel/${a.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'#f0faf5', borderRadius:'16px', overflow:'hidden', border:`1px solid ${GREEN}10` }}>
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
