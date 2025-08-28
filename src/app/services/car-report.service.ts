import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { CarRecord } from "../models/car-record.model";

@Injectable({
  providedIn: 'root',
})

export class CarReportService {
  private baseUrl = 'https://api.bumper.com/sandbox/v1/vehicle/full'; // <-- your API endpoint
  private apiKey = '';
  private baseProxyUrl = '/api-bumper/sandbox/v1/vehicle/full';

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