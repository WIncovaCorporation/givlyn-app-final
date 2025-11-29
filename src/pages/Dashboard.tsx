import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Calendar, Plus, MessageCircle, Package, Sparkles, Target, Flame, DollarSign, BarChart3, UserPlus, Settings } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SkipToContent } from "@/components/SkipToContent";
import { ProfileMenu } from "@/components/ProfileMenu";
import Footer from "@/components/Footer";
import { useUserRole } from "@/hooks/useUserRole";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { OnboardingTour } from "@/components/OnboardingTour";
import { WelcomeOnboarding } from "@/components/WelcomeOnboarding";
import { Progress } from "@/components/ui/progress";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isFree } = useUserRole();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFreeBanner, setShowFreeBanner] = useState(false);
  const [stats, setStats] = useState({
    myLists: 0,
    myGroups: 0,
    upcomingEvents: 0,
  });
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [progressAnimated, setProgressAnimated] = useState(0);

  const getTimeEmoji = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '🌆';
    if (hour >= 17 && hour < 21) return '🌙';
    return '🌙';
  };

  const getPredictiveInsight = () => {
    const day = new Date().getDay();
    const savings = [15, 18, 12, 20, 17, 22, 14][day];
    return language === 'es' ? `Ahorrarás ~$${savings} hoy` : `You'll save ~$${savings} today`;
  };

  const getWelcomeMessage = useMemo(() => {
    const messages = language === 'es' ? [
      'Nos alegra verte por aquí. Vamos a ayudarte a ahorrar dinero inteligentemente hoy.',
      'Tu inteligencia financiera está creciendo. Hoy haremos más ahorros juntos.',
      'Cada compra inteligente te acerca a tus metas. ¡Vamos!',
    ] : [
      'Great to see you here. Let\'s help you save money smartly today.',
      'Your financial intelligence is growing. Let\'s make more savings together.',
      'Every smart purchase brings you closer to your goals. Let\'s go!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [language]);

  const socialProof = useMemo(() => {
    const names = ['María', 'Carlos', 'Ana', 'Pedro', 'Lucia', 'Diego', 'Sofia'];
    const amounts = [45, 67, 32, 58, 41, 73, 29];
    const products = language === 'es' 
      ? ['electrodomésticos', 'ropa', 'tecnología', 'artículos del hogar', 'juguetes']
      : ['appliances', 'clothing', 'technology', 'home items', 'toys'];
    
    return {
      name: names[Math.floor(Math.random() * names.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      product: products[Math.floor(Math.random() * products.length)],
    };
  }, [language]);

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';
  const streak = 7;
  const weeklyProgress = 70;
  const totalSaved = 450;
  const nextMilestone = 23;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressAnimated(weeklyProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, [weeklyProgress]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadStats(session.user.id);
      await loadActiveAssignments(session.user.id);
      
      if (isFree()) {
        setTimeout(() => setShowFreeBanner(true), 2000);
      }
      
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
      const { data: lists, error: listsError } = await supabase
        .from("gift_lists")
        .select("id", { count: "exact" })
        .eq("user_id", userId);

      const { data: groupMembers, error: groupsError } = await supabase
        .from("group_members")
        .select("group_id", { count: "exact" })
        .eq("user_id", userId);

      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id", { count: "exact" })
        .eq("created_by", userId)
        .gte("date", new Date().toISOString().split('T')[0]);

      if (listsError || groupsError || eventsError) {
        console.error("Error loading stats:", listsError || groupsError || eventsError);
      }

      setStats({
        myLists: lists?.length || 0,
        myGroups: groupMembers?.length || 0,
        upcomingEvents: events?.length || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const loadActiveAssignments = async (userId: string) => {
    try {
      const { data: exchanges, error } = await supabase
        .from("gift_exchanges")
        .select(`
          group_id,
          receiver_id,
          groups (
            id,
            name,
            exchange_date
          )
        `)
        .eq("giver_id", userId);

      if (error) throw error;
      setActiveAssignments(exchanges || []);
    } catch (error) {
      console.error("Error loading active assignments:", error);
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
    <div className="min-h-screen bg-gray-50">
      <WelcomeOnboarding />
      <OnboardingTour />
      
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <SkipToContent />
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src="/logo.svg" 
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

      <main id="main-content" className="container mx-auto px-4 py-6 max-w-5xl">
        {showFreeBanner && (
          <div className="mb-6">
            <UpgradePrompt
              variant="banner"
              title={language === 'es' ? "¡Desbloquea todo el potencial de Givlyn!" : "Unlock Givlyn's full potential!"}
              description={language === 'es' ? "Grupos y listas ilimitados, chat anónimo y más." : "Unlimited groups, lists, anonymous chat and more."}
              feature="premium_features"
              onDismiss={() => setShowFreeBanner(false)}
            />
          </div>
        )}

        <div className="bg-gradient-to-br from-primary to-red-700 text-white p-6 md:p-10 rounded-2xl mb-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {language === 'es' ? '¡Bienvenido de Nuevo!' : 'Welcome Back!'}
              </h2>
              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-xl md:text-2xl font-bold">
                {userName.toUpperCase()}
              </div>
            </div>
            <div className="text-4xl md:text-5xl">{getTimeEmoji()}</div>
          </div>

          <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed">
            {getWelcomeMessage}
          </p>

          <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl border-l-4 border-white/50">
            <div className="text-xs uppercase tracking-wider opacity-80 mb-1">
              {language === 'es' ? '💰 Predicción Inteligente' : '💰 Smart Prediction'}
            </div>
            <div className="text-xl md:text-2xl font-bold">{getPredictiveInsight()}</div>
            <p className="text-xs opacity-80 mt-1">
              {language === 'es' 
                ? 'Basado en tu historial de compras y patrones de ahorro'
                : 'Based on your purchase history and saving patterns'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard 
            icon="💰" 
            value={`$${totalSaved}`} 
            label={language === 'es' ? 'Ahorrado Este Mes' : 'Saved This Month'} 
          />
          <StatCard 
            icon="📦" 
            value={stats.myLists.toString()} 
            label={language === 'es' ? 'Listas Activas' : 'Active Lists'} 
          />
          <StatCard 
            icon="🎯" 
            value={nextMilestone.toString()} 
            label={language === 'es' ? 'Hasta Próximo Badge' : 'To Next Badge'} 
          />
          <StatCard 
            icon="🔥" 
            value={streak.toString()} 
            label={language === 'es' ? 'Días Activos' : 'Days Active'} 
          />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'es' ? 'Mi Racha de Ahorros' : 'My Savings Streak'}
            </h3>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {streak} {language === 'es' ? 'días activo' : 'days active'} 🔥
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            {language === 'es' 
              ? 'Crear una lista de compras toma solo 30 segundos. Conviértelo en hábito.'
              : 'Creating a shopping list takes only 30 seconds. Make it a habit.'}
          </p>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{language === 'es' ? 'Progreso semanal' : 'Weekly progress'}</span>
              <span className="font-semibold">{weeklyProgress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressAnimated}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500 mb-6">
          <div className="font-bold text-gray-800 mb-1">
            {language === 'es' ? '👥 Comunidad Givlyn' : '👥 Givlyn Community'}
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-primary">{socialProof.name}</span>
            {language === 'es' 
              ? ` acaba de ahorrar $${socialProof.amount} comprando ${socialProof.product}. ¿Quieres hacerlo igual?`
              : ` just saved $${socialProof.amount} buying ${socialProof.product}. Want to do the same?`}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <ActionButton 
            onClick={() => navigate("/lists")} 
            icon={<Plus className="w-5 h-5" />}
            label={language === 'es' ? 'Crear Lista' : 'Create List'}
          />
          <ActionButton 
            onClick={() => navigate("/marketplace")} 
            icon={<BarChart3 className="w-5 h-5" />}
            label={language === 'es' ? 'Ver Reportes' : 'View Reports'}
          />
          <ActionButton 
            onClick={() => navigate("/groups")} 
            icon={<UserPlus className="w-5 h-5" />}
            label={language === 'es' ? 'Referir Amigos' : 'Refer Friends'}
          />
          <ActionButton 
            onClick={() => navigate("/settings")} 
            icon={<Settings className="w-5 h-5" />}
            label={language === 'es' ? 'Preferencias' : 'Preferences'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card 
            className="shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            onClick={() => navigate("/marketplace")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Marketplace</h3>
                  <p className="text-sm text-gray-500">
                    {language === 'es' ? 'Descubre productos recomendados' : 'Discover recommended products'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            onClick={() => navigate("/my-products")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{language === 'es' ? 'Mis Productos' : 'My Products'}</h3>
                  <p className="text-sm text-gray-500">
                    {language === 'es' ? 'Gestiona tus enlaces de afiliado' : 'Manage your affiliate links'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeAssignments.length > 0 && (
          <Card className="shadow-sm border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {t("dashboard.myAssignments")}
              </CardTitle>
              <CardDescription>{t("dashboard.myAssignmentsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAssignments.map((assignment: any) => (
                <div
                  key={assignment.group_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{assignment.groups?.name}</h4>
                    {assignment.groups?.exchange_date && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(assignment.groups.exchange_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/groups/${assignment.group_id}/assignment`)}
                    className="gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    {t("dashboard.viewAssignment")}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: string; value: string; label: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm text-center border-t-4 border-primary hover:-translate-y-1 hover:shadow-md transition-all cursor-default">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
  </div>
);

const ActionButton = ({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className="bg-white border-2 border-primary text-primary p-4 rounded-xl font-semibold hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all flex flex-col items-center gap-2 text-sm"
  >
    {icon}
    {label}
  </button>
);

export default Dashboard;
