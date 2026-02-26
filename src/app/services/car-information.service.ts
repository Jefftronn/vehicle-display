import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, of, throwError } from "rxjs";
import { CarMake } from "../models/car-make.model";
import { CarMakeResponse } from "../models/car-make-response.model";

@Injectable({
    providedIn: 'root'
})

export class CarInformationService {
    private apiUrl = 'https://vpic.nhtsa.dot.gov/api'
    private apiMakeUrl = '/vehicles/GetMakesForVehicleType/car?format=json'

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    constructor(private http: HttpClient) {}

    getCarMakes(): Observable<CarMake[]> {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);
        return this.http.get<CarMakeResponse>(this.apiUrl + this.apiMakeUrl).pipe(
            map(response => response.Results),
            catchError(() => {
                this.errorSubject.next('Failed to load car makes');
                return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
        )

    }
}