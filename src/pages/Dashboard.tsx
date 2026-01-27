import { PageHeader } from '@/components/layout/PageHeader';
import { AttendanceCard } from '@/components/dashboard/AttendanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PinnedPostCard } from '@/components/dashboard/PinnedPostCard';
import { ChildAttendanceList } from '@/components/dashboard/ChildAttendanceList';
import { currentUser, groups, children, todayAttendance, pinnedPosts } from '@/data/mockData';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Dashboard() {
  const today = format(new Date(), 'EEEE, dd. MMMM', { locale: de });
  const userGroup = groups.find(g => g.id === currentUser.groupIds[0]);
  const groupChildren = children.filter(c => c.groupId === userGroup?.id);
  const importantPosts = pinnedPosts.filter(p => p.important).slice(0, 2);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="KitaConnect"
        subtitle={today}
        showNotifications
        notificationCount={3}
        showSettings
      />

      <div className="p-4 space-y-6">
        {/* Attendance Overview */}
        <section>
          <AttendanceCard
            attendance={todayAttendance}
            groupName={userGroup?.name || 'Gruppe'}
          />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Schnellaktionen
          </h2>
          <QuickActions />
        </section>

        {/* Important Posts */}
        {importantPosts.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Aktuelle Infos
            </h2>
            <div className="space-y-2">
              {importantPosts.map((post) => (
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
              {groupChildren.length} Kinder
            </span>
          </div>
          <ChildAttendanceList
            children={groupChildren}
            attendance={todayAttendance}
          />
        </section>
      </div>
    </div>
  );
}
