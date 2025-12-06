import { useState, useEffect } from 'react';
import { X, Link2, Check, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WishList {
  id: string;
  name: string;
  itemCount: number;
}

interface StoreGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeUrl: string;
  lists: WishList[];
  onAddToList: (url: string, listId: string) => Promise<void>;
  onCreateList: (name: string, url: string) => Promise<void>;
}

export function StoreGuideModal({ isOpen, onClose, storeName, storeUrl, lists, onAddToList, onCreateList }: StoreGuideModalProps) {
  const { language } = useLanguage();
  const [url, setUrl] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'guide' | 'paste' | 'select'>('guide');
  const [hasVisitedStore, setHasVisitedStore] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !wasOpen) {
      setUrl('');
      setSelectedListId(lists[0]?.id || '');
      setIsCreatingNew(false);
      setNewListName('');
      setIsLoading(false);
      setIsSuccess(false);
      setError('');
      setHasVisitedStore(false);
      if (storeUrl) {
        setStep('guide');
      } else {
        setStep('paste');
      }
    }
    setWasOpen(isOpen);
  }, [isOpen]);

  const handleGoToStore = () => {
    window.open(storeUrl, '_blank', 'noopener,noreferrer');
    setHasVisitedStore(true);
    setStep('paste');
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const extractDomain = (urlStr: string) => {
    try {
      const domain = new URL(urlStr).hostname.replace('www.', '');
      return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    } catch {
      return '';
    }
  };

  const handlePasteAndContinue = () => {
    if (!url || !isValidUrl(url)) {
      setError(language === 'es' ? 'Por favor pega una URL valida' : 'Please paste a valid URL');
      return;
    }
    setError('');
    setStep('select');
  };

  const handleSubmit = async () => {
    if (isCreatingNew && !newListName.trim()) {
      setError(language === 'es' ? 'Nombre requerido' : 'Name required');
      return;
    }

    if (!isCreatingNew && !selectedListId) {
      setError(language === 'es' ? 'Selecciona una lista' : 'Select a list');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isCreatingNew) {
        await onCreateList(newListName.trim(), url);
      } else {
        await onAddToList(url, selectedListId);
      }
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(language === 'es' ? 'Error. Intenta de nuevo.' : 'Error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedList = lists.find(l => l.id === selectedListId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1ABC9C]/10 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-[#1ABC9C]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A3E5C]">
                {language === 'es' ? 'Capturar de ' : 'Capture from '}{storeName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-[#1A3E5C] mb-1">
              {language === 'es' ? 'Agregado' : 'Added'}
            </h3>
            <p className="text-sm text-gray-500">
              {isCreatingNew ? newListName : selectedList?.name}
            </p>
          </div>
        ) : step === 'guide' ? (
          /* Step GUIDE: Show instructions + Go to Store button */
          <div className="p-5">
            {/* Visual Guide */}
            <div className="mb-5 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-[#1ABC9C] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">1</div>
                <p className="text-sm text-gray-700">
                  {language === 'es' 
                    ? 'Haz clic en "Ir a la Tienda" para abrir ' + storeName
                    : 'Click "Go to Store" to open ' + storeName
                  }
                </p>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-[#1ABC9C] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">2</div>
                <p className="text-sm text-gray-700">
                  {language === 'es' 
                    ? 'Encuentra el producto y copia su URL'
                    : 'Find the product and copy its URL'
                  }
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1ABC9C] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">3</div>
                <p className="text-sm text-gray-700">
                  {language === 'es' 
                    ? 'Regresa aqui y pegala'
                    : 'Come back here and paste it'
                  }
                </p>
              </div>
            </div>

            {/* Go to Store Button */}
            <button
              onClick={handleGoToStore}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-[#1ABC9C] text-white rounded-xl font-bold text-base hover:bg-[#16A085] transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              {language === 'es' ? 'Ir a la Tienda' : 'Go to Store'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              {language === 'es' 
                ? 'Se abrira en una nueva pestana'
                : 'Opens in a new tab'
              }
            </p>
          </div>
        ) : step === 'paste' ? (
          /* Step PASTE: Paste URL */
          <div className="p-5">
            <div className="mb-4 p-3 bg-green-50 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">
                {language === 'es' 
                  ? storeName + ' esta abierto en otra pestana'
                  : storeName + ' is open in another tab'
                }
              </p>
            </div>

            {/* URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A3E5C] mb-2">
                {language === 'es' ? 'Pega la URL del producto:' : 'Paste the product URL:'}
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  placeholder={language === 'es' ? 'https://...' : 'https://...'}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                  autoFocus
                />
              </div>
              {url && isValidUrl(url) && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                  <Check className="w-3 h-3" />
                  <span>{extractDomain(url)}</span>
                </div>
              )}
              {error && (
                <p className="mt-2 text-xs text-red-500">{error}</p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handlePasteAndContinue}
              disabled={!url}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#1ABC9C] text-white rounded-xl font-semibold hover:bg-[#16A085] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'es' ? 'Continuar' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Step SELECT: Select List */
          <div className="p-5">
            <p className="text-sm text-gray-600 mb-4">
              {language === 'es' ? 'Selecciona donde guardar:' : 'Select where to save:'}
            </p>

            {!isCreatingNew ? (
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {lists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      selectedListId === list.id
                        ? 'bg-[#1ABC9C]/10 border-2 border-[#1ABC9C]'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium text-[#1A3E5C] text-sm">{list.name}</span>
                    <span className="text-xs text-gray-400">{list.itemCount} items</span>
                  </button>
                ))}
                {lists.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    {language === 'es' ? 'No tienes listas' : 'No lists yet'}
                  </p>
                )}
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-[#1ABC9C] font-medium hover:border-[#1ABC9C] transition-all"
                >
                  + {language === 'es' ? 'Crear nueva lista' : 'Create new list'}
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => {
                    setNewListName(e.target.value);
                    setError('');
                  }}
                  placeholder={language === 'es' ? 'Nombre de la lista...' : 'List name...'}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                  autoFocus
                />
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  {language === 'es' ? 'Usar lista existente' : 'Use existing list'}
                </button>
              </div>
            )}

            {error && (
              <p className="mb-4 text-xs text-red-500">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all text-sm"
              >
                {language === 'es' ? 'Atras' : 'Back'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#1ABC9C] text-white rounded-xl font-semibold hover:bg-[#16A085] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {language === 'es' ? 'Agregar' : 'Add'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
