import { Recycle, Target, Eye, Users, Leaf, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  const values = [
    { icon: ShieldCheck, key: 'transparency' },
    { icon: Leaf, key: 'sustainability' },
    { icon: Users, key: 'community' },
    { icon: Truck, key: 'convenience' },
  ];

  const stats = [
    { value: '12,000+', key: 'kgRecycled' },
    { value: '3,500+', key: 'homeServed' },
    { value: '50+', key: 'scrapboys' },
    { value: '8 Tons', key: 'co2Saved' },
  ];

  const team = [
    { name: 'Rahul Kumar', role: t('about.founder'), emoji: '👨‍💼' },
    { name: 'Amit Singh', role: t('about.operations'), emoji: '🧑‍🔧' },
    { name: 'Priya Sharma', role: t('about.marketing'), emoji: '👩‍💻' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-emerald-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-medium mb-6">
            <Recycle className="h-4 w-4" />
            {t('about.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {t('about.heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-emerald-200/70 max-w-xl mx-auto leading-relaxed">
            {t('about.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, key: 'mission', color: 'emerald' },
            { icon: Eye, key: 'vision', color: 'teal' },
          ].map((item) => (
            <div key={item.key} className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`about.${item.key}Title`)}</h3>
              <p className="text-gray-500 leading-relaxed">{t(`about.${item.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('about.storySubtitle')}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('about.storyTitle')}</h3>
          <p className="text-gray-500 leading-relaxed text-base md:text-lg">{t('about.storyDesc')}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-6 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
              <p className="text-2xl md:text-3xl font-bold text-emerald-600">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{t(`about.stat_${stat.key}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">{t('about.valuesSubtitle')}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">{t('about.valuesTitle')}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, idx) => (
              <div key={idx} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <v.icon className="h-6 w-6" />
                </div>
                <h4 className="text-white font-bold mb-2">{t(`about.value_${v.key}`)}</h4>
                <p className="text-emerald-200/50 text-sm leading-relaxed">{t(`about.value_${v.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('about.teamSubtitle')}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{t('about.teamTitle')}</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl mb-4">
                  {member.emoji}
                </div>
                <h4 className="font-bold text-gray-900">{member.name}</h4>
                <p className="text-emerald-600 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 sm:px-12 sm:py-20 text-center">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/40 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/30 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{t('about.ctaTitle')}</h2>
            <p className="text-emerald-100 mb-10 max-w-xl mx-auto leading-relaxed">{t('about.ctaSubtitle')}</p>
            <Link to="/#book-pickup" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-lg">
              {t('about.ctaButton')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
