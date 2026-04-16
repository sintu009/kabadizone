import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CATEGORIES = ['all', 'paper', 'metal', 'plastic', 'eWaste'];

const SCRAP_ITEMS = [
  { key: 'newspaper', icon: '📰', price: 15, unit: 'kg', category: 'paper', trend: 'up' },
  { key: 'magazines', icon: '📚', price: 12, unit: 'kg', category: 'paper', trend: 'stable' },
  { key: 'cardboard', icon: '📦', price: 10, unit: 'kg', category: 'paper', trend: 'up' },
  { key: 'books', icon: '📖', price: 14, unit: 'kg', category: 'paper', trend: 'down' },
  { key: 'ironSteel', icon: '🔩', price: 35, unit: 'kg', category: 'metal', trend: 'up' },
  { key: 'aluminum', icon: '🥫', price: 140, unit: 'kg', category: 'metal', trend: 'up' },
  { key: 'brass', icon: '🎺', price: 420, unit: 'kg', category: 'metal', trend: 'stable' },
  { key: 'copper', icon: '🔌', price: 650, unit: 'kg', category: 'metal', trend: 'up' },
  { key: 'stainlessSteel', icon: '🍳', price: 50, unit: 'kg', category: 'metal', trend: 'stable' },
  { key: 'plasticHard', icon: '🪣', price: 12, unit: 'kg', category: 'plastic', trend: 'down' },
  { key: 'plasticSoft', icon: '🛍️', price: 8, unit: 'kg', category: 'plastic', trend: 'stable' },
  { key: 'petBottles', icon: '🥤', price: 10, unit: 'kg', category: 'plastic', trend: 'up' },
  { key: 'eWasteLaptop', icon: '💻', price: 500, unit: 'pc', category: 'eWaste', trend: 'up' },
  { key: 'eWastePhone', icon: '📱', price: 150, unit: 'pc', category: 'eWaste', trend: 'stable' },
  { key: 'eWastePrinter', icon: '🖨️', price: 300, unit: 'pc', category: 'eWaste', trend: 'down' },
  { key: 'eWasteBattery', icon: '🔋', price: 80, unit: 'kg', category: 'eWaste', trend: 'up' },
];

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-red-400" />;
  return <Minus className="h-3.5 w-3.5 text-gray-400" />;
};

const TrendBadge = ({ trend, t }) => {
  const config = {
    up: { bg: 'bg-emerald-50 text-emerald-600', label: t('scrapRate.trendUp') },
    down: { bg: 'bg-red-50 text-red-500', label: t('scrapRate.trendDown') },
    stable: { bg: 'bg-gray-50 text-gray-500', label: t('scrapRate.trendStable') },
  };
  const c = config[trend];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg}`}>
      <TrendIcon trend={trend} />
      {c.label}
    </span>
  );
};

const ScrapRatePage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = SCRAP_ITEMS.filter((item) => {
    const name = t(`scrapRate.items.${item.key}`).toLowerCase();
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = name.includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-emerald-500 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-teal-400 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t('scrapRate.heroTitle')}
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
            {t('scrapRate.heroSubtitle')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-emerald-300 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('scrapRate.lastUpdated')}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-24">
        {/* Search + Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('scrapRate.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t(`scrapRate.cat.${cat}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-6">
          {t('scrapRate.showing', { count: filtered.length })}
        </p>

        {/* Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.key}
                className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <TrendBadge trend={item.trend} t={t} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {t(`scrapRate.items.${item.key}`)}
                </h3>
                <p className="text-xs text-gray-400 mb-3">{t(`scrapRate.cat.${item.category}`)}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-emerald-600">₹{item.price}</span>
                  <span className="text-sm text-gray-400">/{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-sm">{t('scrapRate.noResults')}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('scrapRate.ctaTitle')}</h2>
          <p className="text-emerald-100 text-sm md:text-base mb-6 max-w-lg mx-auto">{t('scrapRate.ctaSubtitle')}</p>
          <Link
            to="/#book-pickup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
          >
            {t('scrapRate.ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ScrapRatePage;
