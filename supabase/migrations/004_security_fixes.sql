-- =====================================================
-- GIVLYN SECURITY FIXES
-- Fix: Mutable search_path in SECURITY DEFINER functions
-- Created: 2025-11-25
-- =====================================================

-- 1. FIX create_user_wallet_if_not_exists
CREATE OR REPLACE FUNCTION public.create_user_wallet_if_not_exists(p_user_id UUID)
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.cashback_wallet (user_id, balance, lifetime_earned)
  VALUES (p_user_id, 0.00, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

COMMENT ON FUNCTION public.create_user_wallet_if_not_exists IS 'Crear wallet si no existe - llamar desde app al login';

-- =====================================================

-- 2. FIX redeem_cashback_atomic
CREATE OR REPLACE FUNCTION public.redeem_cashback_atomic(p_user_id UUID, p_amount DECIMAL)
RETURNS DECIMAL 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance DECIMAL;
  v_new_balance DECIMAL;
BEGIN
  SELECT balance INTO v_balance
  FROM public.cashback_wallet
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  v_new_balance := v_balance - p_amount;

  UPDATE public.cashback_wallet
  SET balance = v_new_balance,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.cashback_transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'redeemed', -p_amount, 'Cashback redeemed');

  RETURN v_new_balance;
END;
$$;

COMMENT ON FUNCTION public.redeem_cashback_atomic IS 'Redimir cashback de forma atómica - previene race conditions';

-- =====================================================

-- 3. FIX generate_referral_code
CREATE OR REPLACE FUNCTION public.generate_referral_code(p_user_id UUID)
RETURNS VARCHAR 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code VARCHAR(20);
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  INSERT INTO public.referral_codes (user_id, code)
  VALUES (p_user_id, v_code)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN v_code;
END;
$$;

COMMENT ON FUNCTION public.generate_referral_code IS 'Generar código de referido único';

-- =====================================================

-- 4. FIX generate_unique_join_code (for groups)
CREATE OR REPLACE FUNCTION public.generate_unique_join_code()
RETURNS VARCHAR 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code VARCHAR(10);
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    SELECT EXISTS(SELECT 1 FROM public.groups WHERE join_code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$;

COMMENT ON FUNCTION public.generate_unique_join_code IS 'Generar código único para unirse a grupos';

-- =====================================================
-- END OF SECURITY FIXES
-- =====================================================
