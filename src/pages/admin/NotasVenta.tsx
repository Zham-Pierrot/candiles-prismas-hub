import { useState } from 'react';
import { mockSaleNotes } from '@/data/mockData';
import { SaleNote, SaleNoteStatus } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileDown, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

const statusStyles: Record<SaleNoteStatus, string> = {
  Pendiente: 'bg-warning/10 text-warning',
  Pagado: 'bg-success/10 text-success',
  Cancelado: 'bg-destructive/10 text-destructive',
};

export default function NotasVenta() {
  const [notes, setNotes] = useState<SaleNote[]>(mockSaleNotes);
  const [viewing, setViewing] = useState<SaleNote | null>(null);

  const updateStatus = (id: string, status: SaleNoteStatus) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, status } : n)));
    if (viewing?.id === id) setViewing({ ...viewing!, status });
  };

  if (viewing) {
    return (
      <div className="animate-slide-in-left max-w-4xl">
        <Button variant="ghost" onClick={() => setViewing(null)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading">{viewing.number}</CardTitle>
              <p className="text-sm text-muted-foreground">{viewing.clientName} — {viewing.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewing.status} onValueChange={(v) => updateStatus(viewing.id, v as SaleNoteStatus)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['Pendiente', 'Pagado', 'Cancelado'] as SaleNoteStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-24">Cant.</TableHead>
                  <TableHead className="w-32">Precio Unit.</TableHead>
                  <TableHead className="w-32 text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewing.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice.toLocaleString('es-MX')}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.unitPrice).toLocaleString('es-MX')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${viewing.subtotal.toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>${viewing.iva.toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total</span><span>${viewing.total.toLocaleString('es-MX')}</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => toast.info('Descarga de PDF próximamente')}><FileDown className="h-4 w-4 mr-2" /> PDF</Button>
              {viewing.status === 'Pagado' && (
                <Button variant="outline" onClick={() => toast.info('Facturación próximamente')}><FileCheck className="h-4 w-4 mr-2" /> Generar Factura</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-heading text-2xl font-bold">Notas de Venta</h2>
      <div className="space-y-3">
        {notes.map((n) => (
          <Card key={n.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewing(n)}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-heading font-semibold">{n.number}</p>
                <p className="text-sm text-muted-foreground">{n.clientName} — {n.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${n.total.toLocaleString('es-MX')}</span>
                <Badge className={statusStyles[n.status]}>{n.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
