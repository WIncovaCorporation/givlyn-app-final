import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Globe, ArrowRight, Sparkles, Search, Tag, CheckCircle, ShoppingBag } from "lucide-react";

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
      howItWorks: 'Como Funciona',
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
      howItWorks: 'How It Works',
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

  const fontSize = isMobile ? '16px' : '20px';

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

      {/* TRUST BAR - Store Logos as Styled Text */}
      <section style={{
        background: colors.bgTrust,
        padding: '20px 0',
        overflow: 'hidden',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Marquee Container */}
        <div style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '28px' : '44px',
              animation: 'marquee 30s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {[1, 2, 3].map((set) => (
              <div key={set} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '28px' : '44px' }}>
                {/* Amazon - Logo oficial con flecha sonrisa */}
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}>
                  <span style={{ 
                    fontSize, 
                    fontWeight: 700, 
                    color: '#232F3E',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}>
                    amazon
                  </span>
                  <svg width={isMobile ? '60' : '76'} height={isMobile ? '10' : '12'} viewBox="0 0 76 12" style={{ marginTop: '-2px' }}>
                    <path d="M2 8 Q38 16 74 4" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <path d="M68 2 L74 4 L70 8" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Walmart - Logo oficial con spark */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <svg width={isMobile ? '20' : '24'} height={isMobile ? '20' : '24'} viewBox="0 0 24 24">
                    <path d="M12 2L12.8 7.2L12 12L11.2 7.2L12 2Z" fill="#FFC220"/>
                    <path d="M12 22L11.2 16.8L12 12L12.8 16.8L12 22Z" fill="#FFC220"/>
                    <path d="M2 12L7.2 11.2L12 12L7.2 12.8L2 12Z" fill="#FFC220"/>
                    <path d="M22 12L16.8 12.8L12 12L16.8 11.2L22 12Z" fill="#FFC220"/>
                    <path d="M4.93 4.93L8.76 9.17L12 12L8.76 9.17L4.93 4.93Z" fill="#FFC220"/>
                    <path d="M19.07 19.07L15.24 14.83L12 12L15.24 14.83L19.07 19.07Z" fill="#FFC220"/>
                    <path d="M4.93 19.07L9.17 15.24L12 12L9.17 15.24L4.93 19.07Z" fill="#FFC220"/>
                    <path d="M19.07 4.93L14.83 8.76L12 12L14.83 8.76L19.07 4.93Z" fill="#FFC220"/>
                  </svg>
                  <span style={{ 
                    fontSize, 
                    fontWeight: 600, 
                    color: '#0071CE',
                    fontFamily: 'Arial, sans-serif',
                  }}>
                    Walmart
                  </span>
                </div>

                {/* Etsy */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 600, 
                  color: '#F56400',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '1px',
                }}>
                  Etsy
                </span>

                {/* eBay - multicolor */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 700, 
                  fontFamily: 'Arial, sans-serif',
                }}>
                  <span style={{ color: '#E53238' }}>e</span>
                  <span style={{ color: '#0064D2' }}>b</span>
                  <span style={{ color: '#F5AF02' }}>a</span>
                  <span style={{ color: '#86B817' }}>y</span>
                </span>

                {/* Best Buy */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 700, 
                  color: '#0046BE',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '0.5px',
                }}>
                  BEST BUY
                </span>

                {/* Macy's */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 400, 
                  color: '#E21A2C',
                  fontFamily: 'Times New Roman, serif',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  macy's
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#E21A2C" style={{ marginLeft: '2px' }}>
                    <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
                  </svg>
                </span>

                {/* Target */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 700, 
                  color: '#CC0000',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#CC0000"/>
                    <circle cx="12" cy="12" r="6.5" fill="white"/>
                    <circle cx="12" cy="12" r="3" fill="#CC0000"/>
                  </svg>
                  Target
                </span>

                {/* Nike */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 700, 
                  color: '#111111',
                  fontFamily: 'Futura, Arial, sans-serif',
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  NIKE
                </span>

                {/* Adidas */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 700, 
                  color: '#000000',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  letterSpacing: '3px',
                  textTransform: 'lowercase',
                }}>
                  adidas
                </span>

                {/* Home Depot */}
                <span style={{ 
                  fontSize, 
                  fontWeight: 700, 
                  color: '#F96302',
                  fontFamily: 'Arial, sans-serif',
                }}>
                  HOME DEPOT
                </span>

                {/* Trust Text */}
                <span style={{
                  fontSize: isMobile ? '12px' : '14px',
                  color: colors.textGrey,
                  fontStyle: 'italic',
                  padding: '0 8px',
                }}>
                  "{t.trustText}"
                </span>
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
