import { MetadataRoute } from 'next';
import { slugify } from '@/lib/slug';

const BASE = 'https://mikalaglobalmedika.com';
const API  = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/layanan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/perusahaan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/perusahaan/prakata`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/artikel`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/galeri`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/kontak`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
  ];

  // Dynamic artikel pages
  let artikelPages: MetadataRoute.Sitemap = [];
  try {
    const res  = await fetch(`${API}/cms/artikel?per_page=100`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const articles = data.data || [];
    artikelPages = articles.map((a: any) => ({
      url:             `${BASE}/artikel/${a.slug}`,
      lastModified:    new Date(a.updated_at || a.created_at),
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    }));
  } catch {}

  // Dynamic layanan detail pages
  let layananPages: MetadataRoute.Sitemap = [];
  try {
    const res  = await fetch(`${API}/cms/layanan`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const items = data.data || [];
    layananPages = items.map((l: any) => ({
      url:             `${BASE}/layanan/${slugify(l.nama)}`,
      lastModified:    new Date(l.updated_at || l.created_at || Date.now()),
      changeFrequency: 'monthly' as const,
      priority:        0.6,
    }));
  } catch {}

  return [...staticPages, ...artikelPages, ...layananPages];
}
