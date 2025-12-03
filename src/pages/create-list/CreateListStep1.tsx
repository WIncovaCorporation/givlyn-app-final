import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
      setNameError(language === 'es' ? 'Mínimo 3 caracteres' : 'Minimum 3 characters');
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
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1A3E5C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              {language === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
            </span>
            <Progress value={33} className="h-2 w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A3E5C] mb-3">
            {language === 'es' ? '¿Qué vas a celebrar?' : 'What are you celebrating?'}
          </h1>
          <p className="text-lg text-gray-500">
            {language === 'es' 
              ? 'Elige el evento para personalizar tu experiencia' 
              : 'Choose the event to personalize your experience'}
          </p>
        </div>

        {/* Name Input - Premium Card */}
        <div 
          className="bg-white rounded-2xl p-6 mb-8 border border-gray-100"
          style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06)' }}
        >
          <Label htmlFor="list-name" className="text-base font-semibold text-[#1A3E5C] mb-3 block">
            {language === 'es' ? 'Nombre de tu Lista' : 'Your List Name'}
          </Label>
          <Input
            id="list-name"
            value={name}
            onChange={handleNameChange}
            placeholder={language === 'es' ? 'Ej: "Cumpleaños de mi hijo Mateo"' : 'E.g.: "My son\'s Birthday"'}
            maxLength={50}
            className={cn(
              "h-14 text-lg border-gray-200 focus:border-[#1ABC9C] focus:ring-[#1ABC9C] rounded-xl",
              nameError && "border-red-400"
            )}
          />
          <div className="flex justify-between items-center mt-3">
            <span className={`text-sm ${nameError ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {nameError || (language === 'es' ? 'Máx. 50 caracteres' : 'Max. 50 characters')}
            </span>
            <span className="text-sm text-gray-400 font-medium">{name.length}/50</span>
          </div>
        </div>

        {/* Event Type Section */}
        <div>
          <Label className="text-base font-semibold text-[#1A3E5C] mb-4 block">
            {language === 'es' ? 'Tipo de Evento' : 'Event Type'}
            <span className="text-gray-400 font-normal ml-2 text-sm">
              ({language === 'es' ? 'Elige uno' : 'Choose one'})
            </span>
          </Label>
          
          {/* GoWish-style Grid: 2 columns on all screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EVENT_TYPES.map((eventType) => {
              const isSelected = selectedType === eventType.id;
              return (
                <button
                  key={eventType.id}
                  onClick={() => handleCardClick(eventType.id)}
                  className={cn(
                    "group relative p-6 rounded-2xl border-2 text-center transition-all duration-200",
                    "hover:-translate-y-0.5",
                    isSelected
                      ? "border-[#1ABC9C] bg-[#1ABC9C]/5"
                      : "border-gray-100 bg-white hover:border-[#1ABC9C]/40"
                  )}
                  style={{ 
                    minHeight: '200px',
                    boxShadow: isSelected 
                      ? '0 15px 40px rgba(26, 188, 156, 0.15)' 
                      : '0 15px 40px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    {/* Icon Container - 80x80px */}
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center transition-all",
                      isSelected 
                        ? "bg-white shadow-md" 
                        : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm"
                    )}>
                      <img 
                        src={eventType.image} 
                        alt=""
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    
                    {/* Text Content */}
                    <div className="space-y-2">
                      <h3 className={cn(
                        "text-xl font-bold leading-tight transition-colors",
                        isSelected ? "text-[#1A3E5C]" : "text-gray-800 group-hover:text-[#1A3E5C]"
                      )}>
                        {language === 'es' ? eventType.title : eventType.titleEn}
                      </h3>
                      <p className="text-base text-gray-500 leading-relaxed">
                        {language === 'es' ? eventType.microCopy : eventType.microCopyEn}
                      </p>
                    </div>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#1ABC9C] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isValid || isChecking}
            className="w-full h-14 text-lg font-bold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl transition-all"
            style={{ boxShadow: isValid ? '0 8px 24px rgba(26, 188, 156, 0.3)' : 'none' }}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {language === 'es' ? 'Verificando...' : 'Checking...'}
              </>
            ) : (
              <>
                {language === 'es' ? 'Siguiente: ¿Cómo la Usarás?' : 'Next: How Will You Use It?'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          {!isValid && (
            <p className="text-center text-sm text-gray-400 mt-3">
              {language === 'es' 
                ? 'Completa el nombre y selecciona un tipo de evento' 
                : 'Complete the name and select an event type'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
