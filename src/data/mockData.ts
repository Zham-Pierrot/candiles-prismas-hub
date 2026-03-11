import { Client, Product, Quote, SaleNote, Invoice } from '@/types/admin';

export const mockClients: Client[] = [
  { id: '1', name: 'María García López', phone: '55 1234 5678', email: 'maria@email.com', address: 'Av. Reforma 123, CDMX', type: 'Residencial', notes: 'Cliente frecuente', createdAt: '2025-01-15' },
  { id: '2', name: 'Hotel Grand Palace', phone: '55 9876 5432', email: 'compras@grandpalace.mx', address: 'Blvd. Kukulcán Km 9, Cancún', type: 'Hotel', notes: 'Proyecto de renovación lobby', createdAt: '2025-02-10' },
  { id: '3', name: 'Restaurante La Hacienda', phone: '33 4567 8901', email: 'gerencia@lahacienda.mx', address: 'Av. Vallarta 1500, Guadalajara', type: 'Restaurante', notes: 'Candiles para salón principal', createdAt: '2025-03-01' },
  { id: '4', name: 'Corporativo Prisma SA', phone: '81 2345 6789', email: 'admin@prisma-corp.mx', address: 'Torre Prisma, Monterrey', type: 'Comercial', notes: 'Oficinas piso 12-15', createdAt: '2025-01-28' },
  { id: '5', name: 'Ana Martínez Ruiz', phone: '55 3456 7890', email: 'ana.martinez@email.com', address: 'Calle Palmas 456, Polanco', type: 'Residencial', notes: '', createdAt: '2025-02-20' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Candil Clásico Imperial', description: 'Candil de cristal cortado con 24 brazos, acabado en oro', category: 'Candiles', price: 45000, image: '/placeholder.svg', sku: 'CCI-001' },
  { id: '2', name: 'Candil Minimalista Prisma', description: 'Diseño moderno con líneas geométricas en acero inoxidable', category: 'Candiles', price: 28000, image: '/placeholder.svg', sku: 'CMP-002' },
  { id: '3', name: 'Candil Venecia Cristal', description: 'Estilo veneciano con cristales de Murano artesanales', category: 'Candiles', price: 68000, image: '/placeholder.svg', sku: 'CVC-003' },
  { id: '4', name: 'Lámpara Colgante Diamante', description: 'Lámpara colgante individual con prismas de cristal', category: 'Lámparas', price: 12000, image: '/placeholder.svg', sku: 'LCD-004' },
  { id: '5', name: 'Servicio de Instalación', description: 'Instalación profesional de candil (incluye materiales)', category: 'Servicios', price: 5000, image: '/placeholder.svg', sku: 'SRV-INS' },
  { id: '6', name: 'Servicio de Limpieza', description: 'Limpieza profesional de candil cristal (por pieza)', category: 'Servicios', price: 3500, image: '/placeholder.svg', sku: 'SRV-LIM' },
];

export const mockQuotes: Quote[] = [
  { id: '1', number: 'COT-2025-001', clientId: '2', clientName: 'Hotel Grand Palace', date: '2025-02-15', items: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, unitPrice: 68000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, unitPrice: 5000 }], subtotal: 219000, iva: 35040, total: 254040, status: 'Aceptada' },
  { id: '2', number: 'COT-2025-002', clientId: '1', clientName: 'María García López', date: '2025-03-01', items: [{ productId: '1', productName: 'Candil Clásico Imperial', quantity: 1, unitPrice: 45000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 1, unitPrice: 5000 }], subtotal: 50000, iva: 8000, total: 58000, status: 'Enviada' },
  { id: '3', number: 'COT-2025-003', clientId: '3', clientName: 'Restaurante La Hacienda', date: '2025-03-05', items: [{ productId: '2', productName: 'Candil Minimalista Prisma', quantity: 5, unitPrice: 28000 }, { productId: '4', productName: 'Lámpara Colgante Diamante', quantity: 8, unitPrice: 12000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 13, unitPrice: 5000 }], subtotal: 301000, iva: 48160, total: 349160, status: 'Borrador' },
];

export const mockSaleNotes: SaleNote[] = [
  { id: '1', number: 'NV-2025-001', quoteId: '1', clientId: '2', clientName: 'Hotel Grand Palace', date: '2025-02-20', items: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, unitPrice: 68000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, unitPrice: 5000 }], subtotal: 219000, iva: 35040, total: 254040, status: 'Pagado' },
  { id: '2', number: 'NV-2025-002', clientId: '5', clientName: 'Ana Martínez Ruiz', date: '2025-03-08', items: [{ productId: '6', productName: 'Servicio de Limpieza', quantity: 2, unitPrice: 3500 }], subtotal: 7000, iva: 1120, total: 8120, status: 'Pendiente' },
];

export const mockInvoices: Invoice[] = [
  { id: '1', number: 'FAC-2025-001', saleNoteId: '1', clientId: '2', clientName: 'Hotel Grand Palace', rfc: 'HGP851001ABC', razonSocial: 'Hotel Grand Palace SA de CV', regimenFiscal: '601 - General de Ley', usoCfdi: 'G03 - Gastos en general', date: '2025-02-22', items: [{ productId: '3', productName: 'Candil Venecia Cristal', quantity: 3, unitPrice: 68000 }, { productId: '5', productName: 'Servicio de Instalación', quantity: 3, unitPrice: 5000 }], subtotal: 219000, iva: 35040, total: 254040 },
];

export const dashboardMetrics = {
  ventasMes: 262160,
  proyectosActivos: 3,
  cotizacionesPendientes: 2,
  clientesRegistrados: 5,
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
