import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DiaryEntry } from '@/types/kita';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Camera } from 'lucide-react';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onClick?: () => void;
}

export function DiaryEntryCard({ entry, onClick }: DiaryEntryCardProps) {
  const dateStr = format(new Date(entry.date), 'EEEE, dd. MMMM yyyy', { locale: de });

  return (
    <Card className="overflow-hidden card-interactive cursor-pointer" onClick={onClick}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {entry.author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{entry.author}</p>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
          </div>
        </div>

        <p className="text-foreground leading-relaxed">
          {entry.content}
        </p>

        {entry.photos.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <Camera size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {entry.photos.length} Fotos
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
