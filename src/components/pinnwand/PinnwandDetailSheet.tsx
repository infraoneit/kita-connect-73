import { AlertCircle, FileText, Download, Calendar, User } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PinnedPost } from '@/types/kita';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface PinnwandDetailSheetProps {
  post: PinnedPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PinnwandDetailSheet({ post, open, onOpenChange }: PinnwandDetailSheetProps) {
  if (!post) return null;

  const formattedDate = format(new Date(post.createdAt), 'dd. MMMM yyyy, HH:mm', {
    locale: de,
  });

  const handleDownload = (fileName: string, url: string) => {
    // In a real app, this would trigger an actual download
    // For now, we show a toast to simulate the action
    toast({
      title: 'Download gestartet',
      description: `${fileName} wird heruntergeladen...`,
    });
    
    // Simulate download by opening in new tab (in real app, would use proper download)
    // window.open(url, '_blank');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-start gap-3">
            {post.important ? (
              <div className="p-2 rounded-lg bg-accent-light shrink-0 mt-1">
                <AlertCircle size={24} className="text-accent" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-secondary shrink-0 mt-1">
                <FileText size={24} className="text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {post.important && (
                  <Badge variant="destructive" className="text-xs">
                    Wichtig
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-xl leading-tight">
                {post.title}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formattedDate} Uhr</span>
            </div>
          </div>

          <Separator />

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <FileText size={16} />
                  Anhänge ({post.attachments.length})
                </h4>
                <div className="space-y-2">
                  {post.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <FileText size={20} className="text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {attachment.type === 'document' ? 'PDF Dokument' : 'Bild'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(attachment.name, attachment.url)}
                      >
                        <Download size={20} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Schließen
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
