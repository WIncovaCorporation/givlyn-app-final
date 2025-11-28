import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { systemPrompts } from './ai-prompts.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Givlyn Backend API running' });
});

// ==============================================
// AI SHOPPING ASSISTANT API
// ==============================================

// Retry helper with exponential backoff
async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        if (attempt < maxRetries - 1) {
          const waitTime = 5000 + (attempt * 5000);
          console.log(`⏰ Rate limit, waiting ${waitTime/1000}s (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        return response;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const waitTime = 3000 + (attempt * 2000);
      console.log(`❌ Network error, retrying in ${waitTime/1000}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries exceeded');
}

app.post('/api/ai-shopping-assistant', async (req, res) => {
  try {
    const { messages, language = 'es' } = req.body;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    // Get user from auth header
    const authHeader = req.headers.authorization;
    let userId = null;
    let isAdmin = false;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;

      // Check if admin
      if (userId) {
        const { data: userRoles } = await supabase.rpc('get_user_roles', {
          _user_id: userId
        });
        isAdmin = userRoles?.some(r => r.role === 'admin') || false;
        console.log('👤 User ID:', userId, '| Is Admin:', isAdmin);
      }
    }

    // Check rate limit (only for non-admin users)
    if (userId && !isAdmin) {
      const { data: limitData, error: limitError } = await supabase.rpc(
        'check_and_increment_ai_usage',
        {
          p_user_id: userId,
          p_feature_type: 'shopping_assistant',
          p_daily_limit: 10,
        }
      );

      if (limitError) {
        console.error('AI usage limit check error:', limitError);
      } else if (limitData && limitData.allowed === false) {
        const resetDate = limitData.reset_date
          ? new Date(limitData.reset_date).toLocaleDateString('es-ES')
          : 'mañana';
        return res.status(429).json({
          error: `🚫 Has alcanzado el límite diario de 10 búsquedas de IA. Intenta nuevamente ${resetDate}.`,
          remaining: limitData.remaining ?? 0,
          reset_at: resetDate,
        });
      }

      console.log('📊 AI usage:', limitData);
    } else if (isAdmin) {
      console.log('✨ ADMIN MODE: Unlimited AI usage enabled');
    }

    console.log('🤖 Calling Google Gemini API...');
    console.log('📝 Model: gemini-2.5-flash');
    console.log('💬 Messages count:', messages.length);

    // Count assistant questions to enforce max 3 per flow
    const assistantQuestions = messages.filter(m => m.role === 'assistant').length;
    console.log('📊 Assistant questions so far:', assistantQuestions);

    let questionLimitReminder = '';
    if (assistantQuestions >= 3) {
      questionLimitReminder = language === 'es'
        ? '\n\n🚨 YA HICISTE 3 PREGUNTAS. AHORA DEBES BUSCAR PRODUCTOS INMEDIATAMENTE. Di "¡Dale! Buscando..." y muestra productos.'
        : '\n\n🚨 YOU ALREADY ASKED 3 QUESTIONS. NOW SEARCH IMMEDIATELY. Say "Alright! Searching..." and show products.';
    }

    const systemPrompt = systemPrompts[language] || systemPrompts.es;

    // Build conversation history in Gemini format
    const contents = [
      {
        parts: [{ text: systemPrompt + questionLimitReminder }],
        role: 'user'
      },
      {
        parts: [{ text: 'Entendido, soy GiftBot y ayudaré con recomendaciones de productos.' }],
        role: 'model'
      },
      ...messages.map(m => {
        // DEBUG: Log if we're sending __FLOW_4_DIRECT_COMPARE__
        if (m.content.includes('__FLOW_4_DIRECT_COMPARE__')) {
          console.log('🔍 DETECTED DIRECT COMPARE TRIGGER:', m.content.substring(0, 100));
        }
        return {
          parts: [{ text: m.content }],
          role: m.role === 'user' ? 'user' : 'model'
        };
      })
    ];

    // Call Gemini API
    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 4000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status, errorText);

      if (response.status === 429) {
        return res.status(429).json({
          error: '⏰ Límite de API alcanzado. Espera 1 minuto e intenta de nuevo.',
          code: 'RATE_LIMIT',
          retry_after: 60,
        });
      }

      if (response.status === 400) {
        return res.status(400).json({
          error: '🚫 Error en la petición a Gemini API. Verifica tu API key.',
          code: 'INVALID_REQUEST',
        });
      }

      if (response.status === 403) {
        return res.status(403).json({
          error: '🔑 API key de Gemini inválida o sin permisos.',
          code: 'INVALID_API_KEY',
        });
      }

      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Gemini response received');

    // Extract text from response
    let textParts = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!textParts || textParts.trim() === '') {
      console.error('❌ EMPTY RESPONSE FROM GEMINI');
      return res.status(500).json({
        error: 'Gemini devolvió una respuesta vacía.',
        code: 'EMPTY_RESPONSE',
        finishReason: data.candidates?.[0]?.finishReason,
      });
    }

    // POST-PROCESS: Inject affiliate tags into product links
    if (textParts.includes('[PRODUCT]')) {
      console.log('💰 Checking for affiliate configs...');
      
      const { data: affiliateConfigs } = await supabase
        .from('affiliate_config')
        .select('*')
        .eq('is_active', true);

      if (affiliateConfigs && affiliateConfigs.length > 0) {
        console.log('✅ Active affiliate configs found:', affiliateConfigs.length);
        
        const productRegex = /link:\s*(https?:\/\/[^\s\n]+)/gi;
        
        textParts = textParts.replace(productRegex, (match, url) => {
          let modifiedUrl = url;
          
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
              
              console.log(`✅ Affiliate tag injected: ${storeName}`);
            }
          }
          
          return `link: ${modifiedUrl}`;
        });
      } else {
        console.log('ℹ️ No active affiliate configs - using plain links');
      }
    }

    // Send response
    res.json({
      message: textParts,
      dataMode: 'live',
    });

  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==============================================
// MONETIZATION API
// ==============================================

// Get cashback wallet
app.get('/api/monetization/cashback/wallet', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get or create wallet
    let { data: wallet, error } = await supabase
      .from('cashback_wallet')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Wallet doesn't exist, create it
      const { data: newWallet, error: createError } = await supabase
        .from('cashback_wallet')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: createError.message });
      }
      wallet = newWallet;
    } else if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(wallet);

  } catch (error) {
    console.error('Cashback wallet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Redeem cashback
app.post('/api/monetization/cashback/redeem', async (req, res) => {
  try {
    const { amount } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Call atomic redeem function
    const { data, error } = await supabase.rpc('redeem_cashback_atomic', {
      p_user_id: user.id,
      p_amount: amount
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      success: true, 
      newBalance: data 
    });

  } catch (error) {
    console.error('Redeem cashback error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get referral code
app.get('/api/monetization/referral/code', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get or create referral code
    let { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Generate new code
      const { data: newCode, error: generateError } = await supabase.rpc('generate_referral_code', {
        p_user_id: user.id
      });

      if (generateError) {
        return res.status(500).json({ error: generateError.message });
      }

      // Fetch the newly created code
      const { data: fetchedCode, error: fetchError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        return res.status(500).json({ error: fetchError.message });
      }

      referralCode = fetchedCode;
    } else if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(referralCode);

  } catch (error) {
    console.error('Referral code error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get referral earnings
app.get('/api/monetization/referral/earnings', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: earnings, error } = await supabase
      .from('referral_earnings')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(earnings || []);

  } catch (error) {
    console.error('Referral earnings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==============================================
// SEARCH PRODUCTS API (for Lists page)
// ==============================================

app.post('/api/search-products', async (req, res) => {
  try {
    const { query, store, budget, language = 'es' } = req.body;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('🔍 Product search:', { query, store, budget });

    // Build prompt for product search
    const storeFilter = store && store !== 'all' ? `en ${store}` : 'en Amazon, Walmart, Target, Etsy y eBay';
    const budgetFilter = budget ? `con un presupuesto máximo de $${budget}` : '';
    
    const searchPrompt = language === 'es' 
      ? `Busca productos: "${query}" ${storeFilter} ${budgetFilter}.

REGLAS IMPORTANTES:
1. Devuelve EXACTAMENTE 5 productos reales con precios actuales
2. Usa el formato EXACTO para cada producto:

[PRODUCT]
name: Nombre exacto del producto
price: $XX.XX
store: Nombre de la tienda
link: https://url-real-del-producto
rating: 4.5
reviews: 1234
reason: Por qué es buena opción
image: https://url-imagen-producto
[/PRODUCT]

3. Los precios deben ser realistas y actuales
4. Los links deben ser URLs reales de las tiendas
5. NO incluyas explicaciones adicionales, SOLO los productos en el formato indicado`
      : `Search products: "${query}" ${storeFilter} ${budgetFilter}.

IMPORTANT RULES:
1. Return EXACTLY 5 real products with current prices
2. Use EXACT format for each product:

[PRODUCT]
name: Exact product name
price: $XX.XX
store: Store name
link: https://real-product-url
rating: 4.5
reviews: 1234
reason: Why it's a good option
image: https://product-image-url
[/PRODUCT]

3. Prices must be realistic and current
4. Links must be real store URLs
5. NO additional explanations, ONLY products in the indicated format`;

    // Call Gemini API
    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: searchPrompt }], role: 'user' }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit reached. Please wait and try again.' });
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textParts = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Debug: Log Gemini response
    console.log('📄 Gemini raw response (first 500 chars):', textParts.substring(0, 500));

    // Parse products from response
    const products = [];
    const productRegex = /\[PRODUCT\]([\s\S]*?)\[\/PRODUCT\]/g;
    let match;

    while ((match = productRegex.exec(textParts)) !== null) {
      const productText = match[1];
      const nameMatch = productText.match(/name:\s*(.+)/i);
      const priceMatch = productText.match(/price:\s*(.+)/i);
      const storeMatch = productText.match(/store:\s*(.+)/i);
      const linkMatch = productText.match(/link:\s*(.+)/i);
      const reasonMatch = productText.match(/reason:\s*(.+)/i);
      const imageMatch = productText.match(/image:\s*(.+)/i);
      const ratingMatch = productText.match(/rating:\s*(.+)/i);
      const reviewsMatch = productText.match(/reviews?:\s*(\d+)/i);

      if (nameMatch && priceMatch && storeMatch && linkMatch) {
        products.push({
          name: nameMatch[1].trim(),
          price: priceMatch[1].trim(),
          store: storeMatch[1].trim(),
          link: linkMatch[1].trim(),
          reason: reasonMatch ? reasonMatch[1].trim() : '',
          image: imageMatch ? imageMatch[1].trim() : undefined,
          rating: ratingMatch ? parseFloat(ratingMatch[1]) : undefined,
          reviewCount: reviewsMatch ? parseInt(reviewsMatch[1]) : undefined,
        });
      }
    }

    console.log(`✅ Found ${products.length} products`);

    res.json({ 
      products,
      query,
      store: store || 'all',
      budget: budget || null
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Givlyn Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
