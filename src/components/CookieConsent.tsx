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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-3 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg animate-in slide-in-from-bottom-5 duration-300">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-muted-foreground flex-1">
            <span className="hidden sm:inline">
              {language === 'es'
                ? 'Usamos cookies para mejorar tu experiencia. '
                : 'We use cookies to improve your experience. '}
            </span>
            <Link to="/privacy" className="text-primary hover:underline">
              {language === 'es' ? 'Más info' : 'Learn more'}
            </Link>
          </p>
          
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="text-xs h-7 px-2 sm:px-3"
            >
              {language === 'es' ? 'Esenciales' : 'Essential'}
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="text-xs h-7 px-2 sm:px-3"
            >
              {language === 'es' ? 'Aceptar' : 'Accept'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecline}
              className="h-7 w-7"
              aria-label={language === 'es' ? 'Cerrar' : 'Close'}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
