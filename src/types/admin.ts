export type UserRole = 'admin' | 'vendedor' | 'instalador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ClientType = 'Residencial' | 'Comercial' | 'Hotel' | 'Restaurante';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: ClientType;
  notes: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  sku: string;
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
