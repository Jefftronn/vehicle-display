import { Component, OnInit, AfterViewInit, ViewChild, inject, viewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { Observable, map, catchError, of, tap } from 'rxjs';

import { CarReportService } from '../../services/car-report.service';
import { ListService } from '../../services/list.service';
import { Automobile, CarRecord } from '../../models/car-record.model';
import { SavedList } from '../../models/saved-list.model';
import { ArchiveModal } from '../archive-modal/archive-modal';

declare const initFlowbite: any; // Flowbite exposes this globally when using CDN

export interface Car {
  make: string;
  model: string;
  year: number;
  price: number;
  titleState: string;
  yearRegistered: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, MatSelectModule, ReactiveFormsModule, NgxSliderModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);
  public lists$!: Observable<SavedList[]>;
  public loading$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  public errorMessage?: string;
  public loading = false;
  public filterForm!: FormGroup;

  public displayedColumns: string[] = [
    'year',
    'make',
    'model',
    'price',
    'titleState',
    'yearRegistered',
    'status',
    'actions',
  ];

  public dataSource = new MatTableDataSource<Car>([
    { "make": "Tesla", "model": "Model S", "year": 2024, "price": 120000, "titleState": "CA", "yearRegistered": 2024 },
    { "make": "BMW", "model": "X5", "year": 2023, "price": 95000, "titleState": "NY", "yearRegistered": 2023 },
    { "make": "Mercedes", "model": "S-Class", "year": 2022, "price": 140000, "titleState": "TX", "yearRegistered": 2022 },
    { "make": "Audi", "model": "Q7", "year": 2021, "price": 85000, "titleState": "FL", "yearRegistered": 2021 },
    { "make": "Porsche", "model": "Cayenne", "year": 2020, "price": 130000, "titleState": "NV", "yearRegistered": 2020 },
    { "make": "Lexus", "model": "RX", "year": 2024, "price": 75000, "titleState": "IL", "yearRegistered": 2024 },
    { "make": "Toyota", "model": "Land Cruiser", "year": 2023, "price": 95000, "titleState": "WA", "yearRegistered": 2023 },
    { "make": "Honda", "model": "Pilot", "year": 2022, "price": 68000, "titleState": "NJ", "yearRegistered": 2022 },
    { "make": "Ford", "model": "F-150", "year": 2024, "price": 85000, "titleState": "OH", "yearRegistered": 2024 },
    { "make": "Chevrolet", "model": "Tahoe", "year": 2023, "price": 92000, "titleState": "MI", "yearRegistered": 2023 },
    { "make": "Nissan", "model": "Rogue", "year": 2021, "price": 65000, "titleState": "GA", "yearRegistered": 2021 },
    { "make": "Hyundai", "model": "Santa Fe", "year": 2020, "price": 62000, "titleState": "NC", "yearRegistered": 2020 },
    { "make": "Kia", "model": "Telluride", "year": 2024, "price": 78000, "titleState": "CO", "yearRegistered": 2024 },
    { "make": "Tesla", "model": "Model Y", "year": 2022, "price": 90000, "titleState": "CA", "yearRegistered": 2022 },
    { "make": "BMW", "model": "7 Series", "year": 2020, "price": 135000, "titleState": "TX", "yearRegistered": 2020 },
    { "make": "Mercedes", "model": "GLE", "year": 2019, "price": 110000, "titleState": "NY", "yearRegistered": 2019 },
    { "make": "Audi", "model": "A6", "year": 2021, "price": 90000, "titleState": "FL", "yearRegistered": 2021 },
    { "make": "Porsche", "model": "Macan", "year": 2022, "price": 125000, "titleState": "CA", "yearRegistered": 2022 },
    { "make": "Lexus", "model": "ES", "year": 2020, "price": 72000, "titleState": "NJ", "yearRegistered": 2020 },
    { "make": "Toyota", "model": "Camry", "year": 2019, "price": 65000, "titleState": "IL", "yearRegistered": 2019 },
    { "make": "Honda", "model": "Civic", "year": 2024, "price": 63000, "titleState": "TX", "yearRegistered": 2024 },
    { "make": "Ford", "model": "Mustang", "year": 2023, "price": 88000, "titleState": "NV", "yearRegistered": 2023 },
    { "make": "Chevrolet", "model": "Silverado", "year": 2022, "price": 95000, "titleState": "GA", "yearRegistered": 2022 },
    { "make": "Nissan", "model": "Altima", "year": 2021, "price": 67000, "titleState": "CA", "yearRegistered": 2021 },
    { "make": "Hyundai", "model": "Tucson", "year": 2020, "price": 62000, "titleState": "FL", "yearRegistered": 2020 },
    { "make": "Kia", "model": "Sportage", "year": 2024, "price": 75000, "titleState": "NC", "yearRegistered": 2024 },
    { "make": "Tesla", "model": "Model X", "year": 2023, "price": 145000, "titleState": "WA", "yearRegistered": 2023 },
    { "make": "BMW", "model": "3 Series", "year": 2022, "price": 85000, "titleState": "CO", "yearRegistered": 2022 },
    { "make": "Mercedes", "model": "C-Class", "year": 2021, "price": 78000, "titleState": "MI", "yearRegistered": 2021 },
    { "make": "Audi", "model": "A4", "year": 2020, "price": 68000, "titleState": "NJ", "yearRegistered": 2020 },
    { "make": "Porsche", "model": "Panamera", "year": 2019, "price": 140000, "titleState": "NY", "yearRegistered": 2019 },
    { "make": "Lexus", "model": "NX", "year": 2022, "price": 78000, "titleState": "OH", "yearRegistered": 2022 },
    { "make": "Toyota", "model": "RAV4", "year": 2021, "price": 65000, "titleState": "TX", "yearRegistered": 2021 },
    { "make": "Honda", "model": "Accord", "year": 2020, "price": 62000, "titleState": "CA", "yearRegistered": 2020 },
    { "make": "Ford", "model": "Explorer", "year": 2019, "price": 72000, "titleState": "WA", "yearRegistered": 2019 },
    { "make": "Chevrolet", "model": "Equinox", "year": 2024, "price": 65000, "titleState": "IL", "yearRegistered": 2024 },
    { "make": "Nissan", "model": "Maxima", "year": 2023, "price": 67000, "titleState": "NV", "yearRegistered": 2023 },
    { "make": "Hyundai", "model": "Sonata", "year": 2022, "price": 62000, "titleState": "NJ", "yearRegistered": 2022 },
    { "make": "Kia", "model": "Optima", "year": 2021, "price": 60000, "titleState": "GA", "yearRegistered": 2021 },
    { "make": "Tesla", "model": "Model 3", "year": 2024, "price": 88000, "titleState": "CA", "yearRegistered": 2024 },
    { "make": "BMW", "model": "5 Series", "year": 2023, "price": 102000, "titleState": "FL", "yearRegistered": 2023 },
    { "make": "Mercedes", "model": "E-Class", "year": 2022, "price": 90000, "titleState": "TX", "yearRegistered": 2022 },
    { "make": "Audi", "model": "Q5", "year": 2021, "price": 82000, "titleState": "NY", "yearRegistered": 2021 },
    { "make": "Porsche", "model": "Cayenne", "year": 2020, "price": 115000, "titleState": "CA", "yearRegistered": 2020 },
    { "make": "Lexus", "model": "LS", "year": 2019, "price": 95000, "titleState": "WA", "yearRegistered": 2019 },
    { "make": "Toyota", "model": "Corolla", "year": 2024, "price": 60000, "titleState": "OH", "yearRegistered": 2024 },
    { "make": "Honda", "model": "CR-V", "year": 2023, "price": 68000, "titleState": "CO", "yearRegistered": 2023 },
    { "make": "Ford", "model": "Fusion", "year": 2022, "price": 62000, "titleState": "NJ", "yearRegistered": 2022 },
    { "make": "Chevrolet", "model": "Cruze", "year": 2021, "price": 60000, "titleState": "MI", "yearRegistered": 2021 },
    { "make": "Nissan", "model": "Pathfinder", "year": 2024, "price": 90000, "titleState": "TX", "yearRegistered": 2024 },
    { "make": "Hyundai", "model": "Ioniq 5", "year": 2023, "price": 95000, "titleState": "FL", "yearRegistered": 2023 },
    { "make": "Kia", "model": "EV6", "year": 2022, "price": 89000, "titleState": "CA", "yearRegistered": 2022 },
    { "make": "Tesla", "model": "Model X", "year": 2021, "price": 145000, "titleState": "WA", "yearRegistered": 2021 },
    { "make": "BMW", "model": "X7", "year": 2020, "price": 135000, "titleState": "NJ", "yearRegistered": 2020 },
    { "make": "Mercedes", "model": "GLS", "year": 2019, "price": 140000, "titleState": "GA", "yearRegistered": 2019 },
    { "make": "Audi", "model": "Q8", "year": 2024, "price": 125000, "titleState": "IL", "yearRegistered": 2024 },
    { "make": "Porsche", "model": "911", "year": 2023, "price": 150000, "titleState": "NV", "yearRegistered": 2023 },
    { "make": "Lexus", "model": "GX", "year": 2022, "price": 96000, "titleState": "TX", "yearRegistered": 2022 },
    { "make": "Toyota", "model": "Highlander", "year": 2021, "price": 70000, "titleState": "FL", "yearRegistered": 2021 },
    { "make": "Honda", "model": "Odyssey", "year": 2020, "price": 65000, "titleState": "CA", "yearRegistered": 2020 },
    { "make": "Ford", "model": "Expedition", "year": 2019, "price": 90000, "titleState": "WA", "yearRegistered": 2019 },
    { "make": "Chevrolet", "model": "Suburban", "year": 2024, "price": 105000, "titleState": "OH", "yearRegistered": 2024 },
    { "make": "Nissan", "model": "Murano", "year": 2023, "price": 75000, "titleState": "CO", "yearRegistered": 2023 },
    { "make": "Hyundai", "model": "Palisa", "year": 2022, "price": 65000, "titleState": "NJ", "yearRegistered": 2022 },
    { "make": "Kia", "model": "Sorento", "year": 2021, "price": 70000, "titleState": "MI", "yearRegistered": 2021 },
    { "make": "Tesla", "model": "Model 3", "year": 2024, "price": 88000, "titleState": "TX", "yearRegistered": 2024 },
    { "make": "BMW", "model": "X6", "year": 2023, "price": 115000, "titleState": "FL", "yearRegistered": 2023 },
    { "make": "Mercedes", "model": "EQS", "year": 2022, "price": 150000, "titleState": "CA", "yearRegistered": 2022 },
    { "make": "Audi", "model": "RS7", "year": 2021, "price": 140000, "titleState": "WA", "yearRegistered": 2021 },
    { "make": "Porsche", "model": "Taycan", "year": 2020, "price": 145000, "titleState": "NJ", "yearRegistered": 2020 },
    { "make": "Lexus", "model": "LC", "year": 2019, "price": 125000, "titleState": "GA", "yearRegistered": 2019 },
    { "make": "Toyota", "model": "Supra", "year": 2024, "price": 90000, "titleState": "IL", "yearRegistered": 2024 },
    { "make": "Honda", "model": "Insight", "year": 2025, "price": 62000, "titleState": "NV", "yearRegistered": 2009 }
  ]);

  public usStates: string[] = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC'
  ];

  public yearsOptions: number[] = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  public yearMin = 2015;
  public yearMax = 2025;
  public priceMin = 25000;
  public priceMax = 150000;

  public yearOptions: Options = {
    floor: 2015,
    ceil: 2025,
    step: 1
  };

  public priceOptions: Options = {
    floor: 25000,
    ceil: 150000,
    step: 1000,
    translate: (value: number): string => {
      return `$${value.toLocaleString()}`;
    }
  };

  // carData$ is an observable of the entire response
  public carData$!: Observable<CarRecord[] | undefined>;
  public isShown = signal(false);

  // automobile$ is an observable of just the first automobile
  public automobile$!: Observable<Automobile[] | undefined>;
  private initialized = false;

  constructor(private carReportService: CarReportService, private router: Router, private listService: ListService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.lists$ = this.listService.lists$;
    this.loading$ = this.listService.loading$;
    this.error$ = this.listService.error$;
    this.fetchCarReports('ZPBUC3ZL2RLA31892');

    this.filterForm = this.fb.group({
      make: [''],
      model: [''],
      titleState: [''],
      yearRegistered: [''],
    });

    const availableStates = [...new Set(this.dataSource.data.map(car => car.titleState))];

    const availableYearsRegistered = [...new Set(this.dataSource.data.map(car => car.yearRegistered))];

    this.usStates = availableStates;
    this.yearsOptions = availableYearsRegistered;

    this.dataSource.filterPredicate = this.createFilter();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  ngAfterViewInit(): void {
    if (!this.initialized) {
      setTimeout(() => initFlowbite(), 0);
      this.initialized = true;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
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
          clone.entities.vehicles.automobiles[0].vin = this.randomVin(baseVin);
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

  createFilter() {
    return (data: Car, filter: string) => {
      const f = JSON.parse(filter);

      const matchMake = !f.make || data.make.toLowerCase().includes(f.make.toLowerCase());
      const matchModel = !f.model || data.model.toLowerCase().includes(f.model.toLowerCase());
      const matchYear = data.year >= f.yearRange[0] && data.year <= f.yearRange[1];
      const matchPrice = data.price >= f.priceRange[0] && data.price <= f.priceRange[1];
      const matchTitleState = !f.titleState || data.titleState === f.titleState;
      const matchYearRegistered = !f.yearRegistered || data.yearRegistered === f.yearRegistered;

      return matchMake && matchModel && matchYear && matchPrice && matchTitleState && matchYearRegistered;
    };
  }

  editCar(car: Car) {
    console.log('Editing', car);
  }

  public applyFilter() {
    this.dataSource.filter = JSON.stringify({
      ...this.filterForm.value,
      yearRange: [this.yearMin, this.yearMax],
      priceRange: [this.priceMin, this.priceMax]
    });
  }

  public viewCarDetails(vin: string) {
    this.router.navigate(['/car', vin])
  }

  public resetFilters() {
    this.filterForm.reset();
    this.yearMin = 2015;
    this.yearMax = 2025;
    this.priceMin = 25000;
    this.priceMax = 150000;
    this.isShown.update((isShown) => !isShown);
  }

  public openArchiveDialog() {
    const dialogRef = this.dialog.open(ArchiveModal, {
      autoFocus: false,
      width: '400px',
      panelClass: 'custom-dialog'
    });

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  }

  private randomVin(baseVin: string): string {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // valid VIN chars
    let randomPart = '';
    while (randomPart.length < 7) {
      const idx = Math.floor(Math.random() * chars.length);
      randomPart += chars[idx];
    }

    // first 8 chars of baseVin
    const prefix = baseVin.slice(0, 8).toUpperCase().replace(/[IOQ]/g, 'X');

    // 9th char = placeholder check digit
    const checkDigit = 'X';

    return (prefix + checkDigit + randomPart).slice(0, 17);
  }
}
