import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileText, Table } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    children: any[];
    guardians: any[];
    contracts: any[];
  };
  activeTab: 'children' | 'guardians' | 'contracts';
}

export function ExportDialog({ open, onOpenChange, data, activeTab }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      if (exportFormat === 'csv') {
        exportToCSV();
      } else {
        exportToPDF();
      }
    } finally {
      setExporting(false);
      onOpenChange(false);
    }
  };

  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';

    if (activeTab === 'children') {
      // Extended headers for table view
      const headers = [
        'Name (Eltern)', 'Vorname (Eltern)', 'Vorname Kind', 'Nachname Kind',
        'Adresszusatz', 'Geburtsdatum', 'Adresse', 'PLZ', 'Ort',
        'Telefon Privat', 'Natel', 'Telefon Geschäftlich', 'E-Mail',
        'Gruppe', 'Vertragsstatus', 'Vertragsende'
      ];
      csvContent = headers.join(';') + '\n';
      
      data.children.forEach(child => {
        const guardian = child.primary_guardian;
        const contract = child.contracts?.[0];
        const row = [
          guardian?.last_name || '',
          guardian?.first_name || '',
          child.first_name,
          child.last_name,
          guardian?.address_street?.split(',')[1]?.trim() || '',
          child.birth_date ? format(new Date(child.birth_date), 'dd.MM.yyyy') : '',
          guardian?.address_street?.split(',')[0]?.trim() || guardian?.address_street || '',
          guardian?.address_zip || '',
          guardian?.address_city || '',
          guardian?.phone || '',
          guardian?.phone_secondary || '',
          '', // Geschäftstelefon
          guardian?.email || '',
          child.groups?.name || '',
          contract?.status || '',
          contract?.end_date ? format(new Date(contract.end_date), 'dd.MM.yyyy') : '',
        ];
        csvContent += row.join(';') + '\n';
      });
      filename = `kinder_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    } else if (activeTab === 'guardians') {
      const headers = ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Telefon 2', 'Strasse', 'PLZ', 'Ort'];
      csvContent = headers.join(';') + '\n';
      
      data.guardians.forEach(g => {
        const row = [
          g.first_name,
          g.last_name,
          g.email || '',
          g.phone || '',
          g.phone_secondary || '',
          g.address_street || '',
          g.address_zip || '',
          g.address_city || '',
        ];
        csvContent += row.join(';') + '\n';
      });
      filename = `eltern_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    } else {
      const headers = ['Vertragsnummer', 'Kind', 'Elternteil', 'Status', 'Startdatum', 'Enddatum', 'Monatsbeitrag'];
      csvContent = headers.join(';') + '\n';
      
      data.contracts.forEach(c => {
        const row = [
          c.contract_number || '',
          c.children ? `${c.children.first_name} ${c.children.last_name}` : '',
          c.guardians ? `${c.guardians.first_name} ${c.guardians.last_name}` : '',
          c.status,
          c.start_date ? format(new Date(c.start_date), 'dd.MM.yyyy') : '',
          c.end_date ? format(new Date(c.end_date), 'dd.MM.yyyy') : '',
          c.monthly_fee ? `${c.monthly_fee}€` : '',
        ];
        csvContent += row.join(';') + '\n';
      });
      filename = `vertraege_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    }

    // Download CSV
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportToPDF = () => {
    // For PDF, we'll create a printable HTML and use browser's print
    let content = `
      <html>
      <head>
        <title>Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #E91E8C; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          th { background-color: #E91E8C; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          tr.exiting { background-color: #FEF3C7; }
          .header { margin-bottom: 20px; }
          .date { color: #666; font-size: 12px; }
          .legend { margin-top: 15px; font-size: 11px; color: #666; }
          .legend-item { display: inline-flex; align-items: center; margin-right: 20px; }
          .legend-box { width: 15px; height: 15px; margin-right: 5px; border: 1px solid #ccc; }
          .exiting-box { background-color: #FEF3C7; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${activeTab === 'children' ? 'Kinder' : activeTab === 'guardians' ? 'Eltern' : 'Verträge'} - Export</h1>
          <p class="date">Erstellt am: ${format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
        </div>
    `;

    if (activeTab === 'children') {
      content += `
        <table>
          <tr>
            <th>Name (Eltern)</th>
            <th>Vorname (Eltern)</th>
            <th>Kind</th>
            <th>Geburt</th>
            <th>Adresse</th>
            <th>PLZ/Ort</th>
            <th>Tel. Privat</th>
            <th>Natel</th>
            <th>E-Mail</th>
            <th>Gruppe</th>
          </tr>
          ${data.children.map(child => {
            const guardian = child.primary_guardian;
            const contract = child.contracts?.[0];
            const endDate = contract?.end_date ? new Date(contract.end_date) : null;
            const isExiting = endDate && (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 30 && (endDate.getTime() - new Date().getTime()) >= 0;
            return `
              <tr class="${isExiting ? 'exiting' : ''}">
                <td>${guardian?.last_name || '-'}</td>
                <td>${guardian?.first_name || '-'}</td>
                <td>${child.first_name} ${child.last_name}</td>
                <td>${child.birth_date ? format(new Date(child.birth_date), 'dd.MM.yyyy') : ''}</td>
                <td>${guardian?.address_street || '-'}</td>
                <td>${guardian?.address_zip || ''} ${guardian?.address_city || ''}</td>
                <td>${guardian?.phone || '-'}</td>
                <td>${guardian?.phone_secondary || '-'}</td>
                <td>${guardian?.email || '-'}</td>
                <td>${child.groups?.name || '-'}</td>
              </tr>
            `;
          }).join('')}
        </table>
        <div class="legend">
          <div class="legend-item"><div class="legend-box exiting-box"></div> Austritt innerhalb 30 Tagen</div>
        </div>
      `;
    } else if (activeTab === 'guardians') {
      content += `
        <table>
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Telefon</th>
            <th>Adresse</th>
          </tr>
          ${data.guardians.map(g => `
            <tr>
              <td>${g.first_name} ${g.last_name}</td>
              <td>${g.email || '-'}</td>
              <td>${g.phone || '-'}${g.phone_secondary ? `<br/>${g.phone_secondary}` : ''}</td>
              <td>${[g.address_street, g.address_zip, g.address_city].filter(Boolean).join(', ') || '-'}</td>
            </tr>
          `).join('')}
        </table>
      `;
    } else {
      content += `
        <table>
          <tr>
            <th>Vertragsnr.</th>
            <th>Kind</th>
            <th>Elternteil</th>
            <th>Status</th>
            <th>Laufzeit</th>
            <th>Beitrag</th>
          </tr>
          ${data.contracts.map(c => `
            <tr>
              <td>${c.contract_number || '-'}</td>
              <td>${c.children ? `${c.children.first_name} ${c.children.last_name}` : '-'}</td>
              <td>${c.guardians ? `${c.guardians.first_name} ${c.guardians.last_name}` : '-'}</td>
              <td>${c.status}</td>
              <td>${c.start_date ? format(new Date(c.start_date), 'dd.MM.yyyy') : ''} - ${c.end_date ? format(new Date(c.end_date), 'dd.MM.yyyy') : 'unbefristet'}</td>
              <td>${c.monthly_fee ? `${c.monthly_fee}€` : '-'}</td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    content += '</body></html>';

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const tabLabels = {
    children: 'Kinder',
    guardians: 'Eltern',
    contracts: 'Verträge',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Daten exportieren</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Exportiere {activeTab === 'children' ? data.children.length : activeTab === 'guardians' ? data.guardians.length : data.contracts.length} {tabLabels[activeTab]} (gefilterte Ansicht)
          </p>

          <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as 'csv' | 'pdf')}>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                <Table className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">CSV / Excel</p>
                  <p className="text-xs text-muted-foreground">Zur Weiterverarbeitung in Tabellenprogrammen</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">PDF</p>
                  <p className="text-xs text-muted-foreground">Zum Drucken oder Archivieren</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button onClick={handleExport} className="w-full" disabled={exporting}>
            {exporting ? 'Exportiere...' : 'Exportieren'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
