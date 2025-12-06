import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Users, Plus, Sparkles, List, Home, ChevronRight, ChevronLeft, Calendar, TrendingUp, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AmazonLogo, WalmartLogo, TargetLogo, EtsyLogo, EbayLogo, BestBuyLogo, HomeDepotLogo, NikeLogo, AdidasLogo } from "@/components/StoreLogos";
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

const trendingProducts = [
  { id: 1, name: "AirPods Pro 2", price: "$249", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&q=80", discount: "-15%" },
  { id: 2, name: "Stanley Tumbler", price: "$45", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80", discount: "-20%" },
  { id: 3, name: "Kindle Paperwhite", price: "$139", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80", discount: "-25%" },
  { id: 4, name: "Dyson Airwrap", price: "$599", image: "https://images.unsplash.com/photo-1522338242042-2d1c27096969?w=300&q=80", discount: "" },
  { id: 5, name: "Lego Set Architecture", price: "$129", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&q=80", discount: "-10%" },
  { id: 6, name: "Nintendo Switch", price: "$299", image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&q=80", discount: "" },
];

const upcomingEvents = [
  { id: 1, name: "Navidad", nameEn: "Christmas", date: "25 Dic", color: "from-red-500 to-green-600", template: "navidad" },
  { id: 2, name: "Dia de San Valentin", nameEn: "Valentine's Day", date: "14 Feb", color: "from-pink-500 to-red-500", template: "san-valentin" },
  { id: 3, name: "Dia de la Madre", nameEn: "Mother's Day", date: "11 May", color: "from-purple-500 to-pink-500", template: "dia-madre" },
  { id: 4, name: "Graduaciones", nameEn: "Graduations", date: "May-Jun", color: "from-blue-600 to-indigo-600", template: "graduacion" },
  { id: 5, name: "Dia del Padre", nameEn: "Father's Day", date: "15 Jun", color: "from-blue-500 to-cyan-500", template: "dia-padre" },
  { id: 6, name: "Bodas", nameEn: "Weddings", date: "Todo el ano", color: "from-amber-400 to-orange-500", template: "boda" },
];

const affiliateStores = [
  { name: "Amazon", url: "https://www.amazon.com/?tag=givlyn-20", Logo: AmazonLogo },
  { name: "Walmart", url: "https://www.walmart.com/?affiliates_ad_id=givlyn", Logo: WalmartLogo },
  { name: "Target", url: "https://www.target.com/?ref=givlyn", Logo: TargetLogo },
  { name: "eBay", url: "https://www.ebay.com/?campid=givlyn", Logo: EbayLogo },
  { name: "Best Buy", url: "https://www.bestbuy.com/?ref=givlyn", Logo: BestBuyLogo },
  { name: "Etsy", url: "https://www.etsy.com/?ref=givlyn", Logo: EtsyLogo },
  { name: "Home Depot", url: "https://www.homedepot.com/?ref=givlyn", Logo: HomeDepotLogo },
  { name: "Nike", url: "https://www.nike.com/?ref=givlyn", Logo: NikeLogo },
  { name: "Adidas", url: "https://www.adidas.com/?ref=givlyn", Logo: AdidasLogo },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [myLists, setMyLists] = useState<GiftList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stats, setStats] = useState({
    myLists: 0,
    myGroups: 0,
    totalSaved: 0,
  });
  const listsCarouselRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [canScrollListsLeft, setCanScrollListsLeft] = useState(false);
  const [canScrollListsRight, setCanScrollListsRight] = useState(false);

  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  const filteredLists = myLists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestions = searchQuery.length > 0 
    ? myLists.filter(list => 
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const checkScrollButtons = () => {
    if (listsCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listsCarouselRef.current;
      setCanScrollListsLeft(scrollLeft > 0);
      setCanScrollListsRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      const newScrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      ref.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleSuggestionClick = (listId: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(`/lists?id=${listId}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].id);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
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

        const [listsResult, statsResult, groupsResult] = await Promise.all([
          supabase
            .from("gift_lists")
            .select("id, name, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(20),
          supabase
            .from("gift_lists")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId),
          supabase
            .from("group_members")
            .select("group_id", { count: "exact", head: true })
            .eq("user_id", userId)
        ]);

        if (mounted) {
          setMyLists(listsResult.data?.map(list => ({ ...list, item_count: 0 })) || []);
          setStats({
            myLists: statsResult.count || 0,
            myGroups: groupsResult.count || 0,
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

  useEffect(() => {
    checkScrollButtons();
    const carousel = listsCarouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        carousel.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [myLists]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEventClick = (template: string, eventName: string) => {
    navigate(`/create-list/step-1?template=${template}&name=${encodeURIComponent(eventName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <LoadingSpinner message={t("dashboard.loading")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* HERO SECTION - More breathing room */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A3E5C] mb-2">
            {language === 'es' ? `Hola, ${userName}` : `Hi, ${userName}`}
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            {language === 'es' ? '¿Que regalo o lista creamos hoy?' : 'What gift or list shall we create today?'}
          </p>
        </div>

        {/* CTAs - Side by Side Desktop, Stacked Mobile */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <button 
            onClick={() => navigate("/create-list/step-1")}
            className="group p-6 rounded-2xl bg-[#FF9900] text-white text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {language === 'es' ? 'CREAR NUEVA LISTA' : 'CREATE NEW LIST'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === 'es' ? 'Empieza a organizar tus regalos' : 'Start organizing your gifts'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          <button 
            onClick={() => navigate("/search")}
            className="group p-6 rounded-2xl bg-white border border-gray-200 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#1ABC9C]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#1ABC9C]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A3E5C]">
                    {language === 'es' ? 'ASISTENTE DE COMPRAS' : 'SHOPPING ASSISTANT'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {language === 'es' ? 'Encuentra el regalo perfecto con IA' : 'Find the perfect gift with AI'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#1ABC9C] group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* MIS LISTAS - STATIC CAROUSEL with Autocomplete Search */}
        <div className="relative mb-14">
          {/* Header with Title + Total */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#1A3E5C]" />
              <h2 className="text-xl font-bold text-[#1A3E5C]">
                {language === 'es' ? 'Mis Listas' : 'My Lists'}
              </h2>
              <span className="text-sm text-gray-400 font-medium">
                ({stats.myLists} {language === 'es' ? 'creadas' : 'created'})
              </span>
            </div>
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

          {/* Autocomplete Search Bar */}
          {myLists.length > 3 && (
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={language === 'es' ? 'Buscar lista...' : 'Search list...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
              />
              
              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {suggestions.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => handleSuggestionClick(list.id)}
                      className="w-full px-4 py-3 text-left hover:bg-[#1ABC9C]/5 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <Gift className="w-4 h-4 text-[#1ABC9C]" />
                      <span className="text-[#1A3E5C] font-medium">{list.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {myLists.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#1ABC9C]/10 rounded-xl flex items-center justify-center">
                <Gift className="w-7 h-7 text-[#1ABC9C]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A3E5C] mb-2">
                {language === 'es' ? 'Tu lista esta vacia' : 'Your list is empty'}
              </h3>
              <p className="text-gray-500 mb-5 text-sm">
                {language === 'es' 
                  ? 'Crea tu primera lista para empezar' 
                  : 'Create your first list to get started'}
              </p>
              <Button 
                onClick={() => navigate("/create-list/step-1")} 
                className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-semibold px-5 py-2.5 h-auto rounded-xl text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Crear mi primera lista' : 'Create my first list'}
              </Button>
            </div>
          ) : (
            <div className="relative group">
              {canScrollListsLeft && (
                <button
                  onClick={() => scrollCarousel(listsCarouselRef, 'left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1A3E5C] hover:bg-[#1ABC9C] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div 
                ref={listsCarouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredLists.map((list, index) => (
                  <button
                    key={list.id}
                    onClick={() => navigate(`/lists?id=${list.id}`)}
                    className="group/card flex-shrink-0 w-[240px] h-[170px] rounded-2xl overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl snap-start"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-105"
                      style={{ backgroundImage: `url(${listBackgrounds[index % listBackgrounds.length]})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute top-3 right-3 bg-white/90 text-[#1A3E5C] text-xs font-bold px-2.5 py-1 rounded-full">
                      {list.item_count || 0}
                    </div>
                    <div className="absolute top-3 left-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
                        {list.name}
                      </h3>
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => navigate("/create-list/step-1")}
                  className="flex-shrink-0 w-[240px] h-[170px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1ABC9C] bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 snap-start"
                >
                  <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-[#1ABC9C]" />
                  </div>
                  <span className="text-[#1A3E5C] font-semibold">
                    {language === 'es' ? 'Nueva Lista' : 'New List'}
                  </span>
                </button>
              </div>

              {canScrollListsRight && (
                <button
                  onClick={() => scrollCarousel(listsCarouselRef, 'right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1A3E5C] hover:bg-[#1ABC9C] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* TENDENCIAS - STATIC CAROUSEL (user controlled) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-[#FF9900]" />
            <h2 className="text-xl font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Tendencias del Momento' : 'Trending Now'}
            </h2>
          </div>
          
          <div 
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[170px] bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="relative h-[130px]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {product.discount}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-[#1A3E5C] line-clamp-1">{product.name}</h4>
                  <p className="text-[#1ABC9C] font-bold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MARCAS - CSS MARQUEE (Smooth, no JS) */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-[#1A3E5C] mb-5">
            {language === 'es' ? 'Compra en tus tiendas favoritas' : 'Shop at your favorite stores'}
          </h2>
          
          <div className="overflow-hidden py-4">
            <div className="flex items-center gap-12 animate-marquee-smooth">
              {[...affiliateStores, ...affiliateStores].map((store, index) => (
                <a
                  key={`${store.name}-${index}`}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <store.Logo height={28} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* EVENTOS - STATIC CAROUSEL (User Controls) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Proximos Eventos y Festividades' : 'Upcoming Events & Holidays'}
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {upcomingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventClick(event.template, language === 'es' ? event.name : event.nameEn)}
                className={`flex-shrink-0 w-[180px] h-[110px] rounded-2xl bg-gradient-to-br ${event.color} p-4 text-white text-left hover:shadow-xl hover:-translate-y-1 transition-all`}
              >
                <h4 className="font-bold text-base line-clamp-1 mb-1">
                  {language === 'es' ? event.name : event.nameEn}
                </h4>
                <p className="text-white/80 text-sm">{event.date}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 md:hidden z-50">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center p-2 text-[#1ABC9C]"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">{language === 'es' ? 'Inicio' : 'Home'}</span>
          </button>
          <button 
            onClick={() => navigate("/lists")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors"
          >
            <List className="w-6 h-6" />
            <span className="text-[10px] mt-1">{language === 'es' ? 'Listas' : 'Lists'}</span>
          </button>
          <button 
            onClick={() => navigate("/groups")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors"
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] mt-1">{language === 'es' ? 'Amigos' : 'Friends'}</span>
          </button>
          <button 
            onClick={() => navigate("/search")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#1ABC9C] transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] mt-1">{language === 'es' ? 'IA' : 'AI'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
