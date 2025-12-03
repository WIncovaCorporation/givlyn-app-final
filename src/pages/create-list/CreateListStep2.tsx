import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/data/eventTypes";

interface AccessType {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  descEsDynamic?: string;
  descEnDynamic?: string;
  image: string;
  color: string;
}

const accessTypes: AccessType[] = [
  { 
    id: "private", 
    nameEs: "Lista Personal", 
    nameEn: "Personal List", 
    descEs: "Para mí (Privada). Mi catálogo de sueños personal.", 
    descEn: "For me (Private). My personal dream catalog.",
    image: "/images/list-types/treasure_chest_wishlist_icon.png",
    color: "#1ABC9C"
  },
  { 
    id: "shared", 
    nameEs: "Recibir Regalos", 
    nameEn: "Receive Gifts", 
    descEs: "Wishlist compartida para que otros me regalen.", 
    descEn: "Shared wishlist for others to gift me.",
    descEsDynamic: "Ideal para tu {category}. Garantiza que recibes exactamente lo que deseas.",
    descEnDynamic: "Ideal for your {category}. Ensures you get exactly what you want.",
    image: "/images/list-types/person_receiving_gift_icon.png",
    color: "#FF9900"
  },
  { 
    id: "group_event", 
    nameEs: "Evento de Grupo", 
    nameEn: "Group Event", 
    descEs: "Intercambio, sorteo o co-financiación.", 
    descEn: "Exchange, raffle or co-funding.",
    image: "/images/list-types/group_coordination_hands_icon.png",
    color: "#8B5CF6"
  },
  { 
    id: "managed", 
    nameEs: "Administrar Lista", 
    nameEn: "Manage List", 
    descEs: "Organizo la lista de un tercero.", 
    descEn: "I organize someone else's list.",
    image: "/images/list-types/caretaker_with_child_icon.png",
    color: "#3B82F6"
  },
];

export default function CreateListStep2() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedAccess, setSelectedAccess] = useState("shared");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("createList");
    if (!saved) {
      navigate("/create-list/step-1");
      return;
    }
    
    const data = JSON.parse(saved);
    if (data.event_type) {
      const eventType = EVENT_TYPES.find(e => e.id === data.event_type);
      if (eventType) {
        setCategoryName(language === 'es' ? eventType.title : eventType.titleEn);
      }
    }
  }, [navigate, language]);

  const getDescription = (type: AccessType) => {
    if (type.id === 'shared' && categoryName) {
      const template = language === 'es' ? type.descEsDynamic : type.descEnDynamic;
      if (template) {
        return template.replace('{category}', categoryName);
      }
    }
    return language === 'es' ? type.descEs : type.descEn;
  };

  const handleNext = () => {
    const saved = sessionStorage.getItem("createList");
    if (saved) {
      const data = JSON.parse(saved);
      const updatedData = { ...data, access_type: selectedAccess };
      sessionStorage.setItem("createList", JSON.stringify(updatedData));
      navigate("/create-list/success");
    }
  };

  const handleBack = () => {
    navigate("/create-list/step-1");
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1A3E5C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Volver' : 'Back'}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              {language === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3'}
            </span>
            <Progress value={66} className="h-2 w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A3E5C] mb-3">
            {language === 'es' ? '¿Cómo Quieres Usar Esta Lista?' : 'How Do You Want to Use This List?'}
          </h1>
          <p className="text-lg text-gray-500">
            {language === 'es' ? 'Define tu rol y la mecánica' : 'Define your role and mechanics'}
          </p>
        </div>

        {/* GoWish-style Grid: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {accessTypes.map((type) => {
            const isSelected = selectedAccess === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedAccess(type.id)}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 text-center transition-all duration-200",
                  "hover:-translate-y-0.5",
                  isSelected
                    ? "bg-opacity-5"
                    : "border-gray-100 bg-white"
                )}
                style={{
                  minHeight: '200px',
                  borderColor: isSelected ? type.color : undefined,
                  backgroundColor: isSelected ? `${type.color}08` : undefined,
                  boxShadow: isSelected 
                    ? `0 15px 40px ${type.color}20` 
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
                      src={type.image} 
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
                      {language === 'es' ? type.nameEs : type.nameEn}
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed">
                      {getDescription(type)}
                    </p>
                  </div>
                  
                  {/* Selection Indicator */}
                  <div 
                    className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
                    )}
                    style={{
                      borderColor: isSelected ? type.color : '#D1D5DB'
                    }}
                  >
                    {isSelected && (
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-bold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 rounded-xl transition-all"
            style={{ boxShadow: '0 8px 24px rgba(26, 188, 156, 0.3)' }}
          >
            {language === 'es' ? 'Finalizar y Crear Lista' : 'Finish and Create List'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
