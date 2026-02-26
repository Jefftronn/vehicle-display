import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError, of, finalize, delay, tap } from 'rxjs';
import { SavedList } from '../models/saved-list.model';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  private baseUrl = '/api/user-lists'; // <-- your API endpoint
  private listsSubject = new BehaviorSubject<SavedList[]>([]);
  public lists$ = this.listsSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) { }

  public loadUserLists(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    try {

      const dummyLists: SavedList[] = [
        {
          id: 1,
          name: "Saved",
          description: "My favorite cars",
          createdAt: new Date("2024-08-01T10:00:00Z"),
          carIds: [101, 102, 105]
        },
        {
          id: 2,
          name: "SUVs",
          description: "All SUV cars I like",
          createdAt: new Date("2024-08-15T14:30:00Z"),
          carIds: [201, 202, 207, 210]
        },
        {
          id: 3,
          name: "Work Vehicles",
          description: "Trucks for work",
          createdAt: new Date("2024-09-05T08:45:00Z"),
          carIds: [301, 305, 309]
        }
      ];
      // simulate network latency
      setTimeout(() => {
        this.listsSubject.next(dummyLists);
        this.loadingSubject.next(false);
      }, 1000);

    } catch (error: any) {
      this.errorSubject.next("Failed to load lists");
      this.loadingSubject.next(false);
    }



    // 🔹 When hooking up to a real backend:

    // this.loadingSubject.next(true);
    // this.errorSubject.next(null);

    // this.http.get<SavedList[]>(this.baseUrl)
    //   .pipe(
    //     catchError((err: HttpErrorResponse) => {
    //       this.errorSubject.next(err.message || 'Something went wrong');
    //       return throwError(() => err);
    //     }),
    //     finalize(() => this.loadingSubject.next(false))
    //   )
    //   .subscribe(lists => this.listsSubject.next(lists));
  }

  public selectList() {

  }

  public createList(data: any) {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const newList: SavedList = {
      id: Math.floor(Math.random() * 10000), // simulate backend id
      name: data.name || 'Untitled List',
      description: data.description || '',
      createdAt: new Date(),
      carIds: data.carIds || []
    };

    return of(newList).pipe(
      delay(500), // simulate network delay
      tap(list => {
        // Add to current BehaviorSubject value
        const current = this.listsSubject.value;
        this.listsSubject.next([...current, list]);
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorSubject.next(err.message || 'Something went wrong');
        return throwError(() => err);
      }),
      finalize(() => this.loadingSubject.next(false))
    );

    // this.http.post<SavedList[]>(this.baseUrl, data)
    //   .pipe(
    //     catchError((err: HttpErrorResponse) => {
    //       this.errorSubject.next(err.message || 'Something went wrong');
    //       return throwError(() => err);
    //     }),
    //     finalize(() => {
    //       this.loadingSubject.next(false)
    //     }
    //     )
    //   )
  }

  public addCarToList() {

  }

  public removeCarFromList() {

  }

  public deleteList(data: any) {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return of(data).pipe(
      delay(500), // simulate network delay
      tap(() => {
        // Add to current BehaviorSubject value
        const current = this.listsSubject.value;
        const updated = current.filter(list => list.id !== data.id);
        this.listsSubject.next(updated);
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorSubject.next(err.message || 'Something went wrong');
        return throwError(() => err);
      }),
      finalize(() => this.loadingSubject.next(false))
    );

    // this.http.post<SavedList[]>(this.baseUrl, data)
    //   .pipe(
    //     catchError((err: HttpErrorResponse) => {
    //       this.errorSubject.next(err.message || 'Something went wrong');
    //       return throwError(() => err);
    //     }),
    //     finalize(() => {
    //       this.loadingSubject.next(false)
    //     }
    //     )
    //   )
  }

  public updateList(data: any) {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return of(data).pipe(
      delay(500), // simulate network delay
      tap(() => {
        // Add to current BehaviorSubject value
        const current = this.listsSubject.value;
        const updated = current.map(list => list.id === data.id ? { ...list, ...data } : list);
        this.listsSubject.next(updated);
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorSubject.next(err.message || 'Something went wrong');
        return throwError(() => err);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side / network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server Error ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
