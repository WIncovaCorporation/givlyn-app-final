import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { EventCard } from "@/components/ListCreation/EventCard";
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

      <div className="max-w-lg mx-auto px-4 py-6 fade-in-up">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2 font-medium">
            {language === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
          </p>
          <Progress value={33} className="h-2" />
        </div>

        <h1 className="text-2xl font-bold text-[#1A3E5C] mb-6">
          {language === 'es' ? '¿Para qué evento es esta lista?' : 'What event is this list for?'}
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Label htmlFor="list-name" className="text-sm font-semibold text-gray-700 mb-2 block">
              {language === 'es' ? 'Nombre de la Lista' : 'List Name'}
            </Label>
            <Input
              id="list-name"
              value={name}
              onChange={handleNameChange}
              placeholder={language === 'es' ? 'Ej: "Cumpleaños de mi hijo Mateo"' : 'E.g.: "My son\'s Birthday"'}
              maxLength={50}
              className={`border-gray-200 focus:border-[#1ABC9C] focus:ring-[#1ABC9C] text-base py-3 ${nameError ? 'border-red-400' : ''}`}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${nameError ? 'text-red-500' : 'text-gray-400'}`}>
                {nameError || (language === 'es' ? 'Máx. 50 caracteres' : 'Max. 50 characters')}
              </span>
              <span className="text-xs text-gray-400 font-medium">{name.length}/50</span>
            </div>
            <Progress 
              value={(name.length / 50) * 100} 
              className="h-1 mt-1" 
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              {language === 'es' ? 'Tipo de Evento' : 'Event Type'}
              <span className="text-gray-400 font-normal ml-1">
                ({language === 'es' ? 'Elige una opción' : 'Choose one'})
              </span>
            </Label>
            <div className="space-y-3">
              {EVENT_TYPES.map((eventType) => (
                <EventCard
                  key={eventType.id}
                  event={eventType}
                  isSelected={selectedType === eventType.id}
                  onClick={() => handleCardClick(eventType.id)}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full py-6 text-base font-semibold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
          >
            {language === 'es' ? 'Siguiente: ¿Quién la Usará?' : 'Next: Who Will Use It?'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          {!isValid && (
            <p className="text-center text-xs text-gray-400 mt-2">
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
