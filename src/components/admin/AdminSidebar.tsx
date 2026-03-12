import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Receipt,
  FileCheck,
  LogOut,
  Briefcase,
  Warehouse,
  BarChart3,
  CalendarDays,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/admin';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'General',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, roles: ['admin', 'vendedor', 'contador', 'instalador'] },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { title: 'Clientes', url: '/admin/clientes', icon: Users, roles: ['admin', 'vendedor'] },
      { title: 'Cotizaciones', url: '/admin/cotizaciones', icon: FileText, roles: ['admin', 'vendedor'] },
      { title: 'Notas de Venta', url: '/admin/notas-venta', icon: Receipt, roles: ['admin', 'vendedor'] },
    ],
  },
  {
    label: 'Operación',
    items: [
      { title: 'Productos', url: '/admin/productos', icon: Package, roles: ['admin', 'vendedor'] },
      { title: 'Inventario', url: '/admin/inventario', icon: Warehouse, roles: ['admin'] },
      { title: 'Proyectos', url: '/admin/proyectos', icon: Briefcase, roles: ['admin', 'instalador'] },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { title: 'Facturación', url: '/admin/facturacion', icon: FileCheck, roles: ['admin', 'contador'] },
      { title: 'Reportes', url: '/admin/reportes', icon: BarChart3, roles: ['admin', 'contador'] },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { title: 'Agenda', url: '/admin/agenda', icon: CalendarDays, roles: ['admin', 'instalador'] },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role || 'admin';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-heading font-bold text-sm">
            CP
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-sm">Candiles y Prismas</span>
              <span className="text-xs text-sidebar-foreground/60">ERP PRO</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(item => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink
                          to={item.url}
                          end={item.url === '/admin'}
                          className="hover:bg-sidebar-accent/50"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {user && !collapsed && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
