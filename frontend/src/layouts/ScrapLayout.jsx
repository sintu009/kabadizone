import { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, IndianRupee, User, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyWallet } from '../modules/scrapboy/features/walletSlice';

const LOGO_URL = 'https://res.cloudinary.com/dnimidvwh/image/upload/v1773520272/kabadi-logo_d6ftxe.png';

const ScrapLayout = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isHindi = i18n.language === 'hi';
  const { balance } = useSelector((s) => s.scrapboyWallet);
  const { isAuthenticated } = useSelector((s) => s.scrapboyAuth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyWallet());
  }, [dispatch, isAuthenticated]);

  const toggleLang = () => i18n.changeLanguage(isHindi ? 'en' : 'hi');

  const navItems = [
    { to: '/scrapboy', icon: LayoutDashboard, label: t('scrapboy.home'), end: true },
    { to: '/scrapboy/pickups', icon: Truck, label: t('scrapboy.pickups') },
    { to: '/scrapboy/earnings', icon: IndianRupee, label: t('scrapboy.earnings') },
    { to: '/scrapboy/profile', icon: User, label: t('scrapboy.profile') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="Kabadizone" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-gray-900 text-base">Kabadizone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">₹{Number(balance).toLocaleString()}</span>
            </div>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className={`text-xs font-semibold transition-colors ${!isHindi ? 'text-emerald-600' : 'text-gray-400'}`}>EN</span>
              <span className="text-gray-300 text-xs">/</span>
              <span className={`text-xs font-semibold transition-colors ${isHindi ? 'text-emerald-600' : 'text-gray-400'}`}>हि</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
};

export default ScrapLayout;
