import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, X, ChevronUp, ChevronDown, Table2, LayoutList } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface TableViewProps {
  children: any[];
  guardians: any[];
  contracts: any[];
  groups: any[];
  onExport: () => void;
}

type SortDirection = 'asc' | 'desc' | null;
type SortColumn = string | null;

interface FilterState {
  nachname: string;
  vornameEltern: string;
  vornameKind: string;
  adresszusatz: string;
  geburt: string;
  adresse: string;
  plz: string;
  ort: string;
  telefonP: string;
  natel: string;
  telefonG: string;
  email: string;
  gruppe: string;
  austritt: string;
}

export function VerwaltungTableView({ children, guardians, contracts, groups, onExport }: TableViewProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<FilterState>({
    nachname: '',
    vornameEltern: '',
    vornameKind: '',
    adresszusatz: '',
    geburt: '',
    adresse: '',
    plz: '',
    ort: '',
    telefonP: '',
    natel: '',
    telefonG: '',
    email: '',
    gruppe: 'all',
    austritt: 'all',
  });

  // Create enriched data with guardian info joined to children
  const enrichedData = useMemo(() => {
    return children.map(child => {
      const primaryGuardian = child.primary_guardian || guardians.find(g => g.id === child.primary_guardian_id);
      const childContracts = contracts.filter(c => c.child_id === child.id);
      const activeContract = childContracts.find(c => c.status === 'active') || childContracts[0];
      
      // Check if contract ends within 30 days
      let exitingSoon = false;
      let daysUntilExit: number | null = null;
      if (activeContract?.end_date) {
        const endDate = new Date(activeContract.end_date);
        const today = new Date();
        daysUntilExit = differenceInDays(endDate, today);
        exitingSoon = daysUntilExit >= 0 && daysUntilExit <= 30;
      }

      return {
        id: child.id,
        nachname: primaryGuardian?.last_name || '',
        vornameEltern: primaryGuardian ? `${primaryGuardian.first_name}` : '',
        vornameKind: child.first_name,
        nachnameKind: child.last_name,
        adresszusatz: primaryGuardian?.address_street?.split(',')[1]?.trim() || '',
        geburt: child.birth_date,
        adresse: primaryGuardian?.address_street?.split(',')[0]?.trim() || primaryGuardian?.address_street || '',
        plz: primaryGuardian?.address_zip || '',
        ort: primaryGuardian?.address_city || '',
        telefonP: primaryGuardian?.phone || '',
        natel: primaryGuardian?.phone_secondary || '',
        telefonG: '', // Geschäftstelefon - could be added to guardian model
        email: primaryGuardian?.email || '',
        gruppe: child.groups?.name || '',
        gruppeId: child.group_id,
        gruppeColor: child.groups?.color,
        contract: activeContract,
        exitingSoon,
        daysUntilExit,
        endDate: activeContract?.end_date,
      };
    });
  }, [children, guardians, contracts]);

  // Apply filters
  const filteredData = useMemo(() => {
    return enrichedData.filter(row => {
      const matchesNachname = filters.nachname === '' || 
        row.nachname.toLowerCase().includes(filters.nachname.toLowerCase());
      const matchesVornameEltern = filters.vornameEltern === '' || 
        row.vornameEltern.toLowerCase().includes(filters.vornameEltern.toLowerCase());
      const matchesVornameKind = filters.vornameKind === '' || 
        row.vornameKind.toLowerCase().includes(filters.vornameKind.toLowerCase());
      const matchesAdresszusatz = filters.adresszusatz === '' || 
        row.adresszusatz.toLowerCase().includes(filters.adresszusatz.toLowerCase());
      const matchesGeburt = filters.geburt === '' || 
        (row.geburt && format(new Date(row.geburt), 'dd.MM.yyyy').includes(filters.geburt));
      const matchesAdresse = filters.adresse === '' || 
        row.adresse.toLowerCase().includes(filters.adresse.toLowerCase());
      const matchesPlz = filters.plz === '' || row.plz.includes(filters.plz);
      const matchesOrt = filters.ort === '' || 
        row.ort.toLowerCase().includes(filters.ort.toLowerCase());
      const matchesTelefonP = filters.telefonP === '' || row.telefonP.includes(filters.telefonP);
      const matchesNatel = filters.natel === '' || row.natel.includes(filters.natel);
      const matchesTelefonG = filters.telefonG === '' || row.telefonG.includes(filters.telefonG);
      const matchesEmail = filters.email === '' || 
        row.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesGruppe = filters.gruppe === 'all' || row.gruppeId === filters.gruppe;
      
      let matchesAustritt = true;
      if (filters.austritt === 'exiting') {
        matchesAustritt = row.exitingSoon === true;
      } else if (filters.austritt === 'active') {
        matchesAustritt = !row.exitingSoon && row.contract?.status === 'active';
      }

      return matchesNachname && matchesVornameEltern && matchesVornameKind && 
        matchesAdresszusatz && matchesGeburt && matchesAdresse && matchesPlz && 
        matchesOrt && matchesTelefonP && matchesNatel && matchesTelefonG && 
        matchesEmail && matchesGruppe && matchesAustritt;
    });
  }, [enrichedData, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a] || '';
      const bVal = b[sortColumn as keyof typeof b] || '';
      
      if (sortDirection === 'asc') {
        return String(aVal).localeCompare(String(bVal));
      } else {
        return String(bVal).localeCompare(String(aVal));
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      nachname: '',
      vornameEltern: '',
      vornameKind: '',
      adresszusatz: '',
      geburt: '',
      adresse: '',
      plz: '',
      ort: '',
      telefonP: '',
      natel: '',
      telefonG: '',
      email: '',
      gruppe: 'all',
      austritt: 'all',
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'gruppe' || key === 'austritt') return value !== 'all';
    return value !== '';
  });

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-3 w-3" /> : 
      <ChevronDown className="h-3 w-3" />;
  };

  const columns = [
    { key: 'nachname', label: 'Name (Eltern)', width: 'w-32' },
    { key: 'vornameEltern', label: 'Vorname (Eltern)', width: 'w-32' },
    { key: 'vornameKind', label: 'Vorname Kind', width: 'w-28' },
    { key: 'adresszusatz', label: 'Adresszusatz', width: 'w-28' },
    { key: 'geburt', label: 'Geburt', width: 'w-24' },
    { key: 'adresse', label: 'Adresse', width: 'w-40' },
    { key: 'plz', label: 'PLZ', width: 'w-20' },
    { key: 'ort', label: 'Ort', width: 'w-28' },
    { key: 'telefonP', label: 'Tel. Privat', width: 'w-28' },
    { key: 'natel', label: 'Natel', width: 'w-28' },
    { key: 'telefonG', label: 'Tel. Geschäft', width: 'w-28' },
    { key: 'email', label: 'E-Mail', width: 'w-44' },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={filters.gruppe} onValueChange={(v) => updateFilter('gruppe', v)}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Gruppe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Gruppen</SelectItem>
            {groups?.map(g => (
              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.austritt} onValueChange={(v) => updateFilter('austritt', v)}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Austrittsstatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="active">Aktiv (kein Austritt)</SelectItem>
            <SelectItem value="exiting">Austritt in 30 Tagen</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" /> Filter löschen
          </Button>
        )}
        
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className="h-8 px-3">
            {sortedData.length} Einträge
          </Badge>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map(col => (
                  <TableHead 
                    key={col.key}
                    className={cn("cursor-pointer hover:bg-muted/80 select-none", col.width)}
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon column={col.key} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
              {/* Filter Row */}
              <TableRow className="bg-muted/30">
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.nachname}
                    onChange={(e) => updateFilter('nachname', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.vornameEltern}
                    onChange={(e) => updateFilter('vornameEltern', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.vornameKind}
                    onChange={(e) => updateFilter('vornameKind', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.adresszusatz}
                    onChange={(e) => updateFilter('adresszusatz', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.geburt}
                    onChange={(e) => updateFilter('geburt', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.adresse}
                    onChange={(e) => updateFilter('adresse', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.plz}
                    onChange={(e) => updateFilter('plz', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.ort}
                    onChange={(e) => updateFilter('ort', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.telefonP}
                    onChange={(e) => updateFilter('telefonP', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.natel}
                    onChange={(e) => updateFilter('natel', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.telefonG}
                    onChange={(e) => updateFilter('telefonG', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="p-1">
                  <Input
                    placeholder="Filter..."
                    value={filters.email}
                    onChange={(e) => updateFilter('email', e.target.value)}
                    className="h-7 text-xs"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    Keine Einträge gefunden
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map(row => (
                  <TableRow 
                    key={row.id}
                    className={cn(
                      "transition-colors",
                      row.exitingSoon && "bg-[hsl(var(--exiting-light))] hover:bg-[hsl(var(--exiting-light))]"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {row.nachname}
                        {row.exitingSoon && (
                          <Badge variant="destructive" className="text-[10px] h-5 bg-[hsl(var(--exiting))]">
                            {row.daysUntilExit === 0 ? 'Heute' : `${row.daysUntilExit}T`}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{row.vornameEltern}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row.gruppeColor && (
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: row.gruppeColor }}
                          />
                        )}
                        {row.vornameKind}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{row.adresszusatz}</TableCell>
                    <TableCell className="text-sm">
                      {row.geburt && format(new Date(row.geburt), 'dd.MM.yyyy')}
                    </TableCell>
                    <TableCell className="text-sm">{row.adresse}</TableCell>
                    <TableCell className="text-sm">{row.plz}</TableCell>
                    <TableCell className="text-sm">{row.ort}</TableCell>
                    <TableCell className="text-sm">{row.telefonP}</TableCell>
                    <TableCell className="text-sm">{row.natel}</TableCell>
                    <TableCell className="text-sm">{row.telefonG || '-'}</TableCell>
                    <TableCell className="text-sm text-primary">{row.email}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[hsl(var(--exiting-light))] border border-[hsl(var(--exiting))]" />
          <span>Austritt innerhalb 30 Tagen</span>
        </div>
      </div>
    </div>
  );
}
