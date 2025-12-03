import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import "@/components/ListCreation/animations.css";

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

  const isValid = name.trim().length >= 3 && name.trim().length <= 50 && selectedType !== null;

  const handleNext = () => {
    if (!name.trim()) {
      setNameError(language === 'es' ? 'Por favor, ingresa un nombre' : 'Please enter a name');
      return;
    }
    if (name.trim().length < 3) {
      setNameError(language === 'es' ? 'Mínimo 3 caracteres' : 'Minimum 3 characters');
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
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E5C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 fade-in-up">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2 font-medium">
            {language === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
          </p>
          <Progress value={33} className="h-2" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1A3E5C] mb-2">
          {language === 'es' ? '¿Qué vas a celebrar?' : 'What are you celebrating?'}
        </h1>
        <p className="text-gray-500 mb-6">
          {language === 'es' 
            ? 'Elige el evento para personalizar tu experiencia' 
            : 'Choose the event to personalize your experience'}
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <Label htmlFor="list-name" className="text-base font-semibold text-gray-700 mb-3 block">
              {language === 'es' ? 'Nombre de tu Lista' : 'Your List Name'}
            </Label>
            <Input
              id="list-name"
              value={name}
              onChange={handleNameChange}
              placeholder={language === 'es' ? 'Ej: "Cumpleaños de mi hijo Mateo"' : 'E.g.: "My son\'s Birthday"'}
              maxLength={50}
              className={`border-gray-200 focus:border-[#1ABC9C] focus:ring-[#1ABC9C] text-base py-3 h-12 ${nameError ? 'border-red-400' : ''}`}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${nameError ? 'text-red-500' : 'text-gray-400'}`}>
                {nameError || (language === 'es' ? 'Máx. 50 caracteres' : 'Max. 50 characters')}
              </span>
              <span className="text-sm text-gray-400 font-medium">{name.length}/50</span>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold text-gray-700 mb-4 block">
              {language === 'es' ? 'Tipo de Evento' : 'Event Type'}
              <span className="text-gray-400 font-normal ml-2">
                ({language === 'es' ? 'Elige uno' : 'Choose one'})
              </span>
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {EVENT_TYPES.map((eventType) => {
                const isSelected = selectedType === eventType.id;
                return (
                  <button
                    key={eventType.id}
                    onClick={() => handleCardClick(eventType.id)}
                    className={cn(
                      "group p-6 md:p-8 rounded-2xl border-2 text-left transition-all duration-200",
                      "hover:shadow-lg hover:scale-[1.02]",
                      isSelected
                        ? "border-[#1ABC9C] bg-[#1ABC9C]/5 shadow-md"
                        : "border-gray-100 bg-white hover:border-[#1ABC9C]/50"
                    )}
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={cn(
                        "w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all",
                        isSelected ? "bg-white shadow-md" : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm"
                      )}>
                        <img 
                          src={eventType.image} 
                          alt=""
                          className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                      </div>
                      
                      <div>
                        <p className={cn(
                          "font-bold text-lg md:text-xl mb-1 transition-colors",
                          isSelected ? "text-[#1A3E5C]" : "text-gray-800 group-hover:text-[#1A3E5C]"
                        )}>
                          {language === 'es' ? eventType.title : eventType.titleEn}
                        </p>
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                          {language === 'es' ? eventType.microCopy : eventType.microCopyEn}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#1ABC9C] flex items-center justify-center">
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
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full py-6 text-lg font-bold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 disabled:bg-gray-200 disabled:text-gray-400 transition-all rounded-xl"
          >
            {language === 'es' ? 'Siguiente: ¿Cómo la Usarás?' : 'Next: How Will You Use It?'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          {!isValid && (
            <p className="text-center text-sm text-gray-400 mt-2">
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
