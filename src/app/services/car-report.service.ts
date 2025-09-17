import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { CarRecord } from "../models/car-record.model";

@Injectable({
  providedIn: 'root',
})

export class CarReportService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();
  private baseUrl = 'https://api.bumper.com/sandbox/v1/vehicle/full'; // <-- your API endpoint
  private apiKey = '';
  private baseProxyUrl = '/api-bumper/sandbox/v1/vehicle/full';
  private baseVinToPlateUrl = '/api-bumper/sandbox/v1/vehicle/vin_to_plate'

  constructor(private http: HttpClient) { }

  public getCarReports(vin: string): Observable<CarRecord> {
    const url = `${this.baseProxyUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,        // sending key as header
      'Content-Type': 'application/json'
    });

    const proxyHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CarRecord>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getCarReportById(vin: string): Observable<CarRecord> {
    const url = `${this.baseProxyUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,        // sending key as header
      'Content-Type': 'application/json'
    });

    const proxyHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CarRecord>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getVinToPlate(vin: string): Observable<CarRecord> {
    console.log('working')
    const url = `${this.baseVinToPlateUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,        // sending key as header
      'Content-Type': 'application/json'
    });

    const proxyHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CarRecord>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getCarReportsFromSavedList() {

  }

  public editCarReportStatus() {

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