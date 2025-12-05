import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Users, Plus, Search, List, Home, ClipboardList, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
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
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", bg: "#FF9900" },
  { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", bg: "#111" },
  { name: "Target", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg", bg: "#CC0000" },
  { name: "Walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg", bg: "#0071CE" },
  { name: "Sephora", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Sephora_logo.svg", bg: "#000" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", bg: "#555" },
  { name: "Best Buy", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg", bg: "#0046BE" },
  { name: "Etsy", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg", bg: "#F16521" },
];

const eventCategories = [
  { 
    id: "birthday", 
    nameEs: "Cumpleanos", 
    nameEn: "Birthday",
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80",
    gradient: "from-pink-500 to-rose-500"
  },
  { 
    id: "wedding", 
    nameEs: "Boda", 
    nameEn: "Wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    gradient: "from-amber-400 to-orange-500"
  },
  { 
    id: "baby-shower", 
    nameEs: "Baby Shower", 
    nameEn: "Baby Shower",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80",
    gradient: "from-sky-400 to-blue-500"
  },
  { 
    id: "holidays", 
    nameEs: "Fiestas", 
    nameEn: "Holidays",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600&q=80",
    gradient: "from-emerald-500 to-green-600"
  },
  { 
    id: "graduation", 
    nameEs: "Graduacion", 
    nameEn: "Graduation",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    gradient: "from-violet-500 to-purple-600"
  },
  { 
    id: "anniversary", 
    nameEs: "Aniversario", 
    nameEn: "Anniversary",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
    gradient: "from-red-500 to-rose-600"
  },
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
  
  const trendsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement>(null);
  
  const [trendsScroll, setTrendsScroll] = useState({ left: false, right: true });
  const [eventsScroll, setEventsScroll] = useState({ left: false, right: true });
  const [listsScroll, setListsScroll] = useState({ left: false, right: true });

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

  const checkScroll = (ref: React.RefObject<HTMLDivElement>, setter: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setter({
        left: scrollLeft > 10,
        right: scrollLeft < scrollWidth - clientWidth - 10
      });
    }
  };

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right', amount = 300) => {
    if (ref.current) {
      const newScrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - amount 
        : ref.current.scrollLeft + amount;
      ref.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
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
    const setupScrollListeners = () => {
      checkScroll(trendsRef, setTrendsScroll);
      checkScroll(eventsRef, setEventsScroll);
      checkScroll(listsRef, setListsScroll);
    };
    
    setupScrollListeners();
    window.addEventListener('resize', setupScrollListeners);
    
    return () => window.removeEventListener('resize', setupScrollListeners);
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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FAFBFC] to-[#F5F7FA] pb-24 md:pb-8">
      {/* Hero Search Section - Google Style */}
      <div className="bg-gradient-to-br from-[#1A3E5C] via-[#2A5070] to-[#1ABC9C] pt-8 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome */}
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            {language === 'es' ? `Hola, ${userName}` : `Hi, ${userName}`}
          </h1>
          <p className="text-white/80 text-lg mb-8">
            {language === 'es' ? 'Encuentra el regalo perfecto al mejor precio' : 'Find the perfect gift at the best price'}
          </p>
          
          {/* Search Bar - Google Style */}
          <button
            onClick={() => navigate("/search")}
            className="w-full max-w-2xl mx-auto bg-white rounded-full px-6 py-4 flex items-center gap-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-400 text-lg text-left flex-1">
              {language === 'es' ? 'Buscar regalo con IA...' : 'Search gift with AI...'}
            </span>
            <div className="bg-[#1ABC9C] text-white px-5 py-2.5 rounded-full font-semibold text-sm group-hover:bg-[#16A085] transition-colors">
              {language === 'es' ? 'Buscar' : 'Search'}
            </div>
          </button>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.myLists}</div>
              <div className="text-white/70 text-sm">{language === 'es' ? 'Listas' : 'Lists'}</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.myGroups}</div>
              <div className="text-white/70 text-sm">{language === 'es' ? 'Grupos' : 'Groups'}</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFD700]">${stats.totalSaved}</div>
              <div className="text-white/70 text-sm">{language === 'es' ? 'Ahorrado' : 'Saved'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => navigate("/create-list/step-1")}
            className="group bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF9900] to-[#FF7700] rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#1A3E5C] text-lg mb-1">
              {language === 'es' ? 'Crear Lista' : 'Create List'}
            </h3>
            <p className="text-gray-500 text-sm">
              {language === 'es' ? 'Organiza tus regalos' : 'Organize your gifts'}
            </p>
          </button>

          <button 
            onClick={() => navigate("/lists")}
            className="group bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-xl flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#1A3E5C] text-lg mb-1">
              {language === 'es' ? 'Mis Listas' : 'My Lists'}
            </h3>
            <p className="text-gray-500 text-sm">
              {stats.myLists} {language === 'es' ? 'listas creadas' : 'lists created'}
            </p>
          </button>
        </div>

        {/* Trending Stores Carousel */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Tiendas Populares' : 'Popular Stores'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { scroll(trendsRef, 'left'); setTimeout(() => checkScroll(trendsRef, setTrendsScroll), 300); }}
                disabled={!trendsScroll.left}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  trendsScroll.left ? 'border-gray-300 hover:border-[#1ABC9C] hover:text-[#1ABC9C]' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => { scroll(trendsRef, 'right'); setTimeout(() => checkScroll(trendsRef, setTrendsScroll), 300); }}
                disabled={!trendsScroll.right}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  trendsScroll.right ? 'border-gray-300 hover:border-[#1ABC9C] hover:text-[#1ABC9C]' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={trendsRef}
            onScroll={() => checkScroll(trendsRef, setTrendsScroll)}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingStores.map((store) => (
              <button
                key={store.name}
                onClick={() => navigate(`/search?store=${store.name.toLowerCase()}`)}
                className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-transparent hover:border-[#1ABC9C] transition-all duration-300 hover:-translate-y-1 group"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              >
                <span className="font-bold text-[#1A3E5C] text-sm text-center px-2">
                  {store.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Events Carousel - GoWish Style */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Eventos' : 'Events'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { scroll(eventsRef, 'left'); setTimeout(() => checkScroll(eventsRef, setEventsScroll), 300); }}
                disabled={!eventsScroll.left}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  eventsScroll.left ? 'border-gray-300 hover:border-[#1ABC9C] hover:text-[#1ABC9C]' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => { scroll(eventsRef, 'right'); setTimeout(() => checkScroll(eventsRef, setEventsScroll), 300); }}
                disabled={!eventsScroll.right}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  eventsScroll.right ? 'border-gray-300 hover:border-[#1ABC9C] hover:text-[#1ABC9C]' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={eventsRef}
            onScroll={() => checkScroll(eventsRef, setEventsScroll)}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {eventCategories.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/create-list/step-1?event=${event.id}`)}
                className="flex-shrink-0 w-40 h-48 rounded-2xl overflow-hidden relative group transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} opacity-70`} />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-white font-bold text-lg uppercase tracking-wide drop-shadow-lg">
                    {language === 'es' ? event.nameEs : event.nameEn}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* My Lists Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#1A3E5C] flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {language === 'es' ? 'Mis Listas' : 'My Lists'}
            </h2>
            {myLists.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate("/lists")}
                  className="text-sm text-[#1ABC9C] hover:text-[#16A085] font-semibold flex items-center gap-1"
                >
                  {language === 'es' ? 'Ver todas' : 'View all'}
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { scroll(listsRef, 'left'); setTimeout(() => checkScroll(listsRef, setListsScroll), 300); }}
                  disabled={!listsScroll.left}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    listsScroll.left ? 'border-gray-300 hover:border-[#1ABC9C] hover:text-[#1ABC9C]' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { scroll(listsRef, 'right'); setTimeout(() => checkScroll(listsRef, setListsScroll), 300); }}
                  disabled={!listsScroll.right}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    listsScroll.right ? 'border-gray-300 hover:border-[#1ABC9C] hover:text-[#1ABC9C]' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {myLists.length === 0 ? (
            <div 
              className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200"
              style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#1ABC9C]/20 to-[#16A085]/20 rounded-3xl flex items-center justify-center">
                <Gift className="w-10 h-10 text-[#1ABC9C]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A3E5C] mb-3">
                {language === 'es' ? 'Crea tu primera lista' : 'Create your first list'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                {language === 'es' 
                  ? 'Organiza tus regalos para cualquier ocasion y comparte con familiares y amigos' 
                  : 'Organize your gifts for any occasion and share with family and friends'}
              </p>
              <Button 
                onClick={() => navigate("/create-list/step-1")} 
                className="bg-gradient-to-r from-[#FF9900] to-[#FF7700] hover:from-[#FF8800] hover:to-[#FF6600] text-white font-bold px-8 py-4 h-auto rounded-xl text-lg"
                style={{ boxShadow: '0 12px 30px rgba(255, 153, 0, 0.35)' }}
              >
                <Plus className="w-6 h-6 mr-2" />
                {language === 'es' ? 'Crear mi primera lista' : 'Create my first list'}
              </Button>
            </div>
          ) : (
            <div 
              ref={listsRef}
              onScroll={() => checkScroll(listsRef, setListsScroll)}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {myLists.map((list, index) => (
                <button
                  key={list.id}
                  onClick={() => navigate(`/lists?id=${list.id}`)}
                  className="group flex-shrink-0 w-[280px] h-[200px] rounded-2xl overflow-hidden relative transition-all duration-300 hover:-translate-y-2"
                  style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)' }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${listBackgrounds[index % listBackgrounds.length]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#1A3E5C] text-sm font-bold px-3 py-1.5 rounded-full">
                    {list.item_count || 0} {language === 'es' ? 'items' : 'items'}
                  </div>
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                      {list.name}
                    </h3>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => navigate("/create-list/step-1")}
                className="flex-shrink-0 w-[280px] h-[200px] rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#1ABC9C] bg-white/80 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:bg-white"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#1ABC9C]/20 to-[#16A085]/20 rounded-2xl flex items-center justify-center">
                  <Plus className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <span className="text-[#1A3E5C] font-bold text-lg">
                  {language === 'es' ? 'Nueva Lista' : 'New List'}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Value Proposition */}
        <section className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl p-8 mb-8" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-center text-gray-500 text-sm">
            {language === 'es' 
              ? 'Comparamos precios en Amazon, Walmart, Target, Etsy, eBay y 500+ tiendas para encontrar la mejor oferta' 
              : 'We compare prices on Amazon, Walmart, Target, Etsy, eBay and 500+ stores to find the best deal'}
          </p>
        </section>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-lg border-t border-gray-100 md:hidden z-50">
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
            onClick={() => navigate("/search")}
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
