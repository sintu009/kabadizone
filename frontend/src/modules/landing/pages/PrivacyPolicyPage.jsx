import { ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect personal information you provide when booking a pickup, including your name, phone number, address, and city. We may also collect device information and usage data to improve our services.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used to process pickup bookings, communicate with you about your orders, improve our services, and send relevant updates. We do not sell your personal data to third parties.',
  },
  {
    title: 'Data Sharing',
    content: 'We share your pickup details (name, address, phone) with assigned Scrapboys solely for the purpose of completing your pickup. We may share data with law enforcement if required by law.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: 'Cookies & Analytics',
    content: 'We may use cookies and analytics tools to understand how users interact with our platform and to improve user experience.',
  },
  {
    title: 'Your Rights',
    content: 'You can request access to, correction of, or deletion of your personal data by contacting us. We will respond to your request within a reasonable timeframe.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.',
  },
  {
    title: 'Contact Us',
    content: 'If you have questions about this Privacy Policy, contact us at +91 9065402005 or visit our Contact page.',
  },
];

const PrivacyPolicyPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-emerald-950 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-15" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-medium mb-6">
          <ShieldCheck className="h-4 w-4" />
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Privacy Policy</h1>
        <p className="text-base md:text-lg text-emerald-200/70 max-w-xl mx-auto">Last updated: June 2025</p>
      </div>
    </section>

    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
            <p className="text-gray-500 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default PrivacyPolicyPage;
