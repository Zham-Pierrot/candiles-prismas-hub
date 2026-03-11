import { DollarSign, Briefcase, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardMetrics, salesChartData } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const metrics = [
  { label: 'Ventas del Mes', value: `$${dashboardMetrics.ventasMes.toLocaleString('es-MX')}`, icon: DollarSign, color: 'text-success' },
  { label: 'Proyectos Activos', value: dashboardMetrics.proyectosActivos, icon: Briefcase, color: 'text-primary' },
  { label: 'Cotizaciones Pendientes', value: dashboardMetrics.cotizacionesPendientes, icon: FileText, color: 'text-warning' },
  { label: 'Clientes Registrados', value: dashboardMetrics.clientesRegistrados, icon: Users, color: 'text-muted-foreground' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-heading text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-heading">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Ventas — Últimos 30 días</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']} />
                <Line type="monotone" dataKey="ventas" stroke="hsl(231, 36%, 46%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
