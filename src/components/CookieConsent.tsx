import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'givlyn_cookie_consent';

export const CookieConsent = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              {language === 'es' ? '🍪 Uso de Cookies' : '🍪 Cookie Notice'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'es'
                ? 'Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de análisis para mejorar tu experiencia. Al hacer clic en "Aceptar", consientes el uso de todas las cookies.'
                : 'We use essential cookies for site functionality and analytics cookies to improve your experience. By clicking "Accept", you consent to the use of all cookies.'}
            </p>
            <Link
              to="/privacy"
              className="text-sm text-primary hover:underline inline-block mt-1"
            >
              {language === 'es' ? 'Más información' : 'Learn more'}
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="whitespace-nowrap"
            >
              {language === 'es' ? 'Solo Esenciales' : 'Essential Only'}
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="whitespace-nowrap"
            >
              {language === 'es' ? 'Aceptar Todas' : 'Accept All'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecline}
              className="shrink-0"
              aria-label={language === 'es' ? 'Cerrar' : 'Close'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
