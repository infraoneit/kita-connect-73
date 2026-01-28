import { PageHeader } from '@/components/layout/PageHeader';
import { useChildren, useGroups } from '@/hooks/useDatabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Users, Search } from 'lucide-react';
import { useState } from 'react';

export default function ChildrenPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: children, isLoading: childrenLoading } = useChildren();
  const { data: groups, isLoading: groupsLoading } = useGroups();

  const isLoading = childrenLoading || groupsLoading;

  // Filter children by search query
  const filteredChildren = (children || []).filter(child =>
    `${child.first_name} ${child.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group children by their group
  const childrenByGroup = (groups || []).map(group => ({
    group,
    children: filteredChildren.filter(c => c.group_id === group.id),
  })).filter(g => g.children.length > 0 || !searchQuery);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Kinder"
        subtitle={`${children?.length || 0} Kinder`}
        showNotifications
      />

      <div className="p-4 space-y-6 pb-24">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kind suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : childrenByGroup.length > 0 ? (
          childrenByGroup.map(({ group, children: groupChildren }) => (
            <section key={group.id}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group.color || '#4A9D8E' }}
                />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {group.name}
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  <Users size={12} className="mr-1" />
                  {groupChildren.length}
                </Badge>
              </div>
              
              {groupChildren.length > 0 ? (
                <div className="space-y-2">
                  {groupChildren.map(child => (
                    <Card key={child.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback
                              className="text-white font-medium"
                              style={{ backgroundColor: group.color || '#4A9D8E' }}
                            >
                              {child.first_name[0]}{child.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">
                              {child.first_name} {child.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Geb. {new Date(child.birth_date).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          {child.allergies && child.allergies.length > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <AlertTriangle size={16} />
                              <span className="text-xs font-medium">
                                {child.allergies.length}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {child.allergies && child.allergies.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">Allergien:</p>
                            <div className="flex flex-wrap gap-1">
                              {child.allergies.map((allergy, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Keine Kinder in dieser Gruppe</p>
                </div>
              )}
            </section>
          ))
        ) : (
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <Users size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Noch keine Kinder angelegt.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Die Kita-Leitung wird Kinder und Gruppen anlegen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
