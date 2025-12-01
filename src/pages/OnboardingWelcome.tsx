import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Heart, Search, Scale, ListChecks, Gift, Plus, ChevronRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      if (session.user.user_metadata?.onboarding_completed) {
        navigate("/dashboard");
        return;
      }

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

  const handleSkip = async () => {
    await markOnboardingComplete();
    navigate("/dashboard");
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCreateList = async () => {
    await markOnboardingComplete();
    navigate("/lists");
  };

  const handleSmartSearch = async () => {
    await markOnboardingComplete();
    navigate("/search");
  };

  const markOnboardingComplete = async () => {
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { onboarding_completed: true }
        });
      } catch (error) {
        console.error("Error marking onboarding complete:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3E5C]"></div>
      </div>
    );
  }

  const steps = [
    {
      title: language === 'es' 
        ? `¡Hola, ${userName}! Bienvenido a Givlyn.`
        : `Hi ${userName}! Welcome to Givlyn.`,
      body: language === 'es'
        ? 'Somos Inteligencia Artificial, diseñada con un propósito humano: liberarte del estrés de regalar y asegurar que tu dinero rinda al máximo.'
        : "We are Artificial Intelligence, designed with a human purpose: to free you from the stress of gift-giving and ensure your money goes further.",
      icon: (
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#1ABC9C]/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center gap-1">
            <Brain className="w-10 h-10 text-[#1A3E5C]" />
            <Heart className="w-8 h-8 text-[#FF9900]" />
          </div>
        </div>
      ),
    },
    {
      title: language === 'es'
        ? 'Encuentra el Regalo Perfecto, No el más Caro.'
        : 'Find the Perfect Gift, Not the Most Expensive.',
      body: language === 'es'
        ? 'Nuestra IA no solo busca productos. Analiza las tendencias, compara precios en tiempo real y te guía para que compres la mejor opción en el momento justo.'
        : 'Our AI does more than search for products. It analyzes trends, compares prices in real-time, and guides you to buy the best option at the right moment.',
      icon: (
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#1A3E5C]/10 rounded-full"></div>
          <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center gap-1">
            <Search className="w-8 h-8 text-[#1A3E5C]" />
            <Scale className="w-10 h-10 text-[#1ABC9C]" />
          </div>
        </div>
      ),
    },
    {
      title: language === 'es'
        ? '¿Cómo quieres comenzar a ahorrar?'
        : 'How do you want to start saving?',
      body: language === 'es'
        ? 'Puedes crear una lista de eventos o usar nuestro Asistente Inteligente para una búsqueda rápida.'
        : 'You can create an event list or use our Smart Assistant for a quick search.',
      icon: (
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#FF9900]/10 rounded-full"></div>
          <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center gap-1">
            <ListChecks className="w-8 h-8 text-[#1ABC9C]" />
            <Gift className="w-10 h-10 text-[#FF9900]" />
          </div>
        </div>
      ),
      isFinal: true,
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/logo-icon-only.png" 
            alt="Givlyn" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg font-semibold text-[#1A3E5C]">Givlyn</span>
        </div>
        <button 
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {language === 'es' ? 'Saltar' : 'Skip'}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md text-center">
          {currentStepData.icon}

          <h1 className="text-2xl font-semibold text-[#1A3E5C] mb-4 leading-tight">
            {currentStepData.title}
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {currentStepData.body}
          </p>

          {currentStepData.isFinal ? (
            <div className="space-y-3">
              <Button 
                onClick={handleCreateList}
                className="w-full py-6 text-base font-semibold bg-[#FF9900] hover:bg-[#FF9900]/90 shadow-lg btn-hover-glow transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === 'es' ? 'CREAR LISTA DE REGALOS' : 'CREATE GIFT LIST'}
              </Button>
              <Button 
                onClick={handleSmartSearch}
                className="w-full py-6 text-base font-semibold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 shadow-lg btn-hover-glow transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                {language === 'es' ? 'BUSCAR REGALO INTELIGENTE' : 'SMART GIFT SEARCH'}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleNext}
              className="w-full py-5 text-base font-semibold bg-[#1A3E5C] hover:bg-[#1A3E5C]/90 transition-all"
            >
              {language === 'es' ? 'Siguiente' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>

      <footer className="pb-8 pt-4">
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentStep 
                  ? 'bg-[#1A3E5C] w-6' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          {currentStep + 1} / {steps.length}
        </p>
      </footer>
    </div>
  );
};

export default OnboardingWelcome;
