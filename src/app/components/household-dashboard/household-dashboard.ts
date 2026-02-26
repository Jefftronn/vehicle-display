import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Household } from '../../models/household.model';
import { Observable } from 'rxjs';
import { HouseholdService } from '../../services/household.service';

@Component({
  selector: 'app-household-dashboard',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, MatIconModule, MatMenuModule,
  ],
  templateUrl: './household-dashboard.html',
  styleUrls: ['./household-dashboard.css'],
})

export class HouseholdDashboard implements OnInit, AfterViewInit {
  public householdLists$!: Observable<Household[]>;
  public householdLoading$!: Observable<boolean>;
  public householdError$!: Observable<string | null>;
  public loading = false;
  public dataSource = new MatTableDataSource<Household>();
  public columnsToDisplay = ['id', 'lastName', 'firstName', 'cars', 'status', 'actions'];
  public columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  private expandedElement?: Household | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private houseHoldService: HouseholdService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.householdLists$ = this.houseHoldService.houseHoldList$;
    this.householdLoading$ = this.houseHoldService.loading$;
    this.householdError$ = this.houseHoldService.error$;
    this.houseHoldService.getHouseHolds();

    // Subscribe to update datasource
    this.householdLists$.subscribe(households => {
      this.dataSource.data = households || [];
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Spinner for paginator
    this.paginator.page.subscribe(() => this.showSpinner());

    // Spinner for sort
    this.sort.sortChange.subscribe(() => this.showSpinner());
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.showSpinner();
  }

  public isExpanded(element: Household) {
    return this.expandedElement === element;
  }

  public toggle(element: Household) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  showSpinner() {
    this.loading = true;
    this.cd.detectChanges(); // force UI update

    // Simulate loading for 400ms
    setTimeout(() => {
      this.loading = false;
      this.cd.detectChanges();
    }, 400);
  }
}