import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Loader2, ImagePlus, X, Calendar, Eye, EyeOff, Sparkles, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/data/eventTypes";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface AccessType {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  image: string;
  color: string;
}

const accessTypes: AccessType[] = [
  { 
    id: "private", 
    nameEs: "Lista Personal", 
    nameEn: "Personal List", 
    descEs: "Para mi (Privada). Mi catalogo de deseos personal.", 
    descEn: "For me (Private). My personal wish catalog.",
    image: "/images/list-types/treasure_chest_wishlist_icon.png",
    color: "#1ABC9C"
  },
  { 
    id: "shared", 
    nameEs: "Recibir Regalos", 
    nameEn: "Receive Gifts", 
    descEs: "Ideal para tu evento. Garantiza que recibes exactamente lo que deseas.", 
    descEn: "Ideal for your event. Ensures you get exactly what you want.",
    image: "/images/list-types/person_receiving_gift_icon.png",
    color: "#FF9900"
  },
  { 
    id: "group_event", 
    nameEs: "Evento de Grupo", 
    nameEn: "Group Event", 
    descEs: "Intercambio, sorteo o co-financiacion.", 
    descEn: "Exchange, raffle or co-funding.",
    image: "/images/list-types/group_coordination_hands_icon.png",
    color: "#8B5CF6"
  },
  { 
    id: "managed", 
    nameEs: "Administrar Lista", 
    nameEn: "Manage List", 
    descEs: "Organizo la lista de un tercero.", 
    descEn: "I organize someone else's list.",
    image: "/images/list-types/caretaker_with_child_icon.png",
    color: "#3B82F6"
  },
];

const coverTemplates = [
  { id: "birthday", url: "/images/covers/birthday-cover.jpg", labelEs: "Cumpleanos", labelEn: "Birthday" },
  { id: "wedding", url: "/images/covers/wedding-cover.jpg", labelEs: "Boda", labelEn: "Wedding" },
  { id: "baby", url: "/images/covers/baby-cover.jpg", labelEs: "Baby Shower", labelEn: "Baby Shower" },
  { id: "christmas", url: "/images/covers/christmas-cover.jpg", labelEs: "Navidad", labelEn: "Christmas" },
  { id: "graduation", url: "/images/covers/graduation-cover.jpg", labelEs: "Graduacion", labelEn: "Graduation" },
  { id: "anniversary", url: "/images/covers/anniversary-cover.jpg", labelEs: "Aniversario", labelEn: "Anniversary" },
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  { value: 1, labelEs: "Enero", labelEn: "January" },
  { value: 2, labelEs: "Febrero", labelEn: "February" },
  { value: 3, labelEs: "Marzo", labelEn: "March" },
  { value: 4, labelEs: "Abril", labelEn: "April" },
  { value: 5, labelEs: "Mayo", labelEn: "May" },
  { value: 6, labelEs: "Junio", labelEn: "June" },
  { value: 7, labelEs: "Julio", labelEn: "July" },
  { value: 8, labelEs: "Agosto", labelEn: "August" },
  { value: 9, labelEs: "Septiembre", labelEn: "September" },
  { value: 10, labelEs: "Octubre", labelEn: "October" },
  { value: 11, labelEs: "Noviembre", labelEn: "November" },
  { value: 12, labelEs: "Diciembre", labelEn: "December" },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

export default function CreateListStep2() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedAccess, setSelectedAccess] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [listName, setListName] = useState("");
  const [eventType, setEventType] = useState("");
  
  const [description, setDescription] = useState("");
  const [eventDay, setEventDay] = useState<number | null>(null);
  const [eventMonth, setEventMonth] = useState<number | null>(null);
  const [eventYear, setEventYear] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isCreating, setIsCreating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("createList");
    if (!saved) {
      navigate("/create-list/step-1");
      return;
    }
    
    const data = JSON.parse(saved);
    setListName(data.name || "");
    setEventType(data.event_type || "");
  }, [navigate]);

  const handleAccessSelect = (accessId: string) => {
    setSelectedAccess(accessId);
    setShowConfigPanel(true);
    trackEvent('step2_access_selected', { access_type: accessId });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'es' ? 'La imagen debe ser menor a 5MB' : 'Image must be less than 5MB');
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (templateUrl: string) => {
    setCoverImage(templateUrl);
    setCoverFile(null);
    setShowTemplates(false);
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverFile(null);
  };

  const handleCreateList = async () => {
    setIsCreating(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      let coverUrl = coverImage;
      
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('list-covers')
          .upload(fileName, coverFile);
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('list-covers')
            .getPublicUrl(fileName);
          coverUrl = urlData.publicUrl;
        }
      }

      let eventDate = null;
      if (eventDay && eventMonth && eventYear) {
        eventDate = `${eventYear}-${String(eventMonth).padStart(2, '0')}-${String(eventDay).padStart(2, '0')}`;
      }

      const { data: newList, error } = await supabase
        .from('gift_lists')
        .insert({
          user_id: session.user.id,
          name: listName,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating list:', error);
        alert(language === 'es' ? 'Error al crear la lista' : 'Error creating list');
        return;
      }

      sessionStorage.setItem("createList", JSON.stringify({
        ...JSON.parse(sessionStorage.getItem("createList") || "{}"),
        access_type: selectedAccess,
        description,
        event_date: eventDate,
        cover_image: coverUrl,
        visibility,
        list_id: newList.id
      }));

      trackEvent('list_created', {
        access_type: selectedAccess,
        has_cover: !!coverUrl,
        has_date: !!eventDate,
        visibility
      });

      navigate("/create-list/success");
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'es' ? 'Error inesperado' : 'Unexpected error');
    } finally {
      setIsCreating(false);
    }
  };

  const selectedAccessType = accessTypes.find(a => a.id === selectedAccess);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9F7] via-white to-[#FAFBFC]">
      {/* Premium Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => showConfigPanel ? setShowConfigPanel(false) : navigate("/create-list/step-1")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1A3E5C] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Volver' : 'Back'}
            </span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center text-sm font-bold">
                <Check className="w-4 h-4" />
              </div>
              <div className="w-8 h-1 bg-[#1ABC9C] rounded-full" />
              <div className="w-8 h-8 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center text-sm font-bold">2</div>
              <div className="w-8 h-1 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-medium">3</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-36">
        {!showConfigPanel ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ABC9C]/10 rounded-full text-[#1ABC9C] text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                {language === 'es' ? 'Paso 2: Define el proposito' : 'Step 2: Define the purpose'}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A3E5C] mb-4 tracking-tight">
                {language === 'es' ? 'Como Quieres Usar Esta Lista?' : 'How Do You Want to Use This List?'}
              </h1>
              <p className="text-xl text-gray-500">
                {language === 'es' ? 'Define tu rol y la mecanica del evento' : 'Define your role and event mechanics'}
              </p>
            </div>

            {/* Access Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {accessTypes.map((type) => {
                const isSelected = selectedAccess === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleAccessSelect(type.id)}
                    className={cn(
                      "group relative p-8 rounded-3xl text-center transition-all duration-300",
                      "hover:-translate-y-2 hover:shadow-2xl border-2",
                      isSelected
                        ? "ring-4 ring-offset-2"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                    style={{
                      minHeight: '220px',
                      borderColor: isSelected ? type.color : undefined,
                      backgroundColor: isSelected ? `${type.color}08` : 'white',
                      boxShadow: isSelected 
                        ? `0 25px 60px ${type.color}25` 
                        : '0 15px 40px rgba(0, 0, 0, 0.06)',
                      ...(isSelected && { '--tw-ring-color': type.color } as React.CSSProperties)
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-5">
                      <div className={cn(
                        "w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300",
                        isSelected 
                          ? "bg-white shadow-xl scale-110" 
                          : "bg-gray-50 group-hover:bg-white group-hover:shadow-lg group-hover:scale-105"
                      )}>
                        <img 
                          src={type.image} 
                          alt=""
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#1A3E5C]">
                          {language === 'es' ? type.nameEs : type.nameEn}
                        </h3>
                        <p className="text-base text-gray-500 leading-relaxed">
                          {language === 'es' ? type.descEs : type.descEn}
                        </p>
                      </div>
                      
                      <div 
                        className={cn(
                          "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
                        )}
                        style={{ borderColor: isSelected ? type.color : '#D1D5DB' }}
                      >
                        {isSelected && (
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Configuration Panel */}
            <div className="max-w-2xl mx-auto">
              {/* Header with selected type */}
              <div className="text-center mb-8">
                <div 
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-4"
                  style={{ backgroundColor: `${selectedAccessType?.color}15` }}
                >
                  <img src={selectedAccessType?.image} alt="" className="w-10 h-10" />
                  <span className="font-bold text-[#1A3E5C]">
                    {language === 'es' ? selectedAccessType?.nameEs : selectedAccessType?.nameEn}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-[#1A3E5C] mb-2">
                  {language === 'es' ? 'Personaliza tu Lista' : 'Customize Your List'}
                </h2>
                <p className="text-gray-500">
                  {language === 'es' ? 'Agrega detalles para hacer tu lista unica' : 'Add details to make your list unique'}
                </p>
              </div>

              {/* Config Form */}
              <div className="bg-white rounded-3xl p-6 md:p-8 space-y-6" style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08)' }}>
                
                {/* List Name (read-only display) */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    {language === 'es' ? 'Nombre de la Lista' : 'List Name'}
                  </label>
                  <div className="h-14 px-5 bg-gray-50 rounded-2xl flex items-center text-lg font-medium text-[#1A3E5C]">
                    {listName}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    {language === 'es' ? 'Descripcion (opcional)' : 'Description (optional)'}
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'es' 
                      ? 'Aqui puedes describir brevemente la lista para aquellos con los que eliges compartirla...' 
                      : 'Here you can briefly describe the list for those you choose to share it with...'}
                    className="min-h-[100px] text-base border-gray-200 focus:border-[#1ABC9C] focus:ring-0 rounded-2xl resize-none"
                    maxLength={500}
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {language === 'es' ? 'Fecha del Evento (opcional)' : 'Event Date (optional)'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Day */}
                    <div className="relative">
                      <select
                        value={eventDay || ""}
                        onChange={(e) => setEventDay(e.target.value ? Number(e.target.value) : null)}
                        className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none cursor-pointer focus:border-[#1ABC9C] focus:ring-0 text-base"
                      >
                        <option value="">{language === 'es' ? 'Dia' : 'Day'}</option>
                        {days.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Month */}
                    <div className="relative">
                      <select
                        value={eventMonth || ""}
                        onChange={(e) => setEventMonth(e.target.value ? Number(e.target.value) : null)}
                        className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none cursor-pointer focus:border-[#1ABC9C] focus:ring-0 text-base"
                      >
                        <option value="">{language === 'es' ? 'Mes' : 'Month'}</option>
                        {months.map(m => (
                          <option key={m.value} value={m.value}>
                            {language === 'es' ? m.labelEs : m.labelEn}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Year */}
                    <div className="relative">
                      <select
                        value={eventYear || ""}
                        onChange={(e) => setEventYear(e.target.value ? Number(e.target.value) : null)}
                        className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none cursor-pointer focus:border-[#1ABC9C] focus:ring-0 text-base"
                      >
                        <option value="">{language === 'es' ? 'Ano' : 'Year'}</option>
                        {years.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    {language === 'es' ? 'Imagen de Portada' : 'Cover Image'}
                  </label>
                  
                  {coverImage ? (
                    <div className="relative rounded-2xl overflow-hidden">
                      <img 
                        src={coverImage} 
                        alt="Cover" 
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={removeCoverImage}
                        className="absolute top-3 right-3 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Upload Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-[#1ABC9C] rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#1ABC9C]/5 transition-colors cursor-pointer"
                      >
                        <ImagePlus className="w-8 h-8 text-[#1ABC9C]" />
                        <span className="text-[#1ABC9C] font-semibold">
                          {language === 'es' ? 'Subir imagen de portada' : 'Upload cover image'}
                        </span>
                        <span className="text-sm text-gray-400">JPG, PNG (max 5MB)</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {/* Or use templates */}
                      <div className="text-center">
                        <button
                          onClick={() => setShowTemplates(!showTemplates)}
                          className="text-sm text-gray-500 hover:text-[#1A3E5C] underline"
                        >
                          {language === 'es' ? 'O elige una plantilla' : 'Or choose a template'}
                        </button>
                      </div>

                      {/* Templates Grid */}
                      {showTemplates && (
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          {coverTemplates.map((template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template.url)}
                              className="relative aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-[#1ABC9C] transition-all group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#1ABC9C]/20 to-[#3B82F6]/20 flex items-center justify-center">
                                <span className="text-xs font-medium text-white bg-black/40 px-2 py-1 rounded">
                                  {language === 'es' ? template.labelEs : template.labelEn}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Visibility */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    {visibility === 'public' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {language === 'es' ? 'Visibilidad' : 'Visibility'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setVisibility('public')}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left",
                        visibility === 'public'
                          ? "border-[#1ABC9C] bg-[#1ABC9C]/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Eye className={cn("w-5 h-5", visibility === 'public' ? "text-[#1ABC9C]" : "text-gray-400")} />
                        <div>
                          <p className="font-semibold text-[#1A3E5C]">
                            {language === 'es' ? 'Compartido' : 'Shared'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === 'es' ? 'Visible con enlace' : 'Visible with link'}
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setVisibility('private')}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left",
                        visibility === 'private'
                          ? "border-[#1ABC9C] bg-[#1ABC9C]/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <EyeOff className={cn("w-5 h-5", visibility === 'private' ? "text-[#1ABC9C]" : "text-gray-400")} />
                        <div>
                          <p className="font-semibold text-[#1A3E5C]">
                            {language === 'es' ? 'Privado' : 'Private'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === 'es' ? 'Solo yo' : 'Only me'}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      {showConfigPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleCreateList}
              disabled={isCreating}
              className={cn(
                "w-full h-16 text-lg font-black rounded-2xl transition-all duration-300 group",
                "bg-gradient-to-r from-[#1ABC9C] to-[#22C55E] hover:from-[#1ABC9C]/90 hover:to-[#22C55E]/90 text-white"
              )}
              style={{ boxShadow: '0 15px 40px rgba(26, 188, 156, 0.35)' }}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  {language === 'es' ? 'Creando...' : 'Creating...'}
                </>
              ) : (
                <>
                  {language === 'es' ? 'CREAR LISTA DE DESEOS' : 'CREATE WISH LIST'}
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
