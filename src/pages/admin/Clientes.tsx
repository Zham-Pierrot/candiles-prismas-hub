import { useState } from 'react';
import { mockClients, mockQuotes, mockSaleNotes } from '@/data/mockData';
import { Client, ClientType, ClientFollowUp, FollowUpPriority } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, ArrowLeft, Phone, Mail, MapPin, FileText, Clock, Paperclip, AlertCircle } from 'lucide-react';

const clientTypes: ClientType[] = ['Residencial', 'Comercial', 'Hotel', 'Restaurante'];

const typeBadgeClass: Record<ClientType, string> = {
  Residencial: 'bg-primary/10 text-primary',
  Comercial: 'bg-success/10 text-success',
  Hotel: 'bg-warning/10 text-warning',
  Restaurante: 'bg-destructive/10 text-destructive',
};

const priorityBadge: Record<FollowUpPriority, string> = {
  Alta: 'bg-destructive/10 text-destructive',
  Media: 'bg-warning/10 text-warning',
  Baja: 'bg-muted text-muted-foreground',
};

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editing, setEditing] = useState<Client | null>(null);
  const [viewing, setViewing] = useState<Client | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || c.type === filterType;
    return matchSearch && matchType;
  });

  const handleSave = (client: Client) => {
    if (isNew) {
      setClients([...clients, { ...client, id: String(Date.now()), createdAt: new Date().toISOString().split('T')[0] }]);
    } else {
      setClients(clients.map((c) => (c.id === client.id ? client : c)));
    }
    setEditing(null);
    setIsNew(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: '', name: '', phone: '', email: '', address: '', type: 'Residencial', notes: '', createdAt: '', followUps: [], attachments: [] });
  };

  if (editing) {
    return <ClientForm client={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} isNew={isNew} />;
  }

  if (viewing) {
    return <ClientProfile client={viewing} onBack={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />;
  }

  const getHighestPriority = (c: Client): FollowUpPriority | null => {
    if (!c.followUps?.length) return null;
    if (c.followUps.some(f => f.priority === 'Alta')) return 'Alta';
    if (c.followUps.some(f => f.priority === 'Media')) return 'Media';
    return 'Baja';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Clientes</h2>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Nuevo Cliente</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o correo..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {clientTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const priority = getHighestPriority(c);
          return (
            <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewing(c)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="font-heading text-base">{c.name}</CardTitle>
                  <div className="flex items-center gap-1.5">
                    {priority && <Badge className={`${priorityBadge[priority]} text-[10px] px-1.5`}><AlertCircle className="h-3 w-3 mr-0.5" />{priority}</Badge>}
                    <Badge variant="secondary" className={typeBadgeClass[c.type]}>{c.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.email}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{c.address}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ClientProfile({ client, onBack, onEdit }: { client: Client; onBack: () => void; onEdit: () => void }) {
  const clientQuotes = mockQuotes.filter(q => q.clientId === client.id);
  const clientSales = mockSaleNotes.filter(n => n.clientId === client.id);

  return (
    <div className="animate-slide-in-left max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
        <Button onClick={onEdit}>Editar Cliente</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading text-xl">{client.name}</CardTitle>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{client.phone}</span>
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{client.email}</span>
              </div>
            </div>
            <Badge className={typeBadgeClass[client.type]}>{client.type}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
              <TabsTrigger value="archivos">Archivos</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-3 mt-4">
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Dirección:</span> {client.address}</div>
                <div><span className="text-muted-foreground">Tipo:</span> {client.type}</div>
                <div><span className="text-muted-foreground">Registrado:</span> {client.createdAt}</div>
                <div><span className="text-muted-foreground">Notas:</span> {client.notes || 'Sin notas'}</div>
              </div>
            </TabsContent>

            <TabsContent value="historial" className="mt-4 space-y-4">
              <div>
                <h4 className="font-heading font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Cotizaciones ({clientQuotes.length})</h4>
                {clientQuotes.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Número</TableHead><TableHead>Fecha</TableHead><TableHead>Total</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {clientQuotes.map(q => (
                        <TableRow key={q.id}>
                          <TableCell className="font-medium">{q.number}</TableCell>
                          <TableCell>{q.date}</TableCell>
                          <TableCell>${q.total.toLocaleString('es-MX')}</TableCell>
                          <TableCell><Badge variant="secondary">{q.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : <p className="text-sm text-muted-foreground">Sin cotizaciones</p>}
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Notas de Venta ({clientSales.length})</h4>
                {clientSales.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Número</TableHead><TableHead>Fecha</TableHead><TableHead>Total</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {clientSales.map(n => (
                        <TableRow key={n.id}>
                          <TableCell className="font-medium">{n.number}</TableCell>
                          <TableCell>{n.date}</TableCell>
                          <TableCell>${n.total.toLocaleString('es-MX')}</TableCell>
                          <TableCell><Badge variant="secondary">{n.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : <p className="text-sm text-muted-foreground">Sin notas de venta</p>}
              </div>
            </TabsContent>

            <TabsContent value="seguimiento" className="mt-4">
              {client.followUps && client.followUps.length > 0 ? (
                <div className="space-y-3">
                  {client.followUps.map(f => (
                    <Card key={f.id}>
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{f.note}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="h-3 w-3" />{f.date}</p>
                            <p className="text-xs text-muted-foreground mt-1">Próxima acción: {f.nextAction}</p>
                          </div>
                          <Badge className={priorityBadge[f.priority]}>{f.priority}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">Sin seguimiento registrado</p>}
            </TabsContent>

            <TabsContent value="archivos" className="mt-4">
              {client.attachments && client.attachments.length > 0 ? (
                <div className="space-y-2">
                  {client.attachments.map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{a.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">Sin archivos adjuntos</p>}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientForm({ client, onSave, onCancel, isNew }: { client: Client; onSave: (c: Client) => void; onCancel: () => void; isNew: boolean }) {
  const [form, setForm] = useState(client);

  return (
    <div className="animate-slide-in-left max-w-2xl">
      <Button variant="ghost" onClick={onCancel} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">{isNew ? 'Nuevo Cliente' : 'Editar Cliente'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Correo</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ClientType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{clientTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Dirección</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="space-y-2"><Label>Notas</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">{isNew ? 'Crear Cliente' : 'Guardar Cambios'}</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
