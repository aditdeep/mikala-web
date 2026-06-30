import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { LangProvider } from '../lib/LangContext';

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
    images: [{ url: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1780153869/logo-mga-web_digdlz.png', width: 1200, height: 630 }],
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
            id: "c5c85b2a-ec7a-4b01-92cc-ba866b327798",
            code: "H0ieCJZfnBKbKQ1tHG-84w"
          })};
        `}} />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
