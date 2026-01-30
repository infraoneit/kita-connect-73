import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChildrenWithContracts, useStaff, useContracts } from '@/hooks/useAdminData';
import { useGroups } from '@/hooks/useDatabase';
import { Users, Baby, FileText, Calendar, UserCog, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

export default function AdminDashboard() {
  const { data: children, isLoading: loadingChildren } = useChildrenWithContracts();
  const { data: staff, isLoading: loadingStaff } = useStaff();
  const { data: contracts, isLoading: loadingContracts } = useContracts();
  const { data: groups } = useGroups();

  const today = new Date();
  const soon = addDays(today, 30);

  // Calculate stats
  const activeContracts = contracts?.filter(c => c.status === 'active') || [];
  const expiringContracts = activeContracts.filter(c => 
    c.end_date && isBefore(new Date(c.end_date), soon) && isAfter(new Date(c.end_date), today)
  );
  const activeStaff = staff?.filter(s => s.is_active) || [];

  const stats = [
    {
      title: 'Kinder',
      value: children?.length || 0,
      icon: Baby,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      title: 'Aktive Verträge',
      value: activeContracts.length,
      icon: FileText,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: 'Personal',
      value: activeStaff.length,
      icon: UserCog,
      color: 'text-accent',
      bgColor: 'bg-accent-light',
    },
    {
      title: 'Gruppen',
      value: groups?.length || 0,
      icon: Users,
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary',
    },
  ];

  const isLoading = loadingChildren || loadingStaff || loadingContracts;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Admin Dashboard"
        subtitle={format(today, 'EEEE, d. MMMM yyyy', { locale: de })}
      />

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border">
                <CardContent className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Expiring Contracts Warning */}
        {expiringContracts.length > 0 && (
          <Card className="border-warning bg-warning-light">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-warning-foreground">
                <AlertTriangle className="h-5 w-5" />
                Verträge laufen aus ({expiringContracts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {expiringContracts.slice(0, 3).map((contract) => (
                  <div key={contract.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">
                      {contract.children?.first_name} {contract.children?.last_name}
                    </span>
                    <span className="text-muted-foreground">
                      {contract.end_date && format(new Date(contract.end_date), 'dd.MM.yyyy')}
                    </span>
                  </div>
                ))}
                {expiringContracts.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{expiringContracts.length - 3} weitere
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Groups Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gruppen-Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groups?.map((group) => {
                const groupChildren = children?.filter(c => c.group_id === group.id) || [];
                const groupStaff = staff?.filter(s => 
                  s.staff_group_assignments?.some(a => a.group_id === group.id)
                ) || [];
                
                return (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: group.color || '#4A9D8E' }}
                      />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{groupChildren.length} Kinder</span>
                      <span>{groupStaff.length} Personal</span>
                    </div>
                  </div>
                );
              })}
              {(!groups || groups.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine Gruppen vorhanden
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-lg font-semibold">Heute</p>
                  <p className="text-sm text-muted-foreground">
                    {format(today, 'dd.MM.yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-lg font-semibold">{contracts?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Verträge gesamt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
