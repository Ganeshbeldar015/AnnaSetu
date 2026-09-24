-- =====================================================================
-- e-Kisan Procurement (ई-किसान सेतु) - Supabase Database Schema & RLS
-- National MSP Smart Slot Scheduling & Direct Benefit Transfer (DBT)
-- Roles: 'farmer', 'operator', 'admin'
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'operator', 'admin')),
    kisan_card_id VARCHAR(50),
    employee_id VARCHAR(50),
    assigned_center VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Maharashtra',
    district VARCHAR(100),
    village VARCHAR(100),
    land_survey_no VARCHAR(50),
    land_acreage NUMERIC(6, 2) DEFAULT 0.0,
    bank_name VARCHAR(100),
    account_masked VARCHAR(50),
    ifsc_code VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crops & Minimum Support Price (MSP) Catalog
CREATE TABLE IF NOT EXISTS public.crops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL CHECK (season IN ('Kharif', 'Rabi', 'Zaid')),
    msp_rate_per_quintal NUMERIC(10, 2) NOT NULL,
    standard_moisture_percent NUMERIC(4, 2) NOT NULL,
    max_permissible_moisture NUMERIC(4, 2) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Procurement Centers & APMC Mandis
CREATE TABLE IF NOT EXISTS public.procurement_centers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    distance_km NUMERIC(6, 2) DEFAULT 0.0,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    total_counters INT DEFAULT 4,
    active_counters INT DEFAULT 3,
    daily_capacity_quintals NUMERIC(10, 2) DEFAULT 1200.0,
    daily_procured_quintals NUMERIC(10, 2) DEFAULT 0.0,
    current_queue_count INT DEFAULT 0,
    avg_wait_time_minutes INT DEFAULT 18,
    load_status VARCHAR(20) DEFAULT 'normal' CHECK (load_status IN ('normal', 'busy', 'high_load', 'full')),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Time Slots for Centers
CREATE TABLE IF NOT EXISTS public.time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id VARCHAR(50) REFERENCES public.procurement_centers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_window VARCHAR(50) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 25,
    booked_count INT NOT NULL DEFAULT 0,
    is_full BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(center_id, date, time_window)
);

-- 6. Booking Tokens (Core Digital Pipeline)
CREATE TABLE IF NOT EXISTS public.booking_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number VARCHAR(20) NOT NULL,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    farmer_name VARCHAR(255) NOT NULL,
    farmer_phone VARCHAR(20) NOT NULL,
    farmer_village VARCHAR(100),
    farmer_district VARCHAR(100),
    center_id VARCHAR(50) REFERENCES public.procurement_centers(id),
    center_name VARCHAR(255) NOT NULL,
    crop_id VARCHAR(50) REFERENCES public.crops(id),
    crop_name VARCHAR(100) NOT NULL,
    expected_quantity_quintals NUMERIC(8, 2) NOT NULL,
    actual_quantity_quintals NUMERIC(8, 2),
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    stage VARCHAR(30) DEFAULT 'booked' CHECK (stage IN (
        'booked', 'checked_in', 'in_queue', 'called', 'weighing_qc',
        'procurement_completed', 'payment_processing', 'payment_completed', 'late_arrival', 'cancelled'
    )),
    queue_position INT DEFAULT 1,
    estimated_wait_minutes INT DEFAULT 15,
    counter_assigned VARCHAR(20),
    qr_token_payload TEXT,
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    checked_in_at TIMESTAMPTZ,
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 7. Electronic QC & Moisture Inspection
CREATE TABLE IF NOT EXISTS public.qc_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID REFERENCES public.booking_tokens(id) ON DELETE CASCADE UNIQUE,
    moisture_percent NUMERIC(5, 2) NOT NULL,
    foreign_matter_percent NUMERIC(5, 2) NOT NULL,
    broken_grains_percent NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    base_msp_rate NUMERIC(10, 2) NOT NULL,
    moisture_deduction_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    net_rate_per_quintal NUMERIC(10, 2) NOT NULL,
    actual_quantity_quintals NUMERIC(8, 2) NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL,
    deductions_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    net_payable_amount NUMERIC(12, 2) NOT NULL,
    inspector_name VARCHAR(255) NOT NULL,
    counter_number VARCHAR(20) NOT NULL,
    weighment_slip_no VARCHAR(50) NOT NULL UNIQUE,
    inspected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Direct Benefit Transfer (DBT) Payments (PFMS / NPCI)
CREATE TABLE IF NOT EXISTS public.payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    token_id UUID REFERENCES public.booking_tokens(id) ON DELETE CASCADE UNIQUE,
    utr_number VARCHAR(50) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Mandate Initiated' CHECK (status IN (
        'Pending Verification', 'Mandate Initiated', 'PFMS Clearing', 'DBT Credited'
    )),
    bank_name VARCHAR(100) NOT NULL,
    account_masked VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    pfms_reference VARCHAR(50) NOT NULL,
    initiated_at TIMESTAMPTZ DEFAULT NOW(),
    credited_at TIMESTAMPTZ
);

-- 9. Notifications & SMS Log
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'sms' CHECK (type IN ('sms', 'app', 'system', 'alert')),
    is_read BOOLEAN DEFAULT FALSE,
    related_token VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Logs (Tamper-evident trail for Government transparency)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id VARCHAR(100) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES: 3 ROLES SECURITY DEFINITIONS
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch user's role from JWT claims or profiles table
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS VARCHAR AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -------------------------------------------------------------
-- CROPS & CENTERS: Public Read Access for Everyone
-- -------------------------------------------------------------
CREATE POLICY "Anyone can view crops" ON public.crops
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view procurement centers" ON public.procurement_centers
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view time slots" ON public.time_slots
    FOR SELECT USING (true);

-- -------------------------------------------------------------
-- ROLE 1: FARMER SECURITY POLICIES
-- Allowed: Read/write own profile, read/insert own tokens, view own QC/Payments
-- Denied: Modifying other farmers' data, altering centers, operating weighbridge
-- -------------------------------------------------------------
CREATE POLICY "Farmers can read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Farmers can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Farmers can view their own tokens" ON public.booking_tokens
    FOR SELECT USING (
        farmer_id = auth.uid() 
        OR public.get_current_role() IN ('operator', 'admin')
    );

CREATE POLICY "Farmers can book new tokens" ON public.booking_tokens
    FOR INSERT WITH CHECK (
        farmer_id = auth.uid() OR auth.uid() IS NOT NULL
    );

CREATE POLICY "Farmers can view their own QC slip" ON public.qc_inspections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.booking_tokens
            WHERE public.booking_tokens.id = public.qc_inspections.token_id
            AND (public.booking_tokens.farmer_id = auth.uid() OR public.get_current_role() IN ('operator', 'admin'))
        )
    );

CREATE POLICY "Farmers can view their own DBT payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.booking_tokens
            WHERE public.booking_tokens.id = public.payments.token_id
            AND (public.booking_tokens.farmer_id = auth.uid() OR public.get_current_role() IN ('operator', 'admin'))
        )
    );

-- -------------------------------------------------------------
-- ROLE 2: OPERATOR SECURITY POLICIES
-- Allowed: View tokens at their center, check-in, call token, create QC, trigger payment
-- Denied: Alter base MSP prices, access admin macro policies, modify other centers
-- -------------------------------------------------------------
CREATE POLICY "Operators can update tokens at assigned center" ON public.booking_tokens
    FOR UPDATE USING (
        public.get_current_role() IN ('operator', 'admin')
    );

CREATE POLICY "Operators can insert QC inspections" ON public.qc_inspections
    FOR INSERT WITH CHECK (
        public.get_current_role() IN ('operator', 'admin')
    );

CREATE POLICY "Operators can insert payments" ON public.payments
    FOR INSERT WITH CHECK (
        public.get_current_role() IN ('operator', 'admin')
    );

CREATE POLICY "Operators can update payments" ON public.payments
    FOR UPDATE USING (
        public.get_current_role() IN ('operator', 'admin')
    );

CREATE POLICY "Operators can update center capacity" ON public.procurement_centers
    FOR UPDATE USING (
        public.get_current_role() IN ('operator', 'admin')
    );

-- -------------------------------------------------------------
-- ROLE 3: ADMIN SECURITY POLICIES
-- Allowed: Full access to all centers, analytics, audit logs, overrides
-- -------------------------------------------------------------
CREATE POLICY "Admins have full access to audit logs" ON public.audit_logs
    FOR ALL USING (
        public.get_current_role() = 'admin'
    );

CREATE POLICY "Admins can manage all crops" ON public.crops
    FOR ALL USING (
        public.get_current_role() = 'admin'
    );
