

## Notificaciones + Generación de PDF — Candiles y Prismas

### 1. Módulo de Notificaciones

**Nuevo archivo: `src/components/admin/NotificationCenter.tsx`**

Componente de campana en el header del `AdminLayout.tsx` con dropdown (Popover) que muestra alertas agrupadas por tipo:

- **Stock bajo**: Productos donde `stock < minStock` (badge rojo)
- **Cotizaciones por vencer**: Cotizaciones con status `Enviada` y más de 15 días sin respuesta (badge amarillo)
- **Pagos pendientes**: Notas de venta con status `Pendiente` y saldo > 0 (badge naranja)
- **Eventos próximos**: Eventos de agenda en los próximos 3 días (badge azul)

Cada notificación muestra icono, título, descripción y tiempo relativo. Badge numérico en la campana con total de alertas. Las notificaciones se calculan en tiempo real desde los mock data existentes.

**Modificar: `src/components/admin/AdminLayout.tsx`**
- Agregar icono de campana con NotificationCenter en el header, junto al título.

---

### 2. Generación de PDF (jsPDF + jspdf-autotable)

**Instalar**: `jspdf` y `jspdf-autotable`

**Nuevo archivo: `src/lib/pdfGenerator.ts`**

Utilidad con dos funciones principales:

- `generateQuotePDF(quote, client)` — Genera PDF de cotización con:
  - Header con logo/nombre "Candiles y Prismas", dirección, teléfono
  - Datos del cliente y número de cotización
  - Tabla de productos (producto, cantidad, precio unitario, subtotal)
  - Totales (subtotal, IVA 16%, total)
  - Footer con condiciones comerciales

- `generateSaleNotePDF(saleNote, client, payments)` — Genera PDF de nota de venta con:
  - Mismo header corporativo
  - Datos del cliente y número de nota
  - Tabla de productos
  - Sección de pagos registrados
  - Totales y saldo pendiente

**Modificar: `src/pages/admin/Cotizaciones.tsx`**
- Reemplazar toast placeholder del botón PDF por llamada a `generateQuotePDF()` que descarga el archivo.

**Modificar: `src/pages/admin/NotasVenta.tsx`**
- Reemplazar toast placeholder del botón PDF por llamada a `generateSaleNotePDF()`.

---

### Archivos

| Acción | Archivo |
|--------|---------|
| Instalar | `jspdf`, `jspdf-autotable` |
| Crear | `src/components/admin/NotificationCenter.tsx` |
| Crear | `src/lib/pdfGenerator.ts` |
| Modificar | `src/components/admin/AdminLayout.tsx` |
| Modificar | `src/pages/admin/Cotizaciones.tsx` |
| Modificar | `src/pages/admin/NotasVenta.tsx` |

