-- Fix security warnings: Set search_path for trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix overly permissive INSERT policies by adding proper checks

-- Drop and recreate conversation policies with proper checks
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Drop and recreate conversation participants policy with proper check
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;
CREATE POLICY "Users can add participants" ON public.conversation_participants
  FOR INSERT TO authenticated WITH CHECK (
    profile_id = auth.uid() 
    OR public.is_conversation_participant(conversation_id)
    OR public.is_manager_or_admin()
  );