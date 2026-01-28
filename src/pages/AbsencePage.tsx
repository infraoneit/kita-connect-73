import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChildren, useCreateAbsence } from '@/hooks/useDatabase';
import { ThermometerSun, Palmtree, Clock, Calendar, HelpCircle, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/integrations/supabase/types';

type AbsenceType = Database['public']['Enums']['absence_type'];

const absenceTypes: { type: AbsenceType; icon: React.ElementType; label: string; description: string }[] = [
  { type: 'sick', icon: ThermometerSun, label: 'Krank', description: 'Mit Fieber, Erkältung, etc.' },
  { type: 'vacation', icon: Palmtree, label: 'Urlaub', description: 'Geplante Abwesenheit' },
  { type: 'late', icon: Clock, label: 'Später', description: 'Kommt später als gewöhnlich' },
  { type: 'early_pickup', icon: Calendar, label: 'Früher abholen', description: 'Wird früher abgeholt' },
  { type: 'other', icon: HelpCircle, label: 'Sonstiges', description: 'Anderer Grund' },
];

export default function AbsencePage() {
  const navigate = useNavigate();
  const { data: children, isLoading } = useChildren();
  const createAbsence = useCreateAbsence();
  
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<AbsenceType | null>(null);
  const [note, setNote] = useState('');

  const selectedChild = children?.find(c => c.id === selectedChildId);

  const handleSubmit = async () => {
    if (!selectedChildId || !selectedType) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await createAbsence.mutateAsync({
        child_id: selectedChildId,
        type: selectedType,
        start_date: today,
        end_date: today,
        note: note || undefined,
      });
      
      toast.success(`Abwesenheit für ${selectedChild?.first_name} gemeldet`, {
        description: absenceTypes.find(t => t.type === selectedType)?.label,
      });
      navigate('/');
    } catch (error) {
      toast.error('Fehler beim Speichern', {
        description: 'Bitte versuchen Sie es erneut.',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Abwesenheit melden"
        showBack
      />

      <div className="p-4 space-y-6 pb-24">
        {/* Step 1: Select Child */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            1. Kind auswählen
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : children && children.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {children.map((child) => (
                <Card
                  key={child.id}
                  className={cn(
                    'p-3 cursor-pointer transition-all',
                    selectedChildId === child.id
                      ? 'border-2 border-primary bg-primary-light'
                      : 'border-2 border-transparent hover:border-border'
                  )}
                  onClick={() => setSelectedChildId(child.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {child.first_name[0]}{child.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {child.first_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {child.last_name}
                      </p>
                    </div>
                    {selectedChildId === child.id && (
                      <Check size={18} className="text-primary shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">Keine Kinder gefunden.</p>
            </div>
          )}
        </section>

        {/* Step 2: Select Type */}
        {selectedChildId && (
          <section className="animate-fade-in">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              2. Grund auswählen
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {absenceTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedType === item.type;
                
                return (
                  <Button
                    key={item.type}
                    variant={isSelected ? 'absenceTypeActive' : 'absenceType'}
                    onClick={() => setSelectedType(item.type)}
                    className="h-auto"
                  >
                    <Icon size={24} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                    <span className={cn(
                      'font-medium',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}>
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      {item.description}
                    </span>
                  </Button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 3: Optional Note */}
        {selectedChildId && selectedType && (
          <section className="animate-fade-in">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              3. Notiz (optional)
            </h2>
            <Textarea
              placeholder="z.B. Fieber seit gestern, voraussichtlich 3 Tage..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </section>
        )}

        {/* Submit Button */}
        {selectedChildId && selectedType && (
          <Button
            size="lg"
            className="w-full animate-slide-up"
            onClick={handleSubmit}
            disabled={createAbsence.isPending}
          >
            {createAbsence.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              'Abwesenheit melden'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
