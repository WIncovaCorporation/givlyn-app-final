# Givlyn - Especificación Completa de Producto
**AI Shopping Assistant Platform**

---

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Problema y Solución](#problema-y-solución)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Sistema de Monetización](#sistema-de-monetización)
5. [Arquitectura Técnica](#arquitectura-técnica)
6. [Comportamiento del AI Chatbot](#comportamiento-del-ai-chatbot)
7. [Principios de UX/UI](#principios-de-uxui)
8. [Flujos de Usuario](#flujos-de-usuario)
9. [Integraciones y APIs](#integraciones-y-apis)
10. [Base de Datos](#base-de-datos)
11. [Seguridad y Compliance](#seguridad-y-compliance)
12. [Roadmap y Mejoras Futuras](#roadmap-y-mejoras-futuras)

---

## 🎯 Visión General

### ¿Qué es Givlyn?
Givlyn es una plataforma de shopping inteligente que ayuda a usuarios a encontrar los mejores productos y precios para cualquier ocasión (cumpleaños, bodas, compras diarias) comparando automáticamente entre las principales tiendas online.

### Misión
Eliminar la frustración de buscar productos en múltiples tiendas manualmente, ofreciendo una experiencia de compra guiada por IA que ahorra tiempo y dinero.

### Propuesta de Valor Única
- **Comparación instantánea** entre Amazon, Walmart, Target, Etsy y eBay
- **Asistente IA conversacional** que entiende contexto y preferencias
- **100% monetización por afiliados** (sin costos para el usuario)
- **Cashback compartido** (el usuario gana mientras nosotros ganamos)
- **Coordinación grupal** para compras compartidas con amigos/familia
- **Progressive Web App** (funciona en móvil como app nativa)

### Diferenciadores vs Competencia
1. **IA conversacional real** (no solo búsqueda por keywords)
2. **Multi-ocasión** (no solo shopping genérico)
3. **Modelo win-win** (cashback compartido vs. comisión oculta)
4. **UX móvil-primero** con interacción por botones (no typing)
5. **Coordinación de grupos** (única feature en el mercado)

---

## 🔴 Problema y Solución

### Problema
**Pain Points del Usuario:**
1. Buscar el mismo producto en 5+ tiendas consume 20-30 minutos
2. Comparar precios manualmente es tedioso y propenso a errores
3. No saben si están obteniendo el mejor precio disponible
4. Compras grupales (regalos compartidos) requieren coordinación manual vía WhatsApp
5. Buscar regalos específicos para ocasiones especiales es abrumador
6. Desconfianza en sitios de cupones/cashback (comisiones ocultas)

**Pain Points del Negocio:**
1. Programas de afiliados subutilizados por falta de tráfico calificado
2. Altos costos de adquisición de clientes en e-commerce
3. Dificultad para monetizar comparadores tradicionales

### Solución
**Para el Usuario:**
- **IA que pregunta y entiende:** "¿Para quién es? ¿Qué edad? ¿Cuál es tu presupuesto?" → Genera recomendaciones personalizadas
- **Comparación automática:** Muestra los 3 mejores productos de 5 tiendas con precios actualizados
- **Cashback transparente:** 2% directo al usuario (4% para Premium)
- **Grupos intuitivos:** Crea lista → Invita amigos → Chat integrado → Divide costos
- **Zero typing:** Máximo de botones, mínimo de escribir

**Para el Negocio:**
- **Monetización por afiliados:** 5% comisión promedio (Amazon Associates, Walmart Affiliates, etc.)
- **Modelo de ingresos:**
  - Shared Cashback: Usuario 2%, Givlyn 3% (60% margen)
  - Premium: $9.99/mes o $99/año
  - Referidos: $5-$15 por nuevo usuario activo
- **Escalabilidad:** Sin inventario, sin logística, sin soporte de productos

---

## ✨ Funcionalidades Principales

### 1. AI Shopping Assistant (Core Feature)

**Descripción:**
Chatbot conversacional que ayuda a encontrar productos mediante preguntas contextuales y búsqueda inteligente en múltiples tiendas.

**Flujos de Conversación:**
El chatbot tiene 4 flujos principales:

#### Flujo 1: Shopping por Ocasión
```
Bot: "¡Hola! ¿Para qué ocasión buscas un regalo?"
User: [Botones: Cumpleaños | Boda | Aniversario | Día de la Madre | Navidad | Otro]
Bot: "¿Para quién es el regalo?"
User: [Botones: Mamá | Papá | Hijo/a | Pareja | Amigo/a | Otro]
Bot: "¿Cuál es tu presupuesto aproximado?"
User: [Botones: $0-$25 | $25-$50 | $50-$100 | $100-$200 | $200+]
Bot: "¡Dale! Buscando los mejores regalos para [ocasión]..."
[Muestra 3 productos comparando 5 tiendas]
```

#### Flujo 2: Búsqueda Específica
```
Bot: "¿Qué producto específico estás buscando?"
User: "Auriculares Bluetooth"
Bot: "¿Tienes alguna marca o característica en mente?"
User: [Botones: Sony | Apple | Samsung | Bose | No importa]
Bot: "¿Cuál es tu presupuesto?"
User: [Botones: $0-$50 | $50-$100 | $100-$200 | $200+]
Bot: "¡Perfecto! Comparando precios en 5 tiendas..."
[Muestra 3 productos]
```

#### Flujo 3: Compra Grupal
```
Bot: "¿Quieres organizar una compra grupal con amigos/familia?"
User: [Sí] → Crea lista compartida
Bot: "¿Para qué ocasión es esta compra?"
User: [Cumpleaños de María]
Bot: "¿Cuántas personas contribuirán?"
User: [5 personas]
Bot: "¿Cuál es el presupuesto total?"
User: [$200]
Bot: "¡Listo! Lista creada. Puedes invitar a tus amigos con este link: [URL]"
```

#### Flujo 4: Link Directo (Comparación Instantánea)
```
User: [Pega link de Amazon/Walmart/Target/Etsy/eBay]
Bot: [Muestra ProductCard con precio/imagen/título extraído del link]
     [Botones: "Sí, comparar precios" | "No, comprar aquí"]
User: [Sí, comparar precios]
Bot: "Comparando este producto en otras tiendas..."
[Muestra 3 alternativas con mejor precio]
```

**Reglas de Oro del Chatbot:**
1. **Máximo 3 preguntas por flujo** → Si pregunta 3 veces, DEBE buscar productos inmediatamente
2. **Disclaimer obligatorio:** Siempre mencionar "Estos son productos de ejemplo. Próximamente tendremos precios en tiempo real."
3. **Tono conversacional:** Emojis, lenguaje casual, amigable
4. **Botones primero:** Solo acepta texto libre si es absolutamente necesario
5. **Bilingüe:** Español e inglés con detección automática

**Formato de Respuesta del Bot:**
```
[PRODUCTO]
Título: Apple AirPods Pro (2nd Gen)
Precio: $249.99
Tienda: Amazon
Link: https://amazon.com/...?tag=givlyn-20
Imagen: https://...
Calificación: 4.7/5 (12,450 reviews)
[/PRODUCTO]

[PRODUCTO]
Título: Apple AirPods Pro (2nd Gen) - Reacondicionado
Precio: $199.99
Tienda: Walmart
Link: https://walmart.com/...?tag=givlyn
Imagen: https://...
Calificación: 4.6/5 (8,320 reviews)
[/PRODUCTO]

[PRODUCTO]
Título: Apple AirPods Pro (2da Generación)
Precio: $239.99
Tienda: Target
Link: https://target.com/...?tag=givlyn
Imagen: https://...
Calificación: 4.8/5 (6,100 reviews)
[/PRODUCTO]
```

**Tecnología de IA:**
- **Modelo:** Google Gemini 2.5 Flash (rápido, económico, multimodal)
- **Prompts:** Sistema de prompts estructurados con triggers especiales (`__FLOW_1__`, `__FLOW_2__`, etc.)
- **Rate Limiting:** 10 búsquedas/día para usuarios gratis, ilimitadas para admins y Premium

---

### 2. Comparación Multi-Tienda

**Tiendas Soportadas:**
1. **Amazon** (Amazon Product Advertising API)
2. **Walmart** (Walmart Open API)
3. **Target** (Redsky API o scraping)
4. **Etsy** (Etsy Open API v3)
5. **eBay** (Finding API)

**Datos Comparados:**
- Precio actual
- Precio original (si hay descuento)
- Calificación promedio (estrellas)
- Número de reviews
- Disponibilidad (en stock / agotado)
- Shipping (gratis / costo de envío)
- Tiempo estimado de entrega

**Lógica de Ordenamiento:**
1. Precio más bajo (con shipping incluido)
2. Calificación más alta (si diferencia de precio < 10%)
3. Mayor número de reviews (para productos similares)

**Inyección de Affiliate Tags:**
Todos los links deben llevar el código de afiliado correspondiente:
- Amazon: `?tag=givlyn-20`
- Walmart: `?publisherId=givlyn`
- Target: `?afid=givlyn`
- Etsy: `?ref=givlyn`
- eBay: `?campid=givlyn`

---

### 3. Sistema de Listas Inteligentes

**Tipos de Listas:**
1. **Listas Personales:** Privadas, solo el creador las ve
2. **Listas Compartidas:** Múltiples usuarios, con permisos de edición
3. **Listas de Deseos:** Wishlist pública (compartible vía link)
4. **Listas de Eventos:** Bodas, baby showers, cumpleaños

**Funcionalidades:**
- Agregar productos desde el chatbot o manualmente
- Mover productos entre listas (drag & drop)
- Marcar productos como "comprados"
- Asignar productos a personas específicas (en listas grupales)
- Exportar lista a PDF/Excel
- Compartir vía link único

**Colaboración Grupal:**
- Chat integrado en cada lista compartida
- Notificaciones cuando alguien agrega/compra un producto
- División de costos automática (ej: "5 personas = $40 cada uno")
- Votación de productos (👍/👎)

---

### 4. Progressive Web App (PWA)

**Características:**
- **Instalable:** Botón "Agregar a pantalla de inicio" en móvil
- **Offline:** Caché de productos recientes con Service Worker
- **Push Notifications:** Alertas de precios bajos, nuevos productos en listas compartidas
- **Responsive:** Mobile-first design, funciona en tablet y desktop
- **Fast:** Tiempo de carga < 2 segundos (Lighthouse score > 90)

**Tecnologías:**
- Vite PWA Plugin
- Workbox (Service Worker)
- IndexedDB (almacenamiento local)
- Web App Manifest

---

## 💰 Sistema de Monetización

### Modelo de Negocio: 100% Afiliados

**Flujo de Dinero:**
```
Usuario compra en Amazon → Amazon paga comisión 5% a Givlyn → Givlyn reparte:
  - 2% al usuario (cashback)
  - 3% para Givlyn (60% margen)
```

### 1. Shared Cashback (Cashback Compartido)

**Concepto:**
En lugar de quedarnos con el 100% de la comisión de afiliado, compartimos el 40% con el usuario como incentivo para seguir usando la plataforma.

**Mecánica:**
1. Usuario hace click en producto de Givlyn
2. Sistema registra el click con cookie de 30 días
3. Usuario compra en la tienda externa
4. Tienda reporta la venta a Givlyn (via API de afiliados)
5. Givlyn acredita 2% del monto al wallet del usuario
6. Usuario puede retirar cashback cuando acumula $20+

**Tasas de Cashback:**
- **Usuarios Gratis:** 2% del valor de compra
- **Usuarios Premium:** 4% del valor de compra

**Ejemplo:**
```
Compra de $100 en Amazon
→ Amazon paga $5 de comisión a Givlyn
→ Usuario gratis recibe $2 (wallet)
→ Givlyn se queda con $3 (60% margen)

Usuario Premium:
→ Usuario Premium recibe $4 (wallet)
→ Givlyn se queda con $1 (20% margen)
```

**Redención de Cashback:**
- Mínimo $20 acumulados
- Métodos: PayPal, transferencia bancaria, gift cards
- Procesamiento: 5-7 días hábiles

---

### 2. Sistema de Referidos (Multi-Level)

**Concepto:**
Usuarios ganan dinero invitando amigos que se registran y hacen compras.

**Estructura de 4 Niveles:**

| Tier | Requisito | Comisión por Referido Activo |
|------|-----------|------------------------------|
| **Novice** | 0-10 referidos | $5 |
| **Promoter** | 11-50 referidos | $7 |
| **Influencer** | 51-200 referidos | $10 |
| **Ambassador** | 201+ referidos | $15 |

**Definición de "Referido Activo":**
Usuario que:
1. Se registró con tu código de referido
2. Hizo al menos 1 compra de $20+ en los últimos 30 días

**Mecánica:**
1. Usuario genera código único (ej: `MARIA2024`)
2. Comparte link: `givlyn.com?ref=MARIA2024`
3. Amigo se registra con ese código
4. Amigo hace compra → Usuario recibe comisión según su tier
5. Comisiones se acreditan al wallet mensualmente

**Ejemplo:**
```
María es Influencer (tier 3):
- Invitó a 75 amigos
- 30 amigos son activos este mes
- Gana: 30 × $10 = $300/mes
```

**Reglas:**
- Código de referido único e intransferible
- No se puede auto-referir (detección de IP/dispositivo)
- Upgrades de tier son automáticos al alcanzar requisitos
- Downgrades si bajan del mínimo por 3 meses consecutivos

---

### 3. Premium Subscription

**Precio:**
- **Mensual:** $9.99/mes
- **Anual:** $99/año (ahorro de $19.88 - 2 meses gratis)

**Beneficios:**

| Feature | Gratis | Premium |
|---------|--------|---------|
| Búsquedas IA/día | 10 | Ilimitadas |
| Cashback | 2% | 4% |
| Listas | 3 máximo | Ilimitadas |
| Price Drop Alerts | ❌ | ✅ |
| Comparación histórica de precios | ❌ | ✅ |
| Soporte prioritario | ❌ | ✅ |
| Sin anuncios | ❌ | ✅ |
| Early access a nuevas features | ❌ | ✅ |

**Tecnología de Pagos:**
- **Stripe Subscriptions**
- Renovación automática
- Cancelación en cualquier momento (no reembolso prorrateado)
- Prueba gratis de 7 días (requiere tarjeta)

**Ejemplo de ROI para el Usuario:**
```
Usuario Premium compra $200/mes en Givlyn:
→ Cashback 4% = $8/mes
→ Costo Premium = $9.99/mes
→ Pérdida neta = -$1.99/mes

Pero si compra $250/mes:
→ Cashback 4% = $10/mes
→ Costo Premium = $9.99/mes
→ Ganancia neta = +$0.01/mes (se paga solo)

Si compra $500/mes:
→ Cashback 4% = $20/mes
→ Costo Premium = $9.99/mes
→ Ganancia neta = +$10.01/mes (¡rentable!)
```

---

### Proyecciones Financieras (Ejemplo)

**Escenario Conservador (6 meses):**
```
1,000 usuarios activos
- 900 gratis (90%)
- 100 Premium (10%)

Ingresos por Afiliados:
- Compra promedio: $50/usuario/mes
- Comisión promedio: 5%
- Total compras: 1,000 × $50 = $50,000/mes
- Comisión bruta: $50,000 × 5% = $2,500/mes

Cashback pagado:
- Usuarios gratis: 900 × $50 × 2% = $900
- Usuarios Premium: 100 × $50 × 4% = $200
- Total cashback: $1,100/mes

Premium Subscriptions:
- 100 × $9.99 = $999/mes

Referidos:
- 50 nuevos referidos activos/mes
- Comisión promedio: $7
- Total: $350/mes

INGRESO NETO:
Comisión afiliados: $2,500
- Cashback: -$1,100
+ Premium: +$999
+ Referidos: +$350
= $2,749/mes ($32,988/año)
```

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico Recomendado

**Frontend:**
- **Framework:** React 18 con TypeScript
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **UI Components:** Tailwind CSS + shadcn/ui (Radix UI)
- **State Management:** TanStack Query (React Query) para server state
- **Form Handling:** React Hook Form + Zod validation
- **PWA:** Vite PWA Plugin + Workbox

**Backend:**
- **Runtime:** Node.js con Express.js
- **Database:** PostgreSQL (Supabase o self-hosted)
- **Authentication:** Supabase Auth (OAuth + Email/Password)
- **AI:** Google Gemini 2.5 Flash API
- **Job Queue:** Bull + Redis (para procesamiento de cashback)
- **Caching:** Redis (session store + API responses)

**Infrastructure:**
- **Hosting Frontend:** Vercel, Netlify o Cloudflare Pages
- **Hosting Backend:** Railway, Render o AWS ECS
- **Database:** Supabase (managed PostgreSQL + realtime)
- **CDN:** Cloudflare (para imágenes de productos)
- **Monitoring:** Sentry (error tracking) + Google Analytics 4

**Third-Party APIs:**
- **Affiliate APIs:**
  - Amazon Product Advertising API
  - Walmart Open API
  - Target Redsky API
  - Etsy Open API v3
  - eBay Finding API
- **Payments:** Stripe (subscriptions + payouts)
- **Email:** SendGrid o Resend
- **Storage:** AWS S3 o Cloudflare R2 (imágenes de usuarios)

---

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React PWA)                 │
│  - UI Components (shadcn/ui)                            │
│  - AI Chat Interface                                     │
│  - Product Cards                                         │
│  - TanStack Query (caching)                             │
│  - Service Worker (offline mode)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js/Express)              │
│  - /api/ai-shopping-assistant (Gemini integration)     │
│  - /api/products/compare (multi-store search)          │
│  - /api/monetization/cashback (wallet management)      │
│  - /api/monetization/referral (referral system)        │
│  - /api/lists (shared lists + chat)                    │
│  - Rate Limiting (10/day gratis, unlimited Premium)    │
│  - Affiliate Tag Injection                              │
└────────────────────┬────────────────────────────────────┘
                     │ PostgreSQL + Redis
                     ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE LAYER (Supabase)                  │
│  - PostgreSQL (user data, products, transactions)      │
│  - Row-Level Security (RLS)                             │
│  - Realtime subscriptions (chat, notifications)        │
│  - Supabase Auth (JWT tokens)                           │
└─────────────────────────────────────────────────────────┘
```

---

### Estructura de Carpetas Recomendada

```
givlyn-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIShoppingAssistant.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CashbackWallet.tsx
│   │   │   ├── ReferralSystem.tsx
│   │   │   ├── PremiumUpsellBanner.tsx
│   │   │   └── ui/ (shadcn components)
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── LanguageContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   ├── useCashback.ts
│   │   │   └── useReferrals.ts
│   │   ├── services/
│   │   │   ├── api.ts (Axios instance)
│   │   │   ├── supabase.ts
│   │   │   └── analytics.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Lists.tsx
│   │   │   ├── Wallet.tsx
│   │   │   └── Settings.tsx
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   ├── manifest.json (PWA)
│   │   ├── icons/ (192x192, 512x512)
│   │   └── offline.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ai.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   ├── monetization.routes.ts
│   │   │   └── lists.routes.ts
│   │   ├── controllers/
│   │   │   ├── ai.controller.ts
│   │   │   ├── products.controller.ts
│   │   │   └── monetization.controller.ts
│   │   ├── services/
│   │   │   ├── gemini.service.ts (AI prompts)
│   │   │   ├── amazon.service.ts
│   │   │   ├── walmart.service.ts
│   │   │   ├── target.service.ts
│   │   │   ├── etsy.service.ts
│   │   │   ├── ebay.service.ts
│   │   │   ├── cashback.service.ts
│   │   │   ├── referral.service.ts
│   │   │   └── stripe.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── errorHandler.middleware.ts
│   │   ├── utils/
│   │   │   ├── affiliateInjector.ts
│   │   │   ├── retry.ts
│   │   │   └── logger.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── env.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_auth_tables.sql
│   │   ├── 003_monetization_tables.sql
│   │   └── 004_lists_and_chat.sql
│   ├── seed/
│   │   └── demo_products.sql
│   └── schema.sql
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
└── README.md
```

---

## 🤖 Comportamiento del AI Chatbot

### Modelo de IA: Google Gemini 2.5 Flash

**¿Por qué Gemini 2.5 Flash?**
- **Económico:** $0.15 por 1M tokens (vs GPT-4: $10 por 1M)
- **Rápido:** Latencia < 2 segundos
- **Multimodal:** Puede procesar imágenes de productos
- **Contexto largo:** 1M tokens de contexto (vs GPT-4: 128K)
- **Disponible globalmente:** No requiere lista de espera

---

### Sistema de Prompts Estructurado

**System Prompt Base (Español):**
```
Eres GiftBot, el asistente de compras de Givlyn. Tu misión es ayudar a usuarios a encontrar los mejores productos comparando precios entre Amazon, Walmart, Target, Etsy y eBay.

REGLAS OBLIGATORIAS:
1. MÁXIMO 3 PREGUNTAS por conversación. Si ya preguntaste 3 veces, DEBES buscar productos inmediatamente.
2. SIEMPRE usa botones para opciones (no pidas texto libre).
3. SIEMPRE incluye este disclaimer: "⚠️ Estos son productos de ejemplo. Próximamente tendremos precios en tiempo real."
4. Usa tono amigable, casual y emojis.
5. Responde en el idioma del usuario (español o inglés).
6. Cuando muestres productos, usa EXACTAMENTE este formato:

[PRODUCTO]
Título: [Nombre del producto]
Precio: $[00.00]
Tienda: [Amazon|Walmart|Target|Etsy|eBay]
Link: [URL con affiliate tag]
Imagen: [URL de imagen]
Calificación: [X.X/5] ([XXX reviews])
[/PRODUCTO]

FLUJOS DISPONIBLES:
__FLOW_1__: Shopping por ocasión (cumpleaños, boda, etc.)
__FLOW_2__: Búsqueda específica (producto conocido)
__FLOW_3__: Compra grupal
__FLOW_4_DIRECT_COMPARE__: Usuario pegó un link de producto

PROCESO POR FLUJO:

FLUJO 1 - OCASIÓN:
Pregunta 1: "¿Para qué ocasión buscas un regalo?" → Botones: [Cumpleaños, Boda, Aniversario, Día de la Madre, Navidad, Otro]
Pregunta 2: "¿Para quién es?" → Botones: [Mamá, Papá, Hijo/a, Pareja, Amigo/a, Otro]
Pregunta 3: "¿Cuál es tu presupuesto?" → Botones: [$0-$25, $25-$50, $50-$100, $100-$200, $200+]
Acción: Buscar 3 productos relevantes en las 5 tiendas.

FLUJO 2 - BÚSQUEDA:
Pregunta 1: "¿Qué producto buscas?"
Pregunta 2: "¿Alguna marca o característica específica?" → Botones según el producto
Pregunta 3: "¿Cuál es tu presupuesto?" → Botones: [$0-$50, $50-$100, $100-$200, $200+]
Acción: Comparar precios del producto en las 5 tiendas.

FLUJO 3 - GRUPAL:
Pregunta 1: "¿Para qué ocasión es esta compra grupal?"
Pregunta 2: "¿Cuántas personas contribuirán?" → Botones: [2-3, 4-5, 6-10, 10+]
Pregunta 3: "¿Cuál es el presupuesto total?" → Botones: [$50-$100, $100-$200, $200-$500, $500+]
Acción: Crear lista compartida y sugerir 3 productos dentro del presupuesto.

FLUJO 4B - LINK DIRECTO:
Usuario pegó: __FLOW_4_DIRECT_COMPARE__ [URL]
Acción INMEDIATA (sin preguntas): Comparar ese producto específico en otras tiendas y mostrar 3 alternativas con formato [PRODUCTO].

IMPORTANTE:
- Si detectas __FLOW_4_DIRECT_COMPARE__, NO hagas preguntas, busca inmediatamente.
- Siempre muestra 3 productos (excepto si no hay suficientes resultados).
- Nunca inventes precios, usa datos realistas del mercado.
```

**System Prompt Base (Inglés):**
```
You are GiftBot, Givlyn's shopping assistant. Your mission is to help users find the best products by comparing prices across Amazon, Walmart, Target, Etsy, and eBay.

MANDATORY RULES:
1. MAXIMUM 3 QUESTIONS per conversation. If you already asked 3 times, you MUST search for products immediately.
2. ALWAYS use buttons for options (don't ask for free text).
3. ALWAYS include this disclaimer: "⚠️ These are example products. We'll have real-time prices soon."
4. Use friendly, casual tone with emojis.
5. Reply in the user's language (Spanish or English).
6. When showing products, use EXACTLY this format:

[PRODUCT]
Title: [Product name]
Price: $[00.00]
Store: [Amazon|Walmart|Target|Etsy|eBay]
Link: [URL with affiliate tag]
Image: [Image URL]
Rating: [X.X/5] ([XXX reviews])
[/PRODUCT]

[Same flows as Spanish but in English]
```

---

### Triggers Especiales

**¿Qué son los triggers?**
Son palabras clave especiales que el frontend envía al backend para activar flujos específicos sin ambigüedad.

**Lista de Triggers:**

| Trigger | Cuándo se Usa | Comportamiento Esperado |
|---------|---------------|-------------------------|
| `__FLOW_1__` | Usuario selecciona "Shopping por ocasión" | Inicia flujo de preguntas: ocasión → persona → presupuesto |
| `__FLOW_2__` | Usuario escribe nombre de producto | Inicia flujo: marca/características → presupuesto |
| `__FLOW_3__` | Usuario selecciona "Compra grupal" | Inicia flujo: ocasión → personas → presupuesto → crea lista |
| `__FLOW_4_DIRECT_COMPARE__ [URL]` | Usuario pega link de producto | Compara ese producto en otras tiendas SIN preguntas |

**Ejemplo de Uso:**
```javascript
// Frontend detecta que usuario pegó link de Amazon
const userMessage = `__FLOW_4_DIRECT_COMPARE__ https://amazon.com/dp/B0CHXG9Q4N`;

// Backend recibe el trigger y activa prompt específico:
const systemPrompt = `
Usuario pegó un link de producto. DEBES:
1. NO hacer preguntas
2. Buscar ese producto en Walmart, Target, Etsy, eBay
3. Mostrar 3 alternativas con formato [PRODUCTO]
`;

// Gemini genera respuesta:
"¡Perfecto! Comparando este producto en otras tiendas... 🔍

[PRODUCTO]
Título: Apple AirPods Pro (2nd Gen)
Precio: $249.99
Tienda: Amazon
Link: https://amazon.com/dp/B0CHXG9Q4N?tag=givlyn-20
...
[/PRODUCTO]
```

---

### Rate Limiting

**Límites por Tipo de Usuario:**

| Usuario | Búsquedas IA/Día | Lógica |
|---------|------------------|--------|
| No autenticado | 3 | IP-based tracking (cookie) |
| Gratis | 10 | User ID en database |
| Premium | Ilimitadas | Flag `is_premium` en user table |
| Admin | Ilimitadas | Flag `is_admin` en user_roles table |

**Implementación:**
```sql
-- Función PostgreSQL para verificar límite
CREATE OR REPLACE FUNCTION check_and_increment_ai_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_daily_limit INT
)
RETURNS JSON AS $$
DECLARE
  v_count INT;
  v_reset_date DATE;
BEGIN
  -- Contar usos hoy
  SELECT COUNT(*), CURRENT_DATE + 1
  INTO v_count, v_reset_date
  FROM ai_usage_logs
  WHERE user_id = p_user_id
    AND feature_type = p_feature_type
    AND created_at >= CURRENT_DATE;

  -- Verificar límite
  IF v_count >= p_daily_limit THEN
    RETURN json_build_object(
      'allowed', false,
      'remaining', 0,
      'reset_date', v_reset_date
    );
  END IF;

  -- Registrar uso
  INSERT INTO ai_usage_logs (user_id, feature_type)
  VALUES (p_user_id, p_feature_type);

  RETURN json_build_object(
    'allowed', true,
    'remaining', p_daily_limit - v_count - 1,
    'reset_date', v_reset_date
  );
END;
$$ LANGUAGE plpgsql;
```

---

### Manejo de Errores del AI

**Errores Comunes:**

1. **Rate limit excedido (429):**
```json
{
  "error": "🚫 Has alcanzado el límite diario de 10 búsquedas de IA. Intenta nuevamente mañana.",
  "remaining": 0,
  "reset_at": "2024-11-25"
}
```

2. **Gemini API error (503):**
```json
{
  "error": "⚠️ El asistente de IA está temporalmente no disponible. Por favor intenta en unos segundos.",
  "retry_after": 5
}
```

3. **Invalid response format:**
```
Bot: "Lo siento, tuve problemas generando productos. ¿Puedes intentar de nuevo? 😅"
```

4. **No products found:**
```
Bot: "No encontré productos que coincidan con tu búsqueda. ¿Quieres intentar con otro término? 🤔"
[Botones: Sí | Ver categorías populares]
```

---

## 🎨 Principios de UX/UI

### Filosofía de Diseño: Visual > Text, Buttons > Typing

**Regla de Oro:**
> "Si el usuario puede hacer click en lugar de escribir, hazlo clickeable."

**Principios:**

1. **Mobile-First (80% de usuarios en móvil)**
   - Botones grandes (min 44x44px)
   - Fuentes legibles (16px mínimo)
   - Espaciado generoso (no overlap)
   - Scroll vertical (no horizontal)

2. **Maximum Interactivity**
   - Botones para todo (ocasiones, presupuestos, marcas)
   - Drag & drop en listas
   - Swipe gestures en ProductCards
   - Pull-to-refresh en feeds

3. **Visual Hierarchy**
   - Imágenes de productos grandes y nítidas
   - Precios destacados (bold, color primario)
   - Descuentos en rojo con % de ahorro
   - Calificaciones con estrellas (no solo números)

4. **Feedback Inmediato**
   - Loading skeletons (no spinners genéricos)
   - Toast notifications para acciones exitosas
   - Animaciones sutiles (no distractoras)
   - Vibration feedback en móvil (opcional)

5. **Onboarding Guiado**
   - Tooltips en primer uso
   - Tour interactivo (opcional skip)
   - Empty states con CTAs claros
   - Progress indicators en flujos multi-step

---

### Color Palette

**Primary (Brand):**
- `#6366F1` (Indigo 500) - Botones principales, links
- `#4F46E5` (Indigo 600) - Hover states

**Secondary (Accent):**
- `#EC4899` (Pink 500) - Premium features, highlights
- `#DB2777` (Pink 600) - Hover states

**Success (Cashback, Savings):**
- `#10B981` (Green 500) - Positive actions, savings badges
- `#059669` (Green 600) - Hover states

**Warning (Disclaimers):**
- `#F59E0B` (Amber 500) - Demo disclaimers, cautions

**Error:**
- `#EF4444` (Red 500) - Errors, sold out products

**Neutral:**
- `#111827` (Gray 900) - Text primary
- `#6B7280` (Gray 500) - Text secondary
- `#F3F4F6` (Gray 100) - Backgrounds

---

### Typography

**Font Family:**
- **Primary:** Inter (sans-serif) - Body text, UI
- **Secondary:** Poppins (sans-serif) - Headlines, CTAs

**Hierarchy:**
```css
h1: 36px / 600 (semibold) - Hero headlines
h2: 30px / 600 - Section titles
h3: 24px / 600 - Subsections
h4: 20px / 500 (medium) - Card titles
body: 16px / 400 (regular) - Paragraph text
small: 14px / 400 - Labels, captions
xs: 12px / 400 - Disclaimers, footnotes
```

---

### Component Library (shadcn/ui Recommended)

**Componentes Clave:**

1. **ProductCard**
   - Imagen (aspect-ratio 1:1)
   - Store badge (esquina superior izquierda)
   - Título (2 líneas max con ellipsis)
   - Precio actual (bold, grande)
   - Precio original (tachado si hay descuento)
   - Savings badge (% ahorro en verde)
   - Rating (estrellas + número)
   - CTA button ("Ver en [Store]" con ícono externo)

2. **ChatMessage**
   - Avatar (bot vs user)
   - Timestamp (relativo: "hace 2 min")
   - Message bubble (diferentes colores bot/user)
   - Button groups (chips horizontales)
   - Typing indicator (3 dots animados)

3. **CashbackWallet**
   - Balance display (grande, destacado)
   - Progress bar hacia $20 mínimo
   - Transaction history (expandible)
   - Redeem button (disabled si < $20)

4. **ReferralCodeCard**
   - Código único (monospace font)
   - Copy button (clipboard API)
   - Share buttons (WhatsApp, Twitter, Email)
   - Earnings summary
   - Tier badge con progress

5. **PremiumUpsellBanner**
   - Dismissable (X en esquina)
   - Gradient background
   - Benefits list (bullets)
   - CTA button ("Upgrade to Premium")
   - Countdown timer (opcional: "Oferta por 48h")

---

### Accessibility (WCAG AA Compliance)

**Requisitos:**

1. **Contraste de Colores:**
   - Texto: min 4.5:1 ratio
   - Elementos grandes: min 3:1 ratio
   - Usar herramienta: https://webaim.org/resources/contrastchecker/

2. **Keyboard Navigation:**
   - Tab order lógico
   - Focus visible (outline azul)
   - Escape cierra modals
   - Enter/Space activa botones

3. **Screen Readers:**
   - Alt text en todas las imágenes
   - ARIA labels en botones de íconos
   - Live regions para notificaciones
   - Semantic HTML (nav, main, footer)

4. **Responsive:**
   - Zoom hasta 200% sin scroll horizontal
   - Touch targets mínimo 44x44px
   - Text reflow en móvil

---

## 🔄 Flujos de Usuario

### Flujo 1: Nuevo Usuario → Primera Compra

```
1. Usuario entra a givlyn.com (no autenticado)
   ↓
2. Ve Hero Section:
   - Headline: "Encuentra los mejores precios en 5 tiendas con IA"
   - Subheadline: "Compara Amazon, Walmart, Target, Etsy y eBay en segundos"
   - CTA: "Empezar a Buscar" (botón grande)
   ↓
3. Click en CTA → Modal de Chatbot se abre
   ↓
4. Bot: "¡Hola! ¿Para qué ocasión buscas un regalo?"
   Botones: [Cumpleaños | Boda | Aniversario | Otro]
   ↓
5. Usuario: [Cumpleaños]
   ↓
6. Bot: "¿Para quién es?"
   Botones: [Mamá | Papá | Hijo/a | Pareja | Amigo/a | Otro]
   ↓
7. Usuario: [Mamá]
   ↓
8. Bot: "¿Cuál es tu presupuesto?"
   Botones: [$0-$25 | $25-$50 | $50-$100 | $100-$200 | $200+]
   ↓
9. Usuario: [$50-$100]
   ↓
10. Bot: "¡Dale! Buscando los mejores regalos para mamá..."
    [Loading animation 2-3 seg]
    ↓
11. Bot muestra 3 productos:
    - ProductCard 1: Collar de Plata - $79.99 (Amazon)
    - ProductCard 2: Set de Té Premium - $65.00 (Target)
    - ProductCard 3: Difusor Aromático - $54.99 (Walmart)
    + Disclaimer: "⚠️ Estos son productos de ejemplo..."
    ↓
12. Usuario hace click en "Ver en Amazon" (ProductCard 1)
    ↓
13. Modal aparece:
    "🎉 Vas a ir a Amazon. Recuerda que si compras, ganarás 2% de cashback."
    [Botones: "Ir a Amazon" | "Registrarme para cashback"]
    ↓
14. Usuario: [Registrarme para cashback]
    ↓
15. Modal de Sign Up:
    - Email
    - Contraseña
    - [Botón: "Crear cuenta gratis"]
    ↓
16. Usuario se registra → Redirect a Amazon con affiliate tag
    ↓
17. Usuario compra en Amazon → Cookie almacena conversión
    ↓
18. [30 días después] Amazon reporta venta → Givlyn acredita $2 al wallet
    ↓
19. Push notification: "¡$2 de cashback acreditados! 💰"
```

---

### Flujo 2: Usuario Recurrente → Compra Grupal

```
1. Usuario autenticado entra a Dashboard
   ↓
2. Ve banner: "🎁 Organiza una compra grupal con amigos"
   ↓
3. Click en banner → Modal de Chatbot
   ↓
4. Bot: "¿Para qué ocasión es esta compra grupal?"
   [Input: Usuario escribe "Cumpleaños de Juan"]
   ↓
5. Bot: "¿Cuántas personas contribuirán?"
   Botones: [2-3 | 4-5 | 6-10 | 10+]
   ↓
6. Usuario: [4-5]
   ↓
7. Bot: "¿Cuál es el presupuesto total?"
   Botones: [$50-$100 | $100-$200 | $200-$500 | $500+]
   ↓
8. Usuario: [$200-$500]
   ↓
9. Bot: "¡Perfecto! Lista creada. Sugiero estos regalos:"
   - ProductCard 1: Nintendo Switch OLED - $349.99
   - ProductCard 2: AirPods Pro - $249.99
   - ProductCard 3: Echo Show 10 - $249.99
   ↓
10. Usuario agrega Nintendo Switch a la lista
    ↓
11. Bot: "¡Genial! ¿Quieres invitar a tus amigos ahora?"
    Botones: [Sí | Más tarde]
    ↓
12. Usuario: [Sí]
    ↓
13. Share modal:
    Link: givlyn.com/list/abc123
    [Botones: WhatsApp | Email | Copiar link]
    ↓
14. Usuario comparte por WhatsApp → 4 amigos se unen
    ↓
15. Chat grupal activo en la lista:
    - María: "Me parece bien la Switch!"
    - Pedro: "Yo pongo $70"
    - Ana: "Yo también $70"
    ↓
16. Lista muestra: "$280 de $350 recaudados (80%)"
    ↓
17. Cuando llegan a $350 → Bot: "¡Meta alcanzada! ¿Quién hace la compra?"
    ↓
18. Usuario principal compra → Todos reciben notificación
    ↓
19. Cashback se divide: $7 c/u (2% de $350 = $7 × 5 personas)
```

---

### Flujo 3: Usuario Pega Link → Comparación Instantánea

```
1. Usuario ve producto en Instagram: AirPods Pro
   Link: https://amzn.to/3xYz...
   ↓
2. Copia el link → Abre Givlyn
   ↓
3. Pega en chatbot: "https://amzn.to/3xYz..."
   ↓
4. Frontend detecta link → Llama a extract-url-metadata API
   ↓
5. API scraping obtiene:
   - Título: "Apple AirPods Pro (2nd Gen)"
   - Precio: $249.99
   - Imagen: https://...
   ↓
6. Frontend muestra ProductCard instantáneo:
   [ProductCard con data real de Amazon]
   Botones: ["Sí, comparar precios" | "No, comprar aquí"]
   ↓
7. Usuario: [Sí, comparar precios]
   ↓
8. Frontend envía: "__FLOW_4_DIRECT_COMPARE__ https://amzn.to/3xYz..."
   ↓
9. Backend activa prompt especial → Gemini busca alternativas
   ↓
10. Bot: "Comparando este producto en otras tiendas... 🔍"
    [Loading 2-3 seg]
    ↓
11. Bot muestra 3 alternativas:
    - Amazon: $249.99 ⭐ 4.7 (original)
    - Walmart: $199.99 ⭐ 4.6 (reacondicionado) [AHORRO $50]
    - Target: $239.99 ⭐ 4.8 (nuevo) [AHORRO $10]
    ↓
12. Usuario ve que Walmart tiene $50 menos → Click "Ver en Walmart"
    ↓
13. Redirect a Walmart con affiliate tag → Compra
    ↓
14. Givlyn gana comisión + Usuario gana cashback
```

---

### Flujo 4: Usuario Gratis → Upgrade a Premium

```
1. Usuario gratis hace 10 búsquedas en el día
   ↓
2. Intenta búsqueda #11 → Error 429
   ↓
3. Modal aparece:
   "🚫 Has alcanzado el límite diario de 10 búsquedas.
   
   ¿Sabías que con Premium tienes búsquedas ilimitadas + 4% cashback?
   
   [Ver beneficios Premium] [Cerrar]"
   ↓
4. Usuario: [Ver beneficios Premium]
   ↓
5. Página de Pricing:
   
   Tabla comparativa:
   | Feature | Gratis | Premium |
   | Búsquedas IA | 10/día | Ilimitadas |
   | Cashback | 2% | 4% |
   | Price alerts | ❌ | ✅ |
   
   Precio: $9.99/mes o $99/año
   [CTA: "Prueba gratis 7 días"]
   ↓
6. Usuario: [Prueba gratis 7 días]
   ↓
7. Stripe Checkout modal:
   - Tarjeta de crédito
   - [Checkbox: "Acepto renovación automática"]
   - [Botón: "Iniciar prueba"]
   ↓
8. Usuario completa pago → Redirect a Dashboard
   ↓
9. Banner de bienvenida:
   "🎉 ¡Ahora eres Premium! Disfruta búsquedas ilimitadas."
   ↓
10. Badge "PREMIUM" aparece en perfil
    ↓
11. Usuario hace 50 búsquedas ese día (sin límite)
    ↓
12. [Día 8] Primer cargo: $9.99
    ↓
13. Email: "Tu suscripción Premium se renovó exitosamente."
```

---

## 🔌 Integraciones y APIs

### 1. Amazon Product Advertising API (PA-API 5.0)

**Documentación:** https://webservices.amazon.com/paapi5/documentation/

**Requisitos:**
- Cuenta de Amazon Associates aprobada
- Access Key ID + Secret Access Key
- Associate Tag (ej: `givlyn-20`)

**Endpoint Principal:**
```
POST https://webservices.amazon.com/paapi5/searchitems
```

**Request Example:**
```json
{
  "Keywords": "wireless earbuds",
  "SearchIndex": "All",
  "ItemCount": 10,
  "Resources": [
    "Images.Primary.Large",
    "ItemInfo.Title",
    "ItemInfo.Price",
    "Offers.Listings.Price",
    "CustomerReviews.StarRating"
  ],
  "PartnerTag": "givlyn-20",
  "PartnerType": "Associates",
  "Marketplace": "www.amazon.com"
}
```

**Response Fields:**
- `ASIN`: Amazon product ID
- `DetailPageURL`: Link con affiliate tag
- `Title`: Nombre del producto
- `Price.Amount`: Precio en centavos
- `Price.DisplayAmount`: Precio formateado ($249.99)
- `StarRating`: Calificación (4.7)

**Rate Limits:**
- 1 request/segundo (free tier)
- 8,640 requests/día

**Comisiones por Categoría:**
- Electronics: 4%
- Home & Kitchen: 4%
- Toys: 3%
- Clothing: 4%
- Luxury Beauty: 10%

---

### 2. Walmart Open API

**Documentación:** https://developer.walmart.com/

**Requisitos:**
- Aplicar a Walmart Affiliate Program
- API Key (Consumer ID)
- Private Key (firma de requests)
- Publisher ID (affiliate tag)

**Endpoint Principal:**
```
GET https://api.walmartlabs.com/v1/search?query=wireless+earbuds&apiKey=YOUR_KEY&publisherId=givlyn
```

**Response Fields:**
- `itemId`: Walmart product ID
- `name`: Nombre del producto
- `salePrice`: Precio actual
- `msrp`: Precio original
- `productUrl`: Link con affiliate tag
- `thumbnailImage`: URL de imagen
- `customerRating`: Calificación (4.5)
- `numReviews`: Número de reviews

**Rate Limits:**
- 5,000 requests/día (free tier)

**Comisiones:**
- Flat 4% en todas las categorías

---

### 3. Target Redsky API (Unofficial)

**Nota:** Target no tiene API pública oficial. Opciones:

**Opción A: Scraping ético**
- Respetar robots.txt
- User-Agent identificable
- Rate limiting conservador (1 req/5 seg)
- Caché de 24h

**Opción B: Third-party API**
- RapidAPI Target Product API
- $20/mes por 1,000 requests

**Ejemplo de Scraping:**
```javascript
import cheerio from 'cheerio';

async function scrapeTargetProduct(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Givlyn Bot 1.0 (contact@givlyn.com)'
    }
  });
  
  const html = await response.text();
  const $ = cheerio.load(html);
  
  return {
    title: $('h1[data-test="product-title"]').text(),
    price: $('[data-test="product-price"]').text(),
    image: $('[data-test="product-image"] img').attr('src'),
    rating: $('[data-test="ratings"] span').first().text()
  };
}
```

**Affiliate Tag:**
- Agregar `?afid=givlyn` al final del URL

**Comisiones:**
- 1-8% según categoría (promedio: 3%)

---

### 4. Etsy Open API v3

**Documentación:** https://developers.etsy.com/documentation/

**Requisitos:**
- Crear app en Etsy Developers
- API Key (Keystring)
- OAuth 2.0 (para acciones de usuarios)
- Etsy Affiliate Program

**Endpoint Principal:**
```
GET https://openapi.etsy.com/v3/application/listings/active?keywords=handmade+jewelry&api_key=YOUR_KEY
```

**Response Fields:**
- `listing_id`: Etsy product ID
- `title`: Nombre del producto
- `price.amount`: Precio (en centavos)
- `price.currency_code`: USD
- `url`: Link al producto
- `images[0].url_fullxfull`: Imagen alta resolución

**Affiliate Tag:**
- Agregar `?ref=givlyn` al URL

**Rate Limits:**
- 10,000 requests/día

**Comisiones:**
- 4% en todas las ventas

---

### 5. eBay Finding API

**Documentación:** https://developer.ebay.com/DevZone/finding/Concepts/FindingAPIGuide.html

**Requisitos:**
- Registrar app en eBay Developers Program
- App ID (Client ID)
- eBay Partner Network account

**Endpoint Principal:**
```
GET https://svcs.ebay.com/services/search/FindingService/v1?
OPERATION-NAME=findItemsByKeywords&
SERVICE-VERSION=1.0.0&
SECURITY-APPNAME=YOUR_APP_ID&
RESPONSE-DATA-FORMAT=JSON&
keywords=wireless%20earbuds&
affiliate.networkId=9&
affiliate.trackingId=givlyn
```

**Response Fields:**
- `itemId`: eBay listing ID
- `title`: Nombre del producto
- `sellingStatus.currentPrice`: Precio actual
- `galleryURL`: Imagen thumbnail
- `viewItemURL`: Link con affiliate tag
- `sellerInfo.feedbackScore`: Calificación vendedor

**Rate Limits:**
- 5,000 requests/día (sandbox)
- 100,000 requests/día (production)

**Comisiones:**
- 50-70% de la tarifa de eBay (variable)
- Ejemplo: Venta de $100 → eBay cobra $10 → Afiliado recibe $5-7

---

### 6. Stripe (Pagos y Subscripciones)

**Documentación:** https://stripe.com/docs

**Requisitos:**
- Cuenta Stripe
- Publishable Key (frontend)
- Secret Key (backend)
- Webhook Secret (eventos)

**Funcionalidades a Implementar:**

**A) Suscripción Premium:**
```javascript
// Crear producto Premium en Stripe Dashboard:
// - Nombre: "Givlyn Premium"
// - Precio mensual: $9.99
// - Precio anual: $99.00
// - ID: price_1ABC...

// Backend: Crear checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{
    price: 'price_1ABC...', // ID del plan mensual
    quantity: 1,
  }],
  success_url: 'https://givlyn.com/dashboard?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://givlyn.com/pricing',
  customer_email: user.email,
  metadata: {
    user_id: user.id
  }
});

// Frontend: Redirect a Stripe Checkout
window.location.href = session.url;
```

**B) Webhooks (eventos):**
```javascript
// Escuchar eventos de Stripe
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Usuario completó pago → Activar Premium
      await activatePremium(event.data.object.metadata.user_id);
      break;
      
    case 'customer.subscription.deleted':
      // Suscripción cancelada → Downgrade a gratis
      await deactivatePremium(event.data.object.metadata.user_id);
      break;
      
    case 'invoice.payment_failed':
      // Pago falló → Enviar email de recordatorio
      await sendPaymentFailedEmail(event.data.object.customer_email);
      break;
  }
  
  res.json({ received: true });
});
```

**C) Payouts (cashback):**
```javascript
// Transferir cashback acumulado a cuenta bancaria del usuario
const payout = await stripe.payouts.create({
  amount: 2000, // $20.00 en centavos
  currency: 'usd',
  destination: user.stripe_account_id,
  metadata: {
    user_id: user.id,
    type: 'cashback_redemption'
  }
});
```

---

### 7. Supabase (Backend as a Service)

**¿Por qué Supabase?**
- PostgreSQL managed (no necesitas configurar servidor)
- Authentication built-in (email, OAuth, magic links)
- Realtime subscriptions (WebSocket para chat)
- Row-Level Security (RLS) para seguridad
- Storage (S3-compatible)
- Edge Functions (serverless)

**Configuración:**

1. **Crear proyecto en Supabase:**
   - https://app.supabase.com/
   - Región: US East (más cercana a mayoría de usuarios)
   - Plan: Pro ($25/mes para producción, Free para dev)

2. **Obtener credenciales:**
   ```env
   VITE_SUPABASE_URL=https://abc123.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ... (clave pública)
   SUPABASE_SERVICE_ROLE_KEY=eyJ... (clave privada, solo backend)
   ```

3. **Client setup:**
   ```javascript
   import { createClient } from '@supabase/supabase-js';
   
   const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```

**Authentication:**
```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// OAuth (Google, GitHub, etc.)
await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

**Realtime (chat grupal):**
```javascript
// Suscribirse a nuevos mensajes en lista compartida
const channel = supabase
  .channel('list_123_chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'list_messages',
    filter: `list_id=eq.123`
  }, (payload) => {
    console.log('Nuevo mensaje:', payload.new);
    addMessageToUI(payload.new);
  })
  .subscribe();
```

---

### 8. SendGrid / Resend (Email)

**Uso:**
- Bienvenida a nuevos usuarios
- Confirmación de registro
- Notificaciones de cashback acreditado
- Alertas de precio bajo (Premium)
- Recordatorio de pago fallido (Premium)

**Ejemplo con Resend:**
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Givlyn <noreply@givlyn.com>',
  to: user.email,
  subject: '¡$5 de cashback acreditados! 💰',
  html: `
    <h1>¡Felicidades ${user.name}!</h1>
    <p>Tu compra en Amazon generó <strong>$5.00</strong> de cashback.</p>
    <p>Balance actual: <strong>$${user.cashback_balance}</strong></p>
    <a href="https://givlyn.com/wallet">Ver mi wallet</a>
  `
});
```

---

## 💾 Base de Datos

### Esquema PostgreSQL Completo

```sql
-- ==========================================
-- USUARIOS Y AUTENTICACIÓN
-- ==========================================

-- Tabla de usuarios (extendida de Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  language VARCHAR(2) DEFAULT 'es', -- 'es' o 'en'
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles de usuarios (admin, moderator, etc.)
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'admin', 'moderator', 'user'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ==========================================
-- MONETIZACIÓN
-- ==========================================

-- Wallet de cashback
CREATE TABLE cashback_wallet (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  lifetime_earned DECIMAL(10,2) DEFAULT 0.00,
  last_redemption_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transacciones de cashback
CREATE TABLE cashback_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'earned', 'redeemed', 'expired'
  description TEXT,
  order_id VARCHAR(255), -- ID de la compra en la tienda externa
  store VARCHAR(50), -- 'amazon', 'walmart', etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Códigos de referido
CREATE TABLE referral_codes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  code VARCHAR(20) UNIQUE NOT NULL,
  total_referrals INT DEFAULT 0,
  active_referrals INT DEFAULT 0, -- Usuarios que compraron en últimos 30 días
  created_at TIMESTAMP DEFAULT NOW()
);

-- Earnings de referidos
CREATE TABLE referral_earnings (
  id SERIAL PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  tier VARCHAR(20), -- 'novice', 'promoter', 'influencer', 'ambassador'
  month DATE, -- Mes del earning (YYYY-MM-01)
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referrer_id, referred_user_id, month)
);

-- Subscripciones Premium
CREATE TABLE premium_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(20), -- 'active', 'canceled', 'past_due'
  plan VARCHAR(20), -- 'monthly', 'annual'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- PRODUCTOS Y BÚSQUEDAS
-- ==========================================

-- Historial de búsquedas de IA
CREATE TABLE ai_usage_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50), -- 'shopping_assistant', 'price_compare'
  query TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Productos favoritos
CREATE TABLE favorite_products (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_asin VARCHAR(50), -- Amazon ASIN o ID de otra tienda
  store VARCHAR(50), -- 'amazon', 'walmart', etc.
  title TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_asin, store)
);

-- Price drop alerts (Premium)
CREATE TABLE price_alerts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_asin VARCHAR(50),
  store VARCHAR(50),
  target_price DECIMAL(10,2), -- Precio objetivo
  current_price DECIMAL(10,2),
  title TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  notified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- LISTAS Y COLABORACIÓN
-- ==========================================

-- Listas (personales o compartidas)
CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20), -- 'personal', 'shared', 'wishlist', 'event'
  occasion VARCHAR(100), -- 'Cumpleaños de María', 'Boda de Ana y Pedro'
  budget DECIMAL(10,2),
  total_collected DECIMAL(10,2) DEFAULT 0.00,
  is_public BOOLEAN DEFAULT FALSE,
  share_code VARCHAR(20) UNIQUE, -- Código para compartir
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Miembros de listas compartidas
CREATE TABLE list_members (
  id SERIAL PRIMARY KEY,
  list_id INT REFERENCES lists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'member'
  contribution_amount DECIMAL(10,2) DEFAULT 0.00,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(list_id, user_id)
);

-- Items en listas
CREATE TABLE list_items (
  id SERIAL PRIMARY KEY,
  list_id INT REFERENCES lists(id) ON DELETE CASCADE,
  product_asin VARCHAR(50),
  store VARCHAR(50),
  title TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  quantity INT DEFAULT 1,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by UUID REFERENCES users(id),
  purchased_at TIMESTAMP,
  assigned_to UUID REFERENCES users(id), -- Persona asignada a comprar
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat de listas compartidas
CREATE TABLE list_messages (
  id SERIAL PRIMARY KEY,
  list_id INT REFERENCES lists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votaciones de productos (en listas compartidas)
CREATE TABLE list_item_votes (
  id SERIAL PRIMARY KEY,
  list_item_id INT REFERENCES list_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote INT, -- 1 (👍) o -1 (👎)
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(list_item_id, user_id)
);

-- ==========================================
-- ADMIN Y AUDITORÍA
-- ==========================================

-- Logs de auditoría (acciones críticas)
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100), -- 'cashback_redeemed', 'premium_upgraded', etc.
  entity_type VARCHAR(50), -- 'user', 'transaction', 'list'
  entity_id VARCHAR(255),
  metadata JSONB, -- Datos adicionales
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para redimir cashback atómicamente
CREATE OR REPLACE FUNCTION redeem_cashback_atomic(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS JSON AS $$
DECLARE
  v_balance DECIMAL;
BEGIN
  -- Lock de fila para prevenir race conditions
  SELECT balance INTO v_balance
  FROM cashback_wallet
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Validar balance
  IF v_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;

  -- Actualizar balance
  UPDATE cashback_wallet
  SET balance = balance - p_amount,
      last_redemption_at = NOW()
  WHERE user_id = p_user_id;

  -- Registrar transacción
  INSERT INTO cashback_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, 'redeemed', 'Cashback redemption');

  RETURN json_build_object('success', true, 'new_balance', v_balance - p_amount);
END;
$$ LANGUAGE plpgsql;

-- Función para generar código de referido único
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  v_code VARCHAR(20);
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generar código: primeros 5 chars del nombre + 4 dígitos random
    v_code := UPPER(SUBSTRING(NEW.name FROM 1 FOR 5)) || FLOOR(RANDOM() * 10000)::TEXT;
    
    -- Verificar si existe
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    
    -- Si no existe, salir del loop
    EXIT WHEN NOT v_exists;
  END LOOP;

  -- Insertar código
  INSERT INTO referral_codes (user_id, code)
  VALUES (NEW.id, v_code);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-crear código de referido
CREATE TRIGGER auto_create_referral_code
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION generate_referral_code();

-- Trigger para auto-crear wallet
CREATE OR REPLACE FUNCTION create_user_wallet_if_not_exists()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cashback_wallet (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_wallet
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_wallet_if_not_exists();

-- ==========================================
-- ROW-LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE cashback_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_messages ENABLE ROW LEVEL SECURITY;

-- Políticas: Usuarios solo ven sus propios datos
CREATE POLICY "Users can view own wallet"
  ON cashback_wallet FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON cashback_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas: Usuarios ven listas donde son miembros
CREATE POLICY "Users can view lists they're members of"
  ON lists FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT list_id FROM list_members WHERE user_id = auth.uid())
    OR is_public = TRUE
  );

-- (Agregar más políticas según necesidad)

-- ==========================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================

CREATE INDEX idx_cashback_transactions_user_id ON cashback_transactions(user_id);
CREATE INDEX idx_cashback_transactions_created_at ON cashback_transactions(created_at);
CREATE INDEX idx_referral_earnings_referrer_id ON referral_earnings(referrer_id);
CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX idx_list_items_list_id ON list_items(list_id);
CREATE INDEX idx_list_messages_list_id ON list_messages(list_id);
CREATE INDEX idx_price_alerts_user_id_active ON price_alerts(user_id, is_active);
```

---

## 🔒 Seguridad y Compliance

### 1. GDPR (Europa)

**Requisitos:**
1. **Consentimiento explícito** para cookies y tracking
2. **Right to access:** Usuario puede descargar todos sus datos
3. **Right to deletion:** Usuario puede eliminar su cuenta y todos sus datos
4. **Data portability:** Exportar datos en formato JSON/CSV
5. **Privacy by design:** RLS en database, encriptación en tránsito

**Implementación:**

**A) Cookie Consent Banner:**
```jsx
// Componente CookieConsent.tsx
<div className="cookie-banner">
  <p>Usamos cookies para mejorar tu experiencia. 🍪</p>
  <button onClick={acceptCookies}>Aceptar</button>
  <button onClick={rejectCookies}>Rechazar</button>
  <a href="/privacy-policy">Ver política de privacidad</a>
</div>
```

**B) Página de Privacy Settings:**
```
[ ] Cookies esenciales (siempre activas)
[ ] Cookies de analytics (Google Analytics)
[ ] Cookies de publicidad (deshabilitadas por defecto)

[Descargar mis datos] [Eliminar mi cuenta]
```

**C) Endpoint de Data Export:**
```javascript
app.get('/api/user/export-data', async (req, res) => {
  const userId = req.user.id;
  
  const data = {
    profile: await getProfile(userId),
    transactions: await getTransactions(userId),
    lists: await getLists(userId),
    messages: await getMessages(userId)
  };
  
  res.json(data);
});
```

---

### 2. CCPA (California)

**Requisitos:**
1. **Notice at collection:** Informar qué datos se recopilan y por qué
2. **Right to know:** Usuario puede solicitar datos recopilados
3. **Right to delete:** Eliminar datos personales
4. **Do Not Sell:** No vender datos a terceros (Givlyn no aplica, no vendemos datos)

**Implementación:**
- Link en footer: "Do Not Sell My Personal Information"
- Formulario de solicitud de datos
- Email de confirmación: "Tus datos han sido eliminados"

---

### 3. FTC (Federal Trade Commission)

**Requisitos para Affiliate Marketing:**
1. **Disclosure obligatorio:** Indicar que ganamos comisiones por compras
2. **Transparencia:** Decir claramente que somos afiliados
3. **No false advertising:** No prometer descuentos falsos

**Implementación:**

**A) Disclaimer en ProductCard:**
```jsx
<div className="affiliate-disclosure">
  ⓘ Ganamos una comisión si compras a través de este enlace (sin costo extra para ti).
</div>
```

**B) Página de Affiliate Disclosure:**
```markdown
# Divulgación de Afiliados

Givlyn participa en programas de afiliados de Amazon, Walmart, Target, Etsy y eBay.

Cuando haces click en un producto y realizas una compra, ganamos una pequeña comisión
(sin costo adicional para ti).

Esta comisión nos ayuda a mantener Givlyn gratis y compartimos el 40% contigo como cashback.
```

---

### 4. DMCA (Copyright)

**Requisitos:**
- Respetar copyright de imágenes de productos
- No copiar descripciones textuales completas
- Tener proceso de DMCA takedown

**Implementación:**

**A) Uso de imágenes:**
- Usar URLs de imágenes de las tiendas (no re-hostear)
- Atribución: "Imagen cortesía de Amazon.com"
- No modificar logos de marcas

**B) DMCA Contact Page:**
```markdown
# DMCA Copyright Policy

Si crees que tu contenido está siendo usado sin permiso, envía un email a:
dmca@givlyn.com

Incluye:
1. Descripción del contenido con copyright
2. URL donde aparece en Givlyn
3. Tu información de contacto
4. Declaración de buena fe
```

---

### 5. Seguridad Técnica

**A) Authentication:**
- Passwords hasheados con bcrypt (min 12 rounds)
- JWT tokens con expiración de 1 hora
- Refresh tokens con expiración de 30 días
- 2FA opcional (TOTP vía Google Authenticator)

**B) API Security:**
- Rate limiting (100 req/min por IP)
- CORS configurado (solo givlyn.com)
- HTTPS obligatorio (redirect HTTP → HTTPS)
- API keys rotadas cada 90 días

**C) Database:**
- Row-Level Security (RLS)
- Encriptación at rest (AES-256)
- Backups automáticos diarios
- No almacenar números de tarjeta (usar Stripe)

**D) Frontend:**
- No exponer API keys (usar variables de entorno)
- Sanitizar inputs (prevenir XSS)
- Content Security Policy (CSP)
- SameSite cookies (prevenir CSRF)

---

## 🚀 Roadmap y Mejoras Futuras

### Fase 1: MVP (Actual)
- ✅ AI Shopping Assistant (4 flujos conversacionales)
- ✅ Comparación de precios (5 tiendas)
- ✅ Sistema de cashback
- ✅ Sistema de referidos
- ✅ Premium subscriptions
- ✅ Listas personales y compartidas
- ✅ PWA básica (offline mode, installable)

### Fase 2: Enhanced Features (3-6 meses)
- ⏳ **Integración de APIs reales:**
  - Amazon PA-API 5.0
  - Walmart Open API
  - Target scraping ético
  - Etsy Open API v3
  - eBay Finding API
- ⏳ **Price history graphs** (Premium):
  - Gráficos de histórico de precios (últimos 30/60/90 días)
  - Alertas de precio bajo
  - "Mejor momento para comprar" con ML
- ⏳ **Browser Extension:**
  - Chrome/Firefox extension
  - Botón "Comparar en Givlyn" en Amazon, Walmart, etc.
  - Price drop notifier mientras navegas
- ⏳ **Mobile App (React Native):**
  - App nativa para iOS y Android
  - Barcode scanner para comparar en tiendas físicas
  - Push notifications nativas

### Fase 3: AI Enhancements (6-12 meses)
- ⏳ **Visual Search:**
  - Sube foto de un producto → IA identifica y busca en 5 tiendas
  - Google Lens-style search
- ⏳ **Personalized Recommendations:**
  - ML model entrenado con historial de compras
  - "Usuarios como tú también compraron..."
  - Predicción de regalos ideales por ocasión
- ⏳ **Voice Shopping:**
  - "Hey Givlyn, busca auriculares Bluetooth bajo $100"
  - Integración con Google Assistant / Alexa
- ⏳ **Smart Bundles:**
  - IA sugiere combos (ej: "Compra laptop + mouse + mochila")
  - Descuento adicional en bundles

### Fase 4: Social & Gamification (12-18 meses)
- ⏳ **Social Feed:**
  - Feed de amigos: "María compró AirPods Pro en Walmart"
  - Reacciones y comentarios
  - "Top 10 productos de la semana"
- ⏳ **Leaderboard de ahorro:**
  - Usuarios que más ahorraron este mes
  - Badges: "Cazador de ofertas", "Ahorrador Pro", etc.
  - Premios: "Top 10 ganan $50 de cashback extra"
- ⏳ **Challenges:**
  - "Ahorra $100 este mes → Gana 2x cashback"
  - "Invita 5 amigos → Upgrade gratis a Premium por 1 mes"

### Fase 5: B2B Features (18-24 meses)
- ⏳ **Givlyn for Business:**
  - Compras corporativas (office supplies, regalos empleados)
  - Facturación centralizada
  - API pública para partners
- ⏳ **Influencer Program:**
  - Dashboard para influencers
  - Tracking de ventas por código único
  - Comisiones personalizadas (10-20%)
- ⏳ **White-label Solution:**
  - Givlyn como servicio B2B
  - Empresas pueden licenciar la tecnología
  - Ej: "Powered by Givlyn" en sitios de cupones

---

## 📊 Métricas de Éxito (KPIs)

### Métricas de Producto:
1. **MAU (Monthly Active Users):** Usuarios que hicieron al menos 1 búsqueda de IA
2. **Conversion Rate:** % de usuarios que hicieron click en producto → compraron
3. **Average Order Value (AOV):** Valor promedio de compras
4. **Retention Rate:** % de usuarios que vuelven después de 30 días
5. **Premium Conversion:** % de usuarios gratis → Premium

### Métricas de Monetización:
1. **GMV (Gross Merchandise Value):** Valor total de compras a través de Givlyn
2. **Commission Revenue:** Ingresos por comisiones de afiliados
3. **MRR (Monthly Recurring Revenue):** Ingresos por Premium
4. **Cashback Payout Ratio:** % de comisiones pagadas como cashback
5. **CAC (Customer Acquisition Cost):** Costo de adquirir 1 nuevo usuario

### Métricas de Engagement:
1. **Daily AI Searches:** Promedio de búsquedas de IA por usuario/día
2. **List Creation Rate:** % de usuarios que crearon al menos 1 lista
3. **Group Shopping Adoption:** % de usuarios en listas compartidas
4. **Referral Viral Coefficient:** Promedio de referidos por usuario activo

**Objetivos a 6 Meses:**
- 10,000 MAU
- 5% conversion rate
- $100,000 GMV/mes
- 10% premium adoption
- $25,000 MRR

---

## 🛠️ Consideraciones de Implementación

### 1. Testing Strategy

**A) Unit Tests (Jest + Vitest):**
- Funciones de formateo (currency, dates)
- Helpers de validación (email, password strength)
- Utilidades (affiliate tag injection)

**B) Integration Tests:**
- API endpoints (POST /api/ai-shopping-assistant)
- Database functions (redeem_cashback_atomic)
- Stripe webhooks (checkout.session.completed)

**C) E2E Tests (Playwright):**
- Flujo completo de registro → búsqueda → compra
- Crear lista compartida → invitar amigos → chat
- Upgrade a Premium → verificar beneficios

**D) Performance Tests:**
- Lighthouse CI (PWA score > 90)
- API response time < 500ms (p95)
- Database query optimization (EXPLAIN ANALYZE)

---

### 2. Deployment Strategy

**A) Environments:**
- **Development:** localhost + Supabase dev project
- **Staging:** staging.givlyn.com + Supabase staging
- **Production:** givlyn.com + Supabase production

**B) CI/CD Pipeline (GitHub Actions):**
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Run tests
        run: npm test
      
      - name: Build frontend
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
      
      - name: Run database migrations
        run: npm run db:migrate
```

**C) Monitoring:**
- **Sentry:** Error tracking (frontend + backend)
- **Google Analytics 4:** User behavior
- **Supabase Analytics:** Database performance
- **Stripe Dashboard:** Payment metrics
- **Custom Dashboard:** KPIs en tiempo real

---

### 3. Caching Strategy

**A) Frontend (Service Worker):**
- Cachear assets estáticos (CSS, JS, imágenes)
- Cachear productos recientes (24h)
- Network-first para API calls

**B) Backend (Redis):**
- Cachear respuestas de APIs externas (Amazon, Walmart) por 1 hora
- Cachear datos de usuarios (profile, wallet) por 5 minutos
- Invalidar cache al actualizar datos

**C) CDN (Cloudflare):**
- Cachear imágenes de productos
- Cachear frontend assets (1 año)
- Purge cache al deployar nueva versión

---

### 4. Scalability Considerations

**A) Database:**
- Connection pooling (PgBouncer)
- Read replicas para queries pesadas
- Partitioning de tablas grandes (cashback_transactions por mes)
- Archiving de datos antiguos (> 2 años)

**B) Backend:**
- Horizontal scaling (múltiples instancias)
- Load balancer (Nginx o AWS ALB)
- Job queue para tareas asíncronas (Bull + Redis)
- Microservices (opcional): AI service, Payment service, etc.

**C) Frontend:**
- Code splitting (React.lazy)
- Image optimization (WebP, lazy loading)
- CDN para assets
- Progressive enhancement (funciona sin JS)

---

## 📝 Notas Finales para el Equipo de Desarrollo

### Filosofía de Producto:
1. **User-first:** Cada decisión técnica debe mejorar la experiencia del usuario
2. **Mobile-first:** 80% de usuarios están en móvil, diseñar para ellos primero
3. **Speed matters:** Cada segundo de latencia = -7% conversión
4. **Transparency builds trust:** Siempre decir la verdad sobre comisiones y precios
5. **Iterate fast:** Lanzar MVP → Medir → Aprender → Mejorar

### Prioridades de Desarrollo:
1. **Core feature primero:** AI Shopping Assistant funcional antes que features secundarias
2. **Monetization temprano:** Implementar affiliate tags desde día 1 (aunque sea con datos demo)
3. **Premium upsell visible:** Mostrar beneficios Premium en UX sin ser intrusivo
4. **Analytics desde el inicio:** No se puede mejorar lo que no se mide

### Áreas Abiertas a Mejora:
- **UI/UX:** Mejorar diseño de ProductCards, experimentar con layouts
- **AI prompts:** Optimizar conversaciones para mayor tasa de conversión
- **Performance:** Reducir tiempo de carga, implementar skeleton loaders
- **Features:** Agregar filtros avanzados, comparación multi-producto simultánea
- **Monetization:** Experimentar con diferentes tasas de cashback, planes Premium

### Recursos Útiles:
- **Documentación técnica actual:** `/docs` folder en repo
- **Figma designs:** [Link a diseños de UI]
- **API credentials:** Vault seguro (1Password, AWS Secrets Manager)
- **Slack channel:** #givlyn-dev para preguntas
- **Weekly sync:** Martes 10am para status updates

---

**Versión:** 1.0.0
**Última actualización:** 2025-11-24
**Contacto:** [tu-email@givlyn.com]

---

¿Preguntas? ¿Necesitas aclarar algo? Este documento es un punto de partida. ¡El equipo tiene libertad para proponer mejoras y desafiar ideas! 🚀
