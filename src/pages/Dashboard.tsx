import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Users, Plus, Search, List, Home, ClipboardList, Calendar, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface GiftList {
  id: string;
  name: string;
  created_at: string;
  event_type?: string;
  access_type?: string;
  item_count?: number;
}

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

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

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
        .select("id, name, created_at, event_type, access_type")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6);

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

  const getEventTypeLabel = (eventType?: string) => {
    const labels: Record<string, { es: string; en: string }> = {
      personal_celebration: { es: 'Celebración Personal', en: 'Personal Celebration' },
      holidays: { es: 'Días Festivos', en: 'Holidays' },
      wedding_couple: { es: 'Boda/Pareja', en: 'Wedding/Couple' },
      baby_kids_family: { es: 'Bebé/Familia', en: 'Baby/Family' },
      collaboration: { es: 'Colaboración', en: 'Collaboration' },
      other: { es: 'Otro', en: 'Other' },
    };
    return labels[eventType || '']?.[language] || (language === 'es' ? 'Lista' : 'List');
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
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A3E5C] mb-2">
            {language === 'es' ? `Hola, ${userName}` : `Hi, ${userName}`}
          </h1>
          <p className="text-gray-500 text-lg">
            {language === 'es' ? '¿Qué regalo encontramos hoy?' : 'What gift shall we find today?'}
          </p>
        </div>

        {/* Action Buttons - Premium Style */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => navigate("/create-list/step-1")}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#FF9900] to-[#FF7700] text-white text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{ boxShadow: '0 15px 40px rgba(255, 153, 0, 0.25)' }}
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
            className="group p-6 rounded-2xl bg-white border-2 border-[#1ABC9C] text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06)' }}
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
                  {language === 'es' ? 'Amazon, Walmart, eBay y más' : 'Amazon, Walmart, eBay and more'}
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#1ABC9C] group-hover:translate-x-1 transition-all" />
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

        {/* My Lists Section - GoWish Style Grid */}
        <div>
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
                {language === 'es' ? 'Tu lista está vacía' : 'Your list is empty'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {language === 'es' 
                  ? '¿Qué evento se acerca que requiera un regalo?' 
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
            <div className="grid md:grid-cols-2 gap-5">
              {myLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => navigate(`/lists?id=${list.id}`)}
                  className="group bg-white rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1ABC9C]/20 to-[#1ABC9C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-7 h-7 text-[#1ABC9C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1A3E5C] text-lg mb-1 truncate group-hover:text-[#1ABC9C] transition-colors">
                        {list.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {getEventTypeLabel(list.event_type)}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          {list.item_count || 0} {language === 'es' ? 'items' : 'items'}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(list.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1ABC9C] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                  </div>
                </button>
              ))}
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
