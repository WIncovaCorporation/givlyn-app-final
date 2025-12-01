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
      heroSub: 'Crea tu lista en 3 min. Compra en más de 500 tiendas.',
      heroStrong: 'Nosotros solo te ayudamos a ahorrar.',
      ctaPrimary: 'CREAR LISTA GRATIS',
      ctaSecondary: 'Buscar Regalo Inteligente',
      microcopy: 'Sin tarjeta de crédito. 100% Seguro.',
      val1Title: 'Compra Directa',
      val1Sub: '+500 tiendas líderes',
      val2Title: 'Mejor Precio',
      val2Sub: 'Comparamos por ti',
      val3Title: 'Protección Total',
      val3Sub: 'Garantía de la tienda',
      val4Title: 'Datos Seguros',
      val4Sub: 'SSL | GDPR | CCPA',
      howItWorks: '¿Cómo Funciona?',
      step1: 'Dinos qué buscas',
      step1Sub: 'Regalo, ocasión o presupuesto',
      step2: 'Comparamos precios',
      step2Sub: 'En +500 tiendas al instante',
      step3: 'Elige tu favorito',
      step3Sub: 'Con el mejor precio garantizado',
      step4: 'Compra directo',
      step4Sub: 'En la tienda oficial',
      tryNow: 'Probar Ahora',
      trustedBy: 'Respaldado por tiendas líderes y seguridad certificada',
      login: 'Iniciar sesión',
      register: 'Registrarse',
    },
    en: {
      heroLine1: 'Organize Gifts. Get',
      heroHighlight: 'Best Price',
      heroLine2: 'Official Store Guarantee.',
      heroSub: 'Create your list in 3 min. Shop at 500+ stores.',
      heroStrong: 'We just help you save.',
      ctaPrimary: 'CREATE FREE LIST',
      ctaSecondary: 'Smart Gift Search',
      microcopy: 'No credit card. 100% Secure.',
      val1Title: 'Direct Purchase',
      val1Sub: '500+ leading stores',
      val2Title: 'Best Price',
      val2Sub: 'We compare for you',
      val3Title: 'Full Protection',
      val3Sub: 'Store guarantee',
      val4Title: 'Secure Data',
      val4Sub: 'SSL | GDPR | CCPA',
      howItWorks: 'How It Works',
      step1: 'Tell us what you need',
      step1Sub: 'Gift, occasion or budget',
      step2: 'We compare prices',
      step2Sub: 'Across 500+ stores instantly',
      step3: 'Pick your favorite',
      step3Sub: 'Best price guaranteed',
      step4: 'Buy direct',
      step4Sub: 'From the official store',
      tryNow: 'Try Now',
      trustedBy: 'Backed by leading stores and certified security',
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

  const StoreLogo = ({ name }: { name: string }) => {
    const logoStyle = {
      height: isMobile ? '16px' : '20px',
      opacity: 0.55,
      filter: 'grayscale(100%)',
    };
    
    if (name === 'amazon') {
      return (
        <svg style={logoStyle} viewBox="0 0 603 182" fill={colors.primaryBlue}>
          <path d="M374.00 108.70 C340.37 133.16 292.09 146.18 250.50 146.18 C191.98 146.18 139.28 124.34 99.54 87.76 C96.37 84.86 99.20 80.91 103.02 83.21 C146.18 108.35 199.56 123.37 254.60 123.37 C291.46 123.37 331.77 115.95 368.84 100.56 C374.43 98.09 379.23 104.07 374.00 108.70 Z M387.41 93.32 C382.99 87.52 358.38 90.51 347.27 91.86 C344.00 92.28 343.50 89.40 346.45 87.35 C366.52 73.39 399.43 77.52 403.22 82.36 C407.02 87.23 402.21 120.17 383.41 135.83 C380.68 138.18 378.07 136.94 379.29 133.90 C383.23 124.04 391.85 99.15 387.41 93.32 Z"/>
          <path d="M348.54 14.70 L348.54 4.40 C348.54 2.84 349.74 1.79 351.17 1.79 L410.95 1.79 C412.44 1.79 413.64 3.00 413.64 4.45 L413.64 13.37 C413.60 14.78 412.33 16.60 410.21 19.50 L379.55 63.39 C390.82 63.10 402.70 64.77 412.89 70.54 C415.15 71.80 415.79 73.67 415.97 75.09 L415.97 86.06 C415.97 87.52 414.35 89.24 412.62 88.31 C395.02 78.99 371.69 77.92 352.23 88.43 C350.67 89.32 349.02 87.64 349.02 86.18 L349.02 75.75 C349.02 74.12 349.06 71.20 350.73 68.68 L386.55 17.92 L351.21 17.92 C349.74 17.92 348.54 16.76 348.54 15.30 L348.54 14.70 Z"/>
          <path d="M124.50 90.42 L107.10 90.42 C105.78 90.33 104.72 89.32 104.63 88.05 L104.63 4.59 C104.63 3.17 105.86 2.03 107.34 2.03 L123.57 2.03 C124.92 2.10 126.00 3.14 126.10 4.45 L126.10 15.04 L126.39 15.04 C130.54 4.68 137.74 0.00 148.01 0.00 C158.45 0.00 165.00 4.68 169.83 15.04 C173.96 4.68 182.73 0.00 192.57 0.00 C199.62 0.00 207.32 2.98 212.00 9.32 C217.32 16.38 216.15 26.22 216.15 35.10 L216.11 87.81 C216.11 89.23 214.88 90.42 213.40 90.42 L196.04 90.42 C194.64 90.33 193.51 89.15 193.51 87.81 L193.51 43.29 C193.51 39.72 193.85 30.49 193.17 27.09 C192.15 21.77 188.51 20.25 183.86 20.25 C180.04 20.25 176.04 22.74 174.38 26.74 C172.72 30.74 172.88 37.46 172.88 43.29 L172.88 87.81 C172.88 89.23 171.65 90.42 170.17 90.42 L152.81 90.42 C151.38 90.33 150.28 89.15 150.28 87.81 L150.24 43.29 C150.24 33.79 151.93 20.09 140.14 20.09 C128.19 20.09 128.69 33.45 128.69 43.29 L128.69 87.81 C128.69 89.23 127.46 90.42 125.98 90.42 L124.50 90.42 Z"/>
          <path d="M458.46 0.00 C481.52 0.00 494.08 20.09 494.08 45.77 C494.08 70.58 480.02 90.16 458.46 90.16 C435.91 90.16 423.51 70.07 423.51 45.26 C423.51 20.26 435.91 0.00 458.46 0.00 Z M458.63 16.55 C446.17 16.55 445.49 33.45 445.49 43.97 C445.49 54.52 445.32 73.44 458.46 73.44 C471.43 73.44 472.11 55.34 472.11 44.31 C472.11 36.92 471.77 28.04 469.44 21.17 C467.44 15.21 463.62 16.55 458.63 16.55 Z"/>
          <path d="M523.11 90.42 L505.79 90.42 C504.39 90.33 503.26 89.15 503.26 87.81 L503.22 4.30 C503.34 3.02 504.50 2.03 505.88 2.03 L521.94 2.03 C523.15 2.10 524.16 2.93 524.44 4.06 L524.44 16.72 L524.78 16.72 C529.44 5.02 535.31 0.00 547.54 0.00 C555.27 0.00 562.82 2.81 567.82 10.38 C572.48 17.27 572.48 28.55 572.48 36.92 L572.48 88.18 C572.31 89.40 571.12 90.42 569.77 90.42 L552.33 90.42 C551.07 90.33 550.01 89.32 549.87 88.18 L549.87 42.44 C549.87 32.95 551.07 19.92 539.62 19.92 C535.81 19.92 532.33 22.40 530.50 26.22 C528.17 31.04 527.83 35.83 527.83 42.44 L527.83 87.81 C527.79 89.23 526.53 90.42 525.05 90.42 L523.11 90.42 Z"/>
          <path d="M268.13 51.99 C268.13 59.21 268.30 65.29 264.48 71.72 C261.34 76.88 256.34 80.11 250.83 80.11 C243.29 80.11 238.96 74.37 238.96 65.84 C238.96 49.08 253.87 46.12 268.13 46.12 L268.13 51.99 Z M290.84 90.09 C289.69 91.11 287.99 91.19 286.67 90.51 C280.49 85.39 279.42 83.01 276.07 78.07 C265.81 88.60 258.59 91.68 245.28 91.68 C229.53 91.68 217.24 81.85 217.24 62.44 C217.24 47.25 225.47 36.73 237.60 31.74 C248.05 27.26 262.64 26.40 268.13 25.71 L268.13 24.21 C268.13 21.30 268.30 17.81 266.64 15.32 C265.22 13.09 262.41 12.07 259.95 12.07 C255.45 12.07 251.44 14.39 250.45 19.21 C250.24 20.38 249.38 21.53 248.20 21.60 L231.51 19.84 C230.45 19.59 229.28 18.70 229.58 17.10 C233.23 -1.67 250.11 -7.58 265.39 -7.58 C273.29 -7.58 283.56 -5.26 289.91 1.00 C298.14 8.75 297.30 19.09 297.30 30.40 L297.30 55.34 C297.30 63.06 300.61 66.47 303.72 70.71 C304.75 72.17 304.97 73.93 303.64 75.05 C300.23 77.92 294.23 83.13 290.92 86.22 L290.84 90.09 Z"/>
          <path d="M49.26 51.99 C49.26 59.21 49.43 65.29 45.61 71.72 C42.47 76.88 37.50 80.11 31.96 80.11 C24.42 80.11 20.06 74.37 20.06 65.84 C20.06 49.08 35.00 46.12 49.26 46.12 L49.26 51.99 Z M71.97 90.09 C70.82 91.11 69.12 91.19 67.80 90.51 C61.62 85.39 60.55 83.01 57.20 78.07 C46.94 88.60 39.72 91.68 26.38 91.68 C10.66 91.68 -1.63 81.85 -1.63 62.44 C-1.63 47.25 6.57 36.73 18.73 31.74 C29.18 27.26 43.77 26.40 49.26 25.71 L49.26 24.21 C49.26 21.30 49.43 17.81 47.77 15.32 C46.35 13.09 43.54 12.07 41.08 12.07 C36.58 12.07 32.57 14.39 31.58 19.21 C31.37 20.38 30.51 21.53 29.33 21.60 L12.64 19.84 C11.58 19.59 10.41 18.70 10.71 17.10 C14.36 -1.67 31.24 -7.58 46.52 -7.58 C54.42 -7.58 64.66 -5.26 71.04 1.00 C79.27 8.75 78.43 19.09 78.43 30.40 L78.43 55.34 C78.43 63.06 81.74 66.47 84.85 70.71 C85.88 72.17 86.10 73.93 84.77 75.05 C81.36 77.92 75.36 83.13 72.05 86.22 L71.97 90.09 Z"/>
        </svg>
      );
    }
    
    return (
      <span style={{
        fontSize: isMobile ? '13px' : '15px',
        fontWeight: 700,
        color: colors.primaryBlue,
        opacity: 0.5,
        fontStyle: name === 'Etsy' ? 'italic' : 'normal',
      }}>
        {name}
      </span>
    );
  };

  const steps = [
    { num: 1, title: t.step1, sub: t.step1Sub, icon: '🎯' },
    { num: 2, title: t.step2, sub: t.step2Sub, icon: '⚡' },
    { num: 3, title: t.step3, sub: t.step3Sub, icon: '✓' },
    { num: 4, title: t.step4, sub: t.step4Sub, icon: '🛒' },
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo-icon-only.png" alt="Givlyn" style={{ height: '40px', width: 'auto' }} />
            <span style={{ fontSize: '24px', fontWeight: 700, color: colors.primaryBlue, letterSpacing: '-0.5px' }}>
              Givlyn
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%' }}>
            {!isMobile && !user && (
              <a href="/auth?tab=login" style={{ color: colors.textGrey, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', height: '100%' }}>
                {t.login}
              </a>
            )}
            {!user && (
              <a href="/auth?tab=signup" style={{ background: colors.primaryBlue, color: 'white', padding: '10px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                {t.register}
              </a>
            )}
            {user && (
              <button onClick={() => navigate('/dashboard')} style={{ background: colors.actionOrange, color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Dashboard
              </button>
            )}
            <button onClick={toggleLanguage} style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: colors.textGrey, display: 'flex', alignItems: 'center', gap: '4px', padding: '8px' }}>
              <Globe size={16} />
              {language.toUpperCase()} ▾
            </button>
          </nav>
        </div>
      </header>

      {/* HERO COMPACT */}
      <section style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: isMobile ? '16px 16px' : '24px 20px',
        background: colors.bgLight,
      }}>
        <div style={{ maxWidth: '700px', textAlign: 'center', width: '100%' }}>
          <h1 style={{
            fontSize: isMobile ? '22px' : '32px',
            lineHeight: 1.3,
            marginBottom: '10px',
            color: colors.primaryBlue,
            fontWeight: 700,
          }}>
            {t.heroLine1} <span style={{ color: colors.actionOrange }}>{t.heroHighlight}</span>.<br />
            <span style={{ color: colors.primaryBlue }}>{t.heroLine2}</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: colors.textGrey,
            marginBottom: '12px',
            lineHeight: 1.5,
          }}>
            {t.heroSub}<br />
            <strong style={{ color: colors.textDark }}>{t.heroStrong}</strong>
          </p>

          {/* STORE LOGOS STRIP - Grayscale */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '16px' : '28px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}>
            {['amazon', 'Walmart', 'Target', 'eBay', 'Etsy'].map((store, idx) => (
              <StoreLogo key={idx} name={store} />
            ))}
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}>
            <button
              onClick={handleCreateList}
              style={{
                background: colors.actionOrange,
                color: 'white',
                padding: isMobile ? '16px 28px' : '14px 28px',
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
                minHeight: isMobile ? '52px' : 'auto',
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
                padding: isMobile ? '16px 28px' : '14px 28px',
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
                minHeight: isMobile ? '52px' : 'auto',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#EBF4FF'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = colors.bgWhite; }}
            >
              <Search size={18} />
              {t.ctaSecondary}
            </button>
          </div>

          <p style={{ fontSize: '12px', color: colors.textGrey, marginBottom: isMobile ? '16px' : '24px' }}>
            {t.microcopy}
          </p>

          {/* VALUE BAR PRO - Ultra compact list on mobile */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            background: isMobile ? 'transparent' : '#ffffff',
            padding: isMobile ? '0' : '20px 24px',
            borderRadius: isMobile ? '0' : '12px',
            border: isMobile ? 'none' : '1px solid #e5e7eb',
            boxShadow: isMobile ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.04)',
            maxWidth: '900px',
            margin: '0 auto',
            gap: '0',
          }}>
            {[
              { icon: 'check', title: t.val1Title, sub: t.val1Sub },
              { icon: 'dollar', title: t.val2Title, sub: t.val2Sub },
              { icon: 'shield', title: t.val3Title, sub: t.val3Sub },
              { icon: 'lock', title: t.val4Title, sub: t.val4Sub },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '10px' : '12px',
                flex: '1 1 200px',
                padding: isMobile ? '10px 0' : '4px',
                borderBottom: isMobile && idx < 3 ? '1px solid #e8e8e8' : 'none',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1ABC9C" width={isMobile ? "22" : "26"} height={isMobile ? "22" : "26"} style={{ flexShrink: 0 }}>
                  {item.icon === 'check' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>}
                  {item.icon === 'dollar' && <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>}
                  {item.icon === 'shield' && <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>}
                  {item.icon === 'lock' && <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>}
                </svg>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: isMobile ? '13px' : '14px', fontWeight: 700, color: '#1A3E5C', marginBottom: '1px' }}>
                    {item.title}
                  </strong>
                  <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#666666', lineHeight: 1.3, display: 'block' }}>
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{
        background: colors.bgWhite,
        padding: isMobile ? '24px 16px' : '32px 20px',
        borderTop: `1px solid ${colors.border}`,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: 700,
            color: colors.primaryBlue,
            marginBottom: isMobile ? '16px' : '24px',
          }}>
            {t.howItWorks}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '20px',
            marginBottom: isMobile ? '20px' : '28px',
          }}>
            {steps.map((step) => (
              <div key={step.num} style={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'center' : 'center',
                gap: isMobile ? '12px' : '8px',
                padding: isMobile ? '12px 0' : '16px 12px',
                borderBottom: isMobile ? '1px solid #eee' : 'none',
                textAlign: isMobile ? 'left' : 'center',
              }}>
                <div style={{
                  width: isMobile ? '32px' : '40px',
                  height: isMobile ? '32px' : '40px',
                  borderRadius: '50%',
                  background: colors.accentGreen,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: isMobile ? '14px' : '16px',
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{
                    display: 'block',
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: 700,
                    color: colors.primaryBlue,
                    marginBottom: '2px',
                  }}>
                    {step.title}
                  </strong>
                  <span style={{
                    fontSize: isMobile ? '12px' : '13px',
                    color: colors.textGrey,
                  }}>
                    {step.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary CTA after steps */}
          <button
            onClick={handleSmartSearch}
            style={{
              background: colors.accentGreen,
              color: 'white',
              padding: isMobile ? '14px 32px' : '12px 28px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <Search size={18} />
            {t.tryNow}
          </button>
        </div>
      </section>

      {/* TRUST REINFORCEMENT */}
      <section style={{
        background: colors.bgLight,
        padding: isMobile ? '20px 16px' : '24px 20px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: isMobile ? '12px' : '13px',
          color: colors.textGrey,
          marginBottom: '12px',
        }}>
          {t.trustedBy}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '20px' : '32px',
          flexWrap: 'wrap',
          opacity: 0.4,
        }}>
          {['amazon', 'Walmart', 'Target', 'eBay', 'Etsy'].map((store, idx) => (
            <StoreLogo key={idx} name={store} />
          ))}
          <span style={{
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 600,
            color: colors.primaryBlue,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            SSL
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: colors.primaryBlue,
        color: 'white',
        padding: isMobile ? '16px' : '20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>
              {language === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <a href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>
              {language === 'es' ? 'Términos' : 'Terms'}
            </a>
            <a href="mailto:support@givlyn.com" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>
              {language === 'es' ? 'Soporte' : 'Support'}
            </a>
          </div>
          <p style={{ fontSize: '11px', margin: '4px 0', opacity: 0.9 }}>
            Givlyn es un producto de <strong>WINCOVA CORPORATION</strong>.
          </p>
          <p style={{ fontSize: '10px', margin: '4px 0', opacity: 0.7 }}>
            © 2025 Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
