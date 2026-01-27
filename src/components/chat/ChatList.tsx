import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Chat } from '@/types/kita';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatListProps {
  chats: Chat[];
  onChatClick?: (chat: Chat) => void;
}

export function ChatList({ chats, onChatClick }: ChatListProps) {
  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const timeAgo = chat.lastMessage
          ? formatDistanceToNow(new Date(chat.lastMessage.timestamp), {
              addSuffix: false,
              locale: de,
            })
          : '';

        return (
          <Card
            key={chat.id}
            className="p-4 card-interactive cursor-pointer"
            onClick={() => onChatClick?.(chat)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {chat.type === 'group' ? (
                      <Users size={20} />
                    ) : (
                      <User size={20} />
                    )}
                  </AvatarFallback>
                </Avatar>
                {chat.unreadCount > 0 && (
                  <span className="badge-unread">{chat.unreadCount}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className={cn(
                    "font-medium text-foreground truncate",
                    chat.unreadCount > 0 && "font-semibold"
                  )}>
                    {chat.name}
                  </h4>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {timeAgo}
                  </span>
                </div>
                {chat.lastMessage && (
                  <p className={cn(
                    "text-sm text-muted-foreground truncate",
                    chat.unreadCount > 0 && "text-foreground"
                  )}>
                    {chat.lastMessage.senderRole === 'educator' && 'Du: '}
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
