import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AIShoppingAssistant } from "./AIShoppingAssistant";
import { useLocation } from "react-router-dom";

export const AuthenticatedAIAssistant = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const publicRoutes = ['/', '/auth', '/privacy', '/terms', '/contact', '/dmca', '/how-it-works', '/pricing'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!isAuthenticated || isPublicRoute) {
    return null;
  }

  return <AIShoppingAssistant />;
};
