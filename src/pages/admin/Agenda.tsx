import { useState } from 'react';
import { mockScheduleEvents } from '@/data/mockData';
import { ScheduleEvent, ScheduleEventType, ScheduleEventStatus } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const eventTypeColors: Record<ScheduleEventType, string> = {
  Instalación: 'bg-primary/80 text-primary-foreground',
  Limpieza: 'bg-success/80 text-success-foreground',
  Visita: 'bg-warning/80 text-warning-foreground',
  Entrega: 'bg-muted text-muted-foreground',
};

const eventTypes: ScheduleEventType[] = ['Instalación', 'Limpieza', 'Visita', 'Entrega'];

export default function Agenda() {
  const [events, setEvents] = useState<ScheduleEvent[]>(mockScheduleEvents);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1)); // March 2025
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({ type: 'Instalación', status: 'Programado', date: '', time: '09:00', clientName: '', address: '', notes: '' });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart); // 0=Sun

  const getEventsForDay = (date: Date) => events.filter(e => isSameDay(new Date(e.date + 'T12:00:00'), date));

  const addEvent = () => {
    if (!newEvent.clientName || !newEvent.date) return;
    const evt: ScheduleEvent = {
      id: String(Date.now()),
      clientName: newEvent.clientName || '',
      type: (newEvent.type as ScheduleEventType) || 'Instalación',
      date: newEvent.date || '',
      time: newEvent.time || '09:00',
      status: 'Programado',
      address: newEvent.address || '',
      notes: newEvent.notes || '',
    };
    setEvents([...events, evt]);
    setShowForm(false);
    setNewEvent({ type: 'Instalación', status: 'Programado', date: '', time: '09:00', clientName: '', address: '', notes: '' });
    toast.success('Evento programado');
  };

  const upcomingEvents = events
    .filter(e => e.status === 'Programado')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Agenda</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? <><X className="h-4 w-4 mr-2" /> Cancelar</> : <><Plus className="h-4 w-4 mr-2" /> Nuevo Evento</>}</Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1"><Label className="text-xs">Cliente</Label><Input value={newEvent.clientName || ''} onChange={e => setNewEvent({ ...newEvent, clientName: e.target.value })} placeholder="Nombre del cliente" /></div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Select value={newEvent.type} onValueChange={v => setNewEvent({ ...newEvent, type: v as ScheduleEventType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs">Fecha</Label><Input type="date" value={newEvent.date || ''} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Hora</Label><Input type="time" value={newEvent.time || ''} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Dirección</Label><Input value={newEvent.address || ''} onChange={e => setNewEvent({ ...newEvent, address: e.target.value })} /></div>
              <div className="flex items-end"><Button onClick={addEvent} className="w-full">Guardar</Button></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <CardTitle className="font-heading capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[80px] bg-muted/30 rounded-sm" />
              ))}
              {days.map(day => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div key={day.toISOString()} className={`min-h-[80px] border border-border rounded-sm p-1 ${isToday(day) ? 'bg-primary/5 border-primary/30' : ''}`}>
                    <span className={`text-xs font-medium ${isToday(day) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{format(day, 'd')}</span>
                    <div className="space-y-0.5 mt-0.5">
                      {dayEvents.slice(0, 2).map(e => (
                        <div key={e.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${eventTypeColors[e.type]}`}>
                          {e.time} {e.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {dayEvents.length > 2 && <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} más</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">Próximos Eventos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map(e => (
              <div key={e.id} className="border-b border-border pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <Badge className={`${eventTypeColors[e.type]} text-[10px]`}>{e.type}</Badge>
                  <span className="text-[10px] text-muted-foreground">{e.date}</span>
                </div>
                <p className="text-sm font-medium mt-1">{e.clientName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</p>
                {e.address && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{e.address}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
