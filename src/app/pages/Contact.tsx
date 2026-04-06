import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building2, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { inquiryAPI, contentAPI } from '../services/api';
import { SiteContent } from '../types';
import { toast } from 'sonner';

const DEFAULT: SiteContent = {
  heroTitle: 'Contact Us',
  heroSubtitle: 'Get in touch with us for product inquiries, PCD franchise, and partnerships',
  address: 'SCF-320, 2nd Floor, Motor Market, Manimajra, Chandigarh - 160101',
  phone: '8816036666, 8629936666',
  email: 'biolexpharmaceuticals@gmail.com',
  businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
  formTitle: 'Send Us a Message',
  infoTitle: 'Contact Information',
  infoSubtitle: 'Feel free to reach out to us through any of the following channels.',
  gstin: '04AAJCB2451N1ZM',
  cin: 'U51909CH2020PTC043192',
};

export default function Contact() {
  const [content, setContent] = useState<SiteContent>(DEFAULT);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    contentAPI.getSection('contact').then((res: any) => {
      if (res.success) setContent({ ...DEFAULT, ...res.data });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: any = await inquiryAPI.create(formData);
      if (response.success) {
        toast.success('Message sent successfully! We will contact you soon.');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally { setLoading(false); }
  };

  const primaryPhone = (content.phone || '').split(',')[0].trim().replace(/\s+/g, '');

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.heroTitle}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">{content.heroSubtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-7 h-7 text-blue-600" /> {content.formTitle}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required placeholder="Your full name" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company / Business</Label>
                    <Input id="company" value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required placeholder="your.email@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required placeholder="+91 1234567890" />
                </div>
                <div>
                  <Label htmlFor="message">Your Message *</Label>
                  <Textarea id="message" value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required placeholder="Tell us about your requirements, product inquiries, or PCD franchise interest..." rows={6} />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-3">{content.infoTitle}</h2>
              <p className="text-gray-600 mb-8">{content.infoSubtitle}</p>
              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Address', content: content.address, href: '' },
                  { icon: Phone, title: 'Phone', content: content.phone, href: `tel:${primaryPhone}` },
                  { icon: Mail, title: 'Email', content: content.email, href: `mailto:${content.email}` },
                  { icon: Clock, title: 'Business Hours', content: content.businessHours, href: '' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl h-fit flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-blue-600 hover:underline break-all">{item.content}</a>
                      ) : (
                        <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal / Registration Info */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-600" /> Registration Details
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">GSTIN</span>
                  <span className="font-semibold text-gray-800 font-mono">{(content as any).gstin || '04AAJCB2451N1ZM'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">CIN</span>
                  <span className="font-semibold text-gray-800 font-mono text-xs">{(content as any).cin || 'U51909CH2020PTC043192'}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Quick Connect
                </h3>
                <p className="text-gray-600 text-sm mb-4">For urgent inquiries, call us directly. Our team responds within 24 hours for all email and form inquiries.</p>
                <a href={`tel:${primaryPhone}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <Phone className="w-5 h-5" /> {(content.phone || '').split(',')[0].trim()}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed — Manimajra Chandigarh */}
      <section className="h-80 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.5!2d76.84371!3d30.71365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed5b0bc65c27%3A0x5e93e24e28b69eae!2sManimajra%2C+Chandigarh!5e0!3m2!1sen!2sin!4v1714950000000"
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
          title="Biolex Pharmaceutical Location — Motor Market, Manimajra, Chandigarh" />
      </section>
    </div>
  );
}
