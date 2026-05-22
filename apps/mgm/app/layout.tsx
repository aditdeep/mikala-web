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
        {/* Qontak Webchat Widget */}
        <Script id="qontak-chat" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          (function() {
            var s1 = document.createElement('script');
            s1.src = 'https://webchat.qontak.com/js/app.js';
            s1.async = true;
            var s2 = document.createElement('script');
            s2.src = 'https://webchat.qontak.com/qchatInitialize.js';
            s2.async = true;
            s2.onload = function() {
              if (typeof qchatInitialize === 'function') {
                qchatInitialize({ id: 'c5c85b2a-ec7a-4b01-92cc-ba866b327798', code: 'H0ieCJZfnBKbKQ1tHG-84w' });
              }
            };
            document.head.appendChild(s1);
            document.head.appendChild(s2);
          })();
        `}} />
      </head>
      <body style={{ margin:0, padding:0, fontFamily:"'Segoe UI', Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
