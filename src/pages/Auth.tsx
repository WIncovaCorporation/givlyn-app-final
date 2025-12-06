import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Shield, Lock as LockIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://6b9c1a69-6237-418b-98d9-5a01b8293082-00-3dqe4a6gwn7z9.worf.replit.dev';
  }
  
  if (hostname.includes('givlyn.com')) {
    return 'https://www.givlyn.com';
  }
  
  return window.location.origin;
};

const Auth = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast.error(t("auth.nameRequired"));
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = getBaseUrl();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
          emailRedirectTo: `${baseUrl}/dashboard`,
        },
      });

      if (error) throw error;

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("Este correo ya está registrado. Inicia sesión o recupera tu contraseña.");
        return;
      }

      toast.success("¡Cuenta creada! Revisa tu correo para confirmar.");
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error: any) {
      if (error.message.includes("already registered") || error.message.includes("User already registered")) {
        toast.error("Este correo ya está registrado. Inicia sesión o recupera tu contraseña.");
      } else {
        toast.error(error.message || "Error al crear cuenta. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    if (!password) {
      toast.error("Por favor ingresa tu contraseña");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      toast.success("¡Bienvenido de nuevo!");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("Invalid") || error.message.includes("credentials")) {
        toast.error("Correo o contraseña incorrectos");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Confirma tu correo antes de iniciar sesión.");
      } else {
        toast.error(error.message || "Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const baseUrl = getBaseUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error("Error al conectar con Google. Intenta nuevamente.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = resetEmail.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = getBaseUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${baseUrl}/update-password`,
      });

      if (error) throw error;

      toast.success("Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo.");
      setShowResetPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast.error(error.message || "Error al enviar correo.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = language === 'es' ? [
    "Comparación de precios en segundos",
    "500+ tiendas conectadas", 
    "Compra directa en la tienda oficial"
  ] : [
    "Price comparison in seconds",
    "500+ connected stores",
    "Buy direct from the official store"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE - VALUE PROPOSITION - Blue/Green Gradient */}
        <div 
          className="text-white p-8 md:p-12 flex flex-col justify-between order-2 md:order-1"
          style={{
            background: 'linear-gradient(135deg, #1A3E5C 0%, #1ABC9C 100%)',
          }}
        >
          <div>
            <a href="/" className="inline-block mb-6">
              <img 
                src="/logo-icon-only.png" 
                alt="Givlyn" 
                className="w-14 h-14 object-contain bg-white/20 rounded-xl p-2"
              />
            </a>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              {language === 'es' ? 'Encuentra el Mejor Precio' : 'Find the Best Price'}
            </h1>
            
            <p className="text-white/90 mb-8 leading-relaxed">
              {language === 'es' 
                ? 'Compara precios en Amazon, Walmart, Target y más. Compra directo en la tienda oficial.'
                : 'Compare prices on Amazon, Walmart, Target and more. Buy direct from the official store.'}
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Store logos instead of fake metrics */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-xs text-white/70 mb-3">
              {language === 'es' ? 'Compara precios en:' : 'Compare prices at:'}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold">Amazon,</span>
              <span className="text-sm font-semibold">Walmart,</span>
              <span className="text-sm font-semibold">Target,</span>
              <span className="text-sm font-semibold">eBay</span>
              <span className="text-sm italic text-white/70">
                {language === 'es' ? 'y muchas tiendas más...' : 'and many more stores...'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2">
          {showResetPassword ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {language === 'es' ? 'Recuperar Contraseña' : 'Reset Password'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {language === 'es' 
                    ? 'Te enviaremos un enlace para crear una nueva contraseña'
                    : "We'll send you a link to create a new password"}
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    {language === 'es' ? 'Correo Electrónico' : 'Email'}
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-[#1A3E5C] focus:ring-[#1A3E5C]/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 font-semibold shadow-lg"
                    style={{ backgroundColor: '#1A3E5C' }}
                    disabled={loading}
                  >
                    {loading ? (language === 'es' ? 'Enviando...' : 'Sending...') : (language === 'es' ? 'Enviar enlace' : 'Send link')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="h-12 px-6"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetEmail("");
                    }}
                  >
                    {language === 'es' ? 'Volver' : 'Back'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Unified Title */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'es' ? 'Ingresa o Regístrate' : 'Sign In or Sign Up'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {language === 'es' ? 'en segundos' : 'in seconds'}
                </p>
              </div>

              {/* GOOGLE BUTTON - PRIORITY (Top Position) */}
              <button
                type="button"
                className="w-full h-14 font-medium text-base rounded-full transition-all duration-200 flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {language === 'es' ? 'Continuar con Google' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-400">
                    {language === 'es' ? 'o' : 'or'}
                  </span>
                </div>
              </div>

              {/* Email Option Button */}
              {!showEmailForm ? (
                <button
                  type="button"
                  className="w-full h-12 border border-gray-300 rounded-lg font-medium transition-all bg-white hover:bg-[#f7f7f7] hover:border-gray-400 flex items-center justify-center gap-2 text-gray-700"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail className="w-4 h-4" />
                  {language === 'es' ? 'Continuar con Correo' : 'Continue with Email'}
                </button>
              ) : (
                <>
                  {/* Toggle Login/Signup */}
                  <div className="flex justify-center">
                    <div className="inline-flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setIsSignUp(false)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                          !isSignUp 
                            ? 'bg-white text-gray-800 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {language === 'es' ? 'Ingresar' : 'Sign In'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                          isSignUp 
                            ? 'bg-white text-gray-800 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {language === 'es' ? 'Registrarse' : 'Sign Up'}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {language === 'es' ? 'Nombre' : 'Name'}
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="pl-10 h-12 border-gray-200 focus:border-[#1A3E5C] focus:ring-[#1A3E5C]/20"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                        {language === 'es' ? 'Correo Electrónico' : 'Email'}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 h-12 border-gray-200 focus:border-[#1A3E5C] focus:ring-[#1A3E5C]/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                          {language === 'es' ? 'Contraseña' : 'Password'}
                        </Label>
                        {!isSignUp && (
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(true)}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: '#1ABC9C' }}
                          >
                            {language === 'es' ? '¿Olvidaste?' : 'Forgot?'}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#1A3E5C] focus:ring-[#1A3E5C]/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: '#FF9900' }}
                      disabled={loading}
                    >
                      {loading 
                        ? (language === 'es' ? 'Procesando...' : 'Processing...')
                        : (
                          <span className="flex items-center justify-center gap-2">
                            {language === 'es' ? 'Continuar' : 'Continue'}
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                    </Button>
                  </form>

                  {/* Back to options */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false);
                      setEmail("");
                      setPassword("");
                      setDisplayName("");
                    }}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    {language === 'es' ? '← Otras opciones' : '← Other options'}
                  </button>
                </>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <LockIcon className="w-3.5 h-3.5" style={{ color: '#1ABC9C' }} />
                  <span>SSL</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5" style={{ color: '#1ABC9C' }} />
                  <span>GDPR</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5" style={{ color: '#1ABC9C' }} />
                  <span>CCPA</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
