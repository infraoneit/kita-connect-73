import { PageHeader } from '@/components/layout/PageHeader';
import { DiaryEntryCard } from '@/components/diary/DiaryEntryCard';
import { Button } from '@/components/ui/button';
import { diaryEntries, groups, currentUser } from '@/data/mockData';
import { Plus } from 'lucide-react';

export default function DiaryPage() {
  const userGroup = groups.find(g => g.id === currentUser.groupIds[0]);
  const groupEntries = diaryEntries.filter(e => e.groupId === userGroup?.id);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Gruppentagebuch"
        subtitle={userGroup?.name}
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Plus size={22} />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {groupEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Noch keine Einträge vorhanden</p>
            <Button className="mt-4">
              <Plus size={18} className="mr-2" />
              Ersten Eintrag erstellen
            </Button>
          </div>
        ) : (
          groupEntries.map(entry => (
            <DiaryEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
