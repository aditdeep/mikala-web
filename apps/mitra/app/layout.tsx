import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: 'Mikala Mitra',
  icons: { icon: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png', apple: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png' },
  description: "Aplikasi untuk Mitra Mikala",
  manifest: "/manifest.json",
};
export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
