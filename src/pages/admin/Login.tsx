import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShoppingBag, Wrench } from 'lucide-react';

const roles: { value: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'admin', label: 'Administrador', icon: Shield, desc: 'Acceso completo al sistema' },
  { value: 'vendedor', label: 'Vendedor', icon: ShoppingBag, desc: 'Cotizaciones y ventas' },
  { value: 'instalador', label: 'Instalador', icon: Wrench, desc: 'Proyectos y agenda' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password, selectedRole)) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xl mb-4">
            CP
          </div>
          <h1 className="font-heading text-2xl font-bold">Candiles y Prismas</h1>
          <p className="text-muted-foreground mt-1">Panel de Administración</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Iniciar Sesión</CardTitle>
            <CardDescription>Selecciona tu rol y accede al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all ${
                      selectedRole === r.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <r.icon className={`h-5 w-5 ${selectedRole === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium">{r.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="usuario@candiles.mx" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <Button type="submit" className="w-full font-heading">
                Acceder como {roles.find((r) => r.value === selectedRole)?.label}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Demo: cualquier correo y contraseña funcionan
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
