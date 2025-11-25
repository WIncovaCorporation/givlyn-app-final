import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar autenticación
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case 'init_wallet': {
        // Crear wallet si no existe
        const { error } = await supabase.rpc('create_user_wallet_if_not_exists', {
          p_user_id: user.id
        });

        if (error) throw error;

        // Leer wallet
        const { data: wallet } = await supabase
          .from('cashback_wallet')
          .select('*')
          .eq('user_id', user.id)
          .single();

        return new Response(
          JSON.stringify({ wallet }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_wallet': {
        const { data: wallet, error } = await supabase
          .from('cashback_wallet')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ wallet }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'redeem_cashback': {
        const { amount } = params;

        // Usar RPC para operación atómica
        const { data, error } = await supabase.rpc('redeem_cashback_atomic', {
          p_user_id: user.id,
          p_amount: amount
        });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message || 'Redemption failed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, new_balance: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'generate_referral_code': {
        // Usar función SQL que genera código único
        const { data: code, error } = await supabase.rpc('generate_referral_code', {
          p_user_id: user.id
        });

        if (error) throw error;

        // Obtener el código generado
        const { data: referralCode } = await supabase
          .from('referral_codes')
          .select('*')
          .eq('user_id', user.id)
          .single();

        return new Response(
          JSON.stringify({ referral_code: referralCode }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_referral_stats': {
        const { data: referralCode } = await supabase
          .from('referral_codes')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!referralCode) {
          return new Response(
            JSON.stringify({ error: 'No referral code found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: earnings } = await supabase
          .from('referral_earnings')
          .select('*')
          .eq('referrer_id', user.id);

        return new Response(
          JSON.stringify({ 
            referral_code: referralCode,
            earnings: earnings || []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Monetization error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
