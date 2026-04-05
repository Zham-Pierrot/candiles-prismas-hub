import { useState, useMemo } from 'react';
import { mockQuotes, mockClients, mockProducts } from '@/data/mockData';
import { Quote, QuoteItem, QuoteStatus } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DataTableERP, StatusBadge, type ColumnDef, type RowAction, type StatusConfig } from '@/components/admin/DataTableERP';
import { useTableFilters } from '@/hooks/useTableFilters';
import { Plus, FileDown, Send, Receipt, Trash2, Eye, Pencil, ArrowRightLeft, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateQuotePDF } from '@/lib/pdfGenerator';

const statusConfig: StatusConfig = {
  Borrador: { label: 'Borrador', className: 'bg-muted text-muted-foreground' },
  Enviada: { label: 'Enviada', className: 'bg-primary/10 text-primary' },
  Aceptada: { label: 'Aceptada', className: 'bg-[hsl(270,50%,50%)]/10 text-[hsl(270,50%,50%)]' },
  Rechazada: { label: 'Rechazada', className: 'bg-destructive/10 text-destructive' },
};

export default function Cotizaciones() {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const navigate = useNavigate();

  const filters = useTableFilters<Quote>({
    data: quotes,
    searchFields: ['number', 'clientName'],
    dateField: 'date',
    statusField: 'status',
    clientField: 'clientName',
    defaultSort: { field: 'date', direction: 'desc' },
  });

  // KPIs
  const kpis = useMemo(() => {
    const total = quotes.length;
    const enviadas = quotes.filter(q => q.status === 'Enviada').length;
    const aceptadas = quotes.filter(q => q.status === 'Aceptada').length;
    const montoTotal = quotes.reduce((s, q) => s + q.total, 0);
    return [
      { label: 'Total Cotizaciones', value: total, icon: <FileText className="h-4 w-4" />, color: 'bg-primary/10 text-primary' },
      { label: 'Enviadas', value: enviadas, icon: <Clock className="h-4 w-4" />, color: 'bg-primary/10 text-primary' },
      { label: 'Aceptadas', value: aceptadas, icon: <CheckCircle className="h-4 w-4" />, color: 'bg-success/10 text-success' },
      { label: 'Monto Total', value: `$${montoTotal.toLocaleString('es-MX')}`, icon: <DollarSign className="h-4 w-4" />, color: 'bg-warning/10 text-warning' },
    ];
  }, [quotes]);

  const columns: ColumnDef<Quote>[] = [
    { key: 'number', label: 'Folio', sortable: true, render: q => <span className="font-heading font-semibold text-sm">{q.number}</span> },
    { key: 'clientName', label: 'Cliente', sortable: true, hideOnMobile: true },
    { key: 'date', label: 'Fecha', sortable: true, hideOnMobile: true },
    { key: 'total', label: 'Total', sortable: true, className: 'text-right', render: q => <span className="font-semibold">${q.total.toLocaleString('es-MX')}</span> },
    { key: 'status', label: 'Estado', render: q => <StatusBadge status={q.status} config={statusConfig} /> },
  ];

  const actions: RowAction<Quote>[] = [
    { label: 'Ver detalle', icon: <Eye className="h-4 w-4" />, onClick: q => openDrawer(q, false) },
    { label: 'Editar', icon: <Pencil className="h-4 w-4" />, onClick: q => openDrawer(q, true) },
    { label: 'Descargar PDF', icon: <FileDown className="h-4 w-4" />, onClick: q => generateQuotePDF(q) },
    { label: 'Enviar por correo', icon: <Send className="h-4 w-4" />, onClick: () => toast.info('Envío por correo próximamente') },
    { label: 'Convertir a Nota de Venta', icon: <ArrowRightLeft className="h-4 w-4" />, onClick: q => { toast.success(`Cotización ${q.number} convertida a Nota de Venta`); navigate('/admin/notas-venta'); }, separator: true },
  ];

  const openDrawer = (q: Quote, edit: boolean) => {
    setSelectedQuote(q);
    setEditMode(edit);
    setIsNew(false);
    setDrawerOpen(true);
  };

  const startNew = () => {
    setSelectedQuote({ id: '', number: '', clientId: '', clientName: '', date: '', items: [], subtotal: 0, iva: 0, total: 0, status: 'Borrador' });
    setEditMode(true);
    setIsNew(true);
    setDrawerOpen(true);
  };

  const handleSave = (q: Quote) => {
    if (isNew) {
      const num = `COT-2025-${String(quotes.length + 1).padStart(3, '0')}`;
      setQuotes([...quotes, { ...q, id: String(Date.now()), number: num, date: new Date().toISOString().split('T')[0] }]);
      toast.success('Cotización creada');
    } else {
      setQuotes(quotes.map(x => x.id === q.id ? q : x));
      toast.success('Cotización actualizada');
    }
    setDrawerOpen(false);
  };

  const mobileCard = (q: Quote) => (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-heading font-semibold text-sm">{q.number}</span>
        <StatusBadge status={q.status} config={statusConfig} />
      </div>
      <p className="text-sm text-muted-foreground">{q.clientName}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-muted-foreground">{q.date}</span>
        <span className="font-semibold text-sm">${q.total.toLocaleString('es-MX')}</span>
      </div>
    </div>
  );

  return (
    <>
      <DataTableERP<Quote>
        title="Cotizaciones"
        kpis={kpis}
        columns={columns}
        data={filters.paginatedData}
        actions={actions}
        statuses={statusConfig}
        statusOptions={['Borrador', 'Enviada', 'Aceptada', 'Rechazada']}
        search={filters.search}
        onSearchChange={filters.setSearch}
        statusFilter={filters.statusFilter}
        onStatusChange={filters.setStatusFilter}
        dateFilter={filters.dateFilter}
        onDateChange={filters.setDateFilter}
        clientFilter={filters.clientFilter}
        onClientChange={filters.setClientFilter}
        clients={filters.uniqueClients}
        sortField={String(filters.sortField)}
        sortDirection={filters.sortDirection}
        onSort={f => filters.toggleSort(f as keyof Quote)}
        page={filters.page}
        pageSize={filters.pageSize}
        totalPages={filters.totalPages}
        totalFiltered={filters.totalFiltered}
        onPageChange={filters.setPage}
        onPageSizeChange={s => filters.setPageSize(s as 10 | 20 | 50)}
        onRowClick={q => openDrawer(q, false)}
        getItemId={q => q.id}
        mobileCardRender={mobileCard}
        headerActions={<Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Nueva Cotización</Button>}
      />

      {/* Detail / Edit Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading">{isNew ? 'Nueva Cotización' : editMode ? `Editar ${selectedQuote?.number}` : selectedQuote?.number}</SheetTitle>
          </SheetHeader>
          {selectedQuote && (
            editMode
              ? <QuoteFormInline quote={selectedQuote} onSave={handleSave} onCancel={() => setDrawerOpen(false)} isNew={isNew} />
              : <QuoteDetail quote={selectedQuote} onEdit={() => setEditMode(true)} onConvert={() => { toast.success(`Cotización ${selectedQuote.number} convertida a Nota de Venta`); navigate('/admin/notas-venta'); }} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

// ─── Detail View ───
function QuoteDetail({ quote, onEdit, onConvert }: { quote: Quote; onEdit: () => void; onConvert: () => void }) {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div><p className="text-xs text-muted-foreground">Cliente</p><p className="font-medium">{quote.clientName}</p></div>
        <div><p className="text-xs text-muted-foreground">Fecha</p><p className="font-medium">{quote.date}</p></div>
        <div><p className="text-xs text-muted-foreground">Estado</p><StatusBadge status={quote.status} config={statusConfig} /></div>
        <div><p className="text-xs text-muted-foreground">Folio</p><p className="font-medium">{quote.number}</p></div>
      </div>

      <div>
        <h4 className="font-heading font-semibold text-sm mb-2">Productos / Servicios</h4>
        <Table>
          <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead className="w-16">Cant.</TableHead><TableHead className="w-28 text-right">P. Unit.</TableHead><TableHead className="w-28 text-right">Subtotal</TableHead></TableRow></TableHeader>
          <TableBody>
            {quote.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="py-2">{item.productName}</TableCell>
                <TableCell className="py-2">{item.quantity}</TableCell>
                <TableCell className="py-2 text-right">${item.unitPrice.toLocaleString('es-MX')}</TableCell>
                <TableCell className="py-2 text-right font-medium">${(item.quantity * item.unitPrice).toLocaleString('es-MX')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <div className="w-56 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${quote.subtotal.toLocaleString('es-MX')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>${quote.iva.toLocaleString('es-MX')}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total</span><span>${quote.total.toLocaleString('es-MX')}</span></div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap pt-2">
        <Button onClick={onEdit}><Pencil className="h-4 w-4 mr-2" /> Editar</Button>
        <Button variant="outline" onClick={() => generateQuotePDF(quote)}><FileDown className="h-4 w-4 mr-2" /> PDF</Button>
        <Button variant="outline" onClick={() => toast.info('Envío por correo próximamente')}><Send className="h-4 w-4 mr-2" /> Enviar</Button>
        {quote.status === 'Aceptada' && (
          <Button variant="outline" onClick={onConvert}><Receipt className="h-4 w-4 mr-2" /> Convertir a NV</Button>
        )}
      </div>
    </div>
  );
}

// ─── Inline Form ───
function QuoteFormInline({ quote, onSave, onCancel, isNew }: { quote: Quote; onSave: (q: Quote) => void; onCancel: () => void; isNew: boolean }) {
  const [form, setForm] = useState(quote);

  const recalc = (items: QuoteItem[]) => {
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const iva = subtotal * 0.16;
    return { items, subtotal, iva, total: subtotal + iva };
  };

  const addItem = () => {
    const p = mockProducts[0];
    setForm({ ...form, ...recalc([...form.items, { productId: p.id, productName: p.name, quantity: 1, unitPrice: p.price }]) });
  };

  const updateItem = (idx: number, field: string, value: string | number) => {
    const items = [...form.items];
    if (field === 'productId') {
      const p = mockProducts.find(x => x.id === value)!;
      items[idx] = { ...items[idx], productId: p.id, productName: p.name, unitPrice: p.price };
    } else {
      items[idx] = { ...items[idx], [field]: value };
    }
    setForm({ ...form, ...recalc(items) });
  };

  const removeItem = (idx: number) => setForm({ ...form, ...recalc(form.items.filter((_, i) => i !== idx)) });

  const selectClient = (clientId: string) => {
    const c = mockClients.find(x => x.id === clientId);
    if (c) setForm({ ...form, clientId: c.id, clientName: c.name });
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5 mt-4">
      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Cliente</Label>
          <Select value={form.clientId} onValueChange={selectClient}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{mockClients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Estado</Label>
          <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as QuoteStatus })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{(['Borrador', 'Enviada', 'Aceptada', 'Rechazada'] as QuoteStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Productos / Servicios</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar</Button>
        </div>
        <div className="space-y-2">
          {form.items.map((item, idx) => (
            <Card key={idx} className="border">
              <CardContent className="py-3 px-3 space-y-2">
                <Select value={item.productId} onValueChange={v => updateItem(idx, 'productId', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{mockProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label className="text-[10px]">Cant.</Label><Input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-[10px]">Precio</Label><Input type="number" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="flex items-end gap-1">
                    <div className="flex-1"><Label className="text-[10px]">Subtotal</Label><p className="text-xs font-semibold h-8 flex items-center">${(item.quantity * item.unitPrice).toLocaleString('es-MX')}</p></div>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(idx)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-56 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${form.subtotal.toLocaleString('es-MX')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>${form.iva.toLocaleString('es-MX')}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total</span><span>${form.total.toLocaleString('es-MX')}</span></div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit">{isNew ? 'Crear' : 'Guardar'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
