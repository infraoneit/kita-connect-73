import { Card } from '@/components/ui/card';
import { CalendarEvent } from '@/types/kita';
import { Calendar, XCircle, Users, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

const eventTypeConfig = {
  event: {
    icon: Calendar,
    bgClass: 'bg-primary-light',
    iconClass: 'text-primary',
    borderClass: 'border-l-primary',
  },
  closure: {
    icon: XCircle,
    bgClass: 'bg-destructive-light',
    iconClass: 'text-destructive',
    borderClass: 'border-l-destructive',
  },
  meeting: {
    icon: Users,
    bgClass: 'bg-accent-light',
    iconClass: 'text-accent',
    borderClass: 'border-l-accent',
  },
  reminder: {
    icon: Bell,
    bgClass: 'bg-warning-light',
    iconClass: 'text-warning-foreground',
    borderClass: 'border-l-warning',
  },
};

export function EventCard({ event, onClick }: EventCardProps) {
  const config = eventTypeConfig[event.type];
  const Icon = config.icon;

  const dateStr = format(new Date(event.startDate), 'dd. MMMM', { locale: de });
  const timeStr = event.allDay
    ? 'Ganztägig'
    : format(new Date(event.startDate), 'HH:mm', { locale: de }) + ' Uhr';

  return (
    <Card
      className={cn(
        'p-4 card-interactive cursor-pointer border-l-4',
        config.borderClass
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg shrink-0', config.bgClass)}>
          <Icon size={20} className={config.iconClass} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground">{event.title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {dateStr} • {timeStr}
          </p>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
