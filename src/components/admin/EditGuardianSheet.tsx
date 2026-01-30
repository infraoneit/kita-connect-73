import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateGuardian } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditGuardianSheetProps {
  guardian: any;
  onClose: () => void;
}

export function EditGuardianSheet({ guardian, onClose }: EditGuardianSheetProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    phone_secondary: '',
    address_street: '',
    address_city: '',
    address_zip: '',
    notes: '',
  });

  const updateGuardian = useUpdateGuardian();

  useEffect(() => {
    if (guardian) {
      setFormData({
        first_name: guardian.first_name || '',
        last_name: guardian.last_name || '',
        email: guardian.email || '',
        phone: guardian.phone || '',
        phone_secondary: guardian.phone_secondary || '',
        address_street: guardian.address_street || '',
        address_city: guardian.address_city || '',
        address_zip: guardian.address_zip || '',
        notes: guardian.notes || '',
      });
    }
  }, [guardian]);

  const handleSave = async () => {
    try {
      await updateGuardian.mutateAsync({
        id: guardian.id,
        ...formData,
      });
      toast.success('Elternteil aktualisiert');
      onClose();
    } catch (error) {
      toast.error('Fehler beim Speichern');
    }
  };

  return (
    <Sheet open={!!guardian} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Elternteil bearbeiten</SheetTitle>
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
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon (Haupt)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_secondary">Telefon (Alternativ)</Label>
              <Input
                id="phone_secondary"
                type="tel"
                value={formData.phone_secondary}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_secondary: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_street">Straße & Hausnummer</Label>
            <Input
              id="address_street"
              value={formData.address_street}
              onChange={(e) => setFormData(prev => ({ ...prev, address_street: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="address_zip">PLZ</Label>
              <Input
                id="address_zip"
                value={formData.address_zip}
                onChange={(e) => setFormData(prev => ({ ...prev, address_zip: e.target.value }))}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="address_city">Stadt</Label>
              <Input
                id="address_city"
                value={formData.address_city}
                onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="pt-4 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Abbrechen
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSave}
              disabled={updateGuardian.isPending}
            >
              {updateGuardian.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Speichern
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
