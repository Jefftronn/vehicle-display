import { Component, OnInit, AfterViewInit, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CarReportService } from '../../services/car-report.service';
import { Automobile, CarRecord } from '../../models/car-record.model';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ArchiveModal } from '../archive-modal/archive-modal';
import { MatIconModule } from '@angular/material/icon';

declare const initFlowbite: any; // Flowbite exposes this globally when using CDN

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class Dashboard implements OnInit, AfterViewInit {
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);

  public errorMessage?: string;
  public loading = false;

  // carData$ is an observable of the entire response
  public carData$!: Observable<CarRecord[] | undefined>;

  // automobile$ is an observable of just the first automobile
  public automobile$!: Observable<Automobile[] | undefined>;
  private initialized = false;


  constructor(private carReportService: CarReportService, private router: Router) { }

  ngOnInit(): void {
    this.fetchCarReports('ZPBUC3ZL2RLA31892');
  }

  ngAfterViewInit(): void {
    if (!this.initialized) {
      setTimeout(() => initFlowbite(), 0);
      this.initialized = true;
    }
  }

  public fetchCarReports(vin: string) {
    this.loading = true;
    this.errorMessage = undefined;

    this.carData$ = this.carReportService.getCarReports(vin).pipe(
      map(data => {
        this.loading = false; // done loading

        const baseVin = data.entities.vehicles.automobiles[0].vin;

        const cars = Array.from({ length: 10 }, (_, i) => {
          const clone = JSON.parse(JSON.stringify(data));
          clone.entities.vehicles.automobiles[0].vin = this.randomVin(baseVin, i);
          return clone;
        });
        return cars;
      }),
      tap(() => {
        // run after data is transformed but before DOM paint
        setTimeout(() => initFlowbite(), 0);
      }),
      catchError(err => {
        this.loading = false;
        this.errorMessage = err.message;
        return of(undefined);
      })
    );

    this.automobile$ = this.carData$.pipe(
      map(carsArray => carsArray?.map(car => car.entities?.vehicles?.automobiles?.[0]))
    );
  }

  public viewCarDetails(vin: string) {
    this.router.navigate(['/car', vin])
  }

  public openDialog() {
    const dialogRef = this.dialog.open(ArchiveModal, {
      autoFocus: false,
      width: '400px',
      panelClass: 'custom-dialog'
    });

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  }

  private randomVin(baseVin: string, i: number): string {
    // take first 10 chars of base VIN, add 7 random alphanumerics
    const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
    return baseVin.slice(0, 10) + randomPart;
  }
}
