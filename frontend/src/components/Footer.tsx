import { useNavigate } from '@tanstack/react-router';
import { Sparkles, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'dalis-boutique');

  return (
    <footer className="bg-teal-900 text-teal-100">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-champagne-400" />
              <span className="font-serif text-xl text-champagne-200 tracking-wide">Dali's Boutique</span>
            </div>
            <p className="text-sm text-teal-300 leading-relaxed font-sans">
              Curating timeless elegance through handpicked sarees, jewelry, and accessories for the modern woman.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-champagne-300 text-lg mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sarees', path: '/sarees' },
                { label: 'Jewelry', path: '/jewelry' },
                { label: 'Handbags', path: '/handbags' },
                { label: 'Offers', path: '/offers' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate({ to: link.path })}
                    className="text-sm text-teal-300 hover:text-champagne-300 transition-colors font-sans"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display text-champagne-300 text-lg mb-4 tracking-wide">Customer Care</h4>
            <ul className="space-y-2 text-sm text-teal-300 font-sans">
              <li><button className="hover:text-champagne-300 transition-colors">Shipping Policy</button></li>
              <li><button className="hover:text-champagne-300 transition-colors">Returns & Exchanges</button></li>
              <li><button className="hover:text-champagne-300 transition-colors">Size Guide</button></li>
              <li><button className="hover:text-champagne-300 transition-colors">FAQ</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-champagne-300 text-lg mb-4 tracking-wide">Contact Us</h4>
            <ul className="space-y-3 text-sm text-teal-300 font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-champagne-400 mt-0.5 shrink-0" />
                <span>123 Silk Street, Chennai, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-champagne-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-champagne-400 shrink-0" />
                <span>hello@dalisboutique.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-teal-400 font-sans">
            © {year} Dali's Boutique. All rights reserved.
          </p>
          <p className="text-xs text-teal-400 font-sans flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-champagne-400 fill-champagne-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne-400 hover:text-champagne-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
