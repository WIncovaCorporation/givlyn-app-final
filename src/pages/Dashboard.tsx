import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Users, Plus, Search, List, Home, ClipboardList, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface GiftList {
  id: string;
  name: string;
  created_at: string;
  item_count?: number;
}

const listBackgrounds = [
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
  "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400&q=80",
];

const trendingStores = [
  { name: "Amazon" },
  { name: "Walmart" },
  { name: "Target" },
  { name: "Etsy" },
  { name: "eBay" },
  { name: "Best Buy" },
  { name: "Nike" },
  { name: "Apple" },
];

const eventCategories = [
  { id: "birthday", nameEs: "Cumpleanos", nameEn: "Birthday", gradient: "from-pink-500 to-rose-500" },
  { id: "wedding", nameEs: "Boda", nameEn: "Wedding", gradient: "from-amber-400 to-orange-500" },
  { id: "baby-shower", nameEs: "Baby Shower", nameEn: "Baby Shower", gradient: "from-sky-400 to-blue-500" },
  { id: "holidays", nameEs: "Fiestas", nameEn: "Holidays", gradient: "from-emerald-500 to-green-600" },
  { id: "graduation", nameEs: "Graduacion", nameEn: "Graduation", gradient: "from-violet-500 to-purple-600" },
  { id: "anniversary", nameEs: "Aniversario", nameEn: "Anniversary", gradient: "from-red-500 to-rose-600" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [myLists, setMyLists] = useState<GiftList[]>([]);
  const [stats, setStats] = useState({ myLists: 0, myGroups: 0, totalSaved: 0 });
  
  const trendsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const amount = 300;
      ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }

        if (mounted) setUser(session.user);
        const userId = session.user.id;

        const { data: lists } = await supabase
          .from("gift_lists")
          .select("id")
          .eq("user_id", userId)
          .limit(1);

        const hasLists = lists && lists.length > 0;
        const onboardingCompleted = session.user.user_metadata?.onboarding_completed;

        if (!hasLists && !onboardingCompleted) {
          navigate("/onboarding/welcome");
          return;
        }

        const [listsResult, statsResult] = await Promise.all([
          supabase
            .from("gift_lists")
            .select("id, name, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("gift_lists")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
        ]);

        if (mounted) {
          setMyLists(listsResult.data?.map(list => ({ ...list, item_count: 0 })) || []);
          setStats({
            myLists: statsResult.count || 0,
            myGroups: 0,
            totalSaved: 0,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else if (mounted) {
        setUser(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <LoadingSpinner message={t("dashboard.loading")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A3E5C] mb-2">
            {language === 'es' ? `Hola, ${userName}` : `Hi, ${userName}`}
          </h1>
          <p className="text-gray-500 text-lg">
            {language === 'es' ? 'Que regalo encontramos hoy?' : 'What gift shall we find today?'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => navigate("/create-list/step-1")}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#FF9900] to-[#FF7700] text-white text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-1">
                  {language === 'es' ? 'Crear Nueva Lista' : 'Create New List'}
                </h3>
                <p className="text-white/80 text-sm">
                  {language === 'es' ? 'Empieza a organizar tus regalos' : 'Start organizing your gifts'}
                </p>
              </div>
              <ChevronRight className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          <button 
            onClick={() => navigate("/search")}
            className="group p-6 rounded-2xl bg-white border-2 border-[#1ABC9C] text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A3E5C] mb-1">
                  {language === 'es' ? 'Encontrar Regalo con IA' : 'Find Gift with AI'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {language === 'es' ? 'Amazon, Walmart, eBay y mas' : 'Amazon, Walmart, eBay and more'}
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#1ABC9C] group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* Quick Search Categories */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-3">
            {language === 'es' ? 'Busquedas rapidas' : 'Quick searches'}
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => navigate("/search?q=cumpleanos")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/5 transition-colors"
            >
              <Gift className="w-4 h-4 text-[#1ABC9C]" />
              <span className="text-[#1A3E5C] font-medium">
                {language === 'es' ? 'Regalos para Cumpleanos' : 'Birthday Gifts'}
              </span>
            </button>
            <button 
              onClick={() => navigate("/search?q=popular")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/5 transition-colors"
            >
              <span className="text-[#1ABC9C]">~</span>
              <span className="text-[#1A3E5C] font-medium">
                {language === 'es' ? 'Mas Populares' : 'Most Popular'}
              </span>
            </button>
            <button 
              onClick={() => navigate("/search?q=ofertas")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/5 transition-colors"
            >
              <span className="text-[#1ABC9C]">$</span>
              <span className="text-[#1A3E5C] font-medium">
                {language === 'es' ? 'Ofertas del Dia' : 'Daily Deals'}
              </span>
            </button>
          </div>
        </div>

        {/* Trending Stores */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Tiendas Populares' : 'Popular Stores'}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => scroll(trendsRef, 'left')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1ABC9C] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scroll(trendsRef, 'right')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1ABC9C] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div ref={trendsRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none' }}>
            {trendingStores.map((store) => (
              <button
                key={store.name}
                onClick={() => navigate(`/search?store=${store.name.toLowerCase()}`)}
                className="flex-shrink-0 w-20 h-20 bg-white rounded-xl border border-gray-100 flex items-center justify-center hover:border-[#1ABC9C] hover:shadow-md transition-all"
              >
                <span className="font-semibold text-[#1A3E5C] text-xs text-center">{store.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Eventos' : 'Events'}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => scroll(eventsRef, 'left')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1ABC9C] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scroll(eventsRef, 'right')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1ABC9C] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div ref={eventsRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none' }}>
            {eventCategories.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/create-list/step-1?event=${event.id}`)}
                className={`flex-shrink-0 w-32 h-24 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center hover:shadow-lg transition-all hover:-translate-y-0.5`}
              >
                <span className="text-white font-bold text-sm text-center px-2 uppercase tracking-wide">
                  {language === 'es' ? event.nameEs : event.nameEn}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* My Lists */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1A3E5C] flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {language === 'es' ? 'Mis Listas' : 'My Lists'}
            </h2>
            {myLists.length > 0 && (
              <button onClick={() => navigate("/lists")} className="text-sm text-[#1ABC9C] font-semibold flex items-center gap-1">
                {language === 'es' ? 'Ver todas' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {myLists.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1ABC9C]/10 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#1ABC9C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A3E5C] mb-2">
                {language === 'es' ? 'Tu lista esta vacia' : 'Your list is empty'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'es' ? 'Que evento se acerca que requiera un regalo?' : "What upcoming event needs a gift?"}
              </p>
              <Button onClick={() => navigate("/create-list/step-1")} className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold px-6 py-3 h-auto rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                {language === 'es' ? 'Crear mi primera lista' : 'Create my first list'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => navigate(`/lists?id=${list.id}`)}
                  className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all text-left border border-gray-100"
                >
                  <div className="w-10 h-10 bg-[#1ABC9C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-[#1ABC9C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1A3E5C] truncate">{list.name}</h3>
                    <p className="text-sm text-gray-500">
                      {language === 'es' ? 'Lista personal' : 'Personal list'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-[#1A3E5C]">{stats.myLists}</div>
            <div className="text-xs text-gray-500">{language === 'es' ? 'Listas' : 'Lists'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-[#1A3E5C]">{stats.myGroups}</div>
            <div className="text-xs text-gray-500">{language === 'es' ? 'Grupos' : 'Groups'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-[#1ABC9C]">${stats.totalSaved}</div>
            <div className="text-xs text-gray-500">{language === 'es' ? 'Ahorrado' : 'Saved'}</div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-400 text-sm">
          {language === 'es' 
            ? 'Comparamos precios en 500+ tiendas para encontrar la mejor oferta' 
            : 'We compare prices on 500+ stores to find the best deal'}
        </p>
      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 md:hidden z-50">
        <div className="flex items-center justify-around py-3">
          <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center p-2 text-[#1ABC9C]">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{language === 'es' ? 'Inicio' : 'Home'}</span>
          </button>
          <button onClick={() => navigate("/lists")} className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors">
            <List className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Listas' : 'Lists'}</span>
          </button>
          <button onClick={() => navigate("/groups")} className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Amigos' : 'Friends'}</span>
          </button>
          <button onClick={() => navigate("/search")} className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Buscar' : 'Search'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
