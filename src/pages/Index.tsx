import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Search, Gift, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const handleSmartSearch = () => {
    navigate(user ? "/dashboard" : "/auth?tab=signup&action=smart-search");
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');

  const content = {
    es: {
      heroLine1: 'Organiza Regalos. Consigue',
      heroHighlight: 'Mejor Precio',
      heroLine2: 'Garantía de Tienda Oficial.',
      heroSub: 'Crea tu lista en 3 min. Tus amigos compran en Amazon, Walmart, etc.',
      heroStrong: 'Nosotros solo te ayudamos a ahorrar.',
      ctaPrimary: 'CREAR LISTA GRATIS',
      ctaSecondary: 'Buscar Regalo Inteligente',
      microcopy: 'Sin tarjeta de crédito. 100% Seguro.',
      val1Title: 'Compra Directa',
      val1Sub: 'Amazon, Walmart, Target',
      val2Title: 'Mejor Precio',
      val2Sub: 'Comparamos por ti',
      val3Title: 'Protección Total',
      val3Sub: 'Garantía de la tienda',
      val4Title: 'Datos Seguros',
      val4Sub: 'SSL | GDPR | CCPA',
      login: 'Iniciar sesión',
      register: 'Registrarse',
    },
    en: {
      heroLine1: 'Organize Gifts. Get',
      heroHighlight: 'Best Price',
      heroLine2: 'Official Store Guarantee.',
      heroSub: 'Create your list in 3 min. Friends buy on Amazon, Walmart, etc.',
      heroStrong: 'We just help you save.',
      ctaPrimary: 'CREATE FREE LIST',
      ctaSecondary: 'Smart Gift Search',
      microcopy: 'No credit card. 100% Secure.',
      val1Title: 'Direct Purchase',
      val1Sub: 'Amazon, Walmart, Target',
      val2Title: 'Best Price',
      val2Sub: 'We compare for you',
      val3Title: 'Full Protection',
      val3Sub: 'Store guarantee',
      val4Title: 'Secure Data',
      val4Sub: 'SSL | GDPR | CCPA',
      login: 'Sign In',
      register: 'Sign Up',
    }
  };

  const t = content[language];

  const colors = {
    primaryBlue: '#1A3E5C',
    actionOrange: '#FF9900',
    actionOrangeHover: '#E07C00',
    accentGreen: '#1ABC9C',
    textDark: '#333333',
    textGrey: '#666666',
    bgWhite: '#FFFFFF',
    bgLight: '#F7F9FB',
    border: '#E5E7EB',
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: colors.textDark,
      lineHeight: 1.4,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: colors.bgLight,
    }}>
      {/* HEADER */}
      <header style={{
        background: colors.bgWhite,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '60px',
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
          {/* LOGO + BRAND NAME */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
          }}>
            <img 
              src="/logo-icon-only.png" 
              alt="Givlyn"
              style={{ height: '40px', width: 'auto' }}
            />
            <span style={{
              fontSize: '24px',
              fontWeight: 700,
              color: colors.primaryBlue,
              letterSpacing: '-0.5px',
            }}>
              Givlyn
            </span>
          </div>

          {/* NAV */}
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            height: '100%',
          }}>
            {!isMobile && !user && (
              <a
                href="/auth?tab=login"
                style={{
                  color: colors.textGrey,
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                {t.login}
              </a>
            )}
            {!user && (
              <a
                href="/auth?tab=signup"
                style={{
                  background: colors.primaryBlue,
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t.register}
              </a>
            )}
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: colors.actionOrange,
                  color: 'white',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Dashboard
              </button>
            )}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                color: colors.textGrey,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px',
              }}
            >
              <Globe size={16} />
              {language.toUpperCase()} ▾
            </button>
          </nav>
        </div>
      </header>

      {/* HERO COMPACT */}
      <section style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: isMobile ? '20px 16px' : '24px 20px',
        background: colors.bgLight,
      }}>
        <div style={{
          maxWidth: '700px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: isMobile ? '24px' : '32px',
            lineHeight: 1.3,
            marginBottom: '12px',
            color: colors.primaryBlue,
            fontWeight: 700,
          }}>
            {t.heroLine1} <span style={{ color: colors.actionOrange }}>{t.heroHighlight}</span>.<br />
            <span style={{ color: colors.primaryBlue }}>{t.heroLine2}</span>
          </h1>

          {/* STORE LOGOS */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '16px',
          }}>
            <span style={{ 
              fontFamily: "'Amazon Ember', Arial, sans-serif",
              fontSize: '18px', 
              fontWeight: 700, 
              color: '#888',
              opacity: 0.7,
              letterSpacing: '-0.5px',
            }}>
              amazon
            </span>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              color: '#888',
              opacity: 0.7,
            }}>
              Walmart
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.7 }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '3px solid #888',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#888',
                }}/>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#888' }}>Target</span>
            </div>
          </div>

          <p style={{
            fontSize: isMobile ? '15px' : '16px',
            color: colors.textGrey,
            marginBottom: '20px',
            lineHeight: 1.5,
          }}>
            {t.heroSub}<br />
            <strong style={{ color: colors.textDark }}>{t.heroStrong}</strong>
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '10px',
          }}>
            <button
              onClick={handleCreateList}
              style={{
                background: colors.actionOrange,
                color: 'white',
                padding: '14px 28px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = colors.actionOrangeHover;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = colors.actionOrange;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Gift size={18} />
              {t.ctaPrimary}
            </button>
            <button
              onClick={handleSmartSearch}
              style={{
                background: colors.bgWhite,
                color: colors.primaryBlue,
                padding: '14px 28px',
                borderRadius: '8px',
                border: `2px solid ${colors.primaryBlue}`,
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#EBF4FF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = colors.bgWhite;
              }}
            >
              <Search size={18} />
              {t.ctaSecondary}
            </button>
          </div>

          <p style={{
            fontSize: '13px',
            color: colors.textGrey,
            marginBottom: '24px',
          }}>
            {t.microcopy}
          </p>

          {/* VALUE BAR PRO */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            background: '#ffffff',
            padding: isMobile ? '20px' : '25px 30px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            maxWidth: '950px',
            margin: '0 auto',
            gap: isMobile ? '20px' : '0',
          }}>
            {/* Compra Directa */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              flex: '1 1 200px',
              padding: '5px',
              borderBottom: isMobile ? '1px solid #eee' : 'none',
              paddingBottom: isMobile ? '15px' : '5px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1ABC9C" width="28" height="28">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#1A3E5C', marginBottom: '4px' }}>
                  {t.val1Title}
                </strong>
                <span style={{ fontSize: '13px', color: '#666666', lineHeight: 1.4, display: 'block' }}>
                  {t.val1Sub}
                </span>
              </div>
            </div>

            {/* Mejor Precio */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              flex: '1 1 200px',
              padding: '5px',
              borderBottom: isMobile ? '1px solid #eee' : 'none',
              paddingBottom: isMobile ? '15px' : '5px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1ABC9C" width="28" height="28">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-2.03.6-3.54 2.21-3.54 4.04 0 2.58 2.11 3.91 4.54 4.49 2.54.61 3.2 1.33 3.2 2.24 0 1.19-1.16 2.05-2.95 2.05-2.11 0-2.9-.98-2.99-2.23H8.19c.11 2.11 1.78 3.65 3.81 4.15V21h3v-2.15c2.3-.64 3.8-2.29 3.8-4.32 0-2.65-1.97-4.09-4.8-4.63z"/>
              </svg>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#1A3E5C', marginBottom: '4px' }}>
                  {t.val2Title}
                </strong>
                <span style={{ fontSize: '13px', color: '#666666', lineHeight: 1.4, display: 'block' }}>
                  {t.val2Sub}
                </span>
              </div>
            </div>

            {/* Protección Total */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              flex: '1 1 200px',
              padding: '5px',
              borderBottom: isMobile ? '1px solid #eee' : 'none',
              paddingBottom: isMobile ? '15px' : '5px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1ABC9C" width="28" height="28">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#1A3E5C', marginBottom: '4px' }}>
                  {t.val3Title}
                </strong>
                <span style={{ fontSize: '13px', color: '#666666', lineHeight: 1.4, display: 'block' }}>
                  {t.val3Sub}
                </span>
              </div>
            </div>

            {/* Datos Seguros */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              flex: '1 1 200px',
              padding: '5px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1ABC9C" width="28" height="28">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#1A3E5C', marginBottom: '4px' }}>
                  {t.val4Title}
                </strong>
                <span style={{ fontSize: '13px', color: '#666666', lineHeight: 1.4, display: 'block' }}>
                  {t.val4Sub}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: colors.primaryBlue,
        color: 'white',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '10px',
            flexWrap: 'wrap',
          }}>
            <a href="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <a href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Términos' : 'Terms'}
            </a>
            <a href="mailto:support@givlyn.com" style={{ color: 'white', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Soporte' : 'Support'}
            </a>
          </div>
          <p style={{ fontSize: '12px', margin: '4px 0', opacity: 0.9 }}>
            Givlyn es un producto de <strong>WINCOVA CORPORATION</strong>.
          </p>
          <p style={{ fontSize: '11px', margin: '4px 0', opacity: 0.7 }}>
            © 2025 Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
