import { FileText } from 'lucide-react';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing or using Kabadizone, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
  },
  {
    title: 'Services',
    content: 'Kabadizone provides a platform for scheduling doorstep scrap pickups. We connect households with verified Scrapboys who collect, weigh, and pay for recyclable materials at market rates.',
  },
  {
    title: 'User Responsibilities',
    content: 'You agree to provide accurate information when booking a pickup, be available at the scheduled time, and ensure the scrap materials are accessible. Hazardous or illegal materials are strictly prohibited.',
  },
  {
    title: 'Pricing & Payments',
    content: 'Scrap prices are based on live market rates and may fluctuate. Final payment is determined after digital weighing at the time of pickup. Payments are made instantly via Cash or UPI.',
  },
  {
    title: 'Cancellations',
    content: 'You may cancel a pickup before a Scrapboy is assigned at no charge. Repeated no-shows or last-minute cancellations may result in temporary suspension of your account.',
  },
  {
    title: 'Limitation of Liability',
    content: 'Kabadizone is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the value of the transaction in question.',
  },
  {
    title: 'Intellectual Property',
    content: 'All content, logos, and branding on the Kabadizone platform are our intellectual property and may not be used without prior written consent.',
  },
  {
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.',
  },
  {
    title: 'Contact',
    content: 'For questions regarding these Terms of Service, reach us at +91 9065402005 or visit our Contact page.',
  },
];

const TermsOfServicePage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-emerald-950 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-15" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-medium mb-6">
          <FileText className="h-4 w-4" />
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Terms of Service</h1>
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

export default TermsOfServicePage;
