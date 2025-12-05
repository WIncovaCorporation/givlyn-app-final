import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Gift, Calendar, User, ExternalLink, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GiftList {
  id: string;
  name: string;
  slug: string;
  user_id: string;
  created_at: string;
}

interface GiftItem {
  id: string;
  name: string;
  category: string;
  color?: string;
  size?: string;
  brand?: string;
  notes?: string;
  reference_link?: string;
  image_url?: string;
  priority: string;
  is_purchased: boolean;
}

interface UserProfile {
  full_name?: string;
  avatar_url?: string;
}

export default function SharedList() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<GiftList | null>(null);
  const [items, setItems] = useState<GiftItem[]>([]);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        let foundList: GiftList | null = null;

        const { data: listBySlug } = await supabase
          .from('gift_lists')
          .select('id, name, slug, user_id, created_at')
          .eq('slug', slug)
          .maybeSingle();

        if (listBySlug) {
          foundList = listBySlug as GiftList;
        } else {
          const { data: listById } = await supabase
            .from('gift_lists')
            .select('id, name, slug, user_id, created_at')
            .eq('id', slug)
            .maybeSingle();

          if (listById) {
            foundList = listById as GiftList;
          }
        }

        if (!foundList) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setList(foundList);
        
        const { data: itemsData } = await supabase
          .from('gift_items')
          .select('id, name, category, color, size, brand, notes, reference_link, image_url, priority, is_purchased')
          .eq('list_id', foundList.id)
          .order('created_at', { ascending: false });
        
        setItems((itemsData || []) as GiftItem[]);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', foundList.user_id)
          .maybeSingle();
        
        setOwner(profileData as UserProfile | null);
      } catch (error) {
        console.error('Error fetching list:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1ABC9C] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {language === 'es' ? 'Cargando lista...' : 'Loading list...'}
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !list) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A3E5C] mb-3">404</h1>
          <p className="text-gray-600 text-lg mb-6">
            {language === 'es' 
              ? 'Esta lista no existe o ha sido eliminada' 
              : 'This list does not exist or has been deleted'}
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-3 rounded-xl"
          >
            {language === 'es' ? 'Ir al Inicio' : 'Go Home'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC]">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E5C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{language === 'es' ? 'Inicio' : 'Home'}</span>
          </button>
          <img src="/givlyn-logo.svg" alt="Givlyn" className="h-8" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 mb-8" style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08)' }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1ABC9C] to-[#22C55E] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1A3E5C] mb-2">{list.name}</h1>
              {owner?.full_name && (
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{language === 'es' ? 'Lista de' : 'List by'} {owner.full_name}</span>
                </div>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'es' 
                  ? 'Esta lista aun no tiene regalos' 
                  : 'This list has no gifts yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                    item.is_purchased 
                      ? "bg-green-50 border-green-200 opacity-75" 
                      : "bg-gray-50 border-gray-100 hover:border-[#1ABC9C]/30"
                  )}
                >
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-semibold text-lg",
                      item.is_purchased ? "line-through text-gray-500" : "text-[#1A3E5C]"
                    )}>
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.category && (
                        <span className="text-xs bg-[#1ABC9C]/10 text-[#1ABC9C] px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      )}
                      {item.brand && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {item.brand}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {item.color}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.notes}</p>
                    )}
                  </div>

                  {item.reference_link && !item.is_purchased && (
                    <a
                      href={item.reference_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#E68A00] text-white px-4 py-2 rounded-xl font-medium transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {language === 'es' ? 'Comprar' : 'Buy'}
                      </span>
                    </a>
                  )}

                  {item.is_purchased && (
                    <span className="text-green-600 font-medium text-sm flex-shrink-0">
                      {language === 'es' ? 'Comprado' : 'Purchased'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {language === 'es' 
              ? 'Crea tu propia lista de regalos' 
              : 'Create your own gift list'}
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-3 rounded-xl font-semibold"
          >
            {language === 'es' ? 'Crear mi Lista Gratis' : 'Create my Free List'}
          </Button>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <img src="/givlyn-logo.svg" alt="Givlyn" className="h-6 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Powered by Givlyn - Smart Gift Lists</p>
        </div>
      </footer>
    </div>
  );
}
