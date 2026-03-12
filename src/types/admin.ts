export type UserRole = 'admin' | 'vendedor' | 'instalador' | 'contador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ClientType = 'Residencial' | 'Comercial' | 'Hotel' | 'Restaurante';
export type FollowUpPriority = 'Alta' | 'Media' | 'Baja';

export interface ClientAttachment {
  id: string;
  name: string;
  date: string;
  type: string;
}

export interface ClientFollowUp {
  id: string;
  date: string;
  note: string;
  nextAction: string;
  priority: FollowUpPriority;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: ClientType;
  notes: string;
  createdAt: string;
  followUps?: ClientFollowUp[];
  attachments?: ClientAttachment[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  sku: string;
  stock: number;
  minStock: number;
  costPrice: number;
}

export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada';

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  items: QuoteItem[];
  subtotal: number;
  iva: number;
  total: number;
  status: QuoteStatus;
}

export type SaleNoteStatus = 'Pendiente' | 'Pagado' | 'Cancelado';

export interface SaleNote {
  id: string;
  number: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  date: string;
  items: QuoteItem[];
  subtotal: number;
  iva: number;
  total: number;
  status: SaleNoteStatus;
  payments?: Payment[];
}

export interface Invoice {
  id: string;
  number: string;
  saleNoteId: string;
  clientId: string;
  clientName: string;
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  usoCfdi: string;
  date: string;
  items: QuoteItem[];
  subtotal: number;
  iva: number;
  total: number;
  xmlUrl?: string;
  pdfUrl?: string;
}

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';

export interface Payment {
  id: string;
  saleNoteId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
}

export type ProjectType = 'Instalación' | 'Limpieza' | 'Remodelación';
export type ProjectStatus = 'Planeado' | 'En Proceso' | 'Completado' | 'Cancelado';

export interface ProjectProduct {
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  type: ProjectType;
  location: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  products: ProjectProduct[];
  totalCost: number;
  notes: string;
  photos: string[];
}

export type InventoryMovementType = 'Entrada' | 'Salida' | 'Ajuste';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: InventoryMovementType;
  quantity: number;
  date: string;
  reference: string;
  notes: string;
}

export type ScheduleEventType = 'Instalación' | 'Limpieza' | 'Visita' | 'Entrega';
export type ScheduleEventStatus = 'Programado' | 'Completado' | 'Cancelado';

export interface ScheduleEvent {
  id: string;
  projectId?: string;
  clientName: string;
  type: ScheduleEventType;
  date: string;
  time: string;
  status: ScheduleEventStatus;
  address: string;
  notes: string;
}
