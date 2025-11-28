import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Gift className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold text-foreground">Givlyn</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'es'
                ? 'Compara precios y encuentra las mejores ofertas.'
                : 'Compare prices and find the best deals.'}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {language === 'es'
                ? 'Un producto de Wincova Corporation'
                : 'A product of Wincova Corporation'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {language === 'es' ? 'Ayuda' : 'Help'}
            </h3>
            <nav aria-label={language === 'es' ? 'Enlaces de ayuda' : 'Help links'}>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/how-it-works" 
                    className="text-sm text-primary font-medium hover:underline transition-colors"
                  >
                    {language === 'es' ? 'Cómo Funciona' : 'How It Works'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {language === 'es' ? 'Soporte' : 'Support'}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">
              {language === 'es' ? 'Legal' : 'Legal'}
            </h3>
            <nav aria-label={language === 'es' ? 'Enlaces legales' : 'Legal links'}>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/terms" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {language === 'es' ? 'Términos' : 'Terms'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {language === 'es' ? 'Privacidad' : 'Privacy'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dmca" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    DMCA
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a 
                  href="mailto:support@givlyn.com" 
                  className="hover:text-primary transition-colors"
                >
                  support@givlyn.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <a 
                  href="tel:+16157289932" 
                  className="hover:text-primary transition-colors"
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

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 Wincova Corporation. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
