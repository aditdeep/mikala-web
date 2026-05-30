import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Mikala Global Akademi — LPK Perawat Profesional untuk Jepang',
  description: 'Lembaga Pelatihan Kerja profesional mempersiapkan tenaga perawat untuk bekerja di Jepang (Kaigo). Bersertifikat, berpengalaman, dan terpercaya.',
  keywords: 'LPK perawat jepang, kaigo, lembaga pelatihan kerja, perawat lansia jepang, mikala akademi',
  metadataBase: new URL('https://mikalaglobalakademi.co.id'),
  icons: {
    icon:  'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png',
    apple: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png',
  },
  openGraph: {
    title: 'Mikala Global Akademi — LPK Perawat ke Jepang',
    description: 'Wujudkan karir perawat profesional di Jepang bersama Mikala Global Akademi',
    url: 'https://mikalaglobalakademi.co.id',
    siteName: 'Mikala Global Akademi',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
