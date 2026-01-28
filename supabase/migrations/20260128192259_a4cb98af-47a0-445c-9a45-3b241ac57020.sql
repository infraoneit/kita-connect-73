-- ============================================
-- KITA-APP DATABASE SCHEMA
-- ============================================

-- 1. ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('parent', 'educator', 'manager', 'admin');
CREATE TYPE public.absence_type AS ENUM ('sick', 'vacation', 'late', 'early_pickup', 'other');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'not_arrived');
CREATE TYPE public.event_type AS ENUM ('event', 'closure', 'meeting', 'reminder');

-- 2. USER ROLES TABLE (CRITICAL - separate from profiles)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'parent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. GROUPS TABLE
-- ============================================
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#4A9D8E',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- 5. CHILDREN TABLE
-- ============================================
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  photo_permission BOOLEAN DEFAULT true,
  allergies TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- 6. CHILD GUARDIANS (links children to parents/contacts)
-- ============================================
CREATE TABLE public.child_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  guardian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'Elternteil',
  is_emergency_contact BOOLEAN DEFAULT false,
  can_pickup BOOLEAN DEFAULT true,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, guardian_id)
);

ALTER TABLE public.child_guardians ENABLE ROW LEVEL SECURITY;

-- 7. GROUP EDUCATORS (links educators to groups)
-- ============================================
CREATE TABLE public.group_educators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  educator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, educator_id)
);

ALTER TABLE public.group_educators ENABLE ROW LEVEL SECURITY;

-- 8. ABSENCES TABLE
-- ============================================
CREATE TABLE public.absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  type absence_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  note TEXT,
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- 9. ATTENDANCE TABLE
-- ============================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status NOT NULL DEFAULT 'not_arrived',
  check_in_time TIME,
  check_out_time TIME,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 10. ANNOUNCEMENTS (Pinnwand)
-- ============================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  important BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 11. ANNOUNCEMENT GROUPS (which groups see which announcements)
-- ============================================
CREATE TABLE public.announcement_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (announcement_id, group_id)
);

ALTER TABLE public.announcement_groups ENABLE ROW LEVEL SECURITY;

-- 12. DOCUMENTS (attachments)
-- ============================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'document',
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 13. DIARY ENTRIES (Gruppentagebuch)
-- ============================================
CREATE TABLE public.diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- 14. CALENDAR EVENTS
-- ============================================
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT true,
  type event_type NOT NULL DEFAULT 'event',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 15. EVENT GROUPS (which groups see which events)
-- ============================================
CREATE TABLE public.event_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (event_id, group_id)
);

ALTER TABLE public.event_groups ENABLE ROW LEVEL SECURITY;

-- 16. CONVERSATIONS
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'direct',
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 17. CONVERSATION PARTICIPANTS
-- ============================================
CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, profile_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- 18. MESSAGES
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user is manager or admin
CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('manager', 'admin')
  )
$$;

-- Check if user is parent of a child
CREATE OR REPLACE FUNCTION public.is_parent_of_child(_child_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.child_guardians
    WHERE child_id = _child_id
      AND guardian_id = auth.uid()
  )
$$;

-- Check if user is educator of a group
CREATE OR REPLACE FUNCTION public.is_educator_of_group(_group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_educators
    WHERE group_id = _group_id
      AND educator_id = auth.uid()
  ) OR public.is_manager_or_admin()
$$;

-- Check if user can access child data
CREATE OR REPLACE FUNCTION public.can_access_child(_child_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    public.is_parent_of_child(_child_id) 
    OR EXISTS (
      SELECT 1 
      FROM public.children c
      JOIN public.group_educators ge ON ge.group_id = c.group_id
      WHERE c.id = _child_id AND ge.educator_id = auth.uid()
    )
    OR public.is_manager_or_admin()
$$;

-- Check if user is participant in conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = _conversation_id
      AND profile_id = auth.uid()
  ) OR public.is_manager_or_admin()
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- USER ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.is_manager_or_admin());

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_manager_or_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- GROUPS
CREATE POLICY "Authenticated users can view groups" ON public.groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage groups" ON public.groups
  FOR ALL USING (public.is_manager_or_admin());

-- CHILDREN
CREATE POLICY "Users can view accessible children" ON public.children
  FOR SELECT USING (public.can_access_child(id));

CREATE POLICY "Parents can update own children" ON public.children
  FOR UPDATE USING (public.is_parent_of_child(id) OR public.is_manager_or_admin());

CREATE POLICY "Managers can insert children" ON public.children
  FOR INSERT WITH CHECK (public.is_manager_or_admin());

-- CHILD GUARDIANS
CREATE POLICY "Users can view guardians for accessible children" ON public.child_guardians
  FOR SELECT USING (public.can_access_child(child_id));

CREATE POLICY "Managers can manage guardians" ON public.child_guardians
  FOR ALL USING (public.is_manager_or_admin());

-- GROUP EDUCATORS
CREATE POLICY "Authenticated can view group educators" ON public.group_educators
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage educators" ON public.group_educators
  FOR ALL USING (public.is_manager_or_admin());

-- ABSENCES
CREATE POLICY "Users can view absences for accessible children" ON public.absences
  FOR SELECT USING (public.can_access_child(child_id));

CREATE POLICY "Users can create absences for accessible children" ON public.absences
  FOR INSERT WITH CHECK (public.can_access_child(child_id));

CREATE POLICY "Users can update absences for accessible children" ON public.absences
  FOR UPDATE USING (public.can_access_child(child_id));

-- ATTENDANCE
CREATE POLICY "Users can view attendance for accessible children" ON public.attendance
  FOR SELECT USING (public.can_access_child(child_id));

CREATE POLICY "Educators can manage attendance" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.group_educators ge ON ge.group_id = c.group_id
      WHERE c.id = child_id AND ge.educator_id = auth.uid()
    ) OR public.is_manager_or_admin()
  );

-- ANNOUNCEMENTS
CREATE POLICY "Authenticated can view published announcements" ON public.announcements
  FOR SELECT TO authenticated USING (published_at IS NOT NULL OR public.is_manager_or_admin());

CREATE POLICY "Managers can manage announcements" ON public.announcements
  FOR ALL USING (public.is_manager_or_admin());

-- ANNOUNCEMENT GROUPS
CREATE POLICY "Authenticated can view announcement groups" ON public.announcement_groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage announcement groups" ON public.announcement_groups
  FOR ALL USING (public.is_manager_or_admin());

-- DOCUMENTS
CREATE POLICY "Authenticated can view documents" ON public.documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage documents" ON public.documents
  FOR ALL USING (public.is_manager_or_admin());

-- DIARY ENTRIES
CREATE POLICY "Users can view diary entries for accessible groups" ON public.diary_entries
  FOR SELECT USING (
    public.is_educator_of_group(group_id)
    OR EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.child_guardians cg ON cg.child_id = c.id
      WHERE c.group_id = diary_entries.group_id AND cg.guardian_id = auth.uid()
    )
    OR public.is_manager_or_admin()
  );

CREATE POLICY "Educators can create diary entries" ON public.diary_entries
  FOR INSERT WITH CHECK (public.is_educator_of_group(group_id));

CREATE POLICY "Educators can update own diary entries" ON public.diary_entries
  FOR UPDATE USING (public.is_educator_of_group(group_id));

-- CALENDAR EVENTS
CREATE POLICY "Authenticated can view calendar events" ON public.calendar_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage calendar events" ON public.calendar_events
  FOR ALL USING (public.is_manager_or_admin());

-- EVENT GROUPS
CREATE POLICY "Authenticated can view event groups" ON public.event_groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage event groups" ON public.event_groups
  FOR ALL USING (public.is_manager_or_admin());

-- CONVERSATIONS
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = conversations.id AND profile_id = auth.uid()
    ) OR public.is_manager_or_admin()
  );

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (true);

-- CONVERSATION PARTICIPANTS
CREATE POLICY "Users can view participants of own conversations" ON public.conversation_participants
  FOR SELECT USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "Users can add participants" ON public.conversation_participants
  FOR INSERT TO authenticated WITH CHECK (true);

-- MESSAGES
CREATE POLICY "Users can view messages in own conversations" ON public.messages
  FOR SELECT USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "Users can send messages to own conversations" ON public.messages
  FOR INSERT WITH CHECK (public.is_conversation_participant(conversation_id) AND sender_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Neuer'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Benutzer'),
    NEW.email
  );
  
  -- Default role is parent
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'parent');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();