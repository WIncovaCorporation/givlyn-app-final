import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, HelpCircle, Mail, Phone, MapPin, Shield, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white mt-auto" style={{ marginTop: 'auto' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Modelo Transparente */}
        <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
            🤝 {language === 'es' ? 'Modelo Transparente' : 'Transparent Model'}
          </h3>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            {language === 'es' 
              ? 'Givlyn recibe comisión de tiendas (no de ti). Esto nos permite ofrecer: IA gratis + mejor precio + protección. Win-win.'
              : 'Givlyn receives commission from stores (not from you). This allows us to offer: free AI + best price + protection. Win-win.'}
          </p>
          <Link 
            to="/how-it-works" 
            className="text-green-400 text-sm hover:underline inline-flex items-center gap-1"
          >
            {language === 'es' ? 'Cómo ganamos dinero' : 'How we make money'} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/givlyn-logo.png" alt="Givlyn" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold">Givlyn</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              {language === 'es'
                ? 'Compara precios y encuentra las mejores ofertas.'
                : 'Compare prices and find the best deals.'}
            </p>
            <p className="text-xs text-gray-400 italic">
              {language === 'es'
                ? 'Un producto de Wincova Corporation'
                : 'A product of Wincova Corporation'}
            </p>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {language === 'es' ? 'Ayuda' : 'Help'}
            </h3>
            <nav aria-label={language === 'es' ? 'Enlaces de ayuda' : 'Help links'}>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/how-it-works" 
                    className="text-sm text-green-400 font-medium hover:underline transition-colors"
                  >
                    {language === 'es' ? 'Cómo Funciona' : 'How It Works'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {language === 'es' ? 'Soporte' : 'Support'}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">
              {language === 'es' ? 'Legal' : 'Legal'}
            </h3>
            <nav aria-label={language === 'es' ? 'Enlaces legales' : 'Legal links'}>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/terms" 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {language === 'es' ? 'Términos' : 'Terms'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {language === 'es' ? 'Privacidad' : 'Privacy'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dmca" 
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    DMCA
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a 
                  href="mailto:support@givlyn.com" 
                  className="hover:text-white transition-colors"
                >
                  support@givlyn.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <a 
                  href="tel:+16157289932" 
                  className="hover:text-white transition-colors"
                >
                  +1 615-728-9932
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-xs">
                  Murfreesboro, TN 37129
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-400" />
              SSL 256-bit
            </span>
            <span>|</span>
            <span>GDPR Certified</span>
            <span>|</span>
            <span>CCPA</span>
            <span>|</span>
            <span>2FA Enabled</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400">
          <p>
            © 2025 Givlyn. {language === 'es' 
              ? 'Creado con la meta de ahorrarte tiempo y dinero.' 
              : 'Built to save you time and money.'} | <Link to="/privacy" className="hover:text-white transition-colors">{language === 'es' ? 'Privacidad' : 'Privacy'}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
