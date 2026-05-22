import { MetadataRoute } from 'next';

const BASE = 'https://mikalaglobalmedika.com';
const API  = process.env.NEXT_PUBLIC_API_URL || 'https://mikala-api.onrender.com/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/layanan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tentang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
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

  return [...staticPages, ...artikelPages];
}
