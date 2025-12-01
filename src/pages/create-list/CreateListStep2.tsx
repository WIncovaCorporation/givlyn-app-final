import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessType {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  image: string;
}

const accessTypes: AccessType[] = [
  { 
    id: "personal", 
    nameEs: "Modo Wishlist Personal", 
    nameEn: "Personal Wishlist Mode", 
    descEs: "Solo para ti. Úsala como tu catálogo de sueños.", 
    descEn: "Just for you. Use it as your dream catalog.",
    image: "/images/list-types/treasure_chest_wishlist_icon.png"
  },
  { 
    id: "receive", 
    nameEs: "🎁 Recibir Regalos (Tú Eres el Festejado)", 
    nameEn: "🎁 Receive Gifts (You Are the Celebrant)", 
    descEs: "Ideal para Cumpleaños, Boda o Baby Shower. Garantiza que recibes exactamente lo que deseas.", 
    descEn: "Ideal for Birthdays, Weddings or Baby Showers. Guarantees you get exactly what you want.",
    image: "/images/list-types/person_receiving_gift_icon.png"
  },
  { 
    id: "group", 
    nameEs: "🤝 Evento de Grupo (Amigo Secreto, Sorteo, Co-funding)", 
    nameEn: "🤝 Group Event (Secret Santa, Raffle, Co-funding)", 
    descEs: "Coordina sorteos o aportes para regalos costosos. Todos evitan el estrés de adivinar.", 
    descEn: "Coordinate raffles or contributions for expensive gifts. Everyone avoids guessing stress.",
    image: "/images/list-types/group_coordination_hands_icon.png"
  },
  { 
    id: "third_party", 
    nameEs: "Para un Tercero", 
    nameEn: "For Someone Else", 
    descEs: "Crea la lista para otra persona (bebé, pareja, etc).", 
    descEn: "Create a list for someone else (baby, partner, etc).",
    image: "/images/list-types/caretaker_with_child_icon.png"
  },
];

export default function CreateListStep2() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedAccess, setSelectedAccess] = useState("personal");

  useEffect(() => {
    const saved = sessionStorage.getItem("createList");
    if (!saved) {
      navigate("/create-list/step-1");
    }
  }, [navigate]);

  const handleNext = () => {
    const saved = sessionStorage.getItem("createList");
    console.log('[Step2] Saved data before navigation:', saved);
    if (saved) {
      const data = JSON.parse(saved);
      const updatedData = { ...data, access_type: selectedAccess };
      console.log('[Step2] Updated data:', updatedData);
      sessionStorage.setItem("createList", JSON.stringify(updatedData));
      console.log('[Step2] Navigating to success page...');
      navigate("/create-list/success");
    } else {
      console.error('[Step2] No saved data found!');
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
          {language === 'es' ? '¡ASEGURA TUS REGALOS PERFECTOS!' : 'SECURE YOUR PERFECT GIFTS!'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {language === 'es' ? 'Elige el tipo de lista que necesitas' : 'Choose the type of list you need'}
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
                    ? "border-[#1ABC9C] bg-[#1ABC9C]/5 shadow-md"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
                    isSelected ? "bg-white shadow-sm" : "bg-gray-50"
                  )}>
                    <img 
                      src={type.image} 
                      alt={language === 'es' ? type.nameEs : type.nameEn}
                      className="w-14 h-14 object-contain"
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
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        isSelected ? "border-[#1ABC9C]" : "border-gray-300"
                      )}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-[#1ABC9C]" />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {language === 'es' ? type.descEs : type.descEn}
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
