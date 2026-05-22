import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Mikala Global Medika – Layanan Homecare 24 Jam",
  description: "Penyedia layanan homecare terpercaya. Perawat medis, caregiver, babysitter, dokter visit, medikal evakuasi di Bekasi dan sekitarnya.",
  keywords: "homecare, perawat, caregiver, babysitter, dokter visit, bekasi, mikala, layanan kesehatan",
  metadataBase: new URL("https://mikalaglobalmedika.com"),
  alternates: { canonical: "https://mikalaglobalmedika.com" },
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
    images: [{
      url: "https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png",
      width: 1200, height: 630,
      alt: "Mikala Global Medika",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikala Global Medika – Layanan Homecare 24 Jam",
    description: "Penyedia layanan homecare terpercaya di Bekasi",
    images: ["https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const GTM_ID = "GTM-XXXXXXX";
const QONTAK_ID = "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && GTM_ID !== "GTM-XXXXXXX" && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {/* Qontak Webchat */}
        <Script id="qontak-widget" strategy="afterInteractive" src="https://webchat.qontak.com/js/app.js" />
        <Script id="qontak-init" strategy="afterInteractive" src="https://webchat.qontak.com/qchatInitialize.js"
          onLoad="qchatInitialize({ id: 'c5c85b2a-ec7a-4b01-92cc-ba866b327798', code: 'H0ieCJZfnBKbKQ1tHG-84w' })"
        />
      </head>
      <body style={{ margin:0, padding:0, fontFamily:"'Segoe UI', Arial, sans-serif" }}>
        {/* GTM noscript fallback */}
        {GTM_ID && GTM_ID !== "GTM-XXXXXXX" && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" width="0"
              style={{ display:"none", visibility:"hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
