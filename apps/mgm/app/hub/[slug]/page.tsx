import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import Bagikan from './Bagikan';
import './hub.css';

// mikalaglobalmedika.com/hub/{slug} -- pengganti linktree.mikalaglobalmedika.com (SaaS 66biolinks yg berat).
// Isinya diatur dari CMS Web MGM > Linktree (setting `linktree`, JSON per slug).
const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';
const SITE = 'https://mikalaglobalmedika.com';

type Link = { label: string; url: string; ikon?: string };
type Profil = { nama: string; bio?: string; foto?: string; links: Link[] };

// Isi bawaan (= isi linktree lama) selama CMS belum diisi
const BAWAAN: Record<string, Profil> = {
  mgm: {
    nama: 'Mikala Global Medika',
    bio: 'Layanan perawat homecare, caregiver lansia & babysitter profesional.',
    foto: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png',
    links: [
      { label: 'Website', url: 'https://mikalaglobalmedika.com/' },
      { label: 'WhatsApp Admin 1', url: 'https://wa.me/6282114488878' },
      { label: 'WhatsApp Admin 2', url: 'https://wa.me/6281296998827' },
      { label: 'WhatsApp Admin 3', url: 'https://wa.me/6281513382031' },
      { label: 'Instagram', url: 'https://www.instagram.com/mikalaglobalmedika' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@mikalaglobalmedika_pt' },
      { label: 'Facebook', url: 'https://www.facebook.com/mikalaglobalmdk' },
      { label: 'YouTube', url: 'https://www.youtube.com/@MikalaGlobalMedika' },
    ],
  },
};

async function getProfil(slug: string): Promise<Profil | null> {
  const key = slug.toLowerCase();
  try {
    const res = await fetch(`${API}/cms/settings`, { next: { revalidate: 60 } });
    const raw = (await res.json())?.data?.linktree;
    const semua = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const p = semua?.[key];
    if (p?.nama) return { ...p, links: (p.links || []).filter((l: Link) => l?.label && l?.url) };
  } catch {}
  return BAWAAN[key] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProfil(params.slug);
  return p ? { title: `${p.nama} | Linktree`, description: p.bio || p.nama, openGraph: { title: p.nama, description: p.bio, images: p.foto ? [p.foto] : [] } } : {};
}

// Ikon brand (path SVG 24x24, dari Simple Icons) + ikon umum
const IKON: Record<string, string> = {
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  facebook: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  web: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26Zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8 8 0 0 1 5.07 16Zm2.95-8H5.07a8 8 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.02 8ZM12 19.96A14.1 14.1 0 0 1 10.09 16h3.82A14.1 14.1 0 0 1 12 19.96ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38Z',
  email: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.24-8 5-8-5V6l8 5 8-5v2.24Z',
  telepon: 'M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z',
  lokasi: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z',
  link: 'M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12ZM8 13h8v-2H8v2Zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10Z',
};
const WARNA: Record<string, string> = { whatsapp: '#25D366', instagram: '#E1306C', tiktok: '#111111', facebook: '#1877F2', youtube: '#FF0000', linkedin: '#0A66C2' };

/** Ikon dipilih dari kolom ikon di CMS, atau ditebak dari URL-nya. */
function jenis(l: Link): string {
  if (l.ikon && IKON[l.ikon]) return l.ikon;
  const u = l.url.toLowerCase();
  if (/wa\.me|whatsapp/.test(u)) return 'whatsapp';
  for (const k of ['instagram', 'tiktok', 'facebook', 'youtube', 'linkedin']) if (u.includes(k)) return k;
  if (u.startsWith('mailto:')) return 'email';
  if (u.startsWith('tel:')) return 'telepon';
  if (/maps\.|goo\.gl\/maps|maps\.app/.test(u)) return 'lokasi';
  return 'web';
}

/** Teks kecil di bawah judul: @handle, nomor WA, atau nama domain. */
function keterangan(l: Link, k: string): string {
  try {
    if (k === 'whatsapp') {
      const d = (l.url.match(/(\d{9,15})/) || [])[1] || '';
      return d ? '+' + d.replace(/^(\d{2})(\d{3})(\d{4})(\d+)$/, '$1 $2-$3-$4') : 'WhatsApp';
    }
    if (k === 'email') return l.url.replace(/^mailto:/, '').split('?')[0];
    if (k === 'telepon') return l.url.replace(/^tel:/, '');
    const u = new URL(l.url);
    const seg = u.pathname.split('/').filter(Boolean)[0] || '';
    if (['instagram', 'tiktok', 'youtube'].includes(k) && seg) return seg.startsWith('@') ? seg : '@' + seg;
    if (k === 'facebook' && seg) return 'fb.com/' + seg;
    return u.hostname.replace(/^www\./, '');
  } catch { return ''; }
}

export default async function HubPage({ params }: { params: { slug: string } }) {
  const p = await getProfil(params.slug);
  if (!p) notFound();
  const url = `${SITE}/hub/${params.slug.toLowerCase()}`;
  const qr = await QRCode.toDataURL(url, { width: 512, margin: 2, color: { dark: '#1a2e25', light: '#ffffff' } });
  const n = p.links.length;
  return (
    <main className="hub">
      <div className="hub-glow hub-glow-a" /><div className="hub-glow hub-glow-b" />
      <div className="hub-isi">
        <header className="hub-atas">
          <Bagikan url={url} qr={qr} nama={p.nama} slug={params.slug.toLowerCase()} />
          {p.foto && <img className="hub-logo" src={p.foto} alt={p.nama} width={112} height={112} />}
          <h1 className="hub-nama">
            {p.nama}
            <svg className="hub-centang" viewBox="0 0 24 24" aria-label="Akun resmi"><path d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3-2.6 1.9-1 3.1-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3.1-2.6-1.9 1-3-1-3.1L5.2 6.3l1-3 3.2.1L12 1.5Z"/><path d="m8 12.3 2.6 2.6L16.2 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </h1>
          {p.bio && <p className="hub-bio">{p.bio}</p>}
          <div className="hub-garis" />
        </header>
        <nav className="hub-links">
          {p.links.map((l, i) => {
            const k = jenis(l);
            // warna kartu bergeser teal (192) -> ungu -> magenta-merah (345) dari atas ke bawah
            const h = Math.round(192 + (n > 1 ? i / (n - 1) : 0) * 153);
            return (
              <a key={i} className="hub-link" href={l.url} target="_blank" rel="noopener noreferrer"
                style={{ ['--h' as any]: h, animationDelay: `${0.06 * i}s` }}>
                <span className="hub-ikon"><svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: WARNA[k] || `hsl(${h} 70% 42%)` }}><path d={IKON[k]} /></svg></span>
                <span className="hub-teks">
                  <span className="hub-label">{l.label}</span>
                  {keterangan(l, k) && <span className="hub-ket">{keterangan(l, k)}</span>}
                </span>
                <svg className="hub-panah" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
              </a>
            );
          })}
        </nav>
        <a className="hub-footer" href={SITE}>© {new Date().getFullYear()} PT Mikala Global Medika</a>
      </div>
    </main>
  );
}
