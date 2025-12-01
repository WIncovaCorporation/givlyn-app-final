import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Gift, Share2, ArrowLeft, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ListData {
  name: string;
  event_type: string;
  access_type: string;
}

const eventTypeLabels: Record<string, { es: string; en: string }> = {
  birthday: { es: "Cumpleaños", en: "Birthday" },
  christmas: { es: "Navidad", en: "Christmas" },
  wedding: { es: "Boda", en: "Wedding" },
  baby_shower: { es: "Baby Shower", en: "Baby Shower" },
  other: { es: "Otro", en: "Other" }
};

const accessTypeLabels: Record<string, { es: string; en: string }> = {
  personal: { es: "Personal", en: "Personal" },
  shared: { es: "Compartida", en: "Shared" },
  third_party: { es: "Para Tercero", en: "For Third Party" }
};

export default function CreateListSuccess() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [listData, setListData] = useState<ListData | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const createList = async () => {
      const saved = sessionStorage.getItem("createList");
      if (!saved) {
        navigate("/create-list/step-1");
        return;
      }

      const data: ListData = JSON.parse(saved);
      setListData(data);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error(language === 'es' ? 'Debes iniciar sesión' : 'You must be logged in');
          navigate("/auth");
          return;
        }

        const { data: newList, error } = await supabase
          .from('gift_lists')
          .insert({
            name: data.name,
            event_type: data.event_type,
            is_public: data.access_type !== 'personal',
            user_id: user.id
          })
          .select('id')
          .single();

        if (error) throw error;

        setListId(newList.id);
        sessionStorage.removeItem("createList");
        
        setTimeout(() => {
          setIsCreating(false);
          setTimeout(() => setShowContent(true), 100);
        }, 800);

      } catch (error) {
        console.error('Error creating list:', error);
        toast.error(language === 'es' ? 'Error al crear la lista' : 'Error creating list');
        navigate("/create-list/step-1");
      }
    };

    createList();
  }, [navigate, language]);

  const handleAddGift = () => {
    if (listId) {
      navigate(`/search?listId=${listId}`);
    } else {
      navigate("/search");
    }
  };

  const handleShare = async () => {
    if (!listId) return;
    
    const shareUrl = `${window.location.origin}/lists/${listId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listData?.name || 'Mi Lista',
          text: language === 'es' 
            ? '¡Mira mi lista de regalos en Givlyn!' 
            : 'Check out my gift list on Givlyn!',
          url: shareUrl
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          toast.success(language === 'es' ? 'Enlace copiado' : 'Link copied');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(language === 'es' ? 'Enlace copiado al portapapeles' : 'Link copied to clipboard');
    }
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1ABC9C] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'es' ? 'Creando tu lista...' : 'Creating your list...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {language === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3'}
          </p>
          <Progress value={100} className="h-2" />
        </div>

        <div className={cn(
          "text-center mb-6 transition-all duration-500",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="w-16 h-16 bg-[#1ABC9C]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8 text-[#1ABC9C]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A3E5C]">
            {language === 'es' ? '¡Tu lista ha sido creada!' : 'Your list has been created!'}
          </h1>
        </div>

        {listData && (
          <div className={cn(
            "bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 transition-all duration-500 delay-100",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h2 className="font-semibold text-[#1A3E5C] text-lg mb-3">"{listData.name}"</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'es' ? 'Tipo' : 'Type'}:</span>
                <span className="text-gray-700 font-medium">
                  {eventTypeLabels[listData.event_type]?.[language] || listData.event_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'es' ? 'Privacidad' : 'Privacy'}:</span>
                <span className="text-gray-700 font-medium">
                  {accessTypeLabels[listData.access_type]?.[language] || listData.access_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'es' ? 'Regalos' : 'Gifts'}:</span>
                <span className="text-gray-700 font-medium">0</span>
              </div>
            </div>
          </div>
        )}

        <div className={cn(
          "space-y-3 transition-all duration-500 delay-200",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Button
            onClick={handleAddGift}
            className="w-full py-6 text-base font-semibold bg-[#FF9900] hover:bg-[#FF9900]/90"
          >
            <Gift className="w-5 h-5 mr-2" />
            {language === 'es' ? 'Agregar Primer Regalo' : 'Add First Gift'}
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full py-6 text-base font-semibold border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C]/10"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {language === 'es' ? 'Compartir e Invitar' : 'Share & Invite'}
          </Button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-center text-sm text-gray-500 hover:text-[#1A3E5C] transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            {language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
          </button>
        </div>

        <div className={cn(
          "bg-[#1A3E5C]/5 rounded-xl p-4 mt-6 flex gap-3 transition-all duration-500 delay-300",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Lightbulb className="w-5 h-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#1A3E5C]">
            {language === 'es' 
              ? 'Cuando tengas 5+ regalos, comparte tu lista para que otros entiendan bien tus gustos.'
              : 'When you have 5+ gifts, share your list so others understand your preferences.'}
          </p>
        </div>
      </div>
    </div>
  );
}
