import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductCard, ProductCardData } from "./ProductCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchingProgress } from "./SearchingProgress";
import { TypingIndicator } from "./TypingIndicator";

// Parse products from AI message
const parseProducts = (text: string): ProductCardData[] => {
  const products: ProductCardData[] = [];
  const productRegex = /\[PRODUCT\]([\s\S]*?)\[\/PRODUCT\]/g;
  let match;

  while ((match = productRegex.exec(text)) !== null) {
    const productText = match[1];
    const nameMatch = productText.match(/name:\s*(.+)/i) || productText.match(/nombre:\s*(.+)/i);
    const priceMatch = productText.match(/price:\s*(.+)/i) || productText.match(/precio:\s*(.+)/i);
    const storeMatch = productText.match(/store:\s*(.+)/i) || productText.match(/tienda:\s*(.+)/i);
    const linkMatch = productText.match(/link:\s*(.+)/i);
    const reasonMatch = productText.match(/reason:\s*(.+)/i) || productText.match(/razon:\s*(.+)/i);
    const imageMatch = productText.match(/image:\s*(.+)/i) || productText.match(/imagen:\s*(.+)/i);
    const ratingMatch = productText.match(/rating:\s*(.+)/i) || productText.match(/calificacion:\s*(.+)/i);
    const reviewCountMatch = productText.match(/reviews?:\s*(\d+)/i);

    if (nameMatch && priceMatch && storeMatch && linkMatch) {
      products.push({
        name: nameMatch[1].trim(),
        price: priceMatch[1].trim(),
        store: storeMatch[1].trim(),
        link: linkMatch[1].trim(),
        reason: reasonMatch ? reasonMatch[1].trim() : "",
        image: imageMatch ? imageMatch[1].trim() : undefined,
        rating: ratingMatch ? parseFloat(ratingMatch[1]) : undefined,
        reviewCount: reviewCountMatch ? parseInt(reviewCountMatch[1]) : undefined,
      });
    }
  }

  return products;
};

// Remove product tags AND long explanatory text after products
const cleanAssistantMessage = (text: string): string => {
  // Remove product blocks
  let cleaned = text.replace(/\[PRODUCT\][\s\S]*?\[\/PRODUCT\]/g, '').trim();
  
  // If message has products, keep only intro (before first product) and outro (after last product)
  const lines = cleaned.split('\n').filter(line => line.trim());
  
  // Keep max 5 lines of text to avoid walls of text
  if (lines.length > 5) {
    return lines.slice(0, 2).join('\n') + '\n\n' + lines.slice(-3).join('\n');
  }
  
  return cleaned;
};

// Function to render text with links as plain text (not clickable)
// Extract product name from URL (simplified metadata extraction)
const extractProductNameFromUrl = (url: string): string => {
  try {
    // Remove protocol and domain
    const path = url.replace(/^https?:\/\/[^\/]+\//, '');
    
    // Extract product slug (usually after /dp/, /p/, /itm/, etc.)
    const productMatch = path.match(/(?:dp|p|itm|product)\/([^\/\?]+)/i);
    if (productMatch) {
      // Decode and clean product title from URL
      const cleaned = decodeURIComponent(productMatch[1])
        .replace(/[-_]/g, ' ')
        .replace(/\b[A-Z0-9]{10,}\b/g, '') // Remove product IDs
        .trim();
      return cleaned || 'Producto';
    }
    
    // Fallback: use first path segment
    const firstSegment = path.split(/[\/\?]/)[0];
    return decodeURIComponent(firstSegment).replace(/[-_]/g, ' ').slice(0, 50) || 'Producto';
  } catch {
    return 'Producto';
  }
};

const renderMessageWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <span
          key={index}
          className="text-muted-foreground font-mono text-xs break-all italic"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

type Message = {
  role: "user" | "assistant";
  content: string;
  products?: ProductCardData[];
};

export const AIShoppingAssistant = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Separate flag for product search
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [flowProgress, setFlowProgress] = useState({ current: 0, total: 0 });
  const [pendingLinkComparison, setPendingLinkComparison] = useState<string | null>(null); // Link waiting for comparison decision
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize messages with current language
  const initialMessage = {
    role: "assistant" as const,
    content: language === 'es' 
      ? "¡Hola! 👋 Soy tu asistente personal de compras.\n\nTe ayudo a encontrar los mejores precios comparando en Amazon, Walmart, Target, Etsy y eBay 💰\n\n¿Qué estás buscando hoy?"
      : "Hey there! 👋 I'm your personal shopping assistant.\n\nI help you find the best prices by comparing Amazon, Walmart, Target, Etsy and eBay 💰\n\nWhat are you looking for today?",
  };
  
  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  // Load AI usage tracking when opening chat
  useEffect(() => {
    if (isOpen) {
      loadAIUsage();
    }
  }, [isOpen]);

  const loadAIUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin
      const { data: userRoles } = await supabase.rpc('get_user_roles', {
        _user_id: user.id
      });
      
      const isAdmin = userRoles?.some((r: any) => r.role === 'admin') || false;

      // Admins have unlimited usage
      if (isAdmin) {
        setRemaining(999);
        setIsLimitReached(false);
        console.log('✨ ADMIN MODE: Unlimited AI searches');
        return;
      }

      // Regular users: check usage
      const { data: usage } = await supabase
        .from('ai_usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_type', 'shopping_assistant')
        .maybeSingle();

      const usageCount = usage?.usage_count || 0;
      const remainingCount = Math.max(0, 10 - usageCount);
      setRemaining(remainingCount);
      setIsLimitReached(remainingCount === 0);
    } catch (error) {
      console.error('Error loading AI usage:', error);
    }
  };

  // Listen for external open requests
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openAIChat', handleOpenChat);
    return () => window.removeEventListener('openAIChat', handleOpenChat);
  }, []);

  // Update initial message when language changes
  useEffect(() => {
    const newInitialMessage = {
      role: "assistant" as const,
      content: language === 'es' 
        ? "¡Hola! 👋 Soy tu asistente personal de compras.\n\nTe ayudo a encontrar los mejores precios comparando en Amazon, Walmart, Target, Etsy y eBay 💰\n\n¿Qué estás buscando hoy?"
        : "Hey there! 👋 I'm your personal shopping assistant.\n\nI help you find the best prices by comparing Amazon, Walmart, Target, Etsy and eBay 💰\n\nWhat are you looking for today?",
    };
    setMessages([newInitialMessage]);
    setFlowProgress({ current: 0, total: 0 });
  }, [language]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChatWithDisplay = async (backendMessage: string, displayMessage: string) => {
    setIsLoading(true);
    
    const messagesForBackend = [...messages, { role: "user" as const, content: backendMessage }];
    const messagesForDisplay = [...messages, { role: "user" as const, content: displayMessage }];
    setMessages(messagesForDisplay);
    setInput("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Use configured backend URL (production) or same-origin proxy (development)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
      
      const response = await fetch(
        `${backendUrl}/api/ai-shopping-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({
            messages: messagesForBackend,
            userId: user?.id,
            language: language,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        
        // Handle 429 rate limit error
        if (response.status === 429) {
          if (errorData.code === 'RATE_LIMIT') {
            // Gemini API rate limit - temporary
            toast.error(errorData.error || '⏰ Cuota de Gemini agotada', {
              description: errorData.details || 'Espera 1 minuto y reintenta',
              duration: 8000
            });
          } else {
            // User daily limit
            setIsLimitReached(true);
            setRemaining(0);
            toast.error(errorData.error || "Límite diario alcanzado", {
              description: errorData.reset_at 
                ? `Se restablecerá: ${errorData.reset_at}`
                : "Vuelve mañana o actualiza tu plan",
              duration: 5000
            });
          }
          throw new Error(errorData.error || "Rate limit exceeded");
        }
        
        // Handle 403 invalid API key
        if (response.status === 403) {
          toast.error('Error de configuración', {
            description: errorData.error || 'Contacta al administrador',
            duration: 6000
          });
          throw new Error(errorData.error || "Invalid API key");
        }
        
        let errorMsg = language === 'en' 
          ? "Could not connect to the assistant. Please try again."
          : "No pude conectar con el asistente. Intenta de nuevo.";
        
        throw new Error(errorMsg);
      }

      const data = await response.json().catch(() => null);

      if (!data || !data.message) {
        console.error('⚠️ No se recibió texto del asistente o formato inesperado', data);
        toast.error('No se recibió respuesta del asistente', {
          description: 'Por favor intenta de nuevo',
        });
        setMessages(messagesForDisplay);
        return;
      }

      const fullText = data.message as string;
      const products = parseProducts(fullText);
      const cleanContent = cleanAssistantMessage(fullText);

      setMessages([
        ...messagesForDisplay,
        {
          role: 'assistant',
          content: cleanContent || fullText,
          products: products.length > 0 ? products : undefined,
        },
      ]);
    } catch (error) {
      console.error('❌ FULL ERROR DETAILS:', error);
      console.error('❌ ERROR TYPE:', typeof error);
      console.error('❌ ERROR JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      const errorMsg = error instanceof Error
        ? error.message
        : language === 'en'
          ? 'Could not connect to the assistant. Please try again.'
          : 'No pude conectar con el asistente. Intenta de nuevo.';
      toast.error(errorMsg);
      setMessages(messagesForDisplay);
    } finally {
      setIsLoading(false);
      setIsSearching(false); // Always turn off searching indicator
      // Reload usage after successful chat
      loadAIUsage();
    }
  };

  const handleSend = (messageOverride?: string, displayText?: string) => {
    const messageToSend = messageOverride || input;
    let messageToDisplay = displayText || messageToSend;
    
    if (!messageToSend.trim() || isLoading || isLimitReached) return;
    
    // Prevenir múltiples clicks
    if (isLoading) {
      toast.info('⏳ Procesando solicitud anterior...');
      return;
    }
    
    // AUTO-DETECT product links - SHOW DIRECT PRODUCT FIRST, THEN ASK TO COMPARE
    const linkRegex = /(amazon\.com|a\.co|amzn\.to|walmart\.com|target\.com|etsy\.com|ebay\.com)\/.+/i;
    if (!messageOverride && linkRegex.test(messageToSend)) {
      // STAGE 1: Extract REAL metadata from the product URL
      const storeName = messageToSend.match(/(amazon|walmart|target|etsy|ebay)/i)?.[1];
      const storeLabel = storeName ? storeName.charAt(0).toUpperCase() + storeName.slice(1) : 'Product';
      
      setInput("");
      setIsLoading(true);
      
      // Fetch real product data from the store URL
      (async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const { data, error } = await supabase.functions.invoke('extract-url-metadata', {
            body: { url: messageToSend },
            headers: session?.access_token ? {
              Authorization: `Bearer ${session.access_token}`
            } : undefined
          });
          
          if (error) throw error;
          
          // Extract metadata from response
          const metadata = data.metadata || data;
          
          // Create product card with REAL data from the store
          const directProduct: ProductCardData = {
            name: metadata.title || extractProductNameFromUrl(messageToSend),
            price: metadata.price ? `$${metadata.price}` : (language === 'es' ? 'Precio no disponible' : 'Price unavailable'),
            store: storeLabel,
            link: messageToSend,
            reason: language === 'es' ? '🔗 Producto que encontraste' : '🔗 Product you found',
            image: metadata.image_url
          };
          
          // STAGE 2: Ask if user wants to compare prices
          const questionText = language === 'es'
            ? "¿Quieres que busque el mismo producto en otras tiendas para comparar precios? 💰"
            : "Want me to search for this same product in other stores to compare prices? 💰";
          
          const compareOption = language === 'es' ? 'Sí, comparar precios' : 'Yes, compare prices';
          const buyOption = language === 'es' ? 'No, comprar aquí' : 'No, buy here';
          
          // Show the direct product + question with buttons
          const directLinkMessage = {
            role: 'assistant' as const,
            content: `${questionText}\n\n1. ${compareOption}\n2. ${buyOption}`,
            products: [directProduct]
          };
          
          setMessages([...messages, { role: 'user' as const, content: `🔗 ${storeLabel}` }, directLinkMessage]);
          setPendingLinkComparison(messageToSend); // Save link for later comparison if user chooses "Yes"
          
        } catch (error) {
          console.error('Error extracting product metadata:', error);
          
          // Fallback to basic product card if extraction fails
          const productName = extractProductNameFromUrl(messageToSend);
          const directProduct: ProductCardData = {
            name: productName,
            price: language === 'es' ? '💰 Ver en tienda' : '💰 See in store',
            store: storeLabel,
            link: messageToSend,
            reason: language === 'es' ? '🔗 Producto que encontraste' : '🔗 Product you found'
          };
          
          const questionText = language === 'es'
            ? "¿Quieres que busque el mismo producto en otras tiendas para comparar precios? 💰"
            : "Want me to search for this same product in other stores to compare prices? 💰";
          
          const compareOption = language === 'es' ? 'Sí, comparar precios' : 'Yes, compare prices';
          const buyOption = language === 'es' ? 'No, comprar aquí' : 'No, buy here';
          
          const directLinkMessage = {
            role: 'assistant' as const,
            content: `${questionText}\n\n1. ${compareOption}\n2. ${buyOption}`,
            products: [directProduct]
          };
          
          setMessages([...messages, { role: 'user' as const, content: `🔗 ${storeLabel}` }, directLinkMessage]);
          setPendingLinkComparison(messageToSend);
        } finally {
          setIsLoading(false);
        }
      })();
      
      return;
    }
    
    // HANDLE COMPARISON DECISION FOR DIRECT LINK
    if (pendingLinkComparison) {
      const userResponse = messageToSend.toLowerCase().trim();
      
      // Detect affirmative: match button text "Sí, comparar precios" or simple "sí/yes"
      const compareKeywords = ['comparar', 'compare', 'sí', 'si', 'yes'];
      const isCompare = compareKeywords.some(keyword => userResponse.includes(keyword));
      
      // Detect negative: match button text "No, comprar aquí" or simple "no"
      const buyDirectKeywords = ['no', 'comprar aquí', 'comprar aqui', 'buy here'];
      const isBuyDirect = !isCompare && buyDirectKeywords.some(keyword => userResponse.includes(keyword));
      
      if (isCompare) {
        // User chose to compare - trigger direct comparison with new backend flow
        setIsSearching(true);
        setInput("");
        const savedLink = pendingLinkComparison;
        setPendingLinkComparison(null);
        
        // Use new __FLOW_4_DIRECT_COMPARE__ trigger that generates products immediately
        const comparisonTrigger = `__FLOW_4_DIRECT_COMPARE__ ${savedLink}`;
        streamChatWithDisplay(comparisonTrigger, messageToDisplay);
        
        return;
      } else if (isBuyDirect) {
        // User chose to buy directly - OPEN THE STORE LINK and end conversation
        const savedLink = pendingLinkComparison;
        
        // Open the original store link in new tab
        window.open(savedLink, '_blank');
        
        const thankYouMsg = language === 'es'
          ? "¡Perfecto! 🎉 Abrí la página de la tienda. ¡Que disfrutes tu compra! 💰\n\nSi necesitas comparar otros productos, aquí estaré 👋"
          : "Perfect! 🎉 I opened the store page. Enjoy your purchase! 💰\n\nIf you need to compare other products, I'll be here 👋";
        
        setMessages([...messages, 
          { role: "user" as const, content: messageToDisplay },
          { role: "assistant" as const, content: thankYouMsg }
        ]);
        setInput("");
        setPendingLinkComparison(null); // Clear pending link
        return;
      }
      // If neither, fall through to normal flow
      setPendingLinkComparison(null);
    }
    
    streamChatWithDisplay(messageToSend, messageToDisplay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 bg-gradient-to-r from-primary to-primary/80 hover:scale-110 transition-transform sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
          size="icon"
          aria-label={t("aiAssistant.title")}
        >
          <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-0 right-0 left-0 w-full h-[100vh] shadow-2xl z-50 flex flex-col sm:bottom-4 sm:right-4 sm:left-auto sm:w-[400px] sm:h-[90vh] sm:max-h-[700px] sm:rounded-lg md:w-[420px] lg:bottom-6 lg:right-6">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">{t("aiAssistant.title")}</h3>
              <p className="text-xs opacity-90">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 scroll-smooth">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  <div className="flex-1 max-w-[85%] space-y-3">
                    {msg.content && (
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {(() => {
                          // Detectar opciones numeradas para convertirlas en botones
                          const optionPattern = /^[0-9①-⑨][\.\)️⃣]\s*(.+)$/;
                          const lines = msg.content.split('\n');
                          const hasOptions = lines.some(line => optionPattern.test(line.trim()));
                          
                          if (hasOptions && msg.role === 'assistant') {
                            const textBeforeOptions: string[] = [];
                            const options: string[] = [];
                            
                            lines.forEach(line => {
                              const match = line.trim().match(optionPattern);
                              if (match) {
                                options.push(match[1].trim());
                              } else if (options.length === 0) {
                                textBeforeOptions.push(line);
                              }
                            });
                            
                            return (
                              <div className="space-y-3">
                                {textBeforeOptions.length > 0 && (
                                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                    {renderMessageWithLinks(textBeforeOptions.join('\n'))}
                                  </p>
                                )}
                                {options.length > 0 && (
                                  <div className="flex flex-col gap-2 mt-2">
                                    {options.map((option, idx) => (
                                      <Button
                                        key={idx}
                                        variant="outline"
                                        className="w-full justify-start text-left h-auto py-2 px-3 text-sm whitespace-normal bg-background hover:bg-accent"
                                        onClick={() => {
                                          setInput(option);
                                          setTimeout(() => handleSend(), 100);
                                        }}
                                      >
                                        <span className="mr-2">{idx + 1}️⃣</span>
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          return (
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                              {renderMessageWithLinks(msg.content)}
                            </p>
                          );
                        })()}
                      </div>
                    )}
                    
                    {msg.products && msg.products.length > 0 && (
                      <div className="space-y-2">
                        {msg.products.map((product, pidx) => (
                          <ProductCard key={pidx} product={product} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isSearching && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 max-w-[85%] ml-3">
                    <SearchingProgress />
                  </div>
                </div>
              )}
              {isLoading && !isSearching && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Main Flow Buttons */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 pb-4 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Button
                variant="default"
                className="w-full h-auto py-3 px-3 flex flex-col items-start gap-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm"
                onClick={() => handleSend(
                  '__FLOW_1_GIFT__',
                  language === 'es' ? '🎁 REGALO PARA ALGUIEN' : '🎁 GIFT FOR SOMEONE'
                )}
              >
                <span className="text-sm font-semibold">🎁 {language === 'es' ? 'Regalo para alguien' : 'Gift for someone'}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  {language === 'es' ? 'Cumpleaños, aniversario, ocasión especial' : 'Birthday, anniversary, special occasion'}
                </span>
              </Button>
              
              <Button
                variant="default"
                className="w-full h-auto py-3 px-3 flex flex-col items-start gap-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm"
                onClick={() => handleSend(
                  '__FLOW_2_FORME__',
                  language === 'es' ? '🛍️ COMPRAR PARA MÍ' : '🛍️ SHOP FOR MYSELF'
                )}
              >
                <span className="text-sm font-semibold">🛍️ {language === 'es' ? 'Comprar para mí' : 'Shop for myself'}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  {language === 'es' ? 'Encuentra el mejor precio en lo que buscas' : 'Find the best price on what you need'}
                </span>
              </Button>
              
              <Button
                variant="default"
                className="w-full h-auto py-3 px-3 flex flex-col items-start gap-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm"
                onClick={() => handleSend(
                  '__FLOW_3_SECRET__',
                  language === 'es' ? '👥 COMPRAS EN GRUPO' : '👥 GROUP SHOPPING'
                )}
              >
                <span className="text-sm font-semibold">👥 {language === 'es' ? 'Compras en grupo' : 'Group shopping'}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  {language === 'es' ? 'Coordinar compras con amigos/familia' : 'Coordinate purchases with friends/family'}
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-auto py-3 px-3 flex flex-col items-start gap-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 hover:bg-primary/10 hover:border-primary shadow-sm"
                onClick={() => handleSend(
                  '__FLOW_4_LINK__',
                  language === 'es' ? '🔗 TENGO UN LINK' : '🔗 I HAVE A LINK'
                )}
              >
                <span className="text-sm font-semibold">🔗 {language === 'es' ? 'Tengo un link' : 'I have a link'}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  {language === 'es' ? 'Comparar precios de algo que ya viste' : 'Compare prices on something you found'}
                </span>
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <div className="flex-1 border-t"></div>
                <span>{language === 'es' ? 'o escribe tu búsqueda' : 'or write your search'}</span>
                <div className="flex-1 border-t"></div>
              </div>
            </div>
          )}

          {/* Progress and Back Button */}
          {messages.length > 2 && flowProgress.total > 0 && (
            <div className="px-4 pb-2 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  setMessages(prev => prev.slice(0, -2));
                  setFlowProgress(prev => ({ ...prev, current: Math.max(0, prev.current - 1) }));
                }}
                disabled={isLoading || messages.length <= 2}
              >
                ⬅️ {language === 'es' ? 'Atrás' : 'Back'}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Paso' : 'Step'} {flowProgress.current} {language === 'es' ? 'de' : 'of'} {flowProgress.total}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: flowProgress.total }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                        i < flowProgress.current ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contextual Quick Actions */}
          {messages.length > 1 && !isLoading && (() => {
            const lastMessage = messages[messages.length - 1];
            const hasProducts = lastMessage.products && lastMessage.products.length > 0;
            
            if (hasProducts) {
              return (
                <div className="px-4 pb-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {language === 'es' ? '¿Qué quieres hacer ahora?' : 'What would you like to do now?'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="h-auto py-3 flex flex-col gap-1 items-center hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={() => {
                        toast.info(language === 'es' ? 'Comparando precios...' : 'Comparing prices...');
                      }}
                    >
                      <span className="text-lg">💳</span>
                      <span className="text-xs">{language === 'es' ? 'Comparar precios' : 'Compare prices'}</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto py-3 flex flex-col gap-1 items-center hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={() => handleSend(language === 'es' ? 'Muéstrame opciones más económicas (menos de $20)' : 'Show me cheaper options (under $20)')}
                    >
                      <span className="text-lg">💰</span>
                      <span className="text-xs">{language === 'es' ? 'Ver más baratos' : 'See cheaper'}</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto py-3 flex flex-col gap-1 items-center hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={() => handleSend(language === 'es' ? 'Dame opciones en otra categoría diferente' : 'Show me a different category')}
                    >
                      <span className="text-lg">🔄</span>
                      <span className="text-xs">{language === 'es' ? 'Cambiar categoría' : 'Change category'}</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto py-3 flex flex-col gap-1 items-center hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={() => {
                        const newInitialMessage = {
                          role: "assistant" as const,
                          content: language === 'es' 
                            ? "🎁 Encuentra el regalo perfecto al MEJOR PRECIO\n\n✨ Comparamos Amazon, Walmart, Target, Etsy y eBay para que ahorres\n\n¿Qué necesitas hoy?"
                            : "🎁 Find the perfect gift at the BEST PRICE\n\n✨ We compare Amazon, Walmart, Target, Etsy and eBay to save you money\n\nWhat do you need today?",
                        };
                        setMessages([newInitialMessage]);
                        setFlowProgress({ current: 0, total: 0 });
                      }}
                    >
                      <span className="text-lg">🎁</span>
                      <span className="text-xs">{language === 'es' ? 'Nuevo regalo' : 'New gift'}</span>
                    </Button>
                  </div>
                </div>
              );
            } else if (messages.length <= 3) {
              return (
                <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 whitespace-nowrap"
                    onClick={() => handleSend(language === 'es' ? 'Muéstrame los regalos más populares de este mes' : 'Show me most popular gifts this month')}
                  >
                    🎁 {language === 'es' ? 'Populares' : 'Popular'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 whitespace-nowrap"
                    onClick={() => handleSend(language === 'es' ? 'Ofertas increíbles por menos de $20' : 'Great deals under $20')}
                  >
                    💰 {language === 'es' ? 'Ofertas <$20' : 'Deals <$20'}
                  </Button>
                </div>
              );
            }
            return null;
          })()}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t space-y-3">
            {/* AI Usage Counter */}
            {remaining !== null && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Búsquedas de IA hoy:</span>
                </div>
                {remaining === 999 ? (
                  <span className="font-bold text-primary flex items-center gap-1">
                    ✨ Admin: Ilimitado
                  </span>
                ) : (
                  <span className={`font-semibold ${remaining === 0 ? 'text-destructive' : 'text-primary'}`}>
                    {remaining}/10
                  </span>
                )}
              </div>
            )}

            {/* Rate Limit Alert */}
            {isLimitReached && (
              <Alert variant="destructive" className="py-2">
                <AlertTitle className="text-sm font-semibold mb-1">Límite diario alcanzado</AlertTitle>
                <AlertDescription className="text-xs">
                  Has usado tus 10 búsquedas de hoy. Se restablecerá mañana a las 12:00 AM.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLimitReached ? "Límite alcanzado" : t("aiAssistant.placeholder")}
                disabled={isLoading || isLimitReached}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading || isLimitReached}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
