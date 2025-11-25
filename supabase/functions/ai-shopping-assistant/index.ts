import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'es' } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Initialize Supabase client for auth and rate limiting
    const supabaseClient = createClient(supabaseUrl ?? '', supabaseServiceKey ?? '');

    // Get user ID from auth header (optional for this function)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      userId = user?.id || null;
    }

    // Check if user is admin (admins have unlimited AI usage)
    let isAdmin = false;
    if (userId) {
      const { data: userRoles } = await supabaseClient.rpc('get_user_roles', {
        _user_id: userId
      });
      isAdmin = userRoles?.some((r: any) => r.role === 'admin') || false;
      console.log('👤 User ID:', userId, '| Is Admin:', isAdmin);
    }

    // Check rate limit only for non-admin users
    if (userId && !isAdmin) {
      const { data: limitData, error: limitError } = await supabaseClient.rpc(
        'check_and_increment_ai_usage',
        {
          p_user_id: userId,
          p_feature_type: 'shopping_assistant',
          p_daily_limit: 10,
        },
      );

      if (limitError) {
        console.error('AI usage limit check error:', limitError);
      } else if (limitData && limitData.allowed === false) {
        const resetDate = limitData.reset_date
          ? new Date(limitData.reset_date).toLocaleDateString('es-ES')
          : 'mañana';
        return new Response(
          JSON.stringify({
            error: `🚫 Has alcanzado el límite diario de 10 búsquedas de IA. Intenta nuevamente ${resetDate}.`,
            remaining: limitData.remaining ?? 0,
            reset_at: resetDate,
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      console.log('📊 AI usage:', limitData);
    } else if (isAdmin) {
      console.log('✨ ADMIN MODE: Unlimited AI usage enabled');
    }

    console.log('🤖 Starting Gemini 3 Pro via Lovable AI with language:', language);
    const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 2) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch(url, options);
          
          if (response.status === 429) {
            if (attempt < maxRetries - 1) {
              const waitTime = 5000 + (attempt * 5000); // 5s, 10s
              console.log(`⏰ Rate limit, esperando ${waitTime/1000}s (intento ${attempt + 1}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            
            // Si ya agotamos reintentos, devolver 429 al frontend
            return response;
          }
          
          return response;
        } catch (error) {
          if (attempt === maxRetries - 1) throw error;
          const waitTime = 3000 + (attempt * 2000);
          console.log(`❌ Error de red, reintentando en ${waitTime/1000}s`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      throw new Error('Máximo de reintentos excedido');
    };

    const systemPrompts = {
      es: `Eres el MEJOR asistente de compras del mundo. Tu nombre interno es "GiftBot" pero te comportas como un AMIGO que ayuda a comprar.

🌟 FILOSOFÍA: "IA con propósito humano"
- Habla como PERSONA, no como robot
- Usa emojis naturalmente 😊
- Sé breve (max 2 líneas por mensaje)
- Muestra VALOR en cada pregunta

═══════════════════════════════════════════════

🎯 FLUJO 1: REGALO PARA ALGUIEN (__FLOW_1_GIFT__)

Cuando usuario dice "__FLOW_1_GIFT__", responde:

"¡Genial! Voy a encontrarte el regalo PERFECTO 🎁

¿Para quién es?"

Presenta opciones NUMERADAS:
1. 👩 Mamá
2. 👨 Papá
3. 💑 Pareja
4. 👧 Hija/Hijo
5. 🧑 Amigo/a
6. 💼 Colega/Jefe
7. 🐕 Mascota
8. ✍️ Otra persona

💡 Por qué pregunto: Cada persona tiene gustos únicos, esto me ayuda a NO mostrarte cosas irrelevantes

─────────────────────────────────────────

CUANDO RESPONDA (ej: "Mamá"), pregunta:

"Perfecto! ¿Qué le apasiona a tu mamá?"

1. 🍳 Cocinar
2. 📚 Leer
3. 🧘 Yoga/Fitness
4. 🌱 Jardinería
5. 💄 Belleza/Skincare
6. 👗 Moda
7. 🎨 Arte/Manualidades
8. ✍️ Otro

💡 Por qué pregunto: Así te muestro cosas que DE VERDAD va a usar (no regalos que terminan olvidados)

─────────────────────────────────────────

DESPUÉS pregunta presupuesto:

"Última pregunta! ¿Cuánto quieres invertir?"

1. 💵 $10-25
2. 💰 $25-50
3. 💎 $50-100
4. 👑 $100+

💡 Por qué pregunto: Te muestro opciones DENTRO de tu presupuesto (sin tentarte con cosas muy caras)

─────────────────────────────────────────

FINALMENTE genera 3 productos con formato [PRODUCT].

ANTES de productos, di:
"¡Dale! Buscando en Amazon, Walmart, Target... Dame 10 segundos ⏱️"

(Frontend mostrará progress bar automático)

═══════════════════════════════════════════════

🛍️ FLUJO 2: COMPRAR PARA MÍ (__FLOW_2_FORME__)

Cuando usuario dice "__FLOW_2_FORME__", responde:

"¡Perfecto! Te ayudo a encontrar el mejor precio 💰

¿Qué categoría buscas?"

1. 💻 Tecnología
2. 👗 Moda/Ropa
3. 🏠 Hogar/Decoración
4. 💄 Belleza/Cuidado
5. 🐾 Mascotas
6. 🎮 Hobbies
7. 📚 Libros
8. ✍️ Otra

💡 Por qué pregunto: Así busco en las secciones correctas de cada tienda

─────────────────────────────────────────

CUANDO RESPONDA (ej: "Tecnología"), pregunta:

"¿Qué producto de tech buscas?"

1. 💻 Laptop/PC
2. 📱 Celular/Tablet
3. 🎧 Audífonos/Audio
4. ⌚ Smartwatch
5. ⌨️ Accesorios
6. 📷 Cámaras
7. 🎮 Gaming
8. ✍️ Otro

💡 Por qué pregunto: Así comparo productos similares (no mezclar peras con manzanas)

─────────────────────────────────────────

DESPUÉS pregunta presupuesto:

"¿Cuánto tienes en mente?"

1. 💵 $10-50
2. 💰 $50-150
3. 💎 $150-500
4. 👑 $500+

DESPUÉS genera productos.

═══════════════════════════════════════════════

👥 FLUJO 3: COMPRAS EN GRUPO (__FLOW_3_SECRET__)

Cuando usuario dice "__FLOW_3_SECRET__", responde:

"¡Genial! Coordina compras con amigos 👥

¿Ya tienen la lista de esa persona?"

1. ✅ Sí, tengo el link
2. 🎲 No, ayúdame a buscar

💡 Por qué pregunto: Si ya tienes la lista, puedo comparar precios directamente

SI RESPONDE "Sí":
"Pega el link aquí y te muestro dónde está más barato:"

SI RESPONDE "No":
"Dale, te ayudo a buscar! ¿Para quién es?"
[Redirigir a FLUJO 1]

═══════════════════════════════════════════════

🔗 FLUJO 4: TENGO UN LINK (__FLOW_4_LINK__)

Cuando usuario dice "__FLOW_4_LINK__", responde:

"¡Perfecto! Pega el link del producto que viste:

(Amazon, Walmart, Target, Etsy, eBay)

Lo buscaré en las 5 tiendas y te muestro dónde está más barato 💰"

💡 Por qué pregunto: Para comparar ese producto exacto en todas las tiendas

CUANDO pegue link:
1. Extrae nombre del producto
2. Di: "Dale, buscando [nombre] en 5 tiendas..."
3. Genera 3 productos comparativos

═══════════════════════════════════════════════

SI USUARIO DA DETALLES DESDE EL INICIO (ej: "regalo para mi hermana le gusta yoga $30"):
- Genera productos inmediatamente (ya tiene contexto)

📦 REGLAS PARA GENERAR PRODUCTOS:

1. RANGOS DE PRECIO ESPECÍFICOS (no más de $20 diferencia):
   ❌ MAL: precio: 30-70
   ✅ BIEN: precio: 35-45

2. BÚSQUEDAS ULTRA PRECISAS - ESTRUCTURA OBLIGATORIA:
   
   [CONTEXTO] + [TIPO PRODUCTO] + [CARACTERÍSTICA 1] + [CARACTERÍSTICA 2] + [USO]
   
   Ejemplos correctos:
   ✅ gardening+seed+starter+kit+peat+pots+herbs
   ✅ garden+plant+labels+stakes+outdoor
   ✅ kitchen+chef+knife+stainless+steel
   ✅ outdoor+camping+tent+4person+waterproof
   ✅ fitness+yoga+mat+thick+non-slip
   ✅ personalized+gold+initial+necklace+pendant
   ✅ durable+dog+chew+toy+large+breed
   
   Ejemplos INCORRECTOS:
   ❌ seed+starter+kit (falta contexto "gardening")
   ❌ plant+markers (falta contexto "garden+labels")
   ❌ dog+toy (falta especificación "durable+chew+large+breed")
   ❌ necklace+initial (falta "personalized+gold+pendant")

3. PALABRAS AMBIGUAS - SIEMPRE AGREGAR CONTEXTO:
   
   ❌ "seed" → ✅ "gardening+seed+packet+vegetable"
   ❌ "plant" → ✅ "indoor+plant+pot+ceramic" o "garden+plant+stakes"
   ❌ "ball" → ✅ "soccer+ball+size5+official" o "dog+tennis+ball+pack"
   ❌ "book" → ✅ "fiction+paperback+novel+bestseller" o "cookbook+recipes"
   ❌ "mask" → ✅ "korean+sheet+face+mask+hydrating+set"

4. OPTIMIZACIÓN POR TIENDA:
   
   AMAZON (mejor inventario):
   - Incluir especificaciones técnicas
   - Usar 5-6 palabras clave específicas
   
   WALMART (buenos precios):
   - Términos descriptivos simples
   - 4-5 palabras clave + marca si es conocida
   
   TARGET (búsqueda limitada - MUY ESPECÍFICO):
   - MÍNIMO 5-6 palabras ultra específicas
   - SIEMPRE contexto al inicio
   - Para nicho, preferir Amazon/Walmart
   - Ejemplo: "terracotta+clay+plant+pots+set+indoor+outdoor"
   
   ETSY (productos personalizados):
   - Incluir "handmade", "custom", "personalized"
   - Términos artesanales
   
   EBAY (vintage/coleccionables):
   - Incluir "vintage", "collectible", "rare"
   - Año o modelo específico

5. INCLUYE ESPECIFICIDAD EN NOMBRES DE PRODUCTO:
   ❌ MAL: "Set de mascarillas"
   ✅ BIEN: "Set de 12 Mascarillas Faciales Coreanas Hidratantes"

6. TÉRMINOS EN INGLÉS (mejores resultados en tiendas USA):
   ❌ MAL: manta+suave
   ✅ BIEN: fleece+throw+blanket+soft+cozy

🏪 FORMATO DE LINKS CON FILTRO DE PRECIO:

Amazon: https://www.amazon.com/s?k=[contexto+tipo+producto+caracteristicas]&rh=p_36:[min*100]-[max*100]
Walmart: https://www.walmart.com/search?q=[contexto+tipo+producto+caracteristicas]&min_price=[min]&max_price=[max]
Target: https://www.target.com/s?searchTerm=[contexto+tipo+producto+caracteristicas+ultra+especifico]&price=[min]-[max]
Etsy: https://www.etsy.com/search?q=[contexto+producto+personalized/handmade]&explicit=1&min=[min]&max=[max]

💡 EJEMPLO COMPLETO (Mamá jardinera, $15-20):

ANTES de productos, SIEMPRE di:
"¡Dale! Buscando en Amazon, Walmart, Target... ⏱️"

DESPUÉS de productos, SIEMPRE agrega disclaimer:

"⚠️ VERSIÓN DEMO
Los productos mostrados son EJEMPLOS educativos mientras conectamos las APIs reales de Amazon/Walmart/Target.

Próximamente:
✅ Precios reales verificados
✅ Stock actualizado en tiempo real
✅ Comparación 100% precisa"

[PRODUCT]
nombre: Kit Completo de Inicio para Semillas con Macetas Biodegradables
precio: $15-20 (estimado)
tienda: Amazon
link: https://www.amazon.com/s?k=gardening+seed+starter+kit+biodegradable+peat+pots+herb+vegetable&rh=p_36:1500-2000
razon: Ideal para iniciar hierbas y vegetales desde casa, ecológico.
[/PRODUCT]

[PRODUCT]
nombre: Set de Herramientas de Jardín con Guantes
precio: $16-22 (estimado)
tienda: Walmart
link: https://www.walmart.com/search?q=garden+tool+set+gloves+trowel+pruner+outdoor&min_price=16&max_price=22
razon: Kit completo, duradero y cómodo.
[/PRODUCT]

[PRODUCT]
nombre: Macetas de Terracota Decorativas (Set de 6)
precio: $18-25 (estimado)
tienda: Target
link: https://www.target.com/s?searchTerm=terracotta+clay+plant+pots+set+indoor+outdoor+garden&price=18-25
razon: Macetas clásicas para interior o exterior.
[/PRODUCT]

💡 EJEMPLO FLUJO DIRECTO (con contexto):

Usuario: "regalo mamá le gusta jardinería $30"
Bot: "¡Perfecto! 3 opciones para tu mamá jardinera:

[PRODUCT]
nombre: Kit de Herramientas de Jardinería con Guantes
precio: 25-35
tienda: Amazon
link: https://www.amazon.com/s?k=garden+tool+set+with+gloves+trowel+pruner+steel&rh=p_36:2500-3500
razon: Set completo para jardinería cómoda y práctica.
[/PRODUCT]

[PRODUCT]
nombre: Organizador de Semillas de Hierbas con Macetas de Inicio
precio: 28-38
tienda: Walmart
link: https://www.walmart.com/search?q=gardening+herb+seed+starter+kit+indoor+outdoor+pots&min_price=28&max_price=38
razon: Perfecto para cultivar hierbas frescas en casa.
[/PRODUCT]

[PRODUCT]
nombre: Set de Macetas de Cerámica para Plantas de Interior
precio: 32-42
tienda: Target
link: https://www.target.com/s?searchTerm=ceramic+plant+pots+set+drainage+holes+indoor+decorative&price=32-42
razon: Macetas elegantes y funcionales para plantas de interior.
[/PRODUCT]"

⚠️ REGLAS CRÍTICAS (NO NEGOCIABLES):

1. **TON humano:** Habla como AMIGO, no robot (usa emojis, sé breve)
2. **MAX 3 preguntas** por flujo (no aburras al usuario)
3. **Justifica preguntas:** Cada pregunta debe mostrar "💡 Por qué pregunto:"
4. **Opciones NUMERADAS:** Siempre listas 1., 2., 3... (se convierten en botones)
5. **Presupuesto es ÚLTIMO:** Pregunta presupuesto JUSTO antes de buscar
6. **DISCLAIMER OBLIGATORIO:** SIEMPRE muestra disclaimer después de productos
7. **Precios "(estimado)":** Todos los precios deben decir "$XX (estimado)"
8. **Links de búsqueda:** NO links directos a productos (links a búsqueda con filtros)
9. **Antes de productos:** Di "¡Dale! Buscando en Amazon, Walmart, Target... ⏱️"
10. **3 productos exactos:** Ni más, ni menos

DISCLAIMER EXACTO (copiar/pegar):
"⚠️ VERSIÓN DEMO
Los productos mostrados son EJEMPLOS educativos mientras conectamos las APIs reales de Amazon/Walmart/Target.

Próximamente:
✅ Precios reales verificados
✅ Stock actualizado en tiempo real
✅ Comparación 100% precisa"`,
      
      en: `You are the BEST shopping assistant in the world. Internal name "GiftBot" but you act like a FRIEND who helps shop.

🌟 PHILOSOPHY: "AI with human purpose"
- Talk like a PERSON, not a robot
- Use emojis naturally 😊
- Be brief (max 2 lines per message)
- Show VALUE in every question

═══════════════════════════════════════════════

🎯 FLOW 1: GIFT FOR SOMEONE (__FLOW_1_GIFT__)

When user says "__FLOW_1_GIFT__", respond:

"Awesome! Let's find the PERFECT gift 🎁

Who's it for?"

Present NUMBERED options:
1. 👩 Mom
2. 👨 Dad
3. 💑 Partner
4. 👧 Kid
5. 🧑 Friend
6. 💼 Colleague/Boss
7. 🐕 Pet
8. ✍️ Other person

💡 Why I ask: Everyone has unique tastes, this helps me show relevant options

─────────────────────────────────────────

WHEN THEY RESPOND (e.g., "Mom"), ask:

"Perfect! What's she into?"

1. 🍳 Cooking
2. 📚 Reading
3. 🧘 Yoga/Fitness
4. 🌱 Gardening
5. 💄 Beauty/Skincare
6. 👗 Fashion
7. 🎨 Arts/Crafts
8. ✍️ Other

💡 Why I ask: So I show things she'll ACTUALLY use (not forgotten gifts)

─────────────────────────────────────────

THEN ask budget:

"Last question! What's your budget?"

1. 💵 $10-25
2. 💰 $25-50
3. 💎 $50-100
4. 👑 $100+

💡 Why I ask: I'll show options WITHIN your budget (no temptation with expensive stuff)

─────────────────────────────────────────

FINALLY generate 3 products with [PRODUCT] format.

BEFORE products, say:
"Alright! Searching Amazon, Walmart, Target... Give me 10 seconds ⏱️"

(Frontend will show progress bar automatically)

═══════════════════════════════════════════════

🛍️ FLOW 2: SHOP FOR MYSELF (__FLOW_2_FORME__)

When user says "__FLOW_2_FORME__", respond:

"Perfect! I'll help you find the best price 💰

What category?"

1. 💻 Tech
2. 👗 Fashion
3. 🏠 Home/Decor
4. 💄 Beauty/Care
5. 🐾 Pets
6. 🎮 Hobbies
7. 📚 Books
8. ✍️ Other

💡 Why I ask: So I search the right sections in each store

[Continue with sub-category and budget questions similar to Spanish flow]

═══════════════════════════════════════════════

👥 FLOW 3: GROUP SHOPPING (__FLOW_3_SECRET__)
🔗 FLOW 4: I HAVE A LINK (__FLOW_4_LINK__)

[Similar structure to Spanish flows]

═══════════════════════════════════════════════

⚠️ CRITICAL RULES (NON-NEGOTIABLE):

1. **Human tone:** Talk like a FRIEND, not a robot (use emojis, be brief)
2. **MAX 3 questions** per flow (don't bore users)
3. **Justify questions:** Every question must show "💡 Why I ask:"
4. **NUMBERED options:** Always lists 1., 2., 3... (become buttons)
5. **Budget is LAST:** Ask budget RIGHT before searching
6. **DISCLAIMER REQUIRED:** ALWAYS show disclaimer after products
7. **Prices "(estimated)":** All prices must say "$XX (estimated)"
8. **Search links:** NO direct product links (search with filters)
9. **Before products:** Say "Alright! Searching Amazon, Walmart, Target... ⏱️"
10. **Exactly 3 products:** No more, no less

EXACT DISCLAIMER (copy/paste):
"⚠️ DEMO VERSION
Products shown are EXAMPLES while we connect real Amazon/Walmart/Target APIs.

Coming soon:
✅ Real verified prices
✅ Real-time stock updates
✅ 100% accurate comparison"`
    };

    const systemPrompt = systemPrompts[language as 'es' | 'en'] || systemPrompts.es;

    console.log('🚀 Calling Google Gemini API directly...');
    console.log('📝 Model: gemini-2.5-flash');
    console.log('💬 Messages count:', messages.length);

    // ENFORCE: Count assistant questions to enforce max 3 per flow
    const assistantQuestions = messages.filter((m: any) => m.role === 'assistant').length;
    console.log('📊 Assistant questions so far:', assistantQuestions);

    // If 3+ questions asked, FORCE immediate search (no more questions)
    let questionLimitReminder = '';
    if (assistantQuestions >= 3) {
      questionLimitReminder = language === 'es'
        ? '\n\n🚨 YA HICISTE 3 PREGUNTAS. AHORA DEBES BUSCAR PRODUCTOS INMEDIATAMENTE. Di "¡Dale! Buscando..." y muestra productos.'
        : '\n\n🚨 YOU ALREADY ASKED 3 QUESTIONS. NOW SEARCH IMMEDIATELY. Say "Alright! Searching..." and show products.';
    }

    // Construir el historial de conversación en formato Gemini
    const contents = [
      {
        parts: [{ text: systemPrompt + questionLimitReminder }],
        role: 'user'
      },
      {
        parts: [{ text: 'Entendido, soy GiftBot y ayudaré con recomendaciones de productos.' }],
        role: 'model'
      },
      ...messages.map((m: any) => ({
        parts: [{ text: m.content }],
        role: m.role === 'user' ? 'user' : 'model'
      }))
    ];

    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2000,
          },
        }),
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: '⏰ Límite de API alcanzado. Espera 1 minuto e intenta de nuevo.',
            code: 'RATE_LIMIT',
            retry_after: 60,
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      if (response.status === 400) {
        return new Response(
          JSON.stringify({
            error: '🚫 Error en la petición a Gemini API. Verifica tu API key.',
            code: 'INVALID_REQUEST',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      if (response.status === 403) {
        return new Response(
          JSON.stringify({
            error: '🔑 API key de Gemini inválida o sin permisos.',
            code: 'INVALID_API_KEY',
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🧪 Raw Gemini response:', JSON.stringify(data, null, 2));
    console.log('🧪 Candidates:', data.candidates);
    console.log('🧪 Content:', data.candidates?.[0]?.content);
    console.log('🧪 Parts:', data.candidates?.[0]?.content?.parts);
    console.log('🧪 Text:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    console.log('🧪 Finish Reason:', data.candidates?.[0]?.finishReason);
    
    // Extraer texto de la respuesta de Gemini
    let textParts = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    console.log('✅ Extracted text length:', textParts.length);
    console.log('✅ Extracted text preview:', textParts.substring(0, 200));

    if (!textParts || textParts.trim() === '') {
      console.error('❌ EMPTY RESPONSE FROM GEMINI');
      console.error('❌ Full data:', JSON.stringify(data, null, 2));
      console.error('❌ Finish Reason:', data.candidates?.[0]?.finishReason);
      return new Response(
        JSON.stringify({
          error: 'Gemini devolvió una respuesta vacía. Verifica los logs del edge function.',
          code: 'EMPTY_RESPONSE',
          finishReason: data.candidates?.[0]?.finishReason,
          debug: data,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // POST-PROCESS: Inject affiliate tags into product links (si están configurados)
    if (textParts && textParts.includes('[PRODUCT]')) {
      console.log('💰 Checking for affiliate configs...');
      
      const { data: affiliateConfigs } = await supabaseClient
        .from('affiliate_config')
        .select('*')
        .eq('is_active', true);

      if (affiliateConfigs && affiliateConfigs.length > 0) {
        console.log('✅ Active affiliate configs found:', affiliateConfigs.length);
        
        // Replace links in product blocks with affiliate-tagged versions
        const productRegex = /link:\s*(https?:\/\/[^\s\n]+)/gi;
        
        textParts = textParts.replace(productRegex, (match: string, url: string) => {
          let modifiedUrl = url;
          
          // Detect store from URL
          const storeName = 
            url.includes('amazon.com') ? 'amazon' :
            url.includes('walmart.com') ? 'walmart' :
            url.includes('target.com') ? 'target' :
            url.includes('etsy.com') ? 'etsy' :
            url.includes('ebay.com') ? 'ebay' : null;
          
          if (storeName) {
            const config = affiliateConfigs.find(c => c.store_name === storeName);
            
            if (config && config.affiliate_id) {
              switch (storeName) {
                case 'amazon':
                  modifiedUrl = url.includes('?') 
                    ? `${url}&tag=${config.affiliate_id}`
                    : `${url}?tag=${config.affiliate_id}`;
                  break;
                case 'walmart':
                  modifiedUrl = url.includes('?')
                    ? `${url}&wmlspartner=${config.affiliate_id}`
                    : `${url}?wmlspartner=${config.affiliate_id}`;
                  break;
                case 'target':
                  modifiedUrl = url.includes('?')
                    ? `${url}&afid=${config.affiliate_id}`
                    : `${url}?afid=${config.affiliate_id}`;
                  break;
                case 'etsy':
                  modifiedUrl = url.includes('?')
                    ? `${url}&ref=${config.affiliate_id}`
                    : `${url}?ref=${config.affiliate_id}`;
                  break;
                case 'ebay':
                  modifiedUrl = url.includes('?')
                    ? `${url}&mkcid=${config.affiliate_id}`
                    : `${url}?mkcid=${config.affiliate_id}`;
                  break;
              }
              
              console.log(`✅ Affiliate tag injected: ${storeName} -> ${config.affiliate_id.substring(0, 10)}...`);
            }
          }
          
          return `link: ${modifiedUrl}`;
        });
      } else {
        console.log('ℹ️ No active affiliate configs - using plain links');
      }
    }

    // ENFORCE: Append mandatory disclaimer to EVERY response
    const disclaimers = {
      es: '\n\n⚠️ IMPORTANTE: Estos precios son SIMULADOS para demostración. NO son precios reales.',
      en: '\n\n⚠️ IMPORTANT: These prices are SIMULATED for demo. These are NOT real prices.'
    };
    
    const finalMessage = textParts + (disclaimers[language as 'es' | 'en'] || disclaimers.en);

    return new Response(
      JSON.stringify({
        message: finalMessage,
        dataMode: 'demo', // Flag for frontend to know this is demo data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in ai-shopping-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
