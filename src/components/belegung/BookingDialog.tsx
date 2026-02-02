import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useChildrenWithContracts, useCreateChildBooking } from '@/hooks/useAdminData';
import { useGroups } from '@/hooks/useDatabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  booking?: any;
}

export function BookingDialog({ open, onOpenChange, selectedDate, booking }: BookingDialogProps) {
  const [childId, setChildId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [isExtra, setIsExtra] = useState(false);
  const [notes, setNotes] = useState('');

  const { data: children } = useChildrenWithContracts();
  const { data: groups } = useGroups();
  const createBooking = useCreateChildBooking();

  useEffect(() => {
    if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (booking) {
      setChildId(booking.child_id || '');
      setGroupId(booking.group_id || '');
      setDate(booking.date || '');
      setStartTime(booking.start_time || '08:00');
      setEndTime(booking.end_time || '16:00');
      setIsExtra(booking.is_extra || false);
      setNotes(booking.notes || '');
    } else {
      resetForm();
    }
  }, [booking, open]);

  const resetForm = () => {
    setChildId('');
    setGroupId('');
    setStartTime('08:00');
    setEndTime('16:00');
    setIsExtra(false);
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!childId || !date || !startTime || !endTime) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    try {
      await createBooking.mutateAsync({
        child_id: childId,
        group_id: groupId || null,
        date,
        start_time: startTime,
        end_time: endTime,
        is_extra: isExtra,
        notes: notes || null,
      });

      toast.success('Buchung erfolgreich erstellt');
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Fehler beim Erstellen der Buchung');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{booking ? 'Buchung bearbeiten' : 'Neue Buchung'}</DialogTitle>
          <DialogDescription>
            Erstellen Sie eine neue Buchung für ein Kind.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child">Kind *</Label>
            <Select value={childId} onValueChange={setChildId}>
              <SelectTrigger>
                <SelectValue placeholder="Kind auswählen" />
              </SelectTrigger>
              <SelectContent>
                {children?.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.first_name} {child.last_name}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isExtra"
              checked={isExtra}
              onCheckedChange={(checked) => setIsExtra(checked as boolean)}
            />
            <Label htmlFor="isExtra" className="font-normal">
              Zusatzbuchung (außerhalb des Vertrags)
            </Label>
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
            <Button type="submit" disabled={createBooking.isPending}>
              {createBooking.isPending ? 'Speichern...' : 'Speichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
