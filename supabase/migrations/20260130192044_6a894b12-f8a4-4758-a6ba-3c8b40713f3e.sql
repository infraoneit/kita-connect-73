-- =====================================================
-- KITA ADMIN SYSTEM - COMPLETE DATABASE RESTRUCTURE
-- =====================================================

-- 1. Create new enums for contracts and staff management
CREATE TYPE public.contract_type AS ENUM ('flexible', 'halbtags', 'ganztags', 'stundenweise');
CREATE TYPE public.contract_status AS ENUM ('active', 'pending', 'terminated', 'expired');
CREATE TYPE public.staff_shift_type AS ENUM ('morning', 'afternoon', 'full_day', 'custom');
CREATE TYPE public.leave_type AS ENUM ('vacation', 'sick', 'training', 'other');
CREATE TYPE public.weekday AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday');

-- 2. Create guardians table (formerly parents - now standalone)
CREATE TABLE IF NOT EXISTS public.guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  phone_secondary TEXT,
  address_street TEXT,
  address_city TEXT,
  address_zip TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS - only admins can access
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage guardians" ON public.guardians
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 3. Create staff/personnel table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT, -- e.g., 'Erzieher', 'Leitung', 'Praktikant'
  employment_start DATE,
  employment_end DATE,
  weekly_hours DECIMAL(4,1),
  hourly_rate DECIMAL(8,2),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage staff" ON public.staff
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 4. Staff group assignments
CREATE TABLE IF NOT EXISTS public.staff_group_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(staff_id, group_id)
);

ALTER TABLE public.staff_group_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage staff assignments" ON public.staff_group_assignments
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 5. Create contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE,
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  contract_type contract_type NOT NULL DEFAULT 'flexible',
  status contract_status NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  termination_notice_period INTEGER DEFAULT 30, -- days
  monthly_fee DECIMAL(8,2),
  meal_fee DECIMAL(8,2),
  additional_fees DECIMAL(8,2),
  subsidy_amount DECIMAL(8,2),
  discount_percent DECIMAL(4,2),
  special_agreements TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contracts" ON public.contracts
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 6. Contract booking times (which days/hours per contract)
CREATE TABLE IF NOT EXISTS public.contract_booking_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  weekday weekday NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contract_id, weekday)
);

ALTER TABLE public.contract_booking_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage booking times" ON public.contract_booking_times
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 7. Staff shifts/schedules
CREATE TABLE IF NOT EXISTS public.staff_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift_type staff_shift_type NOT NULL DEFAULT 'full_day',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_minutes INTEGER DEFAULT 0,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(staff_id, date)
);

ALTER TABLE public.staff_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage shifts" ON public.staff_shifts
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 8. Staff leave/absence
CREATE TABLE IF NOT EXISTS public.staff_leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_leave ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage leave" ON public.staff_leave
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 9. Child bookings (actual attendance schedule based on contract)
CREATE TABLE IF NOT EXISTS public.child_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  is_extra BOOLEAN DEFAULT false, -- booking outside contract
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_id, date)
);

ALTER TABLE public.child_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage bookings" ON public.child_bookings
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 10. Add guardian_id to children table for primary contact
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS primary_guardian_id UUID REFERENCES public.guardians(id) ON DELETE SET NULL;

-- 11. Update triggers for updated_at
CREATE TRIGGER update_guardians_updated_at
  BEFORE UPDATE ON public.guardians
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_shifts_updated_at
  BEFORE UPDATE ON public.staff_shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_leave_updated_at
  BEFORE UPDATE ON public.staff_leave
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Generate contract numbers automatically
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.contract_number IS NULL THEN
    NEW.contract_number := 'V-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('contract_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE SEQUENCE IF NOT EXISTS public.contract_number_seq START 1;

CREATE TRIGGER generate_contract_number_trigger
  BEFORE INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_contract_number();