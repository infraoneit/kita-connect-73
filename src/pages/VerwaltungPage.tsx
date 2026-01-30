import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChildrenWithContracts, useGuardians, useContracts, useUpdateChild, useUpdateGuardian } from '@/hooks/useAdminData';
import { useGroups } from '@/hooks/useDatabase';
import { Search, Filter, Download, Plus, Edit2, Phone, Mail, Users, Baby, FileText, ChevronRight, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EditChildSheet } from '@/components/admin/EditChildSheet';
import { EditGuardianSheet } from '@/components/admin/EditGuardianSheet';
import { ExportDialog } from '@/components/admin/ExportDialog';

type ViewTab = 'children' | 'guardians' | 'contracts';

export default function VerwaltungPage() {
  const [activeTab, setActiveTab] = useState<ViewTab>('children');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
  const [showExport, setShowExport] = useState(false);

  const { data: children, isLoading: loadingChildren } = useChildrenWithContracts();
  const { data: guardians, isLoading: loadingGuardians } = useGuardians();
  const { data: contracts, isLoading: loadingContracts } = useContracts();
  const { data: groups } = useGroups();

  const isLoading = loadingChildren || loadingGuardians || loadingContracts;

  // Filtered data
  const filteredChildren = useMemo(() => {
    if (!children) return [];
    return children.filter(child => {
      const matchesSearch = searchQuery === '' || 
        `${child.first_name} ${child.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.primary_guardian?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.primary_guardian?.phone?.includes(searchQuery);
      
      const matchesGroup = groupFilter === 'all' || child.group_id === groupFilter;
      
      const matchesContract = contractFilter === 'all' || 
        child.contracts?.some(c => c.status === contractFilter);

      return matchesSearch && matchesGroup && matchesContract;
    });
  }, [children, searchQuery, groupFilter, contractFilter]);

  const filteredGuardians = useMemo(() => {
    if (!guardians) return [];
    return guardians.filter(guardian => {
      return searchQuery === '' || 
        `${guardian.first_name} ${guardian.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guardian.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guardian.phone?.includes(searchQuery);
    });
  }, [guardians, searchQuery]);

  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    return contracts.filter(contract => {
      const matchesSearch = searchQuery === '' || 
        contract.contract_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${contract.children?.first_name} ${contract.children?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${contract.guardians?.first_name} ${contract.guardians?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = contractFilter === 'all' || contract.status === contractFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchQuery, contractFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setGroupFilter('all');
    setContractFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || groupFilter !== 'all' || contractFilter !== 'all';

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Verwaltung"
        subtitle="Kinder, Eltern & Verträge"
        rightAction={
          <div className="flex gap-2">
            <Button variant="ghost" size="iconSm" onClick={() => setShowExport(true)}>
              <Download size={20} />
            </Button>
            <Button variant="ghost" size="iconSm">
              <Plus size={20} />
            </Button>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant={hasActiveFilters ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="border-border">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filter</span>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X size={14} className="mr-1" /> Zurücksetzen
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Gruppe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Gruppen</SelectItem>
                    {groups?.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={contractFilter} onValueChange={setContractFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Vertragsstatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="terminated">Gekündigt</SelectItem>
                    <SelectItem value="expired">Abgelaufen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ViewTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="children" className="gap-1">
              <Baby size={14} />
              <span className="hidden sm:inline">Kinder</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filteredChildren.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="guardians" className="gap-1">
              <Users size={14} />
              <span className="hidden sm:inline">Eltern</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filteredGuardians.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="gap-1">
              <FileText size={14} />
              <span className="hidden sm:inline">Verträge</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filteredContracts.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Children Tab */}
          <TabsContent value="children" className="mt-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
            ) : filteredChildren.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Kinder gefunden
              </div>
            ) : (
              filteredChildren.map(child => (
                <Card 
                  key={child.id} 
                  className="border-border cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => setSelectedChild(child)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                          style={{ backgroundColor: child.groups?.color || '#4A9D8E' }}
                        >
                          {child.first_name[0]}{child.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium">{child.first_name} {child.last_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{child.groups?.name || 'Keine Gruppe'}</span>
                            {child.contracts?.length > 0 && (
                              <>
                                <span>•</span>
                                <Badge variant={child.contracts[0].status === 'active' ? 'default' : 'secondary'} className="h-4 text-[10px]">
                                  {child.contracts[0].status === 'active' ? 'Aktiv' : child.contracts[0].status}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {child.primary_guardian && (
                      <div className="mt-2 pt-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{child.primary_guardian.first_name} {child.primary_guardian.last_name}</span>
                        {child.primary_guardian.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={10} />
                            {child.primary_guardian.phone}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Guardians Tab */}
          <TabsContent value="guardians" className="mt-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            ) : filteredGuardians.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Eltern gefunden
              </div>
            ) : (
              filteredGuardians.map(guardian => (
                <Card 
                  key={guardian.id} 
                  className="border-border cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => setSelectedGuardian(guardian)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{guardian.first_name} {guardian.last_name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {guardian.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={10} />
                              {guardian.phone}
                            </span>
                          )}
                          {guardian.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={10} />
                              {guardian.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Verträge gefunden
              </div>
            ) : (
              filteredContracts.map(contract => (
                <Card key={contract.id} className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{contract.contract_number}</p>
                          <Badge 
                            variant={contract.status === 'active' ? 'default' : 'secondary'}
                            className="h-5 text-xs"
                          >
                            {contract.status === 'active' ? 'Aktiv' : 
                             contract.status === 'pending' ? 'Ausstehend' :
                             contract.status === 'terminated' ? 'Gekündigt' : 'Abgelaufen'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {contract.children?.first_name} {contract.children?.last_name}
                          {' • '}
                          {contract.guardians?.first_name} {contract.guardians?.last_name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>
                            {format(new Date(contract.start_date), 'dd.MM.yyyy')}
                            {contract.end_date && ` - ${format(new Date(contract.end_date), 'dd.MM.yyyy')}`}
                          </span>
                          {contract.monthly_fee && (
                            <span className="font-medium text-foreground">
                              {contract.monthly_fee}€/Monat
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="iconSm">
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Sheets */}
      <EditChildSheet 
        child={selectedChild} 
        onClose={() => setSelectedChild(null)} 
        groups={groups || []}
      />
      <EditGuardianSheet 
        guardian={selectedGuardian} 
        onClose={() => setSelectedGuardian(null)} 
      />
      <ExportDialog 
        open={showExport} 
        onOpenChange={setShowExport}
        data={{
          children: filteredChildren,
          guardians: filteredGuardians,
          contracts: filteredContracts,
        }}
        activeTab={activeTab}
      />
    </div>
  );
}
