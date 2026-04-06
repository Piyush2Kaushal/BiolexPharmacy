import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Top strip */}
      <div className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white font-semibold text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" /> ISO 9001:2015 Certified Pharmaceutical Company
          </p>
          <Link to="/contact" className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
            Send Inquiry →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/faveicon.png.jpeg"
                alt="Biolex Pharmaceutical"
                className="h-10 w-auto object-contain rounded"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <p className="font-bold text-white text-sm leading-tight">Biolex Pharmaceutical</p>
                <p className="text-gray-400 text-xs">Private Limited</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              ISO 9001:2015 Certified wholesale supplier of quality pharmaceutical medicines. Trusted by healthcare professionals across India.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-700/30 border border-blue-600/30 text-blue-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" /> ISO 9001:2015
              </span>
            </div>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[['Home', '/'], ['About Us', '/about'], ['Products', '/products'], ['Contact', '/contact']].map(([name, path]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Product Range</h3>
            <ul className="space-y-3">
              {['Tablets & Capsules', 'Syrups & Drops', 'Injections', 'Protein Powders', 'Ointments & Gels', 'PCD Franchise'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <span>SCF-320, 2nd Floor, Motor Market, Manimajra, Chandigarh – 160101</span>
              </li>
              <li>
                <a href="tel:+918816036666" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  8816036666
                </a>
              </li>
              <li>
                <a href="tel:+918629936666" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  8629936666
                </a>
              </li>
              <li>
                <a href="mailto:biolexpharmaceuticals@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  biolexpharmaceuticals@gmail.com
                </a>
              </li>
              <li className="text-gray-400 text-sm">
                <span className="text-gray-500 text-xs block mb-1">Business Hours</span>
                Mon–Sat: 9:00 AM – 6:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            © 2026 Biolex Pharmaceutical Private Limited. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>GST: 04AAJCB2451N1ZM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
