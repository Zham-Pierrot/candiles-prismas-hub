import { useState } from 'react';
import { mockQuotes, mockClients, mockProducts } from '@/data/mockData';
import { Quote, QuoteItem, QuoteStatus } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowLeft, FileDown, Send, Receipt, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateQuotePDF } from '@/lib/pdfGenerator';

const statusStyles: Record<QuoteStatus, string> = {
  Borrador: 'bg-muted text-muted-foreground',
  Enviada: 'bg-primary/10 text-primary',
  Aceptada: 'bg-success/10 text-success',
  Rechazada: 'bg-destructive/10 text-destructive',
};

export default function Cotizaciones() {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [isNew, setIsNew] = useState(false);
  const navigate = useNavigate();

  const handleSave = (q: Quote) => {
    if (isNew) {
      const num = `COT-2025-${String(quotes.length + 1).padStart(3, '0')}`;
      setQuotes([...quotes, { ...q, id: String(Date.now()), number: num, date: new Date().toISOString().split('T')[0] }]);
    } else {
      setQuotes(quotes.map((x) => (x.id === q.id ? q : x)));
    }
    setEditing(null);
    setIsNew(false);
  };

  const convertToSaleNote = (q: Quote) => {
    toast.success(`Cotización ${q.number} convertida a Nota de Venta`);
    navigate('/admin/notas-venta');
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: '', number: '', clientId: '', clientName: '', date: '', items: [], subtotal: 0, iva: 0, total: 0, status: 'Borrador' });
  };

  if (editing) {
    return <QuoteForm quote={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} isNew={isNew} onConvert={convertToSaleNote} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Cotizaciones</h2>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Nueva Cotización</Button>
      </div>

      <div className="space-y-3">
        {quotes.map((q) => (
          <Card key={q.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setEditing(q)}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-heading font-semibold">{q.number}</p>
                <p className="text-sm text-muted-foreground">{q.clientName} — {q.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${q.total.toLocaleString('es-MX')}</span>
                <Badge className={statusStyles[q.status]}>{q.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuoteForm({ quote, onSave, onCancel, isNew, onConvert }: {
  quote: Quote; onSave: (q: Quote) => void; onCancel: () => void; isNew: boolean; onConvert: (q: Quote) => void;
}) {
  const [form, setForm] = useState(quote);

  const recalc = (items: QuoteItem[]) => {
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const iva = subtotal * 0.16;
    return { items, subtotal, iva, total: subtotal + iva };
  };

  const addItem = () => {
    const p = mockProducts[0];
    const updated = recalc([...form.items, { productId: p.id, productName: p.name, quantity: 1, unitPrice: p.price }]);
    setForm({ ...form, ...updated });
  };

  const updateItem = (idx: number, field: string, value: string | number) => {
    const items = [...form.items];
    if (field === 'productId') {
      const p = mockProducts.find((x) => x.id === value)!;
      items[idx] = { ...items[idx], productId: p.id, productName: p.name, unitPrice: p.price };
    } else {
      items[idx] = { ...items[idx], [field]: value };
    }
    setForm({ ...form, ...recalc(items) });
  };

  const removeItem = (idx: number) => {
    const items = form.items.filter((_, i) => i !== idx);
    setForm({ ...form, ...recalc(items) });
  };

  const selectClient = (clientId: string) => {
    const c = mockClients.find((x) => x.id === clientId);
    if (c) setForm({ ...form, clientId: c.id, clientName: c.name });
  };

  return (
    <div className="animate-slide-in-left max-w-4xl">
      <Button variant="ghost" onClick={onCancel} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">{isNew ? 'Nueva Cotización' : `Cotización ${form.number}`}</CardTitle>
          {!isNew && form.status === 'Aceptada' && (
            <Button variant="outline" onClick={() => onConvert(form)}><Receipt className="h-4 w-4 mr-2" /> Convertir a Nota de Venta</Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={selectClient}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                  <SelectContent>{mockClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as QuoteStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['Borrador', 'Enviada', 'Aceptada', 'Rechazada'] as QuoteStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base">Productos / Servicios</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="w-24">Cant.</TableHead>
                    <TableHead className="w-32">Precio Unit.</TableHead>
                    <TableHead className="w-32 text-right">Subtotal</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Select value={item.productId} onValueChange={(v) => updateItem(idx, 'productId', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{mockProducts.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} /></TableCell>
                      <TableCell><Input type="number" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))} /></TableCell>
                      <TableCell className="text-right font-medium">${(item.quantity * item.unitPrice).toLocaleString('es-MX')}</TableCell>
                      <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${form.subtotal.toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>${form.iva.toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total</span><span>${form.total.toLocaleString('es-MX')}</span></div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 flex-wrap">
              <Button type="submit">{isNew ? 'Crear Cotización' : 'Guardar'}</Button>
              <Button type="button" variant="outline" onClick={() => toast.info('Descarga de PDF próximamente')}><FileDown className="h-4 w-4 mr-2" /> PDF</Button>
              <Button type="button" variant="outline" onClick={() => toast.info('Envío por correo próximamente')}><Send className="h-4 w-4 mr-2" /> Enviar</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
