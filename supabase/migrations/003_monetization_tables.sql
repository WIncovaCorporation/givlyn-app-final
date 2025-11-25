-- =====================================================
-- GIVLYN MONETIZATION TABLES
-- Features: Cashback Wallet + Referral System + Premium
-- Created: 2025-11-22
-- =====================================================

-- 1. CASHBACK WALLET TABLE
-- Tracking de cashback (2% de comisiones)
CREATE TABLE IF NOT EXISTS cashback_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0.00 CHECK (balance >= 0),
  lifetime_earned DECIMAL(10,2) DEFAULT 0.00,
  lifetime_redeemed DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE cashback_wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cashback wallet"
  ON cashback_wallet FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cashback wallet"
  ON cashback_wallet FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage cashback wallets"
  ON cashback_wallet FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE cashback_wallet IS 'Wallet de cashback - Usuario recibe 2% de cada compra';

-- Index para búsquedas rápidas
CREATE INDEX idx_cashback_wallet_user ON cashback_wallet(user_id);

-- =====================================================

-- 2. REFERRAL CODES TABLE
-- Sistema de referidos con niveles (novato→embajador)
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL UNIQUE,
  uses_count INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  tier VARCHAR(20) DEFAULT 'novato' CHECK (tier IN ('novato', 'promotor', 'influencer', 'embajador')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view referral codes by code"
  ON referral_codes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own referral code"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage referral codes"
  ON referral_codes FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE referral_codes IS 'Códigos de referidos - Niveles: novato($5), promotor($7), influencer($10), embajador($15)';

CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);

-- =====================================================

-- 3. REFERRAL EARNINGS TABLE
-- Tracking de ganancias por cada compra referida
CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  purchase_value DECIMAL(10,2),
  tier_at_time VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral earnings"
  ON referral_earnings FOR SELECT
  USING (auth.uid() = referrer_id);

COMMENT ON TABLE referral_earnings IS 'Historial de ganancias por referidos';

CREATE INDEX idx_referral_earnings_referrer ON referral_earnings(referrer_id);
CREATE INDEX idx_referral_earnings_date ON referral_earnings(created_at DESC);

-- =====================================================

-- 4. PREMIUM SUBSCRIPTIONS TABLE
-- Givlyn Premium: $9.99/mes o $99/año
CREATE TABLE IF NOT EXISTS premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  price DECIMAL(10,2) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  stripe_subscription_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON premium_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE premium_subscriptions IS 'Givlyn Premium - Búsquedas ilimitadas, cashback 4%, price alerts, etc.';

CREATE INDEX idx_premium_subs_user ON premium_subscriptions(user_id);
CREATE INDEX idx_premium_subs_status ON premium_subscriptions(status) WHERE status = 'active';

-- =====================================================

-- 5. CASHBACK TRANSACTIONS TABLE
-- Registro de cada transacción de cashback
CREATE TABLE IF NOT EXISTS cashback_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired')),
  amount DECIMAL(10,2) NOT NULL,
  purchase_value DECIMAL(10,2),
  store VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cashback_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cashback transactions"
  ON cashback_transactions FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE cashback_transactions IS 'Historial completo de transacciones de cashback';

CREATE INDEX idx_cashback_tx_user_date ON cashback_transactions(user_id, created_at DESC);

-- =====================================================

-- FUNCTION: Auto-crear wallet al crear usuario
-- NOTA: Trigger en auth.users no funciona en Supabase
-- Se llamará manualmente desde app o se crea via RPC
CREATE OR REPLACE FUNCTION create_user_wallet_if_not_exists(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO cashback_wallet (user_id, balance, lifetime_earned)
  VALUES (p_user_id, 0.00, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_user_wallet_if_not_exists IS 'Crear wallet si no existe - llamar desde app al login';

-- =====================================================

-- FUNCTION: Redeem cashback atómicamente
CREATE OR REPLACE FUNCTION redeem_cashback_atomic(p_user_id UUID, p_amount DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
  v_balance DECIMAL;
  v_new_balance DECIMAL;
BEGIN
  -- Lock row y obtener balance actual
  SELECT balance INTO v_balance
  FROM cashback_wallet
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Validar balance suficiente
  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Calcular nuevo balance
  v_new_balance := v_balance - p_amount;

  -- Actualizar balance
  UPDATE cashback_wallet
  SET balance = v_new_balance,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Registrar transacción
  INSERT INTO cashback_transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'redeemed', -p_amount, 'Cashback redeemed');

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION redeem_cashback_atomic IS 'Redimir cashback de forma atómica - previene race conditions';

-- =====================================================

-- FUNCTION: Generar código de referido único
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_code VARCHAR(20);
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generar código de 8 caracteres aleatorios
    v_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Verificar si ya existe
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  -- Insertar código
  INSERT INTO referral_codes (user_id, code)
  VALUES (p_user_id, v_code)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================

COMMENT ON SCHEMA public IS 'Givlyn Monetization System - Cashback + Referrals + Premium';
