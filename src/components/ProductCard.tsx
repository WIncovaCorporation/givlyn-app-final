import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface ProductCardData {
  name: string;
  price: string;
  store: string;
  link: string;
  reason?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: ProductCardData;
}


export const ProductCard = ({ product }: ProductCardProps) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handleAddToList = () => {
    toast.success(`"${product.name}" guardado`, {
      description: 'Añadido a tus ideas de regalo',
      duration: 2000,
    });
  };

  const handleBuyClick = async () => {
    setIsGeneratingLink(true);
    
    try {
      // Generar affiliate link de Wincova
      const { data, error } = await supabase.functions.invoke('generate-external-affiliate-link', {
        body: {
          product_url: product.link,
          store: product.store,
          product_name: product.name,
          price: product.price,
        }
      });

      if (error) throw error;

      // Abrir link con código de afiliado
      window.open(data.affiliate_url, '_blank');
      
    } catch (error) {
      console.error('Error generating affiliate link:', error);
      // Fallback: abrir link original (aunque no sea ideal)
      window.open(product.link, '_blank');
      toast.error("Error al generar enlace de afiliado");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // Store color mapping
  const storeColors: Record<string, string> = {
    amazon: "bg-orange-500",
    walmart: "bg-blue-500",
    target: "bg-red-500",
    etsy: "bg-orange-600",
    ebay: "bg-blue-600",
  };

  const storeColor = storeColors[product.store.toLowerCase()] || "bg-primary";

  return (
    <Card className="group overflow-hidden hover:shadow-large hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border hover:border-primary/30">
      {/* Product Image */}
      {product.image && (
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${storeColor} text-white text-xs px-2 py-1 shadow-md`}>
              {product.store}
            </Badge>
          </div>
          {product.rating && (
            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              ⭐ {product.rating.toFixed(1)}
              {product.reviewCount && (
                <span className="text-gray-300">({product.reviewCount.toLocaleString()})</span>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {/* Header: Name + Price */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
            {product.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-2xl">
              {product.price}
            </span>
            {!product.image && (
              <Badge className={`${storeColor} text-white text-xs px-2 py-1`}>
                {product.store}
              </Badge>
            )}
          </div>
        </div>

        {/* Reason */}
        {product.reason && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            ✨ {product.reason}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            className="flex-1 h-9 text-sm font-medium shadow-md hover:shadow-glow hover:scale-105 transition-all duration-200 group/btn"
            onClick={handleBuyClick}
            disabled={isGeneratingLink}
          >
            {isGeneratingLink ? (
              <span className="shimmer-bg animate-shimmer">Cargando...</span>
            ) : (
              <>
                Ver en {product.store}
                <ExternalLink className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-primary/10 hover:border-primary hover:scale-110 transition-all duration-200"
            onClick={handleAddToList}
            title="Guardar"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
