import PWAInstallPrompt from '../components/PWAInstallPrompt';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#ec4899',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Mikala Klien',
  description: 'Layanan homecare terbaik untuk keluarga Anda',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mikala Klien',
    startupImage: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_klien_txpz8r.png',
  },
  icons: {
    icon: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_klien_txpz8r.png',
    apple: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_klien_txpz8r.png',
    shortcut: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_klien_txpz8r.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mikala Klien" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_klien_txpz8r.png" />
      </head>
      <body>{children}<PWAInstallPrompt appName="Mikala Klien" color="#ec4899" icon="https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_klien_txpz8r.png" /></body>
    </html>
  );
}
