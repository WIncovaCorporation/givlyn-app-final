import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gift, Users, Sparkles, Shield, LogOut, User, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-gifts.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ContextualTooltip } from "@/components/ContextualTooltip";
import { useTooltips } from "@/hooks/useTooltips";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { shouldShowTooltip, markTooltipAsSeen } = useTooltips();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showDashboardTooltip, setShowDashboardTooltip] = useState(false);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Mostrar tooltip solo si el usuario está autenticado y es su primera visita
      if (session?.user && shouldShowTooltip('dashboard')) {
        const timer = setTimeout(() => {
          setShowDashboardTooltip(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [shouldShowTooltip]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t("dashboard.signedOut"));
      setUser(null);
    } catch (error) {
      toast.error(t("dashboard.signOutFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header with User Info - Responsive */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          {/* Logo compacto en móvil */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-warm rounded-xl flex items-center justify-center shadow-soft">
              <Gift className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-base sm:text-lg font-bold">Givlyn</h1>
          </div>
          
          {/* Botones con iconos en móvil, texto en desktop */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            {user ? (
              <div className="flex items-center gap-2">
                {/* User info solo en desktop */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuario'}
                  </span>
                </div>
                {/* Dashboard: texto en desktop, icono en móvil */}
                <Button 
                  onClick={() => navigate("/dashboard")}
                  size="sm"
                  variant="outline"
                  className="hidden sm:flex"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  size="icon"
                  variant="outline"
                  className="sm:hidden h-9 w-9"
                  aria-label="Dashboard"
                >
                  <User className="h-4 w-4" />
                </Button>
                {/* Logout siempre con icono */}
                <Button 
                  onClick={handleSignOut}
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                size="sm"
                className="text-xs sm:text-sm px-3 sm:px-4 h-9"
              >
                {t("auth.signIn")}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center" aria-label="Sección principal">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" aria-hidden="true" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block animate-scale-in">
                <span className="px-5 py-2.5 bg-gradient-warm text-primary-foreground rounded-full text-sm font-semibold shadow-medium hover:shadow-glow transition-all duration-300 inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t("hero.badge")}
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                {t("hero.title")}
                <span className="block mt-2 bg-gradient-warm bg-clip-text text-transparent animate-pulse-glow">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                {t("hero.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-6 shadow-large hover:shadow-glow hover:scale-105 transition-all duration-300 group"
                  onClick={() => navigate("/auth")}
                  aria-label={t("hero.cta")}
                >
                  {t("hero.cta")}
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-6 border-2 hover:bg-muted/50 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/dashboard")}
                  aria-label={t("hero.demo")}
                >
                  {t("hero.demo")}
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="absolute -inset-4 bg-gradient-warm rounded-3xl blur-3xl opacity-20 animate-pulse" aria-hidden="true" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-glow transition-all duration-500 group">
                <img 
                  src={heroImage} 
                  alt="Cajas de regalo coloridas y elegantes decoradas con lazos dorados"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Tooltip */}
      <section className="py-24 bg-card/30" aria-label="Características principales">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl font-bold mb-4">{t("features.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("features.subtitle")}</p>
            
            {/* Tooltip contextual */}
            {user && (
              <ContextualTooltip
                show={showDashboardTooltip}
                onClose={() => {
                  setShowDashboardTooltip(false);
                  markTooltipAsSeen('dashboard');
                }}
                position="bottom"
                content={
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">¿Por qué usar Givlyn?</p>
                        <ul className="text-xs text-gray-300 mt-2 space-y-1">
                          <li>✅ Nunca más regalos equivocados</li>
                          <li>✅ Sorteo justo y automático</li>
                          <li>✅ Todos saben qué quieren los demás</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                }
              />
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Gift className="w-8 h-8" />}
              title={t("features.lists.title")}
              description={t("features.lists.description")}
              onClick={() => navigate("/lists")}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title={t("features.groups.title")}
              description={t("features.groups.description")}
              onClick={() => navigate("/groups")}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title={t("features.events.title")}
              description={t("features.events.description")}
              onClick={() => navigate("/events")}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title={t("features.privacy.title")}
              description={t("features.privacy.description")}
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-warm rounded-3xl p-12 text-center shadow-large">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              {t("cta.subtitle")}
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8"
              onClick={() => navigate("/auth")}
            >
              {t("cta.button")}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, onClick }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onClick?: () => void;
}) => (
  <div 
    onClick={onClick}
    className="group p-8 rounded-2xl border bg-card hover:shadow-large hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-warm opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center text-primary-foreground mb-5 shadow-soft group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <div className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
        Explorar
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  </div>
);

// Test: Activar sistema de auditoría dual WINCOVA + Ultra UX Bot
export default Index;