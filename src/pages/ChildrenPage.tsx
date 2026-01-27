import { PageHeader } from '@/components/layout/PageHeader';
import { ChildAttendanceList } from '@/components/dashboard/ChildAttendanceList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { children, todayAttendance, groups, currentUser } from '@/data/mockData';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function ChildrenPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const userGroup = groups.find(g => g.id === currentUser.groupIds[0]);
  const groupChildren = children.filter(c => c.groupId === userGroup?.id);

  const filteredChildren = groupChildren.filter(child =>
    `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Kinder"
        subtitle={`${groupChildren.length} in ${userGroup?.name}`}
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Filter size={22} />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kind suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Children List */}
        <ChildAttendanceList
          children={filteredChildren}
          attendance={todayAttendance}
        />
      </div>
    </div>
  );
}
