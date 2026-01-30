import { PageHeader } from '@/components/layout/PageHeader';
import { useConversations } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MessageCircle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function ChatPage() {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations();

  const totalUnread = conversations?.reduce((sum, conv) => {
    const participant = conv.conversation_participants?.find(
      p => p.profile_id === user?.id
    );
    return sum + (participant?.unread_count || 0);
  }, 0) || 0;

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

      <div className="p-4 space-y-3 pb-24">
        {isLoading ? (
          <>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </>
        ) : conversations && conversations.length > 0 ? (
          conversations.map(conversation => {
            // Get the other participant(s)
            const otherParticipants = conversation.conversation_participants?.filter(
              p => p.profile_id !== user?.id
            ) || [];
            
            // Get last message
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            
            // Get unread count for current user
            const currentUserParticipant = conversation.conversation_participants?.find(
              p => p.profile_id === user?.id
            );
            const unreadCount = currentUserParticipant?.unread_count || 0;

            // Build display name
            const displayName = conversation.name || 
              otherParticipants.map(p => 
                p.profiles ? `${p.profiles.first_name} ${p.profiles.last_name}` : 'Unbekannt'
              ).join(', ') || 
              'Neue Konversation';

            return (
              <Card 
                key={conversation.id} 
                className={`cursor-pointer hover:border-primary/30 transition-colors ${unreadCount > 0 ? 'bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conversation.type === 'group' ? (
                          <Users size={20} />
                        ) : (
                          displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium truncate ${unreadCount > 0 ? 'font-semibold' : ''}`}>
                          {displayName}
                        </p>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lastMessage.created_at), {
                              addSuffix: true,
                              locale: de,
                            })}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {lastMessage?.content || 'Keine Nachrichten'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Noch keine Konversationen.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Starten Sie eine neue Nachricht mit dem + Button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
