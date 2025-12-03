import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Share2, ArrowLeft, Loader2, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Confetti from 'react-confetti';

interface ListData {
  name: string;
  event_type: string;
  access_type: string;
}

const eventTypeLabels: Record<string, { es: string; en: string }> = {
  personal_celebration: { es: "Celebración Personal", en: "Personal Celebration" },
  holidays: { es: "Días Festivos", en: "Holidays" },
  wedding_couple: { es: "Boda/Pareja", en: "Wedding/Couple" },
  baby_kids_family: { es: "Bebé/Niños/Familia", en: "Baby/Kids/Family" },
  collaboration: { es: "Colaboración", en: "Collaboration" },
  other: { es: "Otro", en: "Other" },
  birthday: { es: "Cumpleaños", en: "Birthday" },
  christmas: { es: "Navidad", en: "Christmas" },
  wedding: { es: "Boda", en: "Wedding" },
  baby_shower: { es: "Baby Shower", en: "Baby Shower" }
};

const accessTypeLabels: Record<string, { es: string; en: string }> = {
  private: { es: "Personal", en: "Personal" },
  shared: { es: "Compartida", en: "Shared" },
  group_event: { es: "Grupo", en: "Group" },
  managed: { es: "Administrada", en: "Managed" },
  personal: { es: "Personal", en: "Personal" },
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
  const [userName, setUserName] = useState<string>("");
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

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
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user) {
          toast.error(language === 'es' ? 'Debes iniciar sesión' : 'You must be logged in');
          navigate("/auth");
          return;
        }

        const user = sessionData.session.user;
        const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
        setUserName(displayName.split(' ')[0]);

        const { data: newList, error } = await supabase
          .from('gift_lists')
          .insert({
            name: data.name,
            user_id: user.id,
            access_type: data.access_type || 'personal'
          })
          .select('id')
          .single();

        if (error) throw error;
        if (!newList) throw new Error('No list returned');

        setListId(newList.id);
        sessionStorage.removeItem("createList");
        
        setTimeout(() => {
          setIsCreating(false);
          setShowConfetti(true);
          setTimeout(() => setShowContent(true), 100);
          setTimeout(() => setShowConfetti(false), 6000);
        }, 600);

      } catch (error: any) {
        const errorMessage = error?.message || error?.code || 'Error desconocido';
        toast.error(language === 'es' ? `Error: ${errorMessage}` : `Error: ${errorMessage}`);
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
          <p className="text-gray-600 text-lg">
            {language === 'es' ? 'Creando tu lista...' : 'Creating your list...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.25}
          initialVelocityY={20}
          colors={['#FF9900', '#1ABC9C', '#EC4899', '#3B82F6', '#22C55E', '#FFB800', '#FFD700', '#FF6B6B']}
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2 font-medium">
            {language === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3'}
          </p>
          <Progress value={100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className={cn(
            "text-center md:text-left transition-all duration-500",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FF9900] via-[#FFB800] to-[#FFD700] rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 shadow-xl animate-bounce">
              <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A3E5C] mb-2">
              {language === 'es' 
                ? `¡LO LOGRASTE${userName ? `, ${userName}` : ''}!` 
                : `YOU DID IT${userName ? `, ${userName}` : ''}!`}
            </h1>
            
            <p className="text-lg md:text-xl font-semibold text-[#FF9900] mb-4">
              {language === 'es' 
                ? 'El ahorro comienza AHORA'
                : 'Savings start NOW'}
            </p>

            {listData && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 inline-block text-left">
                <p className="font-bold text-[#1A3E5C] text-lg mb-2">"{listData.name}"</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">
                    {eventTypeLabels[listData.event_type]?.[language] || listData.event_type}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">
                    {accessTypeLabels[listData.access_type]?.[language] || listData.access_type}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={cn(
            "space-y-4 transition-all duration-500 delay-200",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button
              onClick={handleAddGift}
              className="w-full py-7 md:py-8 text-lg md:text-xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FFB800] hover:from-[#FF9900]/90 hover:to-[#FFB800]/90 shadow-lg rounded-xl"
            >
              <Gift className="w-6 h-6 md:w-7 md:h-7 mr-2" />
              {language === 'es' ? 'ENCONTRAR REGALO AHORA' : 'FIND GIFT NOW'}
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full py-6 text-base font-bold border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-all rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              {language === 'es' ? 'COMPARTIR Y AHORRAR MAS' : 'SHARE & SAVE MORE'}
            </Button>

            <div className="bg-gradient-to-r from-[#1ABC9C]/10 to-[#22C55E]/10 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-[#1A3E5C]">
                {language === 'es' 
                  ? 'Invita a 3 personas y maximiza los beneficios de tu lista.'
                  : 'Invite 3 people and maximize your list benefits.'}
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-center text-sm text-gray-500 hover:text-[#1A3E5C] transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              {language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
