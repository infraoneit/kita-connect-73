import { CalendarOff, MessageCircle, Camera, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: CalendarOff,
      label: 'Abwesenheit',
      description: 'Melden',
      onClick: () => navigate('/absence'),
      color: 'text-destructive',
    },
    {
      icon: MessageCircle,
      label: 'Nachricht',
      description: 'Senden',
      onClick: () => navigate('/chat'),
      color: 'text-primary',
    },
    {
      icon: Camera,
      label: 'Foto',
      description: 'Teilen',
      onClick: () => navigate('/diary'),
      color: 'text-accent',
    },
    {
      icon: ClipboardList,
      label: 'Tagebuch',
      description: 'Eintrag',
      onClick: () => navigate('/diary'),
      color: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            variant="quickAction"
            onClick={action.onClick}
            className="flex flex-col items-center"
          >
            <Icon size={24} className={action.color} />
            <span className="text-xs font-medium text-foreground">{action.label}</span>
            <span className="text-[10px] text-muted-foreground">{action.description}</span>
          </Button>
        );
      })}
    </div>
  );
}
