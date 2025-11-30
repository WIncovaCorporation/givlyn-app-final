import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

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

  const handleCreateList = () => {
    if (user) {
      navigate("/lists");
    } else {
      navigate("/auth?tab=signup&action=create-list");
    }
  };

  const handleSmartSearch = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth?tab=signup&action=smart-search");
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const content = {
    es: {
      heroTitle: 'Organiza Regalos.',
      heroHighlight: 'Mejor Precio',
      heroSubtitle: 'Sin Intermediarios.',
      heroDesc: 'En 3 minutos. Gratis. Compra donde ya compras (Amazon, Walmart, etc).',
      ctaBtn: '🎁 CREAR LISTA GRATIS',
      microcopy: 'Sin tarjeta, sin compromiso.',
      trustTitle: '¿Por qué Givlyn?',
      trust1Title: 'Compra directa en tiendas',
      trust1Desc: 'Amazon, Walmart, MercadoLibre. Tú eliges.',
      trust2Title: 'Mejor precio garantizado',
      trust2Desc: 'Si encuentras más barato, reembolsamos diferencia.',
      trust3Title: 'Protección si algo falla',
      trust3Desc: 'Producto no llega? Dañado? Nosotros pagamos.',
      trust4Title: 'Seguridad real',
      trust4Desc: 'SSL 256-bit | GDPR | CCPA | LFPDPPP. Tus datos están seguros.',
      howTitle: '¿Cómo Funciona?',
      step1: 'Crea una lista',
      step2: 'Invita amigos (1 link)',
      step3: 'Compra en tu tienda',
      step4: '¡Listo!',
      secondaryCta: '¿Solo quieres buscar producto inteligente?',
      searchBtn: '🔍 Buscar Inteligente →',
    },
    en: {
      heroTitle: 'Organize Gifts.',
      heroHighlight: 'Best Price',
      heroSubtitle: 'No Middlemen.',
      heroDesc: 'In 3 minutes. Free. Buy where you already shop (Amazon, Walmart, etc).',
      ctaBtn: '🎁 CREATE FREE LIST',
      microcopy: 'No card, no commitment.',
      trustTitle: 'Why Givlyn?',
      trust1Title: 'Buy direct from stores',
      trust1Desc: 'Amazon, Walmart, MercadoLibre. You choose.',
      trust2Title: 'Best price guaranteed',
      trust2Desc: 'Find it cheaper? We refund the difference.',
      trust3Title: 'Protection if something fails',
      trust3Desc: "Product doesn't arrive? Damaged? We pay.",
      trust4Title: 'Real security',
      trust4Desc: 'SSL 256-bit | GDPR | CCPA | LFPDPPP. Your data is safe.',
      howTitle: 'How It Works?',
      step1: 'Create a list',
      step2: 'Invite friends (1 link)',
      step3: 'Buy at your store',
      step4: 'Done!',
      secondaryCta: 'Just want to search products smartly?',
      searchBtn: '🔍 Smart Search →',
    }
  };

  const t = content[language];

  const colors = {
    primary: '#1A3E5C',
    secondary: '#1ABC9C',
    cta: '#FF9900',
    ctaHover: '#E07C00',
    background: '#F7F9FB',
    surface: '#FFFFFF',
    textPrimary: '#444444',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  };

  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: colors.background,
      color: colors.textPrimary,
      lineHeight: 1.6,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      height: '64px',
    },
    logoImage: {
      height: '64px',
      width: 'auto',
      objectFit: 'contain' as const,
    },
    main: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px 20px',
    },
    hero: {
      textAlign: 'center' as const,
      marginBottom: '24px',
      padding: '40px 20px 24px',
    },
    heroTitle: {
      fontSize: 'clamp(24px, 6vw, 32px)',
      lineHeight: 1.3,
      marginBottom: '12px',
      color: colors.primary,
    },
    heroHighlight: {
      color: colors.cta,
      fontWeight: 700,
    },
    heroSubtitle: {
      fontSize: '16px',
      color: colors.textSecondary,
      marginBottom: '20px',
      lineHeight: 1.6,
    },
    heroButtons: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '12px',
    },
    btnPrimary: {
      display: 'inline-block',
      background: colors.cta,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 250ms ease',
      textAlign: 'center' as const,
    },
    btnSecondary: {
      display: 'inline-block',
      background: colors.surface,
      color: colors.cta,
      border: `1px solid ${colors.cta}`,
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 250ms ease',
      fontSize: '14px',
    },
    microcopy: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginTop: '12px',
      fontWeight: 500,
    },
    trustSection: {
      margin: '40px 0 32px',
      padding: '0',
    },
    trustTitle: {
      fontSize: '26px',
      marginBottom: '32px',
      color: colors.primary,
      fontWeight: 600,
      textAlign: 'center' as const,
    },
    trustGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
    },
    trustItem: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'left' as const,
      display: 'flex',
      gap: '12px',
      boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)',
    },
    trustIcon: {
      fontSize: '20px',
      flexShrink: 0,
      color: colors.secondary,
    },
    trustItemTitle: {
      margin: '0 0 8px 0',
      fontSize: '16px',
      fontWeight: 700,
      color: colors.primary,
    },
    trustItemDesc: {
      margin: 0,
      fontSize: '13px',
      color: colors.textSecondary,
      lineHeight: 1.5,
    },
    howSection: {
      margin: '40px 0',
      textAlign: 'center' as const,
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '20px',
    },
    step: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '24px 16px',
      textAlign: 'center' as const,
      boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)',
    },
    stepNumber: {
      fontSize: '32px',
      fontWeight: 700,
      color: colors.primary,
      background: colors.background,
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px',
    },
    stepText: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: colors.primary,
    },
    secondaryCta: {
      margin: '40px 0',
      textAlign: 'center' as const,
    },
    secondaryText: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '12px',
    },
    footer: {
      background: colors.primary,
      color: 'white',
      padding: '32px 20px',
      textAlign: 'center' as const,
      fontSize: '12px',
      marginTop: '40px',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '12px',
      flexWrap: 'wrap' as const,
    },
    footerLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '13px',
    },
    footerSecurity: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '4px',
    },
    footerCompany: {
      fontSize: '12px',
      marginBottom: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={styles.logo}>
            <img 
              src="/logo-givlyn.png" 
              alt="Givlyn – Organiza regalos y consigue mejor precio"
              style={styles.logoImage}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleLanguage}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#666',
              padding: '8px',
            }}
          >
            {language.toUpperCase()} ▼
          </button>
          {user && (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: colors.cta,
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Dashboard
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        {/* HERO */}
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>
            {t.heroTitle}<br />
            {language === 'es' ? 'Consigue ' : 'Get '}
            <span style={styles.heroHighlight}>{t.heroHighlight}</span>.<br />
            {t.heroSubtitle}
          </h1>
          <p style={styles.heroSubtitle}>{t.heroDesc}</p>
          <div style={styles.heroButtons}>
            <button
              onClick={handleCreateList}
              style={styles.btnPrimary}
              onMouseOver={(e) => {
                e.currentTarget.style.background = colors.ctaHover;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 153, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = colors.cta;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {t.ctaBtn}
            </button>
            <button
              onClick={handleSmartSearch}
              style={styles.btnSecondary}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#FFF7EB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = colors.surface;
              }}
            >
              {t.searchBtn}
            </button>
          </div>
          <p style={styles.microcopy}>{t.microcopy}</p>
        </section>

        {/* TRUST SECTION */}
        <section style={styles.trustSection}>
          <h2 style={styles.trustTitle}>{t.trustTitle}</h2>
          <div style={styles.trustGrid}>
            {[
              { icon: '✅', title: t.trust1Title, desc: t.trust1Desc },
              { icon: '✅', title: t.trust2Title, desc: t.trust2Desc },
              { icon: '✅', title: t.trust3Title, desc: t.trust3Desc },
              { icon: '🔒', title: t.trust4Title, desc: t.trust4Desc },
            ].map((item, idx) => (
              <div key={idx} style={styles.trustItem}>
                <div style={styles.trustIcon}>{item.icon}</div>
                <div>
                  <h3 style={styles.trustItemTitle}>{item.title}</h3>
                  <p style={styles.trustItemDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={styles.howSection}>
          <h2 style={styles.trustTitle}>{t.howTitle}</h2>
          <div style={styles.stepsGrid}>
            {[
              { num: '1', text: t.step1 },
              { num: '2', text: t.step2 },
              { num: '3', text: t.step3 },
              { num: '4', text: t.step4 },
            ].map((step, idx) => (
              <div key={idx} style={styles.step}>
                <div style={styles.stepNumber}>{step.num}</div>
                <p style={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <a href="/privacy" style={styles.footerLink}>Privacy</a>
          <a href="/terms" style={styles.footerLink}>Terms</a>
          <a href="/contact" style={styles.footerLink}>Contact</a>
        </div>
        <p style={styles.footerSecurity}>
          SSL 256-bit | GDPR | CCPA | LFPDPPP
        </p>
        <p style={styles.footerCompany}>
          WINCOVA CORPORATION
        </p>
        <p style={{...styles.footerCompany, marginTop: '4px'}}>
          <a href="mailto:help@givlyn.com" style={{color: 'white', textDecoration: 'underline'}}>help@givlyn.com</a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
