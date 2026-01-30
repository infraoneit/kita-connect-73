import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useContracts, useCreateContract, useGuardians, useChildrenWithContracts } from '@/hooks/useAdminData';
import { Search, Plus, FileText, Calendar, Euro, Clock, Edit2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const contractTypeLabels: Record<string, string> = {
  flexible: 'Flexible Buchung',
  halbtags: 'Halbtags',
  ganztags: 'Ganztags',
  stundenweise: 'Stundenweise',
};

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  pending: 'Ausstehend',
  terminated: 'Gekündigt',
  expired: 'Abgelaufen',
};

const statusColors: Record<string, string> = {
  active: 'bg-success text-success-foreground',
  pending: 'bg-warning text-warning-foreground',
  terminated: 'bg-destructive text-destructive-foreground',
  expired: 'bg-muted text-muted-foreground',
};

export default function VertraegePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewContract, setShowNewContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const { data: contracts, isLoading } = useContracts();
  const { data: guardians } = useGuardians();
  const { data: children } = useChildrenWithContracts();
  const createContract = useCreateContract();

  const filteredContracts = contracts?.filter(c => {
    const matchesSearch = searchQuery === '' ||
      c.contract_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${c.children?.first_name} ${c.children?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${c.guardians?.first_name} ${c.guardians?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const [newContract, setNewContract] = useState({
    guardian_id: '',
    child_id: '',
    contract_type: 'flexible' as const,
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: '',
    monthly_fee: '',
    meal_fee: '',
    subsidy_amount: '',
    discount_percent: '',
    special_agreements: '',
    notes: '',
  });

  const handleCreateContract = async () => {
    if (!newContract.guardian_id || !newContract.child_id || !newContract.start_date) {
      toast.error('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    try {
      await createContract.mutateAsync({
        guardian_id: newContract.guardian_id,
        child_id: newContract.child_id,
        contract_type: newContract.contract_type,
        start_date: newContract.start_date,
        end_date: newContract.end_date || null,
        monthly_fee: newContract.monthly_fee ? parseFloat(newContract.monthly_fee) : null,
        meal_fee: newContract.meal_fee ? parseFloat(newContract.meal_fee) : null,
        subsidy_amount: newContract.subsidy_amount ? parseFloat(newContract.subsidy_amount) : null,
        discount_percent: newContract.discount_percent ? parseFloat(newContract.discount_percent) : null,
        special_agreements: newContract.special_agreements || null,
        notes: newContract.notes || null,
      });
      toast.success('Vertrag erstellt');
      setShowNewContract(false);
      setNewContract({
        guardian_id: '',
        child_id: '',
        contract_type: 'flexible',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: '',
        monthly_fee: '',
        meal_fee: '',
        subsidy_amount: '',
        discount_percent: '',
        special_agreements: '',
        notes: '',
      });
    } catch (error) {
      toast.error('Fehler beim Erstellen');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Verträge"
        subtitle={`${contracts?.length || 0} Verträge gesamt`}
        rightAction={
          <Button variant="ghost" size="iconSm" onClick={() => setShowNewContract(true)}>
            <Plus size={20} />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Vertrag suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success-light">
                  <FileText className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-lg font-bold">{contracts?.filter(c => c.status === 'active').length || 0}</p>
                  <p className="text-xs text-muted-foreground">Aktiv</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-warning-light">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-lg font-bold">{contracts?.filter(c => c.status === 'pending').length || 0}</p>
                  <p className="text-xs text-muted-foreground">Ausstehend</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Keine Verträge gefunden
            </div>
          ) : (
            filteredContracts.map(contract => (
              <Card 
                key={contract.id} 
                className="border-border cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setSelectedContract(contract)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium">{contract.contract_number}</span>
                        <Badge className={cn('h-5 text-xs', statusColors[contract.status])}>
                          {statusLabels[contract.status]}
                        </Badge>
                      </div>
                      <p className="font-medium">
                        {contract.children?.first_name} {contract.children?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vertragspartner: {contract.guardians?.first_name} {contract.guardians?.last_name}
                      </p>
                    </div>
                    <Button variant="ghost" size="iconSm">
                      <Edit2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(contract.start_date), 'dd.MM.yyyy')}
                      {contract.end_date && ` - ${format(new Date(contract.end_date), 'dd.MM.yyyy')}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {contractTypeLabels[contract.contract_type]}
                    </span>
                    {contract.monthly_fee && (
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Euro size={12} />
                        {contract.monthly_fee}€/Monat
                      </span>
                    )}
                  </div>

                  {contract.contract_booking_times && contract.contract_booking_times.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {contract.contract_booking_times.map((time: any) => (
                        <Badge key={time.id} variant="outline" className="text-[10px]">
                          {time.weekday?.slice(0,2).toUpperCase()} {time.start_time?.slice(0,5)}-{time.end_time?.slice(0,5)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* New Contract Sheet */}
      <Sheet open={showNewContract} onOpenChange={setShowNewContract}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Neuer Vertrag</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Vertragspartner (Elternteil) *</Label>
              <Select 
                value={newContract.guardian_id} 
                onValueChange={(v) => setNewContract(prev => ({ ...prev, guardian_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elternteil wählen" />
                </SelectTrigger>
                <SelectContent>
                  {guardians?.map(g => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.first_name} {g.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kind *</Label>
              <Select 
                value={newContract.child_id} 
                onValueChange={(v) => setNewContract(prev => ({ ...prev, child_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kind wählen" />
                </SelectTrigger>
                <SelectContent>
                  {children?.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vertragsart</Label>
              <Select 
                value={newContract.contract_type} 
                onValueChange={(v: any) => setNewContract(prev => ({ ...prev, contract_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible Buchung</SelectItem>
                  <SelectItem value="halbtags">Halbtags</SelectItem>
                  <SelectItem value="ganztags">Ganztags</SelectItem>
                  <SelectItem value="stundenweise">Stundenweise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Startdatum *</Label>
                <Input
                  type="date"
                  value={newContract.start_date}
                  onChange={(e) => setNewContract(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Enddatum</Label>
                <Input
                  type="date"
                  value={newContract.end_date}
                  onChange={(e) => setNewContract(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Monatsbeitrag (€)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newContract.monthly_fee}
                  onChange={(e) => setNewContract(prev => ({ ...prev, monthly_fee: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Essensgeld (€)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newContract.meal_fee}
                  onChange={(e) => setNewContract(prev => ({ ...prev, meal_fee: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Zuschuss (€)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newContract.subsidy_amount}
                  onChange={(e) => setNewContract(prev => ({ ...prev, subsidy_amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Rabatt (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newContract.discount_percent}
                  onChange={(e) => setNewContract(prev => ({ ...prev, discount_percent: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sondervereinbarungen</Label>
              <Textarea
                placeholder="z.B. besondere Betreuungszeiten, Abholarrangements..."
                value={newContract.special_agreements}
                onChange={(e) => setNewContract(prev => ({ ...prev, special_agreements: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Notizen</Label>
              <Textarea
                placeholder="Interne Notizen..."
                value={newContract.notes}
                onChange={(e) => setNewContract(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="pt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewContract(false)}>
                Abbrechen
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleCreateContract}
                disabled={createContract.isPending}
              >
                {createContract.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Erstellen
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Contract Detail Sheet */}
      <Sheet open={!!selectedContract} onOpenChange={(open) => !open && setSelectedContract(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Vertrag {selectedContract?.contract_number}</SheetTitle>
          </SheetHeader>
          {selectedContract && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className={cn(statusColors[selectedContract.status])}>
                  {statusLabels[selectedContract.status]}
                </Badge>
                <Badge variant="outline">
                  {contractTypeLabels[selectedContract.contract_type]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Kind</p>
                  <p className="font-medium">{selectedContract.children?.first_name} {selectedContract.children?.last_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gruppe</p>
                  <p className="font-medium">{selectedContract.children?.groups?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vertragspartner</p>
                  <p className="font-medium">{selectedContract.guardians?.first_name} {selectedContract.guardians?.last_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kontakt</p>
                  <p className="font-medium">{selectedContract.guardians?.phone || selectedContract.guardians?.email || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Vertragsbeginn</p>
                  <p className="font-medium">{format(new Date(selectedContract.start_date), 'dd.MM.yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vertragsende</p>
                  <p className="font-medium">
                    {selectedContract.end_date ? format(new Date(selectedContract.end_date), 'dd.MM.yyyy') : 'Unbefristet'}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Kosten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monatsbeitrag</span>
                    <span className="font-medium">{selectedContract.monthly_fee ? `${selectedContract.monthly_fee}€` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Essensgeld</span>
                    <span className="font-medium">{selectedContract.meal_fee ? `${selectedContract.meal_fee}€` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Zuschuss</span>
                    <span className="font-medium text-success">{selectedContract.subsidy_amount ? `-${selectedContract.subsidy_amount}€` : '-'}</span>
                  </div>
                  {selectedContract.discount_percent && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rabatt</span>
                      <span className="font-medium text-success">-{selectedContract.discount_percent}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedContract.special_agreements && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sondervereinbarungen</p>
                  <p className="text-sm bg-secondary/50 p-2 rounded">{selectedContract.special_agreements}</p>
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  Bearbeiten
                </Button>
                <Button variant="outline" className="flex-1">
                  PDF Export
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
