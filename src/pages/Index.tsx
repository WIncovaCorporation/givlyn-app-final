import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Globe, ArrowRight, Search, Tag, CheckCircle, ShoppingBag } from "lucide-react";

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

  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');

  const content = {
    es: {
      heroTitle1: 'LA UNICA LISTA DE REGALOS QUE',
      heroTitle2: 'GARANTIZA CERO DUPLICADOS.',
      heroSub: 'Anade productos de cualquier tienda online en segundos, comparte un solo link y permite que tus invitados reserven el regalo perfecto.',
      ctaPrimary: 'CREAR LISTA GRATIS EN 2 MINUTOS',
      trustText: 'Compra desde estas... y miles de tiendas online mas.',
      howItWorks: 'Como Funciona',
      step1: 'Crea tu lista',
      step1Sub: 'Anade productos de cualquier tienda',
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
      heroSub: 'Add products from any online store in seconds, share a single link and let your guests reserve the perfect gift.',
      ctaPrimary: 'CREATE FREE LIST IN 2 MINUTES',
      trustText: 'Shop from these... and thousands more online stores.',
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
    textDark: '#1F2937',
    textGrey: '#6B7280',
    bgWhite: '#FFFFFF',
    bgLight: '#F8FAFC',
    bgTrust: '#F3F4F6',
  };

  const stores = [
    'Amazon', 'Walmart', 'Target', 'Etsy', 'Best Buy', 
    'eBay', "Macy's", 'Home Depot', 'Nike', 'Adidas',
    'Costco', 'Nordstrom', 'Sephora', 'Apple', 'Samsung'
  ];

  const steps = [
    { num: 1, title: t.step1, sub: t.step1Sub, Icon: Search },
    { num: 2, title: t.step2, sub: t.step2Sub, Icon: Tag },
    { num: 3, title: t.step3, sub: t.step3Sub, Icon: CheckCircle },
    { num: 4, title: t.step4, sub: t.step4Sub, Icon: ShoppingBag },
  ];

  const cardShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  const cardShadowHover = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';

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
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
      }}>
        <div style={{
          maxWidth: '1400px',
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

      {/* HERO SECTION - Split Layout */}
      <section style={{
        background: colors.bgWhite,
        padding: isMobile ? '32px 20px' : isTablet ? '48px 32px' : '64px 48px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '32px' : '48px',
          alignItems: 'center',
        }}>
          {/* LEFT: Copy */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : isTablet ? '36px' : '48px',
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
              marginBottom: '32px',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: isMobile ? '0 auto 32px' : '0 0 32px 0',
            }}>
              {t.heroSub}
            </p>

            {/* CTA Principal - Big & Bold */}
            <button
              onClick={handleCreateList}
              style={{
                background: `linear-gradient(135deg, ${colors.actionOrange} 0%, ${colors.actionOrangeHover} 100%)`,
                color: 'white',
                padding: isMobile ? '18px 28px' : '20px 40px',
                borderRadius: '12px',
                border: 'none',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(255, 153, 0, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 153, 0, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 153, 0, 0.4)';
              }}
            >
              {t.ctaPrimary}
              <ArrowRight size={20} />
            </button>
          </div>

          {/* RIGHT: Hero Image Placeholder (Hidden on Mobile) */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '480px',
                aspectRatio: '4/3',
                background: `linear-gradient(135deg, ${colors.bgLight} 0%, #E2E8F0 100%)`,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: cardShadow,
                overflow: 'hidden',
              }}>
                <img 
                  src="/logo-icon-only.png" 
                  alt="Givlyn" 
                  style={{ 
                    width: '120px', 
                    height: 'auto',
                    opacity: 0.3,
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TRUST BAR - Infinite Marquee Carousel */}
      <section style={{
        background: colors.bgTrust,
        padding: '20px 0',
        overflow: 'hidden',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: colors.textGrey,
          marginBottom: '16px',
          fontWeight: 500,
        }}>
          {t.trustText}
        </p>
        
        {/* Marquee Container */}
        <div style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
        }}>
          <div 
            style={{
              display: 'flex',
              gap: '48px',
              animation: 'marquee 30s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {[...stores, ...stores, ...stores].map((store, idx) => (
              <span 
                key={idx}
                style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 600,
                  color: colors.primaryBlue,
                  opacity: 0.5,
                  flexShrink: 0,
                  fontStyle: store === 'Etsy' ? 'italic' : 'normal',
                }}
              >
                {store}
              </span>
            ))}
          </div>
        </div>

        {/* Marquee Animation CSS */}
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
        padding: isMobile ? '40px 20px' : '64px 48px',
        maxWidth: '1400px',
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

        {/* 4-Column Grid (2 on mobile) */}
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
                transition: 'all 0.2s ease',
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
                background: `linear-gradient(135deg, ${colors.accentGreen}15 0%, ${colors.accentGreen}25 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <step.Icon size={isMobile ? 28 : 36} color={colors.accentGreen} strokeWidth={1.5} />
              </div>

              {/* Step Number */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: colors.accentGreen,
                color: 'white',
                fontSize: '12px',
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
                marginBottom: '6px',
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

        {/* Secondary CTA */}
        <div style={{ textAlign: 'center', marginTop: isMobile ? '32px' : '48px' }}>
          <button
            onClick={handleCreateList}
            style={{
              background: `linear-gradient(135deg, ${colors.accentGreen} 0%, #16A085 100%)`,
              color: 'white',
              padding: isMobile ? '16px 32px' : '18px 48px',
              borderRadius: '12px',
              border: 'none',
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(26, 188, 156, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 188, 156, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(26, 188, 156, 0.4)';
            }}
          >
            {t.ctaPrimary}
            <ArrowRight size={18} />
          </button>
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
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
