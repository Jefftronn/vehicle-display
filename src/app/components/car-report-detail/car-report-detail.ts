import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarReportService } from '../../services/car-report.service';
import { map, Observable } from 'rxjs';
import { Automobile, CarRecord } from '../../models/car-record.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarReportNotes } from '../car-report-notes/car-report-notes';
import { ExportService } from '../../services/export.service';
import html2canvas from 'html2canvas';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ExportToast } from "../export-toast/export-toast";

declare const initFlowbite: any; // Flowbite exposes this globally when using CDN

@Component({
  selector: 'app-car-report-detail',
  imports: [CurrencyPipe, CommonModule, CarReportNotes, MatMenuTrigger, MatMenuModule, ExportToast],
  templateUrl: './car-report-detail.html',
  styleUrl: './car-report-detail.css',
})
export class CarReportDetail implements OnInit {
  public carVin: string = '';
  public loading$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  public fullReport$!: Observable<CarRecord | undefined>;
  public carInfo$!: Observable<Automobile | undefined>;
  public currentFeatImage$?: Observable<string | undefined>;
  public carPlate$!: Observable<CarRecord | undefined>;
  @ViewChild('thumbsContainer', { static: false }) thumbsContainer!: ElementRef<HTMLDivElement>;

  images: string[] = [];
  currentIndex = 0;

  constructor(private route: ActivatedRoute, private carReportService: CarReportService, private exportService: ExportService) { }

  ngOnInit(): void {
    this.loading$ = this.carReportService.loading$;
    this.error$ = this.carReportService.error$;

    const vin = this.route.snapshot.paramMap.get('vin');
    if (vin) {
      this.carVin = vin;
      this.fullReport$ = this.carReportService.getCarReportById(vin);
      this.carPlate$ = this.carReportService.getVinToPlate(vin)
      this.carInfo$ = this.fullReport$.pipe(
        map(report => {
          const auto = report?.entities?.vehicles?.automobiles?.[0];
          this.images = auto?.images?.map(i => i.url) ?? [];
          this.images = [...this.images, ...this.images, ...this.images];
          setTimeout(() => initFlowbite(), 0);
          return auto;
        })
      );
    }
  }

  setCurrent(i: number) {
    this.currentIndex = i;
    this.scrollThumbIntoView(i);
  }

  prev() {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.scrollThumbIntoView(this.currentIndex);
    }
  }

  next() {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.scrollThumbIntoView(this.currentIndex);
    }
  }

  scrollThumbIntoView(index: number) {
    const container = this.thumbsContainer.nativeElement;
    const thumb = container.children[index] as HTMLElement;
    if (thumb) {
      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      // Scroll so that the thumbnail is centered
      const scrollLeft = thumb.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  printPdf() {
    this.exportService.setProcessPDF(true);

    const pages = document.querySelector('.all-pages') as HTMLElement;
    if (pages) {
      this.exportService.exportAllToPDF(pages);
    } else {
      console.error("No element found with .all-pages");
    }
  }
}
