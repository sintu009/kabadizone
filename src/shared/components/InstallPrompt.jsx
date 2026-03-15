import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

let deferredPrompt = null;

function InstallPrompt() {
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide if already installed
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      deferredPrompt = null;
    });

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    deferredPrompt = null;
  };

  if (!showInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
    >
      <Download className="h-5 w-5" />
      Install App
    </button>
  );
}

export default InstallPrompt;
