import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Plus } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: lists } = await supabase
        .from("gift_lists")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      if (lists && lists.length > 0) {
        navigate("/dashboard");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <img 
          src="/givlyn-logo.png" 
          alt="Givlyn" 
          className="w-24 h-24 mx-auto mb-8 object-contain"
        />

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {language === 'es' 
            ? `¡Hola, ${userName}!` 
            : `Hello, ${userName}!`}
        </h1>
        
        <p className="text-xl text-gray-600 mb-2">
          {language === 'es' 
            ? 'Bienvenido a Givlyn.' 
            : 'Welcome to Givlyn.'}
        </p>

        <p className="text-gray-500 mb-12">
          {language === 'es' 
            ? 'Solo 3 minutos para empezar a ahorrar en todos tus regalos.' 
            : 'Just 3 minutes to start saving on all your gifts.'}
        </p>

        <Button 
          onClick={() => navigate("/lists")}
          size="lg"
          className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6 mr-3" />
          {language === 'es' ? 'CREAR TU PRIMERA LISTA' : 'CREATE YOUR FIRST LIST'}
        </Button>

        <p className="text-sm text-gray-400 mt-8">
          {language === 'es' 
            ? 'Compara precios en Amazon, Walmart, Target y más' 
            : 'Compare prices on Amazon, Walmart, Target and more'}
        </p>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
