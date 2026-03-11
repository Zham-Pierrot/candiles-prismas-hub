

## Sistema de Administración — Candiles y Prismas
### Fase 1: Flujo Comercial Principal (UI con datos de ejemplo)

---

### 1. Base del Sistema
- **Layout principal** con barra de navegación lateral fija (íconos + texto al hover), siguiendo la arquitectura de dos columnas del brief
- **Tipografía**: Montserrat para títulos/navegación, Source Sans 3 para cuerpo/datos
- **Paleta de colores**: Off-White (#F9F9F7), Cool Gray (#E8E9ED), Charcoal (#34383C), Deep Indigo (#4A55A2), y acentos de estado (Forest Green, Amber, Terracotta)
- **Ruta base**: `/admin` con sub-rutas para cada módulo

### 2. Dashboard Administrativo (`/admin`)
- Tres métricas grandes: Ventas del Mes, Proyectos Activos, Cotizaciones Pendientes
- Un gráfico lineal de ventas de los últimos 30 días (con Recharts)
- Datos de ejemplo estáticos

### 3. Módulo de Clientes (`/admin/clientes`)
- **Vista de lista** con búsqueda y filtros por tipo (Residencial, Comercial, Hotel, Restaurante)
- **Vista de detalle** de cliente con historial de cotizaciones y notas de venta
- **Crear/Editar cliente**: transición deslizante (lista se desliza a la derecha, formulario entra desde la izquierda) — sin modales
- Campos: Nombre, Teléfono, Correo, Dirección, Tipo, Notas

### 4. Catálogo de Productos (`/admin/productos`)
- Lista de productos con imagen, nombre, categoría, precio, SKU
- Crear/Editar producto con la misma transición deslizante
- Datos de ejemplo: Candil Clásico Imperial, Candil Minimalista Prisma, Servicio de Instalación, etc.

### 5. Sistema de Cotizaciones (`/admin/cotizaciones`)
- **Vista de lista** con estados y filtros
- **Crear cotización**: seleccionar cliente, agregar productos/servicios con cantidad y precio, cálculo automático de subtotal, IVA (16%) y total
- **Vista de detalle** de cotización
- Botón "Convertir a Nota de Venta" con la **animación signature** (la tarjeta se "dobla" y desdobla revelando la nota de venta)
- Preparar botón de descarga PDF (estructura lista)

### 6. Sistema de Notas de Venta (`/admin/notas-venta`)
- Número de nota automático secuencial
- Estados: Pendiente (Amber), Pagado (Forest Green), Cancelado (Terracotta)
- Vista de detalle con datos del cliente, productos y total
- Preparar botón de descarga PDF
- Preparar estructura para futura conversión a factura

### 7. Estructura de Facturación (`/admin/facturacion`)
- UI preparada con campos de factura electrónica (RFC, razón social, régimen fiscal, uso CFDI)
- Botones de descarga XML/PDF (sin funcionalidad real aún)
- Indicación visual de que requiere integración con servicio externo

### 8. Sistema de Autenticación (UI)
- Página de login en `/admin/login`
- Tres roles visuales: Administrador, Vendedor, Instalador
- Navegación adaptada según rol seleccionado (datos de ejemplo, sin backend real)
- Protección de rutas simulada

---

**Nota**: Todo funciona con datos en memoria (mock data). En una fase posterior conectaremos Supabase para persistencia, autenticación real y generación de PDFs.

