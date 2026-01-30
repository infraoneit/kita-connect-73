import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChildBookings, useStaffShifts } from '@/hooks/useAdminData';
import { useGroups } from '@/hooks/useDatabase';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addWeeks, subWeeks, addMonths, subMonths, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Baby, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type ViewMode = 'day' | 'week' | 'month';
type DisplayMode = 'children' | 'staff';

export default function BelegungPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('children');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const { data: groups } = useGroups();

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    if (viewMode === 'day') {
      return { start: currentDate, end: currentDate };
    } else if (viewMode === 'week') {
      return { 
        start: startOfWeek(currentDate, { weekStartsOn: 1 }), 
        end: endOfWeek(currentDate, { weekStartsOn: 1 }) 
      };
    } else {
      return { 
        start: startOfMonth(currentDate), 
        end: endOfMonth(currentDate) 
      };
    }
  }, [currentDate, viewMode]);

  const startDate = format(dateRange.start, 'yyyy-MM-dd');
  const endDate = format(dateRange.end, 'yyyy-MM-dd');

  const { data: childBookings, isLoading: loadingBookings } = useChildBookings(startDate, endDate);
  const { data: staffShifts, isLoading: loadingShifts } = useStaffShifts(startDate, endDate);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  }, [dateRange]);

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setCurrentDate(prev => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return childBookings?.filter(b => b.date === dateStr && 
      (selectedGroup === 'all' || b.group_id === selectedGroup || b.children?.group_id === selectedGroup)
    ) || [];
  };

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return staffShifts?.filter(s => s.date === dateStr &&
      (selectedGroup === 'all' || s.group_id === selectedGroup)
    ) || [];
  };

  const isLoading = displayMode === 'children' ? loadingBookings : loadingShifts;

  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Belegungsplan"
        subtitle={
          viewMode === 'day' 
            ? format(currentDate, 'EEEE, d. MMMM yyyy', { locale: de })
            : viewMode === 'week'
            ? `KW ${format(currentDate, 'w', { locale: de })} • ${format(dateRange.start, 'dd.MM.')} - ${format(dateRange.end, 'dd.MM.yyyy')}`
            : format(currentDate, 'MMMM yyyy', { locale: de })
        }
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Plus size={20} />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Display Mode Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={displayMode === 'children' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none gap-1"
              onClick={() => setDisplayMode('children')}
            >
              <Baby size={14} />
              Kinder
            </Button>
            <Button
              variant={displayMode === 'staff' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none gap-1"
              onClick={() => setDisplayMode('staff')}
            >
              <UserCog size={14} />
              Personal
            </Button>
          </div>

          {/* Group Filter */}
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Gruppe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Gruppen</SelectItem>
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

        {/* View Mode & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="iconSm" onClick={() => navigate('prev')}>
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
              Heute
            </Button>
            <Button variant="ghost" size="iconSm" onClick={() => navigate('next')}>
              <ChevronRight size={20} />
            </Button>
          </div>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="day" className="text-xs px-2">Tag</TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-2">Woche</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">Monat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar View */}
        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : viewMode === 'day' ? (
          // Day View - Timeline
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {timeSlots.map(time => {
                  const bookings = displayMode === 'children' 
                    ? getBookingsForDay(currentDate).filter(b => {
                        const startHour = parseInt(b.start_time?.split(':')[0] || '0');
                        const slotHour = parseInt(time.split(':')[0]);
                        const endHour = parseInt(b.end_time?.split(':')[0] || '0');
                        return slotHour >= startHour && slotHour < endHour;
                      })
                    : getShiftsForDay(currentDate).filter(s => {
                        const startHour = parseInt(s.start_time?.split(':')[0] || '0');
                        const slotHour = parseInt(time.split(':')[0]);
                        const endHour = parseInt(s.end_time?.split(':')[0] || '0');
                        return slotHour >= startHour && slotHour < endHour;
                      });
                  
                  return (
                    <div key={time} className="flex">
                      <div className="w-16 py-3 px-2 text-xs text-muted-foreground border-r border-border">
                        {time}
                      </div>
                      <div className="flex-1 py-2 px-2 min-h-[48px] flex flex-wrap gap-1">
                        {displayMode === 'children' ? (
                          bookings.map((b: any) => (
                            <span 
                              key={b.id} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: b.children?.groups?.color || '#4A9D8E' }}
                            >
                              {b.children?.first_name} {b.children?.last_name?.[0]}.
                            </span>
                          ))
                        ) : (
                          bookings.map((s: any) => (
                            <span 
                              key={s.id} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: s.groups?.color || '#E88D4E' }}
                            >
                              {s.staff?.first_name} {s.staff?.last_name?.[0]}.
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'week' ? (
          // Week View - Grid
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Header */}
                <div className="grid grid-cols-6 border-b border-border">
                  <div className="p-2 text-xs text-muted-foreground border-r border-border">Zeit</div>
                  {days.slice(0, 5).map(day => (
                    <div 
                      key={day.toISOString()} 
                      className={cn(
                        "p-2 text-center border-r border-border last:border-r-0",
                        isToday(day) && "bg-primary/10"
                      )}
                    >
                      <p className="text-xs text-muted-foreground">{format(day, 'EEE', { locale: de })}</p>
                      <p className={cn(
                        "text-sm font-medium",
                        isToday(day) && "text-primary"
                      )}>{format(day, 'd')}</p>
                    </div>
                  ))}
                </div>
                {/* Time slots */}
                {timeSlots.slice(0, 6).map(time => (
                  <div key={time} className="grid grid-cols-6 border-b border-border last:border-b-0">
                    <div className="p-2 text-xs text-muted-foreground border-r border-border">{time}</div>
                    {days.slice(0, 5).map(day => {
                      const dayBookings = displayMode === 'children'
                        ? getBookingsForDay(day).filter(b => {
                            const startHour = parseInt(b.start_time?.split(':')[0] || '0');
                            const slotHour = parseInt(time.split(':')[0]);
                            return slotHour === startHour;
                          })
                        : getShiftsForDay(day).filter(s => {
                            const startHour = parseInt(s.start_time?.split(':')[0] || '0');
                            const slotHour = parseInt(time.split(':')[0]);
                            return slotHour === startHour;
                          });
                      
                      return (
                        <div 
                          key={day.toISOString()} 
                          className={cn(
                            "p-1 min-h-[40px] border-r border-border last:border-r-0",
                            isToday(day) && "bg-primary/5"
                          )}
                        >
                          {displayMode === 'children' ? (
                            dayBookings.slice(0, 2).map((b: any) => (
                              <div 
                                key={b.id}
                                className="text-[10px] px-1 py-0.5 rounded mb-0.5 text-white truncate"
                                style={{ backgroundColor: b.children?.groups?.color || '#4A9D8E' }}
                              >
                                {b.children?.first_name}
                              </div>
                            ))
                          ) : (
                            dayBookings.slice(0, 2).map((s: any) => (
                              <div 
                                key={s.id}
                                className="text-[10px] px-1 py-0.5 rounded mb-0.5 text-white truncate"
                                style={{ backgroundColor: s.groups?.color || '#E88D4E' }}
                              >
                                {s.staff?.first_name}
                              </div>
                            ))
                          )}
                          {dayBookings.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dayBookings.length - 2}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Month View - Calendar Grid
          <Card>
            <CardContent className="p-2">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>
              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Padding for start of month */}
                {Array.from({ length: (dateRange.start.getDay() || 7) - 1 }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}
                {days.map(day => {
                  const dayData = displayMode === 'children' 
                    ? getBookingsForDay(day) 
                    : getShiftsForDay(day);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "aspect-square p-1 rounded-lg text-center cursor-pointer hover:bg-secondary/50",
                        isToday(day) && "bg-primary text-primary-foreground",
                        dayData.length > 0 && !isToday(day) && "bg-secondary"
                      )}
                    >
                      <span className="text-xs font-medium">{format(day, 'd')}</span>
                      {dayData.length > 0 && (
                        <div className="text-[9px] mt-0.5">
                          {dayData.length} {displayMode === 'children' ? 'K' : 'P'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {displayMode === 'children' ? 'Belegungsübersicht' : 'Personalübersicht'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {displayMode === 'children' 
                    ? childBookings?.length || 0 
                    : staffShifts?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayMode === 'children' ? 'Buchungen' : 'Schichten'} im Zeitraum
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {displayMode === 'children'
                    ? new Set(childBookings?.map(b => b.child_id)).size
                    : new Set(staffShifts?.map(s => s.staff_id)).size}
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayMode === 'children' ? 'Kinder' : 'Mitarbeiter'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
