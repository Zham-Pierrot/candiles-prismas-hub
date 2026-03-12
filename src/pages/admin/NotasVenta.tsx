import { useState } from 'react';
import { mockSaleNotes } from '@/data/mockData';
import { SaleNote, SaleNoteStatus, Payment, PaymentMethod } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileDown, FileCheck, Plus, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const statusStyles: Record<SaleNoteStatus, string> = {
  Pendiente: 'bg-warning/10 text-warning',
  Pagado: 'bg-success/10 text-success',
  Cancelado: 'bg-destructive/10 text-destructive',
};

const paymentMethods: PaymentMethod[] = ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque'];

export default function NotasVenta() {
  const [notes, setNotes] = useState<SaleNote[]>(mockSaleNotes);
  const [viewing, setViewing] = useState<SaleNote | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({ method: 'Transferencia', amount: 0, reference: '', date: new Date().toISOString().split('T')[0] });

  const updateStatus = (id: string, status: SaleNoteStatus) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, status } : n)));
    if (viewing?.id === id) setViewing({ ...viewing!, status });
  };

  const getTotalPaid = (note: SaleNote) => (note.payments || []).reduce((s, p) => s + p.amount, 0);
  const getBalance = (note: SaleNote) => note.total - getTotalPaid(note);

  const addPayment = () => {
    if (!viewing || !newPayment.amount) return;
    const payment: Payment = {
      id: String(Date.now()),
      saleNoteId: viewing.id,
      amount: newPayment.amount || 0,
      method: (newPayment.method as PaymentMethod) || 'Transferencia',
      date: newPayment.date || new Date().toISOString().split('T')[0],
      reference: newPayment.reference || '',
    };
    const updatedNote = { ...viewing, payments: [...(viewing.payments || []), payment] };
    const newBalance = updatedNote.total - getTotalPaid(updatedNote);
    if (newBalance <= 0) updatedNote.status = 'Pagado';
    setViewing(updatedNote);
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    setShowPaymentForm(false);
    setNewPayment({ method: 'Transferencia', amount: 0, reference: '', date: new Date().toISOString().split('T')[0] });
    toast.success('Pago registrado');
  };

  if (viewing) {
    const totalPaid = getTotalPaid(viewing);
    const balance = getBalance(viewing);

    return (
      <div className="animate-slide-in-left max-w-4xl">
        <Button variant="ghost" onClick={() => { setViewing(null); setShowPaymentForm(false); }} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
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

            {/* Payments Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Pagos</h4>
                {viewing.status !== 'Cancelado' && balance > 0 && (
                  <Button size="sm" variant="outline" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Registrar Pago
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card><CardContent className="py-3 text-center"><p className="text-xs text-muted-foreground">Total</p><p className="font-bold font-heading">${viewing.total.toLocaleString('es-MX')}</p></CardContent></Card>
                <Card><CardContent className="py-3 text-center"><p className="text-xs text-muted-foreground">Pagado</p><p className="font-bold font-heading text-success">${totalPaid.toLocaleString('es-MX')}</p></CardContent></Card>
                <Card><CardContent className="py-3 text-center"><p className="text-xs text-muted-foreground">Saldo</p><p className={`font-bold font-heading ${balance > 0 ? 'text-warning' : 'text-success'}`}>${balance.toLocaleString('es-MX')}</p></CardContent></Card>
              </div>

              {showPaymentForm && (
                <Card className="mb-4 border-primary/20">
                  <CardContent className="py-4">
                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Monto</Label>
                        <Input type="number" value={newPayment.amount || ''} onChange={e => setNewPayment({ ...newPayment, amount: Number(e.target.value) })} placeholder={`Max: $${balance.toLocaleString('es-MX')}`} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Método</Label>
                        <Select value={newPayment.method} onValueChange={v => setNewPayment({ ...newPayment, method: v as PaymentMethod })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Referencia</Label>
                        <Input value={newPayment.reference || ''} onChange={e => setNewPayment({ ...newPayment, reference: e.target.value })} />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addPayment} className="w-full">Guardar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {viewing.payments && viewing.payments.length > 0 ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Método</TableHead><TableHead>Referencia</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {viewing.payments.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>{p.date}</TableCell>
                        <TableCell><Badge variant="secondary">{p.method}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{p.reference || '—'}</TableCell>
                        <TableCell className="text-right font-medium">${p.amount.toLocaleString('es-MX')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <p className="text-sm text-muted-foreground">Sin pagos registrados</p>}
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
