import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EventCard } from '@/components/calendar/EventCard';
import { Button } from '@/components/ui/button';
import { useCalendarEvents } from '@/hooks/useDatabase';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: calendarEvents, isLoading } = useCalendarEvents();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month
  const startDay = monthStart.getDay();
  const paddedStart = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start

  const events = calendarEvents || [];
  
  const upcomingEvents = events
    .filter(e => new Date(e.start_date) >= new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5);

  const hasEvent = (date: Date) => {
    return events.some(e => isSameDay(new Date(e.start_date), date));
  };

  // Transform events for EventCard component
  const transformedEvents = upcomingEvents.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description || undefined,
    startDate: e.start_date,
    endDate: e.end_date || undefined,
    allDay: e.all_day ?? true,
    type: e.type,
    groupIds: [],
  }));

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Kalender"
        subtitle={format(currentMonth, 'MMMM yyyy', { locale: de })}
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Plus size={22} />
          </Button>
        }
      />

      <div className="p-4 space-y-6 pb-24">
        {/* Mini Calendar */}
        <section className="bg-card rounded-xl p-4 shadow-sm border border-border">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <h3 className="font-semibold text-foreground">
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </h3>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for padding */}
            {Array.from({ length: paddedStart }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            
            {days.map(day => {
              const hasEventOnDay = hasEvent(day);
              const isCurrentDay = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors',
                    isCurrentDay && 'bg-primary text-primary-foreground font-semibold',
                    !isCurrentDay && isSameMonth(day, currentMonth) && 'text-foreground hover:bg-secondary',
                    !isSameMonth(day, currentMonth) && 'text-muted-foreground/50'
                  )}
                >
                  {format(day, 'd')}
                  {hasEventOnDay && (
                    <span className={cn(
                      'w-1 h-1 rounded-full mt-0.5',
                      isCurrentDay ? 'bg-primary-foreground' : 'bg-primary'
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Anstehende Termine
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : transformedEvents.length > 0 ? (
            <div className="space-y-2">
              {transformedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">Keine anstehenden Termine.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
