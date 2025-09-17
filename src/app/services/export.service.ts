import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Injectable({
  providedIn: 'root',
})

export class ExportServices {
  constructor() { }

  exportAllToPDF(pages: HTMLElement) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 5;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    html2canvas(pages, { scale: 2, useCORS: true }).then((canvas) => {
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgData = canvas.toDataURL('image/png');

      // Scale factor so the image fits the page width
      const scale = usableWidth / imgWidth;
      const renderHeight = imgHeight * scale;

      let positionY = margin;
      let heightLeft = renderHeight;

      // First page
      pdf.addImage(imgData, 'PNG', margin, positionY, usableWidth, renderHeight);
      heightLeft -= usableHeight;

      // Additional pages
      while (heightLeft > 0) {
        positionY = margin - (renderHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, positionY, usableWidth, renderHeight);
        heightLeft -= usableHeight;
      }

      pdf.save('pdf-export.pdf');
    });
  }
}