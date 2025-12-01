import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Gift, Share2, ArrowLeft, Lightbulb, Loader2, PartyPopper, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Confetti from 'react-confetti';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const createList = async () => {
      const saved = sessionStorage.getItem("createList");
      console.log('[CreateList] Session data:', saved);
      
      if (!saved) {
        console.log('[CreateList] No session data, redirecting to step-1');
        navigate("/create-list/step-1");
        return;
      }

      const data: ListData = JSON.parse(saved);
      console.log('[CreateList] Parsed data:', data);
      setListData(data);

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('[CreateList] Session check:', { session: sessionData?.session?.user?.id, error: sessionError });
        
        if (sessionError || !sessionData?.session?.user) {
          console.log('[CreateList] No valid session');
          toast.error(language === 'es' ? 'Debes iniciar sesión' : 'You must be logged in');
          navigate("/auth");
          return;
        }

        const user = sessionData.session.user;
        console.log('[CreateList] User ID:', user.id);
        console.log('[CreateList] Inserting list with name:', data.name);

        const { data: newList, error } = await supabase
          .from('gift_lists')
          .insert({
            name: data.name,
            user_id: user.id
          })
          .select('id')
          .single();

        console.log('[CreateList] Insert result:', { newList, error });

        if (error) {
          console.error('[CreateList] Supabase error:', error);
          throw error;
        }

        if (!newList) {
          throw new Error('No list returned from insert');
        }

        console.log('[CreateList] Success! List ID:', newList.id);
        setListId(newList.id);
        sessionStorage.removeItem("createList");
        
        setTimeout(() => {
          setIsCreating(false);
          setShowConfetti(true);
          setTimeout(() => setShowContent(true), 100);
          setTimeout(() => setShowConfetti(false), 4000);
        }, 800);

      } catch (error: any) {
        console.error('[CreateList] Error:', error);
        console.error('[CreateList] Error type:', typeof error);
        console.error('[CreateList] Error message:', error?.message);
        console.error('[CreateList] Error code:', error?.code);
        console.error('[CreateList] Error details:', error?.details);
        console.error('[CreateList] Error hint:', error?.hint);
        
        const errorMessage = error?.message || error?.code || error?.details || 'Error desconocido';
        toast.error(
          language === 'es' 
            ? `Error: ${errorMessage}` 
            : `Error: ${errorMessage}`
        );
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
    <div className="min-h-screen bg-gray-50 pb-8 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#FF9900', '#1ABC9C', '#EC4899', '#3B82F6', '#22C55E', '#FFB800']}
        />
      )}
      
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
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF9900] to-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
            <PartyPopper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A3E5C] mb-2">
            {language === 'es' ? '¡LISTA CREADA!' : 'LIST CREATED!'}
          </h1>
          <p className="text-[#FF9900] font-semibold flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {language === 'es' ? '¡El ahorro comienza ahora!' : 'The savings start now!'}
          </p>
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
