import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gift, Users, Sparkles, Shield, LogOut, User, ArrowRight, Store, TrendingDown, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-gifts.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t("dashboard.signedOut"));
      setUser(null);
    } catch (error) {
      toast.error(t("dashboard.signOutFailed"));
    }
  };

  const handleStartSaving = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth?tab=signup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-[20px] border-b border-white/20 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 cursor-pointer group">
            <img 
              src="/givlyn-logo.png" 
              alt="Givlyn Logo" 
              className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] object-contain drop-shadow-lg transition-all duration-300"
            />
            <div className="hidden sm:flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold text-[#1A3E3E] tracking-tight">Givlyn</span>
              <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest animate-fade-in">AI Savings</span>
            </div>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#1A3E3E] hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              {language === 'es' ? 'Características' : 'Features'}
            </a>
            <a href="/how-it-works" className="text-sm font-medium text-[#1A3E3E] hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              {language === 'es' ? 'Cómo Funciona' : 'How It Works'}
            </a>
            <a href="/contact" className="text-sm font-medium text-[#1A3E3E] hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Dashboard
                </Button>
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
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 sm:px-7 py-2.5 rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                {language === 'es' ? 'Empezar Gratis' : 'Start Free'}
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <div className="h-[94px] sm:h-[114px]" />

      <section className="relative overflow-hidden" aria-label="Sección principal">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" aria-hidden="true" />
        
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 animate-fade-in order-1">
              <div className="inline-block animate-scale-in">
                <span className="px-4 py-2 bg-gradient-warm text-primary-foreground rounded-full text-sm font-semibold shadow-medium inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t("hero.badge")}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                {t("hero.title")}
                <span className="block mt-2 bg-gradient-warm bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                {language === 'es' 
                  ? 'Compara precios en Amazon, Walmart y Target en segundos. Ahorra hasta 40% en cada compra.'
                  : 'Compare prices across Amazon, Walmart and Target in seconds. Save up to 40% on every purchase.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-large hover:shadow-glow hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                  onClick={handleStartSaving}
                  aria-label={t("hero.cta")}
                >
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-base px-6 py-6 hover:bg-muted/50 w-full sm:w-auto"
                  onClick={() => navigate("/how-it-works")}
                  aria-label={t("hero.demo")}
                >
                  {t("hero.demo")}
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up order-2 lg:order-2 hidden sm:block">
              <div className="absolute -inset-4 bg-gradient-warm rounded-3xl blur-3xl opacity-20 animate-pulse" aria-hidden="true" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-glow transition-all duration-500 group">
                <img 
                  src={heroImage} 
                  alt="Cajas de regalo coloridas y elegantes decoradas con lazos dorados"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 border-y bg-muted/30" aria-label="Prueba social">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Store className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">
                {language === 'es' ? '5+ tiendas conectadas' : '5+ stores connected'}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">
                {language === 'es' ? 'Hasta 40% de ahorro' : 'Up to 40% savings'}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">
                {language === 'es' ? 'Resultados en segundos' : 'Results in seconds'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 opacity-60">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {language === 'es' ? 'Comparamos precios en:' : 'We compare prices at:'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-3 flex-wrap">
            <span className="text-sm font-bold text-[#FF9900]">Amazon</span>
            <span className="text-sm font-bold text-[#0071CE]">Walmart</span>
            <span className="text-sm font-bold text-[#CC0000]">Target</span>
            <span className="text-sm font-bold text-[#F56400]">Etsy</span>
            <span className="text-sm font-bold text-[#E53238]">eBay</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-card/30" aria-label="Características principales">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("features.title")}</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">{t("features.subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-warm rounded-3xl p-8 sm:p-12 text-center shadow-large">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 shadow-md hover:shadow-lg"
              onClick={handleStartSaving}
            >
              {t("cta.button")}
              <ArrowRight className="w-5 h-5 ml-2" />
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
    className="group p-6 sm:p-8 rounded-2xl border bg-card hover:shadow-large hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-warm opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-warm rounded-2xl flex items-center justify-center text-primary-foreground mb-4 sm:mb-5 shadow-soft group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{description}</p>
      <div className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
        Explorar
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  </div>
);

export default Index;
