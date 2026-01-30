import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useStaff, useStaffShifts, useStaffLeave } from '@/hooks/useAdminData';
import { useGroups } from '@/hooks/useDatabase';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { Search, Plus, ChevronLeft, ChevronRight, UserCog, Calendar, Clock, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type TabView = 'overview' | 'schedule' | 'leave';

export default function PersonalPage() {
  const [activeTab, setActiveTab] = useState<TabView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const { data: staff, isLoading: loadingStaff } = useStaff();
  const { data: groups } = useGroups();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5);

  const { data: shifts, isLoading: loadingShifts } = useStaffShifts(
    format(weekStart, 'yyyy-MM-dd'),
    format(weekEnd, 'yyyy-MM-dd')
  );
  const { data: leave, isLoading: loadingLeave } = useStaffLeave(
    format(weekStart, 'yyyy-MM-dd'),
    format(weekEnd, 'yyyy-MM-dd')
  );

  const filteredStaff = useMemo(() => {
    if (!staff) return [];
    return staff.filter(s => {
      const matchesSearch = searchQuery === '' ||
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.position?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && s.is_active;
    });
  }, [staff, searchQuery]);

  const getShiftsForStaffAndDay = (staffId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts?.find(s => s.staff_id === staffId && s.date === dateStr);
  };

  const getLeaveForStaffAndDay = (staffId: string, date: Date) => {
    return leave?.find(l => 
      l.staff_id === staffId && 
      new Date(l.start_date) <= date && 
      new Date(l.end_date) >= date
    );
  };

  const leaveTypeLabels: Record<string, string> = {
    vacation: 'Urlaub',
    sick: 'Krank',
    training: 'Fortbildung',
    other: 'Sonstige',
  };

  const isLoading = loadingStaff || loadingShifts || loadingLeave;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Personalplanung"
        subtitle="Schichten, Urlaub & Übersicht"
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Plus size={20} />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Personal suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabView)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-1">
              <UserCog size={14} />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-1">
              <Calendar size={14} />
              <span className="hidden sm:inline">Dienstplan</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="gap-1">
              <Briefcase size={14} />
              <span className="hidden sm:inline">Abwesenheit</span>
            </TabsTrigger>
          </TabsList>

          {/* Team Overview */}
          <TabsContent value="overview" className="mt-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Kein Personal gefunden
              </div>
            ) : (
              filteredStaff.map(member => {
                const assignedGroups = member.staff_group_assignments || [];
                return (
                  <Card 
                    key={member.id} 
                    className="border-border cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setSelectedStaff(member)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-medium text-sm">
                            {member.first_name[0]}{member.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{member.first_name} {member.last_name}</p>
                            <p className="text-xs text-muted-foreground">{member.position || 'Mitarbeiter'}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                          {assignedGroups.slice(0, 2).map((a: any) => (
                            <div
                              key={a.group_id}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: a.groups?.color || '#4A9D8E' }}
                              title={a.groups?.name}
                            />
                          ))}
                          {assignedGroups.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{assignedGroups.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {member.weekly_hours && (
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {member.weekly_hours}h/Woche
                          </span>
                          {member.employment_start && (
                            <span>Seit {format(new Date(member.employment_start), 'MM/yyyy')}</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Schedule/Dienstplan */}
          <TabsContent value="schedule" className="mt-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="iconSm" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                <ChevronLeft size={20} />
              </Button>
              <div className="text-center">
                <p className="font-medium">KW {format(currentWeek, 'w', { locale: de })}</p>
                <p className="text-xs text-muted-foreground">
                  {format(weekStart, 'dd.MM.')} - {format(weekEnd, 'dd.MM.yyyy')}
                </p>
              </div>
              <Button variant="ghost" size="iconSm" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Schedule Grid */}
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[500px]">
                  {/* Header */}
                  <div className="grid grid-cols-6 border-b border-border">
                    <div className="p-2 text-xs font-medium text-muted-foreground border-r border-border">
                      Personal
                    </div>
                    {weekDays.map(day => (
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

                  {/* Staff rows */}
                  {isLoading ? (
                    <div className="p-4">
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    filteredStaff.map(member => (
                      <div key={member.id} className="grid grid-cols-6 border-b border-border last:border-b-0">
                        <div className="p-2 border-r border-border">
                          <p className="text-xs font-medium truncate">
                            {member.first_name} {member.last_name?.[0]}.
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {member.position}
                          </p>
                        </div>
                        {weekDays.map(day => {
                          const shift = getShiftsForStaffAndDay(member.id, day);
                          const leaveItem = getLeaveForStaffAndDay(member.id, day);

                          return (
                            <div
                              key={day.toISOString()}
                              className={cn(
                                "p-1 min-h-[50px] border-r border-border last:border-r-0 text-center",
                                isToday(day) && "bg-primary/5",
                                leaveItem && "bg-warning-light"
                              )}
                            >
                              {leaveItem ? (
                                <Badge variant="outline" className="text-[9px] h-5 bg-warning/20">
                                  {leaveTypeLabels[leaveItem.leave_type] || leaveItem.leave_type}
                                </Badge>
                              ) : shift ? (
                                <div
                                  className="text-[10px] px-1 py-1 rounded text-white"
                                  style={{ backgroundColor: shift.groups?.color || '#4A9D8E' }}
                                >
                                  <p>{shift.start_time?.slice(0,5)}</p>
                                  <p>{shift.end_time?.slice(0,5)}</p>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">-</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave/Abwesenheit */}
          <TabsContent value="leave" className="mt-4 space-y-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Aktuelle Abwesenheiten</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingLeave ? (
                  <Skeleton className="h-20 w-full" />
                ) : leave && leave.length > 0 ? (
                  <div className="space-y-2">
                    {leave.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">
                            {l.staff?.first_name} {l.staff?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(l.start_date), 'dd.MM.')} - {format(new Date(l.end_date), 'dd.MM.yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={l.approved ? 'default' : 'secondary'}>
                            {leaveTypeLabels[l.leave_type] || l.leave_type}
                          </Badge>
                          {!l.approved && (
                            <Badge variant="outline" className="text-warning">Offen</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Keine Abwesenheiten im Zeitraum
                  </p>
                )}
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              Abwesenheit eintragen
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Staff Detail Sheet */}
      <Sheet open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {selectedStaff?.first_name} {selectedStaff?.last_name}
            </SheetTitle>
          </SheetHeader>
          {selectedStaff && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="font-medium">{selectedStaff.position || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wochenstunden</p>
                  <p className="font-medium">{selectedStaff.weekly_hours || '-'}h</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">E-Mail</p>
                  <p className="font-medium">{selectedStaff.email || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="font-medium">{selectedStaff.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Eintrittsdatum</p>
                  <p className="font-medium">
                    {selectedStaff.employment_start 
                      ? format(new Date(selectedStaff.employment_start), 'dd.MM.yyyy')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stundensatz</p>
                  <p className="font-medium">
                    {selectedStaff.hourly_rate ? `${selectedStaff.hourly_rate}€` : '-'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">Zugewiesene Gruppen</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.staff_group_assignments?.map((a: any) => (
                    <Badge 
                      key={a.group_id}
                      style={{ 
                        backgroundColor: a.groups?.color || '#4A9D8E',
                        color: 'white'
                      }}
                    >
                      {a.groups?.name}
                      {a.is_primary && ' (Hauptgruppe)'}
                    </Badge>
                  ))}
                  {(!selectedStaff.staff_group_assignments || selectedStaff.staff_group_assignments.length === 0) && (
                    <span className="text-sm text-muted-foreground">Keine Gruppen zugewiesen</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  Bearbeiten
                </Button>
                <Button className="flex-1">
                  Schicht planen
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
