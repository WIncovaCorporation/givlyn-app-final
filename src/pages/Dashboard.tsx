import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Plus, Search, List, Home, ClipboardList } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface GiftList {
  id: string;
  name: string;
  created_at: string;
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
        .select("id, name, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      setMyLists(lists || []);
    } catch (error) {
      console.error("Error loading lists:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message={t("dashboard.loading")} />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {language === 'es' ? `¡Hola, ${userName}! ¿Qué regalo encontramos hoy?` : `Hi ${userName}! What gift shall we find today?`}
          </h1>
        </div>

        <div className="grid gap-4 mb-8">
          <Button 
            onClick={() => navigate("/lists")}
            size="lg"
            className="w-full py-6 text-base font-semibold bg-[#FF9900] hover:bg-[#FF9900]/90 shadow-md btn-hover-glow transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            {language === 'es' ? 'Crear Nueva Lista' : 'Create New List'}
          </Button>

          <Button 
            onClick={() => navigate("/search")}
            size="lg"
            variant="outline"
            className="w-full py-6 text-base font-semibold border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C] transition-all"
          >
            <Search className="w-5 h-5 mr-2" />
            {language === 'es' ? 'Encontrar Regalo con IA' : 'Find Gift with AI'}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-1">
            {language === 'es' 
              ? 'Asistente transparente que te ayuda a descubrir regalos en Amazon, Walmart, eBay' 
              : 'Transparent assistant helping you discover gifts on Amazon, Walmart, eBay'}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#1A3E5C]" />
              {language === 'es' ? 'Mis Listas' : 'My Lists'}
            </h2>
            {myLists.length > 0 && (
              <button 
                onClick={() => navigate("/lists")}
                className="text-sm text-primary hover:underline"
              >
                {language === 'es' ? 'Ver todas' : 'View all'}
              </button>
            )}
          </div>

          {myLists.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#1ABC9C] icon-hover-lift" />
                </div>
                <p className="text-gray-600 mb-1 font-medium">
                  {language === 'es' 
                    ? 'Tu lista está vacía' 
                    : 'Your list is empty'}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {language === 'es' 
                    ? 'Empecemos: ¿qué evento se acerca que requiera un regalo?' 
                    : "Let's start: what upcoming event needs a gift?"}
                </p>
                <Button onClick={() => navigate("/lists")} className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Crear mi primera lista' : 'Create my first list'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myLists.map((list) => (
                <Card 
                  key={list.id}
                  className="cursor-pointer card-hover-lift"
                  onClick={() => navigate(`/lists`)}
                >
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{list.name}</h3>
                        <p className="text-sm text-gray-500">
                          {language === 'es' ? 'Lista personal' : 'Personal list'}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="text-xl font-bold text-[#1A3E5C]">{stats.myLists}</div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Listas' : 'Lists'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="text-xl font-bold text-[#1A3E5C]">{stats.myGroups}</div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Grupos' : 'Groups'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="text-xl font-bold text-[#1ABC9C]">${stats.totalSaved}</div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Ahorrado' : 'Saved'}
            </div>
          </div>
        </div>

      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center p-2 text-primary"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Inicio' : 'Home'}</span>
          </button>
          <button 
            onClick={() => navigate("/lists")}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-primary"
          >
            <List className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Listas' : 'Lists'}</span>
          </button>
          <button 
            onClick={() => navigate("/groups")}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-primary"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">{language === 'es' ? 'Amigos' : 'Friends'}</span>
          </button>
          <button 
            onClick={() => navigate("/marketplace")}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-primary"
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
