import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, DollarSign, Info, Phone, Truck, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthModal from '../shared/components/AuthModal';
import FloatingButtons from '../shared/components/FloatingButtons';

const LOGO_URL = 'https://res.cloudinary.com/dnimidvwh/image/upload/v1773520272/kabadi-logo_d6ftxe.png';

const NAV_KEYS = [
  { key: 'nav.home', to: '/', icon: Home },
  { key: 'nav.scrapRate', to: '/#rates', icon: DollarSign },
  { key: 'nav.aboutUs', to: '/about', icon: Info },
  { key: 'nav.contactUs', to: '/contact', icon: Phone },
];

const LandingLayout = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');

  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.hash) {
      setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header
        className={`fixed z-50 transition-all duration-500 ${
          scrolled
            ? 'top-4 left-4 right-4 md:left-8 md:right-8 bg-white/15 backdrop-blur-sm border border-white/40 shadow-lg shadow-black/5 rounded-2xl py-2.5'
            : 'top-0 left-0 right-0 bg-white border-b border-gray-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 md:w-64">
              <img src={LOGO_URL} alt="Kabadizone" className="h-9 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center justify-center gap-1 flex-1">
              {NAV_KEYS.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50/60 transition-colors"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="hidden md:flex items-center justify-end gap-3 md:w-64">
              <button
                onClick={toggleLang}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                title="Switch Language"
              >
                <Globe className="h-4 w-4" />
                {i18n.language === 'en' ? 'हिं' : 'EN'}
              </button>
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <User className="h-4 w-4" />
                {t('nav.login')}
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Side Drawer */}
      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 z-[70] h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img src={LOGO_URL} alt="Kabadizone" className="h-8 w-auto" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_KEYS.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.key}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2.5">
          <button
            onClick={toggleLang}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'en' ? 'हिंदी' : 'English'}
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); setAuthOpen(true); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <User className="h-4 w-4" />
            {t('nav.login')}
          </button>
        </div>
      </div>

      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1 md:col-span-2">
              <img src={LOGO_URL} alt="Kabadizone" className="h-8 w-auto mb-4" />
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2.5 p-0 m-0 list-none">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('nav.home')}</Link></li>
                <li><Link to="/#rates" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('nav.scrapRate')}</Link></li>
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('nav.aboutUs')}</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('nav.contactUs')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">{t('footer.portals')}</h4>
              <ul className="space-y-2.5 p-0 m-0 list-none">
                <li><Link to="/scrapboy" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.scrapBoyPortal')}</Link></li>
                <li><Link to="/admin" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.admin')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
            <div className="mt-3 md:mt-0 flex gap-4">
              <Link to="/privacy" className="hover:text-gray-600 transition-colors">{t('footer.privacy')}</Link>
              <Link to="/terms" className="hover:text-gray-600 transition-colors">{t('footer.terms')}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Floating Buttons */}
      <FloatingButtons />
    </div>
  );
};

export default LandingLayout;
