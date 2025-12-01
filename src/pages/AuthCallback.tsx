import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Completando autenticación...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.error("Auth callback error:", error);
          navigate("/auth");
          return;
        }

        setStatus("Verificando tu cuenta...");

        const { data: lists } = await supabase
          .from("gift_lists")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1);

        if (lists && lists.length > 0) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding/welcome");
        }
      } catch (err) {
        console.error("Callback error:", err);
        navigate("/dashboard");
      }
    };

    const timer = setTimeout(handleCallback, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3E5C]" />
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
