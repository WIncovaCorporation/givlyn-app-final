import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Search, Gift, Globe, ShoppingBag, Tag, Shield, CheckCircle } from "lucide-react";

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
      heroLine1: 'Organiza Regalos.',
      heroHighlight: 'Mejor Precio',
      heroLine2: 'Garantia de Tienda Oficial.',
      heroSub: 'Crea tu lista en 3 min. Compra en mas de 500 tiendas.',
      heroStrong: 'Nosotros solo te ayudamos a ahorrar.',
      ctaPrimary: 'CREAR LISTA GRATIS',
      ctaSecondary: 'Buscar Regalo Inteligente',
      microcopy: 'Sin tarjeta de credito. 100% Seguro.',
      howItWorks: 'Como Funciona',
      step1: 'Dinos que buscas',
      step1Sub: 'Regalo, ocasion o presupuesto',
      step2: 'Comparamos precios',
      step2Sub: 'En +500 tiendas al instante',
      step3: 'Elige tu favorito',
      step3Sub: 'Mejor precio garantizado',
      step4: 'Compra directo',
      step4Sub: 'En la tienda oficial',
      tryNow: 'Probar Ahora',
      login: 'Iniciar sesion',
      register: 'Registrarse',
      footerProduct: 'Givlyn es un producto de',
      footerRights: 'Todos los derechos reservados.',
    },
    en: {
      heroLine1: 'Organize Gifts.',
      heroHighlight: 'Best Price',
      heroLine2: 'Official Store Guarantee.',
      heroSub: 'Create your list in 3 min. Shop at 500+ stores.',
      heroStrong: 'We just help you save.',
      ctaPrimary: 'CREATE FREE LIST',
      ctaSecondary: 'Smart Gift Search',
      microcopy: 'No credit card. 100% Secure.',
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
    border: '#E5E7EB',
  };

  const StoreLogo = ({ name }: { name: string }) => {
    const logoStyle = {
      height: isMobile ? '14px' : '18px',
      opacity: 0.5,
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
        fontSize: isMobile ? '12px' : '14px',
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
      background: colors.bgLight,
    }}>
      {/* HEADER - Compact */}
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
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo-icon-only.png" alt="Givlyn" style={{ height: '36px', width: 'auto' }} />
            <span style={{ fontSize: '22px', fontWeight: 700, color: colors.primaryBlue, letterSpacing: '-0.5px' }}>
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
                transition: 'all 0.2s ease',
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

      {/* MAIN CONTENT - Smart Grid Layout */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '20px 16px' : '24px 32px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* SMART GRID: 2 Columns on Desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '24px' : '48px',
          alignItems: 'center',
        }}>
          {/* LEFT COLUMN: Hero Content */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              lineHeight: 1.2,
              marginBottom: '12px',
              color: colors.primaryBlue,
              fontWeight: 700,
            }}>
              {t.heroLine1} <span style={{ color: colors.actionOrange }}>{t.heroHighlight}</span>.<br />
              <span style={{ fontSize: isMobile ? '24px' : '32px', color: colors.textDark }}>{t.heroLine2}</span>
            </h1>

            <p style={{
              fontSize: isMobile ? '15px' : '17px',
              color: colors.textGrey,
              marginBottom: '20px',
              lineHeight: 1.6,
            }}>
              {t.heroSub}<br />
              <strong style={{ color: colors.textDark }}>{t.heroStrong}</strong>
            </p>

            {/* Store Logos Strip */}
            <div style={{
              display: 'flex',
              justifyContent: isMobile ? 'center' : 'flex-start',
              alignItems: 'center',
              gap: isMobile ? '16px' : '24px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}>
              {['amazon', 'Walmart', 'Target', 'eBay', 'Etsy'].map((store, idx) => (
                <span key={idx}><StoreLogo name={store} /></span>
              ))}
            </div>

            {/* CTAs - Big & Bold */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <button
                onClick={handleCreateList}
                style={{
                  background: `linear-gradient(135deg, ${colors.actionOrange} 0%, ${colors.actionOrangeHover} 100%)`,
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: cardShadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '56px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = cardShadowHover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = cardShadow;
                }}
              >
                <Gift size={20} />
                {t.ctaPrimary}
              </button>
              <button
                onClick={handleSmartSearch}
                style={{
                  background: colors.bgWhite,
                  color: colors.primaryBlue,
                  padding: '16px 32px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: cardShadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '56px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = cardShadowHover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = cardShadow;
                }}
              >
                <Search size={20} />
                {t.ctaSecondary}
              </button>
            </div>

            <p style={{ fontSize: '13px', color: colors.textGrey }}>
              {t.microcopy}
            </p>

            {/* Trust Badges - Inline */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '20px',
              justifyContent: isMobile ? 'center' : 'flex-start',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: Shield, label: 'SSL' },
                { icon: CheckCircle, label: 'GDPR' },
                { icon: CheckCircle, label: 'CCPA' },
              ].map((badge, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: colors.bgWhite,
                  borderRadius: '20px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}>
                  <badge.icon size={14} color={colors.accentGreen} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textDark }}>
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: How It Works - Smart Grid 2x2 */}
          <div>
            <h2 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: colors.primaryBlue,
              marginBottom: '20px',
              textAlign: isMobile ? 'center' : 'left',
            }}>
              {t.howItWorks}
            </h2>
            
            {/* 2x2 Grid for Steps */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}>
              {steps.map((step, idx) => (
                <div
                  key={step.num}
                  style={{
                    background: colors.bgWhite,
                    borderRadius: '16px',
                    padding: '20px',
                    minHeight: '180px',
                    boxShadow: cardShadow,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = cardShadowHover;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = cardShadow;
                  }}
                  onClick={handleSmartSearch}
                >
                  {/* Large Icon - 80px */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, ${colors.accentGreen}15 0%, ${colors.accentGreen}25 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}>
                    <step.Icon size={40} color={colors.accentGreen} strokeWidth={1.5} />
                  </div>
                  
                  {/* Step Number Badge */}
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
                    marginBottom: '8px',
                  }}>
                    {step.num}
                  </div>

                  {/* Title - Big & Bold */}
                  <strong style={{
                    display: 'block',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.textDark,
                    marginBottom: '4px',
                    lineHeight: 1.3,
                  }}>
                    {step.title}
                  </strong>
                  
                  {/* Description */}
                  <span style={{
                    fontSize: '14px',
                    color: colors.textGrey,
                    lineHeight: 1.5,
                  }}>
                    {step.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Secondary CTA */}
            <button
              onClick={handleSmartSearch}
              style={{
                width: '100%',
                marginTop: '20px',
                background: `linear-gradient(135deg, ${colors.accentGreen} 0%, #16A085 100%)`,
                color: 'white',
                padding: '14px 28px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: cardShadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = cardShadowHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = cardShadow;
              }}
            >
              <Search size={18} />
              {t.tryNow}
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER - Minimal */}
      <footer style={{
        background: colors.primaryBlue,
        color: 'white',
        padding: '16px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px', 
            marginBottom: '8px', 
            flexWrap: 'wrap',
          }}>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '12px' }}>
              {language === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '12px' }}>
              {language === 'es' ? 'Terminos' : 'Terms'}
            </a>
            <a href="mailto:support@givlyn.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '12px' }}>
              {language === 'es' ? 'Soporte' : 'Support'}
            </a>
          </div>
          <p style={{ fontSize: '11px', margin: '4px 0', opacity: 0.8 }}>
            {t.footerProduct} <strong>WINCOVA CORPORATION</strong>. {t.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
