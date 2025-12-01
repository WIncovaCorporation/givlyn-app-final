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
    descEs: "Para mí (Privada). Cosas que me quiero comprar o que añado a mi catálogo de sueños.", 
    descEn: "For me (Private). Things I want to buy or add to my dream catalog.",
    image: "/images/list-types/treasure_chest_wishlist_icon.png",
    color: "#1ABC9C"
  },
  { 
    id: "shared", 
    nameEs: "Recibir Regalos (Wishlist Compartida)", 
    nameEn: "Receive Gifts (Shared Wishlist)", 
    descEs: "Para que otros compren regalos para mí.", 
    descEn: "For others to buy gifts for me.",
    descEsDynamic: "Ideal para tu {category}. Garantiza que recibes exactamente lo que deseas.",
    descEnDynamic: "Ideal for your {category}. Guarantees you get exactly what you want.",
    image: "/images/list-types/person_receiving_gift_icon.png",
    color: "#FF9900"
  },
  { 
    id: "group_event", 
    nameEs: "Evento de Grupo (Coordinada)", 
    nameEn: "Group Event (Coordinated)", 
    descEs: "Participo en un intercambio, sorteo o co-financiación. Todos dan y reciben.", 
    descEn: "I participate in an exchange, raffle or co-funding. Everyone gives and receives.",
    image: "/images/list-types/group_coordination_hands_icon.png",
    color: "#8B5CF6"
  },
  { 
    id: "managed", 
    nameEs: "Administrar Lista (Para un Tercero)", 
    nameEn: "Manage List (For Someone Else)", 
    descEs: "Soy el Curador. Organizo y gestiono la lista de un niño, un familiar o una persona ajena al evento.", 
    descEn: "I am the Curator. I organize and manage the list for a child, family member or person outside the event.",
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
        const baseDesc = language === 'es' ? type.descEs : type.descEn;
        const dynamicPart = template.replace('{category}', categoryName);
        return `${baseDesc} ${dynamicPart}`;
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E5C] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">
            {language === 'es' ? 'Volver' : 'Back'}
          </span>
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {language === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3'}
          </p>
          <Progress value={66} className="h-2" />
        </div>

        <h1 className="text-2xl font-bold text-[#1A3E5C] mb-2">
          {language === 'es' ? '¿Cómo funcionará tu lista?' : 'How will your list work?'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {language === 'es' ? 'Define tu rol y la mecánica de la lista' : 'Define your role and the list mechanics'}
        </p>

        <div className="space-y-3 mb-6">
          {accessTypes.map((type) => {
            const isSelected = selectedAccess === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedAccess(type.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "shadow-md"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                )}
                style={{
                  borderColor: isSelected ? type.color : undefined,
                  backgroundColor: isSelected ? `${type.color}08` : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
                    isSelected ? "bg-white shadow-sm" : "bg-gray-50"
                  )}>
                    <img 
                      src={type.image} 
                      alt=""
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "font-semibold text-sm leading-tight",
                        isSelected ? "text-[#1A3E5C]" : "text-gray-700"
                      )}>
                        {language === 'es' ? type.nameEs : type.nameEn}
                      </p>
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        )}
                        style={{
                          borderColor: isSelected ? type.color : '#D1D5DB'
                        }}
                      >
                        {isSelected && (
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {getDescription(type)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleNext}
            className="w-full py-6 text-base font-semibold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90"
          >
            {language === 'es' ? 'Siguiente: Finalizar' : 'Next: Finish'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
