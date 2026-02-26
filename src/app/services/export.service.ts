import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { MatTableDataSource } from "@angular/material/table";
import { CarReport } from "../models/car-report.model";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class ExportService {
  private processCSVSubject = new BehaviorSubject<boolean>(false);
  public processCSV$ = this.processCSVSubject.asObservable();
  private completeCSVSubject = new BehaviorSubject<boolean>(false);
  public completeCSV$ = this.completeCSVSubject.asObservable();

  private processPDFSubject = new BehaviorSubject<boolean>(false);
  public processPDF$ = this.processPDFSubject.asObservable();
  private completePDFSubject = new BehaviorSubject<boolean>(false);
  public completePDF$ = this.completePDFSubject.asObservable();

  constructor() { }

  setProcessPDF(value: boolean): void {
    this.processPDFSubject.next(value);
  }

  exportAllToPDF(pages: HTMLElement, exportingFrom: string, vehicleVin: string) {
    // this.processPDFSubject.next(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 5;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    html2canvas(pages, {
      scale: 2, useCORS: true,
      ignoreElements: (el) => el.classList.contains('no-capture')
    }).then((canvas) => {
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgData = canvas.toDataURL('image/png');

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
      setTimeout(() => {
        this.processPDFSubject.next(false);
        if (exportingFrom === 'dashboard') {
          pdf.save(`noncompliant-vehicle-list.pdf`);
        } else if (exportingFrom === 'details') {
          pdf.save(`noncompliant-vehicle-detail-vin-${vehicleVin}.pdf`);
        }
        this.completePDFSubject.next(true);
      }, 2000);

      setTimeout(() => {
        this.completePDFSubject.next(false);
      }, 3500);
    });
  }

  exportCSV(dataSource: MatTableDataSource<CarReport>, displayedColumns: string[]) {
    this.processCSVSubject.next(true);
    if (!dataSource || dataSource.data.length === 0) return;

    const csvColumns = displayedColumns.filter(col => col !== 'actions');

    // Prepare CSV header
    const header = csvColumns.join(',');

    // Convert each row to CSV string
    const csvRows = dataSource.data.map(row => {
      return displayedColumns
        .map(col => {
          let val = (row as any)[col];  // <-- cast row to any

          // Format price if needed
          if (col === 'price') val = val?.toFixed?.(2) ?? val;

          // Escape commas and quotes
          if (typeof val === 'string') {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(',');
    });

    const csvContent = [header, ...csvRows].join('\r\n');

    setTimeout(() => {
      this.processCSVSubject.next(false);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'noncompliant-vehicle-list.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.completeCSVSubject.next(true);
    }, 2000);

    setTimeout(() => {
      this.completeCSVSubject.next(false);
    }, 3500);
  }
}