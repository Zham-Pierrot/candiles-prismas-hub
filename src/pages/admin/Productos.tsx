import { useState } from 'react';
import { mockProducts } from '@/data/mockData';
import { Product } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ArrowLeft, DollarSign } from 'lucide-react';

export default function Productos() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (product: Product) => {
    if (isNew) {
      setProducts([...products, { ...product, id: String(Date.now()) }]);
    } else {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    }
    setEditing(null);
    setIsNew(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: '', name: '', description: '', category: 'Candiles', price: 0, image: '/placeholder.svg', sku: '', stock: 0, minStock: 0, costPrice: 0 });
  };

  if (editing) {
    return <ProductForm product={editing} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} isNew={isNew} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Catálogo de Productos</h2>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Nuevo Producto</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o SKU..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setEditing(p)}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="font-heading text-base">{p.name}</CardTitle>
                <Badge variant="secondary">{p.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm font-semibold"><DollarSign className="h-3.5 w-3.5" />{p.price.toLocaleString('es-MX')}</span>
                <span className="text-xs text-muted-foreground font-mono">{p.sku}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel, isNew }: { product: Product; onSave: (p: Product) => void; onCancel: () => void; isNew: boolean }) {
  const [form, setForm] = useState(product);

  return (
    <div className="animate-slide-in-left max-w-2xl">
      <Button variant="ghost" onClick={onCancel} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
      <Card>
        <CardHeader><CardTitle className="font-heading">{isNew ? 'Nuevo Producto' : 'Editar Producto'}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Categoría</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div className="space-y-2"><Label>Precio</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">{isNew ? 'Crear Producto' : 'Guardar Cambios'}</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
