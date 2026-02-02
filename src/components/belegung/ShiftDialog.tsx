import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useStaff, useCreateStaffShift } from '@/hooks/useAdminData';
import { useGroups } from '@/hooks/useDatabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type ShiftType = Database['public']['Enums']['staff_shift_type'];

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  shift?: any;
}

export function ShiftDialog({ open, onOpenChange, selectedDate, shift }: ShiftDialogProps) {
  const [staffId, setStaffId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [shiftType, setShiftType] = useState<ShiftType>('full_day');
  const [breakMinutes, setBreakMinutes] = useState('30');
  const [notes, setNotes] = useState('');

  const { data: staff } = useStaff();
  const { data: groups } = useGroups();
  const createShift = useCreateStaffShift();

  const shiftTypes: { value: ShiftType; label: string }[] = [
    { value: 'morning', label: 'Frühdienst' },
    { value: 'afternoon', label: 'Spätdienst' },
    { value: 'full_day', label: 'Ganztags' },
    { value: 'custom', label: 'Individuell' },
  ];

  useEffect(() => {
    if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (shift) {
      setStaffId(shift.staff_id || '');
      setGroupId(shift.group_id || '');
      setDate(shift.date || '');
      setStartTime(shift.start_time || '08:00');
      setEndTime(shift.end_time || '16:00');
      setShiftType(shift.shift_type || 'full_day');
      setBreakMinutes(shift.break_minutes?.toString() || '30');
      setNotes(shift.notes || '');
    } else {
      resetForm();
    }
  }, [shift, open]);

  useEffect(() => {
    // Auto-set times based on shift type
    if (shiftType === 'morning') {
      setStartTime('07:00');
      setEndTime('13:00');
    } else if (shiftType === 'afternoon') {
      setStartTime('12:00');
      setEndTime('18:00');
    } else if (shiftType === 'full_day') {
      setStartTime('08:00');
      setEndTime('16:30');
    }
  }, [shiftType]);

  const resetForm = () => {
    setStaffId('');
    setGroupId('');
    setStartTime('08:00');
    setEndTime('16:00');
    setShiftType('full_day');
    setBreakMinutes('30');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffId || !date || !startTime || !endTime) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    try {
      await createShift.mutateAsync({
        staff_id: staffId,
        group_id: groupId || null,
        date,
        start_time: startTime,
        end_time: endTime,
        shift_type: shiftType,
        break_minutes: parseInt(breakMinutes) || 0,
        notes: notes || null,
      });

      toast.success('Schicht erfolgreich erstellt');
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating shift:', error);
      toast.error(error.message || 'Fehler beim Erstellen der Schicht');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{shift ? 'Schicht bearbeiten' : 'Neue Schicht'}</DialogTitle>
          <DialogDescription>
            Erstellen Sie eine neue Schicht für einen Mitarbeiter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff">Mitarbeiter *</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Mitarbeiter auswählen" />
              </SelectTrigger>
              <SelectContent>
                {staff?.filter(s => s.is_active).map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                    {member.position && <span className="text-muted-foreground ml-1">({member.position})</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Gruppe</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Gruppe auswählen" />
              </SelectTrigger>
              <SelectContent>
                {groups?.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                      {group.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Datum *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiftType">Schichttyp</Label>
            <Select value={shiftType} onValueChange={(v) => setShiftType(v as ShiftType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {shiftTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Von *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Bis *</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breakMinutes">Pause (Minuten)</Label>
            <Input
              id="breakMinutes"
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(e.target.value)}
              min="0"
              max="120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optionale Notizen..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={createShift.isPending}>
              {createShift.isPending ? 'Speichern...' : 'Speichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
