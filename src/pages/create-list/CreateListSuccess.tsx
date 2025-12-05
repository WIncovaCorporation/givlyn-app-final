import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Loader2, Check, Copy, ArrowRight, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Confetti from 'react-confetti';

interface ListData {
  name: string;
  event_type: string;
  access_type: string;
  list_id?: string;
  share_message?: string;
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
  const [isLoading, setIsLoading] = useState(true);
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
    const loadListData = async () => {
      const saved = sessionStorage.getItem("createList");
      
      if (!saved) {
        navigate("/create-list/step-1");
        return;
      }

      const data: ListData = JSON.parse(saved);
      setListData(data);
      
      if (data.list_id) {
        setListId(data.list_id);
        sessionStorage.removeItem("createList");
        
        setTimeout(() => {
          setIsLoading(false);
          setShowConfetti(true);
          setTimeout(() => setShowContent(true), 100);
          setTimeout(() => setShowConfetti(false), 6000);
        }, 400);
      } else {
        toast.error(language === 'es' ? 'Error: Lista no encontrada' : 'Error: List not found');
        navigate("/create-list/step-1");
      }
    };

    loadListData();
  }, [navigate, language]);

  const handleAddGift = () => {
    if (listId) {
      navigate(`/search?listId=${listId}`);
    } else {
      navigate("/search");
    }
  };

  const getShareUrl = () => `${window.location.origin}/lists/${listId}`;
  
  const getShareMessage = () => {
    if (listData?.share_message) {
      return listData.share_message;
    }
    return language === 'es' 
      ? `Mira mi lista de regalos "${listData?.name}" en Givlyn`
      : `Check out my gift list "${listData?.name}" on Givlyn`;
  };

  const handleWhatsAppShare = () => {
    if (!listId) return;
    const message = `${getShareMessage()}\n\n${getShareUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailShare = () => {
    if (!listId) return;
    const subject = language === 'es' 
      ? `Te invito a ver mi lista: ${listData?.name}`
      : `Check out my list: ${listData?.name}`;
    const body = `${getShareMessage()}\n\n${language === 'es' ? 'Ver lista aqui' : 'View list here'}: ${getShareUrl()}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleCopyLink = async () => {
    if (!listId) return;
    await navigator.clipboard.writeText(getShareUrl());
    setLinkCopied(true);
    toast.success(language === 'es' ? 'Enlace copiado' : 'Link copied');
    setTimeout(() => setLinkCopied(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#1ABC9C]/20 animate-pulse mx-auto mb-6" />
            <Loader2 className="w-12 h-12 text-[#1ABC9C] animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 text-xl font-medium">
            {language === 'es' ? 'Preparando tu lista...' : 'Preparing your list...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC] relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={600}
          gravity={0.15}
          initialVelocityY={30}
          colors={['#1ABC9C', '#FF9900', '#EC4899', '#3B82F6', '#22C55E', '#FFD700', '#8B5CF6']}
        />
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center text-sm font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div className="w-8 h-1 bg-[#1ABC9C] rounded-full" />
            <div className="w-8 h-8 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center text-sm font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div className="w-8 h-1 bg-[#1ABC9C] rounded-full" />
            <div className="w-8 h-8 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center text-sm font-bold">
              <Check className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-12">
        {/* Success Hero */}
        <div className={cn(
          "text-center mb-10 transition-all duration-700",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-[#1ABC9C] to-[#22C55E] rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#1A3E5C] mb-3 tracking-tight">
            {language === 'es' ? 'Lista Creada' : 'List Created'}
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-[#FF9900]">
            {language === 'es' ? 'Ahora toca lo divertido' : 'Now for the fun part'}
          </p>
        </div>

        {/* List Card */}
        {listData && (
          <div className={cn(
            "bg-white rounded-3xl p-6 mb-8 border border-gray-100 transition-all duration-700 delay-100",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )} style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1ABC9C]/20 to-[#22C55E]/20 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#1ABC9C]" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-[#1A3E5C] text-xl mb-1">{listData.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    {eventTypeLabels[listData.event_type]?.[language] || listData.event_type}
                  </span>
                  <span className="text-sm bg-[#1ABC9C]/10 px-3 py-1 rounded-full text-[#1ABC9C] font-medium">
                    {accessTypeLabels[listData.access_type]?.[language] || listData.access_type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <div className={cn(
          "mb-8 transition-all duration-700 delay-200",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Button
            onClick={handleAddGift}
            className="w-full h-16 text-lg font-black bg-gradient-to-r from-[#1ABC9C] to-[#22C55E] hover:from-[#1ABC9C]/90 hover:to-[#22C55E]/90 rounded-2xl transition-all group"
            style={{ boxShadow: '0 15px 40px rgba(26, 188, 156, 0.35)' }}
          >
            <Gift className="w-6 h-6 mr-3" />
            {language === 'es' ? 'AGREGAR MI PRIMER REGALO' : 'ADD MY FIRST GIFT'}
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Share Section - Unified */}
        <div className={cn(
          "bg-white rounded-3xl p-6 border border-gray-100 transition-all duration-700 delay-300",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06)' }}>
          <h3 className="text-center font-bold text-[#1A3E5C] text-lg mb-5">
            {language === 'es' ? 'Comparte tu lista' : 'Share your list'}
          </h3>
          
          {/* Share Grid - 3 options */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all group"
            >
              <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#25D366]">WhatsApp</span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#EA4335]/10 hover:bg-[#EA4335]/20 transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#EA4335] to-[#FBBC04] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#EA4335]">Email</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all group",
                linkCopied 
                  ? "bg-[#22C55E]/10" 
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all",
                linkCopied 
                  ? "bg-[#22C55E]" 
                  : "bg-[#1A3E5C]"
              )}>
                {linkCopied ? (
                  <Check className="w-7 h-7 text-white" />
                ) : (
                  <Copy className="w-7 h-7 text-white" />
                )}
              </div>
              <span className={cn(
                "text-sm font-semibold",
                linkCopied ? "text-[#22C55E]" : "text-[#1A3E5C]"
              )}>
                {linkCopied 
                  ? (language === 'es' ? 'Copiado' : 'Copied') 
                  : (language === 'es' ? 'Copiar' : 'Copy')}
              </span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            {language === 'es' 
              ? 'Comparte con amigos y familia para que sepan que regalarte' 
              : 'Share with friends and family so they know what to gift you'}
          </p>
        </div>

        {/* Dashboard Link */}
        <div className={cn(
          "text-center mt-8 transition-all duration-700 delay-400",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-400 hover:text-[#1A3E5C] transition-colors font-medium"
          >
            {language === 'es' ? 'Ir al Dashboard' : 'Go to Dashboard'}
          </button>
        </div>
      </main>
    </div>
  );
}
