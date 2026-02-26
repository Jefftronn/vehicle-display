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
      { id: 1, firstName: 'John', lastName: 'Smith', cars: 2 },
      { id: 2, firstName: 'Sarah', lastName: 'Johnson', cars: 3 },
      { id: 3, firstName: 'Michael', lastName: 'Williams', cars: 1 },
      { id: 4, firstName: 'Emily', lastName: 'Brown', cars: 2 },
      { id: 5, firstName: 'James', lastName: 'Davis', cars: 4 },
      { id: 6, firstName: 'Jessica', lastName: 'Miller', cars: 2 },
      { id: 7, firstName: 'Robert', lastName: 'Wilson', cars: 3 },
      { id: 8, firstName: 'Linda', lastName: 'Moore', cars: 1 },
      { id: 9, firstName: 'William', lastName: 'Taylor', cars: 2 },
      { id: 10, firstName: 'Barbara', lastName: 'Anderson', cars: 4 },
      { id: 11, firstName: 'David', lastName: 'Thomas', cars: 2 },
      { id: 12, firstName: 'Mary', lastName: 'Jackson', cars: 3 },
      { id: 13, firstName: 'Richard', lastName: 'White', cars: 1 },
      { id: 14, firstName: 'Patricia', lastName: 'Harris', cars: 2 },
      { id: 15, firstName: 'Joseph', lastName: 'Martin', cars: 4 },
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
