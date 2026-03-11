import { useState } from 'react';
import { mockClients } from '@/data/mockData';
import { Client, ClientType } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';

const clientTypes: ClientType[] = ['Residencial', 'Comercial', 'Hotel', 'Restaurante'];

const typeBadgeClass: Record<ClientType, string> = {
  Residencial: 'bg-primary/10 text-primary',
  Comercial: 'bg-success/10 text-success',
  Hotel: 'bg-warning/10 text-warning',
  Restaurante: 'bg-destructive/10 text-destructive',
};

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editing, setEditing] = useState<Client | null>(null);
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
    setEditing({ id: '', name: '', phone: '', email: '', address: '', type: 'Residencial', notes: '', createdAt: '' });
  };

  if (editing) {
    return <ClientForm client={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} isNew={isNew} />;
  }

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
        {filtered.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setEditing(c)}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="font-heading text-base">{c.name}</CardTitle>
                <Badge variant="secondary" className={typeBadgeClass[c.type]}>{c.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.email}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{c.address}</div>
            </CardContent>
          </Card>
        ))}
      </div>
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
