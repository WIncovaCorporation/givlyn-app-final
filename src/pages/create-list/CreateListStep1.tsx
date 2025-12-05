import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

export default function CreateListStep1() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [isNameManuallyEdited, setIsNameManuallyEdited] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();

    const saved = sessionStorage.getItem("createList");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name) setName(data.name);
      if (data.event_type) setSelectedType(data.event_type);
    }
  }, [navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setName(value);
      setNameError("");
      setIsNameManuallyEdited(true);
    }
  };

  const handleCardClick = (typeId: string) => {
    setSelectedType(typeId);
    
    if (!isNameManuallyEdited || name.trim() === "") {
      const eventType = EVENT_TYPES.find(e => e.id === typeId);
      if (eventType) {
        const autoName = language === 'es' ? eventType.autoName : eventType.autoNameEn;
        setName(autoName);
        setNameError("");
      }
    }
    
    trackEvent('step1_card_selected', { event_type: typeId });
  };

  const [isChecking, setIsChecking] = useState(false);
  const isValid = name.trim().length >= 3 && name.trim().length <= 50 && selectedType !== null;

  const checkDuplicateName = async (listName: string): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data: existingLists } = await supabase
      .from('gift_lists')
      .select('name')
      .eq('user_id', session.user.id)
      .ilike('name', listName.trim());

    return (existingLists?.length || 0) > 0;
  };

  const handleNext = async () => {
    if (!name.trim()) {
      setNameError(language === 'es' ? 'Por favor, ingresa un nombre' : 'Please enter a name');
      return;
    }
    if (name.trim().length < 3) {
      setNameError(language === 'es' ? 'Minimo 3 caracteres' : 'Minimum 3 characters');
      return;
    }

    setIsChecking(true);
    try {
      const isDuplicate = await checkDuplicateName(name);
      if (isDuplicate) {
        setNameError(language === 'es' 
          ? 'Ya tienes una lista con este nombre. Usa un nombre diferente.' 
          : 'You already have a list with this name. Use a different name.');
        setIsChecking(false);
        return;
      }

      sessionStorage.setItem("createList", JSON.stringify({ 
        name: name.trim(), 
        event_type: selectedType 
      }));

      trackEvent('step1_completed', { 
        event_type: selectedType,
        list_name_length: name.trim().length
      });

      navigate("/create-list/step-2");
    } catch (error) {
      console.error('Error checking duplicate:', error);
      navigate("/create-list/step-2");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC]">
      {/* Premium Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1A3E5C] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium hidden sm:inline">
              {language === 'es' ? 'Dashboard' : 'Dashboard'}
            </span>
          </button>
          
          {/* Step Indicator - Premium Pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-8 h-1 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-medium">2</div>
              <div className="w-8 h-1 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-medium">3</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-36">
        {/* Hero Section with Gradient Background */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ABC9C]/10 rounded-full text-[#1ABC9C] text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            {language === 'es' ? 'Paso 1: Elige tu evento' : 'Step 1: Choose your event'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A3E5C] mb-4 tracking-tight">
            {language === 'es' ? 'Que vas a celebrar?' : 'What are you celebrating?'}
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            {language === 'es' 
              ? 'Selecciona el tipo de evento y personalizaremos tu experiencia' 
              : 'Select the event type and we will personalize your experience'}
          </p>
        </div>

        {/* Name Input - Floating Card */}
        <div 
          className="bg-white rounded-3xl p-6 md:p-8 mb-10 border border-gray-100 relative overflow-hidden"
          style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1ABC9C]/10 to-transparent rounded-bl-full" />
          
          <label htmlFor="list-name" className="text-lg font-bold text-[#1A3E5C] mb-4 block">
            {language === 'es' ? 'Nombre de tu Lista' : 'Your List Name'}
          </label>
          <div className="relative">
            <Input
              id="list-name"
              value={name}
              onChange={handleNameChange}
              placeholder={language === 'es' ? 'Ej: Cumpleanos de Sofia' : 'E.g.: Sofia Birthday'}
              maxLength={50}
              className={cn(
                "h-16 text-xl border-2 border-gray-200 focus:border-[#1ABC9C] focus:ring-0 rounded-2xl pl-5 pr-16 font-medium placeholder:text-gray-300 transition-all",
                nameError && "border-red-400 focus:border-red-400",
                name && !nameError && "border-[#1ABC9C]/50"
              )}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
              {name.length}/50
            </span>
          </div>
          {nameError && (
            <p className="text-red-500 text-sm mt-3 font-medium">{nameError}</p>
          )}
        </div>

        {/* Event Type Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1A3E5C] mb-6 flex items-center gap-2">
            {language === 'es' ? 'Tipo de Evento' : 'Event Type'}
            <span className="text-gray-400 font-normal text-base">
              ({language === 'es' ? 'Selecciona uno' : 'Select one'})
            </span>
          </h2>
          
          {/* Premium Grid - 3 columns with hover effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENT_TYPES.map((eventType, index) => {
              const isSelected = selectedType === eventType.id;
              return (
                <button
                  key={eventType.id}
                  onClick={() => handleCardClick(eventType.id)}
                  className={cn(
                    "group relative rounded-3xl text-center transition-all duration-300 overflow-hidden",
                    "hover:-translate-y-2 hover:shadow-2xl",
                    isSelected
                      ? "ring-4 ring-[#1ABC9C] ring-offset-2"
                      : "hover:ring-2 hover:ring-[#1ABC9C]/30 hover:ring-offset-2"
                  )}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    boxShadow: isSelected 
                      ? '0 25px 60px rgba(26, 188, 156, 0.25)' 
                      : '0 15px 40px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Card Background with Gradient */}
                  <div className={cn(
                    "absolute inset-0 transition-all duration-300",
                    isSelected 
                      ? "bg-gradient-to-br from-[#1ABC9C]/15 via-[#1ABC9C]/5 to-white"
                      : "bg-white group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-white"
                  )} />
                  
                  {/* Content */}
                  <div className="relative p-8 flex flex-col items-center">
                    {/* Icon Container with Glow Effect */}
                    <div className={cn(
                      "w-28 h-28 rounded-3xl flex items-center justify-center mb-5 transition-all duration-300",
                      isSelected 
                        ? "bg-white shadow-xl scale-110" 
                        : "bg-gray-50 group-hover:bg-white group-hover:shadow-lg group-hover:scale-105"
                    )}>
                      <img 
                        src={eventType.image} 
                        alt=""
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    
                    {/* Text Content */}
                    <h3 className={cn(
                      "text-xl font-bold leading-tight mb-2 transition-colors",
                      isSelected ? "text-[#1A3E5C]" : "text-gray-800 group-hover:text-[#1A3E5C]"
                    )}>
                      {language === 'es' ? eventType.title : eventType.titleEn}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {language === 'es' ? eventType.microCopy : eventType.microCopyEn}
                    </p>
                    
                    {/* Selection Indicator */}
                    <div className={cn(
                      "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isSelected 
                        ? "bg-[#1ABC9C] shadow-lg scale-100" 
                        : "bg-gray-100 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                    )}>
                      {isSelected ? (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA - Premium Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isValid || isChecking}
            className={cn(
              "w-full h-16 text-lg font-black rounded-2xl transition-all duration-300 group",
              isValid 
                ? "bg-gradient-to-r from-[#1ABC9C] to-[#22C55E] hover:from-[#1ABC9C]/90 hover:to-[#22C55E]/90 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
            style={{ 
              boxShadow: isValid ? '0 15px 40px rgba(26, 188, 156, 0.35)' : 'none' 
            }}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                {language === 'es' ? 'Verificando...' : 'Checking...'}
              </>
            ) : (
              <>
                {language === 'es' ? 'CONTINUAR' : 'CONTINUE'}
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          {!isValid && (
            <p className="text-center text-sm text-gray-400 mt-3">
              {language === 'es' 
                ? 'Completa el nombre y selecciona un evento para continuar' 
                : 'Complete the name and select an event to continue'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
