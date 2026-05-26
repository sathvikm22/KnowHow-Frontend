import jsPDF from 'jspdf';
import { ReceiptData } from '@/components/Receipt';

export const generateReceiptPDF = async (receiptData: ReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Load logo image
  let logoData = null;
  try {
    const response = await fetch('/lovable-uploads/know-how-logo.png');
    const blob = await response.blob();
    logoData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.log('Logo not found, using text fallback');
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Set default font to helvetica (standard font in jsPDF)
  doc.setFont('helvetica');

  // Header with Orange Background
  doc.setFillColor(249, 115, 22); // Orange-500
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Logo Circle with Image
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 20, 10, 'F');
  
  // Add logo image if available
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', 17, 12, 16, 16);
    } catch (e) {
      // Fallback to text
      doc.setTextColor(249, 115, 22);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('KH', 21, 23);
    }
  } else {
    // Fallback to text
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('KH', 21, 23);
  }

  // Company Name
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Know', 40, 18);
  doc.setTextColor(255, 237, 213);
  doc.text('How', 60, 18);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Satisfaction My Success', 40, 25);

  // INVOICE Text
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });

  yPos = 50;

  // Invoice Details Section - Better alignment
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice to:', 20, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(receiptData.customerName.toUpperCase(), 20, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let addressY = yPos + 12;
  if (receiptData.customerAddress) {
    const addressLines = doc.splitTextToSize(receiptData.customerAddress, 80);
    doc.text(addressLines, 20, addressY);
    addressY += addressLines.length * 4;
  }
  doc.text(receiptData.customerEmail, 20, addressY);
  doc.text(receiptData.customerPhone, 20, addressY + 5);

  // Invoice Number and Date (Right side) - Better alignment
  const rightStartY = yPos;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Invoice No:', pageWidth - 65, rightStartY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(receiptData.internalBillId, pageWidth - 20, rightStartY, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', pageWidth - 65, rightStartY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(receiptData.date), pageWidth - 20, rightStartY + 5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text('Order ID:', pageWidth - 65, rightStartY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(receiptData.orderId, pageWidth - 20, rightStartY + 10, { align: 'right' });
  if (receiptData.paymentId) {
    doc.setFont('helvetica', 'bold');
    doc.text('Payment ID:', pageWidth - 65, rightStartY + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(receiptData.paymentId, pageWidth - 20, rightStartY + 15, { align: 'right' });
  }

  // Calculate next Y position based on customer info height
  yPos = Math.max(addressY + 12, rightStartY + 18) + 5;

  // Items Table Header - Better alignment
  doc.setFillColor(249, 115, 22);
  doc.rect(20, yPos - 6, pageWidth - 40, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Item Description', 25, yPos - 1);
  doc.text('Unit Price', pageWidth - 75, yPos - 1, { align: 'right' });
  doc.text('Qty', pageWidth - 45, yPos - 1, { align: 'center' });
  doc.text('Total', pageWidth - 20, yPos - 1, { align: 'right' });
  
  // Reset font after header
  doc.setFont('helvetica', 'normal');

  yPos += 2;

  // Items Table Body - Better alignment
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPos += 2;
  
  // Ensure font is set for all text
  doc.setFont('helvetica');

  receiptData.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPos - 1, pageWidth - 40, 7, 'F');
    }
    doc.setTextColor(0, 0, 0);
    const itemNameLines = doc.splitTextToSize(item.name, 100);
    doc.text(itemNameLines, 25, yPos + 3);
    doc.text(formatCurrency(item.unitPrice), pageWidth - 75, yPos + 3, { align: 'right' });
    doc.text(item.quantity.toString(), pageWidth - 45, yPos + 3, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(item.total), pageWidth - 20, yPos + 3, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    yPos += Math.max(7, itemNameLines.length * 4);
  });

  yPos += 10;

  // Summary Section
  let summaryY = yPos;
  const leftColumnX = 20;
  const rightColumnX = pageWidth - 80;

  // Left Column: Terms & Contact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(249, 115, 22);
  doc.text('Terms & Conditions:', leftColumnX, summaryY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  let currentY = summaryY + 6;
  if (receiptData.notes) {
    const notesLines = doc.splitTextToSize(receiptData.notes, 80);
    doc.text(notesLines, leftColumnX, currentY);
    currentY += notesLines.length * 4;
  } else {
    doc.text('Payment received via ' + receiptData.paymentMode + '. Booking confirmed.', leftColumnX, currentY, { maxWidth: 80 });
    currentY += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(249, 115, 22);
  doc.text('Payment Terms:', leftColumnX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Payment received via ' + receiptData.paymentMode + '.', leftColumnX, currentY + 6, { maxWidth: 80 });

  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('knowhowindia.in', leftColumnX, currentY + 16);
  doc.text('knowhowcafe2025@gmail.com', leftColumnX, currentY + 22);
  doc.text('95910 32562', leftColumnX, currentY + 28);
  const addressLines = doc.splitTextToSize('No.716 17th Main, 38th Cross, 4th T Block, Jayanagar, Bangalore - 560041', 80);
  doc.text(addressLines, leftColumnX, currentY + 34);

  // Right Column: Totals - Better alignment
  const totalBoxY = summaryY;
  doc.setFillColor(249, 115, 22);
  doc.roundedRect(rightColumnX - 5, totalBoxY, 70, 10, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GRAND TOTAL', rightColumnX, totalBoxY + 6);
  doc.text(formatCurrency(receiptData.totalAmount), pageWidth - 20, totalBoxY + 6, { align: 'right' });

  // Payment Status - Better alignment
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status: ' + receiptData.paymentStatus, rightColumnX, totalBoxY + 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Payment Mode: ' + receiptData.paymentMode, rightColumnX, totalBoxY + 18, { align: 'right' });
  
  // Reset font
  doc.setFont('helvetica');

  // Footer with Orange Waves
  const footerY = pageHeight - 20;
  doc.setFillColor(249, 115, 22);
  doc.setGState(doc.GState({ opacity: 0.1 }));
  doc.rect(0, footerY, pageWidth, 20, 'F');
  doc.setGState(doc.GState({ opacity: 1 }));

  // Save PDF
  const fileName = `receipt_${receiptData.orderId}.pdf`;
  doc.save(fileName);
};

