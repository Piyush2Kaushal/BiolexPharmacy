import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  Shield, Award, Clock, Users, CheckCircle, ArrowRight,
  Package, Microscope, HeartPulse, Star, TrendingUp, Globe, Phone,
  ChevronDown, ChevronUp, Quote, BadgeCheck, Truck, ThumbsUp,
  FlaskConical, Pill, Syringe, Droplets, Sparkles,
} from 'lucide-react';
import { productAPI, categoryAPI, contentAPI, testimonialAPI, homeCardAPI } from '../services/api';
import { Product, Category, SiteContent, Testimonial, HomeCard } from '../types';
import InquiryModal from '../components/InquiryModal';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: 'Your Trusted Pharma Wholesale Partner',
  heroSubtitle: 'Biolex Pharmaceutical Private Limited — supplying quality medicines to wholesalers and healthcare professionals across India.',
  heroBadge: 'ISO 9001:2015 Certified Pharmaceutical Company',
  featuresTitle: 'Why Biolex Pharmaceutical?',
  featuresSubtitle: 'Your reliable partner for quality pharmaceutical products',
  statsYears: '5+', statsProducts: '500+', statsPartners: '100+', statsSupport: '24/7',
  testimonialTitle: 'What Our Partners Say',
  testimonialSubtitle: 'Trusted by healthcare professionals and distributors across India',
  faqTitle: 'Frequently Asked Questions',
  faqSubtitle: 'Get answers to common questions about our pharmaceutical wholesale services',
  ctaTitle: 'Ready to Partner With Us?',
  ctaSubtitle: 'Send us an inquiry for product details, pricing, and availability. Our team responds within 24 hours.',
  whyUsTitle: 'Why Choose Biolex?',
  whyUsSubtitle: 'We go beyond just supplying medicines — we build lasting partnerships',
};

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Award, Clock, Users, Package, Globe, TrendingUp, Microscope,
  HeartPulse, Star, BadgeCheck, Truck, ThumbsUp, CheckCircle, Sparkles, Phone,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-100' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-100' },
  green:   { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-100' },
  red:     { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100' },
  cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-100' },
};

function useIntersect(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function gridCols(count: number) {
  if (count <= 2) return 'sm:grid-cols-2';
  if (count === 3) return 'sm:grid-cols-2 lg:grid-cols-3';
  if (count === 4) return 'sm:grid-cols-2 lg:grid-cols-4';
  return 'sm:grid-cols-2 lg:grid-cols-3';
}

function testimonialsGrid(count: number) {
  if (count <= 1) return '';
  if (count === 2) return 'sm:grid-cols-2';
  return 'sm:grid-cols-2 lg:grid-cols-3';
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featureCards, setFeatureCards] = useState<HomeCard[]>([]);
  const [whyUsCards, setWhyUsCards] = useState<HomeCard[]>([]);
  const [highlightCards, setHighlightCards] = useState<HomeCard[]>([]);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroAnim = useIntersect(0);
  const featuresAnim = useIntersect();
  const testimonialsAnim = useIntersect();
  const ctaAnim = useIntersect();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes, ctRes, tRes, fcRes, wuRes, hlRes]: any[] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
          contentAPI.getSection('home'),
          testimonialAPI.getAll(),
          homeCardAPI.getSection('features'),
          homeCardAPI.getSection('why_us'),
          homeCardAPI.getSection('highlights'),
        ]);
        if (pRes.success) setProducts((pRes.data || []).slice(0, 6));
        if (cRes.success) setCategories(cRes.data || []);
        if (ctRes.success) setContent({ ...DEFAULT_CONTENT, ...ctRes.data });
        if (tRes.success) setTestimonials(tRes.data || []);
        if (fcRes.success) setFeatureCards(fcRes.data || []);
        if (wuRes.success) setWhyUsCards(wuRes.data || []);
        if (hlRes.success) setHighlightCards(hlRes.data || []);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const stats = [
    { value: content.statsYears, label: 'Years Experience', icon: TrendingUp },
    { value: content.statsProducts, label: 'Products', icon: Package },
    { value: content.statsPartners, label: 'Partners', icon: Users },
    { value: content.statsSupport, label: 'Support', icon: Globe },
  ];

  const faqs = [
    { q: 'What is the minimum order quantity?', a: 'We cater to B2B orders. Minimum quantities vary by product. Please contact us for specific product MOQs and bulk pricing.' },
    { q: 'Do you offer PAN India delivery?', a: 'Yes, we deliver across all major cities and states in India. Delivery timelines depend on your location and order size.' },
    { q: 'Are your products certified?', a: 'All products are sourced from ISO-certified manufacturers and meet regulatory standards set by DCGI and other authorities.' },
    { q: 'How can I get the latest price list?', a: 'Please send an inquiry through our Contact page or call us directly. Our team will share the latest price list within 24 hours.' },
    { q: 'Do you offer credit terms for distributors?', a: 'We offer flexible payment terms for established distributors. Contact our sales team to discuss credit arrangements.' },
    { q: 'What product categories do you carry?', a: 'Tablets, Capsules, Syrups, Injections, Drops, Protein Powders, Energy Drinks, and PCD Pharma Franchise products.' },
  ];

  const productTypes = [
    { icon: Pill,        label: 'Tablets',       color: 'bg-blue-50   text-blue-600   hover:bg-blue-100' },
    { icon: Package,     label: 'Capsules',      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
    { icon: FlaskConical,label: 'Syrups',        color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { icon: Syringe,     label: 'Injections',    color: 'bg-red-50    text-red-600    hover:bg-red-100' },
    { icon: Droplets,    label: 'Drops',         color: 'bg-cyan-50   text-cyan-600   hover:bg-cyan-100' },
    { icon: Globe,       label: 'PCD Franchise', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  ];

  const categoryIcons = [Package, Microscope, HeartPulse, Award, Star, Globe];

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden min-h-[88vh] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div
          ref={heroAnim.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 w-full transition-all duration-1000 ${heroAnim.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left col */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm mb-8">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                {content.heroBadge}
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight mb-6 tracking-tight">
                <span className="block">Your Trusted</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
                  Pharma Wholesale
                </span>
                <span className="block">Partner</span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-lg">{content.heroSubtitle}</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/products"
                  className="inline-flex items-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5 group">
                  Browse Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/70 transition-all">
                  <Phone className="w-5 h-5" /> Get Quote
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {['ISO 9001:2015', 'DCGI Compliant', 'Pan-India Delivery'].map((b) => (
                  <span key={b} className="flex items-center gap-1.5 text-xs text-blue-200 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right col – stats card */}
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-2xl scale-110" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map((s, i) => (
                    <div key={i} className="text-center p-5 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                      <s.icon className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                      <div className="text-4xl font-black mb-1">{s.value}</div>
                      <div className="text-blue-200 text-xs font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/20 pt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['R','P','A','S'].map((l, i) => (
                      <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-800 flex items-center justify-center text-xs font-black shadow-md">
                        {l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">100+ Healthcare Partners</p>
                    <p className="text-xs text-blue-300">Trust us across India</p>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-4 bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Verified Supplier
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,56 L1440,56 L1440,16 C1200,52 720,0 0,36 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ══ PRODUCT TYPE PILLS ═══════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {productTypes.map((pt, i) => (
              <Link key={i} to="/products"
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl ${pt.color} transition-all duration-200 hover:scale-105 hover:shadow-md`}>
                <pt.icon className="w-8 h-8" />
                <span className="text-xs font-bold text-center">{pt.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #dbeafe 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e0e7ff 0%, transparent 50%)' }} />
        <div ref={featuresAnim.ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${featuresAnim.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-block bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{content.featuresTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{content.featuresSubtitle}</p>
          </div>
          {featureCards.length > 0 ? (
            <div className={`grid ${gridCols(featureCards.length)} gap-6`}>
              {featureCards.map((card, i) => {
                const Icon = ICON_MAP[card.icon] || Shield;
                const c = COLOR_MAP[card.color] || COLOR_MAP.blue;
                return (
                  <div key={card._id}
                    className={`bg-white p-7 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border ${c.border} group`}
                    style={{ animationDelay: `${i * 60}ms` }}>
                    <div className={`w-14 h-14 ${c.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${c.text}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-44 animate-pulse" />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">Our Range</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all group">
              View All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No products yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block">
                  <div className="relative overflow-hidden h-56 bg-gradient-to-br from-blue-50 to-indigo-50">
                    {product.image ? (
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-blue-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {product.categoryName && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        {product.categoryName}
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-900" /> Featured
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">View Details →</span>
                    </div>
                  </div>
                  <div className="p-5">
                    {product.form && <p className="text-xs text-blue-500 font-bold mb-1 uppercase tracking-wide">{product.form}</p>}
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-blue-600 font-semibold text-sm">Get Latest Price</span>
                      <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
              View All Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ═══════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">Browse By</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Product Categories</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat, i) => {
                const Icon = categoryIcons[i % categoryIcons.length];
                return (
                  <Link key={cat._id} to={`/products?category=${cat._id}`}
                    className="group bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
                    <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                      <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{cat.name}</h3>
                    {cat.description && <p className="text-gray-500 text-sm line-clamp-2">{cat.description}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY US (detailed) ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">Our Advantage</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{content.whyUsTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{content.whyUsSubtitle}</p>
          </div>
          {whyUsCards.length > 0 ? (
            <div className={`grid ${gridCols(whyUsCards.length === 4 ? 4 : whyUsCards.length)} gap-5`}>
              {whyUsCards.map((card) => {
                const Icon = ICON_MAP[card.icon] || Shield;
                const c = COLOR_MAP[card.color] || COLOR_MAP.blue;
                return (
                  <div key={card._id}
                    className="flex gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100 group">
                    <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{card.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-50 rounded-2xl h-28 animate-pulse" />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ CERTIFICATIONS / HIGHLIGHTS ══════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 text-blue-100 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-white/20">Quality Assurance</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Certifications</h2>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">Every product we supply meets the highest regulatory and quality standards in India.</p>
          </div>
          {highlightCards.length > 0 ? (
            <div className={`grid ${gridCols(highlightCards.length)} gap-5`}>
              {highlightCards.map((card) => {
                const Icon = ICON_MAP[card.icon] || Shield;
                return (
                  <div key={card._id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group">
                    <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-black text-white text-xl mb-1">{card.title}</h3>
                    <p className="text-blue-200 text-sm">{card.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white/10 rounded-2xl h-44 animate-pulse" />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 80%, #dbeafe 0%, transparent 40%), radial-gradient(circle at 90% 20%, #e0e7ff 0%, transparent 40%)' }} />
        <div ref={testimonialsAnim.ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${testimonialsAnim.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-block bg-yellow-100 text-yellow-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{content.testimonialTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{content.testimonialSubtitle}</p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Quote className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No testimonials yet. Add some from the admin panel.</p>
            </div>
          ) : (
            <div className={`grid ${testimonialsGrid(testimonials.length)} gap-6`}>
              {testimonials.map((t) => (
                <div key={t._id}
                  className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Quote className="w-10 h-10 text-blue-100 absolute top-5 right-5" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`w-4 h-4 ${s < (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100" />
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-black text-sm shadow">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      {t.designation && <p className="text-gray-400 text-xs">{t.designation}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ ABOUT STRIP ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block bg-white/10 text-blue-100 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/20">About Us</span>
              <h2 className="text-3xl md:text-4xl font-black mb-6">Biolex Pharmaceutical<br/>Private Limited</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                ISO 9001:2015 certified company established in 2021, engaged in wholesale trading and supplying quality pharmaceutical medicines across India.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['ISO 9001:2015 Certified','Quality Assured Products','Competitive Wholesale Pricing','Professional Customer Service','Extensive Product Portfolio','Trusted by Healthcare Professionals'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-blue-100">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all group shadow-lg">
                Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 space-y-4">
              {[
                { e: '👤', label: 'CEO',           value: 'Ravi Kumar Bhalla' },
                { e: '📍', label: 'Location',      value: 'Manimajra, Chandigarh' },
                { e: '🏢', label: 'Business Type', value: 'Wholesaler / Distributor' },
                { e: '📅', label: 'Established',   value: '2021' },
                { e: '🏆', label: 'Certification', value: 'ISO 9001:2015' },
                { e: '📋', label: 'GST No.',        value: '04AAJCB2451N1ZM' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-blue-300 text-sm flex items-center gap-2">
                    <span>{item.e}</span>{item.label}
                  </span>
                  <span className="font-bold text-white text-sm text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-purple-100 text-purple-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{content.faqTitle}</h2>
            <p className="text-gray-500 text-lg">{content.faqSubtitle}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`rounded-2xl border overflow-hidden transition-all duration-200 ${openFaq === i ? 'border-blue-200 shadow-md' : 'border-gray-100'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${openFaq === i ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 bg-blue-50/50">
                    <p className="text-gray-600 leading-relaxed pt-3 border-t border-blue-100">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50" ref={ctaAnim.ref}>
        <div className="max-w-5xl mx-auto px-4">
          <div className={`relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-14 text-white overflow-hidden shadow-2xl transition-all duration-700 ${ctaAnim.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl" />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="relative text-center">
              <span className="inline-block bg-white/10 text-blue-100 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 mb-6">Start Today</span>
              <h2 className="text-3xl md:text-5xl font-black mb-5">{content.ctaTitle}</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">{content.ctaSubtitle}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-700 px-10 py-4 rounded-xl font-black hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 group text-lg">
                  Send Inquiry Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products" className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-lg">
                  Browse Products
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-10 mt-10 pt-8 border-t border-white/20">
                {[['500+','Products'],['100+','Partners'],['24/7','Support'],['2021','Established']].map(([v,l]) => (
                  <div key={l} className="text-center">
                    <div className="text-2xl font-black">{v}</div>
                    <div className="text-blue-200 text-xs font-medium">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} product={selectedProduct} />
    </div>
  );
}
