import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Globe, ArrowRight, Sparkles, Search, Tag, CheckCircle, ShoppingBag } from "lucide-react";
import { AmazonLogo, WalmartLogo, TargetLogo, EtsyLogo, EbayLogo, BestBuyLogo, MacysLogo, HomeDepotLogo, NikeLogo, AdidasLogo } from "@/components/StoreLogos";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleCreateList = () => {
    navigate(user ? "/lists" : "/auth?tab=signup&action=create-list");
  };

  const handleSmartAssistant = () => {
    navigate(user ? "/dashboard" : "/auth?tab=signup&action=smart-assistant");
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');

  const content = {
    es: {
      heroTitle1: 'LA UNICA LISTA DE REGALOS QUE',
      heroTitle2: 'GARANTIZA CERO DUPLICADOS.',
      heroSub: 'Añade productos de cualquier tienda, o deja que nuestro Asistente IA encuentre el regalo perfecto por ti.',
      ctaPrimary: 'CREAR LISTA GRATIS EN 2 MINUTOS',
      ctaSecondary: 'UTILIZA EL ASISTENTE DE COMPRAS INTELIGENTE',
      trustText: 'Compra inteligente desde tus tiendas favoritas.',
      howItWorks: '¿Cómo GIVLYN hace la magia?',
      step1: 'Crea tu lista',
      step1Sub: 'Añade productos de cualquier tienda',
      step2: 'Comparte el link',
      step2Sub: 'Un solo enlace para todos',
      step3: 'Tus invitados reservan',
      step3Sub: 'Sin duplicados garantizado',
      step4: 'Recibe tus regalos',
      step4Sub: 'Directo de la tienda oficial',
      login: 'Iniciar sesion',
      register: 'Registrarse',
      footerProduct: 'Givlyn es un producto de',
      footerRights: 'Todos los derechos reservados.',
    },
    en: {
      heroTitle1: 'THE ONLY GIFT LIST THAT',
      heroTitle2: 'GUARANTEES ZERO DUPLICATES.',
      heroSub: 'Add products from any store, or let our AI Assistant find the perfect gift for you.',
      ctaPrimary: 'CREATE FREE LIST IN 2 MINUTES',
      ctaSecondary: 'USE THE SMART SHOPPING ASSISTANT',
      trustText: 'Smart shopping from your favorite stores.',
      howItWorks: 'How does GIVLYN work its magic?',
      step1: 'Create your list',
      step1Sub: 'Add products from any store',
      step2: 'Share the link',
      step2Sub: 'One link for everyone',
      step3: 'Guests reserve',
      step3Sub: 'Zero duplicates guaranteed',
      step4: 'Receive your gifts',
      step4Sub: 'Direct from official store',
      login: 'Sign In',
      register: 'Sign Up',
      footerProduct: 'Givlyn is a product of',
      footerRights: 'All rights reserved.',
    }
  };

  const t = content[language];

  const colors = {
    primaryBlue: '#1A3E5C',
    actionOrange: '#FF9900',
    actionOrangeHover: '#E07C00',
    accentGreen: '#1ABC9C',
    accentGreenHover: '#16A085',
    textDark: '#1F2937',
    textGrey: '#6B7280',
    bgWhite: '#FFFFFF',
    bgLight: '#F8FAFC',
    bgTrust: '#F3F4F6',
  };

  const steps = [
    { num: 1, title: t.step1, sub: t.step1Sub, Icon: Search },
    { num: 2, title: t.step2, sub: t.step2Sub, Icon: Tag },
    { num: 3, title: t.step3, sub: t.step3Sub, Icon: CheckCircle },
    { num: 4, title: t.step4, sub: t.step4Sub, Icon: ShoppingBag },
  ];

  const cardShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
  const cardShadowHover = '0 8px 24px rgba(0, 0, 0, 0.1)';
  const btnShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
  const btnShadowHover = '0 4px 16px rgba(0, 0, 0, 0.15)';

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: colors.textDark,
      lineHeight: 1.5,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: colors.bgWhite,
      overflowX: 'hidden',
    }}>
      {/* HEADER */}
      <header style={{
        background: colors.bgWhite,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo-icon-only.png" alt="Givlyn" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontSize: '20px', fontWeight: 700, color: colors.primaryBlue }}>
              Givlyn
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && !user && (
              <a href="/auth?tab=login" style={{ color: colors.textGrey, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                {t.login}
              </a>
            )}
            {!user && (
              <a href="/auth?tab=signup" style={{ 
                background: colors.primaryBlue, 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: 600, 
                textDecoration: 'none',
              }}>
                {t.register}
              </a>
            )}
            {user && (
              <button onClick={() => navigate('/dashboard')} style={{ 
                background: colors.actionOrange, 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer',
              }}>
                Dashboard
              </button>
            )}
            <button onClick={toggleLanguage} style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '13px', 
              cursor: 'pointer', 
              color: colors.textGrey, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '6px',
            }}>
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION - CENTERED */}
      <section style={{
        background: colors.bgWhite,
        padding: isMobile ? '40px 20px 32px' : isTablet ? '56px 32px 48px' : '72px 48px 56px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: isMobile ? '28px' : isTablet ? '40px' : '52px',
          lineHeight: 1.1,
          fontWeight: 800,
          color: colors.primaryBlue,
          marginBottom: '20px',
          letterSpacing: '-0.02em',
        }}>
          {t.heroTitle1}<br />
          <span style={{ color: colors.actionOrange }}>{t.heroTitle2}</span>
        </h1>

        <p style={{
          fontSize: isMobile ? '16px' : '20px',
          color: colors.textGrey,
          marginBottom: '36px',
          lineHeight: 1.6,
          maxWidth: '680px',
          margin: '0 auto 36px',
        }}>
          {t.heroSub}
        </p>

        {/* CTAs Container */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '14px' : '20px',
        }}>
          {/* CTA Primary */}
          <button
            onClick={handleCreateList}
            style={{
              background: colors.actionOrange,
              color: 'white',
              padding: isMobile ? '16px 28px' : '18px 36px',
              borderRadius: '10px',
              border: 'none',
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: btnShadow,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: isMobile ? '100%' : 'auto',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = btnShadowHover;
              e.currentTarget.style.background = colors.actionOrangeHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = btnShadow;
              e.currentTarget.style.background = colors.actionOrange;
            }}
          >
            {t.ctaPrimary}
            <ArrowRight size={18} />
          </button>

          {/* CTA Secondary */}
          <button
            onClick={handleSmartAssistant}
            style={{
              background: 'transparent',
              color: colors.accentGreen,
              padding: isMobile ? '14px 24px' : '16px 32px',
              borderRadius: '10px',
              border: `2px solid ${colors.accentGreen}`,
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: isMobile ? '100%' : 'auto',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = colors.accentGreen;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.accentGreen;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={18} />
            {t.ctaSecondary}
          </button>
        </div>
      </section>

      {/* TRUST BAR - Professional SVG Store Logos */}
      <section style={{
        background: colors.bgTrust,
        padding: '24px 0',
        overflow: 'hidden',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Marquee Container */}
        <div style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '40px' : '56px',
              animation: 'marquee 40s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {[1, 2, 3].map((set) => (
              <div key={set} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '40px' : '56px' }}>
                <AmazonLogo height={isMobile ? 22 : 28} />
                <WalmartLogo height={isMobile ? 22 : 28} />
                <TargetLogo height={isMobile ? 24 : 30} />
                <EbayLogo height={isMobile ? 20 : 26} />
                <BestBuyLogo height={isMobile ? 20 : 26} />
                <EtsyLogo height={isMobile ? 18 : 24} />
                <HomeDepotLogo height={isMobile ? 20 : 26} />
                <NikeLogo height={isMobile ? 16 : 22} />
                <AdidasLogo height={isMobile ? 20 : 26} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{
        background: colors.bgWhite,
        padding: isMobile ? '40px 20px 48px' : '64px 48px 72px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: 700,
          color: colors.primaryBlue,
          textAlign: 'center',
          marginBottom: isMobile ? '32px' : '48px',
        }}>
          {t.howItWorks}
        </h2>

        {/* 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px' : '24px',
        }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: colors.bgWhite,
                borderRadius: '16px',
                padding: isMobile ? '20px 16px' : '28px 24px',
                boxShadow: cardShadow,
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #F1F5F9',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = cardShadowHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = cardShadow;
              }}
              onClick={handleCreateList}
            >
              {/* Icon Container */}
              <div style={{
                width: isMobile ? '56px' : '72px',
                height: isMobile ? '56px' : '72px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${colors.accentGreen}12 0%, ${colors.accentGreen}20 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <step.Icon size={isMobile ? 28 : 36} color={colors.accentGreen} strokeWidth={1.5} />
              </div>

              {/* Step Number */}
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: colors.accentGreen,
                color: 'white',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                {step.num}
              </div>

              {/* Title */}
              <strong style={{
                display: 'block',
                fontSize: isMobile ? '15px' : '18px',
                fontWeight: 700,
                color: colors.textDark,
                marginBottom: '8px',
                lineHeight: 1.3,
              }}>
                {step.title}
              </strong>

              {/* Description */}
              <span style={{
                fontSize: isMobile ? '13px' : '14px',
                color: colors.textGrey,
                lineHeight: 1.5,
              }}>
                {step.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: colors.primaryBlue,
        color: 'white',
        padding: '20px 24px',
        textAlign: 'center',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px', 
            marginBottom: '12px', 
            flexWrap: 'wrap',
          }}>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Terminos' : 'Terms'}
            </a>
            <a href="mailto:support@givlyn.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Soporte' : 'Support'}
            </a>
          </div>
          <p style={{ fontSize: '12px', margin: '4px 0', opacity: 0.8 }}>
            {t.footerProduct} <strong>WINCOVA CORPORATION</strong>. {t.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
