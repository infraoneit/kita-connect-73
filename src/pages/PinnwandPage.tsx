import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PinnedPostCard } from '@/components/dashboard/PinnedPostCard';
import { pinnedPosts } from '@/data/mockData';
import { PinnedPost } from '@/types/kita';
import { PinnwandDetailSheet } from '@/components/pinnwand/PinnwandDetailSheet';

export default function PinnwandPage() {
  const [selectedPost, setSelectedPost] = useState<PinnedPost | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handlePostClick = (post: PinnedPost) => {
    setSelectedPost(post);
    setIsSheetOpen(true);
  };

  // Sort posts: important first, then by date
  const sortedPosts = [...pinnedPosts].sort((a, b) => {
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
          {sortedPosts.map((post) => (
            <PinnedPostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)}
            />
          ))}
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
