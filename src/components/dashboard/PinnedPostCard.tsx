import { AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PinnedPost } from '@/types/kita';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface PinnedPostCardProps {
  post: PinnedPost;
  onClick?: () => void;
}

export function PinnedPostCard({ post, onClick }: PinnedPostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: de,
  });

  return (
    <Card
      className="p-4 card-interactive cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {post.important ? (
          <div className="p-2 rounded-lg bg-accent-light shrink-0">
            <AlertCircle size={20} className="text-accent" />
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-secondary shrink-0">
            <FileText size={20} className="text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {post.important && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Wichtig
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <h4 className="font-medium text-foreground line-clamp-1">{post.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {post.content}
          </p>
          {post.attachments && post.attachments.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <FileText size={14} />
              <span>{post.attachments.length} Anhang</span>
            </div>
          )}
        </div>

        <ChevronRight size={20} className="text-muted-foreground shrink-0" />
      </div>
    </Card>
  );
}
