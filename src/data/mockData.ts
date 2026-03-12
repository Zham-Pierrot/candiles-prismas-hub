import { Client, Product, Quote, SaleNote, Invoice, Project, InventoryMovement, Payment, ScheduleEvent } from '@/types/admin';

export const mockClients: Client[] = [
  { id: '1', name: 'María García López', phone: '55 1234 5678', email: 'maria@email.com', address: 'Av. Reforma 123, CDMX', type: 'Residencial', notes: 'Cliente frecuente', createdAt: '2025-01-15', followUps: [{ id: 'f1', date: '2025-03-01', note: 'Interesada en candil para comedor', nextAction: 'Enviar cotización actualizada', priority: 'Alta' }], attachments: [{ id: 'a1', name: 'foto_comedor.jpg', date: '2025-02-20', type: 'image' }] },
  { id: '2', name: 'Hotel Grand Palace', phone: '55 9876 5432', email: 'compras@grandpalace.mx', address: 'Blvd. Kukulcán Km 9, Cancún', type: 'Hotel', notes: 'Proyecto de renovación lobby', createdAt: '2025-02-10', followUps: [{ id: 'f2', date: '2025-02-28', note: 'Proyecto de lobby aprobado', nextAction: 'Coordinar instalación', priority: 'Alta' }, { id: 'f3', date: '2025-01-15', note: 'Primera visita técnica', nextAction: 'Enviar propuesta', priority: 'Media' }], attachments: [{ id: 'a2', name: 'planos_lobby.pdf', date: '2025-01-20', type: 'pdf' }, { id: 'a3', name: 'fotos_lobby.zip', date: '2025-02-01', type: 'archive' }] },
  { id: '3', name: 'Restaurante La Hacienda', phone: '33 4567 8901', email: 'gerencia@lahacienda.mx', address: 'Av. Vallarta 1500, Guadalajara', type: 'Restaurante', notes: 'Candiles para salón principal', createdAt: '2025-03-01', followUps: [{ id: 'f4', date: '2025-03-05', note: 'Cotización enviada, esperando respuesta', nextAction: 'Llamar para seguimiento', priority: 'Media' }], attachments: [] },
  { id: '4', name: 'Corporativo Prisma SA', phone: '81 2345 6789', email: 'admin@prisma-corp.mx', address: 'Torre Prisma, Monterrey', type: 'Comercial', notes: 'Oficinas piso 12-15', createdAt: '2025-01-28', followUps: [], attachments: [] },
  { id: '5', name: 'Ana Martínez Ruiz', phone: '55 3456 7890', email: 'ana.martinez@email.com', address: 'Calle Palmas 456, Polanco', type: 'Residencial', notes: '', createdAt: '2025-02-20', followUps: [{ id: 'f5', date: '2025-03-08', note: 'Solicita limpieza de candil', nextAction: 'Programar visita', priority: 'Baja' }], attachments: [] },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Candil Clásico Imperial', description: 'Candil de cristal cortado con 24 brazos, acabado en oro', category: 'Candiles', price: 45000, image: '/placeholder.svg', sku: 'CCI-001', stock: 3, minStock: 2, costPrice: 27000 },
  { id: '2', name: 'Candil Minimalista Prisma', description: 'Diseño moderno con líneas geométricas en acero inoxidable', category: 'Candiles', price: 28000, image: '/placeholder.svg', sku: 'CMP-002', stock: 5, minStock: 3, costPrice: 15400 },
  { id: '3', name: 'Candil Venecia Cristal', description: 'Estilo veneciano con cristales de Murano artesanales', category: 'Candiles', price: 68000, image: '/placeholder.svg', sku: 'CVC-003', stock: 1, minStock: 2, costPrice: 40800 },
  { id: '4', name: 'Lámpara Colgante Diamante', description: 'Lámpara colgante individual con prismas de cristal', category: 'Lámparas', price: 12000, image: '/placeholder.svg', sku: 'LCD-004', stock: 12, minStock: 5, costPrice: 6600 },
  { id: '5', name: 'Servicio de Instalación', description: 'Instalación profesional de candil (incluye materiales)', category: 'Servicios', price: 5000, image: '/placeholder.svg', sku: 'SRV-INS', stock: 999, minStock: 0, costPrice: 2500 },
  { id: '6', name: 'Servicio de Limpieza', description: 'Limpieza profesional de candil cristal (por pieza)', category: 'Servicios', price: 3500, image: '/placeholder.svg', sku: 'SRV-LIM', stock: 999, minStock: 0, costPrice: 1500 },
];

export const mockQuotes: Quote[] = [
  { id: '1', number: 'COT-2025-001', clientId: '2', clientName: 'Hotel Grand Palace', date: '2025-02-15', items: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, unitPrice: 68000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, unitPrice: 5000 }], subtotal: 219000, iva: 35040, total: 254040, status: 'Aceptada' },
  { id: '2', number: 'COT-2025-002', clientId: '1', clientName: 'María García López', date: '2025-03-01', items: [{ productId: '1', productName: 'Candil Clásico Imperial', quantity: 1, unitPrice: 45000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 1, unitPrice: 5000 }], subtotal: 50000, iva: 8000, total: 58000, status: 'Enviada' },
  { id: '3', number: 'COT-2025-003', clientId: '3', clientName: 'Restaurante La Hacienda', date: '2025-03-05', items: [{ productId: '2', productName: 'Candil Minimalista Prisma', quantity: 5, unitPrice: 28000 }, { productId: '4', productName: 'Lámpara Colgante Diamante', quantity: 8, unitPrice: 12000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 13, unitPrice: 5000 }], subtotal: 301000, iva: 48160, total: 349160, status: 'Borrador' },
  { id: '4', number: 'COT-2025-004', clientId: '4', clientName: 'Corporativo Prisma SA', date: '2025-03-10', items: [{ productId: '2', productName: 'Candil Minimalista Prisma', quantity: 10, unitPrice: 28000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 10, unitPrice: 5000 }], subtotal: 330000, iva: 52800, total: 382800, status: 'Enviada' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', saleNoteId: '1', amount: 127020, method: 'Transferencia', date: '2025-02-20', reference: 'TRF-001' },
  { id: 'p2', saleNoteId: '1', amount: 127020, method: 'Transferencia', date: '2025-02-25', reference: 'TRF-002' },
  { id: 'p3', saleNoteId: '2', amount: 4000, method: 'Efectivo', date: '2025-03-08', reference: '' },
];

export const mockSaleNotes: SaleNote[] = [
  { id: '1', number: 'NV-2025-001', quoteId: '1', clientId: '2', clientName: 'Hotel Grand Palace', date: '2025-02-20', items: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, unitPrice: 68000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, unitPrice: 5000 }], subtotal: 219000, iva: 35040, total: 254040, status: 'Pagado', payments: [mockPayments[0], mockPayments[1]] },
  { id: '2', number: 'NV-2025-002', clientId: '5', clientName: 'Ana Martínez Ruiz', date: '2025-03-08', items: [{ productId: '6', productName: 'Servicio de Limpieza', quantity: 2, unitPrice: 3500 }], subtotal: 7000, iva: 1120, total: 8120, status: 'Pendiente', payments: [mockPayments[2]] },
];

export const mockInvoices: Invoice[] = [
  { id: '1', number: 'FAC-2025-001', saleNoteId: '1', clientId: '2', clientName: 'Hotel Grand Palace', rfc: 'HGP851001ABC', razonSocial: 'Hotel Grand Palace SA de CV', regimenFiscal: '601 - General de Ley', usoCfdi: 'G03 - Gastos en general', date: '2025-02-22', items: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, unitPrice: 68000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, unitPrice: 5000 }], subtotal: 219000, iva: 35040, total: 254040 },
];

export const mockProjects: Project[] = [
  { id: '1', clientId: '2', clientName: 'Hotel Grand Palace', type: 'Instalación', location: 'Lobby Principal, Cancún', description: 'Instalación de 3 candiles Venecia en lobby', status: 'En Proceso', startDate: '2025-03-01', endDate: '2025-03-15', products: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, cost: 40800 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, cost: 2500 }], totalCost: 129900, notes: 'Requiere andamio especial para techo de 8m', photos: ['/placeholder.svg'] },
  { id: '2', clientId: '5', clientName: 'Ana Martínez Ruiz', type: 'Limpieza', location: 'Polanco, CDMX', description: 'Limpieza de 2 candiles de cristal', status: 'Planeado', startDate: '2025-03-20', endDate: '2025-03-20', products: [{ productId: '6', productName: 'Servicio de Limpieza', quantity: 2, cost: 1500 }], totalCost: 3000, notes: '', photos: [] },
  { id: '3', clientId: '3', clientName: 'Restaurante La Hacienda', type: 'Remodelación', location: 'Salón Principal, Guadalajara', description: 'Remodelación completa de iluminación', status: 'Planeado', startDate: '2025-04-01', endDate: '2025-04-20', products: [{ productId: '2', productName: 'Candil Minimalista Prisma', quantity: 5, cost: 15400 }, { productId: '4', productName: 'Lámpara Colgante Diamante', quantity: 8, cost: 6600 }], totalCost: 129800, notes: 'Pendiente confirmación de cotización', photos: [] },
];

export const mockInventoryMovements: InventoryMovement[] = [
  { id: 'm1', productId: '3', productName: 'Candil Venecia Cristal', type: 'Salida', quantity: 3, date: '2025-02-20', reference: 'NV-2025-001', notes: 'Venta Hotel Grand Palace' },
  { id: 'm2', productId: '1', productName: 'Candil Clásico Imperial', type: 'Entrada', quantity: 2, date: '2025-02-25', reference: 'OC-2025-001', notes: 'Orden de compra proveedor' },
  { id: 'm3', productId: '4', productName: 'Lámpara Colgante Diamante', type: 'Entrada', quantity: 5, date: '2025-03-01', reference: 'OC-2025-002', notes: 'Reposición de inventario' },
  { id: 'm4', productId: '2', productName: 'Candil Minimalista Prisma', type: 'Ajuste', quantity: -1, date: '2025-03-05', reference: 'AJ-001', notes: 'Pieza dañada en almacén' },
];

export const mockScheduleEvents: ScheduleEvent[] = [
  { id: 'e1', projectId: '1', clientName: 'Hotel Grand Palace', type: 'Instalación', date: '2025-03-10', time: '09:00', status: 'Programado', address: 'Blvd. Kukulcán Km 9, Cancún', notes: 'Llevar andamio especial' },
  { id: 'e2', projectId: '1', clientName: 'Hotel Grand Palace', type: 'Instalación', date: '2025-03-12', time: '09:00', status: 'Programado', address: 'Blvd. Kukulcán Km 9, Cancún', notes: 'Segundo candil' },
  { id: 'e3', clientName: 'María García López', type: 'Visita', date: '2025-03-14', time: '11:00', status: 'Programado', address: 'Av. Reforma 123, CDMX', notes: 'Tomar medidas para cotización' },
  { id: 'e4', projectId: '2', clientName: 'Ana Martínez Ruiz', type: 'Limpieza', date: '2025-03-20', time: '10:00', status: 'Programado', address: 'Calle Palmas 456, Polanco', notes: '' },
  { id: 'e5', clientName: 'Corporativo Prisma SA', type: 'Entrega', date: '2025-03-25', time: '14:00', status: 'Programado', address: 'Torre Prisma, Monterrey', notes: 'Entrega de muestras' },
  { id: 'e6', clientName: 'Hotel Grand Palace', type: 'Instalación', date: '2025-03-15', time: '09:00', status: 'Programado', address: 'Blvd. Kukulcán Km 9, Cancún', notes: 'Tercer candil - finalizar proyecto' },
];

export const dashboardMetrics = {
  ventasMes: 262160,
  ventasMesAnterior: 198000,
  proyectosActivos: 3,
  cotizacionesPendientes: 2,
  cotizacionesEnviadas: 4,
  cotizacionesConvertidas: 1,
  clientesRegistrados: 5,
  clientesNuevosMes: 2,
};

export const salesChartData = [
  { day: '1 Mar', ventas: 0 },
  { day: '5 Mar', ventas: 58000 },
  { day: '8 Mar', ventas: 8120 },
  { day: '10 Mar', ventas: 0 },
  { day: '15 Mar', ventas: 45000 },
  { day: '18 Mar', ventas: 0 },
  { day: '20 Mar', ventas: 120000 },
  { day: '25 Mar', ventas: 31040 },
  { day: '30 Mar', ventas: 0 },
];

export const salesByCategoryData = [
  { category: 'Candiles', ventas: 204000 },
  { category: 'Lámparas', ventas: 36000 },
  { category: 'Servicios', ventas: 22160 },
];

export const monthlySalesData = [
  { month: 'Oct', ventas: 145000 },
  { month: 'Nov', ventas: 178000 },
  { month: 'Dic', ventas: 210000 },
  { month: 'Ene', ventas: 165000 },
  { month: 'Feb', ventas: 198000 },
  { month: 'Mar', ventas: 262160 },
];

export const recentActivity = [
  { id: '1', type: 'venta' as const, description: 'Nota de Venta NV-2025-002 creada', date: '2025-03-08', amount: 8120 },
  { id: '2', type: 'cotizacion' as const, description: 'Cotización COT-2025-003 enviada', date: '2025-03-05', amount: 349160 },
  { id: '3', type: 'proyecto' as const, description: 'Proyecto Hotel Grand Palace iniciado', date: '2025-03-01' },
  { id: '4', type: 'cliente' as const, description: 'Nuevo cliente: Ana Martínez Ruiz', date: '2025-02-20' },
  { id: '5', type: 'venta' as const, description: 'Nota de Venta NV-2025-001 pagada', date: '2025-02-25', amount: 254040 },
];
