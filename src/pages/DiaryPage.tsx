import { PageHeader } from '@/components/layout/PageHeader';
import { DiaryEntryCard } from '@/components/diary/DiaryEntryCard';
import { Button } from '@/components/ui/button';
import { useDiaryEntries, useGroups } from '@/hooks/useDatabase';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiaryPage() {
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: diaryEntries, isLoading: entriesLoading } = useDiaryEntries();

  const userGroup = groups?.[0];
  const isLoading = groupsLoading || entriesLoading;

  // Transform entries for the DiaryEntryCard component
  const transformedEntries = (diaryEntries || []).map(e => ({
    id: e.id,
    groupId: e.group_id,
    date: e.date,
    content: e.content,
    author: e.author,
    photos: e.photos || [],
    createdAt: e.created_at,
  }));

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Gruppentagebuch"
        subtitle={userGroup?.name || 'Tagebuch'}
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Plus size={22} />
          </Button>
        }
      />

      <div className="p-4 space-y-4 pb-24">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : transformedEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Noch keine Einträge vorhanden</p>
            <Button className="mt-4">
              <Plus size={18} className="mr-2" />
              Ersten Eintrag erstellen
            </Button>
          </div>
        ) : (
          transformedEntries.map(entry => (
            <DiaryEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
