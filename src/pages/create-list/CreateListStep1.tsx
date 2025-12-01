import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Cake, TreePine, Heart, Baby, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventType {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  icon: React.ElementType;
}

const eventTypes: EventType[] = [
  { id: "birthday", nameEs: "Cumpleaños", nameEn: "Birthday", descEs: "Celebra con amigos y familia", descEn: "Celebrate with friends and family", icon: Cake },
  { id: "christmas", nameEs: "Navidad", nameEn: "Christmas", descEs: "Regalos de temporada", descEn: "Holiday gifts", icon: TreePine },
  { id: "wedding", nameEs: "Boda", nameEn: "Wedding", descEs: "Regalos para los novios", descEn: "Gifts for the couple", icon: Heart },
  { id: "baby_shower", nameEs: "Baby Shower", nameEn: "Baby Shower", descEs: "Regalos para el bebé", descEn: "Gifts for the baby", icon: Baby },
  { id: "other", nameEs: "Otro", nameEn: "Other", descEs: "Especifica tu evento", descEn: "Specify your event", icon: Tag },
];

export default function CreateListStep1() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const isValid = name.trim().length >= 3 && name.trim().length <= 50 && selectedType !== null;

  const handleNext = () => {
    if (isValid) {
      sessionStorage.setItem("createList", JSON.stringify({ name: name.trim(), event_type: selectedType }));
      navigate("/create-list/step-2");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
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

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {language === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
          </p>
          <Progress value={33} className="h-2" />
        </div>

        <h1 className="text-xl font-bold text-[#1A3E5C] mb-6">
          {language === 'es' ? '¿Para qué evento es esta lista?' : 'What event is this list for?'}
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Label htmlFor="list-name" className="text-sm font-medium text-gray-700 mb-2 block">
              {language === 'es' ? 'Nombre de la Lista' : 'List Name'}
            </Label>
            <Input
              id="list-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'es' ? 'Ej: "Cumpleaños de mi hijo Mateo"' : 'E.g.: "My son\'s Birthday"'}
              maxLength={50}
              className="border-gray-200 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {language === 'es' ? 'Máx. 50 caracteres' : 'Max. 50 characters'}
              </span>
              <span className="text-xs text-gray-400">{name.length}/50</span>
            </div>
            <Progress value={(name.length / 50) * 100} className="h-1 mt-1" />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              {language === 'es' ? 'Tipo de Evento' : 'Event Type'}
            </Label>
            <div className="space-y-3">
              {eventTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      isSelected
                        ? "border-[#1ABC9C] bg-[#1ABC9C]/5"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-[#1ABC9C]/20" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          isSelected ? "text-[#1ABC9C]" : "text-gray-500"
                        )} />
                      </div>
                      <div>
                        <p className={cn(
                          "font-semibold",
                          isSelected ? "text-[#1A3E5C]" : "text-gray-700"
                        )}>
                          {language === 'es' ? type.nameEs : type.nameEn}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === 'es' ? type.descEs : type.descEn}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full py-6 text-base font-semibold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {language === 'es' ? 'Siguiente: ¿Quién la Usará?' : 'Next: Who Will Use It?'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
