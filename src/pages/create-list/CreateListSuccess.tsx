import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Share2, Loader2, Check, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Confetti from 'react-confetti';

interface ListData {
  name: string;
  event_type: string;
  access_type: string;
}

const eventTypeLabels: Record<string, { es: string; en: string }> = {
  personal_celebration: { es: "Celebracion Personal", en: "Personal Celebration" },
  holidays: { es: "Dias Festivos", en: "Holidays" },
  wedding_couple: { es: "Boda/Pareja", en: "Wedding/Couple" },
  baby_kids_family: { es: "Bebe/Ninos/Familia", en: "Baby/Kids/Family" },
  collaboration: { es: "Colaboracion", en: "Collaboration" },
  other: { es: "Otro", en: "Other" },
  birthday: { es: "Cumpleanos", en: "Birthday" },
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
  const [linkCopied, setLinkCopied] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          toast.error(language === 'es' ? 'Debes iniciar sesion' : 'You must be logged in');
          navigate("/auth");
          return;
        }

        const user = sessionData.session.user;

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
            ? 'Mira mi lista de regalos en Givlyn!' 
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

  const handleWhatsAppShare = () => {
    if (!listId) return;
    const shareUrl = `${window.location.origin}/lists/${listId}`;
    const message = language === 'es' 
      ? `Mira mi lista de regalos "${listData?.name}" en Givlyn: ${shareUrl}`
      : `Check out my gift list "${listData?.name}" on Givlyn: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyLink = async () => {
    if (!listId) return;
    const shareUrl = `${window.location.origin}/lists/${listId}`;
    await navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#1ABC9C] animate-spin mx-auto mb-6" />
          <p className="text-gray-600 text-xl font-medium">
            {language === 'es' ? 'Creando tu lista...' : 'Creating your list...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          initialVelocityY={25}
          colors={['#1ABC9C', '#FF9900', '#EC4899', '#3B82F6', '#22C55E', '#FFD700', '#8B5CF6']}
        />
      )}
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2 font-medium text-center">
            {language === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3'}
          </p>
          <Progress value={100} className="h-2" />
        </div>

        <div className={cn(
          "text-center transition-all duration-500",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="w-24 h-24 bg-gradient-to-br from-[#1ABC9C] to-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-[#1A3E5C] mb-2 tracking-tight">
            {language === 'es' 
              ? 'LISTA LISTA!' 
              : 'LIST READY!'}
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-[#FF9900] mb-6">
            {language === 'es' 
              ? 'Ahora toca lo divertido'
              : 'Now for the fun part'}
          </p>

          {listData && (
            <div 
              className="bg-white rounded-2xl p-5 mb-8 border border-gray-100 inline-block"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)' }}
            >
              <p className="font-bold text-[#1A3E5C] text-lg mb-2">"{listData.name}"</p>
              <div className="flex gap-3 text-sm justify-center">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {eventTypeLabels[listData.event_type]?.[language] || listData.event_type}
                </span>
                <span className="bg-[#1ABC9C]/10 px-3 py-1 rounded-full text-[#1ABC9C] font-medium">
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
            className="w-full py-8 text-lg md:text-xl font-black bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 rounded-2xl transition-all group"
            style={{ boxShadow: '0 12px 35px rgba(26, 188, 156, 0.35)' }}
          >
            <Gift className="w-7 h-7 mr-3" />
            {language === 'es' 
              ? 'ANADIR MI PRIMER REGALO' 
              : 'ADD MY FIRST GIFT'}
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full py-6 text-base font-bold border-2 border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-white transition-all rounded-2xl"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {language === 'es' 
              ? 'COMPARTIR LISTA Y EMPEZAR A RECIBIR' 
              : 'SHARE LIST & START RECEIVING'}
          </Button>

          <div className="pt-4">
            <p className="text-center text-sm text-gray-500 font-medium mb-4">
              {language === 'es' 
                ? 'O compartela inmediatamente por...' 
                : 'Or share it immediately via...'}
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
              
              <button
                onClick={handleCopyLink}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl",
                  linkCopied 
                    ? "bg-[#22C55E] text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-6 h-6" />
                    {language === 'es' ? 'Copiado!' : 'Copied!'}
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6" />
                    {language === 'es' ? 'Copiar Link' : 'Copy Link'}
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-center text-sm text-gray-400 hover:text-[#1A3E5C] transition-colors py-4 mt-4"
          >
            {language === 'es' ? 'Ir al Dashboard' : 'Go to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
