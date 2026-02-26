import { Component, OnInit, AfterViewInit, ViewChild, inject, signal, viewChild, ChangeDetectorRef } from '@angular/core';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { Observable } from 'rxjs';

import { CarReportService } from '../../services/car-report.service';
import { ExportService } from '../../services/export.service';
import { ListService } from '../../services/list.service';
import { SavedList } from '../../models/saved-list.model';
import { ArchiveModal } from '../archive-modal/archive-modal';
import { CarReport } from '../../models/car-report.model';
import { ExportToast } from "../export-toast/export-toast";

declare const initFlowbite: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ExportToast
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, AfterViewInit {

  // ViewChildren
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);

  // Observables
  public lists$!: Observable<SavedList[]>;
  public carLists$!: Observable<CarReport[]>;
  public carListLoading$!: Observable<boolean>;

  public carListError$!: Observable<string | null>;

  // Table
  public dataSource = new MatTableDataSource<CarReport>();
  public displayedColumns: string[] = [
    'batch',
    'vin',
    'household',
    'make',
    'model',
    'year',
    'msrp',
    'actions'
  ];

  // Filters
  public filterForm!: FormGroup;
  public yearMin = 1975;
  public yearMax = 2026;
  public priceMin = 5000;
  public priceMax = 350000;

  public yearOptions: Options = { floor: 1975, ceil: 2026, step: 1 };
  public priceOptions: Options = {
    floor: 5000,
    ceil: 350000,
    step: 1000,
    translate: (value: number) => `$${value.toLocaleString()}`
  };

  public usStates: string[] = [];
  public batchOptions: number[] = [];

  // UI
  public isPanelExpanded = false;
  public isShown = signal(false);
  public loading = false;
  public createCSV = false;

  private initialized = false;

  constructor(
    private carReportService: CarReportService,
    private exportService: ExportService,
    private router: Router,
    private listService: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Load data
    this.lists$ = this.listService.lists$;
    this.carLists$ = this.carReportService.carList$;
    this.carListLoading$ = this.carReportService.loading$;
    this.carListError$ = this.carReportService.error$;
    this.carReportService.loadCarReportList();

    // Subscribe to update datasource
    this.carLists$.subscribe(cars => {
      this.dataSource.data = cars || [];
      this.updateFilterOptions();
    });

    // Setup filter form
    this.filterForm = this.fb.group({
      vin: [''],
      make: [''],
      model: [''],
      household: [''],
      batch: ['']
    });

    this.dataSource.filterPredicate = this.createFilter();

    this.filterForm.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit(): void {
    if (!this.initialized) {
      setTimeout(() => initFlowbite(), 0);
      this.initialized = true;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Spinner for paginator
    this.paginator.page.subscribe(() => this.showSpinner());

    // Spinner for sort
    this.sort.sortChange.subscribe(() => this.showSpinner());
  }

  public getStatusClasses(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'action_taken':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  private showSpinner() {
    this.loading = true;
    this.cd.detectChanges(); // force UI update

    // Simulate loading for 400ms
    setTimeout(() => {
      this.loading = false;
      this.cd.detectChanges();
    }, 400);
  }

  togglePanel(): void {
    this.isPanelExpanded = !this.isPanelExpanded;
  }

  public applyFilter(): void {
    this.loading = true;
    setTimeout(() => {
      this.dataSource.filter = JSON.stringify({
        ...this.filterForm.value,
        yearRange: [this.yearMin, this.yearMax],
        priceRange: [this.priceMin, this.priceMax]
      });
      this.loading = false;
    }, 600);
  }

  trackByVin(index: number, item: any) {
    return item.vin; // unique identifier for each row
  }

  public resetFilters(): void {
    this.yearMin = 1975;
    this.yearMax = 2026;
    this.priceMin = 5000;
    this.priceMax = 350000;
    this.filterForm.reset();
    this.applyFilter();
    this.isShown.update((isShown) => !isShown);
  }

  editCar(car: CarReport): void {
    console.log('Editing', car);
  }

  viewCarDetails(id: number): void {
    this.router.navigate(['/vehicle', '1G1YY22G965112345']);
  }

  openArchiveDialog(): void {
    const dialogRef = this.dialog.open(ArchiveModal, {
      autoFocus: false,
      width: '400px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  }

  printPdf() {
    this.exportService.setProcessPDF(true);

    const pages = document.querySelector('.all-pages') as HTMLElement;
    if (pages) {
      this.exportService.exportAllToPDF(pages, 'dashboard', '');
    } else {
      console.error("No element found with .all-pages");
    }
  }

  exportCSV() {
    this.exportService.exportCSV(this.dataSource, this.displayedColumns);
    this.cd.detectChanges(); // force UI update
  }

  private createFilter() {
    return (data: CarReport, filter: string) => {
      const f = JSON.parse(filter);

      return (
        (!f.vin || data.vin?.toLowerCase().includes(f.vin.toLowerCase())) &&
        (!f.make || data.make.toLowerCase().includes(f.make.toLowerCase())) &&
        (!f.model || data.model.toLowerCase().includes(f.model.toLowerCase())) &&
        (!f.household || data.household.toLowerCase().includes(f.household.toLowerCase())) &&
        (data.year >= f.yearRange[0] && data.year <= f.yearRange[1]) &&
        (data.msrp >= f.priceRange[0] && data.msrp <= f.priceRange[1]) &&
        // (!f.licensePlateState || data.licensePlateState === f.licensePlateState) &&
        (!f.batch || data.batch === f.batch)
      );
    };
  }

  private updateFilterOptions(): void {
    const cars = this.dataSource.data;
    // this.usStates = Array.from(new Set(cars.map(c => c.licensePlateState)));
    this.batchOptions = Array.from(new Set(cars.map(c => c.batch)));
  }
}
