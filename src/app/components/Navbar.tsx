import { Link, useLocation } from 'react-router';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      {/* <div className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+918047680904" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+91 80476 80904</span>
              </a>
              <a href="mailto:info@biolexpharmaceutical.in" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">info@biolexpharmaceutical.in</span>
              </a>
            </div>
            <Link to="/admin/login" className="hover:text-blue-200 transition-colors text-xs font-medium tracking-wide">
              Admin Login
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/faveicon.png.jpeg"
              alt="Biolex Pharmaceutical"
              className="h-12 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold text-blue-700 tracking-tight">Biolex Pharmaceutical</span>
              <span className="text-xs text-gray-500 font-medium">Private Limited · ISO 9001:2015</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isActive(link.path)
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-3 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2.5 px-3 rounded-lg mb-1 font-medium ${
                  isActive(link.path) ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="block mt-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-center hover:bg-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
