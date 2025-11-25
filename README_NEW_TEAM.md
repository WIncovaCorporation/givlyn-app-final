# 🚨 INSTRUCCIONES PARA NUEVO EQUIPO DE DESARROLLO - GIVLYN

**FECHA:** 2025-11-24  
**CRITICIDAD:** ALTA  
**PROPÓSITO:** Iniciar desarrollo limpio sin contaminación de infraestructura anterior

---

## ⚠️ ADVERTENCIA CRÍTICA

**IGNOREN COMPLETAMENTE TODO LO SIGUIENTE:**

❌ Cualquier URL de Supabase que encuentren en el código  
❌ Cualquier repositorio de GitHub mencionado  
❌ Cualquier base de datos existente  
❌ Cualquier variable de entorno con valores específicos  
❌ Cualquier archivo de configuración con credenciales  
❌ Cualquier archivo `*.sql` con migraciones del proyecto anterior  
❌ Cualquier referencia a `WIncovaCorporation` o repos específicos  

**TODO SE CREA DESDE CERO.**

---

## 📋 ÚNICA FUENTE DE VERDAD

**EL ÚNICO DOCUMENTO VÁLIDO ES:**

```
GIVLYN_PRODUCT_SPECIFICATION_CLEAN.md
```

Este documento contiene:
- ✅ Funcionalidad completa de la aplicación
- ✅ Flujos de usuario
- ✅ Sistema de monetización
- ✅ Arquitectura conceptual
- ❌ NO contiene infraestructura específica
- ❌ NO contiene código legacy

---

## 🎯 DO / DON'T

| ✅ HACER | ❌ NO HACER |
|---------|-------------|
| Crear repositorio nuevo desde cero | Clonar repositorio existente |
| Crear cuenta nueva de Supabase/Neon/Firebase | Usar URLs de Supabase del código anterior |
| Generar propias API keys | Copiar API keys del código anterior |
| Crear base de datos nueva | Conectarse a base de datos anterior |
| Definir schema desde cero usando el spec | Ejecutar migraciones SQL del proyecto anterior |
| Implementar componentes con sus propios nombres | Copiar nombres de archivos del proyecto anterior |
| Crear variables de entorno propias | Usar archivo `.env` del proyecto anterior |
| Leer `GIVLYN_PRODUCT_SPECIFICATION_CLEAN.md` | Leer código fuente del proyecto anterior como referencia |

---

## 🔒 REGLAS DE OPERACIÓN (NO NEGOCIABLES)

1. **REPO NUEVO:** Crear repositorio Git completamente nuevo
2. **BRANCH STRATEGY:** `main` (producción) + `dev` (desarrollo) + feature branches
3. **ZERO LEGACY:** Auditoría obligatoria para detectar referencias a infraestructura anterior
4. **FRESH CLOUD:** Crear cuentas nuevas en servicios cloud (o proyectos separados)
5. **ENV SEPARATION:** Desarrollo, Staging, Producción (tres ambientes separados)
6. **NO COPY-PASTE:** Implementar desde cero basándose en el spec funcional

---

## 🏗️ ARQUITECTURA LIMPIA (STACK RECOMENDADO)

### Frontend (Progressive Web App)
```
Framework:    React 18 + TypeScript
Build Tool:   Vite 5
Routing:      React Router v6
UI:           Tailwind CSS + shadcn/ui (Radix UI)
State:        TanStack Query (React Query)
Forms:        React Hook Form + Zod
PWA:          Vite PWA Plugin + Workbox
```

### Backend (API Server)
```
Runtime:      Node.js 20+
Framework:    Express.js
Language:     TypeScript
Validation:   Zod
Auth:         JWT + OAuth
AI:           Google Gemini 2.5 Flash (o GPT-4 Turbo)
Jobs:         Bull + Redis (opcional)
```

### Base de Datos
```
OPCIONES (elegir UNA):

Opción A - Supabase (nuevo proyecto):
- Crear cuenta nueva en supabase.com
- Crear proyecto nuevo
- Obtener nueva URL + anon key + service key

Opción B - Neon (serverless PostgreSQL):
- Crear cuenta en neon.tech
- Crear proyecto nuevo
- Obtener connection string

Opción C - Railway/Render + PostgreSQL:
- Crear proyecto en Railway o Render
- Provisionar PostgreSQL managed

⚠️ NO USAR credenciales de bases de datos anteriores
```

### Servicios de Terceros
```
Payments:     Stripe (cuenta nueva)
Email:        Resend o SendGrid (cuenta nueva)
Monitoring:   Sentry (proyecto nuevo) - OPCIONAL
Analytics:    Google Analytics 4 (propiedad nueva) - OPCIONAL
```

---

## 🚀 SETUP INICIAL (PASO A PASO)

### FASE 1: Preparación del Entorno Local

**1.1 Instalar Toolchain**
```bash
# Verificar versiones
node --version    # Debe ser v20+
npm --version     # Debe ser v10+
git --version     # Cualquier versión reciente

# Alternativa: usar Bun (más rápido)
curl -fsSL https://bun.sh/install | bash
bun --version
```

**1.2 Crear Estructura de Proyecto**
```bash
# Crear directorio raíz
mkdir givlyn-app
cd givlyn-app

# Crear Git repo NUEVO
git init
echo "node_modules/" > .gitignore
echo ".env*" >> .gitignore
echo "dist/" >> .gitignore
```

---

### FASE 2: Bootstrap Frontend

**2.1 Crear Proyecto React con Vite**
```bash
# Crear frontend
npm create vite@latest frontend -- --template react-ts
cd frontend

# Instalar dependencias base
npm install

# Instalar UI y utils
npm install tailwindcss postcss autoprefixer
npm install react-router-dom
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react

# Instalar shadcn/ui (opcional pero recomendado)
npx shadcn-ui@latest init

# Configurar Tailwind
npx tailwindcss init -p
```

**2.2 Configurar Vite (vite.config.ts)**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Givlyn',
        short_name: 'Givlyn',
        description: 'AI Shopping Assistant',
        theme_color: '#FF6B6B',
      }
    })
  ],
  server: {
    port: 5000,
    host: '0.0.0.0',  // CRÍTICO: Permite acceso desde proxy
  }
})
```

**2.3 Crear Variables de Entorno (.env.local)**
```bash
# frontend/.env.local
VITE_API_URL=http://localhost:3002
VITE_GEMINI_API_KEY=TU_NUEVA_API_KEY_DE_GEMINI
```

⚠️ **NO COPIAR valores del proyecto anterior**

---

### FASE 3: Bootstrap Backend

**3.1 Crear Proyecto Node + Express**
```bash
# Volver a raíz
cd ..
mkdir backend
cd backend

# Inicializar proyecto
npm init -y

# Instalar dependencias
npm install express cors dotenv
npm install @google/generative-ai
npm install typescript @types/node @types/express tsx
npm install zod

# Configurar TypeScript
npx tsc --init
```

**3.2 Crear Servidor Base (src/index.ts)**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
```

**3.3 Crear Variables de Entorno (.env)**
```bash
# backend/.env
PORT=3002
NODE_ENV=development

# Base de datos (ejemplo con Supabase NUEVO)
DATABASE_URL=postgresql://user:password@db.NUEVO_PROYECTO.supabase.co:5432/postgres

# AI
GEMINI_API_KEY=TU_NUEVA_API_KEY

# Stripe (NUEVO)
STRIPE_SECRET_KEY=sk_test_NUEVA_KEY
STRIPE_WEBHOOK_SECRET=whsec_NUEVA_KEY

# Affiliate Tags (NUEVOS)
AMAZON_AFFILIATE_TAG=tu-tag-20
WALMART_PUBLISHER_ID=tu-id
TARGET_AFFILIATE_ID=tu-id
```

⚠️ **TODOS LOS VALORES DEBEN SER NUEVOS**

---

### FASE 4: Configurar Base de Datos

**4.1 Crear Schema Inicial**

Basándose en el documento `GIVLYN_PRODUCT_SPECIFICATION_CLEAN.md` (sección "Base de Datos"), crear tablas con ORM o SQL puro:

```sql
-- Ejemplo conceptual (NO COPIAR del proyecto anterior)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  preferred_language VARCHAR(2) DEFAULT 'es',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cashback_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  lifetime_earned DECIMAL(10,2) DEFAULT 0,
  last_redemption_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ... continuar con el resto de tablas del spec
```

**4.2 Implementar Row-Level Security (si usan Supabase/Postgres)**
```sql
ALTER TABLE cashback_wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet"
  ON cashback_wallet FOR SELECT
  USING (auth.uid() = user_id);
```

---

### FASE 5: Implementar AI Shopping Assistant

**5.1 Crear Servicio de IA (backend/src/services/aiService.ts)**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function chatWithAI(userMessage: string, language: 'es' | 'en') {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const systemPrompt = language === 'es' 
    ? `Eres GiftBot, asistente de compras de Givlyn...`
    : `You are GiftBot, Givlyn's shopping assistant...`;
  
  const result = await model.generateContent([
    systemPrompt,
    userMessage
  ]);
  
  return result.response.text();
}
```

**5.2 Crear Endpoint de Chat (backend/src/routes/chat.ts)**
```typescript
import express from 'express';
import { chatWithAI } from '../services/aiService';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message, language = 'es' } = req.body;
  
  try {
    const response = await chatWithAI(message, language);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI service error' });
  }
});

export default router;
```

---

### FASE 6: Implementar Comparación Multi-Tienda

**6.1 Registrarse en APIs de Afiliados (NUEVAS CUENTAS)**

```
1. Amazon Associates
   - Ir a: https://affiliate-program.amazon.com
   - Crear cuenta NUEVA
   - Obtener Access Key + Secret Key + Associate Tag

2. Walmart Affiliate Program
   - Ir a: https://affiliates.walmart.com
   - Crear cuenta NUEVA
   - Obtener Publisher ID + API Key

3. Target Affiliate Program (via Impact)
   - Ir a: https://impact.com
   - Buscar "Target Affiliate Program"
   - Aplicar con cuenta NUEVA

4. Etsy Affiliate + API
   - API: https://developers.etsy.com
   - Afiliados: https://www.etsy.com/affiliates
   - Crear cuentas NUEVAS

5. eBay Partner Network + API
   - https://developer.ebay.com
   - https://epn.ebay.com
   - Crear cuentas NUEVAS
```

**6.2 Implementar Comparador (conceptual)**
```typescript
// backend/src/services/productComparison.ts

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  store: 'amazon' | 'walmart' | 'target' | 'etsy' | 'ebay';
  url: string;  // Con affiliate tag inyectado
}

export async function compareProduct(query: string): Promise<Product[]> {
  // 1. Buscar en Amazon
  const amazonProducts = await searchAmazon(query);
  
  // 2. Buscar en Walmart
  const walmartProducts = await searchWalmart(query);
  
  // 3. Buscar en Target
  const targetProducts = await searchTarget(query);
  
  // 4. Buscar en Etsy
  const etsyProducts = await searchEtsy(query);
  
  // 5. Buscar en eBay
  const ebayProducts = await searchEbay(query);
  
  // 6. Combinar y ordenar
  const allProducts = [
    ...amazonProducts,
    ...walmartProducts,
    ...targetProducts,
    ...etsyProducts,
    ...ebayProducts
  ];
  
  // 7. Ordenar por precio
  return allProducts.sort((a, b) => a.price - b.price).slice(0, 10);
}
```

---

## 🎨 ESTRUCTURA DE PROYECTO RECOMENDADA

```
givlyn-app/
│
├── frontend/                    # React PWA
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChat.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CashbackWallet.tsx
│   │   │   └── ReferralSystem.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Lists.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useProducts.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── storage.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.local               # NUEVO (no copiar valores)
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── chat.ts
│   │   │   ├── products.ts
│   │   │   ├── cashback.ts
│   │   │   └── referrals.ts
│   │   ├── services/
│   │   │   ├── aiService.ts
│   │   │   ├── productComparison.ts
│   │   │   ├── cashbackService.ts
│   │   │   └── affiliateService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── rateLimit.ts
│   │   ├── utils/
│   │   │   ├── database.ts
│   │   │   └── validators.ts
│   │   └── index.ts
│   ├── .env                     # NUEVO (no copiar valores)
│   ├── tsconfig.json
│   └── package.json
│
├── database/                    # Scripts de DB
│   ├── schema.sql               # NUEVO (basado en spec)
│   └── seeds.sql                # Datos de prueba NUEVOS
│
└── docs/
    ├── GIVLYN_PRODUCT_SPECIFICATION_CLEAN.md  # ÚNICA FUENTE DE VERDAD
    └── API.md                   # Documentar sus propios endpoints
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de considerar el setup completo, verificar:

### Código
- [ ] NO hay URLs de Supabase del proyecto anterior en el código
- [ ] NO hay referencias a repositorios GitHub específicos
- [ ] NO hay API keys hardcodeadas del proyecto anterior
- [ ] Todas las variables de entorno tienen valores NUEVOS
- [ ] NO hay archivos `.sql` copiados del proyecto anterior

### Infraestructura
- [ ] Base de datos es NUEVA (URL diferente)
- [ ] Repositorio Git es NUEVO
- [ ] Cuentas de Stripe/SendGrid/etc son NUEVAS
- [ ] API keys de Amazon/Walmart/etc son NUEVAS
- [ ] Proyecto en servicio cloud es NUEVO

### Tests
- [ ] `npm run lint` pasa sin errores
- [ ] `npm run build` genera dist/ sin errores
- [ ] Backend responde en `GET /api/health`
- [ ] Frontend carga en `http://localhost:5000`

### Auditoría Manual
- [ ] Buscar en VSCode: "supabase.co" → 0 resultados (excepto este README)
- [ ] Buscar en VSCode: "WIncovaCorporation" → 0 resultados
- [ ] Buscar en VSCode: "SUPABASE_URL" → solo en `.env.example`
- [ ] Revisar `.env*` para valores del proyecto anterior

---

## 🔥 TROUBLESHOOTING

### Problema: "Cannot connect to database"
**Solución:**
1. Verificar que `DATABASE_URL` en `.env` es NUEVA
2. Verificar que la base de datos existe
3. Verificar firewall/IP whitelist

### Problema: "AI API key invalid"
**Solución:**
1. Generar NUEVA API key en Google AI Studio
2. NO usar la del proyecto anterior
3. Verificar que está en `.env` correctamente

### Problema: "Frontend no carga en proxy"
**Solución:**
1. Verificar que `vite.config.ts` tiene `host: '0.0.0.0'`
2. Verificar que el puerto es 5000
3. Reiniciar el servidor de desarrollo

---

## 📞 SOPORTE

**SI TIENEN DUDAS:**
1. Leer `GIVLYN_PRODUCT_SPECIFICATION_CLEAN.md` primero
2. Verificar checklist de verificación
3. NO revisar código del proyecto anterior
4. Contactar al equipo de producto con preguntas funcionales

---

## 🎯 OBJETIVO FINAL

Al completar este setup, deberían tener:

✅ Aplicación React PWA corriendo en puerto 5000  
✅ Backend Express corriendo en puerto 3002  
✅ Base de datos PostgreSQL NUEVA con schema básico  
✅ AI chatbot funcional con Gemini  
✅ Sistema de autenticación básico  
✅ ZERO referencias a infraestructura anterior  

**SIGUIENTE PASO:** Implementar features según prioridad:
1. AI Shopping Assistant (flujo 1: ocasión)
2. Comparación de productos (Amazon + Walmart mínimo)
3. Sistema de cashback
4. Listas compartidas
5. Premium subscription

---

**RECORDATORIO FINAL:**

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  NO COPIAR NADA DEL PROYECTO ANTERIOR                    ║
║  NO USAR CREDENCIALES DEL PROYECTO ANTERIOR              ║
║  NO CONECTARSE A INFRAESTRUCTURA ANTERIOR                ║
║                                                           ║
║  TODO DESDE CERO.                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**¡Buena suerte! 🚀**
