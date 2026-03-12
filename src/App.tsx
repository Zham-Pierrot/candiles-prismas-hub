import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Clientes from "@/pages/admin/Clientes";
import Productos from "@/pages/admin/Productos";
import Cotizaciones from "@/pages/admin/Cotizaciones";
import NotasVenta from "@/pages/admin/NotasVenta";
import Facturacion from "@/pages/admin/Facturacion";
import Proyectos from "@/pages/admin/Proyectos";
import Inventario from "@/pages/admin/Inventario";
import Reportes from "@/pages/admin/Reportes";
import Agenda from "@/pages/admin/Agenda";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="productos" element={<Productos />} />
              <Route path="cotizaciones" element={<Cotizaciones />} />
              <Route path="notas-venta" element={<NotasVenta />} />
              <Route path="facturacion" element={<Facturacion />} />
              <Route path="proyectos" element={<Proyectos />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="agenda" element={<Agenda />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
