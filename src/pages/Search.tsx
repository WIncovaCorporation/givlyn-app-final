import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search as SearchIcon, Sparkles, TrendingUp, Gift, ShoppingBag } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Search = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const quickSearches = [
    { 
      icon: Gift, 
      label: language === 'es' ? 'Regalos para Cumpleaños' : 'Birthday Gifts',
      query: language === 'es' ? 'regalo cumpleaños' : 'birthday gift'
    },
    { 
      icon: TrendingUp, 
      label: language === 'es' ? 'Más Populares' : 'Trending Now',
      query: language === 'es' ? 'productos populares' : 'trending products'
    },
    { 
      icon: ShoppingBag, 
      label: language === 'es' ? 'Ofertas del Día' : "Today's Deals",
      query: language === 'es' ? 'ofertas del día' : 'daily deals'
    },
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3E5C]"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1ABC9C]/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-[#1ABC9C]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A3E5C] mb-2">
            {language === 'es' 
              ? 'Buscar Regalo Inteligente' 
              : 'Smart Gift Search'}
          </h1>
          <p className="text-gray-600">
            {language === 'es'
              ? 'Nuestra IA compara precios en Amazon, Walmart, Target y más'
              : 'Our AI compares prices across Amazon, Walmart, Target and more'}
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="mb-8"
        >
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'es' 
                ? '¿Qué estás buscando? Ej: "Regalo para mamá"' 
                : 'What are you looking for? E.g., "Gift for mom"'}
              className="pl-12 pr-4 py-6 text-base rounded-xl border-2 border-gray-200 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]/20"
            />
          </div>
          <Button 
            type="submit"
            disabled={!searchQuery.trim()}
            className="w-full mt-4 py-6 text-base font-semibold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90"
          >
            <SearchIcon className="w-5 h-5 mr-2" />
            {language === 'es' ? 'Buscar con IA' : 'Search with AI'}
          </Button>
        </form>

        <div className="space-y-3">
          <p className="text-sm text-gray-500 text-center mb-4">
            {language === 'es' ? 'Búsquedas rápidas' : 'Quick searches'}
          </p>
          {quickSearches.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSearch(item.query)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1ABC9C] hover:shadow-md transition-all card-hover-lift"
            >
              <div className="w-10 h-10 bg-[#1A3E5C]/5 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[#1A3E5C]" />
              </div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          {language === 'es' 
            ? 'Comparamos precios en 500+ tiendas para encontrar la mejor oferta' 
            : 'We compare prices across 500+ stores to find the best deal'}
        </p>
    </div>
  );
};

export default Search;
