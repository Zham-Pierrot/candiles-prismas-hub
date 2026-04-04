import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote, SaleNote, Payment } from '@/types/admin';

const COMPANY = {
  name: 'Candiles y Prismas',
  tagline: 'Iluminación y Decoración de Lujo',
  address: 'Av. Paseo de la Reforma 505, Col. Cuauhtémoc, CDMX',
  phone: 'Tel: (55) 1234-5678',
  email: 'ventas@candilesyprismas.mx',
};

function addHeader(doc: jsPDF, title: string, number: string, date: string, clientName: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Company name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY.name, 20, 25);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(COMPANY.tagline, 20, 32);
  doc.text(COMPANY.address, 20, 37);
  doc.text(`${COMPANY.phone}  |  ${COMPANY.email}`, 20, 42);

  // Document title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(title, pageWidth - 20, 25, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`No: ${number}`, pageWidth - 20, 32, { align: 'right' });
  doc.text(`Fecha: ${date}`, pageWidth - 20, 38, { align: 'right' });

  // Divider
  doc.setDrawColor(200);
  doc.line(20, 48, pageWidth - 20, 48);

  // Client
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Cliente:', 20, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(clientName, 50, 57);

  return 65;
}

function formatMXN(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateQuotePDF(quote: Quote) {
  const doc = new jsPDF();
  let y = addHeader(doc, 'COTIZACIÓN', quote.number, quote.date, quote.clientName);

  // Items table
  autoTable(doc, {
    startY: y,
    head: [['#', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
    body: quote.items.map((item, i) => [
      String(i + 1),
      item.productName,
      String(item.quantity),
      formatMXN(item.unitPrice),
      formatMXN(item.quantity * item.unitPrice),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [41, 37, 36], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightX = pageWidth - 20;
  const labelX = rightX - 70;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', labelX, finalY);
  doc.text(formatMXN(quote.subtotal), rightX, finalY, { align: 'right' });

  doc.text('IVA (16%):', labelX, finalY + 6);
  doc.text(formatMXN(quote.iva), rightX, finalY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.line(labelX, finalY + 9, rightX, finalY + 9);
  doc.text('Total:', labelX, finalY + 16);
  doc.text(formatMXN(quote.total), rightX, finalY + 16, { align: 'right' });

  // Terms
  const termsY = finalY + 30;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Condiciones Comerciales:', 20, termsY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  const terms = [
    'Vigencia de la cotización: 30 días naturales.',
    'Tiempo de entrega: 15-20 días hábiles a partir de la confirmación del pedido.',
    'Forma de pago: 50% anticipo, 50% contra entrega.',
    'Los precios incluyen IVA. Instalación cotizada por separado salvo que se indique.',
  ];
  terms.forEach((t, i) => doc.text(`• ${t}`, 20, termsY + 6 + i * 5));

  doc.save(`${quote.number}.pdf`);
}

export function generateSaleNotePDF(saleNote: SaleNote) {
  const doc = new jsPDF();
  let y = addHeader(doc, 'NOTA DE VENTA', saleNote.number, saleNote.date, saleNote.clientName);

  // Items table
  autoTable(doc, {
    startY: y,
    head: [['#', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
    body: saleNote.items.map((item, i) => [
      String(i + 1),
      item.productName,
      String(item.quantity),
      formatMXN(item.unitPrice),
      formatMXN(item.quantity * item.unitPrice),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [41, 37, 36], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 8;
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightX = pageWidth - 20;
  const labelX = rightX - 70;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', labelX, finalY);
  doc.text(formatMXN(saleNote.subtotal), rightX, finalY, { align: 'right' });
  doc.text('IVA (16%):', labelX, finalY + 6);
  doc.text(formatMXN(saleNote.iva), rightX, finalY + 6, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.line(labelX, finalY + 9, rightX, finalY + 9);
  doc.text('Total:', labelX, finalY + 16);
  doc.text(formatMXN(saleNote.total), rightX, finalY + 16, { align: 'right' });

  // Payments section
  const payments = saleNote.payments || [];
  if (payments.length > 0) {
    finalY = finalY + 28;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Pagos Registrados', 20, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      head: [['Fecha', 'Método', 'Referencia', 'Monto']],
      body: payments.map(p => [p.date, p.method, p.reference || '—', formatMXN(p.amount)]),
      theme: 'plain',
      headStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 3: { halign: 'right' } },
      margin: { left: 20, right: 20 },
    });

    const payFinalY = (doc as any).lastAutoTable.finalY + 6;
    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    const balance = saleNote.total - totalPaid;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Pagado:', labelX, payFinalY);
    doc.text(formatMXN(totalPaid), rightX, payFinalY, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text('Saldo Pendiente:', labelX, payFinalY + 6);
    doc.text(formatMXN(balance), rightX, payFinalY + 6, { align: 'right' });
  }

  doc.save(`${saleNote.number}.pdf`);
}
