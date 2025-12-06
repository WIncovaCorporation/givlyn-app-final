import { useState, useEffect } from 'react';
import { X, Link2, Plus, Check, Loader2, Sparkles, ChevronDown, FolderPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WishList {
  id: string;
  name: string;
  itemCount: number;
}

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: WishList[];
  onAddToList: (url: string, listId: string) => Promise<void>;
  onCreateList: (name: string, url: string) => Promise<void>;
}

export function QuickAddModal({ isOpen, onClose, lists, onAddToList, onCreateList }: QuickAddModalProps) {
  const { language } = useLanguage();
  const [url, setUrl] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showListDropdown, setShowListDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setSelectedListId(lists[0]?.id || '');
      setIsCreatingNew(false);
      setNewListName('');
      setIsLoading(false);
      setIsSuccess(false);
      setError('');
      
      navigator.clipboard.readText()
        .then(text => {
          if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
            setUrl(text);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, lists]);

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

  const handleSubmit = async () => {
    if (!url || !isValidUrl(url)) {
      setError(language === 'es' ? 'Por favor ingresa una URL valida' : 'Please enter a valid URL');
      return;
    }

    if (isCreatingNew && !newListName.trim()) {
      setError(language === 'es' ? 'Por favor ingresa un nombre para la lista' : 'Please enter a list name');
      return;
    }

    if (!isCreatingNew && !selectedListId) {
      setError(language === 'es' ? 'Por favor selecciona una lista' : 'Please select a list');
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
      setError(language === 'es' ? 'Error al agregar producto. Intenta de nuevo.' : 'Error adding product. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedList = lists.find(l => l.id === selectedListId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#1ABC9C] to-[#16A085]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'es' ? 'Captura Rapida' : 'Quick Capture'}
              </h2>
              <p className="text-xs text-white/80">
                {language === 'es' ? 'Agrega productos de cualquier tienda' : 'Add products from any store'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1A3E5C] mb-2">
              {language === 'es' ? 'Producto Agregado' : 'Product Added'}
            </h3>
            <p className="text-gray-500">
              {language === 'es' 
                ? `Guardado en "${isCreatingNew ? newListName : selectedList?.name}"`
                : `Saved to "${isCreatingNew ? newListName : selectedList?.name}"`
              }
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* URL Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1A3E5C] mb-2">
                {language === 'es' ? 'URL del Producto' : 'Product URL'}
              </label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  placeholder={language === 'es' ? 'Pega la URL del producto aqui...' : 'Paste product URL here...'}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                  autoFocus
                />
              </div>
              {url && isValidUrl(url) && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>{extractDomain(url)}</span>
                </div>
              )}
            </div>

            {/* List Selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1A3E5C] mb-2">
                {language === 'es' ? 'Agregar a Lista' : 'Add to List'}
              </label>
              
              {!isCreatingNew ? (
                <div className="relative">
                  <button
                    onClick={() => setShowListDropdown(!showListDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-left hover:border-[#1ABC9C] transition-all"
                  >
                    <span className={selectedList ? 'text-[#1A3E5C] font-medium' : 'text-gray-400'}>
                      {selectedList?.name || (language === 'es' ? 'Selecciona una lista...' : 'Select a list...')}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showListDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showListDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {lists.map(list => (
                        <button
                          key={list.id}
                          onClick={() => {
                            setSelectedListId(list.id);
                            setShowListDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedListId === list.id ? 'bg-[#1ABC9C]/10' : ''
                          }`}
                        >
                          <span className="font-medium text-[#1A3E5C]">{list.name}</span>
                          <span className="text-xs text-gray-400">
                            {list.itemCount} {language === 'es' ? 'items' : 'items'}
                          </span>
                        </button>
                      ))}
                      {lists.length === 0 && (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                          {language === 'es' ? 'No tienes listas aun' : 'No lists yet'}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsCreatingNew(true);
                      setShowListDropdown(false);
                    }}
                    className="mt-3 flex items-center gap-2 text-sm text-[#1ABC9C] font-medium hover:text-[#16A085] transition-colors"
                  >
                    <FolderPlus className="w-4 h-4" />
                    {language === 'es' ? 'Crear nueva lista' : 'Create new list'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <FolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => {
                        setNewListName(e.target.value);
                        setError('');
                      }}
                      placeholder={language === 'es' ? 'Nombre de la nueva lista...' : 'New list name...'}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setIsCreatingNew(false)}
                    className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {language === 'es' ? 'Usar lista existente' : 'Use existing list'}
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !url}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1ABC9C] text-white rounded-xl font-bold text-lg hover:bg-[#16A085] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'es' ? 'Agregando...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {language === 'es' ? 'Agregar a Lista' : 'Add to List'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
