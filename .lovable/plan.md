

## Candiles y Prismas — Versión PRO (ERP)

Upgrade del sistema actual a una versión ERP completa. Se mantiene la estrategia UI-first con mock data, el mismo design system, y se agregan 6 módulos nuevos + mejoras a los existentes.

---

### 1. Tipos y datos actualizados (`types/admin.ts` + `data/mockData.ts`)

**Tipos nuevos:**
- `Project` — id, clientId, clientName, type (Instalación/Limpieza/Remodelación), location, description, status (Planeado/En Proceso/Completado/Cancelado), startDate, endDate, products (array con productId, quantity, cost), totalCost, notes, photos
- `InventoryMovement` — id, productId, type (Entrada/Salida/Ajuste), quantity, date, reference, notes
- `Payment` — id, saleNoteId, amount, method (Efectivo/Transferencia/Tarjeta/Cheque), date, reference
- `ScheduleEvent` — id, projectId, clientName, type (Instalación/Limpieza/Visita/Entrega), date, time, status (Programado/Completado/Cancelado), address, notes

**Tipos extendidos:**
- `Product` += stock, minStock, costPrice (para margen de ganancia)
- `Client` += commercialFollowUp (last contact date, next action, priority), attachments array
- `UserRole` += `'contador'`

**Mock data expandido** con datos suficientes para todas las vistas.

---

### 2. Dashboard Inteligente (mejorar `Dashboard.tsx`)

6 KPI cards en grid:
- Ventas del Mes + porcentaje de crecimiento vs mes anterior
- Cotizaciones Enviadas / Cotizaciones Convertidas (con tasa de conversión)
- Nuevos Clientes del mes
- Proyectos Activos

Gráfica de ventas existente + nueva gráfica de barras (ventas por categoría).
Sección inferior: lista de actividad reciente (últimas cotizaciones, ventas, proyectos).

---

### 3. CRM Avanzado de Clientes (mejorar `Clientes.tsx`)

Agregar vista de **perfil completo** del cliente con tabs:
- **General** — datos de contacto (existente)
- **Historial** — tabla con cotizaciones y notas de venta del cliente
- **Seguimiento** — notas internas con fecha, próxima acción, prioridad (Alta/Media/Baja)
- **Archivos** — lista de adjuntos con nombre y fecha (mock, sin upload real)

Indicador visual de prioridad de seguimiento en la lista de clientes.

---

### 4. Módulo de Proyectos (`/admin/proyectos` — nuevo)

**Vista lista:** cards con estado, cliente, fechas, barra de progreso.
**Vista detalle/form:**
- Datos generales (cliente, tipo, ubicación, fechas)
- Tabla de productos usados con costos
- Costo total del proyecto
- Galería de fotos (placeholders)
- Timeline de estados

Nuevo archivo: `src/pages/admin/Proyectos.tsx`

---

### 5. Sistema de Inventario (`/admin/inventario` — nuevo)

**Vista principal:** tabla de productos con columnas de stock actual, stock mínimo, costo, precio venta, margen %.
Alertas visuales (badge rojo) cuando stock < minStock.

**Historial de movimientos:** tabla con entradas, salidas y ajustes.
**Botón de ajuste manual** de inventario.

Nuevo archivo: `src/pages/admin/Inventario.tsx`

---

### 6. Registro de Pagos (mejorar `NotasVenta.tsx`)

Agregar sección de pagos dentro del detalle de nota de venta:
- Lista de pagos registrados (monto, método, fecha, referencia)
- Botón "Registrar Pago" con formulario inline
- Indicador de saldo pendiente vs total

---

### 7. Reportes Avanzados (`/admin/reportes` — nuevo)

Dashboard de reportes con tabs:
- **Ventas por Mes** — gráfica de barras (Recharts)
- **Ventas por Cliente** — tabla ordenada por monto total
- **Productos más Vendidos** — gráfica horizontal de barras
- **Ganancias** — tabla con costo, venta, margen por producto

Nuevo archivo: `src/pages/admin/Reportes.tsx`

---

### 8. Agenda de Instalaciones y Entregas (`/admin/agenda` — nuevo)

Vista de calendario mensual simple (grid CSS, sin librería externa).
Cada día muestra eventos programados con color por tipo.
Lista lateral de próximos eventos.
Crear/editar evento con formulario.

Nuevo archivo: `src/pages/admin/Agenda.tsx`

---

### 9. Usuarios y Roles (mejorar `AuthContext.tsx` + `Login.tsx`)

Agregar rol `contador` con acceso a: Dashboard, Facturación, Reportes.
Actualizar sidebar para filtrar nav items según rol:
- **Admin**: todo
- **Vendedor**: Dashboard, Clientes, Productos, Cotizaciones, Notas de Venta
- **Contador**: Dashboard, Facturación, Reportes
- **Instalador**: Dashboard, Proyectos, Agenda

---

### 10. Navegación y Rutas

Actualizar `AdminSidebar.tsx` con items agrupados:
- **Comercial**: Clientes, Cotizaciones, Notas de Venta
- **Operación**: Productos, Inventario, Proyectos
- **Finanzas**: Facturación, Reportes
- **Gestión**: Agenda

Actualizar `App.tsx` con las 4 nuevas rutas: `/admin/proyectos`, `/admin/inventario`, `/admin/reportes`, `/admin/agenda`.

---

### Archivos a crear/modificar

| Acción | Archivo |
|--------|---------|
| Modificar | `src/types/admin.ts` |
| Modificar | `src/data/mockData.ts` |
| Modificar | `src/pages/admin/Dashboard.tsx` |
| Modificar | `src/pages/admin/Clientes.tsx` |
| Modificar | `src/pages/admin/NotasVenta.tsx` |
| Modificar | `src/contexts/AuthContext.tsx` |
| Modificar | `src/components/admin/AdminSidebar.tsx` |
| Modificar | `src/App.tsx` |
| Crear | `src/pages/admin/Proyectos.tsx` |
| Crear | `src/pages/admin/Inventario.tsx` |
| Crear | `src/pages/admin/Reportes.tsx` |
| Crear | `src/pages/admin/Agenda.tsx` |

Todo sigue con mock data. Sin dependencias nuevas (el calendario se construye con CSS grid + date-fns que ya esta instalado).

