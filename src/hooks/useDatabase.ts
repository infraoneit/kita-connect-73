import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// Profile hooks
export function useProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useUserRoles() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      if (error) throw error;
      return data?.map(r => r.role) ?? [];
    },
    enabled: !!user?.id,
  });
}

// Groups hooks
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

// Children hooks
export function useChildren() {
  return useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          groups(id, name, color)
        `)
        .order('first_name');
      if (error) throw error;
      return data;
    },
  });
}

// Announcements (Pinnwand) hooks
export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          documents(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Calendar Events hooks
export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date');
      if (error) throw error;
      return data;
    },
  });
}

// Diary Entries hooks
export function useDiaryEntries(groupId?: string) {
  return useQuery({
    queryKey: ['diary-entries', groupId],
    queryFn: async () => {
      let query = supabase
        .from('diary_entries')
        .select('*')
        .order('date', { ascending: false });
      
      if (groupId) {
        query = query.eq('group_id', groupId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Absences hooks
export function useAbsences() {
  return useQuery({
    queryKey: ['absences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('absences')
        .select(`
          *,
          children(id, first_name, last_name)
        `)
        .order('start_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAbsence() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (absence: {
      child_id: string;
      type: Tables['absences']['Insert']['type'];
      start_date: string;
      end_date: string;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from('absences')
        .insert({
          ...absence,
          reported_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// Attendance hooks
export function useAttendance(date?: string) {
  const today = date || new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['attendance', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          children(id, first_name, last_name, allergies, groups(id, name, color))
        `)
        .eq('date', today);
      if (error) throw error;
      return data;
    },
  });
}

// Conversations hooks
export function useConversations() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants(
            profile_id,
            unread_count,
            profiles(id, first_name, last_name)
          ),
          messages(
            id,
            content,
            created_at,
            sender_id,
            read
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id(id, first_name, last_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          content,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
