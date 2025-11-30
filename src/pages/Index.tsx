import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

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
      navigate("/dashboard");
    } else {
      navigate("/auth?tab=signup");
    }
  };

  const handleSmartSearch = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth?tab=signup");
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const handleBack = () => {
    if (document.referrer && document.referrer !== window.location.href) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const content = {
    es: {
      heroTitle: 'Organiza Regalos.',
      heroHighlight: 'Mejor Precio',
      heroSubtitle: 'Sin Intermediarios.',
      heroDesc: 'En 3 minutos. Gratis.',
      heroDesc2: 'Compra donde ya compras (Amazon, Walmart, etc).',
      ctaBtn: '🎁 CREAR LISTA GRATIS',
      trustTitle: '¿Por qué Givlyn?',
      trust1Title: 'Compra directa en tiendas',
      trust1Desc: 'Amazon, Walmart, MercadoLibre. Tú eliges.',
      trust2Title: 'Mejor precio garantizado',
      trust2Desc: 'Si encuentras más barato, reembolsamos diferencia.',
      trust3Title: 'Protección si algo falla',
      trust3Desc: 'Producto no llega? Dañado? Nosotros pagamos.',
      trust4Title: 'Seguridad real',
      trust4Desc: 'SSL 256-bit | GDPR | CCPA. Tus datos están seguros.',
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
      heroDesc: 'In 3 minutes. Free.',
      heroDesc2: 'Buy where you already shop (Amazon, Walmart, etc).',
      ctaBtn: '🎁 CREATE FREE LIST',
      trustTitle: 'Why Givlyn?',
      trust1Title: 'Buy direct from stores',
      trust1Desc: 'Amazon, Walmart, MercadoLibre. You choose.',
      trust2Title: 'Best price guaranteed',
      trust2Desc: 'Find it cheaper? We refund the difference.',
      trust3Title: 'Protection if something fails',
      trust3Desc: "Product doesn't arrive? Damaged? We pay.",
      trust4Title: 'Real security',
      trust4Desc: 'SSL 256-bit | GDPR | CCPA. Your data is safe.',
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

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#f8f8f8',
      color: '#1a3e3e',
      lineHeight: 1.6,
      minHeight: '100vh',
    }}>
      {/* HEADER */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#E53935',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            💰 Givlyn
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
                background: '#E53935',
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
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* HERO */}
        <section style={{
          textAlign: 'center',
          marginBottom: '48px',
          padding: '32px 16px',
        }}>
          <h1 style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            lineHeight: 1.3,
            marginBottom: '16px',
            color: '#1a3e3e',
          }}>
            💰 {t.heroTitle}<br />
            {language === 'es' ? 'Consigue ' : 'Get '}
            <span style={{ color: '#E53935', fontWeight: 700 }}>{t.heroHighlight}</span>.<br />
            {t.heroSubtitle}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}>
            {t.heroDesc}<br />
            {t.heroDesc2}
          </p>
          <button
            onClick={handleCreateList}
            style={{
              display: 'inline-block',
              background: '#E53935',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#C62828';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(229, 57, 53, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#E53935';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {t.ctaBtn}
          </button>
        </section>

        {/* TRUST SECTION */}
        <section style={{
          background: 'white',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid #e0e0e0',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#1a3e3e',
          }}>
            {t.trustTitle}
          </div>
          
          {[
            { icon: '✅', title: t.trust1Title, desc: t.trust1Desc },
            { icon: '✅', title: t.trust2Title, desc: t.trust2Desc },
            { icon: '✅', title: t.trust3Title, desc: t.trust3Desc },
            { icon: '🔒', title: t.trust4Title, desc: t.trust4Desc },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              marginBottom: idx === 3 ? 0 : '16px',
              alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>
                {item.icon}
              </div>
              <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', color: '#1a3e3e', marginBottom: '4px' }}>
                  {item.title}
                </strong>
                <span style={{ color: '#666' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px',
            color: '#1a3e3e',
            textAlign: 'center',
          }}>
            {t.howTitle}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {[
              { num: '1️⃣', text: t.step1 },
              { num: '2️⃣', text: t.step2 },
              { num: '3️⃣', text: t.step3 },
              { num: '4️⃣', text: t.step4 },
            ].map((step, idx) => (
              <div key={idx} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#E53935',
                  marginBottom: '8px',
                }}>
                  {step.num}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: 1.4,
                }}>
                  {step.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECONDARY CTA */}
        <section style={{
          textAlign: 'center',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '16px',
          }}>
            {t.secondaryCta}
          </div>
          <button
            onClick={handleSmartSearch}
            style={{
              color: '#E53935',
              textDecoration: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              padding: 0,
            }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {t.searchBtn}
          </button>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{
        background: 'linear-gradient(135deg, #1a3e3e 0%, #2a4e4e 100%)',
        color: 'white',
        padding: '24px',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '40px',
      }}>
        <div style={{ marginBottom: '16px' }}>
          <a href="/privacy" style={{ color: '#4CAF50', textDecoration: 'none', margin: '0 8px' }}>Privacy</a>
          <a href="/terms" style={{ color: '#4CAF50', textDecoration: 'none', margin: '0 8px' }}>Términos</a>
          <a href="/contact" style={{ color: '#4CAF50', textDecoration: 'none', margin: '0 8px' }}>Contacto</a>
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '8px',
        }}>
          🔐 SSL 256-bit | GDPR Compliant | CCPA | LFPDPPP
        </div>
        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
          WINCOVA CORPORATION • help@givlyn.com
        </div>
      </footer>
    </div>
  );
};

export default Index;
