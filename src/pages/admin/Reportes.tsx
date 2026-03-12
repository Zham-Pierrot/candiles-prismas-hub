import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { monthlySalesData, mockSaleNotes, mockProducts } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Compute sales by client
const salesByClient = mockSaleNotes.reduce<Record<string, { name: string; total: number; count: number }>>((acc, n) => {
  if (!acc[n.clientId]) acc[n.clientId] = { name: n.clientName, total: 0, count: 0 };
  acc[n.clientId].total += n.total;
  acc[n.clientId].count += 1;
  return acc;
}, {});
const salesByClientArr = Object.values(salesByClient).sort((a, b) => b.total - a.total);

// Top products
const productSales = mockSaleNotes.flatMap(n => n.items).reduce<Record<string, { name: string; quantity: number; revenue: number }>>((acc, item) => {
  if (!acc[item.productId]) acc[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
  acc[item.productId].quantity += item.quantity;
  acc[item.productId].revenue += item.quantity * item.unitPrice;
  return acc;
}, {});
const topProductsArr = Object.values(productSales).sort((a, b) => b.revenue - a.revenue);
const topProductsChart = topProductsArr.map(p => ({ name: p.name.length > 20 ? p.name.substring(0, 20) + '…' : p.name, ventas: p.revenue }));

// Profit by product
const profitByProduct = mockProducts.filter(p => p.category !== 'Servicios').map(p => ({
  name: p.name,
  costo: p.costPrice,
  precio: p.price,
  margen: ((p.price - p.costPrice) / p.price * 100).toFixed(1),
  ganancia: p.price - p.costPrice,
}));

export default function Reportes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-heading text-2xl font-bold">Reportes</h2>

      <Tabs defaultValue="ventas-mes">
        <TabsList>
          <TabsTrigger value="ventas-mes">Ventas por Mes</TabsTrigger>
          <TabsTrigger value="ventas-cliente">Por Cliente</TabsTrigger>
          <TabsTrigger value="top-productos">Productos Top</TabsTrigger>
          <TabsTrigger value="ganancias">Ganancias</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas-mes" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="font-heading">Ventas Mensuales</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString('es-MX')}`, 'Ventas']} />
                    <Bar dataKey="ventas" fill="hsl(231, 36%, 46%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ventas-cliente" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="font-heading">Ventas por Cliente</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead className="text-center">Operaciones</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {salesByClientArr.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-center">{c.count}</TableCell>
                      <TableCell className="text-right font-semibold">${c.total.toLocaleString('es-MX')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-productos" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="font-heading">Productos Más Vendidos</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsChart} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" className="text-xs" width={160} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString('es-MX')}`, 'Ingresos']} />
                    <Bar dataKey="ventas" fill="hsl(152, 55%, 33%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ganancias" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="font-heading">Margen de Ganancia por Producto</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead className="text-right">Costo</TableHead><TableHead className="text-right">Precio Venta</TableHead><TableHead className="text-right">Ganancia</TableHead><TableHead className="text-right">Margen</TableHead></TableRow></TableHeader>
                <TableBody>
                  {profitByProduct.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">${p.costo.toLocaleString('es-MX')}</TableCell>
                      <TableCell className="text-right">${p.precio.toLocaleString('es-MX')}</TableCell>
                      <TableCell className="text-right font-semibold text-success">${p.ganancia.toLocaleString('es-MX')}</TableCell>
                      <TableCell className="text-right font-medium">{p.margen}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
