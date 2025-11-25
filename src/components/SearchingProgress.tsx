import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const SearchingProgress = () => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentStore, setCurrentStore] = useState(0);

  const stores = [
    { name: "Amazon", time: 2400 },
    { name: "Walmart", time: 1800 },
    { name: "Target", time: 2200 },
    { name: "Etsy", time: 2000 },
    { name: "eBay", time: 1600 },
  ];

  useEffect(() => {
    let totalTime = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));

      // Update current store based on progress
      if (currentProgress < 20) setCurrentStore(0);
      else if (currentProgress < 40) setCurrentStore(1);
      else if (currentProgress < 60) setCurrentStore(2);
      else if (currentProgress < 80) setCurrentStore(3);
      else setCurrentStore(4);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-muted rounded-2xl px-4 py-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="text-sm font-semibold text-foreground">
        {language === 'es' 
          ? '¡Perfecto! Buscando las MEJORES opciones para ti...' 
          : 'Perfect! Searching for the BEST options for you...'}
      </p>
      
      <div className="space-y-2">
        {stores.map((store, idx) => (
          <div key={store.name} className="flex items-center gap-2">
            {idx < currentStore ? (
              <span className="text-green-500">✅</span>
            ) : idx === currentStore ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span className="text-muted-foreground">⏳</span>
            )}
            <span className={`text-xs ${idx <= currentStore ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              {store.name}
              {idx < currentStore && (
                <span className="ml-2 text-xs text-green-600">
                  ({(stores[idx].time / 1000).toFixed(1)}s)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          {progress}%
        </p>
      </div>

      <p className="text-xs text-muted-foreground italic">
        💡 {language === 'es' 
          ? 'Estoy comparando +500 productos para mostrarte las mejores opciones' 
          : 'Comparing +500 products to show you the best options'}
      </p>
    </div>
  );
};
