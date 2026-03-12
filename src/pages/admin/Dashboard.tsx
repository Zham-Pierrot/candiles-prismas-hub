import { DollarSign, Briefcase, FileText, Users, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardMetrics, salesChartData, salesByCategoryData, recentActivity } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const growthPercent = ((dashboardMetrics.ventasMes - dashboardMetrics.ventasMesAnterior) / dashboardMetrics.ventasMesAnterior * 100).toFixed(1);
const conversionRate = dashboardMetrics.cotizacionesEnviadas > 0
  ? ((dashboardMetrics.cotizacionesConvertidas / dashboardMetrics.cotizacionesEnviadas) * 100).toFixed(0)
  : '0';

const metrics = [
  { label: 'Ventas del Mes', value: `$${dashboardMetrics.ventasMes.toLocaleString('es-MX')}`, icon: DollarSign, color: 'text-success', sub: `${Number(growthPercent) >= 0 ? '+' : ''}${growthPercent}% vs mes anterior`, subPositive: Number(growthPercent) >= 0 },
  { label: 'Crecimiento Mensual', value: `${Number(growthPercent) >= 0 ? '+' : ''}${growthPercent}%`, icon: TrendingUp, color: 'text-success', sub: `$${dashboardMetrics.ventasMesAnterior.toLocaleString('es-MX')} mes anterior`, subPositive: true },
  { label: 'Cotizaciones Enviadas', value: dashboardMetrics.cotizacionesEnviadas, icon: FileText, color: 'text-primary', sub: `${conversionRate}% tasa de conversión`, subPositive: true },
  { label: 'Cotizaciones Convertidas', value: dashboardMetrics.cotizacionesConvertidas, icon: CheckCircle, color: 'text-success', sub: `de ${dashboardMetrics.cotizacionesEnviadas} enviadas`, subPositive: true },
  { label: 'Nuevos Clientes', value: dashboardMetrics.clientesNuevosMes, icon: UserPlus, color: 'text-primary', sub: `${dashboardMetrics.clientesRegistrados} total registrados`, subPositive: true },
  { label: 'Proyectos Activos', value: dashboardMetrics.proyectosActivos, icon: Briefcase, color: 'text-warning', sub: `${dashboardMetrics.cotizacionesPendientes} cotizaciones pendientes`, subPositive: true },
];

const activityIcons: Record<string, string> = {
  venta: 'text-success',
  cotizacion: 'text-primary',
  proyecto: 'text-warning',
  cliente: 'text-muted-foreground',
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-heading text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{m.label}</CardTitle>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-heading">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {m.subPositive ? <ArrowUpRight className="h-3 w-3 text-success" /> : <ArrowDownRight className="h-3 w-3 text-destructive" />}
                {m.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
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

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="category" className="text-xs" width={80} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']} />
                  <Bar dataKey="ventas" fill="hsl(231, 36%, 46%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${activityIcons[a.type] === 'text-success' ? 'bg-success' : activityIcons[a.type] === 'text-primary' ? 'bg-primary' : activityIcons[a.type] === 'text-warning' ? 'bg-warning' : 'bg-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-medium">{a.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{a.date}</p>
                  </div>
                </div>
                {'amount' in a && a.amount && (
                  <Badge variant="secondary" className="font-mono">${a.amount.toLocaleString('es-MX')}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
