import { useState } from 'react';
import { mockProducts, mockInventoryMovements } from '@/data/mockData';
import { Product, InventoryMovement, InventoryMovementType } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Package, ArrowUpDown, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Inventario() {
  const [products] = useState<Product[]>(mockProducts.filter(p => p.category !== 'Servicios'));
  const [movements, setMovements] = useState<InventoryMovement[]>(mockInventoryMovements);
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ productId: '', type: 'Entrada' as InventoryMovementType, quantity: 0, reference: '', notes: '' });

  const addMovement = () => {
    if (!adjustForm.productId || adjustForm.quantity <= 0) return;
    const prod = mockProducts.find(p => p.id === adjustForm.productId);
    const mov: InventoryMovement = {
      id: String(Date.now()),
      productId: adjustForm.productId,
      productName: prod?.name || '',
      type: adjustForm.type,
      quantity: adjustForm.type === 'Salida' ? -adjustForm.quantity : adjustForm.quantity,
      date: new Date().toISOString().split('T')[0],
      reference: adjustForm.reference,
      notes: adjustForm.notes,
    };
    setMovements([mov, ...movements]);
    setShowAdjust(false);
    setAdjustForm({ productId: '', type: 'Entrada', quantity: 0, reference: '', notes: '' });
    toast.success('Movimiento registrado');
  };

  const lowStockProducts = products.filter(p => p.stock < p.minStock);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Inventario</h2>
        <Button onClick={() => setShowAdjust(!showAdjust)}><Plus className="h-4 w-4 mr-2" /> Ajuste Manual</Button>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Stock bajo</p>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.map(p => p.name).join(', ')} — por debajo del mínimo requerido.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {showAdjust && (
        <Card className="border-primary/20">
          <CardHeader><CardTitle className="font-heading text-base">Registrar Movimiento</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-5">
              <div className="space-y-1">
                <Label className="text-xs">Producto</Label>
                <Select value={adjustForm.productId} onValueChange={v => setAdjustForm({ ...adjustForm, productId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Select value={adjustForm.type} onValueChange={v => setAdjustForm({ ...adjustForm, type: v as InventoryMovementType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Salida">Salida</SelectItem>
                    <SelectItem value="Ajuste">Ajuste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cantidad</Label>
                <Input type="number" min={1} value={adjustForm.quantity || ''} onChange={e => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Referencia</Label>
                <Input value={adjustForm.reference} onChange={e => setAdjustForm({ ...adjustForm, reference: e.target.value })} />
              </div>
              <div className="flex items-end">
                <Button onClick={addMovement} className="w-full">Guardar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock" className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Stock</TabsTrigger>
          <TabsTrigger value="movimientos" className="flex items-center gap-1"><ArrowUpDown className="h-3.5 w-3.5" /> Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-center">Mínimo</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                    <TableHead className="text-right">Precio Venta</TableHead>
                    <TableHead className="text-right">Margen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(p => {
                    const margin = ((p.price - p.costPrice) / p.price * 100).toFixed(0);
                    const isLow = p.stock < p.minStock;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                        <TableCell className="text-center">
                          <span className={isLow ? 'text-destructive font-bold' : ''}>{p.stock}</span>
                          {isLow && <Badge className="ml-2 bg-destructive/10 text-destructive text-[10px]">Bajo</Badge>}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">{p.minStock}</TableCell>
                        <TableCell className="text-right">${p.costPrice.toLocaleString('es-MX')}</TableCell>
                        <TableCell className="text-right">${p.price.toLocaleString('es-MX')}</TableCell>
                        <TableCell className="text-right font-medium text-success">{margin}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map(m => (
                    <TableRow key={m.id}>
                      <TableCell>{m.date}</TableCell>
                      <TableCell className="font-medium">{m.productName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={m.type === 'Entrada' ? 'bg-success/10 text-success' : m.type === 'Salida' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}>
                          {m.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</TableCell>
                      <TableCell className="font-mono text-xs">{m.reference}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{m.notes}</TableCell>
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
