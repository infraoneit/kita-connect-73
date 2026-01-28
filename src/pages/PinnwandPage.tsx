import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PinnedPostCard } from '@/components/dashboard/PinnedPostCard';
import { useAnnouncements } from '@/hooks/useDatabase';
import { PinnwandDetailSheet } from '@/components/pinnwand/PinnwandDetailSheet';
import { Skeleton } from '@/components/ui/skeleton';

interface TransformedPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  important: boolean;
  attachments: Array<{
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
  }>;
  groupIds: string[];
}

export default function PinnwandPage() {
  const { data: announcements, isLoading } = useAnnouncements();
  const [selectedPost, setSelectedPost] = useState<TransformedPost | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handlePostClick = (post: TransformedPost) => {
    setSelectedPost(post);
    setIsSheetOpen(true);
  };

  // Transform and sort posts: important first, then by date
  const sortedPosts: TransformedPost[] = (announcements || [])
    .map(p => ({
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
    }))
    .sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Pinnwand" 
        subtitle="Neuigkeiten & Dokumente"
        showNotifications
      />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3 pb-24">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </>
          ) : sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <PinnedPostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post)}
              />
            ))
          ) : (
            <div className="bg-muted/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground">Noch keine Ankündigungen vorhanden.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <PinnwandDetailSheet
        post={selectedPost}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
