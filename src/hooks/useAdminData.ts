import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// ============= GUARDIANS =============
export function useGuardians() {
  return useQuery({
    queryKey: ['guardians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .order('last_name');
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateGuardian() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (guardian: Tables['guardians']['Insert']) => {
      const { data, error } = await supabase
        .from('guardians')
        .insert(guardian)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
}

export function useUpdateGuardian() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Tables['guardians']['Update'] & { id: string }) => {
      const { data, error } = await supabase
        .from('guardians')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
}

export function useDeleteGuardian() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('guardians')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
}

// ============= STAFF =============
export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_group_assignments(
            group_id,
            is_primary,
            groups(id, name, color)
          )
        `)
        .order('last_name');
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staff: Tables['staff']['Insert']) => {
      const { data, error } = await supabase
        .from('staff')
        .insert(staff)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Tables['staff']['Update'] & { id: string }) => {
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

// ============= CONTRACTS =============
export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          guardians(id, first_name, last_name, email, phone),
          children(id, first_name, last_name, group_id, groups(id, name, color)),
          contract_booking_times(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contract: Tables['contracts']['Insert']) => {
      const { data, error } = await supabase
        .from('contracts')
        .insert(contract)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Tables['contracts']['Update'] & { id: string }) => {
      const { data, error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

// ============= STAFF SHIFTS =============
export function useStaffShifts(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['staff-shifts', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('staff_shifts')
        .select(`
          *,
          staff(id, first_name, last_name, position),
          groups(id, name, color)
        `)
        .order('date');
      
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateStaffShift() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shift: Tables['staff_shifts']['Insert']) => {
      const { data, error } = await supabase
        .from('staff_shifts')
        .insert(shift)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-shifts'] });
    },
  });
}

export function useUpdateStaffShift() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Tables['staff_shifts']['Update'] & { id: string }) => {
      const { data, error } = await supabase
        .from('staff_shifts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-shifts'] });
    },
  });
}

// ============= STAFF LEAVE =============
export function useStaffLeave(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['staff-leave', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('staff_leave')
        .select(`
          *,
          staff(id, first_name, last_name, position)
        `)
        .order('start_date');
      
      if (startDate) query = query.gte('start_date', startDate);
      if (endDate) query = query.lte('end_date', endDate);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateStaffLeave() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leave: Tables['staff_leave']['Insert']) => {
      const { data, error } = await supabase
        .from('staff_leave')
        .insert(leave)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-leave'] });
    },
  });
}

// ============= CHILD BOOKINGS =============
export function useChildBookings(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['child-bookings', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('child_bookings')
        .select(`
          *,
          children(id, first_name, last_name, group_id, groups(id, name, color)),
          contracts(id, contract_number)
        `)
        .order('date');
      
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateChildBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: Tables['child_bookings']['Insert']) => {
      const { data, error } = await supabase
        .from('child_bookings')
        .insert(booking)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child-bookings'] });
    },
  });
}

// ============= CHILDREN WITH FULL DATA =============
export function useChildrenWithContracts() {
  return useQuery({
    queryKey: ['children-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          groups(id, name, color),
          primary_guardian:guardians(id, first_name, last_name, email, phone),
          contracts(
            id,
            contract_number,
            contract_type,
            status,
            start_date,
            end_date,
            monthly_fee,
            guardians(id, first_name, last_name)
          )
        `)
        .order('last_name');
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateChild() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Tables['children']['Update'] & { id: string }) => {
      const { data, error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children-full'] });
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (child: Tables['children']['Insert']) => {
      const { data, error } = await supabase
        .from('children')
        .insert(child)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children-full'] });
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
  });
}

// ============= CONTRACT BOOKING TIMES =============
export function useCreateContractBookingTime() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (time: Tables['contract_booking_times']['Insert']) => {
      const { data, error } = await supabase
        .from('contract_booking_times')
        .insert(time)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useDeleteContractBookingTime() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contract_booking_times')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
