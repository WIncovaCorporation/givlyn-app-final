import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-800 text-white mt-auto py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-400">
          <span>© 2025 Givlyn. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</span>
          <span className="hidden sm:inline">|</span>
          <nav className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {language === 'es' ? 'Privacidad' : 'Privacy'}
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              {language === 'es' ? 'Términos' : 'Terms'}
            </Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              {language === 'es' ? 'Ayuda' : 'Help'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
