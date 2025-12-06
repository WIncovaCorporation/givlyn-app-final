import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Plus, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoreIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: {
    name: string;
    url: string;
  } | null;
  onAddProduct: () => void;
}

export function StoreIframeModal({ isOpen, onClose, store, onAddProduct }: StoreIframeModalProps) {
  const { language } = useLanguage();
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'success' | 'blocked'>('loading');
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && store) {
      setIframeStatus('loading');
      setShowFallbackMessage(false);
      
      timeoutRef.current = setTimeout(() => {
        if (iframeStatus === 'loading') {
          setIframeStatus('blocked');
          setShowFallbackMessage(true);
        }
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, store]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        const hasContent = iframe.contentDocument?.body?.innerHTML?.length > 0;
        if (hasContent) {
          setIframeStatus('success');
        } else {
          setIframeStatus('blocked');
          setShowFallbackMessage(true);
        }
      }
    } catch (e) {
      setIframeStatus('blocked');
      setShowFallbackMessage(true);
    }
  };

  const handleIframeError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIframeStatus('blocked');
    setShowFallbackMessage(true);
  };

  const openInNewTab = () => {
    if (store) {
      window.open(store.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenAndCapture = () => {
    openInNewTab();
    onClose();
    setTimeout(() => {
      onAddProduct();
    }, 500);
  };

  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-[95vw] h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#1A3E5C] to-[#2D5A7B] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-[#1A3E5C]">{store.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{store.name}</h2>
              <p className="text-xs text-white/70 truncate max-w-[200px] sm:max-w-[400px]">{store.url}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleOpenAndCapture}
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-[#1ABC9C] text-white rounded-xl font-semibold hover:bg-[#16A085] transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">
                {language === 'es' ? 'Capturar Producto' : 'Capture Product'}
              </span>
              <span className="sm:hidden">
                {language === 'es' ? 'Capturar' : 'Capture'}
              </span>
            </button>
            
            <button
              onClick={openInNewTab}
              className="flex items-center gap-2 px-3 py-2.5 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all"
              title={language === 'es' ? 'Abrir en nueva pestana' : 'Open in new tab'}
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-50">
          {/* Loading State */}
          {iframeStatus === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <Loader2 className="w-12 h-12 text-[#1ABC9C] animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                {language === 'es' ? 'Cargando tienda...' : 'Loading store...'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {language === 'es' ? 'Verificando acceso...' : 'Verifying access...'}
              </p>
            </div>
          )}

          {/* Blocked State - Fallback Message */}
          {showFallbackMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 z-10 p-6">
              <div className="max-w-lg text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#1A3E5C] mb-3">
                  {language === 'es' 
                    ? `${store.name} no permite vista integrada`
                    : `${store.name} doesn't allow embedded view`
                  }
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {language === 'es' 
                    ? 'Por seguridad, esta tienda debe abrirse en una nueva pestana. Navega, encuentra tu producto, copia el enlace y regresa para agregarlo a tu lista.'
                    : 'For security, this store must open in a new tab. Browse, find your product, copy the link and come back to add it to your list.'
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleOpenAndCapture}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1ABC9C] text-white rounded-xl font-bold text-lg hover:bg-[#16A085] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {language === 'es' ? 'Ir a la Tienda' : 'Go to Store'}
                  </button>
                </div>

                <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    {language === 'es' ? 'Flujo rapido:' : 'Quick flow:'}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="bg-[#1ABC9C]/10 text-[#1ABC9C] px-3 py-1 rounded-full font-medium">1. Ir a tienda</span>
                    <span className="text-gray-300">→</span>
                    <span className="bg-[#1ABC9C]/10 text-[#1ABC9C] px-3 py-1 rounded-full font-medium">2. Copiar URL</span>
                    <span className="text-gray-300">→</span>
                    <span className="bg-[#1ABC9C]/10 text-[#1ABC9C] px-3 py-1 rounded-full font-medium">3. Pegar aqui</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Iframe - Hidden when blocked */}
          <iframe
            ref={iframeRef}
            src={store.url}
            className={`w-full h-full border-0 ${iframeStatus === 'blocked' ? 'hidden' : ''}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title={`${store.name} store`}
          />
        </div>
      </div>
    </div>
  );
}
