import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const PremiumUpsellBanner = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="relative p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-amber-600 hover:text-amber-800"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-900">
            {language === 'es' ? '¡Actualiza a Premium!' : 'Upgrade to Premium!'}
          </h3>
        </div>

        <div className="space-y-1 text-sm text-amber-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">
              {language === 'es' 
                ? 'Búsquedas ilimitadas (vs 10/día gratis)' 
                : 'Unlimited searches (vs 10/day free)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">
              {language === 'es' 
                ? 'Cashback 4% (vs 2% gratis)' 
                : 'Cashback 4% (vs 2% free)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">
              {language === 'es' 
                ? 'Price drop alerts automáticas' 
                : 'Automatic price drop alerts'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
            <Crown className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Solo $9.99/mes' : 'Only $9.99/mo'}
          </Button>
          <div className="text-xs text-amber-700 text-center">
            {language === 'es' ? 'o $99/año\n(2 meses gratis)' : 'or $99/year\n(2 months free)'}
          </div>
        </div>
      </div>
    </Card>
  );
};
