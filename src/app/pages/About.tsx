import { useState, useEffect } from 'react';
import { Building, Users, Award, MapPin, Mail, Phone, CheckCircle, Shield, BadgeCheck, Briefcase, FlaskConical, Truck } from 'lucide-react';
import { contentAPI } from '../services/api';
import { SiteContent } from '../types';

const DEFAULT: SiteContent = {
  heroTitle: 'About Biolex Pharmaceutical',
  heroSubtitle: 'Established on 2 September 2020 — your trusted PCD pharma franchise and wholesale partner from Chandigarh',
  overviewTitle: 'Who We Are',
  overviewPara1: 'Biolex Pharmaceutical Private Limited is an active Indian pharma company established on 2 September 2020. Based in Chandigarh, we operate as a wholesaler, distributor, and PCD pharma franchise company with ISO 9001:2015 certification and WHO-GMP supported manufacturing.',
  overviewPara2: 'We deal in a comprehensive range of pharmaceutical products including Tablets, Capsules, Syrups, Injections, and Protein Powders. Our business model encompasses PCD Pharma Franchise, Third-Party Manufacturing, and Wholesale & Distribution.',
  overviewPara3: 'With our strong commitment to quality and customer satisfaction, we have built lasting relationships with wholesalers, distributors, and healthcare professionals across India. Our GSTIN (04AAJCB2451N1ZM) and CIN (U51909CH2020PTC043192) reflect our fully compliant corporate identity.',
  missionTitle: 'Our Mission',
  missionText: 'To provide quality pharmaceutical products at competitive prices while maintaining the highest standards of service and reliability. We aim to be the preferred wholesale and PCD franchise partner for healthcare professionals and businesses across India.',
  visionTitle: 'Our Vision',
  visionText: 'To become a leading pharmaceutical wholesale distributor and PCD franchise company in India, recognized for our commitment to quality, customer satisfaction, and ethical business practices.',
  ceoName: 'Ravi Kumar Bhalla',
  location: 'SCF-320, 2nd Floor, Motor Market, Manimajra, Chandigarh - 160101',
  businessType: 'Wholesaler / Distributor / PCD Pharma Franchise',
  established: '2 September 2020',
  employees: 'Up to 10',
  certification: 'ISO 9001:2015 | WHO-GMP Supported',
  gstNo: '04AAJCB2451N1ZM',
  cinNo: 'U51909CH2020PTC043192',
  dealIn: 'Tablets, Capsules, Syrups, Injections, Protein Powders',
  businessModel: 'PCD Pharma Franchise, Third-Party Manufacturing, Wholesale & Distribution',
};

export default function About() {
  const [content, setContent] = useState<SiteContent>(DEFAULT);

  useEffect(() => {
    contentAPI.getSection('about').then((res: any) => {
      if (res.success) setContent({ ...DEFAULT, ...res.data });
    }).catch(() => {});
  }, []);

  const values = [
    { icon: <Award className="w-12 h-12 text-blue-600" />, title: 'Quality Assurance', description: 'ISO 9001:2015 certified with WHO-GMP supported manufacturing for every product.' },
    { icon: <Users className="w-12 h-12 text-blue-600" />, title: 'Customer Focus', description: 'Dedicated to providing excellent service and building long-term franchise partnerships.' },
    { icon: <CheckCircle className="w-12 h-12 text-blue-600" />, title: 'Reliability', description: 'Consistent supply chain and on-time delivery to meet your business demands.' },
    { icon: <Building className="w-12 h-12 text-blue-600" />, title: 'Integrity', description: 'Operating with full transparency, ethical business practices and regulatory compliance.' },
  ];

  const highlights = [
    'ISO 9001:2015 Certified Company', 'WHO-GMP Supported Manufacturing',
    'PCD Pharma Franchise Available', 'Third-Party Manufacturing',
    'Wholesale & Distribution', 'Competitive Pricing',
    'Timely Delivery & Support', 'Trusted Across India',
  ];

  const companyDetails = [
    { label: 'CEO', value: content.ceoName },
    { label: 'Location', value: content.location },
    { label: 'Business Type', value: content.businessType },
    { label: 'Established', value: content.established },
    { label: 'Employees', value: content.employees },
    { label: 'Certification', value: content.certification },
    { label: 'GST No.', value: content.gstNo },
    { label: 'CIN', value: (content as any).cinNo || 'U51909CH2020PTC043192' },
  ];

  const dealInList = ((content as any).dealIn || DEFAULT.dealIn || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const businessModelList = ((content as any).businessModel || DEFAULT.businessModel || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const businessModelIcons = [Briefcase, FlaskConical, Truck];

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{content.heroTitle}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">{content.heroSubtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.overviewTitle}</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>{content.overviewPara1}</p>
                <p>{content.overviewPara2}</p>
                <p>{content.overviewPara3}</p>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Products We Deal In</h3>
                <div className="flex flex-wrap gap-2">
                  {dealInList.map((item: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Company Details</h3>
              <div className="space-y-3">
                {companyDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between items-start py-3 border-b border-blue-200 last:border-0 gap-4">
                    <span className="text-gray-600 font-medium flex-shrink-0">{detail.label}</span>
                    <span className="font-semibold text-right text-gray-900 text-sm">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Our Business Model</h2>
            <p className="text-gray-600 text-lg">Multiple ways to partner with Biolex Pharmaceutical</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {businessModelList.map((model: string, i: number) => {
              const Icon = businessModelIcons[i % businessModelIcons.length];
              return (
                <div key={i} className="bg-white border border-blue-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{model}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Certifications & Compliance</h2>
            <p className="text-blue-200 text-lg">Upholding the highest standards in pharmaceutical manufacturing and trading</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: BadgeCheck, title: 'ISO 9001:2015', desc: 'Quality Management System' },
              { icon: Shield, title: 'WHO-GMP', desc: 'GMP Supported Manufacturing' },
              { icon: Award, title: 'DCGI Compliant', desc: 'Drug Controller Approved' },
              { icon: CheckCircle, title: 'GST Registered', desc: `GST: ${content.gstNo}` },
            ].map((c, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center hover:bg-white/20 transition-colors">
                <c.icon className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="font-bold text-white mb-1">{c.title}</h3>
                <p className="text-blue-200 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Us?</h2>
              <p className="text-xl mb-8 text-blue-100">The preferred pharma partner for distributors and franchisees across India.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-100">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.missionTitle}</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{content.missionText}</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.visionTitle}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{content.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We're here to help</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Location', content: content.location, href: '' },
              { icon: Phone, title: 'Phone', content: '8816036666 / 8629936666', href: 'tel:+918816036666' },
              { icon: Mail, title: 'Email', content: 'biolexpharmaceuticals@gmail.com', href: 'mailto:biolexpharmaceuticals@gmail.com' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md text-center">
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-blue-600 hover:underline break-all">{item.content}</a>
                ) : (
                  <p className="text-gray-600 text-sm">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
