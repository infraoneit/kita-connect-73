import { PageHeader } from '@/components/layout/PageHeader';
import { AttendanceCard } from '@/components/dashboard/AttendanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PinnedPostCard } from '@/components/dashboard/PinnedPostCard';
import { ChildAttendanceList } from '@/components/dashboard/ChildAttendanceList';
import { useProfile, useGroups, useChildren, useAnnouncements, useAttendance } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

// Fallback data for demo when database is empty
const fallbackAttendance = [
  { childId: '1', status: 'present' as const, checkInTime: '08:15' },
  { childId: '2', status: 'absent' as const, absenceType: 'sick' as const },
  { childId: '3', status: 'present' as const, checkInTime: '07:45' },
  { childId: '4', status: 'not_arrived' as const },
];

export default function Dashboard() {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: children, isLoading: childrenLoading } = useChildren();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { data: attendance, isLoading: attendanceLoading } = useAttendance();

  const today = format(new Date(), 'EEEE, dd. MMMM', { locale: de });
  
  // Get first group or fallback
  const userGroup = groups?.[0];
  
  // Filter children by group or show all if no group filter
  const groupChildren = children?.filter(c => !userGroup || c.group_id === userGroup.id) || [];
  
  // Transform database attendance to component format
  const attendanceData = attendance?.map(a => ({
    childId: a.child_id,
    status: a.status,
    checkInTime: a.check_in_time || undefined,
    checkOutTime: a.check_out_time || undefined,
  })) || fallbackAttendance;
  
  // Get important announcements
  const importantPosts = announcements?.filter(p => p.important).slice(0, 2) || [];

  const isLoading = groupsLoading || childrenLoading || announcementsLoading;

  // Transform children for the attendance list component
  const childrenForList = groupChildren.map(c => ({
    id: c.id,
    firstName: c.first_name,
    lastName: c.last_name,
    birthDate: c.birth_date,
    groupId: c.group_id || '',
    parentIds: [],
    photoPermission: c.photo_permission ?? true,
    allergies: c.allergies || [],
    emergencyContacts: [],
    pickupAuthorizations: [],
  }));

  // Transform announcements for the component
  const postsForCards = importantPosts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    author: p.author,
    createdAt: p.created_at,
    important: p.important ?? false,
    attachments: p.documents?.map(d => ({
      id: d.id,
      type: (d.file_type === 'image' ? 'image' : 'document') as 'image' | 'document',
      url: d.file_url,
      name: d.name,
    })) || [],
    groupIds: [],
  }));

  return (
    <div className="min-h-screen">
      <PageHeader
        title="KitaConnect"
        subtitle={today}
        showNotifications
        notificationCount={3}
        rightAction={
          <Button variant="ghost" size="iconSm" onClick={signOut}>
            <LogOut size={20} />
          </Button>
        }
      />

      <div className="p-4 space-y-6 pb-24">
        {/* Welcome message */}
        {profile && (
          <div className="bg-primary/5 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Willkommen zurück,</p>
            <p className="text-lg font-semibold text-foreground">
              {profile.first_name} {profile.last_name}
            </p>
          </div>
        )}

        {/* Attendance Overview */}
        <section>
          {isLoading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : (
            <AttendanceCard
              attendance={attendanceData}
              groupName={userGroup?.name || 'Ihre Gruppe'}
            />
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Schnellaktionen
          </h2>
          <QuickActions />
        </section>

        {/* Important Posts */}
        {postsForCards.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Aktuelle Infos
            </h2>
            <div className="space-y-2">
              {postsForCards.map((post) => (
                <PinnedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Children Attendance List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Kinder heute
            </h2>
            <span className="text-sm text-primary font-medium">
              {childrenForList.length} Kinder
            </span>
          </div>
          {childrenLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : childrenForList.length > 0 ? (
            <ChildAttendanceList
              children={childrenForList}
              attendance={attendanceData}
            />
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">Noch keine Kinder zugewiesen.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Die Kita-Leitung wird Ihnen Kinder zuweisen.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
