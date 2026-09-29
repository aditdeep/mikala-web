import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { LangProvider } from '../lib/LangContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';

// Ambil settings SEO & analytics dari CMS Website MGA (menyamakan pola dengan MGM: GTM
// (GTM-xxxxxxx, container buat pasang banyak tag sekaligus) itu beda produk dari Google
// Ads Conversion (AW-xxxxxxxxx) -- dua-duanya diatur terpisah lewat CMS Web MGA > Settings.
async function getSiteSettings() {
  try {
    const res = await fetch(`${API}/mga/settings`, { next: { revalidate: 60 } });
    const json = await res.json();
    const d = json?.data || {};
    return {
      siteTitle: d.site_title || '',
      siteDescription: d.site_description || '',
      googleAdsId: d.google_ads_id || '',
      gtmId: d.gtm_id || '',
    };
  } catch {
    return { siteTitle: '', siteDescription: '', googleAdsId: '', gtmId: '' };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteTitle, siteDescription } = await getSiteSettings();
  const title = siteTitle || 'Mikala Global Akademi — LPK Perawat Profesional untuk Jepang';
  const description = siteDescription || 'Lembaga Pelatihan Kerja profesional mempersiapkan tenaga perawat untuk bekerja di Jepang (Kaigo). Bersertifikat, berpengalaman, dan terpercaya.';

  return {
    title,
    description,
    keywords: 'LPK perawat jepang, kaigo, lembaga pelatihan kerja, perawat lansia jepang, mikala akademi',
    metadataBase: new URL('https://mikalaglobalakademi.co.id'),
    icons: {
      icon:  'https://res.cloudinary.com/djgtchmsx/image/upload/v1780153869/logo-mga-web_digdlz.png',
      apple: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1780153869/logo-mga-web_digdlz.png',
    },
    openGraph: {
      title,
      description,
      url: 'https://mikalaglobalakademi.co.id',
      siteName: siteTitle || 'Mikala Global Akademi',
      locale: 'id_ID',
      type: 'website',
      images: [{ url: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1780153869/logo-mga-web_digdlz.png', width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { googleAdsId, gtmId } = await getSiteSettings();

  return (
    <html lang="id">
      <head>
        {/* Google Tag Manager -- container GTM-xxxxxxx dari CMS Web MGA > Settings. Beda
            produk dari Google Ads Conversion (AW-xxxxxxxxx) di bawah -- GTM cuma "wadah"
            buat masang banyak tag sekaligus (GA4, Meta Pixel, dst) tanpa ubah kode tiap kali. */}
        {gtmId && (
          <Script id="gtm-lib" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          ` }} />
        )}
        {/* Google Ads Conversion Tag (gtag.js) — AW-xxxxxxxxx dari CMS Web MGA > Settings. */}
        {googleAdsId && (
          <>
            <Script id="google-ads-lib" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} />
            <Script id="google-ads-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');
            ` }} />
          </>
        )}
      </head>
      <body>
        {/* GTM noscript fallback -- wajib persis di awal <body> per spesifikasi resmi GTM. */}
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display:'none', visibility:'hidden' }} />
          </noscript>
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet"/>
        <LangProvider>{children}</LangProvider>
        {/* Google Translate — hidden widget, custom button di Navbar */}
        <Script id="google-translate-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'id',
              includedLanguages: 'en,id',
              autoDisplay: false,
            }, 'google_translate_element');
          }
        `}} />
        <Script id="google-translate-script" strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        {/* Qontak Webchat Widget */}
        <Script id="qontak-chat" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          var qchatInit = document.createElement('script');
          qchatInit.src = "https://webchat.qontak.com/qchatInitialize.js";
          var qchatWidget = document.createElement('script');
          qchatWidget.src = "https://webchat.qontak.com/js/app.js";
          document.head.prepend(qchatInit);
          document.head.prepend(qchatWidget);
          qchatInit.onload = function() { qchatInitialize({
            id: "ea897efd-fc35-4370-a46e-e98ec6f724b0",
            code: "sMRNnmO9xjsl441InNQiRQ"
          })};
        `}} />
      </body>
    </html>
  );
}
