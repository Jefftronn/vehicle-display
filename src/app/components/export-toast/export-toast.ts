import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-export-toast',
  imports: [CommonModule],
  templateUrl: './export-toast.html',
  styleUrl: './export-toast.css'
})
export class ExportToast {
  public processCSV$!: Observable<boolean>;
  public completeCSV$!: Observable<boolean>;
  public processPDF$!: Observable<boolean>;
  public completePDF$!: Observable<boolean>;

  constructor(private exportService: ExportService) { }

  ngOnInit(): void {
    this.processCSV$ = this.exportService.processCSV$;
    this.completeCSV$ = this.exportService.completeCSV$;
    this.processPDF$ = this.exportService.processPDF$;
    this.completePDF$ = this.exportService.completePDF$;
  }
}
