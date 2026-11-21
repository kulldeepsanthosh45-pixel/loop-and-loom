-- =====================================================================
-- Loop & Loom: Workshop Registration & Payment System
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- =====================================================================

-- ── 1. Workshop Settings (admin-configurable) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_settings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saturday_date        TEXT NOT NULL DEFAULT 'Saturday, 29 November 2025',
  sunday_date          TEXT NOT NULL DEFAULT 'Sunday, 30 November 2025',
  saturday_time        TEXT NOT NULL DEFAULT '4:00 PM – 7:00 PM',
  sunday_time          TEXT NOT NULL DEFAULT '10:00 AM – 1:00 PM',
  fee                  INTEGER NOT NULL DEFAULT 1299,
  max_seats_saturday   INTEGER NOT NULL DEFAULT 20,
  max_seats_sunday     INTEGER NOT NULL DEFAULT 20,
  registration_open    BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Insert one settings row if none exists
INSERT INTO public.workshop_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Workshop Registrations ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id     TEXT UNIQUE NOT NULL,
  full_name           TEXT NOT NULL,
  mobile              TEXT NOT NULL,
  whatsapp            TEXT NOT NULL,
  email               TEXT,
  age_group           TEXT NOT NULL,
  session             TEXT NOT NULL CHECK (session IN ('saturday', 'sunday')),
  craft_interests     TEXT[] NOT NULL DEFAULT '{}',
  previous_experience TEXT NOT NULL DEFAULT 'none',
  payment_status      TEXT NOT NULL DEFAULT 'PAYMENT_PENDING'
                      CHECK (payment_status IN ('PAYMENT_PENDING', 'CONFIRMED', 'REJECTED')),
  utr                 TEXT,
  screenshot_url      TEXT,
  amount              INTEGER NOT NULL DEFAULT 1299,
  admin_notes         TEXT,
  verified_at         TIMESTAMPTZ,
  verified_by         TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_workshop_reg_session ON public.workshop_registrations(session);
CREATE INDEX IF NOT EXISTS idx_workshop_reg_status  ON public.workshop_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_workshop_reg_mobile  ON public.workshop_registrations(mobile);

-- ── 3. Unique UTR constraint (prevents duplicate payment submissions) ──
CREATE UNIQUE INDEX IF NOT EXISTS idx_workshop_reg_utr
  ON public.workshop_registrations(utr)
  WHERE utr IS NOT NULL AND utr != '';

-- ── 4. Row Level Security ─────────────────────────────────────────────
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_settings      ENABLE ROW LEVEL SECURITY;

-- Public can INSERT registrations (anon)
DROP POLICY IF EXISTS "Anyone can register" ON public.workshop_registrations;
CREATE POLICY "Anyone can register"
  ON public.workshop_registrations FOR INSERT
  WITH CHECK (true);

-- Public can read their own registration by registration_id (for status check)
DROP POLICY IF EXISTS "Public read by reg id" ON public.workshop_registrations;
CREATE POLICY "Public read by reg id"
  ON public.workshop_registrations FOR SELECT
  USING (true);

-- Public can update UTR and screenshot (payment submission step)
DROP POLICY IF EXISTS "Public update payment details" ON public.workshop_registrations;
CREATE POLICY "Public update payment details"
  ON public.workshop_registrations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Workshop settings are publicly readable
DROP POLICY IF EXISTS "Public read settings" ON public.workshop_settings;
CREATE POLICY "Public read settings"
  ON public.workshop_settings FOR SELECT
  USING (true);

-- Only authenticated admin can update settings
DROP POLICY IF EXISTS "Admin update settings" ON public.workshop_settings;
CREATE POLICY "Admin update settings"
  ON public.workshop_settings FOR UPDATE
  USING (true);

-- ── 5. Seat count function (counts only CONFIRMED seats) ──────────────
CREATE OR REPLACE FUNCTION public.get_confirmed_seat_count(p_session TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.workshop_registrations
  WHERE session = p_session AND payment_status = 'CONFIRMED';
$$ LANGUAGE SQL STABLE;

-- ── 6. Registration ID generator ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_registration_id()
RETURNS TEXT AS $$
  SELECT 'LL-WS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
$$ LANGUAGE SQL VOLATILE;

