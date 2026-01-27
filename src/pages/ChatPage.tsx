import { PageHeader } from '@/components/layout/PageHeader';
import { ChatList } from '@/components/chat/ChatList';
import { Button } from '@/components/ui/button';
import { chats } from '@/data/mockData';
import { Plus } from 'lucide-react';

export default function ChatPage() {
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Nachrichten"
        subtitle={totalUnread > 0 ? `${totalUnread} ungelesen` : undefined}
        rightAction={
          <Button variant="ghost" size="iconSm">
            <Plus size={22} />
          </Button>
        }
      />

      <div className="p-4">
        <ChatList chats={chats} />
      </div>
    </div>
  );
}
