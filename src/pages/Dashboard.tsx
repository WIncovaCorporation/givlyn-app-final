import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Calendar, Plus, Search, List, User, Home, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SkipToContent } from "@/components/SkipToContent";
import { ProfileMenu } from "@/components/ProfileMenu";
import Footer from "@/components/Footer";
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

  const trendingCategories = useMemo(() => [
    { id: 1, name: language === 'es' ? 'Electrónica' : 'Electronics', emoji: '📱', discount: '25%' },
    { id: 2, name: language === 'es' ? 'Hogar' : 'Home', emoji: '🏠', discount: '30%' },
    { id: 3, name: language === 'es' ? 'Moda' : 'Fashion', emoji: '👗', discount: '40%' },
    { id: 4, name: language === 'es' ? 'Juguetes' : 'Toys', emoji: '🧸', discount: '35%' },
    { id: 5, name: language === 'es' ? 'Deportes' : 'Sports', emoji: '⚽', discount: '20%' },
    { id: 6, name: language === 'es' ? 'Belleza' : 'Beauty', emoji: '💄', discount: '45%' },
  ], [language]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <SkipToContent />
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src="/givlyn-logo.png" 
              alt="Givlyn" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
          </a>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            {user && <ProfileMenu user={user} />}
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'es' ? '¡Hola' : 'Hello'}, {userName}! 👋
          </h1>
          <p className="text-gray-500">
            {language === 'es' ? '¿Qué quieres hacer hoy?' : 'What do you want to do today?'}
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          <Button 
            onClick={() => navigate("/lists")}
            size="lg"
            className="w-full py-8 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className="w-6 h-6 mr-3" />
            {language === 'es' ? 'CREAR NUEVA LISTA' : 'CREATE NEW LIST'}
          </Button>

          <Button 
            onClick={() => navigate("/marketplace")}
            size="lg"
            variant="outline"
            className="w-full py-8 text-lg font-bold border-2 border-green-500 text-green-600 hover:bg-green-50"
          >
            <Search className="w-6 h-6 mr-3" />
            {language === 'es' ? 'BUSCAR REGALO INTELIGENTE' : 'SMART GIFT SEARCH'}
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              📋 {language === 'es' ? 'Mis Listas' : 'My Lists'}
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
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="py-8 text-center">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-500 mb-4">
                  {language === 'es' 
                    ? 'Tu dashboard está listo. ¡Crea tu primera lista!' 
                    : 'Your dashboard is ready. Create your first list!'}
                </p>
                <Button onClick={() => navigate("/lists")} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Crear Lista' : 'Create List'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myLists.map((list) => (
                <Card 
                  key={list.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
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

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            🔥 {language === 'es' ? 'Tendencias' : 'Trending'}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {trendingCategories.map((category) => (
              <div 
                key={category.id}
                onClick={() => navigate("/marketplace")}
                className="flex-shrink-0 w-24 bg-white rounded-xl p-4 text-center cursor-pointer hover:shadow-md transition-shadow border"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <div className="text-xs font-medium text-gray-800 truncate">{category.name}</div>
                <div className="text-xs text-green-600 font-bold">-{category.discount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center border">
            <div className="text-2xl font-bold text-primary">{stats.myLists}</div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Listas' : 'Lists'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <div className="text-2xl font-bold text-primary">{stats.myGroups}</div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Grupos' : 'Groups'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <div className="text-2xl font-bold text-green-600">${stats.totalSaved}</div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Ahorrado' : 'Saved'}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>
      </main>

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
