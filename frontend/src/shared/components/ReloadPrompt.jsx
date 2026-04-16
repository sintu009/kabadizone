import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-white border border-gray-200 shadow-xl rounded-2xl p-4 max-w-sm w-full mx-4 flex">
      <div className="flex-1">
        {offlineReady ? (
          <p className="text-emerald-600 font-medium text-sm">App is ready to work offline</p>
        ) : (
          <div className="flex flex-col space-y-2">
            <p className="text-gray-800 font-medium text-sm">New content available, click on reload button to update.</p>
            <div className="flex space-x-3 mt-2">
              <button
                className="flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white rounded-lg text-sm font-semibold"
                onClick={() => updateServiceWorker(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </button>
            </div>
          </div>
        )}
      </div>
      <button 
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors h-fit p-1"
        onClick={() => close()}
      >
        <span className="sr-only">Close Notification</span>
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ReloadPrompt;
