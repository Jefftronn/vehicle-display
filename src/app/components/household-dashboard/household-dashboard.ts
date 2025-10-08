import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface Household {
  id: number;
  firstName: string;
  lastName: string;
  cars: number;
}

const HOUSEHOLDS: Household[] = [
  { id: 1, firstName: 'Alice', lastName: 'Apple', cars: 2 },
  { id: 2, firstName: 'Bob', lastName: 'Banana', cars: 3, },
  { id: 3, firstName: 'Charlie', lastName: 'Cherry', cars: 1 },
  { id: 4, firstName: 'David', lastName: 'Dragonfruit', cars: 2 },
  { id: 5, firstName: 'Eve', lastName: 'Elderberry', cars: 4 },
  { id: 1, firstName: 'Alice', lastName: 'Apple', cars: 2 },
  { id: 2, firstName: 'Bob', lastName: 'Banana', cars: 3, },
  { id: 3, firstName: 'Charlie', lastName: 'Cherry', cars: 1 },
  { id: 4, firstName: 'David', lastName: 'Dragonfruit', cars: 2 },
  { id: 5, firstName: 'Eve', lastName: 'Elderberry', cars: 4 },
  { id: 1, firstName: 'Alice', lastName: 'Apple', cars: 2 },
  { id: 2, firstName: 'Bob', lastName: 'Banana', cars: 3, },
  { id: 3, firstName: 'Charlie', lastName: 'Cherry', cars: 1 },
  { id: 4, firstName: 'David', lastName: 'Dragonfruit', cars: 2 },
  { id: 5, firstName: 'Eve', lastName: 'Elderberry', cars: 4 },
];

@Component({
  selector: 'app-household-dashboard',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, MatIconModule],
  templateUrl: './household-dashboard.html',
  styleUrls: ['./household-dashboard.css'],
})
export class HouseholdDashboard implements AfterViewInit {
  public dataSource = new MatTableDataSource<Household>(HOUSEHOLDS);
  public columnsToDisplay = ['id', 'lastName', 'firstName', 'cars', 'status', 'actions'];
  public columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  private expandedElement?: Household | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public isExpanded(element: Household) {
    return this.expandedElement === element;
  }

  public toggle(element: Household) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }
}