import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote, SaleNote } from '@/types/admin';

// ─── Brand Colors (RGB) ───
const GOLD = { r: 184, g: 143, b: 46 };
const GOLD_LIGHT = { r: 218, g: 190, b: 120 };
const CHARCOAL = { r: 42, g: 38, b: 34 };
const WARM_GRAY = { r: 120, g: 112, b: 100 };
const CREAM_BG = { r: 252, g: 250, b: 245 };

const COMPANY = {
  name: 'CANDILES Y PRISMAS',
  tagline: 'Iluminación y Decoración de Lujo',
  address: 'Av. Paseo de la Reforma 505, Col. Cuauhtémoc, CDMX',
  phone: '(55) 1234-5678',
  email: 'ventas@candilesyprismas.mx',
  website: 'www.candilesyprismas.mx',
};

function setColor(doc: jsPDF, color: { r: number; g: number; b: number }) {
  doc.setTextColor(color.r, color.g, color.b);
}

function setDrawCol(doc: jsPDF, color: { r: number; g: number; b: number }) {
  doc.setDrawColor(color.r, color.g, color.b);
}

function setFillCol(doc: jsPDF, color: { r: number; g: number; b: number }) {
  doc.setFillColor(color.r, color.g, color.b);
}

function drawDecorativeDiamond(doc: jsPDF, cx: number, cy: number, size: number) {
  setFillCol(doc, GOLD);
  const half = size / 2;
  // Draw a small diamond shape
  doc.triangle(cx, cy - half, cx + half, cy, cx, cy + half, 'F');
  doc.triangle(cx, cy - half, cx - half, cy, cx, cy + half, 'F');
}

function addBrandedHeader(doc: jsPDF, title: string, number: string, date: string, clientName: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Top gold accent bar
  setFillCol(doc, GOLD);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Thin secondary line
  setFillCol(doc, GOLD_LIGHT);
  doc.rect(0, 4, pageWidth, 0.5, 'F');

  // Company name with tracking
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  setColor(doc, CHARCOAL);
  doc.text(COMPANY.name, margin, 22);

  // Tagline
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  setColor(doc, GOLD);
  doc.text(COMPANY.tagline, margin, 29);

  // Contact info
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  setColor(doc, WARM_GRAY);
  doc.text(`${COMPANY.address}  ·  Tel: ${COMPANY.phone}`, margin, 35);
  doc.text(`${COMPANY.email}  ·  ${COMPANY.website}`, margin, 40);

  // Document type badge (right side)
  const badgeWidth = 65;
  const badgeX = pageWidth - margin - badgeWidth;
  setFillCol(doc, CHARCOAL);
  doc.roundedRect(badgeX, 12, badgeWidth, 14, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, { r: 255, g: 255, b: 255 });
  doc.text(title, badgeX + badgeWidth / 2, 21, { align: 'center' });

  // Number and date below badge
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, CHARCOAL);
  doc.text(`No: ${number}`, pageWidth - margin, 33, { align: 'right' });
  setColor(doc, WARM_GRAY);
  doc.text(`Fecha: ${date}`, pageWidth - margin, 39, { align: 'right' });

  // Decorative divider with diamond
  const dividerY = 47;
  setDrawCol(doc, GOLD_LIGHT);
  doc.setLineWidth(0.3);
  doc.line(margin, dividerY, pageWidth / 2 - 6, dividerY);
  doc.line(pageWidth / 2 + 6, dividerY, pageWidth - margin, dividerY);
  drawDecorativeDiamond(doc, pageWidth / 2, dividerY, 4);

  // Client info box
  const clientBoxY = 53;
  setFillCol(doc, CREAM_BG);
  doc.roundedRect(margin, clientBoxY, pageWidth - margin * 2, 16, 2, 2, 'F');
  setDrawCol(doc, GOLD_LIGHT);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, clientBoxY, pageWidth - margin * 2, 16, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setColor(doc, GOLD);
  doc.text('CLIENTE', margin + 6, clientBoxY + 7);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, CHARCOAL);
  doc.text(clientName, margin + 6, clientBoxY + 13);

  return clientBoxY + 22;
}

function addBrandedFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const footerY = pageHeight - 20;

  // Decorative line
  setDrawCol(doc, GOLD_LIGHT);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  // Small diamond center
  drawDecorativeDiamond(doc, pageWidth / 2, footerY, 3);

  // Footer text
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  setColor(doc, WARM_GRAY);
  doc.text(COMPANY.name, margin, footerY + 6);
  doc.text(`${COMPANY.phone}  ·  ${COMPANY.email}`, pageWidth - margin, footerY + 6, { align: 'right' });

  // Bottom gold bar
  setFillCol(doc, GOLD);
  doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');
}

function formatMXN(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function drawTotalsBlock(doc: jsPDF, startY: number, subtotal: number, iva: number, total: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const rightX = pageWidth - margin;
  const blockWidth = 85;
  const blockX = rightX - blockWidth;

  let y = startY;

  // Totals background
  setFillCol(doc, CREAM_BG);
  doc.roundedRect(blockX - 5, y - 5, blockWidth + 10, 30, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, WARM_GRAY);
  doc.text('Subtotal:', blockX, y);
  setColor(doc, CHARCOAL);
  doc.text(formatMXN(subtotal), rightX, y, { align: 'right' });

  y += 7;
  setColor(doc, WARM_GRAY);
  doc.text('IVA (16%):', blockX, y);
  setColor(doc, CHARCOAL);
  doc.text(formatMXN(iva), rightX, y, { align: 'right' });

  y += 5;
  setDrawCol(doc, GOLD);
  doc.setLineWidth(0.5);
  doc.line(blockX, y, rightX, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setColor(doc, CHARCOAL);
  doc.text('TOTAL:', blockX, y);
  setColor(doc, GOLD);
  doc.text(formatMXN(total), rightX, y, { align: 'right' });

  return y;
}

export function generateQuotePDF(quote: Quote) {
  const doc = new jsPDF();
  let y = addBrandedHeader(doc, 'COTIZACIÓN', quote.number, quote.date, quote.clientName);

  // Items table with branded styling
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
    theme: 'grid',
    headStyles: {
      fillColor: [CHARCOAL.r, CHARCOAL.g, CHARCOAL.b],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [CHARCOAL.r, CHARCOAL.g, CHARCOAL.b],
      cellPadding: 3.5,
    },
    alternateRowStyles: {
      fillColor: [CREAM_BG.r, CREAM_BG.g, CREAM_BG.b],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    styles: {
      lineColor: [GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b],
      lineWidth: 0.2,
    },
    margin: { left: 20, right: 20 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalsEndY = drawTotalsBlock(doc, finalY, quote.subtotal, quote.iva, quote.total);

  // Terms section
  const termsY = totalsEndY + 16;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Terms header with gold accent
  setFillCol(doc, GOLD);
  doc.rect(margin, termsY - 3, 2, 10, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  setColor(doc, CHARCOAL);
  doc.text('Condiciones Comerciales', margin + 6, termsY + 3);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  setColor(doc, WARM_GRAY);
  const terms = [
    'Vigencia de la cotización: 30 días naturales.',
    'Tiempo de entrega: 15-20 días hábiles a partir de la confirmación del pedido.',
    'Forma de pago: 50% anticipo, 50% contra entrega.',
    'Los precios incluyen IVA. Instalación cotizada por separado salvo que se indique.',
  ];
  terms.forEach((t, i) => {
    drawDecorativeDiamond(doc, margin + 7, termsY + 11 + i * 5.5, 1.5);
    doc.text(t, margin + 12, termsY + 12 + i * 5.5);
  });

  addBrandedFooter(doc);
  doc.save(`${quote.number}.pdf`);
}

export function generateSaleNotePDF(saleNote: SaleNote) {
  const doc = new jsPDF();
  let y = addBrandedHeader(doc, 'NOTA DE VENTA', saleNote.number, saleNote.date, saleNote.clientName);

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
    theme: 'grid',
    headStyles: {
      fillColor: [CHARCOAL.r, CHARCOAL.g, CHARCOAL.b],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [CHARCOAL.r, CHARCOAL.g, CHARCOAL.b],
      cellPadding: 3.5,
    },
    alternateRowStyles: {
      fillColor: [CREAM_BG.r, CREAM_BG.g, CREAM_BG.b],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    styles: {
      lineColor: [GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b],
      lineWidth: 0.2,
    },
    margin: { left: 20, right: 20 },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const rightX = pageWidth - margin;

  drawTotalsBlock(doc, finalY, saleNote.subtotal, saleNote.iva, saleNote.total);

  // Payments section
  const payments = saleNote.payments || [];
  if (payments.length > 0) {
    finalY = (doc as any).lastAutoTable.finalY + 50;

    // Section header with gold accent bar
    setFillCol(doc, GOLD);
    doc.rect(margin, finalY - 3, 2, 10, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    setColor(doc, CHARCOAL);
    doc.text('Pagos Registrados', margin + 6, finalY + 3);

    autoTable(doc, {
      startY: finalY + 8,
      head: [['Fecha', 'Método', 'Referencia', 'Monto']],
      body: payments.map(p => [p.date, p.method, p.reference || '—', formatMXN(p.amount)]),
      theme: 'grid',
      headStyles: {
        fillColor: [GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b],
        textColor: [CHARCOAL.r, CHARCOAL.g, CHARCOAL.b],
        fontSize: 8.5,
        fontStyle: 'bold',
        cellPadding: 3.5,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [CHARCOAL.r, CHARCOAL.g, CHARCOAL.b],
        cellPadding: 3,
      },
      styles: {
        lineColor: [GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b],
        lineWidth: 0.2,
      },
      columnStyles: { 3: { halign: 'right' } },
      margin: { left: 20, right: 20 },
    });

    const payFinalY = (doc as any).lastAutoTable.finalY + 8;
    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    const balance = saleNote.total - totalPaid;

    // Payment summary
    const blockX = rightX - 85;
    setFillCol(doc, CREAM_BG);
    doc.roundedRect(blockX - 5, payFinalY - 4, 95, 18, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    setColor(doc, WARM_GRAY);
    doc.text('Total Pagado:', blockX, payFinalY + 2);
    setColor(doc, CHARCOAL);
    doc.text(formatMXN(totalPaid), rightX, payFinalY + 2, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(doc, balance > 0 ? { r: 180, g: 60, b: 40 } : GOLD);
    doc.text('Saldo Pendiente:', blockX, payFinalY + 10);
    doc.text(formatMXN(balance), rightX, payFinalY + 10, { align: 'right' });
  }

  addBrandedFooter(doc);
  doc.save(`${saleNote.number}.pdf`);
}
