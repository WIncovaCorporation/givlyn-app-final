import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ProfileMenu } from "./ProfileMenu";
import LanguageSelector from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface GlobalHeaderProps {
  variant?: "default" | "minimal";
}

export const GlobalHeader = ({ variant = "default" }: GlobalHeaderProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img 
            src="/logo-icon-only.png" 
            alt="Givlyn" 
            className="w-8 h-8 object-contain"
          />
          {variant === "default" && (
            <span className="text-lg font-semibold text-[#1A3E5C]">Givlyn</span>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          {!loading && (
            user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                size="sm"
                className="bg-[#1A3E5C] hover:bg-[#1A3E5C]/90"
              >
                {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
