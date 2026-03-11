import { mockInvoices } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function Facturacion() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-heading text-2xl font-bold">Facturación</h2>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Integración pendiente</p>
            <p className="text-sm text-muted-foreground">La facturación electrónica (CFDI) requiere integración con un servicio externo como Facturama, Factura.com o Bind ERP. Esta sección muestra la estructura preparada.</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {mockInvoices.map((inv) => (
          <Card key={inv.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-base">{inv.number}</CardTitle>
                  <CardDescription>{inv.clientName} — {inv.date}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">Timbrada</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 text-sm mb-4">
                <div><span className="text-muted-foreground">RFC:</span> {inv.rfc}</div>
                <div><span className="text-muted-foreground">Razón Social:</span> {inv.razonSocial}</div>
                <div><span className="text-muted-foreground">Régimen Fiscal:</span> {inv.regimenFiscal}</div>
                <div><span className="text-muted-foreground">Uso CFDI:</span> {inv.usoCfdi}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">${inv.total.toLocaleString('es-MX')}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Descarga XML próximamente')}><FileDown className="h-3.5 w-3.5 mr-1" /> XML</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info('Descarga PDF próximamente')}><FileDown className="h-3.5 w-3.5 mr-1" /> PDF</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
