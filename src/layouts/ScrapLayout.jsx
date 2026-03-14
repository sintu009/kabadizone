import { Outlet, Link } from 'react-router-dom';
import { User } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dnimidvwh/image/upload/v1773520272/kabadi-logo_d6ftxe.png';

const ScrapLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={LOGO_URL} alt="Kabadizone" className="h-9 w-auto" />
            </div>
            <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ScrapLayout;
