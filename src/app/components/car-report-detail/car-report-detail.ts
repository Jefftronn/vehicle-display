import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarReportService } from '../../services/car-report.service';
import { map, Observable, filter, switchMap, startWith, catchError, of } from 'rxjs';
import { Automobile, CarRecord, VehicleDetail } from '../../models/car-record.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarReportNotes } from '../car-report-notes/car-report-notes';
import { ExportService } from '../../services/export.service';
import html2canvas from 'html2canvas';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ExportToast } from "../export-toast/export-toast";

declare const initFlowbite: any; // Flowbite exposes this globally when using CDN
interface CarState {
  loading: boolean;
  error: string | null;
  car: VehicleDetail | null;
}

@Component({
  selector: 'app-car-report-detail',
  imports: [CurrencyPipe, CommonModule, CarReportNotes, MatMenuTrigger, MatMenuModule, ExportToast],
  templateUrl: './car-report-detail.html',
  styleUrl: './car-report-detail.css',
})
export class CarReportDetail implements OnInit {
  public carId: string = '';
  public loading$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  public fullReport$!: Observable<CarRecord | undefined>;
  public carInfo?: VehicleDetail | null;
  public carState$: Observable<CarState>;
  public currentFeatImage$?: Observable<string | undefined>;
  public carPlate$!: Observable<CarRecord | undefined>;
  @ViewChild('thumbsContainer', { static: false }) thumbsContainer!: ElementRef<HTMLDivElement>;

  images: string[] = [];
  currentIndex = 0;

  constructor(private route: ActivatedRoute, private carReportService: CarReportService, private exportService: ExportService) {
    this.carState$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of({ loading: false, error: 'No car ID provided', car: null });
        }

        return this.carReportService.getCarReportByVin(id).pipe(
          map(car => ({ loading: false, error: null, car })),
          startWith({ loading: true, error: null, car: null }),
          catchError(err => of({ loading: false, error: 'Failed to load car info', car: null }))
        );
      })
    );
  }

  ngOnInit(): void {
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

  printPdf(vin: string) {
    this.exportService.setProcessPDF(true);

    const pages = document.querySelector('.all-pages') as HTMLElement;
    if (pages) {
      this.exportService.exportAllToPDF(pages, "details", vin);
    } else {
      console.error("No element found with .all-pages");
    }
  }
}
