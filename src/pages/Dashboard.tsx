import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Users, Plus, Sparkles, List, Home, ChevronRight, ChevronLeft, Calendar, TrendingUp, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AmazonLogo, WalmartLogo, TargetLogo, EtsyLogo, EbayLogo, BestBuyLogo, HomeDepotLogo, NikeLogo, AdidasLogo, MacysLogo, KohlsLogo, SephoraLogo, UltaLogo, LululemonLogo, NordstromLogo, ZaraLogo, HMlogo, GapLogo, CoachLogo, AppleLogo, SamsungLogo, SonyLogo, LowesLogo, CostcoLogo, WayfairLogo } from "@/components/StoreLogos";
import { X } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getTrendingProductsSync, type TrendingProduct } from "@/services/trendingService";

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

const trendingProducts: TrendingProduct[] = getTrendingProductsSync();

const upcomingEvents = [
  { id: 1, name: "Navidad", nameEn: "Christmas", date: "25 Dic", color: "from-red-500 to-green-600", template: "navidad" },
  { id: 2, name: "Dia de San Valentin", nameEn: "Valentine's Day", date: "14 Feb", color: "from-pink-500 to-red-500", template: "san-valentin" },
  { id: 3, name: "Dia de la Madre", nameEn: "Mother's Day", date: "11 May", color: "from-purple-500 to-pink-500", template: "dia-madre" },
  { id: 4, name: "Graduaciones", nameEn: "Graduations", date: "May-Jun", color: "from-blue-600 to-indigo-600", template: "graduacion" },
  { id: 5, name: "Dia del Padre", nameEn: "Father's Day", date: "15 Jun", color: "from-blue-500 to-cyan-500", template: "dia-padre" },
  { id: 6, name: "Bodas", nameEn: "Weddings", date: "Todo el ano", color: "from-amber-400 to-orange-500", template: "boda" },
];

const storeCategories = [
  { id: "all", name: "Todo", nameEn: "All" },
  { id: "fashion", name: "Moda", nameEn: "Fashion" },
  { id: "electronics", name: "Electronica", nameEn: "Electronics" },
  { id: "beauty", name: "Belleza", nameEn: "Beauty" },
  { id: "home", name: "Hogar", nameEn: "Home" },
  { id: "sports", name: "Deportes", nameEn: "Sports" },
  { id: "kids", name: "Ninos", nameEn: "Kids" },
  { id: "luxury", name: "Lujo", nameEn: "Luxury" },
];

const affiliateStores = [
  { name: "Amazon", url: "https://www.amazon.com/?tag=givlyn-20", Logo: AmazonLogo, categories: ["all", "electronics", "home", "kids"] },
  { name: "Walmart", url: "https://www.walmart.com/?affiliates_ad_id=givlyn", Logo: WalmartLogo, categories: ["all", "home", "kids", "electronics"] },
  { name: "Target", url: "https://www.target.com/?ref=givlyn", Logo: TargetLogo, categories: ["all", "home", "fashion", "kids"] },
  { name: "eBay", url: "https://www.ebay.com/?campid=givlyn", Logo: EbayLogo, categories: ["all", "electronics"] },
  { name: "Best Buy", url: "https://www.bestbuy.com/?ref=givlyn", Logo: BestBuyLogo, categories: ["all", "electronics"] },
  { name: "Etsy", url: "https://www.etsy.com/?ref=givlyn", Logo: EtsyLogo, categories: ["all", "home", "kids"] },
  { name: "Home Depot", url: "https://www.homedepot.com/?ref=givlyn", Logo: HomeDepotLogo, categories: ["all", "home"] },
  { name: "Nike", url: "https://www.nike.com/?ref=givlyn", Logo: NikeLogo, categories: ["all", "sports", "fashion"] },
  { name: "Adidas", url: "https://www.adidas.com/?ref=givlyn", Logo: AdidasLogo, categories: ["all", "sports", "fashion"] },
  { name: "Macy's", url: "https://www.macys.com/?ref=givlyn", Logo: MacysLogo, categories: ["all", "fashion", "beauty", "home"] },
  { name: "Kohl's", url: "https://www.kohls.com/?ref=givlyn", Logo: KohlsLogo, categories: ["all", "fashion", "home"] },
  { name: "Sephora", url: "https://www.sephora.com/?ref=givlyn", Logo: SephoraLogo, categories: ["all", "beauty"] },
  { name: "Ulta", url: "https://www.ulta.com/?ref=givlyn", Logo: UltaLogo, categories: ["all", "beauty"] },
  { name: "Lululemon", url: "https://www.lululemon.com/?ref=givlyn", Logo: LululemonLogo, categories: ["all", "sports", "fashion"] },
  { name: "Nordstrom", url: "https://www.nordstrom.com/?ref=givlyn", Logo: NordstromLogo, categories: ["all", "fashion", "luxury"] },
  { name: "Zara", url: "https://www.zara.com/?ref=givlyn", Logo: ZaraLogo, categories: ["all", "fashion"] },
  { name: "H&M", url: "https://www.hm.com/?ref=givlyn", Logo: HMlogo, categories: ["all", "fashion", "kids"] },
  { name: "Gap", url: "https://www.gap.com/?ref=givlyn", Logo: GapLogo, categories: ["all", "fashion", "kids"] },
  { name: "Coach", url: "https://www.coach.com/?ref=givlyn", Logo: CoachLogo, categories: ["all", "fashion", "luxury"] },
  { name: "Apple", url: "https://www.apple.com/?ref=givlyn", Logo: AppleLogo, categories: ["all", "electronics"] },
  { name: "Samsung", url: "https://www.samsung.com/?ref=givlyn", Logo: SamsungLogo, categories: ["all", "electronics"] },
  { name: "Sony", url: "https://www.sony.com/?ref=givlyn", Logo: SonyLogo, categories: ["all", "electronics"] },
  { name: "Lowe's", url: "https://www.lowes.com/?ref=givlyn", Logo: LowesLogo, categories: ["all", "home"] },
  { name: "Costco", url: "https://www.costco.com/?ref=givlyn", Logo: CostcoLogo, categories: ["all", "home", "electronics"] },
  { name: "Wayfair", url: "https://www.wayfair.com/?ref=givlyn", Logo: WayfairLogo, categories: ["all", "home"] },
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
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const storesCarouselRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  const filteredStores = affiliateStores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(storeSearch.toLowerCase());
    const matchesCategory = selectedCategory === "all" || store.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const scrollStoresCarousel = (direction: 'left' | 'right') => {
    if (storesCarouselRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? storesCarouselRef.current.scrollLeft - scrollAmount 
        : storesCarouselRef.current.scrollLeft + scrollAmount;
      storesCarouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

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
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
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
                {myLists.map((list, index) => (
                  <button
                    key={list.id}
                    onClick={() => navigate(`/lists?id=${list.id}`)}
                    className="group/card flex-shrink-0 w-[280px] sm:w-[320px] h-[200px] sm:h-[220px] rounded-2xl overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl snap-start"
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
                  className="flex-shrink-0 w-[280px] sm:w-[320px] h-[200px] sm:h-[220px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1ABC9C] bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 snap-start"
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

        {/* TENDENCIAS - GRID RESPONSIVE (optimizado para llenar espacio) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-[#FF9900]" />
            <h2 className="text-xl font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Tendencias del Momento' : 'Trending Now'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingProducts.map((product) => (
              <a
                key={product.id}
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="relative aspect-square">
                  <img 
                    src={product.imageUrl} 
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {product.discount}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-white/90 text-[10px] font-medium text-gray-600 px-2 py-0.5 rounded">
                    {product.storeName}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-[#1A3E5C] line-clamp-1">{product.productName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#1ABC9C] font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* MARCAS - CAROUSEL WITH NAVIGATION */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#1A3E5C]">
              {language === 'es' ? 'Compra en tus tiendas favoritas' : 'Shop at your favorite stores'}
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowStoresModal(true)}
                className="text-sm text-[#1ABC9C] hover:text-[#1ABC9C]/80 font-semibold"
              >
                {language === 'es' ? 'Ver todo' : 'View all'}
              </button>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => scrollStoresCarousel('left')}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1ABC9C] hover:text-[#1ABC9C] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollStoresCarousel('right')}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1ABC9C] hover:text-[#1ABC9C] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div 
            ref={storesCarouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {affiliateStores.slice(0, 12).map((store, index) => (
              <a
                key={`${store.name}-${index}`}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[100px] h-[80px] bg-white rounded-xl border border-gray-100 flex items-center justify-center hover:shadow-lg hover:border-[#1ABC9C]/30 transition-all cursor-pointer"
              >
                <store.Logo height={24} />
              </a>
            ))}
          </div>
        </div>

        {/* STORES MODAL - FULL WIDTH LIKE GOWISH */}
        {showStoresModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto pt-4 pb-4 sm:pt-8 sm:pb-8">
            <div className="bg-white rounded-2xl w-full max-w-6xl mx-2 sm:mx-4 max-h-[95vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-4 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A3E5C]">
                  {language === 'es' ? 'Todas las Tiendas' : 'All Stores'}
                </h2>
                <button
                  onClick={() => setShowStoresModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-4 sm:px-8 pt-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'es' ? 'Buscar marca...' : 'Search brand...'}
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="px-4 sm:px-8 py-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none' }}>
                  {storeCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#1ABC9C] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {language === 'es' ? cat.name : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stores Grid - LARGER CARDS LIKE GOWISH */}
              <div className="px-4 sm:px-8 pb-6 overflow-y-auto flex-1">
                <p className="text-sm text-gray-500 mb-4">
                  {language === 'es' ? 'Todo' : 'All'} ({filteredStores.length})
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
                  {filteredStores.map((store, index) => (
                    <a
                      key={`modal-${store.name}-${index}`}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-[#1ABC9C]/40 hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="h-[36px] flex items-center justify-center w-full overflow-hidden">
                        <store.Logo height={20} />
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 text-center font-medium truncate w-full">{store.name}</span>
                    </a>
                  ))}
                </div>
                {filteredStores.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    {language === 'es' ? 'No se encontraron tiendas' : 'No stores found'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                className={`flex-shrink-0 w-[150px] sm:w-[160px] h-[90px] sm:h-[100px] rounded-2xl bg-gradient-to-br ${event.color} p-3 sm:p-4 text-white text-left hover:shadow-xl hover:-translate-y-1 transition-all`}
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
