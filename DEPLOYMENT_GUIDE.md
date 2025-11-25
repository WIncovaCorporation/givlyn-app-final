# 🚀 GUÍA DE DEPLOYMENT - Givlyn AI Shopping Assistant

## ⚠️ CRÍTICO: Desplegar Edge Function PRIMERO

El asistente NO funcionará hasta que deploys esta función a Supabase.

---

## PASO 1: Desplegar Edge Function (5 minutos)

### Opción A: Supabase Dashboard (RECOMENDADO)

1. **Ve a Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/rgbddzfyznhogebfuhez
   - Login con tu cuenta

2. **Abre Edge Functions:**
   - Sidebar izquierdo → **"Edge Functions"**
   - Click **"Create a new function"**

3. **Crea la función:**
   - **Function name:** `ai-shopping-assistant`
   - **Code:** Copia TODO el contenido de `supabase/functions/ai-shopping-assistant/index.ts`
   - Click **"Deploy function"**

4. **Configura variables de entorno:**
   - En la misma página, sección "Environment variables"
   - Agrega:
     - `GEMINI_API_KEY` = [tu API key de Google Gemini]
     - `SUPABASE_URL` = https://rgbddzfyznhogebfuhez.supabase.co
     - `SUPABASE_SERVICE_ROLE_KEY` = [copia de Supabase Settings > API]

5. **Verifica deployment:**
   - URL final: `https://rgbddzfyznhogebfuhez.supabase.co/functions/v1/ai-shopping-assistant`
   - Test: `curl https://rgbddzfyznhogebfuhez.supabase.co/functions/v1/ai-shopping-assistant` (debe responder)

---

### Opción B: Supabase CLI (AVANZADO)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Desplegar función
supabase functions deploy ai-shopping-assistant --project-ref rgbddzfyznhogebfuhez

# Configurar secrets
supabase secrets set GEMINI_API_KEY=your_key_here --project-ref rgbddzfyznhogebfuhez
```

---

## PASO 2: Crear Tablas de Monetización (3 minutos)

1. **Ve a SQL Editor en Supabase Dashboard:**
   - https://supabase.com/dashboard/project/rgbddzfyznhogebfuhez/sql/new

2. **Ejecuta la migración:**
   - Copia TODO el contenido de `supabase/migrations/003_monetization_tables.sql`
   - Pega en el editor SQL
   - Click **"Run"**

3. **Verifica tablas creadas:**
   - Sidebar → **"Table Editor"**
   - Debes ver:
     - ✅ `cashback_wallet`
     - ✅ `referral_codes`
     - ✅ `referral_earnings`
     - ✅ `premium_subscriptions`
     - ✅ `cashback_transactions`

---

## PASO 3: Verificar que Todo Funciona

### Test Edge Function

```bash
curl -X POST https://rgbddzfyznhogebfuhez.supabase.co/functions/v1/ai-shopping-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "__FLOW_1_GIFT__"}],
    "language": "es"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "¡Genial! Voy a encontrarte el regalo PERFECTO 🎁\n\n¿Para quién es?",
  "dataMode": "demo"
}
```

### Test Frontend

1. Abre la app en tu navegador
2. Click en el asistente rojo (esquina inferior derecha)
3. Click en **"🎁 REGALO PARA ALGUIEN"**
4. Debe responder con pregunta (NO mostrar `__FLOW_1_GIFT__`)

---

## ✅ Checklist de Deployment

- [ ] Edge Function desplegada y respondiendo
- [ ] Variables de entorno configuradas (GEMINI_API_KEY, etc.)
- [ ] Tablas de monetización creadas
- [ ] Frontend conectado al Edge Function
- [ ] Test end-to-end exitoso (usuario puede hacer búsqueda completa)

---

## 🆘 Troubleshooting

### Error: "Failed to fetch"
- **Causa:** Edge Function no desplegada o URL incorrecta
- **Solución:** Verifica que la función existe en Supabase Dashboard

### Error: "GEMINI_API_KEY not configured"
- **Causa:** Falta variable de entorno
- **Solución:** Agrega `GEMINI_API_KEY` en Edge Functions > Environment variables

### Error: Botones muestran `__FLOW_1_GIFT__`
- **Causa:** Edge Function no responde correctamente
- **Solución:** Revisa logs en Supabase Dashboard > Edge Functions > Logs

---

## 📊 Próximos Pasos (Post-Deployment)

1. ✅ Integrar APIs reales (Amazon Product API, etc.)
2. ✅ Activar affiliate programs
3. ✅ Configurar Stripe para Premium subscriptions
4. ✅ Configurar notificaciones de cashback
5. ✅ Dashboard analytics de conversión

---

**Última actualización:** 2025-11-22  
**Contacto:** hello@givlyn.com
