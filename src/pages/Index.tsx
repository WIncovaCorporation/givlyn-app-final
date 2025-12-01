import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
      ctaPrimary: '🎁 CREAR LISTA GRATIS',
      ctaSecondary: '🔍 Buscar Regalo Inteligente',
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
      ctaPrimary: '🎁 CREATE FREE LIST',
      ctaSecondary: '🔍 Smart Gift Search',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/logo-givlyn.png" 
              alt="Givlyn"
              style={{ height: '40px', width: 'auto' }}
            />
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && !user && (
              <a
                href="/auth?tab=login"
                style={{
                  color: colors.textGrey,
                  textDecoration: 'none',
                  fontSize: '14px',
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
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
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
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
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
              }}
            >
              🌐 {language.toUpperCase()} ▾
            </button>
          </nav>
        </div>
      </header>

      {/* HERO COMPACT */}
      <section style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '24px 16px' : '40px 20px',
        background: colors.bgLight,
      }}>
        <div style={{
          maxWidth: '700px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: isMobile ? '24px' : '32px',
            lineHeight: 1.3,
            marginBottom: '16px',
            color: colors.primaryBlue,
            fontWeight: 700,
          }}>
            {t.heroLine1} <span style={{ color: colors.actionOrange }}>{t.heroHighlight}</span>.<br />
            <span style={{ color: colors.primaryBlue }}>{t.heroLine2}</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '16px',
            color: colors.textGrey,
            marginBottom: '24px',
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
            marginBottom: '12px',
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
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#EBF4FF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = colors.bgWhite;
              }}
            >
              {t.ctaSecondary}
            </button>
          </div>

          <p style={{
            fontSize: '13px',
            color: colors.textGrey,
            marginBottom: '32px',
          }}>
            {t.microcopy}
          </p>

          {/* VALUE BAR */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '16px',
            background: colors.bgWhite,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: isMobile ? '16px' : '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {[
              { icon: '✅', title: t.val1Title, sub: t.val1Sub },
              { icon: '💰', title: t.val2Title, sub: t.val2Sub },
              { icon: '🛡️', title: t.val3Title, sub: t.val3Sub },
              { icon: '🔒', title: t.val4Title, sub: t.val4Sub },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left',
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <strong style={{
                    display: 'block',
                    fontSize: '14px',
                    color: colors.primaryBlue,
                    marginBottom: '2px',
                  }}>
                    {item.title}
                  </strong>
                  <span style={{
                    fontSize: '12px',
                    color: colors.textGrey,
                  }}>
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: colors.primaryBlue,
        color: 'white',
        padding: '24px 20px',
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
            marginBottom: '12px',
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
