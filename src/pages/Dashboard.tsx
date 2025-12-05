import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Users, Plus, Search, List, Home, ClipboardList, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [myLists, setMyLists] = useState<GiftList[]>([]);
  const [stats, setStats] = useState({
    myLists: 0,
    myGroups: 0,
    totalSaved: 0,
  });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = direction === 'left' 
        ? carouselRef.current.scrollLeft - scrollAmount 
        : carouselRef.current.scrollLeft + scrollAmount;
      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: lists } = await supabase
        .from("gift_lists")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      const hasLists = lists && lists.length > 0;
      const onboardingCompleted = session.user.user_metadata?.onboarding_completed;

      if (!hasLists && !onboardingCompleted) {
        navigate("/onboarding/welcome");
        return;
      }

      await Promise.all([
        loadStats(session.user.id),
        loadMyLists(session.user.id),
      ]);
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    checkScrollButtons();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        carousel.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [myLists]);

  const loadStats = async (userId: string) => {
    try {
      const { data: lists } = await supabase
        .from("gift_lists")
        .select("id")
        .eq("user_id", userId);

      const { data: groupMembers } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId);

      let walletBalance = 0;
      try {
        const { data: walletData } = await supabase
          .from("cashback_wallet")
          .select("balance")
          .eq("user_id", userId)
          .maybeSingle();
        if (walletData) {
          walletBalance = walletData.balance || 0;
        }
      } catch (e) {
        console.log("Wallet query failed:", e);
      }

      setStats({
        myLists: lists?.length || 0,
        myGroups: groupMembers?.length || 0,
        totalSaved: walletBalance,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadMyLists = async (userId: string) => {
    try {
      const { data: lists } = await supabase
        .from("gift_lists")
        .select("id, name, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (lists) {
        const listsWithCounts = await Promise.all(
          lists.map(async (list) => {
            const { count } = await supabase
              .from("gift_items")
              .select("*", { count: "exact", head: true })
              .eq("list_id", list.id);
            
            return {
              ...list,
              item_count: count || 0
            };
          })
        );
        setMyLists(listsWithCounts);
      }
    } catch (error) {
      console.error("Error loading lists:", error);
    }
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A3E5C] mb-2">
            {language === 'es' ? `Hola, ${userName}` : `Hi, ${userName}`}
          </h1>
          <p className="text-gray-500 text-lg">
            {language === 'es' ? 'Que regalo encontramos hoy?' : 'What gift shall we find today?'}
          </p>
        </div>

        {/* Action Buttons - Large Premium Style */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <button 
            onClick={() => navigate("/create-list/step-1")}
            className="group p-8 rounded-3xl bg-gradient-to-br from-[#FF9900] to-[#FF7700] text-white text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
            style={{ boxShadow: '0 20px 50px rgba(255, 153, 0, 0.3)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {language === 'es' ? 'Crear Nueva Lista' : 'Create New List'}
                </h3>
                <p className="text-white/80 text-base">
                  {language === 'es' ? 'Empieza a organizar tus regalos' : 'Start organizing your gifts'}
                </p>
              </div>
              <ChevronRight className="w-8 h-8 opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
          </button>

          <button 
            onClick={() => navigate("/search")}
            className="group p-8 rounded-3xl bg-white border-2 border-[#1ABC9C] text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-[#1ABC9C]"
            style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-16 h-16 bg-[#1ABC9C]/10 rounded-2xl flex items-center justify-center mb-5">
                  <Search className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h3 className="text-2xl font-black text-[#1A3E5C] mb-2">
                  {language === 'es' ? 'Encontrar Regalo' : 'Find Gift'}
                </h3>
                <p className="text-gray-500 text-base">
                  {language === 'es' ? 'Amazon, Walmart, eBay y mas' : 'Amazon, Walmart, eBay and more'}
                </p>
              </div>
              <ChevronRight className="w-8 h-8 text-gray-300 group-hover:text-[#1ABC9C] group-hover:translate-x-2 transition-all" />
            </div>
          </button>
        </div>

        {/* Stats Row - Premium Cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div 
            className="bg-white rounded-2xl p-5 text-center"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)' }}
          >
            <div className="text-3xl font-bold text-[#1A3E5C] mb-1">{stats.myLists}</div>
            <div className="text-sm text-gray-500 font-medium">
              {language === 'es' ? 'Listas' : 'Lists'}
            </div>
          </div>
          <div 
            className="bg-white rounded-2xl p-5 text-center"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)' }}
          >
            <div className="text-3xl font-bold text-[#1A3E5C] mb-1">{stats.myGroups}</div>
            <div className="text-sm text-gray-500 font-medium">
              {language === 'es' ? 'Grupos' : 'Groups'}
            </div>
          </div>
          <div 
            className="bg-white rounded-2xl p-5 text-center"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)' }}
          >
            <div className="text-3xl font-bold text-[#1ABC9C] mb-1">${stats.totalSaved}</div>
            <div className="text-sm text-gray-500 font-medium">
              {language === 'es' ? 'Ahorrado' : 'Saved'}
            </div>
          </div>
        </div>

        {/* My Lists Section - Horizontal Carousel GoWish Style */}
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#1A3E5C] flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {language === 'es' ? 'Mis Listas' : 'My Lists'}
            </h2>
            {myLists.length > 0 && (
              <button 
                onClick={() => navigate("/lists")}
                className="text-sm text-[#1ABC9C] hover:text-[#1ABC9C]/80 font-semibold flex items-center gap-1"
              >
                {language === 'es' ? 'Ver todas' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {myLists.length === 0 ? (
            <div 
              className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-200"
              style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1ABC9C]/10 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#1ABC9C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A3E5C] mb-2">
                {language === 'es' ? 'Tu lista esta vacia' : 'Your list is empty'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {language === 'es' 
                  ? 'Que evento se acerca que requiera un regalo?' 
                  : "What upcoming event needs a gift?"}
              </p>
              <Button 
                onClick={() => navigate("/create-list/step-1")} 
                className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold px-6 py-3 h-auto rounded-xl"
                style={{ boxShadow: '0 8px 24px rgba(255, 153, 0, 0.25)' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === 'es' ? 'Crear mi primera lista' : 'Create my first list'}
              </Button>
            </div>
          ) : (
            <div className="relative group">
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCarousel('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#1A3E5C] hover:bg-[#1ABC9C] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Carousel Container */}
              <div 
                ref={carouselRef}
                className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {myLists.map((list, index) => (
                  <button
                    key={list.id}
                    onClick={() => navigate(`/lists?id=${list.id}`)}
                    className="group/card flex-shrink-0 w-[280px] h-[200px] rounded-2xl overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl snap-start"
                    style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)' }}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
                      style={{ 
                        backgroundImage: `url(${listBackgrounds[index % listBackgrounds.length]})`,
                      }}
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    
                    {/* Item Count Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#1A3E5C] text-sm font-bold px-3 py-1 rounded-full">
                      {list.item_count || 0}
                    </div>
                    
                    {/* List Icon */}
                    <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    
                    {/* List Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                        {list.name}
                      </h3>
                    </div>
                  </button>
                ))}
                
                {/* Add New List Card */}
                <button
                  onClick={() => navigate("/create-list/step-1")}
                  className="flex-shrink-0 w-[280px] h-[200px] rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#1ABC9C] bg-white/50 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 snap-start"
                >
                  <div className="w-14 h-14 bg-[#1ABC9C]/10 rounded-2xl flex items-center justify-center">
                    <Plus className="w-7 h-7 text-[#1ABC9C]" />
                  </div>
                  <span className="text-[#1A3E5C] font-bold">
                    {language === 'es' ? 'Nueva Lista' : 'New List'}
                  </span>
                </button>
              </div>

              {/* Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scrollCarousel('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#1A3E5C] hover:bg-[#1ABC9C] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Premium Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 md:hidden z-50">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center p-2 text-[#1ABC9C]"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{language === 'es' ? 'Inicio' : 'Home'}</span>
          </button>
          <button 
            onClick={() => navigate("/lists")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors"
          >
            <List className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Listas' : 'Lists'}</span>
          </button>
          <button 
            onClick={() => navigate("/groups")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Amigos' : 'Friends'}</span>
          </button>
          <button 
            onClick={() => navigate("/marketplace")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Buscar' : 'Search'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
