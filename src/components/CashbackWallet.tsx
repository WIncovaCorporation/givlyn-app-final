import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CashbackWallet = () => {
  const { language } = useLanguage();
  const [balance, setBalance] = useState<number>(0);
  const [lifetimeEarned, setLifetimeEarned] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Llamar Edge Function de monetización
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/monetization`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'init_wallet' })
        }
      );

      if (!response.ok) throw new Error('Failed to load wallet');

      const { wallet } = await response.json();
      if (wallet) {
        setBalance(wallet.balance);
        setLifetimeEarned(wallet.lifetime_earned);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (balance < 5) {
      toast.error(language === 'es' ? 'Mínimo $5 para redimir' : 'Minimum $5 to redeem');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(language === 'es' ? 'Debes iniciar sesión' : 'You must sign in');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/monetization`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'redeem_cashback',
            amount: balance
          })
        }
      );

      if (!response.ok) throw new Error('Redemption failed');

      const { new_balance } = await response.json();
      setBalance(new_balance);

      toast.success(
        language === 'es' 
          ? `$${balance.toFixed(2)} aplicado a tu próxima compra!` 
          : `$${balance.toFixed(2)} applied to your next purchase!`
      );
    } catch (error) {
      console.error('Error redeeming cashback:', error);
      toast.error(language === 'es' ? 'Error al redimir' : 'Redemption error');
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">
            {language === 'es' ? 'Tu Cashback' : 'Your Cashback'}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-700">${balance.toFixed(2)}</span>
            <span className="text-sm text-green-600">
              {language === 'es' ? 'disponible' : 'available'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>
              {language === 'es' 
                ? `$${lifetimeEarned.toFixed(2)} ganado total` 
                : `$${lifetimeEarned.toFixed(2)} earned total`}
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button
            onClick={handleRedeem}
            disabled={balance < 5}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Gift className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Usar Cashback' : 'Use Cashback'}
          </Button>

          <p className="text-xs text-green-700 text-center">
            💡 {language === 'es' 
              ? 'Ganas 2% en cada compra vía Givlyn' 
              : 'Earn 2% on every purchase via Givlyn'}
          </p>
        </div>
      </div>
    </Card>
  );
};
