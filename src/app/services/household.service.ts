import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { catchError, finalize, delay } from "rxjs/operators";
import { Household } from '../models/household.model';

@Injectable({
  providedIn: 'root'
})

export class HouseholdService {
  private householdListSubject = new BehaviorSubject<Household[]>([]);
  public houseHoldList$ = this.householdListSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() { }

  public getHouseHolds(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const dummyLists: Household[] = [
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
    ]

    of(dummyLists)
      .pipe(delay(3000)) // simulate network latency
      .subscribe({
        next: lists => this.householdListSubject.next(lists),
        error: err => this.errorSubject.next('Failed to load dummy list'),
        complete: () => this.loadingSubject.next(false),
      });
  }
}
