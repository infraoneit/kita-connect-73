import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { children, currentUser, groups } from '@/data/mockData';
import { AbsenceType, Child } from '@/types/kita';
import { ThermometerSun, Palmtree, Clock, Calendar, HelpCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const absenceTypes: { type: AbsenceType; icon: React.ElementType; label: string; description: string }[] = [
  { type: 'sick', icon: ThermometerSun, label: 'Krank', description: 'Mit Fieber, Erkältung, etc.' },
  { type: 'vacation', icon: Palmtree, label: 'Urlaub', description: 'Geplante Abwesenheit' },
  { type: 'late', icon: Clock, label: 'Später', description: 'Kommt später als gewöhnlich' },
  { type: 'early_pickup', icon: Calendar, label: 'Früher abholen', description: 'Wird früher abgeholt' },
  { type: 'other', icon: HelpCircle, label: 'Sonstiges', description: 'Anderer Grund' },
];

export default function AbsencePage() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedType, setSelectedType] = useState<AbsenceType | null>(null);
  const [note, setNote] = useState('');
  
  const userGroup = groups.find(g => g.id === currentUser.groupIds[0]);
  const groupChildren = children.filter(c => c.groupId === userGroup?.id);

  const handleSubmit = () => {
    if (!selectedChild || !selectedType) return;
    
    toast.success(`Abwesenheit für ${selectedChild.firstName} gemeldet`, {
      description: absenceTypes.find(t => t.type === selectedType)?.label,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Abwesenheit melden"
        showBack
      />

      <div className="p-4 space-y-6">
        {/* Step 1: Select Child */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            1. Kind auswählen
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {groupChildren.map((child) => (
              <Card
                key={child.id}
                className={cn(
                  'p-3 cursor-pointer transition-all',
                  selectedChild?.id === child.id
                    ? 'border-2 border-primary bg-primary-light'
                    : 'border-2 border-transparent hover:border-border'
                )}
                onClick={() => setSelectedChild(child)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {child.firstName[0]}{child.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {child.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {child.lastName}
                    </p>
                  </div>
                  {selectedChild?.id === child.id && (
                    <Check size={18} className="text-primary shrink-0" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Step 2: Select Type */}
        {selectedChild && (
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
        {selectedChild && selectedType && (
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
        {selectedChild && selectedType && (
          <Button
            size="lg"
            className="w-full animate-slide-up"
            onClick={handleSubmit}
          >
            Abwesenheit melden
          </Button>
        )}
      </div>
    </div>
  );
}
