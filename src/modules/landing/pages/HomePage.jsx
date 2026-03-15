import { ArrowRight, PackageOpen, Recycle, DollarSign, Clock, ShieldCheck, Leaf, Truck, Phone, MapPin, CalendarDays, Package, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SCRAP_TYPES = [
  { label: 'Newspaper', icon: '📰' },
  { label: 'Cardboard', icon: '📦' },
  { label: 'Iron & Steel', icon: '🔩' },
  { label: 'Plastics', icon: '🥤' },
  { label: 'E-Waste', icon: '💻' },
  { label: 'Aluminum', icon: '🥫' },
];

const BookPickupForm = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', date: '', time: '', scrapTypes: [] });

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleScrap = (label) =>
    setForm((f) => ({
      ...f,
      scrapTypes: f.scrapTypes.includes(label)
        ? f.scrapTypes.filter((t) => t !== label)
        : [...f.scrapTypes, label],
    }));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {[
          { id: 1, label: t('bookPickup.contact'), icon: Phone },
          { id: 2, label: t('bookPickup.address'), icon: MapPin },
          { id: 3, label: t('bookPickup.schedule'), icon: CalendarDays },
          { id: 4, label: t('bookPickup.type'), icon: Package },
        ].map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-emerald-600' : isDone ? 'text-emerald-600' : 'text-gray-400'
                  }`}>{s.label}</span>
              </div>
              {idx < 3 && (
                <div className={`h-0.5 w-full mx-1 rounded-full -mt-5 ${step > s.id ? 'bg-emerald-400' : 'bg-gray-100'
                  }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[200px]">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bookPickup.fullName')}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={t('bookPickup.namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bookPickup.phone')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder={t('bookPickup.phonePlaceholder')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bookPickup.address')}</label>
              <textarea
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder={t('bookPickup.addressPlaceholder')}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bookPickup.city')}</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder={t('bookPickup.cityPlaceholder')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bookPickup.date')}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bookPickup.time')}</label>
              <select
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-white"
              >
                <option value="">{t('bookPickup.selectTime')}</option>
                <option value="9-12">9:00 AM – 12:00 PM</option>
                <option value="12-3">12:00 PM – 3:00 PM</option>
                <option value="3-6">3:00 PM – 6:00 PM</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('bookPickup.scrapTypes')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SCRAP_TYPES.map((scrap) => {
                const selected = form.scrapTypes.includes(scrap.label);
                return (
                  <button
                    key={scrap.label}
                    type="button"
                    onClick={() => toggleScrap(scrap.label)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${selected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-lg">{scrap.icon}</span>
                    {scrap.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={prev}
          disabled={step === 1}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${step === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          <ChevronLeft className="h-4 w-4" /> {t('bookPickup.back')}
        </button>

        {step < 4 ? (
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {t('bookPickup.continue')} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {t('bookPickup.submit')} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen relative bg-white">
      {/* Subtle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/60 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-50/80 blur-[150px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-teal-50/60 blur-[150px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section
          className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 min-h-[60vh] md:min-h-[70vh]"
          style={{
            backgroundColor: '#001819',
            backgroundImage: "url('https://res.cloudinary.com/dnimidvwh/image/upload/v1773525771/hero_bg_ixpaof.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              {t('hero.title')}{' '}
              <span className="text-emerald-400">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="max-w-xl mx-auto text-base md:text-lg text-gray-200 mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
              <Link to="#book-pickup" className="group inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-600/30">
                {t('hero.bookPickup')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="#rates" className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all hover:-translate-y-0.5 backdrop-blur-sm">
                {t('hero.checkRates')}
              </Link>
            </div>


          </div>
        </section>

        {/* Book Your Pickup */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="book-pickup">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('bookPickup.subtitle')}</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{t('bookPickup.title')}</h3>
            </div>

            <BookPickupForm />
          </div>
        </section>

        {/* Scrap Rate Price */}
        <section className="relative bg-gray-50/50" id="rates">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <div className="text-center mb-16">
              <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('rates.subtitle')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900">{t('rates.title')}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: t('rates.newspaper'), price: 15, icon: "📰" },
                { name: t('rates.cardboard'), price: 10, icon: "📦" },
                { name: t('rates.ironSteel'), price: 35, icon: "🔩" },
                { name: t('rates.aluminum'), price: 140, icon: "🥫" },
                { name: t('rates.plastics'), price: 12, icon: "🥤" },
                { name: t('rates.eWaste'), price: null, icon: "💻" },
                { name: t('rates.brass'), price: 420, icon: "🎺" },
                { name: t('rates.copper'), price: 650, icon: "🔌" },
              ].map((item, idx) => (
                <div key={idx} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{item.name}</h4>
                  <div className="flex items-baseline justify-center gap-0.5">
                    {item.price ? (
                      <>
                        <span className="text-xl font-bold text-emerald-600">₹{item.price}</span>
                        <span className="text-xs text-gray-400">/kg</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-400">{t('rates.varies')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/rates" className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                {t('rates.viewAll')}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 relative" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('howItWorks.subtitle')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900">{t('howItWorks.title')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: PackageOpen, title: t('howItWorks.gatherScrap'), desc: t('howItWorks.gatherDesc') },
                { icon: Clock, title: t('howItWorks.bookPickup'), desc: t('howItWorks.bookDesc') },
                { icon: Truck, title: t('howItWorks.weArrive'), desc: t('howItWorks.arriveDesc') },
                { icon: DollarSign, title: t('howItWorks.getPaid'), desc: t('howItWorks.paidDesc') }
              ].map((step, idx) => (
                <div key={idx} className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/0 group-hover:via-emerald-500 group-hover:to-emerald-500/0 transition-all duration-500 rounded-t-2xl"></div>

                  <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    <span className="text-emerald-400 text-sm mr-2">0{idx + 1}</span>
                    {step.title}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Why Choose Us */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-950" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-900/30 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">{t('whyUs.subtitle')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">{t('whyUs.title')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              {[
                { icon: ShieldCheck, title: t('whyUs.digitalWeighing'), desc: t('whyUs.digitalDesc') },
                { icon: DollarSign, title: t('whyUs.bestRates'), desc: t('whyUs.ratesDesc') },
                { icon: Leaf, title: t('whyUs.ecoFriendly'), desc: t('whyUs.ecoDesc') },
              ].map((feature, idx) => (
                <div key={idx} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/0 group-hover:via-emerald-400 group-hover:to-emerald-500/0 transition-all duration-500 rounded-t-2xl" />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-emerald-200/50 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Impact Stats Row */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Recycle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold">{t('whyUs.impactTitle')}</p>
                  <p className="text-emerald-400/60 text-xs">{t('whyUs.thisMonth')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: t('whyUs.cardboardSaved'), value: '2,450 kg', pct: '75%' },
                  { label: t('whyUs.eWasteRecycled'), value: '840 kg', pct: '45%' },
                  { label: t('whyUs.plasticProcessed'), value: '1,200 kg', pct: '60%' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-emerald-200/50">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 sm:px-12 sm:py-20 text-center">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/40 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/30 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-base sm:text-lg text-emerald-100 mb-10 max-w-xl mx-auto leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/schedule" className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-lg">
                  {t('cta.schedule')}
                </Link>
                <Link to="/scrapboy/login" className="inline-flex items-center justify-center px-8 py-3 bg-emerald-700 border border-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-all hover:-translate-y-0.5">
                  {t('cta.partner')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
