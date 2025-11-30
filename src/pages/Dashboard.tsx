import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Calendar, Plus, MessageCircle, Package, Sparkles, Target, Flame, DollarSign, BarChart3, UserPlus, Settings, Shield, Search, ExternalLink, Download, List, Share2 } from "lucide-react";
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
  const [dashboardMetrics, setDashboardMetrics] = useState({
    loyaltyPoints: 0,
    totalSaved: 0,
    totalReunido: 0,
    friendsCoordinated: 0,
    completedLists: 0,
    streak: 0,
    weeklyProgress: 0,
  });

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
  const { loyaltyPoints, totalSaved, totalReunido, friendsCoordinated, completedLists, streak, weeklyProgress } = dashboardMetrics;
  const nextMilestone = Math.max(0, 100 - (loyaltyPoints % 100));

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressAnimated(weeklyProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, [weeklyProgress]);

  const loadDashboardMetrics = async (userId: string) => {
    try {
      let walletBalance = 0;
      let walletPoints = 0;
      try {
        const { data: walletData, error } = await supabase
          .from("cashback_wallet")
          .select("balance")
          .eq("user_id", userId)
          .maybeSingle();
        if (!error && walletData) {
          walletBalance = walletData.balance || 0;
          walletPoints = Math.round(walletBalance * 100);
        }
      } catch (e) {
        console.log("Wallet table query failed:", e);
      }

      const { data: listsData } = await supabase
        .from("gift_lists")
        .select("id, name, created_at")
        .eq("user_id", userId);

      const totalLists = listsData?.length || 0;

      const { data: groupsData } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId);

      const totalGroups = groupsData?.length || 0;

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const { data: activityData } = await supabase
        .from("gift_lists")
        .select("created_at")
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString())
        .order("created_at", { ascending: false });

      let streakCount = 0;
      if (activityData && activityData.length > 0) {
        const activityDays = new Set(
          activityData.map((a: { created_at: string }) => new Date(a.created_at).toDateString())
        );
        let checkDate = new Date();
        for (let i = 0; i < 30; i++) {
          if (activityDays.has(checkDate.toDateString())) {
            streakCount++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (streakCount > 0) {
            break;
          }
        }
      }

      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysPassed = today.getDate();
      const monthProgress = Math.min(100, Math.round((daysPassed / daysInMonth) * 100));

      setDashboardMetrics({
        loyaltyPoints: walletPoints,
        totalSaved: walletBalance,
        totalReunido: 0,
        friendsCoordinated: totalGroups,
        completedLists: 0,
        streak: streakCount,
        weeklyProgress: monthProgress,
      });
    } catch (error) {
      console.error("Error loading dashboard metrics:", error);
      setDashboardMetrics({
        loyaltyPoints: 0,
        totalSaved: 0,
        totalReunido: 0,
        friendsCoordinated: 0,
        completedLists: 0,
        streak: 0,
        weeklyProgress: 0,
      });
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
      await Promise.all([
        loadStats(session.user.id),
        loadActiveAssignments(session.user.id),
        loadDashboardMetrics(session.user.id),
      ]);
      
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

        {/* ZONA 0: HERO + TRUST */}
        <div className="bg-gradient-to-br from-primary to-red-700 text-white p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {language === 'es' ? 'Compra Inteligente con Garantía' : 'Smart Shopping with Guarantee'}
          </h2>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2 text-sm">
              <span className="text-green-300">✅</span>
              {language === 'es' ? 'Organiza regalos/compras con amigos' : 'Organize gifts/purchases with friends'}
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-green-300">✅</span>
              {language === 'es' ? 'Consigue mejor precio (comparamos 5+ tiendas)' : 'Get best price (we compare 5+ stores)'}
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-green-300">✅</span>
              {language === 'es' ? 'Compra DIRECTA en Amazon/Walmart/Tiendas' : 'Buy DIRECT from Amazon/Walmart/Stores'}
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-green-300">✅</span>
              {language === 'es' ? 'Protección total (si algo falla, nosotros resolvemos)' : 'Full protection (if something fails, we solve it)'}
            </li>
          </ul>
          <p className="text-xs opacity-90 mb-2">
            10,000+ {language === 'es' ? 'listas' : 'lists'} | 4.9 ⭐ (2,450 reviews) | GDPR Certified
          </p>
          <p className="text-sm font-semibold italic border-t border-white/20 pt-3 mt-3">
            "{language === 'es' 
              ? 'No pagas de más. Compras donde siempre. Nosotros coordinamos.' 
              : 'Don\'t overpay. Shop where you always do. We coordinate.'}"
          </p>
        </div>

        {/* ZONA 1: PERSONALIZACIÓN */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {language === 'es' ? '¡Hola' : 'Hello'} {userName.toUpperCase()}! 👋
              </h2>
              <p className="text-sm text-gray-600">
                {language === 'es' 
                  ? `Este mes ahorraste $${totalSaved} comprando inteligentemente`
                  : `This month you saved $${totalSaved} shopping smartly`}
              </p>
            </div>
            <div className="text-3xl">{getTimeEmoji()}</div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {language === 'es' ? '¿Qué quieres hacer hoy?' : 'What do you want to do today?'}
          </p>
        </div>

        {/* ZONA 2: CTA PRINCIPALES */}
        <div className="grid gap-4 mb-6">
          {/* CTA 1: Crear Lista */}
          <div 
            onClick={() => navigate("/lists")}
            className="bg-white border-2 border-primary rounded-xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🎁
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  {language === 'es' ? 'CREAR LISTA COMPARTIBLE' : 'CREATE SHAREABLE LIST'}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {language === 'es' 
                    ? 'Cumpleaños • Regalos • Cooperativa • Amigo Secreto'
                    : 'Birthday • Gifts • Pool • Secret Santa'}
                </p>
                <p className="text-xs text-primary font-medium">
                  {language === 'es' 
                    ? 'Coordina con amigos → Mejor precio por volumen'
                    : 'Coordinate with friends → Better volume price'}
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                {language === 'es' ? 'Crear Lista' : 'Create List'}
              </Button>
            </div>
          </div>

          {/* CTA 2: Compra Inteligente */}
          <div 
            onClick={() => navigate("/marketplace")}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🏆
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">
                  {language === 'es' ? 'COMPRA INTELIGENTE CON GARANTÍA' : 'SMART SHOPPING WITH GUARANTEE'}
                </h3>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    {language === 'es' 
                      ? 'Comparamos precios en 5+ tiendas automáticamente'
                      : 'We compare prices in 5+ stores automatically'}
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    {language === 'es' 
                      ? 'Mejor precio garantizado (o reembolsamos diferencia)'
                      : 'Best price guaranteed (or we refund difference)'}
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    {language === 'es' ? 'Acumulas puntos en cada compra' : 'Earn points on every purchase'}
                  </li>
                </ul>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Search className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Buscar Ofertas' : 'Search Deals'}
              </Button>
            </div>
          </div>
        </div>

        {/* ZONA 4: TUS NÚMEROS */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            🏆 {language === 'es' ? 'TUS NÚMEROS ESTE MES' : 'YOUR NUMBERS THIS MONTH'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatCard 
              icon="💵" 
              value={`$${totalReunido}`} 
              label={language === 'es' ? 'Reunido en listas' : 'Collected in lists'} 
            />
            <StatCard 
              icon="👥" 
              value={friendsCoordinated.toString()} 
              label={language === 'es' ? 'Amigos Coordinados' : 'Friends Coordinated'} 
            />
            <StatCard 
              icon="✅" 
              value={completedLists.toString()} 
              label={language === 'es' ? 'Listas Completadas' : 'Lists Completed'} 
            />
            <StatCard 
              icon="🔥" 
              value={`${streak} días`} 
              label={language === 'es' ? 'Racha' : 'Streak'} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">${totalSaved}</div>
              <div className="text-sm text-gray-600">
                💰 {language === 'es' ? 'AHORRADO (Este mes)' : 'SAVED (This month)'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{loyaltyPoints} pts</div>
              <div className="text-sm text-gray-600">
                🎁 {language === 'es' ? 'PUNTOS ACUMULADOS' : 'POINTS EARNED'} (= ${(loyaltyPoints / 100).toFixed(2)})
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
            <span className="flex items-center gap-1">
              ℹ️ {language === 'es' ? 'Datos de nuestra base de datos' : 'Data from our database'}
            </span>
            <button className="text-primary hover:underline flex items-center gap-1">
              <Download className="w-3 h-3" />
              {language === 'es' ? 'Descargar CSV' : 'Download CSV'}
            </button>
          </div>
        </div>

        {/* Mi Racha de Ahorros */}
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

        {/* Social Proof */}
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

        {/* ZONA 5: PUNTOS DE LEALTAD */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🎁 {language === 'es' ? 'Tus Puntos de Lealtad' : 'Your Loyalty Points'}
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
            <div className="text-4xl font-bold text-primary">{loyaltyPoints}</div>
            <div className="text-sm text-gray-500">{language === 'es' ? 'Puntos Disponibles' : 'Available Points'}</div>
            <div className="text-sm font-semibold text-green-600">= ${(loyaltyPoints / 100).toFixed(2)} {language === 'es' ? 'crédito' : 'credit'}</div>
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {language === 'es' ? 'Canjea en:' : 'Redeem at:'}
          </h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border border-gray-200 rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer">
              <div className="text-2xl mb-1">💳</div>
              <div className="text-xs font-semibold">Amazon</div>
              <div className="text-xs text-gray-500">100 pts = $1</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer">
              <div className="text-2xl mb-1">☕</div>
              <div className="text-xs font-semibold">Starbucks</div>
              <div className="text-xs text-gray-500">50 pts = {language === 'es' ? 'Café' : 'Coffee'}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer">
              <div className="text-2xl mb-1">🎬</div>
              <div className="text-xs font-semibold">Cinema</div>
              <div className="text-xs text-gray-500">75 pts = {language === 'es' ? 'Boleto' : 'Ticket'}</div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-4">
            <p className="text-xs font-semibold text-yellow-800">+ BONUS:</p>
            <p className="text-xs text-yellow-700">
              {language === 'es' 
                ? 'Referir amigo → +50 pts | Amigo compra → +100 pts'
                : 'Refer friend → +50 pts | Friend buys → +100 pts'}
            </p>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            {language === 'es' ? 'Canjear Puntos →' : 'Redeem Points →'}
          </Button>
        </div>

        {/* ZONA 6: PROTECCIÓN DE COMPRADOR */}
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5 mb-6">
          <h3 className="text-base font-bold text-green-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {language === 'es' ? 'COMPRA PROTEGIDA - Si algo falla, resolvemos' : 'PROTECTED PURCHASE - If something fails, we solve it'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg flex gap-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <strong className="text-sm text-gray-800 block">
                  {language === 'es' ? 'Producto no llega' : 'Product doesn\'t arrive'}
                </strong>
                <span className="text-xs text-gray-500">
                  {language === 'es' ? 'Reembolso automático en 24h' : 'Automatic refund in 24h'}
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg flex gap-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <strong className="text-sm text-gray-800 block">
                  {language === 'es' ? 'Producto dañado' : 'Damaged product'}
                </strong>
                <span className="text-xs text-gray-500">
                  {language === 'es' ? 'Retorno gratis + reembolso' : 'Free return + refund'}
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg flex gap-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <strong className="text-sm text-gray-800 block">
                  {language === 'es' ? 'No es lo que esperabas' : 'Not what you expected'}
                </strong>
                <span className="text-xs text-gray-500">
                  {language === 'es' ? 'Cambio o devolución' : 'Exchange or return'}
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg flex gap-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <strong className="text-sm text-gray-800 block">
                  {language === 'es' ? 'Precio diferente' : 'Different price'}
                </strong>
                <span className="text-xs text-gray-500">
                  {language === 'es' ? 'Reembolsamos la diferencia' : 'We refund the difference'}
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg flex gap-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <strong className="text-sm text-gray-800 block">
                  {language === 'es' ? 'Fraude/Hacking' : 'Fraud/Hacking'}
                </strong>
                <span className="text-xs text-gray-500">
                  {language === 'es' ? 'Investigamos + resolvemos' : 'We investigate + resolve'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold text-green-700 mb-3">
            = {language === 'es' ? 'Costo: Givlyn absorbe (riesgo nuestro)' : 'Cost: Givlyn absorbs (our risk)'}
          </p>

          <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-100">
            {language === 'es' ? 'Ver términos completos →' : 'View full terms →'}
          </Button>
        </div>

        {/* ZONA 7: ACCIONES SECUNDARIAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <ActionButton 
            onClick={() => navigate("/lists")} 
            icon={<List className="w-5 h-5" />}
            label={language === 'es' ? 'Mis Listas' : 'My Lists'}
            sublabel={language === 'es' ? 'Ver todas' : 'View all'}
          />
          <ActionButton 
            onClick={() => navigate("/groups")} 
            icon={<Share2 className="w-5 h-5" />}
            label={language === 'es' ? 'Compartir' : 'Share'}
            sublabel={language === 'es' ? 'Invita amigos' : 'Invite friends'}
          />
          <ActionButton 
            onClick={() => navigate("/marketplace")} 
            icon={<Gift className="w-5 h-5" />}
            label={language === 'es' ? 'Mis Puntos' : 'My Points'}
            sublabel={language === 'es' ? 'Canjea rewards' : 'Redeem rewards'}
          />
          <ActionButton 
            onClick={() => navigate("/settings")} 
            icon={<Settings className="w-5 h-5" />}
            label={language === 'es' ? 'Configuración' : 'Settings'}
            sublabel={language === 'es' ? 'Perfil & Seguridad' : 'Profile & Security'}
          />
        </div>

        {/* Cards secundarias */}
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
  <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-lg font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const ActionButton = ({ onClick, icon, label, sublabel }: { onClick: () => void; icon: React.ReactNode; label: string; sublabel?: string }) => (
  <button
    onClick={onClick}
    className="bg-white border-2 border-gray-200 p-4 rounded-xl font-semibold hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all flex flex-col items-center gap-1 text-sm"
  >
    <div className="text-primary">{icon}</div>
    <span className="text-gray-800">{label}</span>
    {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
  </button>
);

export default Dashboard;
