import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Landing Page
    "hero.badge": "✨ Your Smart Shopping Assistant",
    "hero.title": "Shop Smarter,",
    "hero.titleHighlight": "Save More",
    "hero.description": "AI-powered shopping assistant that compares prices across 5+ stores instantly. Find the best deals for birthdays, holidays, or everyday shopping. Your personal deal hunter.",
    "hero.cta": "Start Saving Now",
    "hero.demo": "See How It Works",
    
    // Features
    "features.title": "Everything You Need",
    "features.subtitle": "Smart tools to shop better and save money",
    "features.lists.title": "Smart Wish Lists",
    "features.lists.description": "Organize items for any occasion with details, links, and AI suggestions",
    "features.groups.title": "Group Shopping",
    "features.groups.description": "Coordinate purchases with friends and family for any event",
    "features.events.title": "Multi-Occasion Support",
    "features.events.description": "Manage shopping lists for birthdays, weddings, holidays, and more",
    "features.privacy.title": "Price Transparency",
    "features.privacy.description": "Real-time price comparison across Amazon, Walmart, Target, Etsy, eBay",
    
    // CTA Section
    "cta.title": "Ready to Shop Smarter?",
    "cta.subtitle": "Join thousands saving money with AI-powered shopping",
    "cta.button": "Get Started Free",
    
    // Auth Page
    "auth.welcome": "Welcome to Givlyn",
    "auth.tagline": "Smart shopping, better prices, happy moments",
    "auth.getStarted": "Get Started",
    "auth.description": "Sign in or create your account",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.displayName": "Display Name",
    "auth.signingIn": "Signing in...",
    "auth.creatingAccount": "Creating account...",
    "auth.createAccount": "Create Account",
    "auth.accountCreated": "Account created successfully! Welcome.",
    "auth.welcomeBack": "Welcome back!",
    "auth.signUpFailed": "Failed to sign up",
    "auth.signInFailed": "Failed to sign in",
    "auth.emailAlreadyExists": "This email is already registered. Please sign in.",
    "auth.invalidCredentials": "Invalid email or password. Please check your credentials.",
    "auth.forgotPassword": "Forgot your password?",
    "auth.resetPassword": "Reset Password",
    "auth.resetPasswordDesc": "Enter your email and we'll send you a link to reset your password",
    "auth.sendResetLink": "Send Link",
    "auth.cancel": "Cancel",
    "auth.sending": "Sending...",
    "auth.resetEmailSent": "We've sent you an email to reset your password",
    "auth.resetEmailFailed": "Failed to send recovery email",
    "auth.passwordMinLength": "Minimum 6 characters",
    "auth.nameRequired": "Name is required",
    "auth.emailPlaceholder": "you@example.com",
    "auth.namePlaceholder": "Your name",
    "auth.passwordPlaceholder": "••••••••",
    
    // Dashboard
    "dashboard.welcomeBack": "Welcome back!",
    "dashboard.signOut": "Sign Out",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.createList": "Create Shopping List",
    "dashboard.joinGroup": "Create Shopping Group",
    "dashboard.manageEvents": "Manage Occasions",
    "dashboard.overview": "Your Overview",
    "dashboard.myLists": "My Shopping Lists",
    "dashboard.myGroups": "My Groups",
    "dashboard.events": "Occasions",
    "dashboard.listsCreated": "Shopping lists created",
    "dashboard.groupsJoined": "Groups joined",
    "dashboard.upcomingOccasions": "Upcoming occasions",
    "dashboard.gettingStarted": "Getting Started",
    "dashboard.gettingStartedDesc": "Complete these steps to maximize your savings",
    "dashboard.step1": "Create your first shopping list",
    "dashboard.step2": "Try the AI shopping assistant",
    "dashboard.step3": "Invite friends to coordinate",
    "dashboard.step4": "Compare prices automatically",
    "dashboard.signedOut": "Signed out successfully",
    "dashboard.signOutFailed": "Failed to sign out",
    "dashboard.loading": "Loading...",
    "dashboard.upcomingEvents": "Upcoming Occasions",
    "dashboard.listsDescription": "Shopping lists created",
    "dashboard.groupsDescription": "Groups for coordination",
    "dashboard.eventsDescription": "Occasions to shop for",
    "dashboard.planEvent": "Plan Shopping Event",
    
    // Onboarding Tour
    "welcome": "Welcome",
    "back": "Back",
    "close": "Close",
    "finish": "Finish",
    "next": "Next",
    "skip": "Skip",
    "tourWelcome": "Welcome to Givlyn! 🛍️",
    "tourWelcomeMessage": "Shop smarter with AI-powered price comparisons and deals.",
    "tourWelcomeSubtitle": "We'll show you in 4 steps how to save money.",
    "tourActionsStep": "These are the 3 main functions of Givlyn:",
    "tourActionsLists": "📝 Lists: Organize shopping for any occasion",
    "tourActionsGroups": "👥 Groups: Coordinate purchases with others",
    "tourActionsEvents": "🎉 Occasions: Plan shopping for special events",
    "tourCreateListStep": "Start here! Create your first shopping list. Add products manually or let AI suggest the best deals. Track prices across 5+ stores.",
    "tourStatsStep": "Here you'll see your progress: lists created, groups you coordinate with, and upcoming occasions. Your smart shopping hub!",
    
    // Welcome Onboarding
    "onboarding.step1.title": "Welcome to Givlyn! 🛍️",
    "onboarding.step1.description": "Your AI-powered shopping assistant that finds the best deals for any occasion: birthdays, weddings, holidays, or everyday shopping.",
    "onboarding.step2.title": "Shop Smarter in 3 Steps",
    "onboarding.step2.description": "It's simple and powerful:",
    "onboarding.step2.bullet1": "Tell us what you're shopping for (birthday, event, or daily needs)",
    "onboarding.step2.bullet2": "AI compares prices across 5+ stores instantly",
    "onboarding.step2.bullet3": "Buy at the best price with one click!",
    "onboarding.step3.title": "Ready to Start Saving?",
    "onboarding.step3.description": "Try the AI shopping assistant and find your first deal",
    "onboarding.createExchange": "Find Deals with AI",
    "onboarding.skipForNow": "Skip for Now",
    
    // Groups & Coordination
    "groups.howItWorks": "How Group Shopping Works",
    "groups.howItWorksDesc": "Coordinate purchases with friends and family",
    "groups.algorithm.title": "🎲 Smart Coordination",
    "groups.algorithm.desc": "Organize group purchases for any occasion. Split costs, avoid duplicate gifts, and coordinate effortlessly.",
    "groups.privacy.title": "🔒 Privacy Protected",
    "groups.privacy.desc": "Your shopping lists remain private unless you choose to share. Secure coordination with bank-level encryption.",
    "groups.fairness.title": "⚖️ Fair Distribution",
    "groups.fairness.desc": "When coordinating group purchases, everyone can see who's buying what to avoid duplicates and ensure fair contribution.",
    "groups.security.title": "🛡️ Bank-Level Security",
    "groups.security.desc": "All data encrypted and protected. Your purchase history and coordination details stay private and secure.",
    "groups.confidence.title": "Frequently Asked Questions",
    "groups.confidence.privacy": "Who can see my shopping lists?",
    "groups.confidence.privacyAnswer": "Only people you invite to your group can see shared lists. Private lists remain completely private to you.",
    "groups.confidence.redraw": "Can I change group coordinators?",
    "groups.confidence.redrawAnswer": "Yes. Group creators can transfer ownership or modify member permissions at any time.",
    "groups.confidence.memberLeaves": "What happens if someone leaves the group?",
    "groups.confidence.memberLeavesAnswer": "Their contributions remain visible for coordination, but they lose access to ongoing group activities.",
    "groups.confirmDraw.title": "Confirm Group Assignment",
    "groups.confirmDraw.description": "Coordinate who purchases what for this occasion. Each member will see their assigned items.",
    "groups.confirmDraw.warning": "⚠️ Important: Make sure all members have joined before coordinating. You can modify assignments later if needed.",
    "groups.confirmDraw.membersCount": "Members participating",
    "groups.confirmDraw.minMembers": "Minimum 3 members required",
    "groups.confirmDraw.budget": "Budget per person",
    "groups.confirmDraw.date": "Occasion date",
    "groups.confirmDraw.confirm": "Coordinate Purchases",
    "groups.confirmDraw.cancel": "Cancel",
    "groups.viewAssignment": "View My Items",
    "groups.drawComplete": "Coordination complete! Each member can now view their assigned items.",
    "groups.adminView": "Admin: View All",
    "groups.adminViewDesc": "View all assignments (creator only)",
    
    // Assignment Page
    "assignment.title": "Your Group Shopping Assignment",
    "assignment.subtitle": "Coordinate with your group for this occasion",
    "assignment.youGiftTo": "You're shopping for",
    "assignment.notFound": "Assignment not found",
    "assignment.notFoundDesc": "No assignment found for this group. Coordination may not be set up yet.",
    "assignment.budget": "Suggested budget",
    "assignment.exchangeDate": "Occasion date",
    "assignment.wishList": "Shopping List",
    "assignment.noWishList": "This person hasn't created a shopping list yet",
    "assignment.viewFullList": "View full list",
    "assignment.confidentiality": "💡 Smart Shopping",
    "assignment.confidentialityDesc": "Use the AI assistant to find the best prices across 5+ stores. Compare deals and save money on every purchase.",
    "assignment.backToGroup": "Back to Group",
    "assignment.loading": "Loading your items...",
    
    // Group Chat
    "chat.title": "Group Coordination",
    "chat.description": "Coordinate purchases with group members",
    "chat.placeholder": "Ask about preferences, sizes, colors...",
    "chat.send": "Send",
    "chat.noMessages": "No messages yet",
    "chat.you": "You",
    "chat.secretSanta": "Group Member",
    "chat.typing": "Typing...",
    "chat.howItWorks": "How does it work?",
    "chat.howItWorksDesc": "Coordinate with group members about purchases. Ask questions, share preferences, and avoid duplicate shopping. Perfect for organizing group occasions!",
    "chat.receivedMessages": "Messages from Group Members",
    "chat.receivedMessagesDesc": "Your group wants to coordinate with you!",
    
    // Dashboard Assignments
    "dashboard.myAssignments": "My Shopping Coordination",
    "dashboard.myAssignmentsDesc": "Groups where you're coordinating purchases",
    "dashboard.viewAssignment": "View My Items",
    "dashboard.noAssignments": "No active coordination yet",
    "dashboard.newMessage": "New message",
    
    // AI Assistant
    "aiAssistant.title": "Shopping Assistant",
    "aiAssistant.subtitle": "Powered by AI",
    "aiAssistant.initialMessage": "Hey! 👋 Ready to find the best deals? Tell me what you're shopping for!",
    "aiAssistant.placeholder": "What are you looking to buy?",
    "aiAssistant.giftBot": "ShopBot",
    
    // How It Works Page
    "howItWorks.backButton": "Back",
    "howItWorks.title": "How We Help You Save Money",
    "howItWorks.subtitle": "Smart shopping, full transparency, commissions that benefit you",
    "howItWorks.comparisonDirect": "Direct Purchase",
    "howItWorks.comparisonGiftApp": "With Givlyn",
    "howItWorks.noAI": "No intelligent recommendations",
    "howItWorks.hasAI": "AI analyzes thousands of products",
    "howItWorks.wasteTime": "Waste hours comparing",
    "howItWorks.weCompare": "We do the work for you",
    "howItWorks.noPriceCheck": "No price checking",
    "howItWorks.priceHistory": "Price history & alerts",
    "howItWorks.noExtra": "No extra value",
    "howItWorks.helpFree": "We help you for free",
    "howItWorks.price": "Same price as Amazon/stores",
    "howItWorks.samePriceEmphasis": "You pay exactly the same",
    "howItWorks.transparencyTitle": "How We Earn Money (And Why That's Good For You)",
    "howItWorks.step1": "You ask for a product recommendation",
    "howItWorks.step2": "Our AI analyzes thousands of options in real-time",
    "howItWorks.step3": "We show you the best products with transparent links",
    "howItWorks.step4": "If you buy, the store pays us a small commission (0% from your pocket)",
    "howItWorks.step5": "You save time and money with smarter choices",
    "howItWorks.step6": "We grow by helping you make better decisions",
    "howItWorks.exampleTitle": "Real Example:",
    "howItWorks.exampleProduct": "Wireless Headphones - $99.99",
    "howItWorks.exampleYouPay": "You pay: $99.99",
    "howItWorks.exampleStorePays": "Store pays us: ~$3.00 (3%)",
    "howItWorks.exampleWePay": "Store pays us: ~$3.00 (3%)",
    "howItWorks.exampleYourSavings": "Your savings with our recommendation: $15-30 (better choice)",
    "howItWorks.exampleYouSave": "Your savings with our recommendation: $15-30 (better choice)",
    "howItWorks.faqTitle": "Frequently Asked Questions",
    "howItWorks.faq1Q": "Will I pay more if I buy through your links?",
    "howItWorks.faq1A": "No. The price is identical to buying directly. The store compensates us from their margin, not from your wallet.",
    "howItWorks.faqExpensive": "Will I pay more if I buy through your links?",
    "howItWorks.faqExpensiveAnswer": "No. The price is identical to buying directly. The store compensates us from their margin, not from your wallet.",
    "howItWorks.faq2Q": "Why do you recommend certain products?",
    "howItWorks.faq2A": "Our AI objectively analyzes reviews, prices, and features. We recommend what's genuinely the best value, not what pays the most commission.",
    "howItWorks.faqSubscription": "Do I need a subscription or pay anything?",
    "howItWorks.faqSubscriptionAnswer": "No. Our service is 100% free for you. We only earn when stores compensate us for successful referrals.",
    "howItWorks.faq3Q": "Can I trust your recommendations?",
    "howItWorks.faq3A": "We only earn if you're satisfied. Bad recommendations = you don't return = we don't win. Our success depends on your trust.",
    "howItWorks.faqNotBuy": "What if I don't buy anything?",
    "howItWorks.faqNotBuyAnswer": "No problem! You can use our recommendations to compare and research. We only earn if you decide to purchase.",
    "howItWorks.faq4Q": "What if I find it cheaper elsewhere?",
    "howItWorks.faq4A": "Perfect! We'll show you. Our goal is to help you save, not trap you. If there's a better deal, our AI will find it.",
    "howItWorks.faqTrust": "How do you ensure recommendation quality?",
    "howItWorks.faqTrustAnswer": "Our AI analyzes thousands of verified reviews, price history, and product features. We recommend based on value, not commission rates.",
    "howItWorks.ctaTitle": "Ready to Shop Smarter?",
    "howItWorks.ctaSubtitle": "Join thousands who save time and money with intelligent recommendations",
    "howItWorks.ctaButton": "Try Gift Assistant Now",
    
    // Affiliate Disclosure
    "disclosure.smartBuying": "Smart Buying:",
    "disclosure.message": "We earn a small commission when you purchase through our links, at no extra cost to you. This helps us keep the service free.",
    "disclosure.learnMore": "Learn how it works"
  },
  es: {
    // Landing Page
    "hero.badge": "✨ Tu Asistente de Compras Inteligente",
    "hero.title": "Compra Mejor,",
    "hero.titleHighlight": "Ahorra Más",
    "hero.description": "Asistente de compras con IA que compara precios en 5+ tiendas al instante. Encuentra las mejores ofertas para cumpleaños, festividades o compras del día a día. Tu cazador personal de ofertas.",
    "hero.cta": "Empezar a Ahorrar",
    "hero.demo": "Ver Cómo Funciona",
    
    // Features
    "features.title": "Todo lo que Necesitas",
    "features.subtitle": "Herramientas inteligentes para comprar mejor y ahorrar dinero",
    "features.lists.title": "Listas Inteligentes",
    "features.lists.description": "Organiza artículos para cualquier ocasión con detalles, enlaces y sugerencias de IA",
    "features.groups.title": "Compras en Grupo",
    "features.groups.description": "Coordina compras con amigos y familia para cualquier evento",
    "features.events.title": "Multi-Ocasión",
    "features.events.description": "Gestiona listas de compras para cumpleaños, bodas, festividades y más",
    "features.privacy.title": "Transparencia de Precios",
    "features.privacy.description": "Comparación de precios en tiempo real: Amazon, Walmart, Target, Etsy, eBay",
    
    // CTA Section
    "cta.title": "¿Listo para Comprar Más Inteligente?",
    "cta.subtitle": "Únete a miles ahorrando dinero con compras impulsadas por IA",
    "cta.button": "Comenzar Gratis",
    
    // Auth Page
    "auth.welcome": "Bienvenido a Givlyn",
    "auth.tagline": "Compras inteligentes, mejores precios, momentos felices",
    "auth.getStarted": "Comenzar",
    "auth.description": "Inicia sesión o crea tu cuenta",
    "auth.signIn": "Iniciar Sesión",
    "auth.signUp": "Registrarse",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.name": "Nombre",
    "auth.displayName": "Nombre para Mostrar",
    "auth.signingIn": "Iniciando sesión...",
    "auth.creatingAccount": "Creando cuenta...",
    "auth.createAccount": "Crear Cuenta",
    "auth.accountCreated": "¡Cuenta creada exitosamente! Bienvenido.",
    "auth.welcomeBack": "¡Bienvenido de vuelta!",
    "auth.signUpFailed": "Error al registrarse",
    "auth.signInFailed": "Error al iniciar sesión",
    "auth.emailAlreadyExists": "Este correo ya está registrado. Por favor, inicia sesión.",
    "auth.invalidCredentials": "Correo o contraseña incorrectos. Por favor, verifica tus datos.",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.resetPassword": "Recuperar Contraseña",
    "auth.resetPasswordDesc": "Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña",
    "auth.sendResetLink": "Enviar Enlace",
    "auth.cancel": "Cancelar",
    "auth.sending": "Enviando...",
    "auth.resetEmailSent": "Te hemos enviado un correo para restablecer tu contraseña",
    "auth.resetEmailFailed": "Error al enviar el correo de recuperación",
    "auth.passwordMinLength": "Mínimo 6 caracteres",
    "auth.nameRequired": "El nombre es requerido",
    "auth.emailPlaceholder": "tu@ejemplo.com",
    "auth.namePlaceholder": "Tu nombre",
    "auth.passwordPlaceholder": "••••••••",
    
    // Dashboard
    "dashboard.welcomeBack": "¡Bienvenido de nuevo!",
    "dashboard.signOut": "Cerrar Sesión",
    "dashboard.quickActions": "Acciones Rápidas",
    "dashboard.createList": "Crear Lista de Compras",
    "dashboard.joinGroup": "Crear Grupo de Compras",
    "dashboard.manageEvents": "Gestionar Ocasiones",
    "dashboard.overview": "Tu Resumen",
    "dashboard.myLists": "Mis Listas de Compras",
    "dashboard.myGroups": "Mis Grupos",
    "dashboard.events": "Ocasiones",
    "dashboard.listsCreated": "Listas de compras creadas",
    "dashboard.groupsJoined": "Grupos unidos",
    "dashboard.upcomingOccasions": "Ocasiones próximas",
    "dashboard.gettingStarted": "Comenzando",
    "dashboard.gettingStartedDesc": "Completa estos pasos para maximizar tus ahorros",
    "dashboard.step1": "Crea tu primera lista de compras",
    "dashboard.step2": "Prueba el asistente de compras IA",
    "dashboard.step3": "Invita amigos para coordinar",
    "dashboard.step4": "Compara precios automáticamente",
    "dashboard.signedOut": "Sesión cerrada exitosamente",
    "dashboard.signOutFailed": "Error al cerrar sesión",
    "dashboard.loading": "Cargando...",
    "dashboard.upcomingEvents": "Ocasiones Próximas",
    "dashboard.listsDescription": "Listas de compras creadas",
    "dashboard.groupsDescription": "Grupos para coordinación",
    "dashboard.eventsDescription": "Ocasiones para comprar",
    "dashboard.planEvent": "Planificar Compras",
    
    // Tour de Bienvenida
    "welcome": "Bienvenido",
    "back": "Atrás",
    "close": "Cerrar",
    "finish": "Finalizar",
    "next": "Siguiente",
    "skip": "Saltar",
    "tourWelcome": "¡Bienvenido a Givlyn! 🛍️",
    "tourWelcomeMessage": "Compra más inteligente con comparaciones de precios y ofertas impulsadas por IA.",
    "tourWelcomeSubtitle": "Te mostraremos en 4 pasos cómo ahorrar dinero.",
    "tourActionsStep": "Estas son las 3 funciones principales de Givlyn:",
    "tourActionsLists": "📝 Listas: Organiza compras para cualquier ocasión",
    "tourActionsGroups": "👥 Grupos: Coordina compras con otros",
    "tourActionsEvents": "🎉 Ocasiones: Planifica compras para eventos especiales",
    "tourCreateListStep": "¡Empieza aquí! Crea tu primera lista de compras. Añade productos manualmente o deja que la IA sugiera las mejores ofertas. Compara precios en 5+ tiendas.",
    "tourStatsStep": "Aquí verás tu progreso: listas creadas, grupos con los que coordinas y ocasiones próximas. ¡Tu centro de compras inteligente!",
    
    // Welcome Onboarding
    "onboarding.step1.title": "¡Bienvenido a Givlyn! 🛍️",
    "onboarding.step1.description": "Tu asistente de compras impulsado por IA que encuentra las mejores ofertas para cualquier ocasión: cumpleaños, bodas, festividades o compras diarias.",
    "onboarding.step2.title": "Compra Más Inteligente en 3 Pasos",
    "onboarding.step2.description": "Es simple y poderoso:",
    "onboarding.step2.bullet1": "Dinos qué estás buscando (cumpleaños, evento o necesidades diarias)",
    "onboarding.step2.bullet2": "La IA compara precios en 5+ tiendas al instante",
    "onboarding.step2.bullet3": "¡Compra al mejor precio con un clic!",
    "onboarding.step3.title": "¿Listo para Empezar a Ahorrar?",
    "onboarding.step3.description": "Prueba el asistente de compras IA y encuentra tu primera oferta",
    "onboarding.createExchange": "Buscar Ofertas con IA",
    "onboarding.skipForNow": "Saltar por Ahora",
    
    // Grupos y Coordinación
    "groups.howItWorks": "Cómo Funcionan las Compras en Grupo",
    "groups.howItWorksDesc": "Coordina compras con amigos y familia",
    "groups.algorithm.title": "🎲 Coordinación Inteligente",
    "groups.algorithm.desc": "Organiza compras grupales para cualquier ocasión. Divide costos, evita regalos duplicados y coordina sin esfuerzo.",
    "groups.privacy.title": "🔒 Privacidad Protegida",
    "groups.privacy.desc": "Tus listas de compras permanecen privadas a menos que elijas compartirlas. Coordinación segura con cifrado de nivel bancario.",
    "groups.fairness.title": "⚖️ Distribución Justa",
    "groups.fairness.desc": "Al coordinar compras grupales, todos pueden ver quién compra qué para evitar duplicados y asegurar contribución justa.",
    "groups.security.title": "🛡️ Seguridad de Nivel Bancario",
    "groups.security.desc": "Todos los datos cifrados y protegidos. Tu historial de compras y detalles de coordinación permanecen privados y seguros.",
    "groups.confidence.title": "Preguntas Frecuentes",
    "groups.confidence.privacy": "¿Quién puede ver mis listas de compras?",
    "groups.confidence.privacyAnswer": "Solo las personas que invites a tu grupo pueden ver listas compartidas. Las listas privadas permanecen completamente privadas.",
    "groups.confidence.redraw": "¿Puedo cambiar coordinadores del grupo?",
    "groups.confidence.redrawAnswer": "Sí. Los creadores del grupo pueden transferir propiedad o modificar permisos de miembros en cualquier momento.",
    "groups.confidence.memberLeaves": "¿Qué pasa si alguien sale del grupo?",
    "groups.confidence.memberLeavesAnswer": "Sus contribuciones permanecen visibles para coordinación, pero pierden acceso a actividades grupales en curso.",
    "groups.confirmDraw.title": "Confirmar Asignación Grupal",
    "groups.confirmDraw.description": "Coordina quién compra qué para esta ocasión. Cada miembro verá sus artículos asignados.",
    "groups.confirmDraw.warning": "⚠️ Importante: Asegúrate de que todos los miembros se hayan unido antes de coordinar. Puedes modificar asignaciones después si es necesario.",
    "groups.confirmDraw.membersCount": "Miembros participantes",
    "groups.confirmDraw.minMembers": "Mínimo 3 miembros requeridos",
    "groups.confirmDraw.budget": "Presupuesto por persona",
    "groups.confirmDraw.date": "Fecha de la ocasión",
    "groups.confirmDraw.confirm": "Coordinar Compras",
    "groups.confirmDraw.cancel": "Cancelar",
    "groups.viewAssignment": "Ver Mis Artículos",
    "groups.drawComplete": "¡Coordinación completa! Cada miembro puede ver ahora sus artículos asignados.",
    "groups.adminView": "Admin: Ver Todo",
    "groups.adminViewDesc": "Ver todas las asignaciones (solo creador)",
    
    // Página de Asignación
    "assignment.title": "Tu Asignación de Compras Grupales",
    "assignment.subtitle": "Coordina con tu grupo para esta ocasión",
    "assignment.youGiftTo": "Estás comprando para",
    "assignment.notFound": "Asignación no encontrada",
    "assignment.notFoundDesc": "No se encontró asignación para este grupo. La coordinación puede no estar configurada aún.",
    "assignment.budget": "Presupuesto sugerido",
    "assignment.exchangeDate": "Fecha de la ocasión",
    "assignment.wishList": "Lista de Compras",
    "assignment.noWishList": "Esta persona aún no ha creado una lista de compras",
    "assignment.viewFullList": "Ver lista completa",
    "assignment.confidentiality": "💡 Compras Inteligentes",
    "assignment.confidentialityDesc": "Usa el asistente de IA para encontrar los mejores precios en 5+ tiendas. Compara ofertas y ahorra dinero en cada compra.",
    "assignment.backToGroup": "Volver al Grupo",
    "assignment.loading": "Cargando tus artículos...",
    
    // Chat Grupal
    "chat.title": "Coordinación Grupal",
    "chat.description": "Coordina compras con miembros del grupo",
    "chat.placeholder": "Pregunta sobre preferencias, tallas, colores...",
    "chat.send": "Enviar",
    "chat.noMessages": "Aún no hay mensajes",
    "chat.you": "Tú",
    "chat.secretSanta": "Miembro del Grupo",
    "chat.typing": "Escribiendo...",
    "chat.howItWorks": "¿Cómo funciona?",
    "chat.howItWorksDesc": "Coordina con miembros del grupo sobre compras. Haz preguntas, comparte preferencias y evita compras duplicadas. ¡Perfecto para organizar ocasiones grupales!",
    "chat.receivedMessages": "Mensajes de Miembros del Grupo",
    "chat.receivedMessagesDesc": "¡Tu grupo quiere coordinar contigo!",
    
    // Asignaciones Dashboard
    "dashboard.myAssignments": "Mi Coordinación de Compras",
    "dashboard.myAssignmentsDesc": "Grupos donde estás coordinando compras",
    "dashboard.viewAssignment": "Ver Mis Artículos",
    "dashboard.noAssignments": "Aún no tienes coordinación activa",
    "dashboard.newMessage": "Mensaje nuevo",
    
    // AI Assistant
    "aiAssistant.title": "Asistente de Compras",
    "aiAssistant.subtitle": "Impulsado por IA",
    "aiAssistant.initialMessage": "¡Hola! 👋 ¿Listo para encontrar las mejores ofertas? ¡Dime qué estás buscando!",
    "aiAssistant.placeholder": "¿Qué estás buscando comprar?",
    "aiAssistant.giftBot": "ShopBot",
    
    // How It Works Page
    "howItWorks.backButton": "Volver",
    "howItWorks.title": "Cómo Te Ayudamos a Ahorrar Dinero",
    "howItWorks.subtitle": "Compras inteligentes, transparencia total, comisiones que te benefician",
    "howItWorks.comparisonDirect": "Compra Directa",
    "howItWorks.comparisonGiftApp": "Con Givlyn",
    "howItWorks.noAI": "Sin recomendaciones inteligentes",
    "howItWorks.hasAI": "IA analiza miles de productos",
    "howItWorks.wasteTime": "Pierdes horas comparando",
    "howItWorks.weCompare": "Hacemos el trabajo por ti",
    "howItWorks.noPriceCheck": "Sin verificación de precios",
    "howItWorks.priceHistory": "Historial de precios y alertas",
    "howItWorks.noExtra": "Sin valor extra",
    "howItWorks.helpFree": "Te ayudamos gratis",
    "howItWorks.price": "Mismo precio que Amazon/tiendas",
    "howItWorks.samePriceEmphasis": "Pagas exactamente lo mismo",
    "howItWorks.transparencyTitle": "Cómo Ganamos Dinero (Y Por Qué Eso Es Bueno Para Ti)",
    "howItWorks.step1": "Pides una recomendación de producto",
    "howItWorks.step2": "Nuestra IA analiza miles de opciones en tiempo real",
    "howItWorks.step3": "Te mostramos los mejores productos con enlaces transparentes",
    "howItWorks.step4": "Si compras, la tienda nos paga una pequeña comisión (0% de tu bolsillo)",
    "howItWorks.step5": "Ahorras tiempo y dinero con mejores decisiones",
    "howItWorks.step6": "Crecemos ayudándote a decidir mejor",
    "howItWorks.exampleTitle": "Ejemplo Real:",
    "howItWorks.exampleProduct": "Audífonos Inalámbricos - $99.99",
    "howItWorks.exampleYouPay": "Tú pagas: $99.99",
    "howItWorks.exampleStorePays": "La tienda nos paga: ~$3.00 (3%)",
    "howItWorks.exampleWePay": "La tienda nos paga: ~$3.00 (3%)",
    "howItWorks.exampleYourSavings": "Tu ahorro con nuestra recomendación: $15-30 (mejor elección)",
    "howItWorks.exampleYouSave": "Tu ahorro con nuestra recomendación: $15-30 (mejor elección)",
    "howItWorks.faqTitle": "Preguntas Frecuentes",
    "howItWorks.faq1Q": "¿Pagaré más si compro a través de sus enlaces?",
    "howItWorks.faq1A": "No. El precio es idéntico a comprar directamente. La tienda nos compensa de su margen, no de tu bolsillo.",
    "howItWorks.faqExpensive": "¿Pagaré más si compro a través de sus enlaces?",
    "howItWorks.faqExpensiveAnswer": "No. El precio es idéntico a comprar directamente. La tienda nos compensa de su margen, no de tu bolsillo.",
    "howItWorks.faq2Q": "¿Necesito suscripción o pagar algo?",
    "howItWorks.faq2A": "No. Nuestro servicio es 100% gratuito para ti. Solo ganamos cuando las tiendas nos compensan por referencias exitosas.",
    "howItWorks.faqSubscription": "¿Necesito suscripción o pagar algo?",
    "howItWorks.faqSubscriptionAnswer": "No. Nuestro servicio es 100% gratuito para ti. Solo ganamos cuando las tiendas nos compensan por referencias exitosas.",
    "howItWorks.faq3Q": "¿Qué pasa si no compro nada?",
    "howItWorks.faq3A": "¡No hay problema! Puedes usar nuestras recomendaciones para comparar e investigar. Solo ganamos si decides comprar.",
    "howItWorks.faqNotBuy": "¿Qué pasa si no compro nada?",
    "howItWorks.faqNotBuyAnswer": "¡No hay problema! Puedes usar nuestras recomendaciones para comparar e investigar. Solo ganamos si decides comprar.",
    "howItWorks.faq4Q": "¿Cómo aseguran la calidad de las recomendaciones?",
    "howItWorks.faq4A": "Nuestra IA analiza miles de reseñas verificadas, historial de precios y características del producto. Recomendamos según valor, no según comisiones.",
    "howItWorks.faqTrust": "¿Cómo aseguran la calidad de las recomendaciones?",
    "howItWorks.faqTrustAnswer": "Nuestra IA analiza miles de reseñas verificadas, historial de precios y características del producto. Recomendamos según valor, no según comisiones.",
    "howItWorks.ctaTitle": "¿Listo para Comprar Más Inteligente?",
    "howItWorks.ctaSubtitle": "Únete a miles que ahorran tiempo y dinero con recomendaciones inteligentes",
    "howItWorks.ctaButton": "Probar Asistente Ahora",
    
    // Affiliate Disclosure
    "disclosure.smartBuying": "Compra Inteligente:",
    "disclosure.message": "Ganamos una pequeña comisión cuando compras a través de nuestros enlaces, sin costo extra para ti. Esto nos ayuda a mantener el servicio gratuito.",
    "disclosure.learnMore": "Cómo funciona"
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "es") return saved;
    
    // Auto-detect browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('es') ? 'es' : 'en';
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};