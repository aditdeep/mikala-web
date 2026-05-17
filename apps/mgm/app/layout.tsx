import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mikala Global Medika – Layanan Homecare 24 Jam",
  description: "Penyedia layanan homecare terpercaya. Perawat medis, caregiver, babysitter, dokter visit, medikal evakuasi di Bekasi dan sekitarnya.",
  keywords: "homecare, perawat, caregiver, babysitter, dokter visit, bekasi, mikala",
  icons: {
    icon: "https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png",
    apple: "https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png",
  },
  openGraph: {
    title: "Mikala Global Medika – Layanan Homecare 24 Jam",
    description: "Penyedia layanan homecare terpercaya di Bekasi",
    images: ["https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin:0, padding:0, fontFamily: "'Segoe UI', Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
