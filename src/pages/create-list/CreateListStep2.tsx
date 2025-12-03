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
    descEsDynamic: "Ideal para tu {category}.",
    descEnDynamic: "Ideal for your {category}.",
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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E5C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Volver' : 'Back'}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {language === 'es' ? 'Paso 2/3' : 'Step 2/3'}
            </span>
            <Progress value={66} className="h-1.5 w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-xl lg:text-2xl font-bold text-[#1A3E5C] mb-1">
          {language === 'es' ? '¿Cómo Quieres Usar Esta Lista?' : 'How Do You Want to Use This List?'}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          {language === 'es' ? 'Define tu rol y la mecánica' : 'Define your role and mechanics'}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {accessTypes.map((type) => {
            const isSelected = selectedAccess === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedAccess(type.id)}
                className={cn(
                  "group p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "hover:shadow-md hover:scale-[1.02]",
                  isSelected
                    ? "shadow-sm"
                    : "border-gray-100 bg-white"
                )}
                style={{
                  borderColor: isSelected ? type.color : undefined,
                  backgroundColor: isSelected ? `${type.color}08` : undefined,
                }}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={cn(
                    "w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center transition-all",
                    isSelected ? "bg-white shadow-sm" : "bg-gray-50 group-hover:bg-white"
                  )}>
                    <img 
                      src={type.image} 
                      alt=""
                      className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
                    />
                  </div>
                  
                  <div>
                    <p className={cn(
                      "font-semibold text-sm leading-tight transition-colors",
                      isSelected ? "text-[#1A3E5C]" : "text-gray-800"
                    )}>
                      {language === 'es' ? type.nameEs : type.nameEn}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight line-clamp-3">
                      {getDescription(type)}
                    </p>
                  </div>
                  
                  <div 
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
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
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleNext}
            className="w-full py-5 text-base font-bold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 rounded-xl"
          >
            {language === 'es' ? 'Finalizar y Crear Lista' : 'Finish and Create List'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
