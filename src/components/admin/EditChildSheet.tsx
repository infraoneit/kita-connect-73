import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateChild } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface EditChildSheetProps {
  child: any;
  onClose: () => void;
  groups: any[];
}

export function EditChildSheet({ child, onClose, groups }: EditChildSheetProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    group_id: '',
    photo_permission: true,
    allergies: [] as string[],
  });
  const [allergiesText, setAllergiesText] = useState('');

  const updateChild = useUpdateChild();

  useEffect(() => {
    if (child) {
      setFormData({
        first_name: child.first_name || '',
        last_name: child.last_name || '',
        birth_date: child.birth_date || '',
        group_id: child.group_id || '',
        photo_permission: child.photo_permission ?? true,
        allergies: child.allergies || [],
      });
      setAllergiesText((child.allergies || []).join(', '));
    }
  }, [child]);

  const handleSave = async () => {
    try {
      await updateChild.mutateAsync({
        id: child.id,
        ...formData,
        allergies: allergiesText.split(',').map(a => a.trim()).filter(Boolean),
      });
      toast.success('Kind aktualisiert');
      onClose();
    } catch (error) {
      toast.error('Fehler beim Speichern');
    }
  };

  return (
    <Sheet open={!!child} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Kind bearbeiten</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Geburtsdatum</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Gruppe</Label>
            <Select 
              value={formData.group_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, group_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Gruppe wählen" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: group.color }}
                      />
                      {group.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergien (kommagetrennt)</Label>
            <Textarea
              id="allergies"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="z.B. Nüsse, Milch, Gluten"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="photo_permission">Foto-Erlaubnis</Label>
            <Switch
              id="photo_permission"
              checked={formData.photo_permission}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, photo_permission: checked }))}
            />
          </div>

          <div className="pt-4 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Abbrechen
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSave}
              disabled={updateChild.isPending}
            >
              {updateChild.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Speichern
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
