'use client';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt({ appName, color = '#7c3aed', icon }: {
  appName: string;
  color?: string;
  icon?: string;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check iOS
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(ios);

    // Check if dismissed before
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    if (ios) {
      // Show iOS instructions after 3 seconds
      setTimeout(() => setShowBanner(true), 3000);
    }

    // Listen for install prompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-dismissed', '1');
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, width: 'calc(100% - 32px)', maxWidth: '420px',
        background: 'rgba(15,10,30,0.95)', backdropFilter: 'blur(20px)',
        border: `1px solid ${color}40`, borderRadius: '20px',
        padding: '16px 18px', boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}20`,
        animation: 'slideUp 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && (
            <img src={icon} alt={appName} style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: '0 0 3px' }}>
              Install {appName}
            </p>
            {isIOS ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
                Tap <strong style={{ color: 'white' }}>Share</strong> lalu <strong style={{ color: 'white' }}>"Add to Home Screen"</strong>
              </p>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>
                Install untuk akses lebih cepat & offline
              </p>
            )}
          </div>
          <button onClick={handleDismiss} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
            color: 'rgba(255,255,255,0.6)', width: '28px', height: '28px',
            cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>×</button>
        </div>

        {!isIOS && deferredPrompt && (
          <button onClick={handleInstall} style={{
            width: '100%', marginTop: '12px', padding: '11px',
            background: `linear-gradient(135deg, ${color}, ${color}aa)`,
            border: 'none', borderRadius: '12px', color: 'white',
            fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          }}>
            📲 Install Sekarang
          </button>
        )}

        {isIOS && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'center', fontSize: '24px' }}>⬆️</div>
            <div style={{ textAlign: 'center', fontSize: '24px' }}>➕</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0 }}>Tap Share → Add to Home Screen</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
