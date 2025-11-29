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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
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
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/update-password`,
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
    "5+ tiendas conectadas simultáneamente", 
    "Notificaciones de descuentos automáticas"
  ] : [
    "Price comparison in seconds",
    "5+ stores connected simultaneously",
    "Automatic discount notifications"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE - VALUE PROPOSITION */}
        <div className="bg-gradient-to-br from-primary to-red-700 text-white p-8 md:p-12 flex flex-col justify-between order-2 md:order-1">
          <div>
            <a href="/" className="inline-block mb-6">
              <img 
                src="/givlyn-logo.png" 
                alt="Givlyn" 
                className="w-16 h-16 object-contain bg-white/20 rounded-xl p-2"
              />
            </a>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              {language === 'es' ? 'Ahorra Dinero en Cada Compra' : 'Save Money on Every Purchase'}
            </h1>
            
            <p className="text-white/90 mb-8 leading-relaxed">
              {language === 'es' 
                ? 'Compara precios automáticamente en Amazon, Walmart, Target y más. Ahorra hasta 40%.'
                : 'Automatically compare prices on Amazon, Walmart, Target and more. Save up to 40%.'}
            </p>

            <div className="space-y-4 mb-8">
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

          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
            <p className="text-lg font-bold mb-1">5,000+ {language === 'es' ? 'usuarios' : 'users'}</p>
            <p className="text-sm text-white/90">
              {language === 'es' 
                ? 'ahorran en promedio $450 mensualmente con Givlyn'
                : 'save an average of $450 monthly with Givlyn'}
            </p>
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
                    className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/30"
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
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {isSignUp 
                    ? (language === 'es' ? 'Crear Cuenta' : 'Create Account')
                    : (language === 'es' ? 'Bienvenido de Nuevo' : 'Welcome Back')}
                </h2>
                <p className="text-gray-500 text-sm">
                  {isSignUp 
                    ? (language === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? ')
                    : (language === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? ")}
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setEmail("");
                      setPassword("");
                      setDisplayName("");
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    {isSignUp 
                      ? (language === 'es' ? 'Inicia sesión aquí' : 'Sign in here')
                      : (language === 'es' ? 'Crea una gratis aquí' : 'Create one free here')}
                  </button>
                </p>
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
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
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
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
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
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
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
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
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
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  disabled={loading}
                >
                  {loading 
                    ? (language === 'es' ? 'Procesando...' : 'Processing...')
                    : (
                      <span className="flex items-center justify-center gap-2">
                        {isSignUp 
                          ? (language === 'es' ? 'Crear Cuenta' : 'Create Account')
                          : (language === 'es' ? 'Iniciar Sesión' : 'Sign In')}
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-500">
                    {language === 'es' ? 'O continúa con' : 'Or continue with'}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-200 hover:bg-gray-50 font-semibold"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {language === 'es' ? 'Continuar con Google' : 'Continue with Google'}
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <LockIcon className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Encriptado 256-bit' : '256-bit Encrypted'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5" />
                  <span>GDPR Compliant</span>
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
