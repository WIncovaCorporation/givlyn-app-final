import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, TrendingUp, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ReferralSystem = () => {
  const { language } = useLanguage();
  const [referralCode, setReferralCode] = useState<string>('');
  const [usesCount, setUsesCount] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [tier, setTier] = useState<string>('novato');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Intentar obtener stats de referidos
      let response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/monetization`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'get_referral_stats' })
        }
      );

      // Si no existe código, generar uno nuevo
      if (response.status === 404) {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/monetization`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'generate_referral_code' })
          }
        );

        const { referral_code } = await response.json();
        if (referral_code) {
          setReferralCode(referral_code.code);
          setTier(referral_code.tier);
        }
      } else {
        const { referral_code, earnings } = await response.json();
        if (referral_code) {
          setReferralCode(referral_code.code);
          setUsesCount(referral_code.uses_count);
          setTotalEarnings(referral_code.total_earnings);
          setTier(referral_code.tier);
        }
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success(language === 'es' ? '¡Link copiado!' : 'Link copied!');
  };

  const getTierInfo = () => {
    const tiers = {
      novato: { reward: 5, color: 'blue', icon: '🌱' },
      promotor: { reward: 7, color: 'purple', icon: '⭐' },
      influencer: { reward: 10, color: 'orange', icon: '🔥' },
      embajador: { reward: 15, color: 'red', icon: '👑' }
    };
    return tiers[tier as keyof typeof tiers] || tiers.novato;
  };

  const tierInfo = getTierInfo();

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
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">
              {language === 'es' ? 'Referidos' : 'Referrals'}
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
            <span className="text-lg">{tierInfo.icon}</span>
            <span className="text-sm font-semibold text-purple-700 capitalize">{tier}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={referralCode}
              readOnly
              className="font-mono text-lg text-center bg-white border-purple-300"
            />
            <Button
              onClick={copyReferralLink}
              variant="outline"
              size="icon"
              className="shrink-0 border-purple-300 hover:bg-purple-100"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{usesCount}</div>
              <div className="text-xs text-purple-600">
                {language === 'es' ? 'Referidos' : 'Referrals'}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">${totalEarnings.toFixed(0)}</div>
              <div className="text-xs text-purple-600">
                {language === 'es' ? 'Ganado' : 'Earned'}
              </div>
            </div>
          </div>

          <div className="bg-purple-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <Award className="w-4 h-4" />
              <span className="font-semibold">
                ${tierInfo.reward} {language === 'es' ? 'por referido' : 'per referral'}
              </span>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {language === 'es' 
                ? 'Comparte tu código y gana cuando tus amigos compren' 
                : 'Share your code and earn when your friends buy'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
