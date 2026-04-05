

## Optimización ERP — Cotizaciones y Notas de Venta

Transformar ambas secciones de tarjetas simples a vistas profesionales tipo ERP (inspiración Stripe/HubSpot), con tabla, búsqueda, filtros, paginación, acciones rápidas, drawer de detalle y KPIs resumidos.

---

### Arquitectura: Componente compartido `DataTableERP`

Crear un componente reutilizable `src/components/admin/DataTableERP.tsx` que encapsule la lógica común de ambas vistas:

- **KPI summary bar** — Cards compactas arriba (total registros, pendientes, pagadas, monto total)
- **Search bar** — Input con debounce (300ms) que filtra por folio, cliente
- **Filter bar** — Dropdowns para: Estado, Rango de fecha (Hoy/Semana/Mes/3 Meses/Custom), Cliente
- **Sortable table** — Columnas clickeables (Folio, Cliente, Fecha, Total, Estado) con indicador asc/desc
- **Status badges** — Colores refinados: Borrador (gray), Enviada (blue), Aceptada (purple), Rechazada/Cancelado (red), Pendiente (amber), Pagado (green)
- **Row actions menu** — DropdownMenu con: Ver detalle, Editar, PDF, Enviar, Cambiar estado, Convertir
- **Pagination** — Selector de 10/20/50 por página, navegación de páginas, indicador "Mostrando X-Y de Z"
- **Responsive** — En mobile (<768px), colapsar tabla a cards compactas con swipe actions

### Archivos a crear/modificar

| Acción | Archivo |
|--------|---------|
| Crear | `src/components/admin/DataTableERP.tsx` — Componente genérico con search, filters, sort, pagination |
| Crear | `src/hooks/useTableFilters.ts` — Hook custom con estado de búsqueda, filtros, ordenamiento, paginación y debounce |
| Reescribir | `src/pages/admin/Cotizaciones.tsx` — Usar DataTableERP + drawer lateral para detalle/edición |
| Reescribir | `src/pages/admin/NotasVenta.tsx` — Usar DataTableERP + drawer lateral para detalle con pagos |
| Modificar | `src/data/mockData.ts` — Expandir a ~30 cotizaciones y ~20 notas de venta para demostrar paginación |

### Detalle por vista

**Cotizaciones:**
- KPIs: Total cotizaciones, Enviadas, Aceptadas, Monto total
- Drawer lateral (Sheet) al hacer click: muestra detalle completo con productos, totales, historial, y acciones (PDF, Enviar, Convertir a NV)
- Formulario de creación/edición mantiene el diseño actual pero dentro del drawer
- Acción rápida "Convertir a Nota de Venta" desde menú de fila

**Notas de Venta:**
- KPIs: Total notas, Pendientes, Pagadas, Monto cobrado
- Drawer lateral con detalle, productos, sección de pagos y registro de pago inline
- Acción rápida "Generar Factura" desde menú de fila

### Hook `useTableFilters`

```text
Estado:
  - search: string (debounced 300ms)
  - statusFilter: string | 'all'
  - dateFilter: 'all' | 'today' | 'week' | 'month' | '3months'
  - clientFilter: string | 'all'
  - sortField: string
  - sortDirection: 'asc' | 'desc'
  - page: number
  - pageSize: 10 | 20 | 50
  - filteredData: T[] (computed)
  - paginatedData: T[] (computed)
  - totalPages: number
```

Toda la lógica de filtrado, ordenamiento y paginación se calcula con `useMemo` para evitar re-renders innecesarios. El debounce usa `useEffect` + `setTimeout`.

### Mock data expandido

Generar ~30 cotizaciones y ~20 notas de venta con fechas variadas (Enero-Marzo 2025), distintos estados y clientes, para que la paginación y filtros sean demostrables.

### Diseño visual

- Tabla con `hover:bg-muted/30`, bordes sutiles, filas compactas (padding `py-2.5 px-4`)
- Badges con colores del design system existente (Deep Indigo, Forest Green, Amber, Terracotta)
- Search bar con icono de lupa, bordes redondeados, focus ring indigo
- Filtros como pills/dropdowns inline, no modal
- Drawer (Sheet) desde la derecha, ancho 600px en desktop

