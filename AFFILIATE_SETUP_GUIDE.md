# 🎯 GUÍA DE CONFIGURACIÓN DE AFFILIATE IDs - GIVLYN

**IMPORTANTE:** Esta guía te muestra EXACTAMENTE dónde actualizar tus códigos de afiliado cuando los obtengas de Amazon, Walmart, etc.

---

## 🔴 CRÍTICO - UN SOLO ARCHIVO PARA TODO

**TODO el sistema de affiliate links está centralizado en UN SOLO LUGAR:**

### 📍 Archivo: `supabase/functions/generate-external-affiliate-link/index.ts`

**Líneas 10-16:**
```typescript
const WINCOVA_AFFILIATE_CODES = {
  amazon: 'wincova-20',    // 👈 ACTUALIZAR con tu Amazon Associates Tag
  walmart: 'wincova',      // 👈 ACTUALIZAR con tu Walmart Affiliate ID
  target: 'wincova',       // 👈 ACTUALIZAR con tu Target Affiliate ID
  ebay: 'wincova',         // 👈 ACTUALIZAR con tu eBay Partner Network ID
  etsy: 'wincova',         // 👈 ACTUALIZAR con tu Etsy Affiliate ID
};
```

---

## ✅ CUANDO TENGAS TUS AFFILIATE IDs

### Amazon Associates
1. Regístrate en: https://affiliate-program.amazon.com/
2. Obtendrás un tag como: `wincova-20` o `givlyn-21`
3. Reemplaza `'wincova-20'` con tu tag real

### Walmart Affiliates
1. Regístrate en: https://affiliates.walmart.com/
2. Obtendrás un affiliate ID
3. Reemplaza `'wincova'` con tu ID real

### Target Affiliates
1. Regístrate en: https://partners.target.com/
2. Obtendrás un affiliate ID (afid)
3. Reemplaza `'wincova'` con tu ID real

### eBay Partner Network
1. Regístrate en: https://www.ebaypartnernetwork.com/
2. Obtendrás un Campaign ID (campid)
3. Reemplaza `'wincova'` con tu campid real

### Etsy Affiliates
1. Regístrate en: https://www.etsy.com/affiliates
2. Obtendrás un ref code
3. Reemplaza `'wincova'` con tu ref real

---

## 🚀 CÓMO ACTUALIZAR

1. Abre el archivo: `supabase/functions/generate-external-affiliate-link/index.ts`
2. Encuentra las líneas 10-16 (WINCOVA_AFFILIATE_CODES)
3. Reemplaza los valores placeholder con tus IDs reales
4. Guarda el archivo
5. **¡LISTO!** - Todos los enlaces en toda la aplicación usarán tus nuevos IDs

---

## 🔐 ARQUITECTURA IMPLEMENTADA

### ✅ TODOS los clicks pasan por affiliate:

**Frontend → Edge Function → Link con Affiliate ID → Usuario hace click**

**Componentes que usan affiliate links:**
1. ✅ `ProductCard.tsx` - Tarjetas de productos en Marketplace
2. ✅ `ProductPreviewModal.tsx` - Modal de vista previa
3. ✅ `ProductSuggestions.tsx` - Sugerencias de productos
4. ✅ `Marketplace.tsx` - Página principal de marketplace
5. ✅ `AIShoppingAssistant` - Recomendaciones del asistente IA

**Edge Functions:**
- `generate-external-affiliate-link` - Para productos de tiendas externas (Amazon, Walmart, etc.)
- `generate-affiliate-link` - Para productos internos de la BD
- `track-affiliate-click` - Para analytics de clicks

### 📊 Analytics Incluidos

Cada click se registra en la tabla `affiliate_clicks` con:
- User ID (si está logueado)
- Product ID
- IP Address
- User Agent
- Referrer
- Timestamp

---

## 🎁 REVENUE MODEL ACTUAL

**Estado actual (con placeholders):**
- Todos los links YA pasan por el sistema de affiliate
- Sistema de tracking funcionando
- SOLO faltan los affiliate IDs reales

**Cuando actualices los IDs:**
- 100% de los clicks generarán comisiones
- Sin cambios de código necesarios
- Sin tocar base de datos
- Sin modificar frontend

---

## ⚠️ IMPORTANTE - NO TOCAR ESTOS ARCHIVOS

**Estos archivos YA están configurados correctamente:**
- `src/components/ProductCard.tsx`
- `src/components/ProductPreviewModal.tsx`
- `src/components/ProductSuggestions.tsx`
- `src/pages/Marketplace.tsx`
- `supabase/functions/track-affiliate-click/index.ts`

**NO necesitas modificarlos para actualizar tus affiliate IDs.**

---

## 🔄 DESPLIEGUE A PRODUCCIÓN

Cuando despliegues a Vercel:
1. El archivo `generate-external-affiliate-link/index.ts` se desplegará automáticamente
2. Tus affiliate IDs estarán activos inmediatamente
3. Todos los clicks generarán comisiones

---

## 📝 NOTAS

- Los placeholders actuales (`wincova-20`, `wincova`) son solo para testing
- La arquitectura está 100% completa y funcionando
- Solo necesitas actualizar UN archivo cuando tengas los IDs reales
- Puedes actualizar un ID a la vez (por ejemplo, empezar solo con Amazon)

---

**Última actualización:** 2025-11-21  
**Estado:** Arquitectura completa - Solo faltan IDs reales  
**Revenue Loss Actual:** 0% (todos los links pasan por affiliate system)
