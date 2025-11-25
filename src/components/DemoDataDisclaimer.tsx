import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DemoDataDisclaimer = () => {
  const { language } = useLanguage();

  return (
    <Alert variant="destructive" className="mb-4 border-2 border-red-500 bg-red-50 dark:bg-red-950">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-bold text-base">
        {language === 'es' ? '⚠️ DATOS DE DEMOSTRACIÓN' : '⚠️ DEMO DATA'}
      </AlertTitle>
      <AlertDescription className="text-sm">
        {language === 'es' 
          ? 'Los precios mostrados son SIMULADOS para demostración. Estos NO son precios reales. Las APIs de tiendas reales se activarán próximamente.'
          : 'Prices shown are SIMULATED for demo purposes. These are NOT real prices. Real store APIs will be activated soon.'}
      </AlertDescription>
    </Alert>
  );
};
