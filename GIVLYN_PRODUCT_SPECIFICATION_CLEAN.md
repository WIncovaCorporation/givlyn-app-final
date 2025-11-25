# Givlyn - Especificación Completa de Producto
**AI Shopping Assistant Platform**

> **Nota para el nuevo equipo de desarrollo:**  
> Este documento describe la funcionalidad, concepto y arquitectura de Givlyn de manera genérica.  
> No contiene referencias a bases de datos, repositorios o archivos específicos del proyecto anterior.  
> Eres libre de implementarlo con tu propia estructura, tecnologías y decisiones de arquitectura.

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
- **Cashback compartido** (el usuario gana mientras la plataforma gana)
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
Bot: [Muestra tarjeta de producto con precio/imagen/título extraído del link]
     [Botones: "Sí, comparar precios" | "No, comprar aquí"]
User: [Sí, comparar precios]
Bot: "Comparando este producto en otras tiendas..."
[Muestra 3 alternativas con mejor precio]
```

**Reglas de Oro del Chatbot:**
1. **Máximo 3 preguntas por flujo** → Si pregunta 3 veces, DEBE buscar productos inmediatamente
2. **Disclaimer obligatorio:** Siempre mencionar estado actual de datos (demo vs. real)
3. **Tono conversacional:** Emojis, lenguaje casual, amigable
4. **Botones primero:** Solo acepta texto libre si es absolutamente necesario
5. **Bilingüe:** Español e inglés con detección automática

**Formato de Respuesta del Bot:**
```
[PRODUCTO]
Título: Apple AirPods Pro (2nd Gen)
Precio: $249.99
Tienda: Amazon
Link: [URL con tag de afiliado]
Imagen: [URL]
Calificación: 4.7/5 (12,450 reviews)
[/PRODUCTO]

[PRODUCTO]
Título: Apple AirPods Pro (2nd Gen) - Reacondicionado
Precio: $199.99
Tienda: Walmart
Link: [URL con tag de afiliado]
Imagen: [URL]
Calificación: 4.6/5 (8,320 reviews)
[/PRODUCTO]

[PRODUCTO]
Título: Apple AirPods Pro (2da Generación)
Precio: $239.99
Tienda: Target
Link: [URL con tag de afiliado]
Imagen: [URL]
Calificación: 4.8/5 (6,100 reviews)
[/PRODUCTO]
```

**Tecnología de IA Recomendada:**
- **Modelo:** Google Gemini 2.5 Flash o GPT-4 Turbo
- **Prompts:** Sistema de prompts estructurados con triggers especiales
- **Rate Limiting:** 10 búsquedas/día para usuarios gratis, ilimitadas para Premium

---

### 2. Comparación Multi-Tienda

**Tiendas Soportadas:**
1. **Amazon** (Amazon Product Advertising API)
2. **Walmart** (Walmart Open API)
3. **Target** (Redsky API o scraping ético)
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
- Amazon: `?tag=TU_TAG_AMAZON`
- Walmart: `?publisherId=TU_ID_WALMART`
- Target: `?afid=TU_ID_TARGET`
- Etsy: `?ref=TU_TAG_ETSY`
- eBay: `?campid=TU_ID_EBAY`

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
2. Comparte link con su código
3. Amigo se registra con ese código
4. Amigo hace compra → Usuario recibe comisión según su tier
5. Comisiones se acreditan al wallet mensualmente

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

**Procesador de Pagos Recomendado:**
- Stripe Subscriptions
- Renovación automática
- Cancelación en cualquier momento
- Prueba gratis de 7 días

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
- Framework: React 18 con TypeScript
- Build Tool: Vite 5
- Routing: React Router v6
- UI Components: Tailwind CSS + shadcn/ui (Radix UI)
- State Management: TanStack Query (React Query)
- Form Handling: React Hook Form + Zod validation
- PWA: Vite PWA Plugin + Workbox

**Backend:**
- Runtime: Node.js con Express.js
- Database: PostgreSQL (managed service recomendado)
- Authentication: OAuth + Email/Password con JWT
- AI: Google Gemini 2.5 Flash o GPT-4 Turbo
- Job Queue: Bull + Redis (para procesamiento de cashback)
- Caching: Redis

**Infrastructure:**
- Hosting Frontend: Vercel, Netlify o Cloudflare Pages
- Hosting Backend: Railway, Render o AWS
- Database: Managed PostgreSQL (Supabase, Neon, o RDS)
- CDN: Cloudflare
- Monitoring: Sentry + Google Analytics 4

**Third-Party APIs:**
- Affiliate APIs: Amazon, Walmart, Target, Etsy, eBay
- Payments: Stripe
- Email: SendGrid o Resend
- Storage: S3 o Cloudflare R2

---

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React PWA)                 │
│  - UI Components                                         │
│  - AI Chat Interface                                     │
│  - Product Cards                                         │
│  - Caching con TanStack Query                           │
│  - Service Worker (offline mode)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js/Express)              │
│  - Endpoint de AI Shopping Assistant                    │
│  - Endpoint de comparación multi-tienda                 │
│  - Endpoint de gestión de cashback                      │
│  - Endpoint de sistema de referidos                     │
│  - Endpoint de listas compartidas                       │
│  - Rate Limiting                                         │
│  - Inyección de Affiliate Tags                          │
└────────────────────┬────────────────────────────────────┘
                     │ PostgreSQL + Redis
                     ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE LAYER (PostgreSQL)                │
│  - Datos de usuarios, productos, transacciones         │
│  - Row-Level Security                                    │
│  - Realtime subscriptions (chat, notificaciones)       │
│  - Autenticación con JWT                                │
└─────────────────────────────────────────────────────────┘
```

---

### Estructura de Proyecto Sugerida

```
proyecto-givlyn/
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes de UI
│   │   ├── contexts/         # Context providers (Auth, Language, Theme)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API clients
│   │   ├── pages/            # Páginas de la app
│   │   └── utils/            # Utilidades
│   └── public/               # Assets estáticos
│
├── backend/
│   ├── src/
│   │   ├── routes/           # Rutas de API
│   │   ├── controllers/      # Controladores
│   │   ├── services/         # Lógica de negocio
│   │   ├── middleware/       # Middlewares
│   │   ├── utils/            # Utilidades
│   │   └── config/           # Configuración
│   └── tests/                # Tests
│
├── database/
│   ├── migrations/           # Migraciones de BD
│   └── seeds/                # Datos de prueba
│
└── docs/
    ├── API.md               # Documentación de API
    └── DEPLOYMENT.md        # Guía de despliegue
```

---

## 🤖 Comportamiento del AI Chatbot

### Modelo de IA Recomendado: Google Gemini 2.5 Flash

**¿Por qué Gemini 2.5 Flash?**
- Económico: ~$0.15 por 1M tokens
- Rápido: Latencia < 2 segundos
- Multimodal: Puede procesar imágenes
- Contexto largo: 1M tokens
- Disponible globalmente

**Alternativas:**
- GPT-4 Turbo (más caro, más preciso)
- Claude 3 Sonnet (bueno para conversaciones)

---

### Sistema de Prompts Estructurado

**System Prompt Base (Español):**
```
Eres GiftBot, el asistente de compras de Givlyn. Tu misión es ayudar a usuarios a encontrar los mejores productos comparando precios entre Amazon, Walmart, Target, Etsy y eBay.

REGLAS OBLIGATORIAS:
1. MÁXIMO 3 PREGUNTAS por conversación. Si ya preguntaste 3 veces, DEBES buscar productos inmediatamente.
2. SIEMPRE usa botones para opciones (no pidas texto libre).
3. SIEMPRE incluye disclaimer sobre el estado de los datos (demo vs. producción).
4. Usa tono amigable, casual y emojis.
5. Responde en el idioma del usuario (español o inglés).
6. Cuando muestres productos, usa el formato estructurado especificado.

FLUJOS DISPONIBLES:
- FLOW_1: Shopping por ocasión
- FLOW_2: Búsqueda específica
- FLOW_3: Compra grupal
- FLOW_4: Comparación de link directo
```

**Triggers Especiales:**
- `__FLOW_1_OCCASION__`: Activa flujo de ocasión
- `__FLOW_2_SPECIFIC__`: Activa búsqueda específica
- `__FLOW_3_GROUP__`: Activa compra grupal
- `__FLOW_4_DIRECT_COMPARE__`: Activa comparación de link

---

## 🎨 Principios de UX/UI

### Filosofía: Mobile-First, Button-Driven, Visual

**Reglas de Oro:**
1. **Botones > Typing:** 80% de interacciones deben ser clicks, no texto
2. **Visual > Texto:** Priorizar imágenes grandes, íconos, colores
3. **Compact > Spacious:** En móvil, cada pixel cuenta
4. **Fast > Perfect:** Velocidad de carga es prioridad #1
5. **Clear > Clever:** UX clara > animaciones fancy

---

### Componentes Clave

**1. Tarjeta de Producto (Product Card):**
```
┌────────────────────────────┐
│  [Imagen del producto]     │
│  Alta resolución, 16:9     │
├────────────────────────────┤
│  Título del Producto       │
│  (max 2 líneas)            │
├────────────────────────────┤
│  ⭐⭐⭐⭐☆ 4.7 (12,450)   │
├────────────────────────────┤
│  $249.99  ~~$299.99~~      │
│  [Badge: -17%]             │
├────────────────────────────┤
│  [Logo Amazon] Envío gratis│
├────────────────────────────┤
│  [Botón: Ver en Amazon]    │
└────────────────────────────┘
```

**Características:**
- Imagen grande (mínimo 300x300px)
- Precio destacado en grande
- Badge de descuento visible
- Botón CTA en contraste alto
- Calificación con estrellas visuales

---

**2. Interfaz de Chat del AI:**
```
┌────────────────────────────┐
│  🎁 GiftBot               │
│  ¿Para qué ocasión?       │
│                            │
│  [Cumpleaños] [Boda]      │
│  [Aniversario] [Navidad]  │
│                            │
│  [O escribe aquí...]      │
└────────────────────────────┘
```

**Características:**
- Máximo 4 botones por pregunta
- Opción de texto libre siempre disponible
- Avatar del bot
- Typing indicator mientras genera respuesta
- Historial de conversación en scroll

---

**3. Dashboard de Cashback:**
```
┌────────────────────────────┐
│  💰 Tu Cashback            │
│  ────────────────────      │
│  Balance: $47.50           │
│  Lifetime: $234.00         │
│                            │
│  [Retirar Dinero]          │
│  (Mínimo $20)              │
└────────────────────────────┘
```

---

### Paleta de Colores Recomendada

**Colores Primarios:**
- Primario: `#FF6B6B` (Coral) - CTAs, botones importantes
- Secundario: `#4ECDC4` (Turquesa) - Badges de descuento, success states
- Acento: `#FFE66D` (Amarillo) - Highlights, warnings

**Colores de Sistema:**
- Success: `#51CF66` (Verde)
- Warning: `#FFA94D` (Naranja)
- Error: `#FF6B6B` (Rojo)
- Info: `#74C0FC` (Azul claro)

**Neutros:**
- Background: `#FFFFFF` (Blanco)
- Surface: `#F8F9FA` (Gris muy claro)
- Text Primary: `#212529` (Negro casi)
- Text Secondary: `#6C757D` (Gris)

---

### Tipografía

**Font Families:**
- Headings: Inter, SF Pro Display, o Poppins (bold, semibold)
- Body: Inter, SF Pro Text, o Roboto (regular, medium)
- Monospace: Jetbrains Mono (para códigos)

**Escalas:**
```
Heading 1: 32px / 2rem (mobile), 48px / 3rem (desktop)
Heading 2: 24px / 1.5rem (mobile), 36px / 2.25rem (desktop)
Heading 3: 20px / 1.25rem (mobile), 24px / 1.5rem (desktop)
Body Large: 18px / 1.125rem
Body: 16px / 1rem
Body Small: 14px / 0.875rem
Caption: 12px / 0.75rem
```

---

### Spacing System (8px Grid)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

---

### Accesibilidad (WCAG AA)

1. **Contraste de color:**
   - Texto normal: min 4.5:1 ratio
   - Texto grande: min 3:1 ratio
   - Elementos grandes: min 3:1 ratio

2. **Keyboard Navigation:**
   - Tab order lógico
   - Focus visible (outline)
   - Escape cierra modals
   - Enter/Space activa botones

3. **Screen Readers:**
   - Alt text en todas las imágenes
   - ARIA labels en botones de íconos
   - Live regions para notificaciones
   - Semantic HTML

4. **Responsive:**
   - Zoom hasta 200% sin scroll horizontal
   - Touch targets mínimo 44x44px
   - Text reflow en móvil

---

## 🔄 Flujos de Usuario

### Flujo 1: Nuevo Usuario → Primera Compra

```
1. Usuario entra a la plataforma (no autenticado)
   ↓
2. Ve Hero Section con CTA principal
   ↓
3. Click en CTA → Modal de Chatbot se abre
   ↓
4. Bot pregunta ocasión → Usuario responde
   ↓
5. Bot pregunta para quién → Usuario responde
   ↓
6. Bot pregunta presupuesto → Usuario responde
   ↓
7. Bot muestra 3 productos comparados
   ↓
8. Usuario hace click en producto
   ↓
9. Modal de registro aparece
   ↓
10. Usuario se registra → Redirect a tienda con affiliate tag
    ↓
11. [30 días después] Tienda reporta venta → Cashback acreditado
```

---

### Flujo 2: Usuario Recurrente → Compra Grupal

```
1. Usuario autenticado entra a Dashboard
   ↓
2. Ve banner de compra grupal
   ↓
3. Click en banner → Modal de Chatbot
   ↓
4. Bot pregunta ocasión, presupuesto, número de personas
   ↓
5. Lista compartida creada
   ↓
6. Usuario comparte link por WhatsApp
   ↓
7. Amigos se unen a la lista
   ↓
8. Chat grupal activo en la lista
   ↓
9. Cuando meta se alcanza → Compra realizada
   ↓
10. Cashback se divide entre participantes
```

---

### Flujo 3: Usuario Pega Link → Comparación Instantánea

```
1. Usuario ve producto en Instagram/redes sociales
   ↓
2. Copia el link → Abre la plataforma
   ↓
3. Pega link en chatbot
   ↓
4. Sistema extrae metadata del producto
   ↓
5. Muestra tarjeta de producto instantánea
   ↓
6. Usuario hace click en "Comparar precios"
   ↓
7. Bot busca alternativas en otras 4 tiendas
   ↓
8. Muestra comparación con ahorros potenciales
```

---

## 🔌 Integraciones y APIs

### 1. Amazon Product Advertising API (PA-API 5.0)

**Documentación:** https://webservices.amazon.com/paapi5/documentation/

**Requisitos:**
- Cuenta de Amazon Associates aprobada
- Access Key ID + Secret Access Key
- Associate Tag

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
- Private Key
- Publisher ID (affiliate tag)

**Comisiones:**
- Flat 4% en todas las categorías

---

### 3. Target API

**Nota:** Target no tiene API pública oficial.

**Opciones:**
- Scraping ético (respetar robots.txt, rate limiting)
- Third-party API (RapidAPI)

**Comisiones:**
- 1-8% según categoría (promedio: 3%)

---

### 4. Etsy Open API v3

**Documentación:** https://developers.etsy.com/documentation/

**Requisitos:**
- Crear app en Etsy Developers
- API Key
- Etsy Affiliate Program

**Comisiones:**
- 4% en todas las ventas

---

### 5. eBay Finding API

**Documentación:** https://developer.ebay.com/

**Requisitos:**
- Registrar app en eBay Developers
- App ID (Client ID)
- eBay Partner Network account

**Comisiones:**
- 50-70% de la tarifa de eBay (variable)

---

### 6. Stripe (Pagos y Subscripciones)

**Uso en la Plataforma:**

**A) Suscripción Premium:**
- Crear checkout session para suscripción
- Manejar webhooks (payment_succeeded, subscription_canceled)
- Portal de cliente para gestión de suscripción

**B) Payouts (cashback):**
- Transferir cashback acumulado a cuenta del usuario
- Conectar usuarios con Stripe Connect
- Gestionar redenciones

---

### 7. Backend as a Service (BaaS)

**Opciones Recomendadas:**

**Supabase:**
- PostgreSQL managed
- Authentication built-in
- Realtime subscriptions (WebSocket)
- Row-Level Security
- Storage S3-compatible

**Neon:**
- PostgreSQL serverless
- Branching de databases
- Autoscaling

**Firebase:**
- Firestore (NoSQL)
- Authentication
- Cloud Functions
- Realtime Database

---

### 8. Email Service

**Uso:**
- Bienvenida a nuevos usuarios
- Notificaciones de cashback
- Alertas de precio (Premium)
- Recordatorios de pago

**Opciones:**
- SendGrid
- Resend
- Postmark

---

## 💾 Base de Datos

### Esquema Conceptual de Base de Datos

**Nota:** Este es un esquema conceptual. Impleméntalo con la tecnología de tu elección.

### Tablas Principales:

**1. USUARIOS**
```
Campos:
- ID único
- Email
- Nombre
- Avatar
- Idioma preferido (es/en)
- Es premium (boolean)
- Fecha de expiración premium
- ID de cliente en procesador de pagos
- Fechas de creación/actualización
```

**2. WALLET DE CASHBACK**
```
Campos:
- ID único
- ID de usuario (relación)
- Balance actual
- Total ganado históricamente
- Última fecha de redención
- Fechas de creación/actualización
```

**3. TRANSACCIONES DE CASHBACK**
```
Campos:
- ID único
- ID de usuario (relación)
- Monto
- Tipo (earned/redeemed/expired)
- Descripción
- ID de orden externa
- Tienda (amazon/walmart/etc)
- Fecha de creación
```

**4. CÓDIGOS DE REFERIDO**
```
Campos:
- ID único
- ID de usuario (relación)
- Código único
- Total de referidos
- Referidos activos
- Fecha de creación
```

**5. EARNINGS DE REFERIDOS**
```
Campos:
- ID único
- ID del referidor (relación)
- ID del referido (relación)
- Monto ganado
- Tier (novice/promoter/influencer/ambassador)
- Mes del earning
- Fecha de creación
```

**6. SUSCRIPCIONES PREMIUM**
```
Campos:
- ID único
- ID de usuario (relación)
- ID de suscripción en procesador de pagos
- Estado (active/canceled/past_due)
- Plan (monthly/annual)
- Fecha inicio período actual
- Fecha fin período actual
- Fecha de cancelación
- Fechas de creación/actualización
```

**7. LISTAS**
```
Campos:
- ID único
- ID del dueño (relación)
- Nombre de la lista
- Tipo (personal/shared/wishlist/event)
- Ocasión
- Presupuesto
- Total recaudado
- Es pública (boolean)
- Código para compartir
- Fechas de creación/actualización
```

**8. MIEMBROS DE LISTAS**
```
Campos:
- ID único
- ID de lista (relación)
- ID de usuario (relación)
- Rol (owner/admin/member)
- Monto contribuido
- Fecha de unión
```

**9. ITEMS DE LISTAS**
```
Campos:
- ID único
- ID de lista (relación)
- ID de producto (ASIN u otro)
- Tienda
- Título
- Precio
- URL de imagen
- Cantidad
- Está comprado (boolean)
- Comprado por (ID usuario)
- Fecha de compra
- Asignado a (ID usuario)
- Fecha de creación
```

**10. MENSAJES DE CHAT (listas compartidas)**
```
Campos:
- ID único
- ID de lista (relación)
- ID de usuario (relación)
- Mensaje
- Fecha de creación
```

**11. VOTACIONES DE PRODUCTOS**
```
Campos:
- ID único
- ID de item de lista (relación)
- ID de usuario (relación)
- Voto (1 para 👍, -1 para 👎)
- Fecha de creación
```

**12. LOGS DE USO DE IA**
```
Campos:
- ID único
- ID de usuario (relación)
- Tipo de feature
- Query/consulta
- Fecha de creación
```

**13. PRODUCTOS FAVORITOS**
```
Campos:
- ID único
- ID de usuario (relación)
- ID de producto
- Tienda
- Título
- Precio
- URL de imagen
- Fecha de creación
```

**14. ALERTAS DE PRECIO (Premium)**
```
Campos:
- ID único
- ID de usuario (relación)
- ID de producto
- Tienda
- Precio objetivo
- Precio actual
- Título
- URL de imagen
- Está activa (boolean)
- Fecha de notificación
- Fecha de creación
```

**15. LOGS DE AUDITORÍA**
```
Campos:
- ID único
- ID de usuario (relación)
- Acción realizada
- Tipo de entidad
- ID de entidad
- Metadata adicional (JSON)
- IP address
- User agent
- Fecha de creación
```

---

### Funciones Clave de Base de Datos

**1. Redimir Cashback Atómicamente:**
- Validar balance suficiente
- Actualizar wallet con locks para prevenir race conditions
- Registrar transacción
- Retornar nuevo balance o error

**2. Generar Código de Referido Único:**
- Crear código basado en nombre de usuario + números aleatorios
- Verificar unicidad
- Insertar en tabla
- Retornar código

**3. Auto-crear Wallet al Registrar Usuario:**
- Trigger que se ejecuta al insertar nuevo usuario
- Crea wallet con balance 0
- Crea código de referido

---

### Seguridad de Datos

**Row-Level Security (RLS):**
- Usuarios solo ven sus propios datos
- Usuarios ven listas donde son miembros
- Listas públicas son visibles para todos
- Admins tienen acceso completo

**Índices para Performance:**
- Índice en user_id para todas las tablas relacionadas
- Índice en created_at para consultas temporales
- Índice compuesto en (user_id, is_active) para alertas
- Índice en list_id para mensajes y items

---

## 🔒 Seguridad y Compliance

### 1. GDPR (Europa)

**Requisitos:**
1. Consentimiento explícito para cookies
2. Right to access (descargar datos)
3. Right to deletion (eliminar cuenta)
4. Data portability (exportar en JSON/CSV)
5. Privacy by design

**Implementación:**
- Cookie consent banner
- Página de privacy settings
- Endpoint de exportación de datos
- Endpoint de eliminación de cuenta

---

### 2. CCPA (California)

**Requisitos:**
1. Notice at collection
2. Right to know
3. Right to delete
4. Do Not Sell (no aplica si no vendes datos)

**Implementación:**
- Link "Do Not Sell My Personal Information"
- Formulario de solicitud de datos
- Confirmación de eliminación

---

### 3. FTC (Federal Trade Commission)

**Requisitos para Affiliate Marketing:**
1. Disclosure obligatorio de comisiones
2. Transparencia sobre afiliación
3. No false advertising

**Implementación:**
- Disclaimer en tarjetas de producto
- Página de Affiliate Disclosure
- Claridad en promociones

---

### 4. DMCA (Copyright)

**Requisitos:**
- Respetar copyright de imágenes
- No copiar descripciones completas
- Proceso de DMCA takedown

**Implementación:**
- Usar URLs de imágenes originales (no re-hostear)
- Atribución a tiendas
- Contact page para DMCA

---

### 5. Seguridad Técnica

**Authentication:**
- Passwords hasheados (bcrypt, argon2)
- JWT tokens con expiración
- Refresh tokens
- 2FA opcional

**API Security:**
- Rate limiting
- CORS configurado
- HTTPS obligatorio
- API keys rotadas

**Database:**
- Row-Level Security
- Encriptación at rest
- Backups automáticos
- No almacenar tarjetas (usar Stripe)

**Frontend:**
- No exponer API keys
- Sanitizar inputs (prevenir XSS)
- Content Security Policy
- SameSite cookies

---

## 🚀 Roadmap y Mejoras Futuras

### Fase 1: MVP (Base)
- AI Shopping Assistant (4 flujos)
- Comparación de precios (5 tiendas)
- Sistema de cashback
- Sistema de referidos
- Premium subscriptions
- Listas personales y compartidas
- PWA básica

### Fase 2: Enhanced Features (3-6 meses)
- Integración de APIs reales
- Price history graphs (Premium)
- Browser Extension
- Mobile App (React Native)

### Fase 3: AI Enhancements (6-12 meses)
- Visual Search (sube foto → busca producto)
- Personalized Recommendations (ML)
- Voice Shopping
- Smart Bundles

### Fase 4: Social & Gamification (12-18 meses)
- Social Feed
- Leaderboard de ahorro
- Challenges y badges

### Fase 5: B2B Features (18-24 meses)
- Platform for Business
- Influencer Program
- White-label Solution

---

## 📊 Métricas de Éxito (KPIs)

### Métricas de Producto:
1. MAU (Monthly Active Users)
2. Conversion Rate (click → compra)
3. Average Order Value
4. Retention Rate (30 días)
5. Premium Conversion

### Métricas de Monetización:
1. GMV (Gross Merchandise Value)
2. Commission Revenue
3. MRR (Monthly Recurring Revenue)
4. Cashback Payout Ratio
5. CAC (Customer Acquisition Cost)

### Métricas de Engagement:
1. Daily AI Searches promedio
2. List Creation Rate
3. Group Shopping Adoption
4. Referral Viral Coefficient

**Objetivos a 6 Meses:**
- 10,000 MAU
- 5% conversion rate
- $100,000 GMV/mes
- 10% premium adoption
- $25,000 MRR

---

## 🛠️ Consideraciones de Implementación

### 1. Testing Strategy

**Unit Tests:**
- Funciones de formateo
- Helpers de validación
- Utilidades

**Integration Tests:**
- Endpoints de API
- Funciones de base de datos
- Webhooks de pagos

**E2E Tests:**
- Flujo completo registro → búsqueda → compra
- Crear lista → invitar → chat
- Upgrade a Premium

**Performance Tests:**
- Lighthouse CI (PWA score > 90)
- API response time < 500ms
- Database query optimization

---

### 2. Deployment Strategy

**Environments:**
- Development (local)
- Staging
- Production

**CI/CD Pipeline:**
- Tests automáticos en PRs
- Build automático
- Deploy automático a staging
- Deploy manual a producción

**Monitoring:**
- Error tracking
- User behavior analytics
- Database performance
- Payment metrics
- Custom KPI dashboard

---

### 3. Caching Strategy

**Frontend:**
- Service Worker para assets
- Cache de productos (24h)
- Network-first para API

**Backend:**
- Cache de APIs externas (1h)
- Cache de datos de usuario (5min)
- Invalidar al actualizar

**CDN:**
- Cache de imágenes
- Cache de assets (1 año)

---

### 4. Scalability

**Database:**
- Connection pooling
- Read replicas
- Partitioning de tablas grandes
- Archiving de datos antiguos

**Backend:**
- Horizontal scaling
- Load balancer
- Job queue para async tasks
- Microservices (opcional)

**Frontend:**
- Code splitting
- Image optimization
- CDN para assets
- Progressive enhancement

---

## 📝 Notas Finales para el Equipo de Desarrollo

### Filosofía de Producto:
1. **User-first:** Cada decisión debe mejorar UX
2. **Mobile-first:** 80% de usuarios en móvil
3. **Speed matters:** Velocidad = conversión
4. **Transparency builds trust:** Honestidad sobre comisiones
5. **Iterate fast:** MVP → Medir → Aprender → Mejorar

### Prioridades:
1. Core feature primero (AI Assistant)
2. Monetization temprano (affiliate tags desde día 1)
3. Premium upsell visible
4. Analytics desde el inicio

### Áreas Abiertas a Mejora:
- UI/UX de Product Cards
- AI prompts optimization
- Performance (tiempo de carga)
- Features adicionales
- Experimentación con monetization

---

**Versión:** 2.0.0 - Clean Version  
**Última actualización:** 2025-11-24  
**Propósito:** Documento agnóstico para nuevo equipo de desarrollo

---

## ✅ Diferencias con Versión Anterior

Este documento es una versión **limpia y agnóstica** que:

✅ **MANTIENE:**
- Toda la funcionalidad y conceptos
- Flujos de usuario
- Comportamiento del chatbot
- Sistema de monetización
- Arquitectura conceptual
- UX/UI principles
- Roadmap

❌ **ELIMINA:**
- Referencias a archivos específicos
- URLs de bases de datos específicas
- Nombres de repositorios
- Código con rutas específicas
- Conexiones técnicas específicas

🎯 **OBJETIVO:**
Permitir al nuevo equipo crear una implementación completamente nueva sin contaminación del proyecto anterior.

---

¿Preguntas? Este documento es un punto de partida. El equipo tiene libertad para proponer mejoras y desafiar ideas. 🚀
