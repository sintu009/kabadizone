import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, DollarSign, Info, Phone, Truck, Globe, Recycle, ArrowRight, MapPin, Mail } from 'lucide-react';
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
            ? 'top-3 left-3 right-3 md:left-6 md:right-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-black/5 rounded-2xl py-2.5'
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
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
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
      <footer className="relative mt-auto bg-white border-t border-gray-100 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/60 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 pt-16 pb-8">
          {/* Eco Impact Ticker */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { emoji: '♻️', value: '12,000+', label: t('footer.kgRecycled') },
                { emoji: '🏠', value: '3,500+', label: t('footer.happyHomes') },
                { emoji: '🌱', value: '8 Tons', label: t('footer.co2Saved') },
                { emoji: '🤝', value: '50+', label: t('footer.scrapboys') },
              ].map((stat, idx) => (
                <div key={idx} className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                  <span className="text-2xl block mb-1">{stat.emoji}</span>
                  <p className="text-gray-900 font-bold text-lg">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
              {/* Brand */}
              <div className="lg:col-span-3">
                <div className="mb-4">
                  <img src={LOGO_URL} alt="Kabadizone" className="h-9 w-auto" />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {t('footer.description')}
                </p>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-2">
                <h4 className="text-emerald-600 font-semibold text-xs uppercase tracking-widest mb-5">{t('footer.quickLinks')}</h4>
                <ul className="space-y-3 p-0 m-0 list-none">
                  {[
                    { to: '/', label: t('nav.home') },
                    { to: '/#rates', label: t('nav.scrapRate') },
                    { to: '/about', label: t('nav.aboutUs') },
                    { to: '/contact', label: t('nav.contactUs') },
                  ].map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="group text-sm text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                        <span className="w-0 group-hover:w-2 h-px bg-emerald-500 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Portals */}
              <div className="lg:col-span-2">
                <h4 className="text-emerald-600 font-semibold text-xs uppercase tracking-widest mb-5">{t('footer.portals')}</h4>
                <ul className="space-y-3 p-0 m-0 list-none">
                  {[
                    { to: '/scrapboy', label: t('footer.scrapBoyPortal') },
                    { to: '/admin', label: t('footer.admin') },
                  ].map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="group text-sm text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                        <span className="w-0 group-hover:w-2 h-px bg-emerald-500 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get In Touch */}
              <div className="lg:col-span-5">
                <h4 className="text-emerald-600 font-semibold text-xs uppercase tracking-widest mb-5">{t('footer.getInTouch')}</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{t('footer.address')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                      <a href="tel:+919065402005" className="block text-sm text-gray-500 hover:text-emerald-600 transition-colors">+91 9065402005</a>
                      <a href="tel:+917667806494" className="block text-sm text-gray-500 hover:text-emerald-600 transition-colors">+91 7667806494</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Strip */}
            <div className="py-8 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-gray-900 font-semibold text-sm">{t('footer.stayUpdated')}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{t('footer.newsletterDesc')}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto sm:min-w-[320px]">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder={t('footer.emailPlaceholder')}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
                <button className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{t('footer.madeWith')}</span>
                <span className="text-red-400 animate-pulse">♥</span>
                <span>{t('footer.inIndia')}</span>
              </div>
              <div className="flex gap-6 text-xs text-gray-400">
                <Link to="/privacy" className="hover:text-emerald-600 transition-colors">{t('footer.privacy')}</Link>
                <Link to="/terms" className="hover:text-emerald-600 transition-colors">{t('footer.terms')}</Link>
              </div>
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
