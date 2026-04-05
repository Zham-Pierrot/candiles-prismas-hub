import { useState, useMemo } from 'react';
import { mockSaleNotes } from '@/data/mockData';
import { SaleNote, SaleNoteStatus, Payment, PaymentMethod } from '@/types/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DataTableERP, StatusBadge, type ColumnDef, type RowAction, type StatusConfig } from '@/components/admin/DataTableERP';
import { useTableFilters } from '@/hooks/useTableFilters';
import { FileDown, FileCheck, Plus, CreditCard, Eye, Pencil, DollarSign, Clock, CheckCircle, FileText, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateSaleNotePDF } from '@/lib/pdfGenerator';

const statusConfig: StatusConfig = {
  Pendiente: { label: 'Pendiente', className: 'bg-warning/10 text-warning' },
  Pagado: { label: 'Pagado', className: 'bg-success/10 text-success' },
  Cancelado: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive' },
};

const paymentMethods: PaymentMethod[] = ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque'];

export default function NotasVenta() {
  const [notes, setNotes] = useState<SaleNote[]>(mockSaleNotes);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SaleNote | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({ method: 'Transferencia', amount: 0, reference: '', date: new Date().toISOString().split('T')[0] });

  const filters = useTableFilters<SaleNote>({
    data: notes,
    searchFields: ['number', 'clientName'],
    dateField: 'date',
    statusField: 'status',
    clientField: 'clientName',
    defaultSort: { field: 'date', direction: 'desc' },
  });

  const getTotalPaid = (n: SaleNote) => (n.payments || []).reduce((s, p) => s + p.amount, 0);
  const getBalance = (n: SaleNote) => n.total - getTotalPaid(n);

  // KPIs
  const kpis = useMemo(() => {
    const total = notes.length;
    const pendientes = notes.filter(n => n.status === 'Pendiente').length;
    const pagadas = notes.filter(n => n.status === 'Pagado').length;
    const montoCobrado = notes.filter(n => n.status === 'Pagado').reduce((s, n) => s + n.total, 0);
    return [
      { label: 'Total Notas', value: total, icon: <FileText className="h-4 w-4" />, color: 'bg-primary/10 text-primary' },
      { label: 'Pendientes', value: pendientes, icon: <Clock className="h-4 w-4" />, color: 'bg-warning/10 text-warning' },
      { label: 'Pagadas', value: pagadas, icon: <CheckCircle className="h-4 w-4" />, color: 'bg-success/10 text-success' },
      { label: 'Monto Cobrado', value: `$${montoCobrado.toLocaleString('es-MX')}`, icon: <DollarSign className="h-4 w-4" />, color: 'bg-success/10 text-success' },
    ];
  }, [notes]);

  const columns: ColumnDef<SaleNote>[] = [
    { key: 'number', label: 'Folio', sortable: true, render: n => <span className="font-heading font-semibold text-sm">{n.number}</span> },
    { key: 'clientName', label: 'Cliente', sortable: true, hideOnMobile: true },
    { key: 'date', label: 'Fecha', sortable: true, hideOnMobile: true },
    { key: 'total', label: 'Total', sortable: true, className: 'text-right', render: n => <span className="font-semibold">${n.total.toLocaleString('es-MX')}</span> },
    { key: 'balance', label: 'Saldo', className: 'text-right', hideOnMobile: true, render: n => {
      const bal = getBalance(n);
      return <span className={`font-medium ${bal > 0 ? 'text-warning' : 'text-success'}`}>${bal.toLocaleString('es-MX')}</span>;
    }},
    { key: 'status', label: 'Estado', render: n => <StatusBadge status={n.status} config={statusConfig} /> },
  ];

  const actions: RowAction<SaleNote>[] = [
    { label: 'Ver detalle', icon: <Eye className="h-4 w-4" />, onClick: n => { setSelectedNote(n); setDrawerOpen(true); } },
    { label: 'Descargar PDF', icon: <FileDown className="h-4 w-4" />, onClick: n => generateSaleNotePDF(n) },
    { label: 'Generar Factura', icon: <FileCheck className="h-4 w-4" />, onClick: () => toast.info('Facturación próximamente'), separator: true },
  ];

  const updateStatus = (id: string, status: SaleNoteStatus) => {
    setNotes(notes.map(n => n.id === id ? { ...n, status } : n));
    if (selectedNote?.id === id) setSelectedNote({ ...selectedNote!, status });
  };

  const addPayment = () => {
    if (!selectedNote || !newPayment.amount) return;
    const payment: Payment = {
      id: String(Date.now()),
      saleNoteId: selectedNote.id,
      amount: newPayment.amount || 0,
      method: (newPayment.method as PaymentMethod) || 'Transferencia',
      date: newPayment.date || new Date().toISOString().split('T')[0],
      reference: newPayment.reference || '',
    };
    const updatedNote = { ...selectedNote, payments: [...(selectedNote.payments || []), payment] };
    const newBalance = updatedNote.total - getTotalPaid(updatedNote);
    if (newBalance <= 0) updatedNote.status = 'Pagado';
    setSelectedNote(updatedNote);
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    setShowPaymentForm(false);
    setNewPayment({ method: 'Transferencia', amount: 0, reference: '', date: new Date().toISOString().split('T')[0] });
    toast.success('Pago registrado');
  };

  const mobileCard = (n: SaleNote) => (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-heading font-semibold text-sm">{n.number}</span>
        <StatusBadge status={n.status} config={statusConfig} />
      </div>
      <p className="text-sm text-muted-foreground">{n.clientName}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-muted-foreground">{n.date}</span>
        <span className="font-semibold text-sm">${n.total.toLocaleString('es-MX')}</span>
      </div>
    </div>
  );

  return (
    <>
      <DataTableERP<SaleNote>
        title="Notas de Venta"
        kpis={kpis}
        columns={columns}
        data={filters.paginatedData}
        actions={actions}
        statuses={statusConfig}
        statusOptions={['Pendiente', 'Pagado', 'Cancelado']}
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
        onSort={f => filters.toggleSort(f as keyof SaleNote)}
        page={filters.page}
        pageSize={filters.pageSize}
        totalPages={filters.totalPages}
        totalFiltered={filters.totalFiltered}
        onPageChange={filters.setPage}
        onPageSizeChange={s => filters.setPageSize(s as 10 | 20 | 50)}
        onRowClick={n => { setSelectedNote(n); setDrawerOpen(true); }}
        getItemId={n => n.id}
        mobileCardRender={mobileCard}
      />

      {/* Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={o => { setDrawerOpen(o); if (!o) setShowPaymentForm(false); }}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading">{selectedNote?.number}</SheetTitle>
          </SheetHeader>
          {selectedNote && (() => {
            const totalPaid = getTotalPaid(selectedNote);
            const balance = getBalance(selectedNote);
            return (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-muted-foreground">Cliente</p><p className="font-medium">{selectedNote.clientName}</p></div>
                  <div><p className="text-xs text-muted-foreground">Fecha</p><p className="font-medium">{selectedNote.date}</p></div>
                  <div><p className="text-xs text-muted-foreground">Estado</p>
                    <Select value={selectedNote.status} onValueChange={v => updateStatus(selectedNote.id, v as SaleNoteStatus)}>
                      <SelectTrigger className="w-32 h-8 mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{(['Pendiente', 'Pagado', 'Cancelado'] as SaleNoteStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="font-heading font-semibold text-sm mb-2">Productos / Servicios</h4>
                  <Table>
                    <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead className="w-16">Cant.</TableHead><TableHead className="w-28 text-right">P. Unit.</TableHead><TableHead className="w-28 text-right">Subtotal</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {selectedNote.items.map((item, i) => (
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

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-56 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${selectedNote.subtotal.toLocaleString('es-MX')}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>${selectedNote.iva.toLocaleString('es-MX')}</span></div>
                    <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total</span><span>${selectedNote.total.toLocaleString('es-MX')}</span></div>
                  </div>
                </div>

                {/* Payments */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-semibold text-sm flex items-center gap-2"><CreditCard className="h-4 w-4" /> Pagos</h4>
                    {selectedNote.status !== 'Cancelado' && balance > 0 && (
                      <Button size="sm" variant="outline" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Registrar Pago
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Card><CardContent className="py-2 text-center"><p className="text-[10px] text-muted-foreground">Total</p><p className="font-bold font-heading text-sm">${selectedNote.total.toLocaleString('es-MX')}</p></CardContent></Card>
                    <Card><CardContent className="py-2 text-center"><p className="text-[10px] text-muted-foreground">Pagado</p><p className="font-bold font-heading text-sm text-success">${totalPaid.toLocaleString('es-MX')}</p></CardContent></Card>
                    <Card><CardContent className="py-2 text-center"><p className="text-[10px] text-muted-foreground">Saldo</p><p className={`font-bold font-heading text-sm ${balance > 0 ? 'text-warning' : 'text-success'}`}>${balance.toLocaleString('es-MX')}</p></CardContent></Card>
                  </div>

                  {showPaymentForm && (
                    <Card className="mb-4 border-primary/20">
                      <CardContent className="py-3 px-3">
                        <div className="grid gap-2 grid-cols-2">
                          <div className="space-y-1"><Label className="text-[10px]">Monto</Label><Input type="number" value={newPayment.amount || ''} onChange={e => setNewPayment({ ...newPayment, amount: Number(e.target.value) })} className="h-8 text-xs" /></div>
                          <div className="space-y-1"><Label className="text-[10px]">Método</Label>
                            <Select value={newPayment.method} onValueChange={v => setNewPayment({ ...newPayment, method: v as PaymentMethod })}>
                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1"><Label className="text-[10px]">Referencia</Label><Input value={newPayment.reference || ''} onChange={e => setNewPayment({ ...newPayment, reference: e.target.value })} className="h-8 text-xs" /></div>
                          <div className="flex items-end"><Button onClick={addPayment} className="w-full h-8 text-xs">Guardar</Button></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedNote.payments && selectedNote.payments.length > 0 ? (
                    <Table>
                      <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Método</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {selectedNote.payments.map(p => (
                          <TableRow key={p.id}>
                            <TableCell className="py-2">{p.date}</TableCell>
                            <TableCell className="py-2"><Badge variant="secondary" className="text-xs">{p.method}</Badge></TableCell>
                            <TableCell className="py-2 text-right font-medium">${p.amount.toLocaleString('es-MX')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <p className="text-sm text-muted-foreground">Sin pagos registrados</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => generateSaleNotePDF(selectedNote)}><FileDown className="h-4 w-4 mr-2" /> PDF</Button>
                  {selectedNote.status === 'Pagado' && (
                    <Button variant="outline" onClick={() => toast.info('Facturación próximamente')}><FileCheck className="h-4 w-4 mr-2" /> Generar Factura</Button>
                  )}
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </>
  );
}
