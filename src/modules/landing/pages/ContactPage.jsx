import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.123456789!2d85.3909!3d26.1209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKabadizone%2C+Muzaffarpur!5e0!3m2!1sen!2sin!4v1700000000000';

const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', phone: '', email: '', message: '' });
  };

  const contactInfo = [
    { icon: Phone, label: t('contact.phone'), value: '+91 9065402005', href: 'tel:+919065402005' },
    { icon: Phone, label: t('contact.altPhone'), value: '+91 7667806494', href: 'tel:+917667806494' },
    { icon: Mail, label: t('contact.email'), value: 'hello@kabadizone.com', href: 'mailto:hello@kabadizone.com' },
    { icon: Clock, label: t('contact.hours'), value: t('contact.hoursValue'), href: null },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-emerald-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-medium mb-6">
            <MessageSquare className="h-4 w-4" />
            {t('contact.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {t('contact.heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-emerald-200/70 max-w-xl mx-auto leading-relaxed">
            {t('contact.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-lg hover:border-emerald-200 transition-all duration-300 ${item.href ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t('contact.formTitle')}</h2>
            <p className="text-gray-400 text-sm mb-8">{t('contact.formSubtitle')}</p>

            {submitted && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                ✅ {t('contact.successMsg')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact.name')}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact.phoneLbl')}</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder={t('contact.phonePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact.emailLbl')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder={t('contact.emailPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact.message')}</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder={t('contact.messagePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
                {t('contact.send')}
              </button>
            </form>
          </div>

          {/* Map + Address */}
          <div className="flex flex-col gap-5">
            {/* Map */}
            <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Kabadizone Location"
                src={GOOGLE_MAPS_EMBED}
                className="w-full h-full min-h-[300px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address Card */}
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{t('contact.officeTitle')}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{t('contact.address')}</p>
                <a
                  href="https://maps.google.com/?q=Kabadizone+Muzaffarpur+Bihar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium mt-2 hover:text-emerald-700 transition-colors"
                >
                  {t('contact.openMaps')} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
