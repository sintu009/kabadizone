import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import ReloadPrompt from './shared/components/ReloadPrompt';

function App() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
      <ReloadPrompt />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '14px', borderRadius: '10px', padding: '12px 16px' },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
    </>
  );
}

export default App;
