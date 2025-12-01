export interface EventType {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  emojiColor: string;
  microCopy: string;
  microCopyEn: string;
  gamification: string;
  gamificationEn: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const EVENT_TYPES: EventType[] = [
  {
    id: 'birthday',
    title: 'Cumpleaños',
    titleEn: 'Birthday',
    emoji: '🎂',
    emojiColor: '#FFB800',
    microCopy: '¡La fiesta es aquí! Consigue los regalos perfectos sin preguntar a nadie.',
    microCopyEn: 'The party is here! Get the perfect gifts without asking anyone.',
    gamification: '+12 Ideas de Regalo',
    gamificationEn: '+12 Gift Ideas',
    primaryColor: '#FF9800',
    secondaryColor: '#FFF8E7',
    accentColor: '#22C55E',
  },
  {
    id: 'christmas',
    title: 'Navidad',
    titleEn: 'Christmas',
    emoji: '🎄',
    emojiColor: '#10B981',
    microCopy: 'La magia de las fiestas, cero estrés. ¡Encuentra El Regalo antes que nadie!',
    microCopyEn: 'Holiday magic, zero stress. Find The Gift before anyone else!',
    gamification: '+18 Ideas Exclusivas',
    gamificationEn: '+18 Exclusive Ideas',
    primaryColor: '#10B981',
    secondaryColor: '#DCFCE7',
    accentColor: '#22C55E',
  },
  {
    id: 'wedding',
    title: 'Boda',
    titleEn: 'Wedding',
    emoji: '💍',
    emojiColor: '#EC4899',
    microCopy: 'Construyan su futuro. Eviten duplicados y reciban solo lo que desean.',
    microCopyEn: 'Build your future. Avoid duplicates and receive only what you want.',
    gamification: '+24 Combinaciones Perfectas',
    gamificationEn: '+24 Perfect Combinations',
    primaryColor: '#EC4899',
    secondaryColor: '#FDF2F8',
    accentColor: '#22C55E',
  },
  {
    id: 'baby_shower',
    title: 'Baby Shower',
    titleEn: 'Baby Shower',
    emoji: '👶',
    emojiColor: '#3B82F6',
    microCopy: 'Prepara la bienvenida. Haz que recibir regalos sea tan fácil como un paseo.',
    microCopyEn: 'Prepare the welcome. Make receiving gifts as easy as a walk.',
    gamification: '+20 Regalos para el Bebé',
    gamificationEn: '+20 Baby Gifts',
    primaryColor: '#3B82F6',
    secondaryColor: '#EFF6FF',
    accentColor: '#22C55E',
  },
  {
    id: 'other',
    title: 'Otro',
    titleEn: 'Other',
    emoji: '📌',
    emojiColor: '#6B7280',
    microCopy: 'Tu evento, tus reglas. Define lo que importa.',
    microCopyEn: 'Your event, your rules. Define what matters.',
    gamification: '+15 Plantillas',
    gamificationEn: '+15 Templates',
    primaryColor: '#6B7280',
    secondaryColor: '#F3F4F6',
    accentColor: '#22C55E',
  },
];
