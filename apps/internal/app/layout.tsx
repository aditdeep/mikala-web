import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { ThemeProvider } from '../components/ThemeProvider';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Mikala Internal',
  description: 'Platform manajemen Mikala Global Medika',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mikala Internal',
    startupImage: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_internal_jpgggi.png',
  },
  icons: {
    icon: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_internal_jpgggi.png',
    apple: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_internal_jpgggi.png',
    shortcut: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_internal_jpgggi.png',
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
        <meta name="apple-mobile-web-app-title" content="Mikala Internal" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_internal_jpgggi.png" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <PWAInstallPrompt appName="Mikala Internal" color="#7c3aed" icon="https://res.cloudinary.com/djgtchmsx/image/upload/v1779036177/icon_internal_jpgggi.png" />
        </ThemeProvider>
      </body>
    </html>
  );
}
