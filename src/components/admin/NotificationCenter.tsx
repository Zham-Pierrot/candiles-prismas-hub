import { useState, useMemo } from 'react';
import { Bell, Package, FileText, DollarSign, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockProducts, mockQuotes, mockSaleNotes, mockScheduleEvents } from '@/data/mockData';
import { differenceInDays, parseISO, isAfter, addDays } from 'date-fns';

interface Notification {
  id: string;
  type: 'stock' | 'cotizacion' | 'pago' | 'evento';
  title: string;
  description: string;
  icon: typeof Bell;
  colorClass: string;
}

const typeConfig = {
  stock: { icon: Package, color: 'bg-destructive/10 text-destructive', label: 'Stock Bajo' },
  cotizacion: { icon: FileText, color: 'bg-warning/10 text-warning', label: 'Cotización' },
  pago: { icon: DollarSign, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', label: 'Pago' },
  evento: { icon: Calendar, color: 'bg-primary/10 text-primary', label: 'Evento' },
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    const today = new Date();
    const items: Notification[] = [];

    // Stock bajo
    mockProducts.forEach(p => {
      if (p.stock < p.minStock) {
        items.push({
          id: `stock-${p.id}`,
          type: 'stock',
          title: `Stock bajo: ${p.name}`,
          description: `${p.stock} unidades (mín: ${p.minStock})`,
          icon: typeConfig.stock.icon,
          colorClass: typeConfig.stock.color,
        });
      }
    });

    // Cotizaciones por vencer (Enviada > 15 días)
    mockQuotes.forEach(q => {
      if (q.status === 'Enviada') {
        const days = differenceInDays(today, parseISO(q.date));
        if (days > 15) {
          items.push({
            id: `quote-${q.id}`,
            type: 'cotizacion',
            title: `Cotización ${q.number} sin respuesta`,
            description: `Enviada hace ${days} días a ${q.clientName}`,
            icon: typeConfig.cotizacion.icon,
            colorClass: typeConfig.cotizacion.color,
          });
        }
      }
    });

    // Pagos pendientes
    mockSaleNotes.forEach(n => {
      if (n.status === 'Pendiente') {
        const paid = (n.payments || []).reduce((s, p) => s + p.amount, 0);
        const balance = n.total - paid;
        if (balance > 0) {
          items.push({
            id: `payment-${n.id}`,
            type: 'pago',
            title: `Pago pendiente: ${n.number}`,
            description: `Saldo: $${balance.toLocaleString('es-MX')} — ${n.clientName}`,
            icon: typeConfig.pago.icon,
            colorClass: typeConfig.pago.color,
          });
        }
      }
    });

    // Eventos próximos (3 días)
    const limit = addDays(today, 3);
    mockScheduleEvents.forEach(e => {
      if (e.status === 'Programado') {
        const eventDate = parseISO(e.date);
        if (isAfter(eventDate, today) && !isAfter(eventDate, limit)) {
          items.push({
            id: `event-${e.id}`,
            type: 'evento',
            title: `${e.type}: ${e.clientName}`,
            description: `${e.date} a las ${e.time}`,
            icon: typeConfig.evento.icon,
            colorClass: typeConfig.evento.color,
          });
        }
      }
    });

    return items;
  }, []);

  const visible = notifications.filter(n => !dismissed.has(n.id));
  const count = visible.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-heading font-semibold text-sm">Notificaciones</h4>
          {count > 0 && (
            <Badge variant="secondary" className="text-xs">{count}</Badge>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Sin notificaciones</p>
          ) : (
            <div className="divide-y">
              {visible.map(n => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className={`mt-0.5 rounded-full p-1.5 ${n.colorClass}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => { e.stopPropagation(); setDismissed(prev => new Set(prev).add(n.id)); }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
