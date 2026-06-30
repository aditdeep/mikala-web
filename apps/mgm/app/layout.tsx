import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
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
      <body style={{ margin:0, padding:0, fontFamily:"'Segoe UI', Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
