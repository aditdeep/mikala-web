import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.mikalaglobalmedika.com/api';

// FIX: sebelumnya cuma ngambil google_ads_id sendirian -- sekarang sekalian ambil gtm_id juga
// dari endpoint yg sama (satu kali fetch), krn GTM (Google Tag Manager, container GTM-xxxxxxx)
// itu produk yg beda total dari Google Ads Conversion (AW-xxxxxxxxx) yg udah ada. Dulu gak ada
// tempat sama sekali buat GTM asli, makanya "GTM yang AW-xxx" user pasang gak pernah kedeteksi
// sbg container GTM -- karena memang cuma AW- yang diproses, bukan GTM-.
async function getAnalyticsSettings(): Promise<{ googleAdsId: string; gtmId: string }> {
  try {
    const res = await fetch(`${API}/cms/settings`, { next: { revalidate: 60 } });
    const json = await res.json();
    return {
      googleAdsId: json?.data?.google_ads_id || '',
      gtmId: json?.data?.gtm_id || '',
    };
  } catch {
    return { googleAdsId: '', gtmId: '' };
  }
}

export const metadata: Metadata = {
  title: "Mikala Global Medika – Layanan Homecare 24 Jam",
  description: "Penyedia layanan homecare terpercaya. Perawat medis, caregiver, babysitter, dokter visit, medikal evakuasi di Bekasi dan sekitarnya.",
  keywords: "homecare, perawat, caregiver, babysitter, dokter visit, bekasi, mikala, layanan kesehatan",
  metadataBase: new URL("https://mikalaglobalmedika.com"),
  icons: {
    icon: "https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png",
    apple: "https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png",
  },
  openGraph: {
    title: "Mikala Global Medika – Layanan Homecare 24 Jam",
    description: "Penyedia layanan homecare terpercaya di Bekasi",
    url: "https://mikalaglobalmedika.com",
    siteName: "Mikala Global Medika",
    locale: "id_ID",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { googleAdsId, gtmId } = await getAnalyticsSettings();

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap" />
        {/* Google Tag Manager -- container GTM-xxxxxxx dari tagmanager.google.com, diatur lewat
            CMS Web MGM > Settings. Ini BEDA produk dari Google Ads Conversion (AW-xxxxxxxxx) di
            bawah -- GTM cuma "wadah" buat masang banyak tag sekaligus (GA4, Meta Pixel, dst)
            tanpa perlu ubah kode tiap kali, snippet head-nya wajib taruh sepaling atas <head>. */}
        {gtmId && (
          <Script id="gtm-lib" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          ` }} />
        )}
        {/* Google Ads Conversion Tag (gtag.js) — AW-xxxxxxxxx diatur lewat CMS Web MGM > Settings.
            Ini BUKAN Google Tag Manager (GTM-xxxxxxx) -- beda produk, beda snippet. */}
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
      <body style={{ margin:0, padding:0, fontFamily:"'Futura', 'Jost', 'Century Gothic', 'Trebuchet MS', Arial, sans-serif" }}>
        {/* GTM noscript fallback -- wajib persis di awal <body> per spesifikasi GTM resmi,
            biar tag tetap kepasang/kedeteksi walau JS browser user dimatiin. */}
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display:'none', visibility:'hidden' }} />
          </noscript>
        )}
        {children}
        {/* Google Translate — hidden widget, custom button di Navbar */}
        <Script id="google-translate-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'id',
              includedLanguages: 'en,id',
              autoDisplay: false,
            }, 'google_translate_element');
          }
        ` }} />
        <Script id="google-translate-script" strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        {/* Qontak Webchat Widget */}
        <Script id="qontak-chat" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          if (!window.__qontakChatLoaded) {
            window.__qontakChatLoaded = true;
            var qchatInit = document.createElement('script');
            qchatInit.src = "https://webchat.qontak.com/qchatInitialize.js";
            var qchatWidget = document.createElement('script');
            qchatWidget.src = "https://webchat.qontak.com/js/app.js";
            document.head.prepend(qchatInit);
            document.head.prepend(qchatWidget);
            qchatInit.onload = function() { qchatInitialize({
              id: "c5c85b2a-ec7a-4b01-92cc-ba866b327798",
              code: "H0ieCJZfnBKbKQ1tHG-84w"
            })};
          }
        `}} />
      </body>
    </html>
  );
}
