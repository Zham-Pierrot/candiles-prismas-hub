import { useState } from 'react';
import { mockProjects, mockClients, mockProducts } from '@/data/mockData';
import { Project, ProjectStatus, ProjectType } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, MapPin, Calendar, DollarSign } from 'lucide-react';

const statusStyles: Record<ProjectStatus, string> = {
  Planeado: 'bg-muted text-muted-foreground',
  'En Proceso': 'bg-primary/10 text-primary',
  Completado: 'bg-success/10 text-success',
  Cancelado: 'bg-destructive/10 text-destructive',
};

const statusProgress: Record<ProjectStatus, number> = {
  Planeado: 10,
  'En Proceso': 55,
  Completado: 100,
  Cancelado: 0,
};

const projectTypes: ProjectType[] = ['Instalación', 'Limpieza', 'Remodelación'];

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [viewing, setViewing] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = (p: Project) => {
    if (isNew) {
      setProjects([...projects, { ...p, id: String(Date.now()) }]);
    } else {
      setProjects(projects.map(x => x.id === p.id ? p : x));
    }
    setEditing(null);
    setIsNew(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: '', clientId: '', clientName: '', type: 'Instalación', location: '', description: '', status: 'Planeado', startDate: '', endDate: '', products: [], totalCost: 0, notes: '', photos: [] });
  };

  if (editing) {
    return <ProjectForm project={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} isNew={isNew} />;
  }

  if (viewing) {
    return (
      <div className="animate-slide-in-left max-w-4xl">
        <Button variant="ghost" onClick={() => setViewing(null)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading">{viewing.description}</CardTitle>
              <p className="text-sm text-muted-foreground">{viewing.clientName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusStyles[viewing.status]}>{viewing.status}</Badge>
              <Button size="sm" onClick={() => { setEditing(viewing); setViewing(null); }}>Editar</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{viewing.location}</div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{viewing.startDate} — {viewing.endDate}</div>
              <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" />Costo total: ${viewing.totalCost.toLocaleString('es-MX')}</div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Progreso</p>
              <Progress value={statusProgress[viewing.status]} className="h-2" />
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-2">Productos y Servicios</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead className="w-20">Cant.</TableHead><TableHead className="w-32 text-right">Costo Unit.</TableHead><TableHead className="w-32 text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {viewing.products.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.productName}</TableCell>
                      <TableCell>{p.quantity}</TableCell>
                      <TableCell className="text-right">${p.cost.toLocaleString('es-MX')}</TableCell>
                      <TableCell className="text-right font-medium">${(p.quantity * p.cost).toLocaleString('es-MX')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {viewing.notes && (
              <div>
                <h4 className="font-heading font-semibold mb-1">Notas</h4>
                <p className="text-sm text-muted-foreground">{viewing.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Proyectos</h2>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Nuevo Proyecto</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewing(p)}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="font-heading text-base">{p.description}</CardTitle>
                <Badge className={statusStyles[p.status]}>{p.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{p.clientName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{p.startDate} — {p.endDate}</div>
              <Progress value={statusProgress[p.status]} className="h-1.5" />
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{p.type}</Badge>
                <span className="text-sm font-semibold">${p.totalCost.toLocaleString('es-MX')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ project, onSave, onCancel, isNew }: { project: Project; onSave: (p: Project) => void; onCancel: () => void; isNew: boolean }) {
  const [form, setForm] = useState(project);

  const selectClient = (id: string) => {
    const c = mockClients.find(x => x.id === id);
    if (c) setForm({ ...form, clientId: c.id, clientName: c.name });
  };

  return (
    <div className="animate-slide-in-left max-w-2xl">
      <Button variant="ghost" onClick={onCancel} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
      <Card>
        <CardHeader><CardTitle className="font-heading">{isNew ? 'Nuevo Proyecto' : 'Editar Proyecto'}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={selectClient}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>{mockClients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as ProjectType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{projectTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as ProjectStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(['Planeado', 'En Proceso', 'Completado', 'Cancelado'] as ProjectStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Ubicación</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div className="space-y-2"><Label>Fecha Inicio</Label><Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>Fecha Fin</Label><Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Notas</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">{isNew ? 'Crear Proyecto' : 'Guardar'}</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
