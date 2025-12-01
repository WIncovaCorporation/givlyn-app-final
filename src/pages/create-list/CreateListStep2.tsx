import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Lock, Globe, Users, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessType {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  icon: React.ElementType;
}

const accessTypes: AccessType[] = [
  { 
    id: "personal", 
    nameEs: "Lista Personal", 
    nameEn: "Personal List", 
    descEs: "Solo tú puedes verla y editarla. Perfecta si es privada.", 
    descEn: "Only you can view and edit. Perfect if it's private.",
    icon: Lock 
  },
  { 
    id: "shared", 
    nameEs: "Lista Compartida", 
    nameEn: "Shared List", 
    descEs: "Invita a familiares y amigos para que compren regalos.", 
    descEn: "Invite family and friends to buy gifts.",
    icon: Globe 
  },
  { 
    id: "third_party", 
    nameEs: "Para un Tercero", 
    nameEn: "For Someone Else", 
    descEs: "Crea una lista para otra persona (bebé, pareja, etc).", 
    descEn: "Create a list for someone else (baby, partner, etc).",
    icon: Users 
  },
];

const tips: Record<string, { es: string; en: string }> = {
  personal: {
    es: "Puedes cambiar la privacidad después si decides compartirla.",
    en: "You can change the privacy settings later if you decide to share."
  },
  shared: {
    es: "Las listas compartidas consiguen 3x más compras.",
    en: "Shared lists get 3x more purchases."
  },
  third_party: {
    es: "Ideal para organizar regalos en grupo sin que el festejado lo sepa.",
    en: "Ideal for organizing group gifts without the recipient knowing."
  }
};

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
    if (saved) {
      const data = JSON.parse(saved);
      sessionStorage.setItem("createList", JSON.stringify({ ...data, access_type: selectedAccess }));
      navigate("/create-list/success");
    }
  };

  const handleBack = () => {
    navigate("/create-list/step-1");
  };

  const currentTip = tips[selectedAccess];

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

        <h1 className="text-xl font-bold text-[#1A3E5C] mb-2">
          {language === 'es' ? '¿Quién tendrá acceso a esta lista?' : 'Who will have access to this list?'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {language === 'es' ? 'Privacidad + Compartir' : 'Privacy + Sharing'}
        </p>

        <div className="space-y-3 mb-6">
          {accessTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedAccess === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedAccess(type.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-[#1ABC9C] bg-[#1ABC9C]/5"
                    : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-[#1ABC9C]/20" : "bg-gray-100"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isSelected ? "text-[#1ABC9C]" : "text-gray-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-semibold",
                        isSelected ? "text-[#1A3E5C]" : "text-gray-700"
                      )}>
                        {language === 'es' ? type.nameEs : type.nameEn}
                      </p>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-[#1ABC9C]" : "border-gray-300"
                      )}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-[#1ABC9C]" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'es' ? type.descEs : type.descEn}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-[#1A3E5C]/5 rounded-xl p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#1A3E5C]">
            {language === 'es' ? currentTip.es : currentTip.en}
          </p>
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
