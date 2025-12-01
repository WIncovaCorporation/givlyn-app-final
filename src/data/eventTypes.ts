export interface EventType {
  id: string;
  title: string;
  titleEn: string;
  image: string;
  microCopy: string;
  microCopyEn: string;
  gamification: string;
  gamificationEn: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  autoName: string;
  autoNameEn: string;
}

export const EVENT_TYPES: EventType[] = [
  {
    id: 'personal_celebration',
    title: 'Celebración Personal y Logros',
    titleEn: 'Personal Celebration & Achievements',
    image: '/images/list-types/personal_celebration_milestones_icon.png',
    microCopy: 'Para ti. Incluye: Cumpleaños, Graduación, Open House o cualquier gran hito personal.',
    microCopyEn: 'For you. Includes: Birthday, Graduation, Open House or any major personal milestone.',
    gamification: '+12 Ideas de Regalo',
    gamificationEn: '+12 Gift Ideas',
    primaryColor: '#FF9800',
    secondaryColor: '#FFF8E7',
    accentColor: '#22C55E',
    autoName: 'Mi Celebración Personal',
    autoNameEn: 'My Personal Celebration',
  },
  {
    id: 'holidays',
    title: 'Días Festivos y Temporada',
    titleEn: 'Holidays & Season',
    image: '/images/list-types/holiday_season_festivities_icon.png',
    microCopy: 'Navidad, San Valentín, Día de la Madre/Padre/Niño, Día de Reyes.',
    microCopyEn: 'Christmas, Valentine\'s Day, Mother\'s/Father\'s/Children\'s Day, Three Kings Day.',
    gamification: '+18 Ideas Exclusivas',
    gamificationEn: '+18 Exclusive Ideas',
    primaryColor: '#10B981',
    secondaryColor: '#DCFCE7',
    accentColor: '#22C55E',
    autoName: 'Lista de Temporada',
    autoNameEn: 'Seasonal List',
  },
  {
    id: 'wedding_couple',
    title: 'Eventos Nupciales y Pareja',
    titleEn: 'Wedding & Couple Events',
    image: '/images/list-types/wedding_and_couple_events_icon.png',
    microCopy: 'Boda, Aniversario de Pareja, Engagement Party.',
    microCopyEn: 'Wedding, Couple Anniversary, Engagement Party.',
    gamification: '+24 Combinaciones Perfectas',
    gamificationEn: '+24 Perfect Combinations',
    primaryColor: '#EC4899',
    secondaryColor: '#FDF2F8',
    accentColor: '#22C55E',
    autoName: 'Nuestra Lista de Bodas',
    autoNameEn: 'Our Wedding List',
  },
  {
    id: 'baby_kids_family',
    title: 'Bebé, Niños y Familia',
    titleEn: 'Baby, Kids & Family',
    image: '/images/list-types/baby_kids_family_events_icon.png',
    microCopy: 'Baby Shower, Bautizo, Primera Comunión, listas de Regreso a Clases.',
    microCopyEn: 'Baby Shower, Baptism, First Communion, Back to School lists.',
    gamification: '+20 Regalos para Familia',
    gamificationEn: '+20 Family Gifts',
    primaryColor: '#3B82F6',
    secondaryColor: '#EFF6FF',
    accentColor: '#22C55E',
    autoName: 'Lista para la Familia',
    autoNameEn: 'Family Gift List',
  },
  {
    id: 'collaboration',
    title: 'Colaboración y Aportes',
    titleEn: 'Collaboration & Contributions',
    image: '/images/list-types/group_collaboration_cofunding_icon.png',
    microCopy: 'Amigo Secreto, Regalos Corporativos, Co-financiación, Intercambio de Oficinas.',
    microCopyEn: 'Secret Santa, Corporate Gifts, Co-funding, Office Exchanges.',
    gamification: '+15 Dinámicas de Grupo',
    gamificationEn: '+15 Group Dynamics',
    primaryColor: '#8B5CF6',
    secondaryColor: '#F5F3FF',
    accentColor: '#22C55E',
    autoName: 'Evento Colaborativo',
    autoNameEn: 'Collaborative Event',
  },
  {
    id: 'other',
    title: 'Otro Evento',
    titleEn: 'Other Event',
    image: '/images/list-types/other_events_miscellaneous_icon.png',
    microCopy: 'Cualquier evento que no encaje: Jubilación, Fiesta de Mascotas, o meta personal.',
    microCopyEn: 'Any event that doesn\'t fit: Retirement, Pet Party, or personal goal.',
    gamification: '+15 Plantillas',
    gamificationEn: '+15 Templates',
    primaryColor: '#6B7280',
    secondaryColor: '#F3F4F6',
    accentColor: '#22C55E',
    autoName: 'Mi Nueva Lista de Regalos',
    autoNameEn: 'My New Gift List',
  },
];
